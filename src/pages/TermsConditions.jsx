import React from 'react';
import SEO from '../components/SEO';
import { Scale, BookOpen, AlertCircle, RefreshCw, Shield, HelpCircle } from 'lucide-react';

const TermsConditions = () => {
    return (
        <div className="min-h-screen bg-void text-white pt-32 pb-20 px-6 font-sans">
            <SEO
                title="Terms & Conditions | Astro Pravin - Shriram Samupdeshan Kendra"
                description="Terms and Conditions of Use for Astro Pravin services, astrological consultations, Kundli calculations, and spiritual store items."
                keywords="Astro Pravin terms and conditions, astrology consultation terms, user agreement, refund policy"
            />
            <div className="max-w-4xl mx-auto space-y-10">
                {/* Header */}
                <div className="border-b border-white/10 pb-8">
                    <div className="flex items-center gap-2 text-secondary text-sm font-semibold tracking-widest uppercase mb-2">
                        <Scale size={18} />
                        <span>Legal Agreement</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight">Terms & Conditions</h1>
                    <p className="text-white/60 text-sm mt-3">
                        Effective Date: August 19, 2024 • Last Updated: August 2026
                    </p>
                </div>

                {/* 1. Acceptance */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-serif text-secondary flex items-center gap-2">
                        <BookOpen size={20} /> 1. Acceptance of Terms
                    </h2>
                    <p className="text-white/80 leading-relaxed">
                        By visiting, accessing, browsing, or using the website <strong>Astro Pravin</strong> (<a href="https://astropravin.com" className="text-amber-400 underline">https://astropravin.com</a>) or booking consultations offered by <strong>Shriram Samupdeshan Kendra</strong>, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions and our Privacy Policy.
                    </p>
                    <p className="text-white/80 leading-relaxed">
                        If you do not agree with any part of these terms, please do not use our website or services. These terms apply to all visitors, registered users, consultation clients, and store customers.
                    </p>
                </section>

                {/* 2. Astrological Services & Counseling Scope */}
                <section className="space-y-4 bg-white/[0.02] border border-amber-500/20 p-6 rounded-2xl">
                    <h2 className="text-2xl font-serif text-amber-400 flex items-center gap-2">
                        <AlertCircle size={20} /> 2. Astrological Guidance Scope & Disclaimer
                    </h2>
                    <p className="text-white/90 leading-relaxed">
                        Vedic Astrology (Jyotish Shastra), Numerology, and Vastu Shastra are ancient traditional sciences based on symbolic interpretation, mathematical astronomy, and philosophical belief systems.
                    </p>
                    <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 rounded-r-xl my-4 text-white/90 text-sm leading-relaxed space-y-2">
                        <p>
                            <strong>Educational and Advisory Purpose:</strong> All astrological readings, predictions, horoscope analyses, and gemstone recommendations provided on this website or during 1-on-1 consultations are intended solely for personal guidance, self-reflection, and cultural/educational purposes.
                        </p>
                        <p>
                            <strong>Non-Substitution for Professional Services:</strong> Astrological consultations do not constitute, and should never replace, professional medical diagnosis, legal advice, licensed financial planning, or clinical psychiatric therapy. Clients are strictly advised to consult licensed professionals for critical health, financial, or legal matters.
                        </p>
                    </div>
                </section>

                {/* 3. User Obligations & Conduct */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-serif text-secondary flex items-center gap-2">
                        <Shield size={20} /> 3. User Obligations & Accurate Data
                    </h2>
                    <p className="text-white/80 leading-relaxed">
                        To ensure accurate astronomical and chart calculations, you agree to provide authentic and accurate birth details (Date of Birth, Time of Birth, and Place of Birth). You agree not to:
                    </p>
                    <ul className="list-disc pl-6 text-white/80 space-y-2">
                        <li>Impersonate any person or entity or misrepresent your affiliation with any person.</li>
                        <li>Attempt to reverse-engineer, scrape, copy, or systematically extract website code, articles, or intellectual property without explicit written authorization.</li>
                        <li>Use automated scripts, bots, or spiders that cause denial of service or unreasonable load on our infrastructure.</li>
                    </ul>
                </section>

                {/* 4. Appointments, Payments & Cancellations */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-serif text-secondary flex items-center gap-2">
                        <RefreshCw size={20} /> 4. Appointments, Payments & Refunds
                    </h2>
                    <p className="text-white/80 leading-relaxed">
                        Our consultation fees and spiritual product prices are listed in Indian Rupees (INR) and are subject to change without prior notice.
                    </p>
                    <ul className="list-disc pl-6 text-white/80 space-y-2">
                        <li><strong>Consultation Bookings:</strong> Confirmed consultation slots require advance payment. You may reschedule an appointment by notifying us via WhatsApp or Phone at least 24 hours in advance.</li>
                        <li><strong>Digital Reports (PDF Kundli):</strong> Digital horoscope files generated are custom-tailored to individual birth details and are non-refundable once calculated and delivered.</li>
                        <li><strong>Physical Spiritual Artifacts:</strong> Natural gemstones and yantras undergo personalized Vedic energization (Abhimantrit/Prana Pratishtha) for the specific individual. Returns are eligible only in the rare event of verified transit damage reported within 48 hours of delivery.</li>
                    </ul>
                </section>

                {/* 5. Intellectual Property Rights */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-serif text-secondary flex items-center gap-2">
                        <BookOpen size={20} /> 5. Intellectual Property Rights
                    </h2>
                    <p className="text-white/80 leading-relaxed">
                        All content on this website, including but not limited to Vedic guides, articles, logos, graphics, user interface layouts, software scripts, and multimedia materials, is the exclusive intellectual property of <strong>Pandit Pravin Shriram / Shriram Samupdeshan Kendra</strong> and is protected under the Copyright Act, 1957 (India) and international copyright treaties.
                    </p>
                </section>

                {/* 6. Limitation of Liability */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-serif text-secondary">6. Limitation of Liability</h2>
                    <p className="text-white/80 leading-relaxed">
                        To the maximum extent permitted by applicable law, Astro Pravin, its founder, astrologers, and associates shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from the use of or inability to use this website, services, or reliance on any astrological forecast.
                    </p>
                </section>

                {/* 7. Governing Law & Jurisdiction */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-serif text-secondary">7. Governing Law & Jurisdiction</h2>
                    <p className="text-white/80 leading-relaxed">
                        These Terms and Conditions shall be governed by and construed in accordance with the substantive laws of India, including the <strong>Information Technology Act, 2000</strong>. Any dispute, claim, or controversy arising out of or relating to these terms shall be subject to the exclusive jurisdiction of the competent courts in <strong>Solapur, Maharashtra, India</strong>.
                    </p>
                </section>

                {/* 8. Contact Information */}
                <section className="space-y-4 border-t border-white/10 pt-8">
                    <h2 className="text-2xl font-serif text-secondary flex items-center gap-2">
                        <HelpCircle size={20} /> 8. Inquiries & Support
                    </h2>
                    <p className="text-white/80 leading-relaxed">
                        For any questions regarding these Terms & Conditions, please contact us:
                    </p>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-2 text-white/90">
                        <p><strong>Shriram Samupdeshan Kendra</strong> (Astro Pravin)</p>
                        <p><strong>Address:</strong> Shop No. 2, 3, S.S Icon Shopping Complex, Gharkul Road, Solapur, Maharashtra - 413006, India</p>
                        <p><strong>Email:</strong> <a href="mailto:pravin.shriram@gmail.com" className="text-amber-400 hover:underline">pravin.shriram@gmail.com</a></p>
                        <p><strong>Phone:</strong> <a href="tel:+919921697908" className="text-amber-400 hover:underline">+91 99216 97908</a></p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default TermsConditions;
