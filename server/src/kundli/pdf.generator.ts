import * as fs from 'fs';
import { GunMilanResult } from './gun-milan.service';
import { ExtractedKundli } from './kundli-extract.service';

// ─── Quick Kundli Report (single person) ─────────────────────────────────────

export async function generatePDF(
    userInfo: { name: string; dob: string; tob: string; pob: string },
    kundliData: any,
    filePath: string,
): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            const PDFDocument = require('pdfkit');
            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            const writeStream = fs.createWriteStream(filePath);
            doc.pipe(writeStream);

            // Header band
            doc.rect(0, 0, 595, 80).fill('#4A0E2E');
            doc.fillColor('#D4AF37').fontSize(22).font('Helvetica-Bold')
                .text('AstroPravin – Kundli Report', 50, 25, { align: 'center' });
            doc.fillColor('#FAF6F0').fontSize(10).font('Helvetica')
                .text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 50, 54, { align: 'center' });

            // Personal Details
            doc.fillColor('#4A0E2E').fontSize(14).font('Helvetica-Bold')
                .text('Personal Details', 50, 100);
            doc.moveTo(50, 116).lineTo(545, 116).strokeColor('#D4AF37').lineWidth(1).stroke();

            doc.fillColor('#333').fontSize(11).font('Helvetica');
            const details = [
                ['Name', userInfo.name], ['Date of Birth', userInfo.dob],
                ['Time of Birth', userInfo.tob], ['Place of Birth', userInfo.pob],
            ];
            details.forEach(([label, value], i) => {
                doc.font('Helvetica-Bold').text(`${label}:`, 50, 125 + i * 20, { continued: true });
                doc.fillColor('#333').font('Helvetica').text(`  ${value}`);
            });

            // Kundli Results
            doc.fillColor('#4A0E2E').fontSize(14).font('Helvetica-Bold')
                .text('Kundli Analysis', 50, 215);
            doc.moveTo(50, 231).lineTo(545, 231).strokeColor('#D4AF37').lineWidth(1).stroke();

            doc.fillColor('#333').fontSize(11).font('Helvetica');
            const kundliFields = [
                ['Lagna (Ascendant)', kundliData.lagna],
                ['Moon Sign (Rashi)', kundliData.moonSign],
                ['Nakshatra', kundliData.nakshatra],
                ['Current Mahadasha', kundliData.currentDasha],
            ];
            kundliFields.forEach(([label, value], i) => {
                doc.font('Helvetica-Bold').text(`${label}:`, 50, 240 + i * 20, { continued: true });
                doc.font('Helvetica').text(`  ${value ?? 'N/A'}`);
            });

            // Insights
            doc.fillColor('#4A0E2E').fontSize(14).font('Helvetica-Bold')
                .text('Personalised Insights', 50, 330);
            doc.moveTo(50, 346).lineTo(545, 346).strokeColor('#D4AF37').lineWidth(1).stroke();
            doc.fillColor('#333').fontSize(10).font('Helvetica')
                .text(kundliData.personality, 50, 355, { width: 495 }).moveDown(0.5)
                .text(kundliData.career, { width: 495 }).moveDown(0.5)
                .text(kundliData.relationship, { width: 495 });

            // Footer
            const pageHeight = doc.page.height;
            doc.rect(0, pageHeight - 40, 595, 40).fill('#4A0E2E');
            doc.fillColor('#D4AF37').fontSize(9).font('Helvetica')
                .text('AstroPravin | Acharya Pravin | Solapur | Contact: +91-XXXXXXXXXX', 50, pageHeight - 26, { align: 'center' });

            doc.end();
            writeStream.on('finish', () => resolve());
            writeStream.on('error', (err) => reject(err));
        } catch (err) {
            reject(err);
        }
    });
}

// ─── Gun Milan Report (pair comparison) ──────────────────────────────────────

export async function generateGunMilanPDF(
    kundli1: ExtractedKundli | any,
    kundli2: ExtractedKundli | any,
    result: GunMilanResult,
): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        try {
            const PDFDocument = require('pdfkit');
            const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true });
            const buffers: Buffer[] = [];
            doc.on('data', (chunk) => buffers.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);

            // ── Page 1 ──────────────────────────────────────────────────────

            // Header
            doc.rect(0, 0, 595, 90).fill('#4A0E2E');
            doc.fillColor('#D4AF37').fontSize(20).font('Helvetica-Bold')
                .text('AstroPravin – Kundli Milan Report', 50, 20, { align: 'center' });
            doc.fillColor('#FAF6F0').fontSize(10).font('Helvetica')
                .text('36 Guna Ashta Koota Matching | Traditional Vedic Astrology', 50, 48, { align: 'center' })
                .text(`Report Date: ${new Date().toLocaleDateString('en-IN')}`, 50, 64, { align: 'center' });

            // Profile summary boxes
            const drawProfileBox = (x: number, kundli: any, label: string) => {
                doc.rect(x, 105, 225, 120).fill('#FAF6F0').stroke('#D4AF37');
                doc.fillColor('#4A0E2E').fontSize(11).font('Helvetica-Bold').text(label, x + 10, 112);
                doc.fillColor('#333').fontSize(9).font('Helvetica');
                doc.text(`Name:       ${kundli.name ?? 'N/A'}`, x + 10, 127);
                doc.text(`DOB:         ${kundli.dateOfBirth ?? 'N/A'}`, x + 10, 142);
                doc.text(`Rashi:       ${kundli.rashi ?? 'N/A'}`, x + 10, 157);
                doc.text(`Nakshatra: ${kundli.nakshatra ?? 'N/A'}`, x + 10, 172);
                doc.text(`Nadi:         ${kundli.nadi ?? 'N/A'}`, x + 10, 187);
                doc.text(`Gotra:        ${kundli.gotra ?? 'N/A'}`, x + 10, 202);
            };
            drawProfileBox(50, kundli1, 'Profile 1 (Bride / Groom)');
            drawProfileBox(320, kundli2, 'Profile 2 (Bride / Groom)');

            // Score badge
            const scoreColor = result.totalScore < 18 ? '#C0392B'
                : result.totalScore < 24 ? '#E67E22'
                : result.totalScore < 30 ? '#27AE60' : '#1A7A4A';
            doc.rect(195, 108, 120, 114).fill(scoreColor);
            doc.fillColor('#fff').fontSize(42).font('Helvetica-Bold')
                .text(`${result.totalScore}`, 195, 120, { width: 120, align: 'center' });
            doc.fontSize(11).text('out of 36', 195, 168, { width: 120, align: 'center' });
            doc.fontSize(9).text(result.compatibility.toUpperCase(), 195, 186, { width: 120, align: 'center' });
            doc.fontSize(8).text(`${result.percentage}%`, 195, 200, { width: 120, align: 'center' });

            // Ashta Koota Breakdown Table
            doc.fillColor('#4A0E2E').fontSize(13).font('Helvetica-Bold')
                .text('Ashta Koota Breakdown', 50, 245);
            doc.moveTo(50, 261).lineTo(545, 261).strokeColor('#D4AF37').lineWidth(1).stroke();

            const kootaRows: [string, string, number, number][] = [
                ['Nadi (Physiological)',      'Health & biological compatibility', result.breakdown.nadi,        8],
                ['Bhakoot (Moon Sign)',        'Emotional & mental harmony',        result.breakdown.bhakoot,     7],
                ['Gana (Temperament)',         'Behavioural compatibility',          result.breakdown.gana,        6],
                ['Graha Maitri (Planets)',     'Intellectual compatibility',         result.breakdown.grahaMaitri, 5],
                ['Yoni (Sexual)',              'Physical & intimate compatibility',  result.breakdown.yoni,        4],
                ['Tara (Birth Star)',          'Destiny & fortune alignment',        result.breakdown.tara,        3],
                ['Vashya (Dominance)',         'Power dynamics & control',           result.breakdown.vashya,      2],
                ['Varna (Spiritual)',          'Spiritual order compatibility',      result.breakdown.varna,       1],
            ];

            let y = 270;
            doc.fillColor('#4A0E2E').fontSize(9).font('Helvetica-Bold');
            doc.text('Koota', 50, y).text('Description', 185, y)
                .text('Score', 420, y).text('Max', 470, y)
                .text('Progress', 500, y);
            y += 14;
            doc.moveTo(50, y).lineTo(545, y).strokeColor('#DDD').lineWidth(0.5).stroke();
            y += 5;

            kootaRows.forEach(([name, desc, score, max], i) => {
                const bg = i % 2 === 0 ? '#FFF8F0' : '#FFFFFF';
                doc.rect(50, y - 2, 495, 16).fill(bg);

                const barWidth = Math.round((score / max) * 90);
                const barColor = score === 0 ? '#E74C3C' : score >= max * 0.6 ? '#27AE60' : '#F39C12';
                doc.rect(500, y, 90, 10).fill('#EEE');
                if (barWidth > 0) doc.rect(500, y, barWidth, 10).fill(barColor);

                doc.fillColor('#333').fontSize(8.5).font('Helvetica-Bold').text(name, 50, y + 1);
                doc.font('Helvetica').text(desc, 185, y + 1, { width: 225 });
                doc.fillColor(barColor).font('Helvetica-Bold').text(`${score}`, 425, y + 1);
                doc.fillColor('#999').font('Helvetica').text(`/${max}`, 445, y + 1);
                y += 18;
            });

            // Verdict
            y += 10;
            const verdictBg = result.auspicious ? '#E8F8F0' : '#FDECEA';
            const verdictBorder = result.auspicious ? '#27AE60' : '#C0392B';
            doc.rect(50, y, 495, 40).fill(verdictBg).strokeColor(verdictBorder).lineWidth(1).stroke();
            doc.fillColor(verdictBorder).fontSize(10).font('Helvetica-Bold')
                .text(result.auspicious ? '✓ Auspicious Match' : '⚠ Consult Astrologer', 60, y + 6);
            doc.fillColor('#333').fontSize(9).font('Helvetica')
                .text(result.verdict, 60, y + 20, { width: 475 });
            y += 52;

            // Dosha section
            if (result.dosha.length > 0) {
                doc.fillColor('#4A0E2E').fontSize(12).font('Helvetica-Bold').text('Dosha Detected', 50, y);
                y += 16;
                result.dosha.forEach((d) => {
                    doc.rect(50, y, 495, 16).fill('#FDECEA');
                    doc.fillColor('#C0392B').fontSize(9).font('Helvetica-Bold').text(`⚠ ${d}`, 55, y + 3);
                    y += 18;
                });
                y += 6;
            }

            // Remedies
            if (result.remedies.length > 0) {
                doc.fillColor('#4A0E2E').fontSize(12).font('Helvetica-Bold').text('Recommended Remedies', 50, y);
                doc.moveTo(50, y + 16).lineTo(545, y + 16).strokeColor('#D4AF37').lineWidth(1).stroke();
                y += 22;
                result.remedies.forEach((remedy) => {
                    doc.fillColor('#444').fontSize(9).font('Helvetica')
                        .text(`• ${remedy}`, 55, y, { width: 480 });
                    y += doc.heightOfString(remedy, { width: 480 }) + 4;
                });
            }

            // Footer
            const ph = doc.page.height;
            doc.rect(0, ph - 42, 595, 42).fill('#4A0E2E');
            doc.fillColor('#D4AF37').fontSize(9).font('Helvetica')
                .text(
                    'AstroPravin | Acharya Pravin | Traditional Vedic Astrology | Solapur, Maharashtra',
                    50, ph - 30, { align: 'center' },
                );
            doc.fillColor('#FAF6F0').fontSize(8)
                .text('This report is for guidance only. Consult a qualified Jyotishi for final decisions.', 50, ph - 18, { align: 'center' });

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
}
