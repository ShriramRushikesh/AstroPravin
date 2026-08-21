import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument } from './services.schema';

const INITIAL_SERVICES = [
    {
        title: "Kundli Milan & Marriage Compatibility",
        description: "Comprehensive 36-Guna Ashtakoot match, Navamsha D9 analysis, Mangal dosha evaluation, and marital remedies by Pandit Pravin Shriram.",
        price: 1100,
        icon: "Heart",
        features: [
            "36 Guna Ashtakoot Milan",
            "Mangal Dosha Cancellation Rules",
            "Navamsha D9 Harmony Reading",
            "Remedial Gemstone & Pooja Advice"
        ]
    },
    {
        title: "Complete Life Horoscope (Kundli Patrika)",
        description: "In-depth birth chart analysis covering career trajectory, health, wealth yogas, Sade Sati timeline, and Mahadasha transitions.",
        price: 2100,
        icon: "Sparkles",
        features: [
            "Detailed 12 Bhavas Inspection",
            "Dasha & Antardasha Predictions",
            "Rahu-Ketu Karmic Analysis",
            "Personalized Yantra / Rudraksha Remedies"
        ]
    },
    {
        title: "Vastu Shastra Consultation",
        description: "Energy analysis of residential homes, commercial offices, retail shops, and factories with non-destructive corrective remedies.",
        price: 5100,
        icon: "Home",
        features: [
            "Directional Compass & Grid Audit",
            "Brahmasthan & 16 Zones Balancing",
            "Pyramid & Copper Helix Remedies",
            "On-site / Online Blueprint Inspection"
        ]
    }
];

@Injectable()
export class ServicesService implements OnModuleInit {
    constructor(@InjectModel(Service.name) private serviceModel: Model<ServiceDocument>) { }

    async onModuleInit() {
        try {
            const count = await this.serviceModel.countDocuments();
            if (count === 0) {
                console.log('📦 Seeding initial consultation services to MongoDB...');
                await this.serviceModel.insertMany(INITIAL_SERVICES);
                console.log('✅ Consultation services seeded successfully.');
            }
        } catch (err: any) {
            console.error('Services seed check warning:', err.message);
        }
    }

    async create(createServiceDto: any): Promise<Service> {
        const payload = {
            ...createServiceDto,
            name: createServiceDto.name || createServiceDto.title,
            title: createServiceDto.title || createServiceDto.name,
        };
        const createdService = new this.serviceModel(payload);
        return createdService.save();
    }

    async findAll(): Promise<Service[]> {
        return this.serviceModel.find().exec();
    }

    async update(id: string, updateServiceDto: any): Promise<Service | null> {
        const payload = {
            ...updateServiceDto,
            name: updateServiceDto.name || updateServiceDto.title,
            title: updateServiceDto.title || updateServiceDto.name,
        };
        return this.serviceModel.findByIdAndUpdate(id, payload, { new: true }).exec();
    }

    async remove(id: string): Promise<Service | null> {
        return this.serviceModel.findByIdAndDelete(id).exec();
    }
}
