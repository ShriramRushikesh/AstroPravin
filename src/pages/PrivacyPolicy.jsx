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

                {/* 4. Google AdSense & Cookies Policy */}
                <section className="bg-white rounded-3xl p-8 border border-[#EADCC8] shadow-luxury space-y-4">
                    <h2 className="text-xl font-serif font-bold text-[#1C1917] flex items-center gap-2">
                        <Globe size={18} className="text-[#C2410C]" /> 4. Google AdSense & Third-Party Cookies Disclosure
                    </h2>
                    <div className="space-y-3 text-xs sm:text-sm text-[#44403C] leading-relaxed">
                        <p>
                            We use <strong>Google AdSense</strong> to serve advertisements when you visit our website. Google, as a third-party vendor, uses cookies (including the DoubleClick DART cookie) to serve ads based on your prior visits to this website or other websites on the Internet.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-[#78716C]">
                            <li>
                                <strong>Third-Party Vendors:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to our website or other websites.
                            </li>
                            <li>
                                <strong>Advertising Cookies:</strong> Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to our site and/or other sites on the Internet.
                            </li>
                            <li>
                                <strong>Personalized Ads Opt-Out:</strong> Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[#C2410C] underline font-medium">Google Ads Settings</a> or by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-[#C2410C] underline font-medium">aboutads.info</a>.
                            </li>
                            <li>
                                <strong>Partner Site Policy:</strong> To learn more about how Google uses information from sites or apps that use their services, please review <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-[#C2410C] underline font-medium">How Google uses information from sites or apps that use our services</a>.
                            </li>
                        </ul>
                    </div>
                </section>

                {/* 5. Web Analytics & Log Data */}
                <section className="bg-white rounded-3xl p-8 border border-[#EADCC8] shadow-luxury space-y-4">
                    <h2 className="text-xl font-serif font-bold text-[#1C1917] flex items-center gap-2">
                        <Bell size={18} className="text-[#C2410C]" /> 5. Web Analytics & Cookie Preferences
                    </h2>
                    <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed">
                        We may use standard web analytics tools to track aggregate website usage metrics such as visitor numbers, page views, and geographic regions. You can manage or disable cookies through your individual browser settings. Note that disabling certain cookies may affect interactive features of the website.
                    </p>
                </section>

                {/* 6. User Rights & Data Protection (GDPR & DPDP Act) */}
                <section className="bg-white rounded-3xl p-8 border border-[#EADCC8] shadow-luxury space-y-4">
                    <h2 className="text-xl font-serif font-bold text-[#1C1917] flex items-center gap-2">
                        <ShieldCheck size={18} className="text-[#C2410C]" /> 6. Your Data Rights & Consent
                    </h2>
                    <div className="space-y-3 text-xs sm:text-sm text-[#44403C] leading-relaxed">
                        <p>
                            In accordance with data protection regulations (including the Digital Personal Data Protection Act 2023 in India and applicable global guidelines), you have the right to:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-[#78716C]">
                            <li>Request confirmation of whether we process your personal birth data.</li>
                            <li>Request correction, completion, or deletion of your consultation records.</li>
                            <li>Withdraw consent for optional marketing communications at any time.</li>
                        </ul>
                    </div>
                </section>

                {/* 7. Contact & Grievance Officer */}
                <section className="bg-[#FFFDF9] rounded-3xl p-8 border border-[#FED7AA] shadow-luxury space-y-4">
                    <h2 className="text-xl font-serif font-bold text-[#1C1917] flex items-center gap-2">
                        <Mail size={18} className="text-[#C2410C]" /> 7. Privacy Contact & Grievance Redressal
                    </h2>
                    <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed">
                        If you have questions, feedback, or concerns regarding this Privacy Policy, please contact us at:
                    </p>
                    <div className="text-xs sm:text-sm text-[#78716C] space-y-1">
                        <p><strong>Shriram Samupdeshan Kendra</strong></p>
                        <p>Address: Shop no.2,3, S.S Icon shopping complex, Gharkul road, Solapur - 413006, Maharashtra, India</p>
                        <p>Phone / WhatsApp: <a href="tel:+919921697908" className="text-[#C2410C] font-medium">+91 99216 97908</a></p>
                        <p>Email: <a href="mailto:pravin.shriram@gmail.com" className="text-[#C2410C] font-medium">pravin.shriram@gmail.com</a></p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default React.memo(PrivacyPolicy);
