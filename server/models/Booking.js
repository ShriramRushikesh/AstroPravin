import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    date: String,
    time: String,
    birthDate: String,
    birthTime: String,
    birthPlace: String,
    topic: String, // e.g., 'Love', 'Career'
    astrologer: String,
    status: { type: String, default: 'Pending' }, // Pending, Completed, Cancelled
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Booking', bookingSchema);
