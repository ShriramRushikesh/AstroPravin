import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../config';
import { X, Sparkles, User, Calendar, MapPin, Clock, Mail, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { LotusCrest } from './VedicDecorativeArt';

const BookingModal = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        topic: 'Kundli Matching & Marriage',
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
        'Kundli Matching & Marriage',
        'Career & Financial Growth',
        'Complete Life Horoscope (Patrika)',
        'Vastu Shastra Consultation',
        'Health & Dosha Remedies',
        'Gemstone & Rudraksha Guidance'
    ];

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.phone || !formData.birthDate || !formData.birthTime || !formData.birthPlace) {
            return alert('Please fill in your Name, Phone, Date of Birth, Birth Time, and Birth Place.');
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
                    name: '', email: '', phone: '', topic: 'Kundli Matching & Marriage', gender: 'Male',
                    birthDate: '', birthTime: '', birthPlace: '', preferredDate: '', preferredTime: ''
                });
            } else {
                const err = await res.json();
                alert(`Booking Error: ${err.message || 'Please try again or contact via WhatsApp.'}`);
            }
        } catch (error) {
            alert(`Connection Error. Please check your internet or contact directly via WhatsApp (+91 99216 97908).`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
                className="relative bg-[#FAF8F5] border border-[#EADCC8] w-full max-w-lg rounded-3xl shadow-luxury-hover overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-[#EADCC8] bg-white flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center">
                            <LotusCrest className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold font-serif text-[#1C1917]">
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
                                Appointment Requested!
                            </h3>

                            <p className="text-xs sm:text-sm text-[#78716C] max-w-sm">
                                Pandit Acharya Pravin's Kendra has received your details. We will contact you on WhatsApp / Phone with confirmed consultation time.
                            </p>

                            <button
                                onClick={onClose}
                                className="px-8 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#C2410C] to-[#EA580C] shadow-sm hover:scale-105 transition-transform"
                            >
                                Done
                            </button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
                            {/* Consultation Topic */}
                            <div>
                                <label className="block text-xs font-bold text-[#44403C] uppercase tracking-wider mb-1.5">
                                    Consultation Topic *
                                </label>
                                <select
                                    value={formData.topic}
                                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#EADCC8] text-[#1C1917] focus:outline-none focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C]"
                                >
                                    {topics.map((t) => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Full Name & Phone */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-[#44403C] uppercase tracking-wider mb-1.5">
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

                                <div>
                                    <label className="block text-xs font-bold text-[#44403C] uppercase tracking-wider mb-1.5">
                                        WhatsApp / Mobile *
                                    </label>
                                    <div className="relative">
                                        <Phone size={14} className="absolute left-3 top-3 text-[#78716C]" />
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="10-digit number"
                                            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-[#EADCC8] text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C2410C]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Date of Birth & Time of Birth */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-[#44403C] uppercase tracking-wider mb-1.5">
                                        Birth Date (Kundli) *
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

                                <div>
                                    <label className="block text-xs font-bold text-[#44403C] uppercase tracking-wider mb-1.5">
                                        Birth Time *
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
                            </div>

                            {/* Place of Birth */}
                            <div>
                                <label className="block text-xs font-bold text-[#44403C] uppercase tracking-wider mb-1.5">
                                    Birth City / Place *
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

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#D97706] shadow-luxury hover:shadow-luxury-hover hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Submitting Request...' : 'Confirm Appointment Request'}
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
