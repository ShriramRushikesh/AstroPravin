import React from 'react';
import SEO from '../components/SEO';
import { ShieldCheck, Lock, Eye, Bell, Globe, Mail, FileText } from 'lucide-react';
import { LotusCrest } from '../components/VedicDecorativeArt';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] pt-32 pb-20 px-4 sm:px-6 font-sans">
            <SEO
                title="Privacy Policy | Astro Pravin - Shriram Samupdeshan Kendra"
                description="Official Privacy Policy for Astro Pravin. Learn how we collect, protect, and handle data, including our compliance with Google AdSense, cookies, and data protection laws."
                keywords="Astro Pravin privacy policy, astrology data privacy, google adsense cookie disclosure, GDPR compliance astrology, DPDP Act 2023 India"
            />
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="border-b border-[#EADCC8] pb-6">
                    <div className="flex items-center gap-2 text-[#C2410C] text-xs font-bold tracking-widest uppercase mb-2">
                        <ShieldCheck size={16} />
                        <span>Data Protection & Privacy</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#1C1917]">Privacy Policy</h1>
                    <p className="text-[#78716C] text-xs mt-2">
                        Effective Date: August 2024 • Last Updated: August 2026
                    </p>
                </div>

                {/* 1. Introduction */}
                <section className="bg-white rounded-3xl p-8 border border-[#EADCC8] shadow-luxury space-y-4">
                    <h2 className="text-xl font-serif font-bold text-[#1C1917] flex items-center gap-2">
                        <FileText size={18} className="text-[#C2410C]" /> 1. Introduction & Overview
                    </h2>
                    <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed">
                        Welcome to <strong>Astro Pravin</strong> (accessible at <a href="https://astropravin.com" className="text-[#C2410C] underline">https://astropravin.com</a>), operated under <strong>Shriram Samupdeshan Kendra</strong> ("we," "us," or "our"). We are deeply committed to protecting the privacy, confidentiality, and integrity of your personal information.
                    </p>
                    <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed">
                        This Privacy Policy describes our practices regarding the collection, use, maintenance, protection, and disclosure of information when you visit our website, utilize our Vedic astrology calculators, book consultations, or interact with third-party partners.
                    </p>
                </section>

                {/* 2. Information We Collect */}
                <section className="bg-white rounded-3xl p-8 border border-[#EADCC8] shadow-luxury space-y-4">
                    <h2 className="text-xl font-serif font-bold text-[#1C1917] flex items-center gap-2">
                        <Eye size={18} className="text-[#C2410C]" /> 2. Information We Collect
                    </h2>
                    <div className="space-y-3 text-xs sm:text-sm text-[#44403C]">
                        <p><strong>A. Information Provided Voluntarily:</strong></p>
                        <ul className="list-disc pl-5 space-y-1.5 text-[#78716C]">
                            <li><strong>Identity Details:</strong> Full Name, Gender, and Marital Status.</li>
                            <li><strong>Birth Details:</strong> Date of Birth, Exact Time of Birth, and Place of Birth required strictly for constructing Janma Kundli and Ashtakoot Gun Milan.</li>
                            <li><strong>Contact Details:</strong> Phone/WhatsApp number for appointment scheduling and PDF horoscope delivery.</li>
                        </ul>

                        <p className="pt-2"><strong>B. Log Information:</strong></p>
                        <p className="text-[#78716C]">
                            Standard non-personally identifiable log information such as IP addresses, browser types, and timestamp metrics for site performance and security analysis.
                        </p>
                    </div>
                </section>

                {/* 3. Confidentiality of Astrological Records */}
                <section className="bg-[#FFFDF9] rounded-3xl p-8 border border-[#FED7AA] shadow-luxury space-y-4">
                    <h2 className="text-xl font-serif font-bold text-[#1C1917] flex items-center gap-2">
                        <Lock size={18} className="text-[#C2410C]" /> 3. Confidentiality of Astrological Readings
                    </h2>
                    <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed">
                        All Kundli readings, matrimonial matching consultations, family details, and personal questions discussed during consultations with Pandit Pravin Shriram are treated with absolute confidentiality and are never shared, sold, or distributed to any third party.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default React.memo(PrivacyPolicy);
