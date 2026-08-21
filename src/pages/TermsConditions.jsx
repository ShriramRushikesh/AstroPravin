import React from 'react';
import SEO from '../components/SEO';
import { Scale, BookOpen, AlertCircle, RefreshCw, ShieldCheck, HelpCircle } from 'lucide-react';
import { LotusCrest } from '../components/VedicDecorativeArt';

const TermsConditions = () => {
    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] pt-32 pb-20 px-4 sm:px-6 font-sans">
            <SEO
                title="Terms & Conditions | Astro Pravin - Shriram Samupdeshan Kendra"
                description="Terms and Conditions of Use for Astro Pravin services, astrological consultations, Kundli calculations, and spiritual store items."
                keywords="Astro Pravin terms and conditions, astrology consultation terms, user agreement, refund policy"
            />
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="border-b border-[#EADCC8] pb-6">
                    <div className="flex items-center gap-2 text-[#C2410C] text-xs font-bold tracking-widest uppercase mb-2">
                        <Scale size={16} />
                        <span>Legal Terms of Service</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#1C1917]">Terms & Conditions</h1>
                    <p className="text-[#78716C] text-xs mt-2">
                        Effective Date: August 2024 • Last Updated: August 2026
                    </p>
                </div>

                {/* 1. Acceptance of Terms */}
                <section className="bg-white rounded-3xl p-8 border border-[#EADCC8] shadow-luxury space-y-4">
                    <h2 className="text-xl font-serif font-bold text-[#1C1917] flex items-center gap-2">
                        <BookOpen size={18} className="text-[#C2410C]" /> 1. Acceptance of Terms
                    </h2>
                    <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed">
                        By visiting, accessing, browsing, or using the website <strong>Astro Pravin</strong> (<a href="https://astropravin.com" className="text-[#C2410C] underline">https://astropravin.com</a>) or booking consultations offered by <strong>Shriram Samupdeshan Kendra</strong>, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions and our Privacy Policy.
                    </p>
                </section>

                {/* 2. Astrological Guidance Scope */}
                <section className="bg-[#FFFDF9] rounded-3xl p-8 border border-[#FED7AA] shadow-luxury space-y-4">
                    <h2 className="text-xl font-serif font-bold text-[#1C1917] flex items-center gap-2">
                        <AlertCircle size={18} className="text-[#C2410C]" /> 2. Astrological Guidance Scope & Advisory Purpose
                    </h2>
                    <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed">
                        All astrological readings, predictions, horoscope analyses, and gemstone recommendations provided on this website or during consultations with Pandit Pravin Shriram are intended for personal guidance, self-reflection, and cultural/spiritual advisory purposes.
                    </p>
                    <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed">
                        Astrological readings do not substitute licensed medical diagnosis, legal counsel, certified financial accounting, or clinical psychological therapy.
                    </p>
                </section>

                {/* 3. Orders and Consultations */}
                <section className="bg-white rounded-3xl p-8 border border-[#EADCC8] shadow-luxury space-y-4">
                    <h2 className="text-xl font-serif font-bold text-[#1C1917] flex items-center gap-2">
                        <ShieldCheck size={18} className="text-[#C2410C]" /> 3. Appointments & Spiritual Artifact Orders
                    </h2>
                    <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed">
                        Consultation slots are reserved upon mutual confirmation over WhatsApp/Phone. Natural gemstones and Rudraksha items dispatched from our Solapur Kendra are 100% lab-certified and consecrated through personalized Vedic rituals.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default React.memo(TermsConditions);
