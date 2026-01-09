import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Briefcase, Sparkles, User, Calendar, MapPin, Clock } from 'lucide-react';

const BookingModal = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        topic: 'Love & Marriage', // Default
        gender: 'Male',
        birthDate: '',
        birthTime: '',
        birthPlace: '',
        preferredDate: '',
        preferredTime: ''
    });

    // Lock Body Scroll when Modal is Open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const topics = [
        'Love & Marriage',
        'Career & Wealth',
        'Life Analysis (Kundli)',
        'Business Consultation',
        'Health Issues'
    ];

    const [showSuccess, setShowSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.phone || !formData.birthDate || !formData.birthTime || !formData.birthPlace) {
            // Keep native alert for validation or use a small toast if preferred, 
            // but user specifically hated the "confirmation" popup. 
            // For now, let's keep validation alert simple or make it a vibration?
            // Let's stick to alert for error but fix the "Success" one which is the main event.
            return alert('Please fill in Name, Email, Phone, and all Birth Details');
        }

        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const res = await fetch(`${apiUrl}/api/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    astrologer: 'Acharya Pravin'
                })
            });

            if (res.ok) {
                setShowSuccess(true);
                // Reset form in background
                setFormData({
                    name: '', email: '', phone: '', topic: 'Love & Marriage', gender: 'Male',
                    birthDate: '', birthTime: '', birthPlace: '', preferredDate: '', preferredTime: ''
                });
            } else {
                const err = await res.json();
                alert(`Booking Failed: ${err.message || 'Unknown Error'}`);
            }
        } catch (error) {
            console.error('Booking Error:', error);
            alert('Network Error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative bg-cosmic-blue border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh]"
            >
                <AnimatePresence mode="wait">
                    {showSuccess ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="p-10 flex flex-col items-center justify-center text-center h-full min-h-[400px]"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                className="w-24 h-24 bg-gradient-to-tr from-gold to-saffron rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,215,0,0.4)]"
                            >
                                <Sparkles className="text-black" size={48} />
                            </motion.div>

                            <h2 className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-white via-gold to-white mb-4">
                                Booking Confirmed!
                            </h2>

                            <p className="text-white/70 mb-8 max-w-xs mx-auto">
                                Your cosmic consultation request has been received. Acharya Pravin will connect with you shortly.
                            </p>

                            <button
                                onClick={onClose}
                                className="px-8 py-3 bg-white/10 border border-white/20 rounded-full text-white hover:bg-gold hover:text-black transition-all mb-4"
                            >
                                Close Window
                            </button>

                            <p className="text-xs text-white/30">
                                A confirmation has been logged in our system.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col h-full overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5 flex-shrink-0">
                                <div>
                                    <h2 className="text-2xl font-serif text-white">Book Consultation</h2>
                                    <p className="text-white/40 text-sm">Directly with Acharya Pravin</p>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Form Body */}
                            <div className="p-6 overflow-y-auto custom-scrollbar flex-grow overscroll-contain min-h-0">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Topic Selection */}
                                    <div>
                                        <label className="text-saffron text-xs font-bold uppercase mb-2 block">Consultation Topic</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {topics.map(t => (
                                                <button
                                                    key={t}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, topic: t })}
                                                    className={`p-3 rounded-lg text-sm text-left transition-all border ${formData.topic === t
                                                        ? 'bg-gold text-black border-gold font-bold shadow-[0_0_10px_rgba(255,215,0,0.3)]'
                                                        : 'bg-white/5 text-white/60 border-white/5 hover:bg-white/10'
                                                        }`}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Personal Details */}
                                    <div>
                                        <label className="text-white/40 text-xs uppercase mb-2 block">Personal Details</label>
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                placeholder="Full Name *"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-gold/50"
                                            />
                                            <input
                                                type="email"
                                                placeholder="Email Address *"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-gold/50"
                                            />
                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    type="tel"
                                                    placeholder="Phone Number *"
                                                    required
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-gold/50"
                                                />
                                                <select
                                                    value={formData.gender}
                                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                    className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-gold/50"
                                                >
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Birth Details */}
                                    <div>
                                        <label className="text-white/40 text-xs uppercase mb-2 block">Birth Details (Required)</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="date"
                                                title="Birth Date"
                                                value={formData.birthDate}
                                                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                                required
                                                className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-gold/50"
                                            />
                                            <input
                                                type="time"
                                                title="Birth Time"
                                                value={formData.birthTime}
                                                onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                                                required
                                                className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-gold/50"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Birth Place"
                                                value={formData.birthPlace}
                                                onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                                                required
                                                className="col-span-2 w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-gold/50"
                                            />
                                        </div>
                                    </div>

                                    {/* Preferred Time */}
                                    <div>
                                        <label className="text-white/40 text-xs uppercase mb-2 block">Preferred Consultation Time (Optional)</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="date"
                                                value={formData.preferredDate}
                                                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                                                className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-gold/50"
                                            />
                                            <input
                                                type="time"
                                                value={formData.preferredTime}
                                                onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                                                className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-gold/50"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 bg-gradient-to-r from-saffron to-gold rounded-xl text-cosmic-blue font-bold text-lg uppercase tracking-wide hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(255,215,0,0.3)] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Confirming...' : 'Confirm Booking'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default BookingModal;
