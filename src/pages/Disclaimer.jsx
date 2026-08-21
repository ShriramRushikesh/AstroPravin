import React from 'react';
import SEO from '../components/SEO';
import { AlertTriangle, Compass, HeartPulse, Briefcase, ExternalLink, ShieldAlert } from 'lucide-react';
import { LotusCrest } from '../components/VedicDecorativeArt';

const Disclaimer = () => {
    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] pt-32 pb-20 px-4 sm:px-6 font-sans">
            <SEO
                title="Astrology & Website Disclaimer | Astro Pravin"
                description="Comprehensive Disclaimer for Astro Pravin. Understand the scope of Vedic astrology, personal responsibility, third-party advertising disclosures, and professional advice boundaries."
                keywords="Astro Pravin disclaimer, astrology prediction disclaimer, free will and karma, google adsense advertising disclaimer"
            />
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="border-b border-[#EADCC8] pb-6">
                    <div className="flex items-center gap-2 text-[#C2410C] text-xs font-bold tracking-widest uppercase mb-2">
                        <AlertTriangle size={16} />
                        <span>Important Information</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#1C1917]">Website Disclaimer</h1>
                    <p className="text-[#78716C] text-xs mt-2">
                        Last Updated: August 2026
                    </p>
                </div>

                {/* 1. General Nature of Vedic Astrology */}
                <section className="bg-white rounded-3xl p-8 border border-[#EADCC8] shadow-luxury space-y-4">
                    <h2 className="text-xl font-serif font-bold text-[#1C1917] flex items-center gap-2">
                        <Compass size={18} className="text-[#C2410C]" /> 1. Nature of Vedic Astrological Science
                    </h2>
                    <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed">
                        The content, calculations, automated charts, readings, and astrological insights provided on <strong>Astro Pravin</strong> (<a href="https://astropravin.com" className="text-[#C2410C] underline">https://astropravin.com</a>) and during personal consultations with <strong>Pandit Pravin Shriram</strong> are based on traditional Vedic Astrology (Jyotish Shastra), Numerology, and Vastu Shastra principles.
                    </p>
                    <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed">
                        Astrology is an interpretive, probabilistic spiritual discipline. While we strive to maintain the highest standard of mathematical accuracy using precise planetary ephemeris and over 25 years of scholarly practice, astrological readings are interpretive in nature. Planetary transits and birth chart indications represent predispositions and cosmic rhythms, not predetermined or unchangeable outcomes.
                    </p>
                </section>

                {/* 2. Karma, Free Will & Personal Responsibility */}
                <section className="bg-[#FFFDF9] rounded-3xl p-8 border border-[#FED7AA] shadow-luxury space-y-4">
                    <h2 className="text-xl font-serif font-bold text-[#1C1917] flex items-center gap-2">
                        <ShieldAlert size={18} className="text-[#C2410C]" /> 2. Karma, Free Will & Personal Responsibility
                    </h2>
                    <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed">
                        Vedic philosophy firmly upholds the doctrine of <em>Purushartha</em> (conscious human effort and free will) working alongside <em>Prarabdha Karma</em> (destiny). You, as an autonomous individual, retain complete responsibility for your decisions, choices, actions, and consequences in life. Astrological guidance should be utilized as a reflective tool for self-understanding and timing, never as a mechanism to abdicate personal responsibility or common sense.
                    </p>
                </section>

                {/* 3. Non-Medical & Non-Financial Disclaimer */}
                <section className="bg-white rounded-3xl p-8 border border-[#EADCC8] shadow-luxury space-y-4">
                    <h2 className="text-xl font-serif font-bold text-[#1C1917]">3. Professional Boundaries Disclaimers</h2>
                    <div className="grid md:grid-cols-2 gap-6 pt-2">
                        <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EADCC8] space-y-2">
                            <h3 className="text-sm font-bold text-[#1C1917] flex items-center gap-2">
                                <HeartPulse className="text-[#C2410C]" size={16} /> Medical & Health Disclaimer
                            </h3>
                            <p className="text-xs text-[#78716C] leading-relaxed">
                                Astrological readings or planetary remedies are never a substitute for professional medical, psychological, psychiatric, or healthcare diagnosis and treatment. Always consult certified medical practitioners.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EADCC8] space-y-2">
                            <h3 className="text-sm font-bold text-[#1C1917] flex items-center gap-2">
                                <Briefcase className="text-[#D97706]" size={16} /> Financial & Legal Disclaimer
                            </h3>
                            <p className="text-xs text-[#78716C] leading-relaxed">
                                Astrological forecasts regarding financial investments, business partnerships, or legal outcomes are for spiritual guidance only. We do not provide licensed financial, tax, or legal advisory.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default React.memo(Disclaimer);
