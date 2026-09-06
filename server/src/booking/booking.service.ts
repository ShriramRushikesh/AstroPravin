import { Injectable, OnModuleInit, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { EmailService } from '../shared/email.service';
import { CreateBookingDto, CreateBookingRazorpayOrderDto, VerifyAndCreateBookingDto } from './dto/create-booking.dto';

const Razorpay = require('razorpay');

@Injectable()
export class BookingService implements OnModuleInit {
    constructor(
        @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
        private emailService: EmailService,
    ) { }

    async onModuleInit() {
        // Live database mode - real bookings only
    }

    private getRazorpayKeys() {
        const keyId = process.env.RAZORPAY_KEY_ID || '';
        const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
        return { keyId, keySecret };
    }

    private getRazorpayClient() {
        const { keyId, keySecret } = this.getRazorpayKeys();
        if (!keyId || !keySecret) {
            throw new BadRequestException('Razorpay credentials are not configured in environment variables.');
        }
        return new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });
    }

    /**
     * Create Razorpay Order for Consultation Booking
     */
    async createRazorpayOrder(dto: CreateBookingRazorpayOrderDto) {
        if (!dto.name || !dto.phone) {
            throw new BadRequestException('Devotee name and phone number are required.');
        }

        const feeAmount = Number(dto.amount) > 0 ? Number(dto.amount) : 1100;
        const amountInPaise = Math.round(feeAmount * 100);
        const receipt = `BK-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 900 + 100)}`;

        const { keyId } = this.getRazorpayKeys();
        const razorpay = this.getRazorpayClient();

        try {
            const order = await razorpay.orders.create({
                amount: amountInPaise,
                currency: 'INR',
                receipt,
                notes: {
                    customerName: dto.name,
                    customerPhone: dto.phone,
                    topic: dto.topic || 'Vedic Astrology Consultation',
                    type: 'consultation_booking',
                },
            });

            return {
                success: true,
                orderId: order.id,
                amount: feeAmount,
                amountInPaise: order.amount,
                currency: order.currency || 'INR',
                receipt,
                keyId,
            };
        } catch (err: any) {
            console.error('❌ Booking Razorpay order creation failed:', err);
            throw new BadRequestException(err?.error?.description || err.message || 'Failed to initialize payment gateway.');
        }
    }

    /**
     * Verify Payment Signature & Create Confirmed Booking in Database
     */
    async verifyAndCreate(dto: VerifyAndCreateBookingDto): Promise<{ success: boolean; booking: Booking; receiptNumber: string }> {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            bookingData,
            amount,
        } = dto;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            throw new BadRequestException('Payment confirmation signature missing.');
        }

        const { keySecret } = this.getRazorpayKeys();

        // 1. Verify HMAC-SHA256 Cryptographic Signature (Timing-Safe)
        const expectedSignature = crypto
            .createHmac('sha256', keySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        const expectedBuf = Buffer.from(expectedSignature, 'utf8');
        const receivedBuf = Buffer.from(razorpay_signature, 'utf8');

        if (expectedBuf.length !== receivedBuf.length || !crypto.timingSafeEqual(expectedBuf, receivedBuf)) {
            console.error('❌ Booking Payment Signature Mismatch:', {
                expected: expectedSignature,
                received: razorpay_signature,
            });
            throw new BadRequestException('Invalid payment signature. Verification failed.');
        }

        // 2. Anti-Replay Check (Avoid duplicate booking creation for same payment ID)
        const existing = await this.bookingModel.findOne({
            'paymentDetails.razorpay_payment_id': razorpay_payment_id,
        });

        if (existing) {
            return {
                success: true,
                booking: existing,
                receiptNumber: existing.receiptNumber || `BK-${razorpay_payment_id.slice(-6)}`,
            };
        }

        // 3. Create confirmed paid booking
        const receiptNumber = `ASTRO-BK-${Date.now().toString().slice(-6)}`;
        const finalAmount = amount || bookingData.amount || 1100;

        const payload = {
            ...bookingData,
            phone: bookingData.phone || bookingData.mobile,
            birthDate: bookingData.birthDate || bookingData.dob,
            birthTime: bookingData.birthTime || bookingData.tob,
            birthPlace: bookingData.birthPlace || bookingData.pob,
            preferredDate: bookingData.preferredDate || bookingData.date,
            preferredTime: bookingData.preferredTime || bookingData.time,
            status: 'Confirmed',
            paymentStatus: 'paid',
            paymentMethod: 'razorpay',
            amount: finalAmount,
            receiptNumber,
            paymentDetails: {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                amount: finalAmount,
                paidAt: new Date(),
            },
            type: 'Consultation Booking',
        };

        const newBooking = new this.bookingModel(payload);
        await newBooking.save();

        // 4. Send Email Notification + Google Calendar Invitation (.ics) to Devotee and pravin.shriram@gmail.com
        try {
            this.emailService.sendBookingConfirmation(newBooking);
        } catch (e) {
            console.warn('Could not dispatch booking email:', e);
        }

        return {
            success: true,
            booking: newBooking,
            receiptNumber,
        };
    }

    async create(createBookingDto: any): Promise<Booking> {
        const payload = {
            ...createBookingDto,
            phone: createBookingDto.phone || createBookingDto.mobile,
            birthDate: createBookingDto.birthDate || createBookingDto.dob,
            birthTime: createBookingDto.birthTime || createBookingDto.tob,
            birthPlace: createBookingDto.birthPlace || createBookingDto.pob,
            preferredDate: createBookingDto.preferredDate || createBookingDto.date,
            preferredTime: createBookingDto.preferredTime || createBookingDto.time,
            status: createBookingDto.status || 'Confirmed',
            paymentStatus: createBookingDto.paymentStatus || 'paid',
            receiptNumber: createBookingDto.receiptNumber || `ASTRO-BK-${Date.now().toString().slice(-6)}`,
        };
        const newBooking = new this.bookingModel(payload);
        await newBooking.save();

        // Async email notification with Google Calendar .ics invite
        try {
            this.emailService.sendBookingConfirmation(newBooking);
        } catch (e) {
            console.warn('Could not dispatch booking email:', e);
        }

        return newBooking;
    }

    async findAll(): Promise<Booking[]> {
        return this.bookingModel.find().sort({ createdAt: -1 }).exec();
    }

    async findById(id: string): Promise<Booking | null> {
        return this.bookingModel.findById(id).exec();
    }

    async updateStatus(id: string, status: string): Promise<Booking | null> {
        return this.bookingModel
            .findByIdAndUpdate(id, { status }, { new: true })
            .exec();
    }

    async remove(id: string): Promise<Booking | null> {
        return this.bookingModel.findByIdAndDelete(id).exec();
    }

    async clearDemoData(): Promise<{ deletedCount: number }> {
        const result = await this.bookingModel.deleteMany({
            name: { $in: ['Rahul Deshmukh', 'Priyanka Kulkarni', 'Amitabh Joshi', 'Snehal Patil', 'Sachin Shinde', 'Ananya Kadam', 'Mahesh Gaikwad'] }
        }).exec();
        return { deletedCount: result.deletedCount || 0 };
    }
}

