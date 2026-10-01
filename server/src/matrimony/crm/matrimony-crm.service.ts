import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CrmLead, CrmLeadDocument } from '../schemas/crm-lead.schema';
import { CrmFollowUp, CrmFollowUpDocument } from '../schemas/crm-followup.schema';
import { CrmCallLog, CrmCallLogDocument } from '../schemas/crm-call-log.schema';

@Injectable()
export class MatrimonyCrmService {
  constructor(
    @InjectModel(CrmLead.name) private leadModel: Model<CrmLeadDocument>,
    @InjectModel(CrmFollowUp.name) private followUpModel: Model<CrmFollowUpDocument>,
    @InjectModel(CrmCallLog.name) private callLogModel: Model<CrmCallLogDocument>,
  ) {}

  async listLeads(query: any) {
    const filter: any = {};

    if (query.stage && query.stage !== 'all') {
      if (query.stage === 'overdue') {
        filter.nextFollowUpAt = { $lt: new Date() };
        filter.stage = { $nin: ['converted', 'lost'] };
      } else {
        filter.stage = query.stage;
      }
    }

    if (query.priority && query.priority !== 'all') {
      filter.priority = query.priority;
    }

    if (query.search) {
      const regex = new RegExp(query.search, 'i');
      filter.$or = [{ name: regex }, { phone: regex }, { email: regex }, { city: regex }];
    }

    const leads = await this.leadModel.find(filter).sort({ nextFollowUpAt: 1, createdAt: -1 }).lean();
    return leads;
  }

  async createLead(dto: any, adminId?: string) {
    const lead = await this.leadModel.create({
      ...dto,
      assignedTo: adminId ? new Types.ObjectId(adminId) : undefined,
      createdAt: new Date(),
    });
    return lead;
  }

  async updateLead(leadId: string, dto: any) {
    const lead = await this.leadModel.findByIdAndUpdate(
      new Types.ObjectId(leadId),
      { ...dto, updatedAt: new Date() },
      { new: true },
    );
    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async scheduleFollowUp(leadId: string, dto: any, adminId?: string) {
    const leadObjectId = new Types.ObjectId(leadId);
    const followUp = await this.followUpModel.create({
      leadId: leadObjectId,
      scheduledAt: new Date(dto.scheduledAt),
      outcome: '',
      nextAction: dto.nextAction || '',
      assignedTo: adminId ? new Types.ObjectId(adminId) : undefined,
    });

    // Update lead nextFollowUpAt
    await this.leadModel.findByIdAndUpdate(leadObjectId, {
      nextFollowUpAt: new Date(dto.scheduledAt),
    });

    return followUp;
  }

  async completeFollowUp(followupId: string, dto: any) {
    const followUp = await this.followUpModel.findByIdAndUpdate(
      new Types.ObjectId(followupId),
      {
        completedAt: new Date(),
        outcome: dto.outcome || 'Completed',
        nextAction: dto.nextAction || '',
      },
      { new: true },
    );
    if (!followUp) throw new NotFoundException('Follow-up not found');
    return followUp;
  }

  async logCall(leadId: string, dto: any, adminId?: string) {
    const call = await this.callLogModel.create({
      leadId: new Types.ObjectId(leadId),
      calledAt: dto.calledAt ? new Date(dto.calledAt) : new Date(),
      durationSeconds: Number(dto.durationSeconds) || 0,
      outcome: dto.outcome || 'answered',
      notes: dto.notes || '',
      loggedByAdmin: adminId ? new Types.ObjectId(adminId) : undefined,
    });
    return call;
  }

  async getTimeline(leadId: string) {
    const leadObjectId = new Types.ObjectId(leadId);
    const [lead, calls, followUps] = await Promise.all([
      this.leadModel.findById(leadObjectId),
      this.callLogModel.find({ leadId: leadObjectId }).sort({ calledAt: -1 }).lean(),
      this.followUpModel.find({ leadId: leadObjectId }).sort({ scheduledAt: -1 }).lean(),
    ]);

    if (!lead) throw new NotFoundException('Lead not found');

    const timeline = [
      ...calls.map(c => ({
        type: 'call',
        id: c._id,
        timestamp: c.calledAt,
        data: c,
      })),
      ...followUps.map(f => ({
        type: 'followup',
        id: f._id,
        timestamp: f.completedAt || f.scheduledAt,
        data: f,
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return {
      lead,
      timeline,
    };
  }

  async getCrmDashboard() {
    const [allLeads, todayFollowUps, overdueCount] = await Promise.all([
      this.leadModel.find().lean(),
      this.followUpModel.countDocuments({
        scheduledAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
        completedAt: null,
      }),
      this.leadModel.countDocuments({
        nextFollowUpAt: { $lt: new Date() },
        stage: { $nin: ['converted', 'lost'] },
      }),
    ]);

    const stageCounts: Record<string, number> = {
      new: 0,
      contacted: 0,
      interested: 0,
      converted: 0,
      lost: 0,
    };

    for (const l of allLeads) {
      if (stageCounts[l.stage] !== undefined) {
        stageCounts[l.stage]++;
      }
    }

    const total = allLeads.length;
    const conversionRate = total > 0 ? ((stageCounts.converted / total) * 100).toFixed(1) : 0;

    return {
      stageCounts,
      totalLeads: total,
      todayFollowUps,
      overdueCount,
      conversionRate: `${conversionRate}%`,
    };
  }
}
