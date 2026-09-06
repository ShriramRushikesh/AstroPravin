import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../config';
import {
    X, Sparkles, User, Calendar, MapPin, Clock, Mail, Phone,
    Heart, Briefcase, Compass, ShieldCheck, CheckCircle2, Home, Activity, Gem
} from 'lucide-react';
import { LotusCrest } from './VedicDecorativeArt';

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            return resolve(true);
        }
        const existing = document.querySelector('script[src*="checkout.razorpay.com"]');
        if (existing) {
            existing.addEventListener('load', () => resolve(true));
            existing.addEventListener('error', () => resolve(false));
            setTimeout(() => resolve(!!window.Razorpay), 2500);
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

const BookingModal = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [submittedBooking, setSubmittedBooking] = useState(null);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        topic: 'Love & Marriage',
        name: '',
        email: '',
        phone: '',
        gender: 'Male',
        birthDate: '',
        birthTime: '',
        birthPlace: '',
        preferredDate: '',
        preferredTime: ''
    });

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setShowSuccess(false);
            setError('');
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const topics = [
        { label: 'Love & Marriage', icon: Heart, desc: 'Kundli Milan & Relationship', fee: 1100 },
        { label: 'Career & Wealth', icon: Briefcase, desc: 'Job, Promotion & Finance', fee: 1100 },
        { label: 'Life Analysis (Kundli)', icon: Sparkles, desc: 'Complete Patrika Reading', fee: 2100 },
        { label: 'Vastu Shastra Consultation', icon: Home, desc: 'Home, Shop & Factory Energy', fee: 2100 },
        { label: 'Health & Dosha Remedies', icon: Activity, desc: 'Kaal Sarp, Mangal & Shani', fee: 1100 },
        { label: 'Gemstone Guidance', icon: Gem, desc: 'Certified Ratna & Rudraksha', fee: 501 },
    ];

    const currentTopic = topics.find(t => t.label === formData.topic) || topics[0];
    const currentFee = currentTopic.fee;

    const generateCustomerGCalUrl = (booking) => {
        if (!booking) return '#';
        let startDateTime = new Date();
        let endDateTime = new Date(startDateTime.getTime() + 45 * 60 * 1000);

        if (booking.preferredDate) {
            const parts = String(booking.preferredDate).split(/[-/]/);
            let y = 2026, m = 0, d = 1;
            if (parts[0]?.length === 4) {
                y = parseInt(parts[0], 10);
                m = parseInt(parts[1], 10) - 1;
                d = parseInt(parts[2], 10);
            } else if (parts.length >= 3) {
                d = parseInt(parts[0], 10);
                m = parseInt(parts[1], 10) - 1;
                y = parseInt(parts[2], 10);
            }

            let hours = 10, minutes = 0;
            if (booking.preferredTime) {
                const tm = String(booking.preferredTime).match(/(\d+):?(\d+)?\s*(AM|PM)?/i);
                if (tm) {
                    let h = parseInt(tm[1], 10);
                    const mn = parseInt(tm[2] || '0', 10);
                    const period = (tm[3] || '').toUpperCase();
                    if (period === 'PM' && h < 12) h += 12;
                    if (period === 'AM' && h === 12) h = 0;
                    hours = h;
                    minutes = mn;
                }
            }

            if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
                startDateTime = new Date(y, m, d, hours, minutes, 0);
                endDateTime = new Date(startDateTime.getTime() + 45 * 60 * 1000);
            }
        }

        const formatIso = (dt) => dt.toISOString().replace(/-|:|\.\d+/g, '');
        const dates = `${formatIso(startDateTime)}/${formatIso(endDateTime)}`;
        const title = `Vedic Jyotish Consultation with Pandit Pravin Shriram (${booking.topic || 'Astrology'})`;
        const details = `🕉️ AstroPravin Consultation Confirmed\nTopic: ${booking.topic}\nDevotee: ${booking.name}\nPhone: ${booking.phone}\nPayment ID: ${booking.paymentDetails?.razorpay_payment_id || 'PAID'}\nReceipt: ${booking.receiptNumber || 'N/A'}\nConsultant: Pandit Pravin Shriram (+91 99216 97908)\nSolapur Kendra: Shop no.2,3, S.S Icon shopping complex, Solapur\n|| Shri Swami Samarth ||`;

        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: title,
            dates: dates,
            details: details,
            location: 'Solapur Kendra / WhatsApp Video Call (+91 99216 97908)',
        });

        return `https://calendar.google.com/calendar/render?${params.toString()}`;
    };

    const handleProceedToPayment = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name.trim() || !formData.phone.trim() || !formData.birthDate || !formData.birthTime || !formData.birthPlace.trim()) {
            setError('Please fill in your Full Name, Mobile Number, Date of Birth, Time of Birth, and Place of Birth.');
            return;
        }

        const cleanPhone = formData.phone.replace(/\D/g, '').slice(-10);
        if (cleanPhone.length !== 10) {
            setError('Please enter a valid 10-digit Indian WhatsApp / Mobile number.');
            return;
        }

        setLoading(true);

        try {
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                throw new Error('Razorpay Payment Gateway failed to load. Please check your internet connection.');
            }

            const bookingPayload = {
                ...formData,
                phone: cleanPhone,
                email: formData.email.trim() || `${cleanPhone}@astropravin.com`,
                astrologer: 'Pandit Pravin Shriram',
                amount: currentFee,
            };

            // 1. Create Razorpay Order on Backend
            const orderRes = await fetch(`${API_URL}/api/bookings/create-razorpay-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: currentFee,
                    topic: formData.topic,
                    name: formData.name.trim(),
                    phone: cleanPhone,
                    email: bookingPayload.email,
                }),
            });

            const orderData = await orderRes.json();
            if (!orderRes.ok || !orderData.orderId) {
                throw new Error(orderData.message || 'Could not initiate consultation booking payment.');
            }

            // 2. Launch Razorpay Checkout Modal
            const razorpayKey = orderData.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TTvoOCRWmpKPkv';
            const options = {
                key: razorpayKey,
                amount: orderData.amountInPaise,
                currency: orderData.currency || 'INR',
                name: 'AstroPravin Jyotish Kendra',
                description: `Vedic Consultation: ${formData.topic} (Pandit Pravin Shriram)`,
                image: '/pravin-shriram.png',
                order_id: orderData.orderId,
                handler: async (response) => {
                    setLoading(true);
                    try {
                        // 3. Verify Payment Signature & Save Confirmed Booking in DB
                        const verifyRes = await fetch(`${API_URL}/api/bookings/verify-and-create`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                bookingData: bookingPayload,
                                amount: currentFee,
                            }),
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyRes.ok && verifyData.success) {
                            setSubmittedBooking({
                                ...bookingPayload,
                                receiptNumber: verifyData.receiptNumber,
                                paymentDetails: {
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    amount: currentFee,
                                },
                            });
                            setShowSuccess(true);
                            setFormData({
                                topic: 'Love & Marriage',
                                name: '',
                                email: '',
                                phone: '',
                                gender: 'Male',
                                birthDate: '',
                                birthTime: '',
                                birthPlace: '',
                                preferredDate: '',
                                preferredTime: ''
                            });
                        } else {
                            throw new Error(verifyData.message || 'Payment verification failed.');
                        }
                    } catch (verErr) {
                        console.error('Booking payment verification error:', verErr);
                        setError(verErr.message || 'Payment was processed but booking confirmation failed. Please contact Panditji on WhatsApp.');
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: formData.name.trim(),
                    contact: cleanPhone,
                    email: formData.email.trim() || '',
                },
                notes: {
                    devoteeName: formData.name.trim(),
                    topic: formData.topic,
                    preferredSlot: `${formData.preferredDate || 'N/A'} ${formData.preferredTime || ''}`,
                    astrologer: 'Pandit Pravin Shriram',
                },
                theme: {
                    color: '#C2410C',
                },
                modal: {
                    ondismiss: () => {
                        setLoading(false);
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (resp) {
                setLoading(false);
                setError(`Payment Failed: ${resp.error?.description || 'Transaction cancelled or declined.'}`);
            });
            rzp.open();
        } catch (err) {
            console.error('Booking flow error:', err);
            setError(err.message || 'Payment gateway connection error. Please try again.');
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-[#1C1917]/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                className="relative bg-[#FAF8F5] border border-[#EADCC8] w-full max-w-xl rounded-3xl shadow-luxury-hover overflow-hidden flex flex-col max-h-[92vh]"
            >
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-[#EADCC8] bg-white flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#C2410C]">
                            <LotusCrest className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base sm:text-lg font-bold font-serif text-[#1C1917]">
                                Talk to Online Jyotish
                            </h2>
                            <p className="text-[11px] text-[#78716C]">
                                Direct consultation with Jyotish Pravin Shriram (Panditji)
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-[#F5F0E8] border border-[#EADCC8] flex items-center justify-center text-[#78716C] hover:text-[#C2410C] hover:bg-[#FFF7ED] transition-colors"
                        aria-label="Close"
                    >
                        <X size={16} />
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {showSuccess ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4 max-h-[85vh] overflow-y-auto"
                        >
                            <div className="w-16 h-16 bg-[#F0FDF4] border-2 border-[#BBF7D0] rounded-full flex items-center justify-center text-[#16A34A] shadow-md">
                                <CheckCircle2 size={36} />
                            </div>

                            <div>
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F0FDF4] border border-[#BBF7D0] rounded-full text-[11px] font-bold text-[#16A34A] uppercase tracking-wider mb-2">
                                    <ShieldCheck size={13} /> Payment Verified (₹{submittedBooking?.amount || currentFee})
                                </span>
                                <h3 className="text-2xl font-serif font-bold text-[#1C1917]">
                                    Consultation Confirmed!
                                </h3>
                                <p className="text-xs sm:text-sm text-[#78716C] max-w-sm mt-1">
                                    Your appointment with <strong>Pandit Pravin Shriram</strong> has been secured.
                                </p>
                            </div>

                            {/* Booking Details Card */}
                            {submittedBooking && (
                                <div className="w-full bg-white border border-[#EADCC8] rounded-2xl p-4 text-left text-xs space-y-2.5 shadow-sm">
                                    <div className="flex justify-between items-center border-b border-[#F5F0E8] pb-2">
                                        <span className="text-[#78716C]">Receipt Number:</span>
                                        <span className="font-mono font-bold text-[#C2410C]">{submittedBooking.receiptNumber}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-[#F5F0E8] pb-2">
                                        <span className="text-[#78716C]">Payment Reference:</span>
                                        <span className="font-mono font-medium text-[#1C1917]">{submittedBooking.paymentDetails?.razorpay_payment_id || 'Razorpay Verified'}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-[#F5F0E8] pb-2">
                                        <span className="text-[#78716C]">Topic:</span>
                                        <span className="font-semibold text-[#1C1917]">{submittedBooking.topic}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#78716C]">Scheduled Slot:</span>
                                        <span className="font-semibold text-[#1C1917]">
                                            {submittedBooking.preferredDate || 'Upcoming Slot'} {submittedBooking.preferredTime || ''}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <p className="text-[11px] text-[#78716C] italic">
                                🔔 A calendar invitation and alert reminder have also been automatically synced with Panditji at <span className="font-semibold text-[#1C1917]">pravin.shriram@gmail.com</span>.
                            </p>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full">
                                {submittedBooking && (
                                    <a
                                        href={generateCustomerGCalUrl(submittedBooking)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold text-[#B45309] bg-[#FEF3C7] border border-[#FCD34D] hover:bg-[#FDE68A] shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                                    >
                                        <Calendar size={15} className="text-[#D97706]" />
                                        <span>Add to My Google Calendar</span>
                                    </a>
                                )}
                                <button
                                    onClick={onClose}
                                    className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#C2410C] to-[#EA580C] shadow-sm hover:scale-105 transition-transform cursor-pointer"
                                >
                                    Done
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleProceedToPayment} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
                            {error && (
                                <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-xs text-[#B91C1C] flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[#EF4444] shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Consultation Topic Grid */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-bold text-[#44403C] uppercase tracking-wider">
                                        Select Consultation Topic *
                                    </label>
                                    <span className="text-[11px] font-bold text-[#C2410C]">
                                        Fee: ₹{currentFee}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {topics.map((t) => {
                                        const Icon = t.icon;
                                        const isSelected = formData.topic === t.label;
                                        return (
                                            <button
                                                key={t.label}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, topic: t.label })}
                                                className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                                                    isSelected
                                                        ? 'bg-[#FFF7ED] border-[#C2410C] text-[#C2410C] shadow-sm ring-1 ring-[#C2410C]/30'
                                                        : 'bg-white border-[#EADCC8] text-[#44403C] hover:border-[#FED7AA] hover:bg-[#FAF8F5]'
                                                }`}
                                            >
                                                <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-[#C2410C] text-white' : 'bg-[#FAF8F5] text-[#78716C]'}`}>
                                                    <Icon size={14} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-bold text-xs block leading-tight truncate">{t.label}</span>
                                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isSelected ? 'bg-[#C2410C]/10 text-[#C2410C]' : 'bg-[#F5F0E8] text-[#78716C]'}`}>
                                                            ₹{t.fee}
                                                        </span>
                                                    </div>
                                                    <span className="text-[10px] text-[#78716C] block mt-0.5">{t.desc}</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Personal Details */}
                            <div className="pt-2 border-t border-[#EADCC8]">
                                <label className="block text-[11px] font-bold text-[#78716C] uppercase tracking-wider mb-2">
                                    Devotee / Personal Information
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-xs font-bold text-[#44403C] mb-1">
                                            Full Name *
                                        </label>
                                        <div className="relative">
                                            <User size={14} className="absolute left-3 top-3 text-[#78716C]" />
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="Your full name"
                                                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-[#EADCC8] text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C2410C]"
                                            />
                                        </div>
                                    </div>

                                    {/* WhatsApp Phone */}
                                    <div>
                                        <label className="block text-xs font-bold text-[#44403C] mb-1">
                                            WhatsApp / Mobile *
                                        </label>
                                        <div className="relative">
                                            <Phone size={14} className="absolute left-3 top-3 text-[#78716C]" />
                                            <input
                                                type="tel"
                                                required
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="10-digit mobile number"
                                                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-[#EADCC8] text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C2410C]"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-xs font-bold text-[#44403C] mb-1">
                                            Email Address (For Calendar Invite)
                                        </label>
                                        <div className="relative">
                                            <Mail size={14} className="absolute left-3 top-3 text-[#78716C]" />
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="you@email.com"
                                                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-[#EADCC8] text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C2410C]"
                                            />
                                        </div>
                                    </div>

                                    {/* Gender */}
                                    <div>
                                        <label className="block text-xs font-bold text-[#44403C] mb-1">
                                            Gender *
                                        </label>
                                        <select
                                            value={formData.gender}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#EADCC8] text-[#1C1917] focus:outline-none focus:border-[#C2410C]"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Birth Details (Kundli) */}
                            <div className="pt-2 border-t border-[#EADCC8]">
                                <label className="block text-[11px] font-bold text-[#78716C] uppercase tracking-wider mb-2">
                                    Birth Details for Kundli Patrika
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {/* Birth Date */}
                                    <div>
                                        <label className="block text-xs font-bold text-[#44403C] mb-1">
                                            Date of Birth *
                                        </label>
                                        <div className="relative">
                                            <Calendar size={14} className="absolute left-3 top-3 text-[#78716C]" />
                                            <input
                                                type="date"
                                                required
                                                value={formData.birthDate}
                                                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-[#EADCC8] text-[#1C1917] focus:outline-none focus:border-[#C2410C]"
                                            />
                                        </div>
                                    </div>

                                    {/* Birth Time */}
                                    <div>
                                        <label className="block text-xs font-bold text-[#44403C] mb-1">
                                            Time of Birth *
                                        </label>
                                        <div className="relative">
                                            <Clock size={14} className="absolute left-3 top-3 text-[#78716C]" />
                                            <input
                                                type="time"
                                                required
                                                value={formData.birthTime}
                                                onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                                                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-[#EADCC8] text-[#1C1917] focus:outline-none focus:border-[#C2410C]"
                                            />
                                        </div>
                                    </div>

                                    {/* Birth Place */}
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-bold text-[#44403C] mb-1">
                                            Place of Birth *
                                        </label>
                                        <div className="relative">
                                            <MapPin size={14} className="absolute left-3 top-3 text-[#78716C]" />
                                            <input
                                                type="text"
                                                required
                                                value={formData.birthPlace}
                                                onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                                                placeholder="City, State (e.g. Solapur, Maharashtra)"
                                                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-[#EADCC8] text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C2410C]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Preferred Consultation Time */}
                            <div className="pt-2 border-t border-[#EADCC8]">
                                <label className="block text-[11px] font-bold text-[#78716C] uppercase tracking-wider mb-2">
                                    Preferred Consultation Slot (Optional)
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-[#78716C] mb-1">
                                            Preferred Date
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.preferredDate}
                                            onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#EADCC8] text-[#1C1917] focus:outline-none focus:border-[#C2410C]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-[#78716C] mb-1">
                                            Preferred Time
                                        </label>
                                        <input
                                            type="time"
                                            value={formData.preferredTime}
                                            onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#EADCC8] text-[#1C1917] focus:outline-none focus:border-[#C2410C]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Fee & Razorpay Assurance Summary */}
                            <div className="p-3.5 bg-[#FFF7ED] border border-[#FED7AA] rounded-2xl flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-[#C2410C]/10 flex items-center justify-center text-[#C2410C]">
                                        <ShieldCheck size={16} />
                                    </div>
                                    <div>
                                        <span className="font-bold text-xs text-[#1C1917] block">Dakshina / Consultation Fee</span>
                                        <span className="text-[10px] text-[#78716C]">Razorpay 100% Secure • UPI / Cards / NetBanking</span>
                                    </div>
                                </div>
                                <span className="text-base font-bold font-serif text-[#C2410C]">₹{currentFee}</span>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#D97706] shadow-luxury hover:shadow-luxury-hover hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Opening Razorpay Gateway...</span>
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck size={16} />
                                            <span>Proceed to Pay ₹{currentFee} & Book Appointment</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default React.memo(BookingModal);
