import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }, // URL to image
    description: { type: String, required: true },
    category: { type: String, required: true, enum: ['gemstones', 'yantras', 'kawach', 'rudraksha', 'other'] },
    inStock: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Product', ProductSchema);
