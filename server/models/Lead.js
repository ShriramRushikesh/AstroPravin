import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    dob: { type: String, required: true }, // Format: DD/MM/YYYY
    tob: { type: String, required: true }, // Format: HH:MM
    pob: { type: String, required: true },
    pdfPath: { type: String }, // Path to generated PDF
    whatsappStatus: { type: String, default: 'pending' }, // pending, sent, failed
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Lead', LeadSchema);
