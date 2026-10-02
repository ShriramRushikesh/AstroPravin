import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Razorpay = require('razorpay');

@Injectable()
export class PaymentService {
    private razorpayClient: any = null;
    private keyId: string = '';
    private keySecret: string = '';
    private readonly logger = new Logger(PaymentService.name);

    constructor(private configService: ConfigService) {
        this.initClient();
    }

    private initClient() {
        this.keyId = process.env.RAZORPAY_KEY_ID || this.configService.get<string>('RAZORPAY_KEY_ID') || '';
        this.keySecret = process.env.RAZORPAY_KEY_SECRET || this.configService.get<string>('RAZORPAY_KEY_SECRET') || '';

        if (this.keyId && this.keySecret) {
            try {
                this.razorpayClient = new Razorpay({
                    key_id: this.keyId,
                    key_secret: this.keySecret,
                });
                this.logger.log(`✅ Razorpay initialized successfully with Key: ${this.keyId.slice(0, 8)}...`);
            } catch (err) {
                this.logger.error('❌ Failed to initialize Razorpay client', err);
            }
        } else {
            this.logger.warn('⚠️ RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET missing in environment');
        }
    }

    getKeyId(): string {
        if (!this.keyId) this.initClient();
        return this.keyId;
    }

    async createOrder(amount: number, currency: string = 'INR', receipt?: string, notes?: Record<string, string>) {
        if (!this.razorpayClient) {
            this.initClient();
        }

        if (!this.razorpayClient) {
            throw new Error('Razorpay credentials not configured on the server');
        }

        const options = {
            amount: Math.round(amount * 100), // Razorpay accepts amount in paise
            currency: currency || 'INR',
            receipt: receipt || `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            notes: notes || {},
        };

        const order = await this.razorpayClient.orders.create(options);
        return {
            ...order,
            key_id: this.keyId,
        };
    }

    verifySignature(orderId: string, paymentId: string, signature: string): boolean {
        if (!this.keySecret) {
            this.initClient();
        }
        if (!this.keySecret) {
            throw new Error('Razorpay Key Secret is missing for signature verification');
        }

        const body = `${orderId}|${paymentId}`;
        const expectedSignature = crypto
            .createHmac('sha256', this.keySecret)
            .update(body.toString())
            .digest('hex');

        return expectedSignature === signature;
    }
}
