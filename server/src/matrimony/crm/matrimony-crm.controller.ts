import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MatrimonyCrmService } from './matrimony-crm.service';

@Controller('matrimony/admin/crm')
@UseGuards(AuthGuard('jwt'))
export class MatrimonyCrmController {
  constructor(private readonly crmService: MatrimonyCrmService) {}

  @Get('leads')
  async listLeads(@Query() query: any) {
    return this.crmService.listLeads(query);
  }

  @Post('leads')
  async createLead(@Req() req: any, @Body() dto: any) {
    const adminId = req.user?.id || req.user?._id;
    return this.crmService.createLead(dto, adminId);
  }

  @Patch('leads/:leadId')
  async updateLead(@Param('leadId') leadId: string, @Body() dto: any) {
    return this.crmService.updateLead(leadId, dto);
  }

  @Post('leads/:leadId/followups')
  async scheduleFollowUp(@Req() req: any, @Param('leadId') leadId: string, @Body() dto: any) {
    const adminId = req.user?.id || req.user?._id;
    return this.crmService.scheduleFollowUp(leadId, dto, adminId);
  }

  @Patch('followups/:followupId')
  async completeFollowUp(@Param('followupId') followupId: string, @Body() dto: any) {
    return this.crmService.completeFollowUp(followupId, dto);
  }

  @Post('leads/:leadId/calls')
  async logCall(@Req() req: any, @Param('leadId') leadId: string, @Body() dto: any) {
    const adminId = req.user?.id || req.user?._id;
    return this.crmService.logCall(leadId, dto, adminId);
  }

  @Get('leads/:leadId/timeline')
  async getTimeline(@Param('leadId') leadId: string) {
    return this.crmService.getTimeline(leadId);
  }

  @Get('dashboard')
  async getDashboard() {
    return this.crmService.getCrmDashboard();
  }
}
