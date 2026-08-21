import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrmLead, CrmLeadDocument, LeadStage } from './schemas/crm-lead.schema';
import { CrmFollowUp, CrmFollowUpDocument, FollowUpStatus } from './schemas/crm-followup.schema';
import { CrmCallLog, CrmCallLogDocument } from './schemas/crm-calllog.schema';

@Injectable()
export class MatrimonyCrmService {
  constructor(
    @InjectModel(CrmLead.name) private readonly leadModel: Model<CrmLeadDocument>,
    @InjectModel(CrmFollowUp.name) private readonly followUpModel: Model<CrmFollowUpDocument>,
    @InjectModel(CrmCallLog.name) private readonly callLogModel: Model<CrmCallLogDocument>,
  ) {}

  // ── Leads ─────────────────────────────────────────────────────────────────
  async createLead(data: Partial<CrmLead>, actor: string) {
    return this.leadModel.create({ ...data, assigned_to: actor });
  }

  async listLeads(filters: {
    stage?: string; assigned_to?: string; overdue?: boolean; page?: number; limit?: number;
  }) {
    const query: Record<string, any> = {};
    if (filters.stage) query.stage = filters.stage;
    if (filters.assigned_to) query.assigned_to = filters.assigned_to;
    if (filters.overdue) {
      query.next_followup_at = { $lt: new Date() };
      query.stage = { $nin: [LeadStage.CONVERTED, LeadStage.DROPPED] };
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 50;
    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      this.leadModel.find(query).sort({ next_followup_at: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      this.leadModel.countDocuments(query),
    ]);

    return { leads, total, page, limit };
  }

  async updateLeadStage(leadId: string, stage: LeadStage, actor: string) {
    const lead = await this.leadModel.findById(leadId);
    if (!lead) throw new NotFoundException('Lead not found');
    lead.stage = stage;
    if (stage === LeadStage.CONVERTED) lead.converted_at = new Date();
    if (stage === LeadStage.DROPPED) lead.dropped_at = new Date();
    await lead.save();
    return lead;
  }

  async assignLead(leadId: string, assignTo: string, changedBy: string) {
    const lead = await this.leadModel.findById(leadId);
    if (!lead) throw new NotFoundException('Lead not found');

    lead.assignment_history.push({
      from: lead.assigned_to,
      to: assignTo,
      changed_by: changedBy,
      changed_at: new Date(),
    });
    lead.assigned_to = assignTo;
    await lead.save();
    return lead;
  }

  async updateLead(leadId: string, updates: Partial<CrmLead>) {
    return this.leadModel.findByIdAndUpdate(leadId, updates, { new: true }).lean();
  }

  // ── Follow-ups ────────────────────────────────────────────────────────────
  async scheduleFollowUp(data: Partial<CrmFollowUp>) {
    return this.followUpModel.create(data);
  }

  async listFollowUps(leadId?: string, status?: string) {
    const query: Record<string, any> = {};
    if (leadId) query.lead_id = leadId;
    if (status) query.status = status;
    return this.followUpModel.find(query).sort({ scheduled_at: 1 }).lean();
  }

  async completeFollowUp(followUpId: string, notes?: string) {
    return this.followUpModel.findByIdAndUpdate(
      followUpId,
      { status: FollowUpStatus.COMPLETED, completed_at: new Date(), notes: notes ?? null },
      { new: true },
    ).lean();
  }

  // ── Call Logs ─────────────────────────────────────────────────────────────
  async logCall(data: Partial<CrmCallLog>) {
    const callDate = new Date().toISOString().split('T')[0];
    return this.callLogModel.create({ ...data, call_date: callDate });
  }

  async listCallLogs(leadId: string) {
    return this.callLogModel.find({ lead_id: leadId }).sort({ createdAt: -1 }).lean();
  }

  // ── Funnel Reporting ──────────────────────────────────────────────────────
  async getFunnelReport(from?: Date, to?: Date) {
    const dateFilter = from && to ? { createdAt: { $gte: from, $lte: to } } : {};

    const [stageCounts, bySource, byStaff, conversionBySource] = await Promise.all([
      // Total leads per stage
      this.leadModel.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$stage', count: { $sum: 1 } } },
      ]),
      // Leads by source
      this.leadModel.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
      // Leads per staff + conversion rate
      this.leadModel.aggregate([
        { $match: { ...dateFilter, assigned_to: { $ne: null } } },
        {
          $group: {
            _id: '$assigned_to',
            total: { $sum: 1 },
            converted: { $sum: { $cond: [{ $eq: ['$stage', LeadStage.CONVERTED] }, 1, 0] } },
            dropped: { $sum: { $cond: [{ $eq: ['$stage', LeadStage.DROPPED] }, 1, 0] } },
          },
        },
      ]),
      // Conversion % by source
      this.leadModel.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: '$source',
            total: { $sum: 1 },
            converted: { $sum: { $cond: [{ $eq: ['$stage', LeadStage.CONVERTED] }, 1, 0] } },
          },
        },
        {
          $project: {
            source: '$_id',
            total: 1,
            converted: 1,
            conversion_pct: {
              $cond: [
                { $eq: ['$total', 0] },
                0,
                { $multiply: [{ $divide: ['$converted', '$total'] }, 100] },
              ],
            },
          },
        },
      ]),
    ]);

    return { stageCounts, bySource, byStaff, conversionBySource };
  }

  /** Overdue follow-ups (for dashboard alert badge) */
  async getOverdueCount() {
    return this.followUpModel.countDocuments({
      scheduled_at: { $lt: new Date() },
      status: FollowUpStatus.SCHEDULED,
    });
  }
}
