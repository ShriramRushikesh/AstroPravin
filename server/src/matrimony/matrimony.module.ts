import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

// ── Schemas ───────────────────────────────────────────────────────────────────
import { MatrimonyUser, MatrimonyUserSchema } from './schemas/matrimony-user.schema';
import { MatrimonyProfile, MatrimonyProfileSchema } from './schemas/matrimony-profile.schema';
import { MatrimonyPhoto, MatrimonyPhotoSchema } from './schemas/matrimony-photo.schema';
import { MatrimonyInterest, MatrimonyInterestSchema } from './schemas/matrimony-interest.schema';
import { MatrimonyShortlist, MatrimonyShortlistSchema } from './schemas/matrimony-shortlist.schema';
import { MatrimonyMessage, MatrimonyMessageSchema } from './schemas/matrimony-message.schema';
import { MatrimonyProfileView, MatrimonyProfileViewSchema } from './schemas/matrimony-profile-view.schema';
import { MatrimonySubscription, MatrimonySubscriptionSchema } from './schemas/matrimony-subscription.schema';
import { MatrimonyAuditLog, MatrimonyAuditLogSchema } from './schemas/matrimony-audit-log.schema';
import { CrmLead, CrmLeadSchema } from './schemas/crm-lead.schema';
import { CrmFollowUp, CrmFollowUpSchema } from './schemas/crm-followup.schema';
import { CrmCallLog, CrmCallLogSchema } from './schemas/crm-call-log.schema';

// ── Auth Sub-module ───────────────────────────────────────────────────────────
import { MatrimonyAuthController } from './auth/matrimony-auth.controller';
import { MatrimonyAuthService } from './auth/matrimony-auth.service';
import { MatrimonyJwtStrategy } from './auth/matrimony-jwt.strategy';
import { MatrimonyAuthGuard } from './auth/matrimony-auth.guard';

// ── Profile Sub-module ────────────────────────────────────────────────────────
import { MatrimonyProfileController } from './profile/matrimony-profile.controller';
import { MatrimonyProfileService } from './profile/matrimony-profile.service';

// ── Interaction Sub-module ────────────────────────────────────────────────────
import { MatrimonyInteractionController } from './interaction/matrimony-interaction.controller';
import { MatrimonyInteractionService } from './interaction/matrimony-interaction.service';

// ── Gun Milan Sub-module ──────────────────────────────────────────────────────
import { MatrimonyGunMilanController } from './gun-milan/matrimony-gun-milan.controller';
import { MatrimonyGunMilanService } from './gun-milan/matrimony-gun-milan.service';

// ── Admin Sub-module ──────────────────────────────────────────────────────────
import { MatrimonyAdminController } from './admin/matrimony-admin.controller';
import { MatrimonyAdminService } from './admin/matrimony-admin.service';

// ── CRM Sub-module ────────────────────────────────────────────────────────────
import { MatrimonyCrmController } from './crm/matrimony-crm.controller';
import { MatrimonyCrmService } from './crm/matrimony-crm.service';

// ── Payment Sub-module (Razorpay) ──────────────────────────────────────────────
import { MatrimonyPaymentController } from './payment/matrimony-payment.controller';
import { MatrimonyPaymentService } from './payment/matrimony-payment.service';

// ── Cross-module Dependencies ─────────────────────────────────────────────────
import { KundliModule } from '../kundli/kundli.module';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    ConfigModule,
    KundliModule, // Provides GunMilanService
    SharedModule, // Provides EmailService

    // JWT for Matrimony members (longer session duration)
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'astropravin_matrimony_secret_jwt_2026',
        signOptions: { expiresIn: '7d' },
      }),
    }),

    // Mongoose collection bindings
    MongooseModule.forFeature([
      { name: MatrimonyUser.name, schema: MatrimonyUserSchema },
      { name: MatrimonyProfile.name, schema: MatrimonyProfileSchema },
      { name: MatrimonyPhoto.name, schema: MatrimonyPhotoSchema },
      { name: MatrimonyInterest.name, schema: MatrimonyInterestSchema },
      { name: MatrimonyShortlist.name, schema: MatrimonyShortlistSchema },
      { name: MatrimonyMessage.name, schema: MatrimonyMessageSchema },
      { name: MatrimonyProfileView.name, schema: MatrimonyProfileViewSchema },
      { name: MatrimonySubscription.name, schema: MatrimonySubscriptionSchema },
      { name: MatrimonyAuditLog.name, schema: MatrimonyAuditLogSchema },
      { name: CrmLead.name, schema: CrmLeadSchema },
      { name: CrmFollowUp.name, schema: CrmFollowUpSchema },
      { name: CrmCallLog.name, schema: CrmCallLogSchema },
    ]),

    MulterModule.register({ dest: './public/matrimony-photos' }),
  ],
  controllers: [
    MatrimonyAuthController,
    MatrimonyProfileController,
    MatrimonyInteractionController,
    MatrimonyGunMilanController,
    MatrimonyAdminController,
    MatrimonyCrmController,
    MatrimonyPaymentController,
  ],
  providers: [
    MatrimonyAuthService,
    MatrimonyJwtStrategy,
    MatrimonyAuthGuard,
    MatrimonyProfileService,
    MatrimonyInteractionService,
    MatrimonyGunMilanService,
    MatrimonyAdminService,
    MatrimonyCrmService,
    MatrimonyPaymentService,
  ],
  exports: [
    MatrimonyAuthService,
    MatrimonyProfileService,
    MatrimonyInteractionService,
    MatrimonyGunMilanService,
    MatrimonyAdminService,
    MatrimonyCrmService,
    MatrimonyPaymentService,
  ],
})
export class MatrimonyModule {}
