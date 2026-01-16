import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument } from './services.schema';

@Injectable()
export class ServicesService {
    constructor(@InjectModel(Service.name) private serviceModel: Model<ServiceDocument>) { }

    async create(createServiceDto: any): Promise<Service> {
        const createdService = new this.serviceModel(createServiceDto);
        return createdService.save();
    }

    async findAll(): Promise<Service[]> {
        return this.serviceModel.find().exec();
    }

    async update(id: string, updateServiceDto: any): Promise<Service | null> {
        return this.serviceModel.findByIdAndUpdate(id, updateServiceDto, { new: true }).exec();
    }

    async remove(id: string): Promise<Service | null> {
        return this.serviceModel.findByIdAndDelete(id).exec();
    }
}
