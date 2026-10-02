import { API_URL } from '../config';

/**
 * Dynamically loads the Razorpay checkout script if not already present.
 */
export const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (typeof window !== 'undefined' && window.Razorpay) {
            resolve(true);
            return;
        }
        const existingScript = document.getElementById('razorpay-checkout-script');
        if (existingScript) {
            existingScript.onload = () => resolve(true);
            existingScript.onerror = () => resolve(false);
            return;
        }
        const script = document.createElement('script');
        script.id = 'razorpay-checkout-script';
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => {
            console.error('Failed to load Razorpay SDK');
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

/**
 * Fetch Razorpay Key ID from environment or backend config endpoint
 */
export const getRazorpayKey = async () => {
    if (import.meta.env.VITE_RAZORPAY_KEY_ID) {
        return import.meta.env.VITE_RAZORPAY_KEY_ID;
    }
    try {
        const res = await fetch(`${API_URL}/api/payments/config`);
        if (res.ok) {
            const data = await res.json();
            if (data.key_id) return data.key_id;
        }
    } catch (e) {
        console.warn('Could not fetch Razorpay config from backend:', e);
    }
    return 'rzp_live_Th9OrjJuzf9j5f'; // fallback to configured key
};

/**
 * Create a Razorpay Order on the backend
 */
export const createPaymentOrder = async ({ amount, currency = 'INR', receipt, notes = {} }) => {
    const res = await fetch(`${API_URL}/api/payments/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            amount: Number(amount),
            currency,
            receipt,
            notes,
        }),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to initialize payment order');
    }

    return await res.json();
};

/**
 * Verify Razorpay payment signature on the backend
 */
export const verifyPaymentSignature = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
    const res = await fetch(`${API_URL}/api/payments/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        }),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Payment signature verification failed');
    }

    return await res.json();
};

/**
 * Complete Razorpay Checkout flow for Consultations & Services:
 * 1. Loads SDK
 * 2. Creates order on server
 * 3. Opens Razorpay popup
 * 4. Verifies signature on server
 * 5. Returns payment result
 */
export const executeRazorpayCheckout = async ({
    amount,
    title = 'AstroPravin Consultation',
    description = 'Vedic Astrology Consultation with Pandit Pravin Shriram',
    customer = {},
    notes = {},
    themeColor = '#C2410C',
}) => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
        throw new Error('Could not load Razorpay payment gateway. Please check your internet connection.');
    }

    // Create server-side order
    const orderData = await createPaymentOrder({
        amount,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
        notes: {
            customerName: customer.name || '',
            customerPhone: customer.phone || '',
            ...notes,
        },
    });

    const keyId = orderData.key_id || (await getRazorpayKey());

    return new Promise((resolve, reject) => {
        const options = {
            key: keyId,
            amount: orderData.amount,
            currency: orderData.currency || 'INR',
            name: 'AstroPravin Jyotish Kendra',
            description: title ? `${title} - ${description}` : description,
            image: '/logo.png',
            order_id: orderData.id,
            prefill: {
                name: customer.name || '',
                email: customer.email || '',
                contact: customer.phone || '',
            },
            theme: {
                color: themeColor,
            },
            modal: {
                ondismiss: () => {
                    reject(new Error('Payment was cancelled by user.'));
                },
            },
            handler: async (response) => {
                try {
                    // Verify signature with backend
                    await verifyPaymentSignature({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    });

                    resolve({
                        success: true,
                        orderId: response.razorpay_order_id,
                        paymentId: response.razorpay_payment_id,
                        signature: response.razorpay_signature,
                        amount: Number(amount),
                    });
                } catch (verifyErr) {
                    reject(verifyErr);
                }
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp) {
            reject(new Error(resp.error?.description || 'Payment failed. Please try again.'));
        });
        rzp.open();
    });
};
