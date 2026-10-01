import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    ShoppingBag,
    Plus,
    Minus,
    Trash2,
    ArrowRight,
    ShieldCheck,
    Truck,
    Lock,
    CheckCircle2,
    CreditCard,
    Sparkles,
    User,
    Phone,
    Mail,
    MapPin
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { API_URL } from '../config';
import { loadRazorpayScript, getRazorpayKey } from '../services/paymentService';
import { LotusCrest } from './VedicDecorativeArt';

export default function CartDrawer() {
    const {
        cartItems,
        isCartOpen,
        closeCart,
        cartStep,
        setCartStep,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotalAmount,
    } = useCart();

    const [loading, setLoading] = useState(false);
    const [confirmedOrder, setConfirmedOrder] = useState(null);
    const [shippingForm, setShippingForm] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: 'Maharashtra',
        pincode: '',
    });

    const handleFormChange = (e) => {
        setShippingForm({ ...shippingForm, [e.target.name]: e.target.value });
    };

    const handleInitiateRazorpayPayment = async (e) => {
        e.preventDefault();
        if (!shippingForm.name || !shippingForm.phone || !shippingForm.address || !shippingForm.city || !shippingForm.pincode) {
            alert('Please fill in your Name, Phone Number, Address, City, and Pincode.');
            return;
        }

        setLoading(true);
        try {
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                alert('Razorpay payment gateway failed to load. Please check your internet connection.');
                setLoading(false);
                return;
            }

            // 1. Create order on backend
            const orderRes = await fetch(`${API_URL}/api/orders/create-razorpay-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: subtotalAmount,
                    items: cartItems.map(it => ({
                        productId: it.productId,
                        name: it.name,
                        price: it.price,
                        quantity: it.quantity,
                        carat: it.carat,
                        image: it.image,
                        category: it.category,
                    })),
                    customer: {
                        name: shippingForm.name,
                        phone: shippingForm.phone,
                        email: shippingForm.email || `${shippingForm.phone}@astropravin.com`,
                    },
                    shipping: {
                        address: shippingForm.address,
                        city: shippingForm.city,
                        state: shippingForm.state,
                        pincode: shippingForm.pincode,
                    },
                }),
            });

            if (!orderRes.ok) {
                const errData = await orderRes.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to create payment order.');
            }

            const orderData = await orderRes.json();
            const keyId = orderData.keyId || (await getRazorpayKey());

            // 2. Open Razorpay Checkout modal
            const options = {
                key: keyId,
                amount: orderData.amountInPaise,
                currency: orderData.currency || 'INR',
                name: 'AstroPravin Spiritual Store',
                description: `Vedic Artifacts Purchase (${cartItems.length} items)`,
                order_id: orderData.orderId,
                image: '/logo.png',
                prefill: {
                    name: shippingForm.name,
                    email: shippingForm.email,
                    contact: shippingForm.phone,
                },
                theme: {
                    color: '#C2410C',
                },
                modal: {
                    ondismiss: () => {
                        setLoading(false);
                    },
                },
                handler: async (paymentResponse) => {
                    try {
                        // 3. Verify payment signature on backend
                        const verifyRes = await fetch(`${API_URL}/api/orders/verify-payment`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: paymentResponse.razorpay_order_id,
                                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                                razorpay_signature: paymentResponse.razorpay_signature,
                                items: cartItems.map(it => ({
                                    productId: it.productId,
                                    name: it.name,
                                    price: it.price,
                                    quantity: it.quantity,
                                    carat: it.carat,
                                    image: it.image,
                                    category: it.category,
                                })),
                                customer: {
                                    name: shippingForm.name,
                                    phone: shippingForm.phone,
                                    email: shippingForm.email,
                                },
                                shipping: {
                                    address: shippingForm.address,
                                    city: shippingForm.city,
                                    state: shippingForm.state,
                                    pincode: shippingForm.pincode,
                                },
                                totalAmount: subtotalAmount,
                            }),
                        });

                        if (!verifyRes.ok) {
                            const errData = await verifyRes.json().catch(() => ({}));
                            throw new Error(errData.message || 'Payment verification failed.');
                        }

                        const result = await verifyRes.json();
                        setConfirmedOrder({
                            orderId: result.order?._id || paymentResponse.razorpay_order_id,
                            paymentId: paymentResponse.razorpay_payment_id,
                            receipt: result.order?.receiptNumber || orderData.receipt,
                            amount: subtotalAmount,
                            customer: shippingForm,
                            items: [...cartItems],
                        });

                        clearCart();
                        setCartStep('success');
                    } catch (verifyErr) {
                        alert(`Verification Error: ${verifyErr.message}`);
                    } finally {
                        setLoading(false);
                    }
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', (resp) => {
                alert(`Payment Failed: ${resp.error?.description || 'Transaction was declined.'}`);
                setLoading(false);
            });
            rzp.open();
        } catch (error) {
            alert(error.message || 'Could not initiate Razorpay checkout.');
            setLoading(false);
        }
    };

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex justify-end">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeCart}
                className="absolute inset-0 bg-[#1C1917]/60 backdrop-blur-sm"
            />

            {/* Slide-in Panel */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative w-full max-w-md bg-[#FAF8F5] border-l border-[#EADCC8] shadow-2xl flex flex-col h-full z-10 overflow-hidden"
            >
                {/* Header */}
                <div className="px-6 py-4 bg-white border-b border-[#EADCC8] flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <LotusCrest className="w-5 h-5 text-[#C2410C]" />
                        <h2 className="text-base font-bold font-serif text-[#1C1917]">
                            {cartStep === 'cart' && `Spiritual Cart (${cartItems.length})`}
                            {cartStep === 'shipping' && 'Delivery & Checkout'}
                            {cartStep === 'success' && 'Order Confirmed!'}
                        </h2>
                    </div>
                    <button
                        onClick={closeCart}
                        className="w-8 h-8 rounded-full bg-[#F5F0E8] border border-[#EADCC8] flex items-center justify-center text-[#78716C] hover:text-[#C2410C] transition-colors"
                        aria-label="Close cart"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                    {/* STEP 1: CART ITEMS */}
                    {cartStep === 'cart' && (
                        <>
                            {cartItems.length === 0 ? (
                                <div className="py-16 text-center space-y-3">
                                    <div className="w-16 h-16 mx-auto rounded-full bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#C2410C]">
                                        <ShoppingBag size={28} />
                                    </div>
                                    <h3 className="font-serif font-bold text-lg text-[#1C1917]">Your Cart is Empty</h3>
                                    <p className="text-xs text-[#78716C] max-w-xs mx-auto">
                                        Explore our lab-certified gemstones, energized Rudraksha, and sacred Yantras.
                                    </p>
                                    <button
                                        onClick={closeCart}
                                        className="mt-4 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#C2410C] to-[#EA580C] shadow-sm hover:scale-105 transition-transform"
                                    >
                                        Browse Spiritual Store
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {cartItems.map((item) => (
                                        <div
                                            key={item.cartItemId}
                                            className="p-3.5 bg-white border border-[#EADCC8] rounded-2xl flex gap-3 items-center shadow-xs"
                                        >
                                            <div className="w-16 h-16 rounded-xl bg-[#F5F0E8] border border-[#EADCC8] overflow-hidden shrink-0">
                                                <img
                                                    src={item.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=400&auto=format&fit=crop'}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-xs font-bold text-[#1C1917] truncate">{item.name}</h4>
                                                {item.carat && (
                                                    <span className="text-[10px] text-[#B45309] font-medium">Carat: {item.carat}</span>
                                                )}
                                                <div className="text-xs font-serif font-bold text-[#C2410C] mt-1">
                                                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1.5 border border-[#EADCC8] rounded-lg bg-[#FAF8F5] p-1 shrink-0">
                                                <button
                                                    onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                                    className="p-1 text-[#78716C] hover:text-[#C2410C]"
                                                >
                                                    <Minus size={11} />
                                                </button>
                                                <span className="text-xs font-bold px-1">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                                    className="p-1 text-[#78716C] hover:text-[#C2410C]"
                                                >
                                                    <Plus size={11} />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.cartItemId)}
                                                className="p-1.5 text-[#A8A29E] hover:text-red-600 transition-colors"
                                                title="Remove"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}

                                    <div className="pt-2">
                                        <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-xl p-3 text-[11px] text-[#78716C] space-y-1">
                                            <p className="flex items-center gap-1.5 font-medium text-[#C2410C]">
                                                <ShieldCheck size={13} />
                                                <span>Free Insured Delivery & Lab Certificate Included</span>
                                            </p>
                                            <p className="flex items-center gap-1.5">
                                                <Sparkles size={13} className="text-amber-600" />
                                                <span>Personalized Prana Pratishtha by Panditji</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* STEP 2: SHIPPING & RAZORPAY CHECKOUT */}
                    {cartStep === 'shipping' && (
                        <form onSubmit={handleInitiateRazorpayPayment} className="space-y-3.5 text-xs">
                            <div className="bg-white border border-[#EADCC8] rounded-2xl p-4 space-y-3">
                                <h3 className="font-bold text-[#1C1917] text-xs uppercase tracking-wider flex items-center gap-1.5">
                                    <User size={13} className="text-[#C2410C]" /> Recipient Information
                                </h3>

                                <div>
                                    <label className="block text-[11px] font-bold text-[#44403C] mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        name="name"
                                        value={shippingForm.name}
                                        onChange={handleFormChange}
                                        placeholder="Enter recipient name"
                                        className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EADCC8] text-[#1C1917] focus:outline-none focus:border-[#C2410C]"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-[11px] font-bold text-[#44403C] mb-1">Mobile / WhatsApp *</label>
                                        <input
                                            type="tel"
                                            required
                                            name="phone"
                                            value={shippingForm.phone}
                                            onChange={handleFormChange}
                                            placeholder="10-digit number"
                                            className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EADCC8] text-[#1C1917] focus:outline-none focus:border-[#C2410C]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-[#44403C] mb-1">Email (Optional)</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={shippingForm.email}
                                            onChange={handleFormChange}
                                            placeholder="you@email.com"
                                            className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EADCC8] text-[#1C1917] focus:outline-none focus:border-[#C2410C]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border border-[#EADCC8] rounded-2xl p-4 space-y-3">
                                <h3 className="font-bold text-[#1C1917] text-xs uppercase tracking-wider flex items-center gap-1.5">
                                    <MapPin size={13} className="text-[#C2410C]" /> Delivery Address
                                </h3>

                                <div>
                                    <label className="block text-[11px] font-bold text-[#44403C] mb-1">Flat / House / Street *</label>
                                    <input
                                        type="text"
                                        required
                                        name="address"
                                        value={shippingForm.address}
                                        onChange={handleFormChange}
                                        placeholder="House / Building name, street"
                                        className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EADCC8] text-[#1C1917] focus:outline-none focus:border-[#C2410C]"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-[11px] font-bold text-[#44403C] mb-1">City / Town *</label>
                                        <input
                                            type="text"
                                            required
                                            name="city"
                                            value={shippingForm.city}
                                            onChange={handleFormChange}
                                            placeholder="e.g. Pune, Solapur"
                                            className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EADCC8] text-[#1C1917] focus:outline-none focus:border-[#C2410C]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-[#44403C] mb-1">Pincode *</label>
                                        <input
                                            type="text"
                                            required
                                            name="pincode"
                                            value={shippingForm.pincode}
                                            onChange={handleFormChange}
                                            placeholder="6-digit PIN"
                                            className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EADCC8] text-[#1C1917] focus:outline-none focus:border-[#C2410C]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Summary Pill */}
                            <div className="bg-[#FFF7ED] border border-[#FED7AA] p-3.5 rounded-2xl flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] text-[#78716C] uppercase font-bold block">Payable via Razorpay</span>
                                    <span className="text-lg font-serif font-bold text-[#C2410C]">
                                        ₹{subtotalAmount.toLocaleString('en-IN')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                    <Lock size={12} />
                                    <span>256-Bit SSL Encrypted</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#D97706] shadow-luxury hover:shadow-luxury-hover hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                <CreditCard size={14} />
                                <span>{loading ? 'Opening Razorpay Gateway...' : `Pay ₹${subtotalAmount.toLocaleString('en-IN')} with Razorpay`}</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setCartStep('cart')}
                                className="w-full text-center text-xs text-[#78716C] hover:text-[#C2410C] py-1 cursor-pointer"
                            >
                                ← Back to Cart Items
                            </button>
                        </form>
                    )}

                    {/* STEP 3: SUCCESS STATE */}
                    {cartStep === 'success' && confirmedOrder && (
                        <div className="py-8 text-center space-y-4">
                            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border-2 border-emerald-300 flex items-center justify-center text-emerald-600 shadow-md">
                                <CheckCircle2 size={36} />
                            </div>

                            <h3 className="font-serif font-bold text-2xl text-[#1C1917]">
                                Order Successful!
                            </h3>

                            <div className="bg-white border border-[#EADCC8] rounded-2xl p-4 text-left text-xs space-y-2 shadow-xs">
                                <p className="flex justify-between border-b border-[#EADCC8] pb-1.5">
                                    <span className="text-[#78716C]">Order Reference:</span>
                                    <span className="font-mono font-bold text-[#1C1917]">{confirmedOrder.receipt}</span>
                                </p>
                                <p className="flex justify-between border-b border-[#EADCC8] pb-1.5">
                                    <span className="text-[#78716C]">Razorpay Payment ID:</span>
                                    <span className="font-mono text-[10px] text-[#C2410C]">{confirmedOrder.paymentId}</span>
                                </p>
                                <p className="flex justify-between border-b border-[#EADCC8] pb-1.5">
                                    <span className="text-[#78716C]">Amount Paid:</span>
                                    <span className="font-bold text-[#1C1917]">₹{confirmedOrder.amount.toLocaleString('en-IN')}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="text-[#78716C]">Shipping To:</span>
                                    <span className="font-medium text-[#1C1917] text-right truncate max-w-[200px]">
                                        {confirmedOrder.customer?.address}, {confirmedOrder.customer?.city}
                                    </span>
                                </p>
                            </div>

                            <p className="text-xs text-[#78716C] leading-relaxed">
                                Pandit Pravin Shriram's Kendra has initiated Vedic consecration (Prana Pratishtha) for your items. Your tracking number will be shared via WhatsApp.
                            </p>

                            <div className="pt-2 flex flex-col gap-2">
                                <a
                                    href={`https://wa.me/919921697908?text=${encodeURIComponent(`Namaste Panditji, I have placed order ${confirmedOrder.receipt} (Payment ID: ${confirmedOrder.paymentId}). Please confirm my shipment.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-3 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 flex items-center justify-center gap-1.5"
                                >
                                    <span>Confirm on WhatsApp (+91 99216 97908)</span>
                                </a>

                                <button
                                    onClick={closeCart}
                                    className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#C2410C] to-[#EA580C] shadow-sm cursor-pointer"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer (For Step 1 Cart view) */}
                {cartStep === 'cart' && cartItems.length > 0 && (
                    <div className="p-5 bg-white border-t border-[#EADCC8] shrink-0 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-[#78716C]">Total Amount</span>
                            <span className="text-xl font-serif font-bold text-[#C2410C]">
                                ₹{subtotalAmount.toLocaleString('en-IN')}
                            </span>
                        </div>

                        <button
                            onClick={() => setCartStep('shipping')}
                            className="w-full py-3.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#D97706] shadow-luxury hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <span>Proceed to Razorpay Checkout</span>
                            <ArrowRight size={14} />
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
