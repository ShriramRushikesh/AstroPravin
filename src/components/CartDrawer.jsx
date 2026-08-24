import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  Sparkles,
  MapPin,
  Phone,
  User,
  Mail,
  Receipt,
  RotateCcw
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { API_URL } from '../config';
import { normalizeProductImage } from './ProductCard';

// Dynamic Razorpay SDK Loader
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CartDrawer = () => {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItemsCount,
    subtotalAmount,
  } = useCart();

  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' | 'shipping' | 'success'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successOrder, setSuccessOrder] = useState(null);

  // Customer & Shipping Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    landmark: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateShipping = () => {
    if (!formData.name.trim()) return 'Please enter your full name.';
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) return 'Please enter a valid 10-digit mobile number.';
    if (!formData.address.trim()) return 'Please enter your delivery street address.';
    if (!formData.city.trim()) return 'Please enter your city.';
    if (!formData.pincode.trim() || formData.pincode.length < 6) return 'Please enter a valid 6-digit PIN code.';
    return null;
  };

  // ── 1-CLICK RAZORPAY CHECKOUT ──────────────────────────────────────────
  const handleProceedToRazorpay = async () => {
    setError('');
    if (cartItems.length === 0) {
      setError('Your shopping bag is empty. Please add items to checkout.');
      return;
    }

    const calculatedTotal = cartItems.reduce((sum, item) => {
      const itemPrice = typeof item.price === 'number' ? item.price : Number(String(item.price).replace(/[^0-9.]/g, '')) || 0;
      const itemQty = Number(item.quantity) || 1;
      return sum + (itemPrice * itemQty);
    }, 0);

    const finalPayAmount = calculatedTotal > 0 ? calculatedTotal : (Number(subtotalAmount) || 0);
    if (finalPayAmount <= 0) {
      setError('Invalid order amount. Please re-add items to your bag.');
      return;
    }

    const validationErr = validateShipping();
    if (validationErr) {
      setError(validationErr);
      return;
    }

    setLoading(true);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your network connection.');
      }

      // 1. Create Razorpay Order on Backend
      const orderPayload = {
        amount: finalPayAmount,
        currency: 'INR',
        items: cartItems.map(item => ({
          productId: item.productId,
          name: item.name,
          price: typeof item.price === 'number' ? item.price : Number(String(item.price).replace(/[^0-9.]/g, '')) || 0,
          quantity: Number(item.quantity) || 1,
          carat: item.carat || '',
          image: item.image || '',
          category: item.category || '',
        })),
        customer: {
          name: formData.name.trim(),
          phone: formData.phone.replace(/\D/g, '').slice(-10),
          email: formData.email.trim() || `${formData.phone.replace(/\D/g, '').slice(-10)}@astropravin.com`,
        },
        shipping: {
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
          landmark: formData.landmark.trim(),
        },
      };

      const res = await fetch(`${API_URL}/api/orders/create-razorpay-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.orderId) {
        throw new Error(orderData.message || 'Could not initiate checkout order.');
      }

      // 2. Configure & Open Razorpay Checkout Modal
      const options = {
        key: orderData.keyId || 'rzp_live_TTh5QILIguQeO2',
        amount: orderData.amountInPaise,
        currency: orderData.currency || 'INR',
        name: 'AstroPravin Spiritual Store',
        description: `Order: ${totalItemsCount} Blessed Artifacts`,
        image: '/favicon.ico',
        order_id: orderData.orderId,
        handler: async (response) => {
          setLoading(true);
          try {
            // 3. Verify Payment Signature & Save Order in MongoDB
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              items: orderPayload.items,
              customer: orderPayload.customer,
              shipping: orderPayload.shipping,
              totalAmount: subtotalAmount,
            };

            const verifyRes = await fetch(`${API_URL}/api/orders/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(verifyPayload),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setSuccessOrder({
                receiptNumber: verifyData.receiptNumber || `ASTRO-${Date.now().toString().slice(-6)}`,
                paymentId: response.razorpay_payment_id,
                items: cartItems,
                totalAmount: subtotalAmount,
                customer: orderPayload.customer,
                shipping: orderPayload.shipping,
              });
              clearCart();
              setCheckoutStep('success');
            } else {
              throw new Error(verifyData.message || 'Payment verification failed.');
            }
          } catch (verErr) {
            console.error('Order verification error:', verErr);
            setError(verErr.message || 'Payment verification failed. Please contact support.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: formData.name,
          contact: formData.phone.replace(/\D/g, '').slice(-10),
          email: formData.email || '',
        },
        notes: {
          customerName: formData.name,
          pincode: formData.pincode,
          itemCount: String(totalItemsCount),
        },
        theme: {
          color: '#C2410C',
        },
        retry: {
          enabled: true,
          max_count: 3,
        },
        send_sms_hash: true,
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpayWindow = new window.Razorpay(options);
      razorpayWindow.on('payment.failed', function (resp) {
        setError(resp.error?.description || 'Payment was unsuccessful or cancelled. You can try again.');
        setLoading(false);
      });

      razorpayWindow.open();
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  const handleCloseAndReset = () => {
    closeCart();
    setTimeout(() => {
      setCheckoutStep('cart');
      setError('');
      setSuccessOrder(null);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseAndReset}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          />

          {/* Slide-over Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative w-full max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col h-full z-10 border-l border-[#EADCC8] overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="p-5 bg-white border-b border-[#EADCC8] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#C2410C]">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-[#1C1917]">
                    {checkoutStep === 'cart' && `Shopping Bag (${totalItemsCount})`}
                    {checkoutStep === 'shipping' && 'Delivery & Checkout'}
                    {checkoutStep === 'success' && 'Order Confirmed!'}
                  </h3>
                  <p className="text-[11px] text-[#78716C]">
                    {checkoutStep === 'cart' && '100% Certified Natural & Energized'}
                    {checkoutStep === 'shipping' && 'Enter your delivery address for dispatch'}
                    {checkoutStep === 'success' && 'Blessed by Pandit Pravin Shriram'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseAndReset}
                className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#EADCC8] flex items-center justify-center text-[#78716C] hover:text-[#C2410C] transition-colors"
                aria-label="Close Bag"
              >
                <X size={16} />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            {checkoutStep !== 'success' && (
              <div className="px-5 py-2.5 bg-[#FFFBEB] border-b border-[#FDE68A] flex items-center gap-2 text-xs text-[#B45309]">
                <Truck size={14} className="shrink-0 text-[#D97706]" />
                <span className="font-medium">
                  <strong>Free Insured Courier Delivery</strong> on all orders across India 🇮🇳
                </span>
              </div>
            )}

            {/* Error Notification Alert */}
            {error && (
              <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center justify-between">
                <span>{error}</span>
                <button onClick={() => setError('')} className="text-red-500 font-bold ml-2">×</button>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                VIEW 1: SHOPPING CART LISTING
            ═══════════════════════════════════════════════════════════════ */}
            {checkoutStep === 'cart' && (
              <>
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {cartItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                      <div className="w-20 h-20 rounded-3xl bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#C2410C]">
                        <ShoppingBag size={32} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-lg font-serif font-bold text-[#1C1917]">Your Bag is Empty</h4>
                        <p className="text-xs text-[#78716C] max-w-xs">
                          Explore our collection of 100% certified natural Gemstones, Nepali Rudraksha & Siddh Yantras.
                        </p>
                      </div>
                      <button
                        onClick={closeCart}
                        className="px-6 py-2.5 bg-[#C2410C] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#9A3412] transition-colors"
                      >
                        Explore Store
                      </button>
                    </div>
                  ) : (
                    cartItems.map((item) => (
                      <div
                        key={item.cartItemId}
                        className="bg-white border border-[#EADCC8] rounded-2xl p-3.5 flex gap-3.5 shadow-sm hover:border-[#FED7AA] transition-all"
                      >
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#EADCC8] shrink-0">
                          <img
                            src={normalizeProductImage(item.image)}
                            alt={item.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop';
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-bold text-[#1C1917] line-clamp-2 leading-snug">
                                {item.name}
                              </h4>
                              <button
                                onClick={() => removeFromCart(item.cartItemId)}
                                className="text-[#A8A29E] hover:text-red-500 transition-colors p-1"
                                title="Remove item"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>

                            {item.carat && (
                              <span className="inline-block mt-1 px-2 py-0.5 bg-[#FFF7ED] border border-[#FED7AA] text-[#C2410C] rounded text-[10px] font-bold">
                                {item.carat}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#EADCC8]/50">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-sm font-bold text-[#1C1917]">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </span>
                              {item.quantity > 1 && (
                                <span className="text-[10px] text-[#78716C]">
                                  (₹{item.price.toLocaleString('en-IN')} ea)
                                </span>
                              )}
                            </div>

                            {/* Quantity Stepper */}
                            <div className="flex items-center border border-[#EADCC8] rounded-lg bg-[#FAF8F5]">
                              <button
                                onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                className="p-1 text-[#44403C] hover:text-[#C2410C] transition-colors"
                              >
                                <Minus size={11} />
                              </button>
                              <span className="px-2 text-xs font-bold text-[#1C1917]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                className="p-1 text-[#44403C] hover:text-[#C2410C] transition-colors"
                              >
                                <Plus size={11} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cartItems.length > 0 && (
                  <div className="p-5 bg-white border-t border-[#EADCC8] space-y-3 shrink-0">
                    {/* Bill Breakdown */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-[#78716C]">
                        <span>Items Subtotal ({totalItemsCount})</span>
                        <span className="font-semibold text-[#1C1917]">₹{subtotalAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-[#78716C]">
                        <span>Vedic Consecration (Prana Pratishtha)</span>
                        <span className="text-emerald-600 font-semibold">FREE</span>
                      </div>
                      <div className="flex justify-between text-[#78716C]">
                        <span>Insured Express Courier</span>
                        <span className="text-emerald-600 font-semibold">FREE</span>
                      </div>
                      <div className="pt-2 border-t border-[#EADCC8] flex justify-between text-sm font-bold text-[#1C1917]">
                        <span>Total Payable</span>
                        <span className="text-[#C2410C] text-base">₹{subtotalAmount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setCheckoutStep('shipping')}
                      className="w-full py-3.5 bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#D97706] text-white rounded-xl font-bold text-xs shadow-lg shadow-[#C2410C]/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Proceed to Delivery & Payment</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                VIEW 2: SHIPPING ADDRESS & RAZORPAY 1-CLICK PAY
            ═══════════════════════════════════════════════════════════════ */}
            {checkoutStep === 'shipping' && (
              <div className="flex-1 overflow-y-auto flex flex-col justify-between">
                <div className="p-5 space-y-4">
                  <button
                    onClick={() => setCheckoutStep('cart')}
                    className="inline-flex items-center gap-1.5 text-xs text-[#78716C] hover:text-[#C2410C] font-semibold transition-colors"
                  >
                    ← Back to Cart ({totalItemsCount} items)
                  </button>

                  {/* Trust Badge */}
                  <div className="p-3 bg-[#FFF7ED] border border-[#FED7AA] rounded-xl flex items-center gap-2.5 text-xs text-[#C2410C]">
                    <ShieldCheck size={18} className="shrink-0" />
                    <span>Orders are consecrated and dispatched in tamper-evident secured packing.</span>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#44403C] flex items-center gap-1.5">
                      <User size={13} className="text-[#C2410C]" />
                      <span>Contact & Shipping Details</span>
                    </h4>

                    {/* Full Name */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#44403C] uppercase mb-1">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="e.g. Rushikesh Shriram"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#EADCC8] rounded-xl text-xs text-[#1C1917] focus:outline-none focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C]"
                      />
                    </div>

                    {/* Phone & Email Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#44403C] uppercase mb-1">Mobile (WhatsApp) *</label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          placeholder="10-digit phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 bg-white border border-[#EADCC8] rounded-xl text-xs text-[#1C1917] focus:outline-none focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#44403C] uppercase mb-1">Email (Optional)</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="For receipt tracking"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 bg-white border border-[#EADCC8] rounded-xl text-xs text-[#1C1917] focus:outline-none focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C]"
                        />
                      </div>
                    </div>

                    {/* Street Address */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#44403C] uppercase mb-1">Street Address / House No. *</label>
                      <textarea
                        rows={2}
                        name="address"
                        required
                        placeholder="House/Flat No, Building Name, Street..."
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2 bg-white border border-[#EADCC8] rounded-xl text-xs text-[#1C1917] focus:outline-none focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C]"
                      />
                    </div>

                    {/* City, State & PIN Code */}
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-[#44403C] uppercase mb-1">City *</label>
                        <input
                          type="text"
                          name="city"
                          required
                          placeholder="City"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-2.5 py-2 bg-white border border-[#EADCC8] rounded-xl text-xs text-[#1C1917] focus:outline-none focus:border-[#C2410C]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#44403C] uppercase mb-1">State *</label>
                        <input
                          type="text"
                          name="state"
                          required
                          placeholder="State"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-2.5 py-2 bg-white border border-[#EADCC8] rounded-xl text-xs text-[#1C1917] focus:outline-none focus:border-[#C2410C]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#44403C] uppercase mb-1">PIN Code *</label>
                        <input
                          type="text"
                          name="pincode"
                          maxLength={6}
                          required
                          placeholder="6-digit PIN"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className="w-full px-2.5 py-2 bg-white border border-[#EADCC8] rounded-xl text-xs text-[#1C1917] focus:outline-none focus:border-[#C2410C]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Payment Button */}
                <div className="p-5 bg-white border-t border-[#EADCC8] space-y-3 shrink-0">
                  <div className="flex items-center justify-between text-xs text-[#78716C]">
                    <span className="flex items-center gap-1">
                      <Lock size={12} className="text-[#C2410C]" /> 256-Bit Razorpay Encrypted
                    </span>
                    <span className="text-base font-bold text-[#C2410C]">
                      Total: ₹{subtotalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleProceedToRazorpay}
                    className={`w-full py-3.5 bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#D97706] text-white rounded-xl font-bold text-xs shadow-lg shadow-[#C2410C]/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Opening Razorpay Secure Gateway...</span>
                      </>
                    ) : (
                      <>
                        <Lock size={14} />
                        <span>Pay ₹{subtotalAmount.toLocaleString('en-IN')} with Razorpay</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                VIEW 3: CELEBRATORY ORDER SUCCESS RECEIPT
            ═══════════════════════════════════════════════════════════════ */}
            {checkoutStep === 'success' && successOrder && (
              <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center space-y-5">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-300 flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-600/20"
                >
                  <CheckCircle2 size={36} />
                </motion.div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#C2410C]">Payment Successful</span>
                  <h3 className="text-xl font-serif font-bold text-[#1C1917]">
                    Har Har Mahadev! Order Confirmed
                  </h3>
                  <p className="text-xs text-[#78716C] max-w-xs">
                    Your blessed order has been recorded. Pandit Pravin Shriram will sanctify and consecrate your artifacts prior to dispatch.
                  </p>
                </div>

                {/* Receipt Card */}
                <div className="w-full bg-white border border-[#EADCC8] rounded-2xl p-4 text-left text-xs space-y-2.5 shadow-sm">
                  <div className="flex justify-between items-center pb-2 border-b border-[#EADCC8]">
                    <span className="text-[#78716C] font-mono text-[10px]">RECEIPT REF</span>
                    <span className="font-mono font-bold text-[#C2410C]">{successOrder.receiptNumber}</span>
                  </div>

                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#78716C]">Payment ID:</span>
                    <span className="font-mono text-[#1C1917]">{successOrder.paymentId}</span>
                  </div>

                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#78716C]">Amount Paid:</span>
                    <span className="font-bold text-emerald-700">₹{successOrder.totalAmount?.toLocaleString('en-IN')} (Paid)</span>
                  </div>

                  <div className="flex justify-between items-start text-[11px] pt-1">
                    <span className="text-[#78716C]">Dispatch To:</span>
                    <span className="text-right text-[#1C1917] font-medium max-w-[200px]">
                      {successOrder.shipping?.address}, {successOrder.shipping?.city} - {successOrder.shipping?.pincode}
                    </span>
                  </div>
                </div>

                <div className="w-full space-y-2 pt-2">
                  <a
                    href={`https://wa.me/919921697908?text=Namaste%20Pandit%20Pravin,%20I%20have%20completed%20my%20Store%20Order%20Receipt%20${successOrder.receiptNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Track Order on WhatsApp</span>
                  </a>

                  <button
                    onClick={handleCloseAndReset}
                    className="w-full py-2.5 bg-[#FAF8F5] hover:bg-[#F5EFE6] border border-[#EADCC8] text-[#44403C] rounded-xl font-bold text-xs transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(CartDrawer);
