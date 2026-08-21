import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, ShieldCheck, CheckCircle2, MapPin, Phone, Calendar, Heart, BookOpen, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import BookingModal from '../components/BookingModal';
import { MandalaWatermark, LotusCrest } from '../components/VedicDecorativeArt';

const AboutUs = () => {
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    const pillars = [
        {
            icon: <Award className="text-[#C2410C]" size={24} />,
            title: "25+ Years Experience",
            desc: "Over two decades of dedicated study, classical chart interpretation, and counseling helping individuals navigate life transitions."
        },
        {
            icon: <ShieldCheck className="text-[#C2410C]" size={24} />,
            title: "Strict Date Panchang",
            desc: "All calculations and remedial rituals adhere strictly to authentic astronomical panchang and auspicious planetary horas."
        },
        {
            icon: <Heart className="text-[#C2410C]" size={24} />,
            title: "Empathetic Counseling",
            desc: "We practice fear-free, constructive astrology focusing on positive psychological empowerment and practical life remedies."
        },
        {
            icon: <Sparkles className="text-[#C2410C]" size={24} />,
            title: "Authentic Remedies",
            desc: "Recommendations focus on pure gemstones, Vedic mantras, positive lifestyle alignment, and sacred Pooja rituals."
        }
    ];

    const milestones = [
        { year: "1999", title: "Foundation of Practice", desc: "Commenced Vedic astrology research and personal counseling rooted in Solapur." },
        { year: "2008", title: "Shriram Samupdeshan Kendra", desc: "Established the permanent counseling center in Solapur for horoscope & Vastu consultancy." },
        { year: "2018", title: "Global Consultations", desc: "Expanded consultations to NRI clients across the US, UK, Gulf, and Europe via digital platforms." },
        { year: "2024+", title: "Digital AstroPravin", desc: "Launched modern digital Vedic calculators, educational insights, and Matrimony compatibility systems." }
    ];

    const seoData = {
        title: "About Pandit Pravin Shriram | Best Astrologer in Solapur (25+ Yrs Exp)",
        description: "Learn about Pandit Pravin Shriram, founder of Shriram Samupdeshan Kendra. Over 25 years of mastery in Vedic Astrology, Kundli Matching, Vastu Shastra, and Gemology.",
        keywords: "Pandit Pravin Shriram, best astrologer in Solapur, Shriram Samupdeshan Kendra, Vedic astrologer Maharashtra, authentic kundli reading, vastu consultant Solapur",
    };

    return (
        <div className="min-h-screen bg-[#FAF8F5] pt-28 pb-24 px-4 sm:px-6 relative overflow-hidden font-sans text-[#1C1917]">
            <SEO {...seoData} />

            {/* Background Decorative */}
            <div className="absolute top-20 right-[-150px] opacity-[0.03] pointer-events-none">
                <MandalaWatermark className="w-[600px] h-[600px]" spin={false} />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Hero Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF7ED] border border-[#FED7AA]">
                        <LotusCrest className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
                            Vedic Scholarship & Legacy
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#1C1917]">
                        About Pandit <span className="bg-gradient-to-r from-[#C2410C] to-[#D97706] bg-clip-text text-transparent">Pravin Shriram</span>
                    </h1>

                    <p className="text-sm sm:text-base text-[#78716C] leading-relaxed">
                        Founder of <strong>Shriram Samupdeshan Kendra</strong>, Solapur. Devoting over a quarter-century to authentic Parashari Jyotish, Kundli Milan, and Vastu Shastra consultancy.
                    </p>
                </div>

                {/* Profile Grid */}
                <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EADCC8] shadow-luxury mb-16">
                    <div className="grid lg:grid-cols-12 gap-10 items-center">
                        <div className="lg:col-span-5">
                            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-b from-[#FFF7ED] to-[#FAF8F5] border border-[#FED7AA] p-2 flex items-center justify-center">
                                <img
                                    src="/pravin-shriram.png"
                                    alt="Pandit Pravin Shriram"
                                    className="w-full h-full object-contain filter drop-shadow-md"
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-7 space-y-4">
                            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917]">
                                Devoted to Pure Vedic Wisdom & Ethical Life Guidance
                            </h2>

                            <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed">
                                Pandit Pravin Shriram was initiated into the study of ancient Sanskrit Jyotish scriptures at an early age. Over the past 25+ years, he has analyzed tens of thousands of horoscopes, advising individuals on critical life milestones—marriage timing and matchmaking (Gun Milan), career shifts, financial decisions, and health remedies.
                            </p>

                            <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed">
                                Unlike sensationalist astrology, his practice at <strong>Shriram Samupdeshan Kendra</strong> is rooted in ethical clarity, psychological positivity, and practical Vedic remedies (Upay) designed to mitigate karmic obstacles.
                            </p>

                            <div className="pt-2">
                                <button
                                    onClick={() => setIsBookingOpen(true)}
                                    className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#C2410C] to-[#EA580C] shadow-sm hover:scale-105 transition-transform"
                                >
                                    Book Personal Consultation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Core Pillars */}
                <div className="mb-16">
                    <h3 className="text-2xl font-serif font-bold text-[#1C1917] text-center mb-8">
                        Our Guiding Principles
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {pillars.map((p, i) => (
                            <div key={i} className="bg-white rounded-3xl p-6 border border-[#EADCC8] shadow-luxury space-y-3">
                                <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center">
                                    {p.icon}
                                </div>
                                <h4 className="text-base font-serif font-bold text-[#1C1917]">{p.title}</h4>
                                <p className="text-xs text-[#78716C] leading-relaxed">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Journey Milestones */}
                <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EADCC8] shadow-luxury space-y-8">
                    <h3 className="text-2xl font-serif font-bold text-[#1C1917] text-center">
                        Our 25+ Years Journey
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {milestones.map((m, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#EADCC8] space-y-2">
                                <span className="text-lg font-serif font-bold text-[#C2410C]">{m.year}</span>
                                <h4 className="text-sm font-bold text-[#1C1917]">{m.title}</h4>
                                <p className="text-xs text-[#78716C] leading-relaxed">{m.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
        </div>
    );
};

export default React.memo(AboutUs);
