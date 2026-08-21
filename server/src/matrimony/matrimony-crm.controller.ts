import {
  Controller, Get, Post, Put, Body, Param, Query,
  UseGuards, Req,
} from '@nestjs/common';
import { MatrimonyCrmService } from './matrimony-crm.service';
import { MatrimonyRolesGuard, MatrimonyRoles } from './guards/matrimony-roles.guard';
import { MatrimonyUserRole } from './schemas/matrimony-user.schema';
import { LeadStage } from './schemas/crm-lead.schema';
import { FollowUpStatus } from './schemas/crm-followup.schema';

@Controller('matrimony/crm')
@UseGuards(MatrimonyRolesGuard)
@MatrimonyRoles(MatrimonyUserRole.SUPER_ADMIN, MatrimonyUserRole.ADMIN, MatrimonyUserRole.STAFF)
export class MatrimonyCrmController {
  constructor(private readonly crmService: MatrimonyCrmService) {}

  // ── Leads ─────────────────────────────────────────────────────────────────

  @Post('leads')
  async createLead(@Body() body: any, @Req() req: any) {
    return this.crmService.createLead(body, req.matrimony_user.username);
  }

  @Get('leads')
  async listLeads(
    @Query('stage') stage?: string,
    @Query('assigned_to') assignedTo?: string,
    @Query('overdue') overdue?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.crmService.listLeads({
      stage,
      assigned_to: assignedTo,
      overdue: overdue === 'true',
      page: Number(page) || 1,
      limit: Number(limit) || 50,
    });
  }

  @Put('leads/:id/stage')
  async updateStage(
    @Param('id') id: string,
    @Body('stage') stage: LeadStage,
    @Req() req: any,
  ) {
    return this.crmService.updateLeadStage(id, stage, req.matrimony_user.username);
  }

  @Put('leads/:id/assign')
  async assignLead(
    @Param('id') id: string,
    @Body('assign_to') assignTo: string,
    @Req() req: any,
  ) {
    return this.crmService.assignLead(id, assignTo, req.matrimony_user.username);
  }

  @Put('leads/:id')
  async updateLead(@Param('id') id: string, @Body() body: any) {
    return this.crmService.updateLead(id, body);
  }

  // ── Follow-ups ────────────────────────────────────────────────────────────

  @Post('followups')
  async scheduleFollowUp(@Body() body: any, @Req() req: any) {
    return this.crmService.scheduleFollowUp({ ...body, scheduled_by: req.matrimony_user.username });
  }

  @Get('followups')
  async listFollowUps(@Query('lead_id') leadId?: string, @Query('status') status?: string) {
    return this.crmService.listFollowUps(leadId, status);
  }

  @Put('followups/:id/complete')
  async completeFollowUp(@Param('id') id: string, @Body('notes') notes?: string) {
    return this.crmService.completeFollowUp(id, notes);
  }

  // ── Call Logs ─────────────────────────────────────────────────────────────

  @Post('calls')
  async logCall(@Body() body: any, @Req() req: any) {
    return this.crmService.logCall({ ...body, called_by: req.matrimony_user.username });
  }

  @Get('leads/:id/calls')
  async getCallLogs(@Param('id') leadId: string) {
    return this.crmService.listCallLogs(leadId);
  }

  // ── Reporting ─────────────────────────────────────────────────────────────

  @Get('report/funnel')
  @MatrimonyRoles(MatrimonyUserRole.SUPER_ADMIN, MatrimonyUserRole.ADMIN)
  async getFunnelReport(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.crmService.getFunnelReport(
      from ? new Date(from) : undefined,
      to ? new Date(to) : undefined,
    );
  }

  @Get('report/overdue')
  async getOverdueCount() {
    return this.crmService.getOverdueCount();
  }
}
