import {
    Controller, Post, Body, Req, Get, Param,
    UseInterceptors, UploadedFile, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { KundliService } from './kundli.service';
import { KundliExtractService } from './kundli-extract.service';
import { GunMilanService } from './gun-milan.service';
import { generateGunMilanPDF } from './pdf.generator';
import type { Request } from 'express';

// ─── Multer upload config ─────────────────────────────────────────────────────
const kundliStorage = diskStorage({
    destination: (_req, _file, cb) => {
        const uploadDir = join(process.cwd(), 'public', 'kundli-uploads');
        if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
        cb(null, `kundli-${uniqueSuffix}${extname(file.originalname)}`);
    },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
    const allowed = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'];
    const ext = extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
        cb(null, true);
    } else {
        cb(new BadRequestException('Only PDF, JPG, PNG files are accepted for Kundli upload.'), false);
    }
};

@Controller('kundli')
export class KundliController {
    constructor(
        private readonly kundliService: KundliService,
        private readonly extractService: KundliExtractService,
        private readonly gunMilanService: GunMilanService,
    ) { }

    // ── Existing: Generate Kundli from form data ─────────────────────────────
    @Post('generate')
    async generate(@Body() body: any, @Req() req: Request) {
        const host = req.get('host') || 'localhost';
        const protocol = req.protocol;
        return this.kundliService.generate(body, host, protocol);
    }

    // ── NEW: Upload Kundli image/PDF → OCR extract → return structured data ──
    /**
     * POST /api/kundli/upload-extract
     * Multipart: file (JPG/PDF), name (optional), profileId (optional)
     * Returns: extracted Kundli fields + confidence score
     */
    @Post('upload-extract')
    @UseInterceptors(FileInterceptor('file', { storage: kundliStorage, fileFilter }))
    async uploadAndExtract(@UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('No file uploaded.');
        const extracted = await this.extractService.extractFromFile(file.path);
        return {
            success: true,
            filePath: file.path,
            fileName: file.filename,
            kundliData: extracted,
            message: extracted.confidence > 0.5
                ? 'Kundli data extracted successfully.'
                : 'Low confidence extraction — please verify the fields manually.',
        };
    }

    // ── NEW: Calculate 36-Guna Ashta Koota Milan ─────────────────────────────
    /**
     * POST /api/kundli/gun-milan/calculate
     * Body: { kundli1: KundliInput, kundli2: KundliInput, generatePdf?: boolean }
     * Returns: Gun Milan score, breakdown, dosha, remedies, optional PDF base64
     */
    @Post('gun-milan/calculate')
    async calculateGunMilan(@Body() body: {
        kundli1: { rashi?: string; nakshatra?: string; nadi?: string; name?: string; planetaryPositions?: Record<string, string> };
        kundli2: { rashi?: string; nakshatra?: string; nadi?: string; name?: string; planetaryPositions?: Record<string, string> };
        generatePdf?: boolean;
    }) {
        if (!body.kundli1 || !body.kundli2) {
            throw new BadRequestException('Both kundli1 and kundli2 are required.');
        }

        const result = this.gunMilanService.calculate(body.kundli1, body.kundli2);

        let pdfBase64: string | null = null;
        if (body.generatePdf) {
            try {
                const pdfBuffer = await generateGunMilanPDF(body.kundli1, body.kundli2, result);
                pdfBase64 = pdfBuffer.toString('base64');
            } catch (err) {
                // PDF generation failure should not block the score response
                pdfBase64 = null;
            }
        }

        return {
            success: true,
            gunaScore: result.totalScore,
            percentage: result.percentage,
            compatibility: result.compatibility,
            verdict: result.verdict,
            auspicious: result.auspicious,
            breakdown: result.breakdown,
            dosha: result.dosha,
            remedies: result.remedies,
            pdf: pdfBase64,
        };
    }
}
