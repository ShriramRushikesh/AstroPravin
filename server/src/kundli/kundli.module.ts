import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { KundliController } from './kundli.controller';
import { LeadsController } from './leads.controller';
import { KundliService } from './kundli.service';
import { KundliExtractService } from './kundli-extract.service';
import { GunMilanService } from './gun-milan.service';
import { Lead, LeadSchema } from './schemas/lead.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Lead.name, schema: LeadSchema }]),
        MulterModule.register({ dest: './public/kundli-uploads' }),
    ],
    controllers: [KundliController, LeadsController],
    providers: [KundliService, KundliExtractService, GunMilanService],
    exports: [KundliExtractService, GunMilanService],
})
export class KundliModule { }

