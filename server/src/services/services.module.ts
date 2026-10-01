import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { Service, ServiceSchema } from './services.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema }])],
    controllers: [ServicesController],
    providers: [ServicesService],
})
export class ServicesModule { }
