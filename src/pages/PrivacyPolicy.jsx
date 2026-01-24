import React from 'react';
import SEO from '../components/SEO';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-void text-white pt-32 pb-16 px-6">
            <SEO
                title="Privacy Policy | Astro Pravin"
                description="Privacy Policy for Astro Pravin. Compliant with Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011."
            />
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-4xl font-serif text-secondary">Privacy Policy</h1>
                <p className="text-white/60 text-sm">Last Updated: {new Date().toLocaleDateString()}</p>

                <section className="space-y-4">
                    <h2 className="text-2xl font-serif text-white">1. Introduction</h2>
                    <p className="text-white/80 leading-relaxed">
                        Welcome to Astro Pravin ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data in compliance with the <strong>Information Technology Act, 2000</strong> and the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong> (SPDI Rules).
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-serif text-white">2. Information We Collect</h2>
                    <p className="text-white/80 leading-relaxed">
                        To provide accurate astrological consultations and generate Kundlis, we may collect the following personal information:
                    </p>
                    <ul className="list-disc pl-6 text-white/80 space-y-2">
                        <li><strong>Personal Identification:</strong> Name, Gender.</li>
                        <li><strong>Birth Details:</strong> Date of Birth, Time of Birth, Place of Birth.</li>
                        <li><strong>Contact Information:</strong> Phone Number (for WhatsApp delivery), Email Address.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-serif text-white">3. Purpose of Collection</h2>
                    <p className="text-white/80 leading-relaxed">
                        We collect this data solely for the purpose of:
                    </p>
                    <ul className="list-disc pl-6 text-white/80 space-y-2">
                        <li>Generating accurate Vedic Astrology charts (Janma Kundli).</li>
                        <li>Providing personalized consultation services.</li>
                        <li>Delivering reports via WhatsApp or Email as requested.</li>
                        <li>Processing orders for spiritual artifacts (Gemstones, Yantras, etc.).</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-serif text-white">4. Data Security</h2>
                    <p className="text-white/80 leading-relaxed">
                        We implement reasonable security practices and procedures to protect your Data from unauthorized access, loss, or misuse. However, please note that no method of transmission over the internet is 100% secure.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-serif text-white">5. Sharing of Information</h2>
                    <p className="text-white/80 leading-relaxed">
                        We do <strong>not</strong> sell, trade, or rent your personal identification information to others. We do not share your birth details with third acids except as required by law.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-serif text-white">6. Contact Us</h2>
                    <p className="text-white/80 leading-relaxed">
                        If you have any questions regarding this Privacy Policy, please contact us at: <br />
                        <span className="text-secondary">consult@astropravin.com</span>
                    </p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
