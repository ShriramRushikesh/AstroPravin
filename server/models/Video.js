import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    ytId: { type: String, required: true }, // YouTube Video ID
    description: { type: String },
    views: { type: String, default: '0' }, // Manual or fetched
    date: { type: String }, // Display date string (e.g., "2 days ago")
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Video', VideoSchema);
