import React from 'react';
import SEO from '../components/SEO';

const TermsConditions = () => {
    return (
        <div className="min-h-screen bg-void text-white pt-32 pb-16 px-6">
            <SEO
                title="Terms & Conditions | Astro Pravin"
                description="Terms and Conditions for Astro Pravin services. Astrology is a belief system."
            />
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-4xl font-serif text-gold">Terms & Conditions</h1>
                <p className="text-white/60 text-sm">Last Updated: {new Date().toLocaleDateString()}</p>

                <section className="space-y-4">
                    <h2 className="text-2xl font-serif text-white">1. Acceptance of Terms</h2>
                    <p className="text-white/80 leading-relaxed">
                        By accessing and using the services of Astro Pravin (website and consultations), you agree to comply with and be bound by these Terms and Conditions. These terms are governed by the laws of India, including the <strong>Information Technology Act, 2000</strong>.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-serif text-white">2. Astrology Disclaimer</h2>
                    <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-lg">
                        <p className="text-white/90 leading-relaxed font-semibold">
                            Astrology is an ancient system of belief and interpretation. While we strive for accuracy in our calculations and predictions based on Vedic principles, we do not guarantee the accuracy, reality, or reliability of any prediction.
                        </p>
                        <p className="text-white/80 mt-2 text-sm">
                            Our services should not be used as a substitute for professional advice in legal, medical, financial, or psychological matters. You are solely responsible for your life choices and decisions.
                        </p>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-serif text-white">3. Services & Payments</h2>
                    <p className="text-white/80 leading-relaxed">
                        All services (Consultations, Kundli Generation) and products (Gemstones, Yantras) are subject to availability. Prices are subject to change without notice. Payment must be made in full before the delivery of services or products.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-serif text-white">4. Refund Policy</h2>
                    <p className="text-white/80 leading-relaxed">
                        Due to the personalized nature of our services:
                    </p>
                    <ul className="list-disc pl-6 text-white/80 space-y-2">
                        <li><strong>Consultations:</strong> No refunds will be provided once the consultation slot is booked and confirmed, unless cancelled by us.</li>
                        <li><strong>Digital Products (PDFs):</strong> No refunds once the file has been generated/sent.</li>
                        <li><strong>Physical Goods:</strong> Returns accepted only for damaged goods within 24 hours of delivery, subject to verification.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-serif text-white">5. Limitation of Liability</h2>
                    <p className="text-white/80 leading-relaxed">
                        Astro Pravin shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-serif text-white">6. Dispute Resolution</h2>
                    <p className="text-white/80 leading-relaxed">
                        Any disputes arising out of these terms shall be subject to the exclusive jurisdiction of the courts in Maharashtra, India.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default TermsConditions;
