import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, CheckCircle2, QrCode, Copy, Check,
  PhoneCall, ArrowRight, Sparkles, Lock, Clock, HeartHandshake,
  AlertCircle, MessageSquare, Crown, Zap, ChevronDown, ChevronUp, UserCheck
} from 'lucide-react';
import { LotusCrest, ToranBorder, MandalaWatermark } from './MatrimonyDecorativeArt';
import { matrimonyApi } from '../../../services/matrimonyApi';

// Helper to dynamically load Razorpay standard checkout script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const DEFAULT_PLANS = [
  {
    id: 'silver',
    tier: 'silver',
    name: 'Silver Plan',
    tagline: 'Standard 3-Month Access',
    amount: 299,
    originalAmount: 599,
    discountPercent: 50,
    durationText: '3 Months Access',
    durationDays: 90,
    badge: 'Standard',
    popular: false,
    features: [
      '3 Months Full Platform Access',
      'Verified Candidate Search & Filters',
      'Ashta Koota 36-Guna Kundli Matchmaking',
      'Send Unlimited Express Interests',
      'Direct Chat with Mutual Matches',
      'Verified Phone & Photo Privacy Protection',
    ],
  },
  {
    id: 'gold',
    tier: 'gold',
    name: 'Gold Plan',
    tagline: 'Most Popular for Serious Matchseekers',
    amount: 499,
    originalAmount: 1199,
    discountPercent: 58,
    durationText: '6 Months Access',
    durationDays: 180,
    badge: 'Most Popular',
    popular: true,
    features: [
      'Everything in Silver Plan',
      '6 Months Extended Membership',
      'Highlighted Gold Profile Badge',
      'Priority Higher Ranking in Search Results',
      'Direct Kundli Alignment Analysis',
      'Instant Notifications & Priority Verification',
    ],
  },
  {
    id: 'platinum',
    tier: 'platinum',
    name: 'Platinum VIP (Lifetime)',
    tagline: 'One-Time Payment • Valid Until Marriage',
    amount: 999,
    originalAmount: 2499,
    discountPercent: 60,
    durationText: 'Until Marriage (Lifetime)',
    durationDays: 0,
    badge: 'Best Value • One-Time',
    popular: false,
    vip: true,
    features: [
      'One-Time Payment • Zero Recurring Renewals',
      'Valid Until You Find Your Life Partner',
      'Exclusive Platinum VIP Crown Profile Badge',
      'Top Priority Placement to Prospective Matches',
      'Direct Consultation Guidance with Pandit Pravin Shriram',
      'Comprehensive Horoscope & Mangal Dosha Review',
    ],
  },
];

const MembershipPaymentGate = ({ user, registrationConfig, onPaymentCompleted, onPaymentSuccess, onLogout }) => {
  const [plans, setPlans] = useState(DEFAULT_PLANS);
  const [selectedPlanId, setSelectedPlanId] = useState('gold'); // Default to Gold
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  // Manual QR / UTR Accordion state
  const [showManualUpi, setShowManualUpi] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [paymentMode, setPaymentMode] = useState('upi');
  const [copied, setCopied] = useState(false);
  const [copyNotice, setCopyNotice] = useState('');
  const [isEditingUtr, setIsEditingUtr] = useState(false);

  // Dynamic admin-configurable values with defaults
  const upiId = registrationConfig?.upiId || 'rishi.shriram5@ybl';
  const payeeName = registrationConfig?.payeeName || 'RUSHIKESH PRAVIN SHRIRAM';
  const supportPhone = '7875542000';
  const formattedPhone = '+91 78755 42000';

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[1] || plans[0];

  // Dedicated Official PhonePe QR Asset with fallback
  const officialQrPath = '/phonepe-qr.png';
  const fallbackQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(`upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${selectedPlan.amount}&cu=INR&tn=AstroPravin%20Matrimony%20${user?.username || ''}`)}&color=000000&bgcolor=FFFFFF`;

  // Fetch live plans on mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await matrimonyApi.getPlans();
        if (res?.plans && Array.isArray(res.plans) && res.plans.length > 0) {
          setPlans(res.plans);
        }
      } catch (err) {
        console.warn('Using default plans due to fetch issue:', err);
      }
    };
    fetchPlans();
  }, []);

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(upiId);
    setCopied(true);
    setCopyNotice('UPI ID copied to clipboard!');
    setTimeout(() => {
      setCopied(false);
      setCopyNotice('');
    }, 2500);
  };

  const isPendingVerification =
    (user?.status === 'pending_payment_verification' || user?.paymentStatus === 'pending_verification') &&
    !isEditingUtr &&
    !successData;

  const submittedUtr = user?.paymentDetails?.transactionId || user?.membershipReceiptNumber;

  // ── RAZORPAY 1-CLICK CHECKOUT HANDLER ─────────────────────────────────────────
  const handleRazorpayCheckout = async () => {
    setError('');
    setLoading(true);

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection and try again.');
      }

      // Step 1: Create Order on backend
      const orderData = await matrimonyApi.createRazorpayOrder(selectedPlan.id);
      if (!orderData || !orderData.orderId) {
        throw new Error(orderData?.message || 'Could not initiate payment order.');
      }

      // Step 2: Configure Razorpay Checkout Options
      const options = {
        key: orderData.keyId || 'rzp_live_TTh5QILIguQeO2',
        amount: orderData.amountInPaise,
        currency: orderData.currency || 'INR',
        name: 'AstroPravin Matrimony',
        description: `${selectedPlan.name} • ${selectedPlan.durationText}`,
        image: '/favicon.ico',
        order_id: orderData.orderId,
        handler: async (response) => {
          setLoading(true);
          try {
            // Step 3: Verify Cryptographic Payment Signature on Backend
            const verifyResult = await matrimonyApi.verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId: selectedPlan.id,
            });

            if (verifyResult?.success) {
              setSuccessData({
                receipt: response.razorpay_payment_id,
                plan: selectedPlan,
                message: verifyResult.message,
              });

              if (onPaymentSuccess) {
                await onPaymentSuccess(verifyResult);
              }
            } else {
              throw new Error(verifyResult?.message || 'Payment verification failed.');
            }
          } catch (verErr) {
            console.error('Verification error:', verErr);
            setError(verErr.message || 'Payment verification failed. Please contact support.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user?.fullName || user?.username || '',
          contact: user?.phone || '',
          email: user?.email || '',
        },
        notes: {
          username: user?.username,
          planId: selectedPlan.id,
          planName: selectedPlan.name,
        },
        theme: {
          color: '#C2410C', // Warm Vermilion Saffron
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpayWindow = new window.Razorpay(options);
      razorpayWindow.on('payment.failed', function (response) {
        setError(response.error?.description || 'Payment was unsuccessful or cancelled. You can try again.');
        setLoading(false);
      });

      razorpayWindow.open();
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Payment initiation failed. Please try again.');
      setLoading(false);
    }
  };

  // ── MANUAL UTR SUBMISSION HANDLER ─────────────────────────────────────────────
  const handleManualUtrSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');

    const cleanUtr = transactionId.trim().toUpperCase();
    if (!cleanUtr) {
      setError('Please enter your 12-digit UPI Transaction Ref / UTR Number.');
      return;
    }

    const utrRegex = /^[A-Z0-9]{10,22}$/;
    if (!utrRegex.test(cleanUtr)) {
      setError('Invalid UTR format. UPI UTR reference must be 10-22 alphanumeric characters.');
      return;
    }

    setLoading(true);
    try {
      if (onPaymentCompleted) {
        await onPaymentCompleted({
          transactionId: cleanUtr,
          paymentMode,
          amount: selectedPlan.amount,
          planId: selectedPlan.id,
        });
      }
      setIsEditingUtr(false);
    } catch (err) {
      setError(err.message || 'Payment submission failed. Please check the details or contact support.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 py-12 text-[#1C1917]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
        <MandalaWatermark size={700} opacity={0.04} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl bg-white border border-[#EADCC8] rounded-3xl p-6 sm:p-9 shadow-[0_20px_60px_rgba(194,65,12,0.06),0_2px_10px_rgba(0,0,0,0.03)] relative z-10"
      >
        {/* Top Crest & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-2">
            <LotusCrest size={46} />
          </div>
          <ToranBorder className="mb-4" />

          <div className="inline-flex items-center gap-1.5 px-4 py-1 bg-[#FEF3C7] border border-[#FDE68A] rounded-full text-[11px] font-bold text-[#B45309] uppercase tracking-wider mb-2.5 shadow-sm">
            <Sparkles size={12} className="text-[#D97706]" />
            <span>Select Your Matrimony Membership</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917] tracking-tight">
            Unlock Full Access & Verified Matchmaking
          </h2>
          <p className="text-xs sm:text-sm text-[#78716C] max-w-xl mx-auto mt-1.5 leading-relaxed">
            Welcome, <strong className="text-[#C2410C] font-semibold">{user?.fullName || user?.username}</strong>. 
            Choose the plan that suits your journey. Enjoy 100% genuine alliances, Ashta Koota 36-Guna Kundli matching, and privacy-protected direct matchmaking.
          </p>
        </div>

        {/* ── SUCCESS CELEBRATION MODAL STATE ─────────────────────────────── */}
        {successData ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 bg-gradient-to-br from-[#F0FDF4] via-white to-[#DCFCE7]/40 border-2 border-[#86EFAC] rounded-3xl text-center space-y-6 shadow-xl"
          >
            <div className="w-16 h-16 bg-[#DCFCE7] text-[#15803D] rounded-full flex items-center justify-center mx-auto border-2 border-[#BBF7D0] shadow-sm">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <span className="px-3 py-1 bg-[#DCFCE7] text-[#15803D] text-[11px] font-bold uppercase rounded-full tracking-wider border border-[#BBF7D0]">
                Payment Verified & Activated
              </span>
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#1C1917] mt-3">
                Welcome to AstroPravin Matrimony!
              </h3>
              <p className="text-xs sm:text-sm text-[#574F47] mt-2 max-w-md mx-auto">
                {successData.message || `Your ${successData.plan?.name} is now active. Your profile is verified and ready to explore matches.`}
              </p>
            </div>

            <div className="p-4 bg-white/90 rounded-2xl border border-[#BBF7D0] font-mono text-xs max-w-md mx-auto space-y-2 text-left shadow-inner">
              <div className="flex justify-between">
                <span className="text-[#78716C]">Plan Activated:</span>
                <strong className="text-[#C2410C] font-sans font-bold">{successData.plan?.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716C]">Duration:</span>
                <strong className="text-[#1C1917]">{successData.plan?.durationText}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716C]">Payment Ref / Receipt:</span>
                <strong className="text-[#15803D]">{successData.receipt}</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#D97706] text-white font-bold text-sm rounded-2xl shadow-xl shadow-[#C2410C]/25 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
            >
              <span>Go to Matrimony Dashboard</span>
              <ArrowRight size={18} />
            </button>
          </motion.div>
        ) : isPendingVerification ? (
          /* ── CONDITIONAL VIEW: IF MANUAL UTR IS PENDING ADMIN VERIFICATION ── */
          <div className="space-y-6 max-w-xl mx-auto">
            <div className="p-6 bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7]/40 to-[#FFF7ED] border border-[#FCD34D] rounded-3xl space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
                <Clock size={24} className="animate-pulse" />
              </div>

              <div>
                <h3 className="font-serif font-bold text-lg text-[#1C1917]">UTR Submitted for Verification</h3>
                <p className="text-xs text-[#78716C] mt-1 max-w-md mx-auto">
                  Your transaction reference has been logged. Kendra staff is reconciling the credit. Your account will be unlocked as soon as verified.
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#EADCC8] font-mono text-xs text-left space-y-1.5 shadow-inner">
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Transaction / UTR Reference:</span>
                  <strong className="text-[#C2410C] text-sm">{submittedUtr}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Status:</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold text-[10px] rounded-full uppercase">
                    Awaiting Admin Approval
                  </span>
                </div>
              </div>

              {/* Instant WhatsApp Approval Fast-Track */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/91${supportPhone}?text=${encodeURIComponent(`Pranam Panditji, I have paid the Matrimony Registration Fee. My Username is: ${user?.username} and UTR is: ${submittedUtr}. Please verify and unlock my account access.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-center cursor-pointer"
                >
                  <MessageSquare size={16} />
                  <span>Send Screenshot on WhatsApp ({formattedPhone}) for Fast Approval</span>
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#EADCC8]">
              <button
                type="button"
                onClick={() => setIsEditingUtr(true)}
                className="text-xs font-bold text-[#C2410C] hover:underline cursor-pointer"
              >
                Change or Re-enter UTR Number
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="text-xs text-[#78716C] hover:text-[#1C1917] underline cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* ── 3-CARD INTERACTIVE MEMBERSHIP SELECTION & CHECKOUT ── */
          <>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-2xl text-[#B91C1C] text-xs flex items-center gap-3 shadow-sm"
              >
                <AlertCircle size={18} className="shrink-0" />
                <span className="font-medium">{error}</span>
              </motion.div>
            )}

            {/* ── 3-Plan Cards Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {plans.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                const isGold = plan.id === 'gold';
                const isPlatinum = plan.id === 'platinum';

                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`relative rounded-3xl p-5 sm:p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                      isSelected
                        ? isPlatinum
                          ? 'bg-gradient-to-b from-[#FFFBEB] to-white border-2 border-[#D97706] shadow-xl shadow-[#D97706]/15 scale-[1.02]'
                          : isGold
                          ? 'bg-gradient-to-b from-[#FFF7ED] to-white border-2 border-[#C2410C] shadow-xl shadow-[#C2410C]/15 scale-[1.02]'
                          : 'bg-gradient-to-b from-[#F8FAFC] to-white border-2 border-[#64748B] shadow-xl shadow-[#64748B]/15 scale-[1.02]'
                        : 'bg-white border border-[#EADCC8] hover:border-[#FED7AA] hover:shadow-md'
                    }`}
                  >
                    {/* Floating Top Badge */}
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span
                          className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1 ${
                            isPlatinum
                              ? 'bg-gradient-to-r from-[#D97706] to-[#B45309] text-white'
                              : isGold
                              ? 'bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white'
                              : 'bg-[#64748B] text-white'
                          }`}
                        >
                          {isPlatinum && <Crown size={11} />}
                          {isGold && <Sparkles size={11} />}
                          <span>{plan.badge}</span>
                        </span>
                      </div>
                    )}

                    <div>
                      {/* Plan Header */}
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <div>
                          <h4 className="font-serif font-bold text-lg text-[#1C1917]">{plan.name}</h4>
                          <span className="text-[11px] text-[#78716C] font-medium">{plan.durationText}</span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? isPlatinum
                                ? 'border-[#D97706] bg-[#D97706] text-white'
                                : 'border-[#C2410C] bg-[#C2410C] text-white'
                              : 'border-[#D6D3D1]'
                          }`}
                        >
                          {isSelected && <Check size={12} strokeWidth={3} />}
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="my-4 pt-3 border-t border-[#F5EFE6]">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl sm:text-4xl font-serif font-extrabold text-[#C2410C]">
                            ₹{plan.amount}
                          </span>
                          <span className="text-sm line-through text-[#A8A29E]">₹{plan.originalAmount}</span>
                          <span className="px-2 py-0.5 bg-[#DC2626]/10 text-[#DC2626] font-bold text-[10px] rounded-md">
                            {plan.discountPercent}% OFF
                          </span>
                        </div>
                        <p className="text-[11px] text-[#78716C] mt-1 italic">{plan.tagline}</p>
                      </div>

                      {/* Features List */}
                      <div className="space-y-2 pt-2 border-t border-[#F5EFE6]">
                        {plan.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-[#44403C]">
                            <CheckCircle2
                              size={14}
                              className={`shrink-0 mt-0.5 ${
                                isPlatinum ? 'text-[#D97706]' : isGold ? 'text-[#C2410C]' : 'text-[#64748B]'
                              }`}
                            />
                            <span className="leading-snug">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Indicator */}
                    <div className="mt-5 pt-3">
                      <div
                        className={`w-full py-2.5 rounded-xl text-center text-xs font-bold transition-all ${
                          isSelected
                            ? isPlatinum
                              ? 'bg-[#D97706] text-white shadow-md'
                              : 'bg-[#C2410C] text-white shadow-md'
                            : 'bg-[#FAF8F5] text-[#78716C] border border-[#EADCC8]'
                        }`}
                      >
                        {isSelected ? 'Selected Plan' : 'Choose Plan'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Primary 1-Click Razorpay Checkout Button ── */}
            <div className="bg-gradient-to-r from-[#FFFBEB] via-[#FFF7ED] to-[#FEF3C7]/40 border border-[#FED7AA] rounded-3xl p-6 mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <ShieldCheck size={18} className="text-[#15803D]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#15803D]">
                    100% Secure Instant Online Activation
                  </span>
                </div>
                <h3 className="font-serif font-bold text-xl text-[#1C1917]">
                  Selected: <span className="text-[#C2410C]">{selectedPlan.name}</span> (₹{selectedPlan.amount})
                </h3>
                <p className="text-xs text-[#78716C]">
                  Pay securely with UPI (PhonePe, GPay, Paytm, BHIM), Credit/Debit Cards, or NetBanking.
                </p>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={handleRazorpayCheckout}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#D97706] text-white font-bold text-sm sm:text-base rounded-2xl shadow-xl shadow-[#C2410C]/25 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer shrink-0"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    <span>Proceed to Pay ₹{selectedPlan.amount}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>

            {/* Payment Method Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#78716C] mb-6">
              <span className="flex items-center gap-1 font-semibold text-[#44403C]">
                <ShieldCheck size={14} className="text-[#15803D]" /> Verified by Razorpay
              </span>
              <span>•</span>
              <span>Instant Auto-Activation</span>
              <span>•</span>
              <span>All UPI Apps Supported</span>
              <span>•</span>
              <span>256-Bit SSL Encryption</span>
            </div>

            {/* ── Collapsible Fallback: Direct UPI QR Scan & Manual UTR ── */}
            <div className="border border-[#EADCC8] rounded-2xl overflow-hidden bg-[#FAF8F5]">
              <button
                type="button"
                onClick={() => setShowManualUpi(!showManualUpi)}
                className="w-full p-4 flex items-center justify-between text-xs font-bold text-[#574F47] hover:text-[#1C1917] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <QrCode size={16} className="text-[#C2410C]" />
                  <span>Looking for Direct UPI QR Code / Manual Bank Transfer?</span>
                </div>
                {showManualUpi ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showManualUpi && (
                <div className="p-5 border-t border-[#EADCC8] bg-white space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Official Square PhonePe QR Code */}
                    <div className="md:col-span-5 flex flex-col items-center justify-center p-3.5 bg-[#FAF8F5] border border-[#EADCC8] rounded-2xl text-center">
                      <div className="p-2 bg-white rounded-xl border border-[#E5D7C5] shadow-md mb-2 w-full max-w-[190px] flex items-center justify-center overflow-hidden">
                        <img
                          src={officialQrPath}
                          alt="Scan Official UPI QR Code"
                          className="w-full h-auto object-contain rounded-lg max-h-48"
                          onError={(e) => {
                            e.target.src = fallbackQrUrl;
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-[#44403C]">Scan with Any UPI App</span>
                      <span className="text-[10px] text-[#78716C]">Pay ₹{selectedPlan.amount} ({selectedPlan.name})</span>
                    </div>

                    {/* Payee Info & Copy UPI ID */}
                    <div className="md:col-span-7 space-y-3">
                      <div>
                        <span className="text-[10px] text-[#78716C] block uppercase font-bold tracking-wider">
                          Payee Name:
                        </span>
                        <strong className="text-[#1C1917] text-sm block font-serif">{payeeName}</strong>
                      </div>

                      <div>
                        <span className="text-[10px] text-[#78716C] block uppercase font-bold tracking-wider mb-1">
                          Official UPI ID:
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-[#FAF8F5] border border-[#EADCC8] rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-[#1C1917] select-all truncate shadow-inner">
                            {upiId}
                          </div>
                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            className="px-3.5 py-2 bg-[#FFF7ED] hover:bg-[#FFEDD5] border border-[#FED7AA] text-[#C2410C] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                          >
                            {copied ? <Check size={14} className="text-[#15803D]" /> : <Copy size={14} />}
                            <span>{copied ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        {copyNotice && (
                          <p className="text-[11px] font-semibold text-emerald-700 mt-1">{copyNotice}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Manual UTR Submission Form */}
                  <form onSubmit={handleManualUtrSubmit} className="pt-4 border-t border-[#EADCC8] space-y-3">
                    <label className="block text-[11px] font-bold text-[#574F47] uppercase tracking-wider">
                      Or Submit 12-Digit UPI / UTR Reference Number:
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. 423985729104 (12-digit UTR)"
                        className="flex-1 bg-[#FAF8F5] border border-[#EADCC8] focus:border-[#C2410C] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-[#1C1917] font-mono outline-none"
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-2.5 bg-[#C2410C] text-white font-bold text-xs rounded-xl shadow hover:brightness-105 transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <span>Submit UTR</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Trust & Direct Kendra Helpline Callout */}
            <div className="mt-6 p-4 bg-gradient-to-r from-[#F0FDF4] to-[#DCFCE7]/40 border border-[#BBF7D0] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-2.5">
                <UserCheck size={18} className="text-[#16A34A] shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-[#15803D]">Need Assistance with Membership?</h5>
                  <p className="text-[11px] text-[#4B5563]">Shriram Samupdeshan Kendra Coordinator Helpline</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`tel:${supportPhone}`}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <PhoneCall size={12} />
                  <span>Call {formattedPhone}</span>
                </a>
                <a
                  href={`https://wa.me/91${supportPhone}?text=${encodeURIComponent(`Namaste Panditji, I need assistance with the Matrimony Membership Plans (${selectedPlan.name} ₹${selectedPlan.amount}).`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <MessageSquare size={12} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Footer Sign Out */}
            <div className="mt-6 pt-4 border-t border-[#F5EFE6] flex items-center justify-between text-xs text-[#78716C]">
              <span>Candidate Code: <strong className="font-mono text-[#C2410C]">{user?.username}</strong></span>
              <button
                type="button"
                onClick={onLogout}
                className="hover:text-[#1C1917] underline cursor-pointer"
              >
                Exit / Sign Out
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default React.memo(MembershipPaymentGate);
