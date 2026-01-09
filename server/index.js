import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';

// Define paths early
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
// Serve static files from server/public using absolute path
app.use('/public', express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/astropravin';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
// Custom imports
import Booking from './models/Booking.js';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

import Lead from './models/Lead.js';

// GET: Fetch all leads (Protected)
app.get('/api/leads', authenticateToken, async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json(leads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: Fetch all bookings (Protected)
app.get('/api/bookings', authenticateToken, async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Create a new booking (Public)
app.post('/api/bookings', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();

        // Send confirmation email (async, don't block response)
        sendBookingConfirmation(newBooking).catch(err => console.error('Email Service Error:', err));

        res.status(201).json(newBooking);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT: Update booking status (Protected)
app.put('/api/bookings/:id', authenticateToken, async (req, res) => {
    try {
        const { status } = req.body;
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(updatedBooking);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Kundli & PDF Routes
import { calculateKundli } from './utils/kundli.js';
import { generatePDF } from './utils/pdfGenerator.js';
import { sendWhatsApp } from './services/whatsappService.js';
import Product from './models/Product.js';
import Video from './models/Video.js';
import Order from './models/Order.js';
import Blog from './models/Blog.js';
import Visitor from './models/Visitor.js';

import { sendBookingConfirmation } from './services/emailService.js';

app.post('/api/kundli/generate', async (req, res) => {
    try {
        const { name, day, month, year, hour, minute, place, mobile } = req.body;
        const dob = `${day}/${month}/${year}`;
        const tob = `${hour}:${minute}`;

        // 1. Calculate Data
        const kundliData = calculateKundli(dob, tob, place);

        // 2. Generate PDF
        const fileName = `${name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
        const uploadsDir = path.join(__dirname, 'public', 'kundlis');

        // Ensure folder exists (fs.mkdir ideally in startup, but here for safety)
        const fs = await import('fs');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const filePath = path.join(uploadsDir, fileName);
        await generatePDF({ name, dob, tob, pob: place }, kundliData, filePath);

        // 3. Save Lead
        const pdfUrl = `${req.protocol}://${req.get('host')}/public/kundlis/${fileName}`;
        const lead = new Lead({
            name,
            mobile,
            dob,
            tob,
            pob: place,
            pdfPath: filePath,
            whatsappStatus: 'pending'
        });
        await lead.save();

        // 4. Send WhatsApp
        const waResult = await sendWhatsApp(mobile, name, pdfUrl);
        if (waResult.success) {
            lead.whatsappStatus = 'sent';
            await lead.save();
        }

        res.json({ success: true, kundliData, pdfUrl });

    } catch (err) {
        console.error("Kundli Error:", err);
        res.status(500).json({ error: 'Failed to generate Kundli' });
    }
});

// Admin Login
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ success: true, token });
    } else {
        res.status(401).json({ success: false, message: 'Invalid Password' });
    }
});

// --- File Upload Configuration ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'public', 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
    }
});
const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/public/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

// --- Product Routes ---
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find({ inStock: true });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/products', authenticateToken, async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/products/:id', authenticateToken, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Video Routes ---
app.get('/api/videos', async (req, res) => {
    try {
        const videos = await Video.find().sort({ createdAt: -1 });
        res.json(videos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/videos', authenticateToken, async (req, res) => {
    try {
        const newVideo = new Video(req.body);
        await newVideo.save();
        res.status(201).json(newVideo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/videos/:id', authenticateToken, async (req, res) => {
    try {
        await Video.findByIdAndDelete(req.params.id);
        res.json({ message: 'Video deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/videos/:id', authenticateToken, async (req, res) => {
    try {
        const updatedVideo = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedVideo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- Order Routes ---
app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/orders', authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/orders/:id', authenticateToken, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedOrder);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- Blog Routes ---
app.get('/api/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/blogs/:slug', async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug });
        if (!blog) return res.status(404).json({ error: 'Blog not found' });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/blogs', authenticateToken, async (req, res) => {
    try {
        const newBlog = new Blog(req.body);
        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/blogs/:id', authenticateToken, async (req, res) => {
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedBlog);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/blogs/:id', authenticateToken, async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: 'Blog deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Visitor Routes ---
app.get('/api/visits', async (req, res) => {
    try {
        let visitor = await Visitor.findOne();
        if (!visitor) {
            visitor = new Visitor({ count: 0 });
            await visitor.save();
        }
        res.json({ count: visitor.count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/visits/increment', async (req, res) => {
    try {
        let visitor = await Visitor.findOne();
        if (!visitor) {
            visitor = new Visitor({ count: 1 });
        } else {
            visitor.count += 1;
            visitor.lastUpdated = Date.now();
        }
        await visitor.save();
        res.json({ count: visitor.count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
