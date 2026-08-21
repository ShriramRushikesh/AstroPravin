import React from 'react';
import SEO from '../components/SEO';
import { Shield, Lock, Eye, Bell, Globe, Mail, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-void text-white pt-32 pb-20 px-6 font-sans">
            <SEO
                title="Privacy Policy | Astro Pravin - Shriram Samupdeshan Kendra"
                description="Official Privacy Policy for Astro Pravin. Learn how we collect, protect, and handle data, including our compliance with Google AdSense, cookies, and data protection laws."
                keywords="Astro Pravin privacy policy, astrology data privacy, google adsense cookie disclosure, GDPR compliance astrology, DPDP Act 2023 India"
            />
            <div className="max-w-4xl mx-auto space-y-10">
                {/* Header */}
                <div className="border-b border-white/10 pb-8">
                    <div className="flex items-center gap-2 text-secondary text-sm font-semibold tracking-widest uppercase mb-2">
                        <Shield size={18} />
                        <span>Compliance & Data Protection</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight">Privacy Policy</h1>
                    <p className="text-white/60 text-sm mt-3">
                        Effective Date: August 19, 2024 • Last Updated: August 2026
                    </p>
                </div>

                {/* 1. Introduction */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-serif text-secondary flex items-center gap-2">
                        <FileText size={20} /> 1. Introduction & Overview
                    </h2>
                    <p className="text-white/80 leading-relaxed">
                        Welcome to <strong>Astro Pravin</strong> (accessible at <a href="https://astropravin.com" className="text-amber-400 underline">https://astropravin.com</a>), operated under <strong>Shriram Samupdeshan Kendra</strong> ("we," "us," or "our"). We are deeply committed to protecting the privacy, confidentiality, and integrity of your personal information.
                    </p>
                    <p className="text-white/80 leading-relaxed">
                        This Privacy Policy describes our practices regarding the collection, use, maintenance, protection, and disclosure of information when you visit our website, utilize our Vedic astrology calculators, book consultations, or interact with third-party advertising partners like Google AdSense.
                    </p>
                </section>

                {/* 2. Information We Collect */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-serif text-secondary flex items-center gap-2">
                        <Eye size={20} /> 2. Information We Collect
                    </h2>
                    <p className="text-white/80 leading-relaxed">
                        We collect information from and about users in two primary ways: directly from your voluntary input and automatically through internet logging protocols.
                    </p>
                    
                    <h3 className="text-lg font-semibold text-white mt-4">A. Information Provided Voluntarily</h3>
                    <ul className="list-disc pl-6 text-white/80 space-y-2">
                        <li><strong>Personal & Identity Details:</strong> Full Name, Gender, and Marital Status.</li>
                        <li><strong>Birth Chart Details:</strong> Exact Date of Birth, Time of Birth (including AM/PM and accuracy level), and Place of Birth (City, State, Country) required strictly for calculating Janma Kundli (birth charts), planetary degrees, and Ashtakoot Gun Milan.</li>
                        <li><strong>Contact Information:</strong> Phone number (for consultation scheduling and WhatsApp Kundli delivery) and Email Address.</li>
                        <li><strong>Transaction & Order Details:</strong> Information necessary to process orders for spiritual artifacts (gemstones, yantras, poojas) and consultation appointments.</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-white mt-4">B. Information Collected Automatically (Log Files)</h3>
                    <p className="text-white/80 leading-relaxed">
                        Like most standard websites, Astro Pravin utilizes standard log files. These files log visitors when they access the website. Information collected includes Internet Protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and number of clicks. This information is not linked to any personally identifiable information and is used exclusively for analyzing trends, administering the site, tracking user movement, and improving user experience.
                    </p>
                </section>

                {/* 3. Google AdSense & Third-Party Advertising Policies */}
                <section className="space-y-4 bg-white/[0.03] border border-amber-500/30 p-6 rounded-2xl">
                    <h2 className="text-2xl font-serif text-amber-400 flex items-center gap-2">
                        <Globe size={20} /> 3. Google AdSense & Cookie Disclosures
                    </h2>
                    <p className="text-white/90 leading-relaxed font-medium">
                        Please review the following mandatory disclosures regarding Google AdSense and third-party advertising on our website:
                    </p>
                    <ul className="list-disc pl-6 text-white/80 space-y-3">
                        <li>
                            <strong>Third-Party Vendors & Google:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.
                        </li>
                        <li>
                            <strong>Google Advertising Cookies (DoubleClick DART Cookie):</strong> Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to Astro Pravin and/or other sites on the Internet.
                        </li>
                        <li>
                            <strong>Opting Out of Personalized Advertising:</strong> Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline font-semibold">Google Ads Settings</a>. Alternatively, users can opt out of third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline font-semibold">www.aboutads.info</a> or the <a href="http://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline font-semibold">Network Advertising Initiative Opt-out Page</a>.
                        </li>
                        <li>
                            <strong>Third-Party Ad Networks:</strong> Other third-party ad servers or ad networks may use cookies, JavaScript, or Web Beacons in their respective advertisements and links appearing on Astro Pravin. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content you see on websites that you visit.
                        </li>
                        <li>
                            <strong>Cookie Management in Browsers:</strong> You can choose to disable cookies through your individual browser options. Detailed information about cookie management with specific web browsers can be found at the browsers' respective websites (Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge).
                        </li>
                    </ul>
                </section>

                {/* 4. Purpose of Data Processing */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-serif text-secondary flex items-center gap-2">
                        <Lock size={20} /> 4. How We Use Your Information
                    </h2>
                    <p className="text-white/80 leading-relaxed">
                        We process collected personal and birth information exclusively for legitimate purposes:
                    </p>
                    <ul className="list-disc pl-6 text-white/80 space-y-2">
                        <li>To compute accurate astronomical ephemeris and Vedic astrological charts (Lagna, Navamsha, Dasha, Gochar).</li>
                        <li>To prepare personalized consultation insights and Vastu recommendations.</li>
                        <li>To deliver PDF reports, horoscope predictions, and appointment confirmations via WhatsApp or Email.</li>
                        <li>To maintain site performance, security, and prevent fraudulent activity.</li>
                        <li>To fulfill statutory and legal requirements under applicable Indian laws.</li>
                    </ul>
                </section>

                {/* 5. Data Security & Retention */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-serif text-secondary flex items-center gap-2">
                        <Shield size={20} /> 5. Data Security & Storage
                    </h2>
                    <p className="text-white/80 leading-relaxed">
                        We implement rigorous administrative, technical, and physical safeguards designed to protect personal data against accidental loss, unauthorized access, alteration, and disclosure. All communication between your browser and our servers is secured using Industry-Standard 256-bit SSL/TLS encryption.
                    </p>
                    <p className="text-white/80 leading-relaxed">
                        Personal birth details submitted for one-time online calculators are processed in memory and not sold or traded. Consultation records are retained securely only as long as necessary to fulfill ongoing astrological follow-ups or as required by law.
                    </p>
                </section>

                {/* 6. User Rights & Legal Framework */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-serif text-secondary flex items-center gap-2">
                        <Bell size={20} /> 6. Your Rights & Compliance
                    </h2>
                    <p className="text-white/80 leading-relaxed">
                        Astro Pravin complies with the <strong>Information Technology Act, 2000</strong>, the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong>, and the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> (India), as well as recognizing GDPR and CCPA principles for international visitors:
                    </p>
                    <ul className="list-disc pl-6 text-white/80 space-y-2">
                        <li><strong>Right to Access:</strong> You may request a copy of the personal information we hold about you.</li>
                        <li><strong>Right to Rectification:</strong> You may request correction of inaccurate or incomplete birth details.</li>
                        <li><strong>Right to Erasure:</strong> You may request deletion of your consultation records from our active databases.</li>
                        <li><strong>Right to Withdraw Consent:</strong> You may withdraw consent for communication or marketing at any time.</li>
                    </ul>
                </section>

                {/* 7. Children's Information */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-serif text-secondary">7. Children's Information Protection</h2>
                    <p className="text-white/80 leading-relaxed">
                        Protecting children's privacy online is paramount. Astro Pravin does not knowingly collect any Personal Identifiable Information from children under the age of 13 without verified parental consent. If a parent or guardian believes that their child has provided personal details on our website, please contact us immediately, and we will promptly remove such information from our records.
                    </p>
                </section>

                {/* 8. Contact & Grievance Officer */}
                <section className="space-y-4 border-t border-white/10 pt-8">
                    <h2 className="text-2xl font-serif text-secondary flex items-center gap-2">
                        <Mail size={20} /> 8. Contact & Grievance Redressal
                    </h2>
                    <p className="text-white/80 leading-relaxed">
                        If you have any questions, concerns, or requests regarding this Privacy Policy or data processing practices, you may contact our Grievance Redressal team:
                    </p>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-2 text-white/90">
                        <p><strong>Grievance Officer:</strong> Pandit Pravin Shriram</p>
                        <p><strong>Organization:</strong> Shriram Samupdeshan Kendra</p>
                        <p><strong>Office Address:</strong> Shop No. 2, 3, S.S Icon Shopping Complex, Gharkul Road, Solapur, Maharashtra - 413006, India</p>
                        <p><strong>Email:</strong> <a href="mailto:pravin.shriram@gmail.com" className="text-amber-400 hover:underline">pravin.shriram@gmail.com</a></p>
                        <p><strong>Phone / WhatsApp:</strong> <a href="tel:+919921697908" className="text-amber-400 hover:underline">+91 99216 97908</a></p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
