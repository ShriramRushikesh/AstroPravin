export class CreateStoreRazorpayOrderDto {
  amount: number; // in Rupees or calculated from items
  currency?: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    carat?: string;
    image?: string;
    category?: string;
  }>;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  shipping: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
}

export class VerifyStorePaymentDto {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    carat?: string;
    image?: string;
    category?: string;
  }>;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  shipping: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  totalAmount: number;
}

export class UpdateOrderStatusDto {
  status: string;
  trackingNumber?: string;
  courierName?: string;
  notes?: string;
}
