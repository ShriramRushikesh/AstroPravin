import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KundliController } from './kundli.controller';
import { KundliService } from './kundli.service';
import { Lead, LeadSchema } from './schemas/lead.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lead.name, schema: LeadSchema }]),
  ],
  controllers: [KundliController],
  providers: [KundliService],
})
export class KundliModule { }
