import { Injectable, BadRequestException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { Order, OrderDocument } from '../shared/schemas/order.schema';
import { CreateStoreRazorpayOrderDto, VerifyStorePaymentDto, UpdateOrderStatusDto } from './dto/order.dto';

// Dynamic Razorpay SDK import with fallback
let RazorpaySDK: any = null;
try {
  RazorpaySDK = require('razorpay');
} catch (e) {
  console.warn('Razorpay package not found, falling back to direct REST API if needed.');
}

@Injectable()
export class OrdersService implements OnModuleInit {
  private razorpayInstance: any = null;
  private keyId: string;
  private keySecret: string;

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {
    this.keyId = process.env.RAZORPAY_KEY_ID || 'rzp_live_TTh5QILIguQeO2';
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || '5O82Kpna2iulNVmXtiOPnGw7';
  }

  onModuleInit() {
    this.initRazorpay();
  }

  private initRazorpay() {
    try {
      if (RazorpaySDK && this.keyId && this.keySecret) {
        this.razorpayInstance = new RazorpaySDK({
          key_id: this.keyId,
          key_secret: this.keySecret,
        });
        console.log('✅ Store Razorpay Service initialized with Key ID:', this.keyId);
      } else {
        console.warn('⚠️ Razorpay credentials missing or SDK unavailable.');
      }
    } catch (err: any) {
      console.error('Failed to initialize Razorpay for Store:', err.message);
    }
  }

  /**
   * Create Razorpay Order for Store Products Checkout
   */
  async createRazorpayOrder(dto: CreateStoreRazorpayOrderDto) {
    // 1. Sanitize and calculate robust order amount
    let finalAmount = Number(dto.amount);
    if (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) {
      if (dto.items && Array.isArray(dto.items) && dto.items.length > 0) {
        finalAmount = dto.items.reduce((sum, it) => {
          const itemPrice = Number(String(it.price).replace(/[^0-9.]/g, '')) || 0;
          const itemQty = Number(it.quantity) || 1;
          return sum + (itemPrice * itemQty);
        }, 0);
      }
    }

    if (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) {
      throw new BadRequestException('Invalid total order amount. Please check your cart items.');
    }

    if (!dto.customer || !dto.customer.name || !dto.customer.phone) {
      throw new BadRequestException('Customer name and mobile phone number are required.');
    }

    const amountInPaise = Math.round(finalAmount * 100);
    const receipt = `ORD-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 900 + 100)}`;

    if (!this.razorpayInstance) {
      this.initRazorpay();
    }

    if (!this.razorpayInstance) {
      throw new BadRequestException('Payment Gateway is currently unavailable. Please try again in a few moments.');
    }

    try {
      const order = await this.razorpayInstance.orders.create({
        amount: amountInPaise,
        currency: dto.currency || 'INR',
        receipt: receipt,
        notes: {
          customerName: dto.customer.name,
          customerPhone: dto.customer.phone,
          itemCount: String(dto.items?.length || 1),
          orderType: 'store_product_purchase',
        },
      });

      return {
        orderId: order.id,
        amount: finalAmount,
        amountInPaise: order.amount,
        currency: order.currency,
        receipt: receipt,
        keyId: this.keyId,
      };
    } catch (err: any) {
      console.error('Store Razorpay Order creation error:', err);
      throw new BadRequestException(err?.error?.description || err.message || 'Failed to create payment order.');
    }
  }

  /**
   * Verify Razorpay Payment Signature & Save Order in MongoDB
   */
  async verifyPayment(dto: VerifyStorePaymentDto) {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      customer,
      shipping,
      totalAmount,
    } = dto;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new BadRequestException('Missing payment confirmation parameters.');
    }

    // 1. Verify HMAC-SHA256 Cryptographic Signature (Timing-Safe)
    const expectedSignature = crypto
      .createHmac('sha256', this.keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const expectedBuf = Buffer.from(expectedSignature, 'utf8');
    const receivedBuf = Buffer.from(razorpay_signature, 'utf8');

    if (expectedBuf.length !== receivedBuf.length || !crypto.timingSafeEqual(expectedBuf, receivedBuf)) {
      console.error('❌ Store Payment Signature Mismatch:', {
        expected: expectedSignature,
        received: razorpay_signature,
      });
      throw new BadRequestException('Invalid payment signature. Verification failed.');
    }

    // 2. Anti-Replay Check (Avoid duplicate orders for same payment ID)
    const existingOrder = await this.orderModel.findOne({
      'paymentDetails.razorpay_payment_id': razorpay_payment_id,
    });

    if (existingOrder) {
      return {
        success: true,
        message: 'Order already verified.',
        order: existingOrder,
      };
    }

    // 3. Format primary product name summary for legacy view
    const primaryProductName = items && items.length > 0
      ? items.map(it => `${it.name} (x${it.quantity || 1})`).join(', ')
      : 'Vedic Spiritual Artifacts';

    const receiptNumber = `ASTRO-STORE-${Date.now().toString().slice(-6)}`;
    const finalPaidAmount = Number(totalAmount) || (items ? items.reduce((s, it) => s + (Number(it.price) * (Number(it.quantity) || 1)), 0) : 0);

    // 4. Save New Verified Order to MongoDB
    const newOrder = new this.orderModel({
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email || '',
      shippingAddress: shipping.address,
      city: shipping.city,
      state: shipping.state,
      pincode: shipping.pincode,
      landmark: shipping.landmark || '',
      items: items || [],
      productName: primaryProductName,
      productPrice: finalPaidAmount,
      totalAmount: finalPaidAmount,
      paymentMethod: 'razorpay',
      paymentDetails: {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        status: 'captured',
        paidAt: new Date(),
      },
      status: 'Paid',
      receiptNumber: receiptNumber,
      notes: `Online Order paid via Razorpay (Payment ID: ${razorpay_payment_id})`,
    });

    await newOrder.save();

    return {
      success: true,
      message: 'Payment verified and order placed successfully!',
      orderId: newOrder._id,
      receiptNumber: receiptNumber,
      paymentId: razorpay_payment_id,
      order: newOrder,
    };
  }

  /**
   * Find all orders (for Admin Dashboard)
   */
  async findAll(): Promise<Order[]> {
    return this.orderModel.find().sort({ createdAt: -1 }).exec();
  }

  /**
   * Find order by ID
   */
  async findById(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    return order;
  }

  /**
   * Update Order Status & Courier Tracking (from Admin Dashboard)
   */
  async updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<Order> {
    const updatePayload: any = { status: dto.status };
    if (dto.trackingNumber !== undefined) updatePayload.trackingNumber = dto.trackingNumber;
    if (dto.courierName !== undefined) updatePayload.courierName = dto.courierName;
    if (dto.notes !== undefined) updatePayload.notes = dto.notes;

    const updated = await this.orderModel.findByIdAndUpdate(id, updatePayload, { new: true }).exec();
    if (!updated) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    return updated;
  }

  /**
   * Delete Order (Admin only)
   */
  async remove(id: string): Promise<{ message: string }> {
    const deleted = await this.orderModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    return { message: 'Order deleted successfully' };
  }
}
