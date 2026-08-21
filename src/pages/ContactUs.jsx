import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle2, HelpCircle } from 'lucide-react';
import SEO from '../components/SEO';

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
        // Construct WhatsApp message URL for direct instant routing
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
        schema: {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact Astro Pravin",
            "url": "https://astropravin.com/contact",
            "mainEntity": {
                "@type": "LocalBusiness",
                "name": "Astro Pravin - Shriram Samupdeshan Kendra",
                "telephone": "+919921697908",
                "email": "pravin.shriram@gmail.com",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Shop no.2,3, S.S Icon shopping complex, Gharkul road",
                    "addressLocality": "Solapur",
                    "addressRegion": "Maharashtra",
                    "postalCode": "413006",
                    "addressCountry": "IN"
                },
                "openingHours": "Mo-Sa 09:00-20:00"
            }
        }
    };

    return (
        <div className="min-h-screen bg-void text-white pt-28 pb-20 px-6 font-sans">
            <SEO {...seoData} />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-secondary uppercase tracking-[0.3em] text-xs font-semibold">Get In Touch</span>
                    <h1 className="text-4xl md:text-6xl font-serif text-white mt-3 mb-6">
                        We Are Here to Guide You
                    </h1>
                    <p className="text-white/70 text-lg leading-relaxed">
                        Have questions about your horoscope, marital compatibility, or Vastu alignment? Contact Pandit Pravin Shriram for personalized, confidential counseling.
                    </p>
                </div>

                {/* Main Contact Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
                    {/* Left: Contact Directory */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8">
                            <h2 className="text-2xl font-serif text-white border-b border-white/10 pb-4">
                                Consultation Center
                            </h2>

                            {/* Address */}
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-2xl text-secondary shrink-0 mt-1">
                                    <MapPin size={22} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider">Physical Office</h3>
                                    <p className="text-white font-medium text-base mt-1 leading-relaxed">
                                        Shop no.2, 3, S.S Icon Shopping Complex,<br />
                                        Gharkul Road, Solapur,<br />
                                        Maharashtra - 413006, India
                                    </p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-2xl text-secondary shrink-0 mt-1">
                                    <Phone size={22} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider">Phone & WhatsApp</h3>
                                    <p className="text-white font-medium text-base mt-1">
                                        <a href="tel:+919921697908" className="hover:text-secondary transition-colors block">
                                            +91 99216 97908
                                        </a>
                                    </p>
                                    <p className="text-xs text-white/50 mt-0.5">Direct line to Pandit Pravin Shriram</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-2xl text-secondary shrink-0 mt-1">
                                    <Mail size={22} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider">Email Inquiry</h3>
                                    <p className="text-white font-medium text-base mt-1">
                                        <a href="mailto:pravin.shriram@gmail.com" className="hover:text-secondary transition-colors">
                                            pravin.shriram@gmail.com
                                        </a>
                                    </p>
                                    <p className="text-xs text-white/50 mt-0.5">Response within 24 business hours</p>
                                </div>
                            </div>

                            {/* Hours */}
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-2xl text-secondary shrink-0 mt-1">
                                    <Clock size={22} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider">Consultation Timings</h3>
                                    <p className="text-white font-medium text-base mt-1">
                                        Monday – Saturday: 09:00 AM – 08:00 PM IST
                                    </p>
                                    <p className="text-xs text-secondary mt-0.5">Sunday: Advance appointments only</p>
                                </div>
                            </div>
                        </div>

                        {/* WhatsApp Direct Action */}
                        <a
                            href="https://wa.me/919921697908?text=Hello%20Pandit%20Pravin%20ji,%20I%20would%20like%20to%20book%20a%20consultation."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-2xl transition-all shadow-lg text-sm"
                        >
                            <MessageSquare size={18} />
                            Chat with Pandit Ji on WhatsApp
                        </a>
                    </div>

                    {/* Right: Interactive Inquiry Form */}
                    <div className="lg:col-span-7 bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-10">
                        <h2 className="text-2xl md:text-3xl font-serif text-white mb-2">Send an Inquiry</h2>
                        <p className="text-white/60 text-sm mb-8">
                            Fill out the form below to receive consultation details and appointment scheduling assistance.
                        </p>

                        {submitted ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-emerald-500/10 border border-emerald-500/30 p-8 rounded-2xl text-center space-y-4"
                            >
                                <CheckCircle2 className="text-emerald-400 mx-auto" size={48} />
                                <h3 className="text-xl font-serif text-white">Inquiry Sent Successfully!</h3>
                                <p className="text-white/70 text-sm max-w-md mx-auto">
                                    Your request has been initiated. Pandit Pravin Shriram's team will connect with you shortly on WhatsApp/Phone.
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold text-white transition-colors"
                                >
                                    Send Another Inquiry
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                                            Your Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. Rushikesh Shriram"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-secondary transition-colors text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                                            Phone / WhatsApp Number *
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="e.g. +91 99216 97908"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-secondary transition-colors text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="e.g. client@example.com"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-secondary transition-colors text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                                            Service Required
                                        </label>
                                        <select
                                            value={formData.service}
                                            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors text-sm"
                                        >
                                            <option value="Kundli Analysis & Horoscope Reading">Kundli Analysis & Horoscope Reading</option>
                                            <option value="Kundli Matching (Gun Milan) for Marriage">Kundli Matching (Gun Milan) for Marriage</option>
                                            <option value="Vastu Shastra Consultation (Home / Commercial)">Vastu Shastra Consultation</option>
                                            <option value="Numerology Name & Business Alignment">Numerology Name & Business Alignment</option>
                                            <option value="Gemstone Recommendation & Energization">Gemstone Recommendation</option>
                                            <option value="Pooja / Anushthan Services">Pooja / Anushthan Services</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                                        Your Query / Birth Details (Optional)
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Describe your questions or provide Date, Time, and Place of Birth if known..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-secondary transition-colors text-sm"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 text-sm"
                                >
                                    <Send size={18} />
                                    Submit Consultation Inquiry
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Map & FAQs */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
                    {/* Google Map */}
                    <div className="lg:col-span-6 bg-white/5 border border-white/10 rounded-3xl p-6 overflow-hidden">
                        <h3 className="text-xl font-serif text-white mb-4 flex items-center gap-2">
                            <MapPin size={20} className="text-secondary" /> Location Map
                        </h3>
                        <div className="rounded-2xl overflow-hidden h-80 w-full border border-white/10">
                            <iframe
                                title="Office Location Solapur"
                                src="https://www.google.com/maps/embed?pb=!4v1767349561152!6m8!1m7!1sTkv02Rj-fmGREl8uvnfHmQ!2m2!1d17.67872176018039!2d75.93450994017743!3f204.90698098286538!4f10.498427275404723!5f1.0641078130381885"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>

                    {/* Consultation FAQs */}
                    <div className="lg:col-span-6 space-y-4">
                        <h3 className="text-xl font-serif text-white mb-4 flex items-center gap-2">
                            <HelpCircle size={20} className="text-secondary" /> Frequently Asked Questions
                        </h3>
                        <div className="space-y-4">
                            {contactFaqs.map((faq, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2">
                                    <h4 className="font-semibold text-white text-base">{faq.q}</h4>
                                    <p className="text-white/70 text-sm leading-relaxed">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
