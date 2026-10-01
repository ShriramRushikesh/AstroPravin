import { Controller, Post, Get, Body, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    /** Public config to get Razorpay Key ID for client checkout */
    @Get('config')
    getConfig() {
        return {
            key_id: this.paymentService.getKeyId(),
        };
    }

    /** Create a Razorpay order and return the order details to frontend */
    @Post('order')
    async createOrder(@Body() body: { amount: number; currency?: string; receipt?: string; notes?: Record<string, string> }) {
        try {
            const { amount, currency = 'INR', receipt, notes } = body;
            if (!amount || amount < 1) {
                throw new HttpException('Invalid amount', HttpStatus.BAD_REQUEST);
            }
            const order = await this.paymentService.createOrder(amount, currency, receipt, notes);
            return order;
        } catch (err) {
            if (err instanceof HttpException) throw err;
            throw new HttpException(err?.message || 'Failed to create payment order', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /** Verify Razorpay signature after successful payment */
    @Post('verify')
    async verifyPayment(
        @Body() body: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
        }
    ) {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
            if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
                throw new HttpException('Missing payment verification fields', HttpStatus.BAD_REQUEST);
            }
            const isValid = this.paymentService.verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
            if (!isValid) {
                throw new HttpException('Payment verification failed — invalid signature', HttpStatus.FORBIDDEN);
            }
            return { success: true, message: 'Payment verified successfully' };
        } catch (err) {
            if (err instanceof HttpException) throw err;
            throw new HttpException(err?.message || 'Verification error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
