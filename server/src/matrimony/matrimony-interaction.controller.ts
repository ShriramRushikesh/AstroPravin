import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { MatrimonyInteractionService } from './matrimony-interaction.service';
import { MatrimonyRolesGuard, MatrimonyRoles } from './guards/matrimony-roles.guard';
import { MatrimonyUserRole } from './schemas/matrimony-user.schema';
import {
  SendInterestDto,
  RespondInterestDto,
  SendMessageDto,
  AssignSubscriptionDto,
} from './dto/matrimony-interaction.dto';

@Controller('matrimony')
@UseGuards(MatrimonyRolesGuard)
export class MatrimonyInteractionController {
  constructor(private readonly interactionService: MatrimonyInteractionService) {}

  // ── Interest Routes ───────────────────────────────────────────────────────

  @Post('interests')
  @HttpCode(HttpStatus.CREATED)
  async sendInterest(@Req() req: any, @Body() dto: SendInterestDto) {
    const profileId = req.matrimony_user.profile_id;
    if (!profileId) {
      throw new BadRequestException('Please complete your profile before sending interests');
    }
    return this.interactionService.sendInterest(profileId, dto);
  }

  @Put('interests/:id')
  async respondInterest(
    @Req() req: any,
    @Param('id') interestId: string,
    @Body() dto: RespondInterestDto,
  ) {
    const profileId = req.matrimony_user.profile_id;
    if (!profileId) {
      throw new BadRequestException('Profile not found');
    }
    return this.interactionService.respondInterest(interestId, profileId, dto);
  }

  @Get('interests')
  async getInterests(
    @Req() req: any,
    @Query('type') type?: 'received' | 'sent' | 'accepted',
  ) {
    const profileId = req.matrimony_user.profile_id;
    if (!profileId) return [];
    return this.interactionService.getInterests(profileId, type ?? 'received');
  }

  // ── Shortlist Routes ──────────────────────────────────────────────────────

  @Post('shortlist/:targetProfileId')
  async toggleShortlist(@Req() req: any, @Param('targetProfileId') targetProfileId: string) {
    const profileId = req.matrimony_user.profile_id;
    if (!profileId) {
      throw new BadRequestException('Please complete your profile before shortlisting');
    }
    return this.interactionService.toggleShortlist(profileId, targetProfileId);
  }

  @Get('shortlist')
  async getShortlist(@Req() req: any) {
    const profileId = req.matrimony_user.profile_id;
    if (!profileId) return [];
    return this.interactionService.getShortlist(profileId);
  }

  // ── Chat / Messaging Routes ───────────────────────────────────────────────

  @Post('chat')
  @HttpCode(HttpStatus.CREATED)
  async sendMessage(@Req() req: any, @Body() dto: SendMessageDto) {
    const profileId = req.matrimony_user.profile_id;
    if (!profileId) {
      throw new BadRequestException('Profile required to send messages');
    }
    return this.interactionService.sendMessage(profileId, dto);
  }

  @Get('chat/conversations')
  async getConversations(@Req() req: any) {
    const profileId = req.matrimony_user.profile_id;
    if (!profileId) return [];
    return this.interactionService.getConversations(profileId);
  }

  @Get('chat/messages/:partnerProfileId')
  async getMessages(
    @Req() req: any,
    @Param('partnerProfileId') partnerProfileId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const profileId = req.matrimony_user.profile_id;
    if (!profileId) return { messages: [], total: 0 };
    return this.interactionService.getMessages(
      profileId,
      partnerProfileId,
      Number(page) || 1,
      Number(limit) || 50,
    );
  }

  // ── Admin Subscription Route ──────────────────────────────────────────────

  @Post('admin/subscriptions')
  @MatrimonyRoles(MatrimonyUserRole.SUPER_ADMIN, MatrimonyUserRole.ADMIN)
  async assignSubscription(@Req() req: any, @Body() dto: AssignSubscriptionDto) {
    return this.interactionService.assignSubscription(dto, req.matrimony_user.username ?? 'admin');
  }
}
