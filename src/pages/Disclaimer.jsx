import React from 'react';
import SEO from '../components/SEO';
import { AlertTriangle, Compass, HeartPulse, Briefcase, ExternalLink, ShieldAlert } from 'lucide-react';

const Disclaimer = () => {
    return (
        <div className="min-h-screen bg-void text-white pt-32 pb-20 px-6 font-sans">
            <SEO
                title="Astrology & Website Disclaimer | Astro Pravin"
                description="Comprehensive Disclaimer for Astro Pravin. Understand the scope of Vedic astrology, personal responsibility, third-party advertising disclosures, and professional advice boundaries."
                keywords="Astro Pravin disclaimer, astrology prediction disclaimer, free will and karma, google adsense advertising disclaimer"
            />
            <div className="max-w-4xl mx-auto space-y-10">
                {/* Header */}
                <div className="border-b border-white/10 pb-8">
                    <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold tracking-widest uppercase mb-2">
                        <AlertTriangle size={18} />
                        <span>Important Information</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight">Disclaimer</h1>
                    <p className="text-white/60 text-sm mt-3">
                        Last Updated: August 2026
                    </p>
                </div>

                {/* 1. General Astrology & Spiritual Guidance Disclaimer */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-serif text-secondary flex items-center gap-2">
                        <Compass size={20} /> 1. Nature of Vedic Astrological Science
                    </h2>
                    <p className="text-white/80 leading-relaxed">
                        The content, calculations, automated charts, readings, and astrological insights provided on <strong>Astro Pravin</strong> (<a href="https://astropravin.com" className="text-amber-400 underline">https://astropravin.com</a>) and during personal consultations with <strong>Pandit Pravin Shriram</strong> are based on traditional Vedic Astrology (Jyotish Shastra), Numerology, and Vastu Shastra principles.
                    </p>
                    <p className="text-white/80 leading-relaxed">
                        Astrology is an interpretive, probabilistic spiritual discipline. While we strive to maintain the highest standard of mathematical accuracy using precise planetary ephemeris and over 25 years of scholarly practice, astrological readings are interpretive in nature. Planetary transits and birth chart indications represent predispositions and cosmic rhythms, not predetermined or unchangeable outcomes.
                    </p>
                </section>

                {/* 2. Free Will and Personal Responsibility */}
                <section className="space-y-4 bg-white/[0.02] border border-white/10 p-6 rounded-2xl">
                    <h2 className="text-2xl font-serif text-amber-400 flex items-center gap-2">
                        <ShieldAlert size={20} /> 2. Karma, Free Will & Personal Responsibility
                    </h2>
                    <p className="text-white/90 leading-relaxed font-medium">
                        Vedic philosophy firmly upholds the doctrine of <em>Purushartha</em> (conscious human effort and free will) working alongside <em>Prarabdha Karma</em> (destiny). 
                    </p>
                    <p className="text-white/80 leading-relaxed mt-2">
                        You, as an autonomous individual, retain complete responsibility for your decisions, choices, actions, and consequences in life. Astrological guidance should be utilized as a reflective tool for self-understanding and timing, never as a mechanism to abdicate personal responsibility or common sense.
                    </p>
                </section>

                {/* 3. Non-Medical, Non-Legal, Non-Financial Disclaimer */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-serif text-secondary">3. Professional Boundaries Disclaimers</h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white/5 border border-white/10 p-5 rounded-xl space-y-2">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <HeartPulse className="text-red-400" size={18} /> Medical & Health Disclaimer
                            </h3>
                            <p className="text-white/70 text-sm leading-relaxed">
                                Astrological discussions regarding planetary influences on physical constitution or psychological moods do NOT constitute medical diagnosis, treatment, or psychiatric counseling. Always consult certified medical practitioners for any health concerns.
                            </p>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-5 rounded-xl space-y-2">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Briefcase className="text-amber-400" size={18} /> Financial & Legal Disclaimer
                            </h3>
                            <p className="text-white/70 text-sm leading-relaxed">
                                Astrological suggestions regarding career timings, business partnerships, or auspicious dates must not be considered formal financial, investment, or legal advice. Consult certified financial advisors, accountants, and legal professionals for commercial decisions.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 4. Advertising & Google AdSense Disclaimer */}
                <section className="space-y-4 bg-white/[0.02] border border-amber-500/20 p-6 rounded-2xl">
                    <h2 className="text-2xl font-serif text-amber-400 flex items-center gap-2">
                        <ExternalLink size={20} /> 4. Third-Party Advertising & Google AdSense
                    </h2>
                    <p className="text-white/80 leading-relaxed">
                        Astro Pravin displays advertisements served by third-party advertising networks, primarily <strong>Google AdSense</strong>. The presence of any commercial advertisement, sponsor banner, or external merchant link on this website does NOT constitute an endorsement, recommendation, guarantee, or warranty by Astro Pravin of any product, service, or claim made by the advertiser.
                    </p>
                    <p className="text-white/80 leading-relaxed">
                        We encourage users to exercise due diligence before engaging with any external commercial offers or third-party web destinations.
                    </p>
                </section>

                {/* 5. Contact */}
                <section className="space-y-4 border-t border-white/10 pt-8">
                    <h2 className="text-2xl font-serif text-secondary">5. Questions & Feedback</h2>
                    <p className="text-white/80 leading-relaxed">
                        If you have questions regarding this Disclaimer or our consultation philosophy, please reach out to us at <a href="mailto:pravin.shriram@gmail.com" className="text-amber-400 underline">pravin.shriram@gmail.com</a>.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Disclaimer;
