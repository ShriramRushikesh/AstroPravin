import { BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { MatrimonyPaymentService } from './matrimony-payment.service';

describe('MatrimonyPaymentService - Razorpay HMAC Signature Verification', () => {
  let service: MatrimonyPaymentService;
  const mockSecret = 'matrimony_test_secret_998877';
  let mockUserModel: any;
  let mockProfileModel: any;

  beforeEach(() => {
    process.env.RAZORPAY_KEY_SECRET = mockSecret;

    mockUserModel = {
      findById: jest.fn().mockResolvedValue({
        _id: 'user_123',
        username: 'devotee1',
        paymentStatus: 'pending',
        save: jest.fn().mockResolvedValue(true),
      }),
      findOne: jest.fn().mockResolvedValue(null),
    };

    mockProfileModel = {
      findOne: jest.fn().mockResolvedValue(null),
    };

    service = new MatrimonyPaymentService(mockUserModel as any, mockProfileModel as any);
  });

  afterEach(() => {
    delete process.env.RAZORPAY_KEY_SECRET;
  });

  it('should verify and accept valid Razorpay payment signature for matrimony plan', async () => {
    const orderId = 'order_mat_123';
    const paymentId = 'pay_mat_456';

    const validSignature = crypto
      .createHmac('sha256', mockSecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const result = await service.verifyPayment('user_123', {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: validSignature,
      planId: 'gold_6m',
    });

    expect(result.success).toBe(true);
    expect(result.paymentStatus).toBe('verified');
  });

  it('should reject forged or mismatched payment signature with BadRequestException', async () => {
    const orderId = 'order_mat_123';
    const paymentId = 'pay_mat_456';
    const invalidSignature = 'invalid_tampered_signature_1234567890abcdef';

    await expect(
      service.verifyPayment('user_123', {
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: invalidSignature,
        planId: 'gold_6m',
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
