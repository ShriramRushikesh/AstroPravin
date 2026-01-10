import PDFDocument = require('pdfkit');
import * as fs from 'fs';

export const generatePDF = (userData, kundliData, outputPath) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(outputPath);

        doc.pipe(stream);

        // --- Background & Watermark ---
        doc.save();
        doc.rotate(-45, { origin: [300, 400] });
        doc.fontSize(60);
        doc.fillColor('gray');
        doc.opacity(0.1);
        doc.text('ASTROPRAVIN.COM', 0, 400, { align: 'center', width: 600 });
        doc.text('FOR PERSONAL USE ONLY', 0, 500, { align: 'center', width: 600 });
        doc.restore();

        // --- Header ---
        doc.opacity(1).fillColor('black');
        doc.fontSize(24).font('Helvetica-Bold').text('AstroPravin', { align: 'center' });
        doc.fontSize(10).font('Helvetica').text('Unlock Your Cosmic Potential', { align: 'center' });
        doc.moveDown(2);

        // --- Title ---
        doc.fontSize(20).font('Helvetica-Bold').fillColor('#EAB308').text('Vedic Kundli Report', { align: 'center' });
        doc.moveDown(1.5);

        // --- Birth Details ---
        doc.fontSize(12).font('Helvetica-Bold').fillColor('black').text('Birth Details:', { underline: true });
        doc.moveDown(0.5);
        doc.font('Helvetica').text(`Name: ${userData.name}`);
        doc.text(`Date of Birth: ${userData.dob}`);
        doc.text(`Time of Birth: ${userData.tob}`);
        doc.text(`Place of Birth: ${userData.pob}`);
        doc.moveDown(2);

        // --- Planetary Details Box ---
        const startY = doc.y;
        doc.rect(50, startY, 500, 140).stroke(); // Box

        doc.text('Lagna (Ascendant):', 70, startY + 20);
        doc.font('Helvetica-Bold').text(kundliData.lagna, 200, startY + 20);

        doc.font('Helvetica').text('Moon Sign (Rashi):', 70, startY + 50);
        doc.font('Helvetica-Bold').text(kundliData.moonSign, 200, startY + 50);

        doc.font('Helvetica').text('Nakshatra:', 70, startY + 80);
        doc.font('Helvetica-Bold').text(kundliData.nakshatra, 200, startY + 80);

        doc.font('Helvetica').text('Current Mahadasha:', 70, startY + 110);
        doc.font('Helvetica-Bold').text(kundliData.currentDasha, 200, startY + 110);

        doc.moveDown(4);

        // --- Insights ---
        doc.fontSize(14).font('Helvetica-Bold').text('Cosmic Insights', 50, doc.y + 130);
        doc.moveDown(0.5);

        doc.fontSize(12).font('Helvetica-Bold').text('Personality:', { continued: true });
        doc.font('Helvetica').text(` ${kundliData.personality}`);
        doc.moveDown(0.5);

        doc.font('Helvetica-Bold').text('Career:', { continued: true });
        doc.font('Helvetica').text(` ${kundliData.career}`);
        doc.moveDown(0.5);

        doc.font('Helvetica-Bold').text('Relationships:', { continued: true });
        doc.font('Helvetica').text(` ${kundliData.relationship}`);
        doc.moveDown(2);

        // --- Footer CTA ---
        doc.rect(50, 700, 500, 50).fill('#FFF7ED'); // Light orange bg
        doc.fillColor('#D97706') // Dark orange text
            .fontSize(12)
            .font('Helvetica-Bold')
            .text('Unlock Full Kundli & Remedies – Book Consultation', 50, 718, {
                align: 'center',
                link: 'https://astropravin.com/book',
                width: 500
            });

        doc.end();

        stream.on('finish', () => resolve(outputPath));
        stream.on('error', (err) => reject(err));
    });
};
