import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle2, HelpCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { MandalaWatermark, LotusCrest } from '../components/VedicDecorativeArt';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        service: 'Kundli Analysis & Horoscope Reading',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const text = `*New Website Inquiry*\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Email:* ${formData.email}\n*Service:* ${formData.service}\n*Message:* ${formData.message}`;
        const waUrl = `https://wa.me/919921697908?text=${encodeURIComponent(text)}`;
        window.open(waUrl, '_blank');
        setSubmitted(true);
    };

    const contactFaqs = [
        {
            q: "What birth details are required for a consultation?",
            a: "We require your exact Date of Birth, Time of Birth (including AM/PM), and City/Place of Birth to accurately construct your Janma Kundli and planetary positions."
        },
        {
            q: "Do you offer consultations online for clients outside Solapur?",
            a: "Yes. We offer complete online video and phone consultations over Google Meet and WhatsApp for clients across India and internationally. Detailed PDF Kundli reports are shared electronically."
        },
        {
            q: "How do I schedule a Vastu visit for my home or factory?",
            a: "You can book a Vastu consultation by contacting us via phone or WhatsApp. For on-site visits, we inspect compass alignment, energy zones, and provide non-destructive remedial remedies."
        }
    ];

    const seoData = {
        title: "Contact Astro Pravin | Best Astrologer in Solapur - Phone & Office",
        description: "Get in touch with Pandit Pravin Shriram at Shriram Samupdeshan Kendra, Solapur. Call +91 99216 97908 for Vedic Astrology, Kundli Matching & Vastu consultations.",
        keywords: "contact astrologer Solapur, Astro Pravin phone number, Shriram Samupdeshan Kendra address, book astrology appointment Solapur, WhatsApp astrology consultation",
    };

    return (
        <div className="min-h-screen bg-[#FAF8F5] pt-28 pb-24 px-4 sm:px-6 relative overflow-hidden font-sans text-[#1C1917]">
            <SEO {...seoData} />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF7ED] border border-[#FED7AA]">
                        <LotusCrest className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
                            Kendra Connect
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#1C1917]">
                        Connect with <span className="bg-gradient-to-r from-[#C2410C] to-[#D97706] bg-clip-text text-transparent">Pandit Pravin Shriram</span>
                    </h1>

                    <p className="text-sm text-[#78716C] leading-relaxed">
                        Visit us at our Solapur Kendra or schedule an immediate online consultation via Phone or WhatsApp.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-10 items-start mb-16">
                    {/* Left: Contact Info */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white rounded-3xl p-8 border border-[#EADCC8] shadow-luxury space-y-6">
                            <h2 className="text-xl font-serif font-bold text-[#1C1917]">
                                Consultation Center
                            </h2>

                            <div className="space-y-5 text-xs sm:text-sm text-[#44403C]">
                                <div className="flex items-start gap-3">
                                    <MapPin size={18} className="text-[#C2410C] shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="block text-[#1C1917] mb-0.5">Shriram Samupdeshan Kendra</strong>
                                        <span>Shop no.2,3, S.S Icon shopping complex, Gharkul road, Solapur - 413006, Maharashtra</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Phone size={18} className="text-[#C2410C] shrink-0" />
                                    <div>
                                        <strong className="block text-[#1C1917] mb-0.5">Helpline / WhatsApp</strong>
                                        <a href="tel:+919921697908" className="text-[#C2410C] font-bold hover:underline">
                                            +91 99216 97908
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Mail size={18} className="text-[#C2410C] shrink-0" />
                                    <div>
                                        <strong className="block text-[#1C1917] mb-0.5">Email Inquiries</strong>
                                        <a href="mailto:pravin.shriram@gmail.com" className="text-[#78716C] hover:text-[#C2410C]">
                                            pravin.shriram@gmail.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Clock size={18} className="text-[#C2410C] shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="block text-[#1C1917] mb-0.5">Consultation Timings</strong>
                                        <span>Monday – Sunday: 10:00 AM – 8:00 PM IST (Prior Appointment Preferred)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Direct WhatsApp Box */}
                        <div className="bg-gradient-to-br from-[#FFF7ED] to-[#FAF8F5] rounded-3xl p-6 border border-[#FED7AA] shadow-sm flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-serif font-bold text-[#1C1917]">Instant WhatsApp Consultation</h3>
                                <p className="text-xs text-[#78716C]">Connect directly with Guruji</p>
                            </div>
                            <a
                                href="https://wa.me/919921697908?text=Namaste%20Pandit%20Pravin%20Ji,%20I%20would%20like%20to%20consult%20you."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-[#25D366] text-white text-xs font-bold rounded-xl shadow-sm hover:scale-105 transition-transform"
                            >
                                WhatsApp
                            </a>
                        </div>
                    </div>

                    {/* Right: Message Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#EADCC8] shadow-luxury">
                            <h2 className="text-xl font-serif font-bold text-[#1C1917] mb-6">
                                Send Consultation Request
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                                <div>
                                    <label className="block text-xs font-bold text-[#44403C] uppercase tracking-wider mb-1.5">
                                        Your Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="E.g. Shriram Deshmukh"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EADCC8] text-[#1C1917] focus:outline-none focus:border-[#C2410C]"
                                    />
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-[#44403C] uppercase tracking-wider mb-1.5">
                                            Phone / WhatsApp *
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="10-digit number"
                                            className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EADCC8] text-[#1C1917] focus:outline-none focus:border-[#C2410C]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-[#44403C] uppercase tracking-wider mb-1.5">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="you@email.com"
                                            className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EADCC8] text-[#1C1917] focus:outline-none focus:border-[#C2410C]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-[#44403C] uppercase tracking-wider mb-1.5">
                                        Interested Service
                                    </label>
                                    <select
                                        value={formData.service}
                                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EADCC8] text-[#1C1917] focus:outline-none focus:border-[#C2410C]"
                                    >
                                        <option value="Kundli Milan & Marriage Match">Kundli Milan & Marriage Match</option>
                                        <option value="Complete Horoscope & Career Analysis">Complete Horoscope & Career Analysis</option>
                                        <option value="Vastu Shastra Consultation">Vastu Shastra Consultation</option>
                                        <option value="Gemstones & Rudraksha Guidance">Gemstones & Rudraksha Guidance</option>
                                        <option value="Navagraha Shanti Poojas">Navagraha Shanti Poojas</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-[#44403C] uppercase tracking-wider mb-1.5">
                                        Brief Question / Birth Details
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Include Date, Time & Place of Birth if asking for horoscope analysis..."
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EADCC8] text-[#1C1917] focus:outline-none focus:border-[#C2410C]"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#D97706] shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                                >
                                    <Send size={15} />
                                    Send Inquiry via WhatsApp
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Contact FAQs */}
                <div className="bg-white rounded-3xl p-8 border border-[#EADCC8] shadow-luxury max-w-4xl mx-auto space-y-4">
                    <h3 className="text-xl font-serif font-bold text-[#1C1917] mb-4 text-center">
                        Frequently Asked Questions
                    </h3>
                    <div className="space-y-4">
                        {contactFaqs.map((faq, idx) => (
                            <div key={idx} className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EADCC8]">
                                <h4 className="font-serif font-bold text-sm text-[#1C1917] mb-1">{faq.q}</h4>
                                <p className="text-xs text-[#78716C] leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ContactUs);
