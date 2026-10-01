import { Controller, Get, Post, Patch, Param, Query, Body, UseGuards, Req } from '@nestjs/common';
import { MatrimonyInteractionService } from './matrimony-interaction.service';
import { MatrimonyAuthGuard } from '../auth/matrimony-auth.guard';

@Controller('matrimony')
@UseGuards(MatrimonyAuthGuard)
export class MatrimonyInteractionController {
  constructor(private readonly interactionService: MatrimonyInteractionService) {}

  // ── Discovery ─────────────────────────────────────────────────────────────
  @Get('discover/search')
  async search(@Req() req: any, @Query() query: any) {
    return this.interactionService.searchProfiles(req.user._id, query);
  }

  @Get('discover/shortlisted')
  async getShortlisted(@Req() req: any) {
    return this.interactionService.getShortlistedProfiles(req.user._id);
  }

  @Get('discover/:profileId')
  async getSingleProfile(@Req() req: any, @Param('profileId') profileId: string) {
    return this.interactionService.getSingleProfile(req.user._id, profileId);
  }

  @Post('discover/shortlist/:targetUserId')
  async toggleShortlist(@Req() req: any, @Param('targetUserId') targetUserId: string) {
    return this.interactionService.toggleShortlist(req.user._id, targetUserId);
  }

  // ── Interests ─────────────────────────────────────────────────────────────
  @Get('interactions/interests')
  async getInterests(@Req() req: any) {
    return this.interactionService.getInterests(req.user._id);
  }

  @Post('interactions/interests/:receiverUserId')
  async sendInterest(@Req() req: any, @Param('receiverUserId') receiverUserId: string) {
    return this.interactionService.sendInterest(req.user._id, receiverUserId);
  }

  @Patch('interactions/interests/:interestId')
  async respondInterest(
    @Req() req: any,
    @Param('interestId') interestId: string,
    @Body('action') action: 'accept' | 'decline',
  ) {
    return this.interactionService.respondInterest(req.user._id, interestId, action);
  }

  @Get('interactions/matches')
  async getMatches(@Req() req: any) {
    return this.interactionService.getMatches(req.user._id);
  }

  // ── Chat ──────────────────────────────────────────────────────────────────
  @Get('chat/conversations')
  async getConversations(@Req() req: any) {
    return this.interactionService.getConversations(req.user._id);
  }

  @Get('chat/conversations/:partnerUserId')
  async getMessages(
    @Req() req: any,
    @Param('partnerUserId') partnerUserId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.interactionService.getMessages(req.user._id, partnerUserId, Number(page) || 1, Number(limit) || 50);
  }

  @Post('chat/conversations/:partnerUserId')
  async sendMessage(
    @Req() req: any,
    @Param('partnerUserId') partnerUserId: string,
    @Body('message') message: string,
  ) {
    return this.interactionService.sendMessage(req.user._id, partnerUserId, message);
  }
}
