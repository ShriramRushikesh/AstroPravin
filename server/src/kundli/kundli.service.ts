import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as path from 'path';
import * as fs from 'fs';
import { Lead, LeadDocument } from './schemas/lead.schema';
import { calculateKundli } from './kundli.logic';
import { generatePDF } from './pdf.generator';

@Injectable()
export class KundliService {
    constructor(
        @InjectModel(Lead.name) private leadModel: Model<LeadDocument>,
    ) { }

    async generate(data: any, hostIdx: string, protocol: string) {
        const { name, day, month, year, hour, minute, place, mobile } = data;
        const dob = `${day}/${month}/${year}`;
        const tob = `${hour}:${minute}`;

        // 1. Calculate Data
        const kundliData = calculateKundli(dob, tob, place);

        // 2. Generate PDF
        const fileName = `${name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;

        // Resolve path relative to project root/public
        const uploadsDir = path.join(process.cwd(), 'public', 'kundlis');

        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const filePath = path.join(uploadsDir, fileName);
        await generatePDF({ name, dob, tob, pob: place }, kundliData, filePath);

        // 3. Save Lead
        const pdfUrl = `${protocol}://${hostIdx}/public/kundlis/${fileName}`;

        const lead = new this.leadModel({
            name,
            mobile,
            dob,
            tob,
            pob: place,
            pdfPath: filePath, // Stores local path, but frontend uses URL
            whatsappStatus: 'pending'
        });

        await lead.save();

        // 4. Send WhatsApp (Simplified / Placeholder)
        // await sendWhatsApp(mobile, name, pdfUrl);

        return { success: true, kundliData, pdfUrl };
    }
}
