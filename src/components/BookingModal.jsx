import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../config';
import {
    X, Sparkles, User, Calendar, MapPin, Clock, Mail, Phone,
    Heart, Briefcase, Compass, ShieldCheck, CheckCircle2, Home, Activity, Gem
} from 'lucide-react';
import { LotusCrest } from './VedicDecorativeArt';

const BookingModal = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
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
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const topics = [
        { label: 'Love & Marriage', icon: Heart, desc: 'Kundli Milan & Relationship' },
        { label: 'Career & Wealth', icon: Briefcase, desc: 'Job, Promotion & Finance' },
        { label: 'Life Analysis (Kundli)', icon: Sparkles, desc: 'Complete Patrika Reading' },
        { label: 'Vastu Shastra Consultation', icon: Home, desc: 'Home, Shop & Factory Energy' },
        { label: 'Health & Dosha Remedies', icon: Activity, desc: 'Kaal Sarp, Mangal & Shani' },
        { label: 'Gemstone Guidance', icon: Gem, desc: 'Certified Ratna & Rudraksha' },
    ];

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.phone || !formData.birthDate || !formData.birthTime || !formData.birthPlace) {
            return alert('Please fill in your Name, Phone Number, Date of Birth, Birth Time, and Birth Place.');
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    email: formData.email || `${formData.phone}@astropravin.com`,
                    astrologer: 'Acharya Pravin'
                })
            });

            if (res.ok) {
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
                const err = await res.json().catch(() => ({}));
                alert(`Booking Error: ${err.message || 'Please try again or contact via WhatsApp.'}`);
            }
        } catch (error) {
            alert(`Connection Error. Please check your connection or contact Panditji directly on WhatsApp (+91 99216 97908).`);
        } finally {
            setLoading(false);
        }
    };

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
                                Book Vedic Consultation
                            </h2>
                            <p className="text-[11px] text-[#78716C]">
                                Direct consultation with Pandit Pravin Shriram
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
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-8 flex flex-col items-center justify-center text-center py-12 space-y-4"
                        >
                            <div className="w-16 h-16 bg-[#FFF7ED] border-2 border-[#FED7AA] rounded-full flex items-center justify-center text-[#C2410C] shadow-md">
                                <CheckCircle2 size={36} />
                            </div>

                            <h3 className="text-2xl font-serif font-bold text-[#1C1917]">
                                Consultation Requested!
                            </h3>

                            <p className="text-xs sm:text-sm text-[#78716C] max-w-sm leading-relaxed">
                                Pandit Acharya Pravin's Kendra has received your details. We will contact you on WhatsApp / Phone with your confirmed consultation time.
                            </p>

                            <div className="pt-2">
                                <button
                                    onClick={onClose}
                                    className="px-8 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#C2410C] to-[#EA580C] shadow-sm hover:scale-105 transition-transform cursor-pointer"
                                >
                                    Done
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
                            {/* Consultation Topic Grid (Interactive Previous Choices) */}
                            <div>
                                <label className="block text-xs font-bold text-[#44403C] uppercase tracking-wider mb-2">
                                    Select Consultation Topic *
                                </label>
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
                                                <div>
                                                    <span className="font-bold text-xs block leading-tight">{t.label}</span>
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
                                            Email Address (Optional)
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

                            {/* Preferred Consultation Time (Optional) */}
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

                            {/* Submit Button */}
                            <div className="pt-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#D97706] shadow-luxury hover:shadow-luxury-hover hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
                                >
                                    {loading ? 'Confirming Appointment...' : 'Confirm Consultation Booking'}
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
