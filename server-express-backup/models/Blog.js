import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true }, // Rich text or HTML
    author: { type: String, default: 'Astro Pravin' },
    image: { type: String }, // URL
    category: { type: String, default: 'Astrology' },
    views: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Blog', BlogSchema);
