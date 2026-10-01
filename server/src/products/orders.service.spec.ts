import { BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { OrdersService } from './orders.service';

describe('OrdersService - Razorpay HMAC Signature Verification', () => {
  let service: OrdersService;
  const mockSecret = 'test_secret_key_12345';
  let mockOrderModel: any;

  beforeEach(() => {
    process.env.RAZORPAY_KEY_SECRET = mockSecret;

    // Mock Mongoose Order Model
    mockOrderModel = jest.fn().mockImplementation((dto) => ({
      ...dto,
      _id: 'mock_order_id_123',
      save: jest.fn().mockResolvedValue(true),
    }));
    mockOrderModel.findOne = jest.fn().mockResolvedValue(null);

    service = new OrdersService(mockOrderModel as any);
  });

  afterEach(() => {
    delete process.env.RAZORPAY_KEY_SECRET;
  });

  it('should accept and verify a valid Razorpay HMAC SHA-256 signature', async () => {
    const orderId = 'order_valid_12345';
    const paymentId = 'pay_valid_67890';

    // Cryptographically compute expected HMAC signature
    const validSignature = crypto
      .createHmac('sha256', mockSecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const result = await service.verifyPayment({
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: validSignature,
      customer: { name: 'Rahul Sharma', phone: '+919876543210', email: 'rahul@example.com' },
      shipping: { address: '123 MG Road', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
      items: [{ productId: 'prod_123', name: 'Vedic Yantra', price: 1100, quantity: 1 }],
      totalAmount: 1100,
    });

    expect(result.success).toBe(true);
    expect(result.paymentId).toBe(paymentId);
    expect(result.message).toContain('Payment verified');
  });

  it('should reject and throw BadRequestException for an invalid / forged Razorpay signature', async () => {
    const orderId = 'order_valid_12345';
    const paymentId = 'pay_valid_67890';
    const forgedSignature = 'forged_fake_signature_hex_value_00000000000000000000000000000000';

    await expect(
      service.verifyPayment({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: forgedSignature,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should reject when order_id or payment_id is tampered even with a valid hash structure', async () => {
    const orderId = 'order_valid_12345';
    const paymentId = 'pay_valid_67890';
    const tamperedOrderId = 'order_tampered_99999';

    // Signature generated for original order, but submitted with tampered order ID
    const signatureForOriginal = crypto
      .createHmac('sha256', mockSecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    await expect(
      service.verifyPayment({
        razorpay_order_id: tamperedOrderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signatureForOriginal,
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
