import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    productName: { type: String, required: true },
    productPrice: { type: Number, required: true },
    status: { type: String, default: 'Pending', enum: ['Pending', 'Confirmed', 'Shipped', 'Completed', 'Cancelled'] },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', OrderSchema);
