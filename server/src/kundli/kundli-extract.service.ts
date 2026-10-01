import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

// Vedic astrology constants — all free knowledge
export const RASHIS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
    // Hindi equivalents
    'Mesh', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
    'Tula', 'Vrishchika', 'Dhanu', 'Makar', 'Kumbha', 'Meena',
];

export const NAKSHATRAS = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta',
    'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
    // Common alternate spellings
    'Mrigashirsha', 'Purva Ashada', 'Uttara Ashada', 'Dhanista',
];

export const PLANETS = [
    'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu',
    // Hindi equivalents
    'Surya', 'Chandra', 'Mangal', 'Budh', 'Guru', 'Shukra', 'Shani',
];

export const NADIS = ['Vata', 'Pitta', 'Kapha', 'Adi', 'Madhya', 'Antya'];

export const GOTRAS = [
    'Kashyapa', 'Vasishtha', 'Atri', 'Bharadwaj', 'Agastya', 'Angirasa',
    'Pulaha', 'Pulastya', 'Kanva', 'Garga', 'Vasistha', 'Vishwamitra',
    'Jamadagni', 'Gautam', 'Mandavya', 'Kaushika', 'Shandilya', 'Parashar',
    'Maudgalya', 'Kapi', 'Upamanyu', 'Vatsa', 'Laugakshi', 'Kaundinya',
    'Harita', 'Mudgala', 'Shrivatsa', 'Dhananjaya', 'Bharadvaja',
];

export interface ExtractedKundli {
    name: string | null;
    dateOfBirth: string | null;
    timeOfBirth: string | null;
    placeOfBirth: string | null;
    rashi: string | null;
    nakshatra: string | null;
    gotra: string | null;
    nadi: string | null;
    manglik: string | null;
    planetaryPositions: Record<string, string>;
    confidence: number;
    extractedText: string;
    extractionMethod: 'ocr' | 'pdf-text' | 'manual';
}

@Injectable()
export class KundliExtractService {
    private readonly logger = new Logger(KundliExtractService.name);

    /**
     * Extract Kundli data from an uploaded file (JPG, PNG, PDF).
     * Uses Tesseract OCR for images. Falls back to regex on raw text.
     * Zero external API cost — everything runs on your server.
     */
    async extractFromFile(filePath: string): Promise<ExtractedKundli> {
        try {
            let rawText = '';
            let confidence = 0;
            let method: 'ocr' | 'pdf-text' | 'manual' = 'ocr';

            const ext = path.extname(filePath).toLowerCase();

            if (ext === '.pdf') {
                // Try pdf-parse first (text-based PDF, faster)
                const pdfResult = await this.extractTextFromPdf(filePath);
                if (pdfResult.text.length > 50) {
                    rawText = pdfResult.text;
                    confidence = 0.92;
                    method = 'pdf-text';
                } else {
                    // PDF is scanned image — run OCR
                    rawText = await this.runOcrOnFile(filePath);
                    confidence = 0.8;
                    method = 'ocr';
                }
            } else {
                // Image file — run Tesseract OCR
                rawText = await this.runOcrOnFile(filePath);
                confidence = 0.85;
                method = 'ocr';
            }

            const parsed = this.parseKundliText(rawText);

            // Boost confidence if key fields found
            let fieldsFound = 0;
            if (parsed.rashi) fieldsFound++;
            if (parsed.nakshatra) fieldsFound++;
            if (parsed.name) fieldsFound++;
            if (parsed.dateOfBirth) fieldsFound++;
            if (parsed.nadi) fieldsFound++;
            confidence = Math.min(0.99, confidence + fieldsFound * 0.02);

            return {
                ...parsed,
                confidence,
                extractedText: rawText,
                extractionMethod: method,
            };
        } catch (err) {
            this.logger.error(`Kundli extraction failed for ${filePath}: ${err}`);
            return this.emptyResult();
        }
    }

    /**
     * Parse Kundli text directly (for manual entry or pre-extracted text).
     */
    parseKundliText(text: string): Omit<ExtractedKundli, 'confidence' | 'extractedText' | 'extractionMethod'> {
        // Normalize
        const normalized = text.replace(/\s+/g, ' ').trim();

        // Name — look after "Name:" label or on first prominent line
        const nameMatch =
            normalized.match(/(?:name\s*[:\-]\s*)([A-Za-z][A-Za-z\s\.]{2,40}?)(?:\n|,|DOB|Date|$)/i) ||
            normalized.match(/^([A-Z][A-Za-z\s\.]{3,30})\s*$/m);
        const name = nameMatch ? nameMatch[1].trim() : null;

        // DOB — DD/MM/YYYY or DD-MM-YYYY or YYYY-MM-DD
        const dobMatch =
            normalized.match(/(?:birth\s*date|date\s*of\s*birth|dob)\s*[:\-]?\s*(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/i) ||
            normalized.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
        const dateOfBirth = dobMatch
            ? `${dobMatch[3]}-${dobMatch[2].padStart(2, '0')}-${dobMatch[1].padStart(2, '0')}`
            : null;

        // TOB — HH:MM or HH.MM AM/PM
        const tobMatch =
            normalized.match(/(?:time\s*of\s*birth|tob|birth\s*time)\s*[:\-]?\s*(\d{1,2})[:\.](\d{2})\s*(am|pm)?/i) ||
            normalized.match(/(\d{1,2})[:\.](\d{2})\s*(am|pm)/i);
        let timeOfBirth: string | null = null;
        if (tobMatch) {
            let h = parseInt(tobMatch[1]);
            const m = tobMatch[2];
            const period = tobMatch[3]?.toLowerCase();
            if (period === 'pm' && h < 12) h += 12;
            if (period === 'am' && h === 12) h = 0;
            timeOfBirth = `${String(h).padStart(2, '0')}:${m}`;
        }

        // POB — after "Place:" or "Born in"
        const pobMatch = normalized.match(
            /(?:place\s*of\s*birth|pob|birth\s*place|born\s*in)\s*[:\-]?\s*([A-Za-z][A-Za-z\s\,\.]{2,50}?)(?:\n|Rashi|Nakshatra|$)/i
        );
        const placeOfBirth = pobMatch ? pobMatch[1].trim().replace(/,$/, '') : null;

        // Rashi
        const rashi = this.findFirstMatch(normalized, RASHIS);

        // Nakshatra
        const nakshatra = this.findFirstMatch(normalized, NAKSHATRAS);

        // Gotra
        const gotra = this.findFirstMatch(normalized, GOTRAS);

        // Nadi
        const nadi = this.findFirstMatch(normalized, NADIS);

        // Manglik
        let manglik: string | null = null;
        if (/manglik/i.test(normalized)) {
            manglik = /non[\-\s]?manglik/i.test(normalized) ? 'Non-Manglik' : 'Manglik';
        }

        // Planetary positions — "Planet: Rashi" or "Planet Rashi" patterns
        const planetaryPositions: Record<string, string> = {};
        const planetNormMap: Record<string, string> = {
            surya: 'Sun', chandra: 'Moon', mangal: 'Mars',
            budh: 'Mercury', guru: 'Jupiter', shukra: 'Venus',
            shani: 'Saturn', rahu: 'Rahu', ketu: 'Ketu',
        };

        for (const planet of ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu',
            'Surya', 'Chandra', 'Mangal', 'Budh', 'Guru', 'Shukra', 'Shani']) {
            const regex = new RegExp(`${planet}\\s*[:\\-]?\\s*([A-Za-z]+)`, 'i');
            const match = normalized.match(regex);
            if (match) {
                const matchedRashi = this.findFirstMatch(match[1], RASHIS);
                if (matchedRashi) {
                    const key = planetNormMap[planet.toLowerCase()] || planet;
                    planetaryPositions[key] = matchedRashi;
                }
            }
        }

        return { name, dateOfBirth, timeOfBirth, placeOfBirth, rashi, nakshatra, gotra, nadi, manglik, planetaryPositions };
    }

    // ─── Private helpers ─────────────────────────────────────────────────────

    private async runOcrOnFile(filePath: string): Promise<string> {
        try {
            // Dynamic import — tesseract.js is optional
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore: tesseract.js is an optional runtime dependency
            const { createWorker } = await import('tesseract.js');
            const worker = await createWorker(['eng', 'hin']);
            const { data } = await worker.recognize(filePath);
            await worker.terminate();
            return data.text;
        } catch {
            this.logger.warn('tesseract.js not installed — returning empty OCR text. Run: npm install tesseract.js');
            return '';
        }
    }

    private async extractTextFromPdf(filePath: string): Promise<{ text: string }> {
        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore: pdf-parse is an optional runtime dependency
            const pdfParseModule = await import('pdf-parse');
            const dataBuffer = fs.readFileSync(filePath);
            // pdf-parse can export as default or as the module itself depending on esm/cjs
            const parseFn = (pdfParseModule as any).default ?? pdfParseModule;
            const data = await parseFn(dataBuffer);
            return { text: data.text };
        } catch {
            this.logger.warn('pdf-parse not installed — falling back to OCR. Run: npm install pdf-parse');
            return { text: '' };
        }
    }

    private findFirstMatch(text: string, list: string[]): string | null {
        const lower = text.toLowerCase();
        for (const item of list) {
            if (lower.includes(item.toLowerCase())) {
                return item;
            }
        }
        return null;
    }

    private emptyResult(): ExtractedKundli {
        return {
            name: null, dateOfBirth: null, timeOfBirth: null,
            placeOfBirth: null, rashi: null, nakshatra: null,
            gotra: null, nadi: null, manglik: null,
            planetaryPositions: {}, confidence: 0,
            extractedText: '', extractionMethod: 'manual',
        };
    }
}
