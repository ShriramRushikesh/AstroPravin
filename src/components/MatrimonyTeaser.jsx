import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HeartHandshake, ShieldCheck, Sparkles, CheckCircle2, Lock, Users, ArrowRight, Award } from 'lucide-react';
import { MandalaWatermark, LotusCrest } from './VedicDecorativeArt';

const MatrimonyTeaser = () => {
    const highlights = [
        {
            icon: <Sparkles className="w-5 h-5 text-[#C2410C]" />,
            title: "36 Guna Ashtakoot Match",
            desc: "Automated & Pandit-verified horoscope compatibility, Mangal Dosha & Nadi analysis."
        },
        {
            icon: <ShieldCheck className="w-5 h-5 text-[#C2410C]" />,
            title: "100% Verified Profiles",
            desc: "Manual review of birth details, gotra, education, and photo verification."
        },
        {
            icon: <Lock className="w-5 h-5 text-[#C2410C]" />,
            title: "Strict Privacy & Contact Shield",
            desc: "Contact numbers and private photos are protected and shared only with mutual consent."
        },
        {
            icon: <Award className="w-5 h-5 text-[#C2410C]" />,
            title: "Pandit Pravin Direct Guidance",
            desc: "Direct astrological counseling for families before finalizing marriage alliances."
        }
    ];

    return (
        <section className="relative py-24 bg-gradient-to-b from-[#FFF7ED]/50 via-[#FAF8F5] to-[#F5F0E8]/50 border-t border-[#EADCC8] overflow-hidden">
            {/* Background Decorative Mandala */}
            <div className="absolute left-[-150px] top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                <MandalaWatermark className="w-[600px] h-[600px]" spin={false} />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header Banner */}
                <div className="bg-white rounded-3xl p-8 sm:p-12 md:p-16 border-2 border-[#FED7AA] shadow-luxury-hover relative overflow-hidden">
                    {/* Top Pill */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF7ED] border border-[#FED7AA] shadow-sm">
                            <LotusCrest className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
                                AstroPravin • Matrimony
                            </span>
                        </div>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] text-xs font-bold">
                            <Sparkles size={13} />
                            <span>Kundli-Backed Matchmaking</span>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-10 items-center">
                        {/* Text Details */}
                        <div className="lg:col-span-7 space-y-6">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#1C1917] leading-tight">
                                Find Your Soulmate with <span className="bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#D97706] bg-clip-text text-transparent">Authentic Kundli Gun Milan</span>
                            </h2>

                            <p className="text-sm sm:text-base text-[#44403C] leading-relaxed">
                                Welcome to AstroPravin's dedicated <strong>Matrimony</strong> service. Combining traditional horoscope matching (Ashtakoot Milan, Navamsha D9, Mangal Dosha) with a modern, dignified platform for brides, grooms, and respectable families.
                            </p>

                            {/* Transparent Access Fee Notice */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF9] border border-[#FED7AA] space-y-2">
                                <div className="flex items-center gap-2 text-xs font-bold text-[#C2410C] uppercase tracking-wider">
                                    <ShieldCheck size={16} />
                                    <span>Transparent Access & Verified Security</span>
                                </div>
                                <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed">
                                    Candidate registration is open to all. Full access, verified contact viewing, and match interactions are unlocked through a <strong>one-time registration fee</strong> to guarantee a spam-free, 100% genuine alliance ecosystem.
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <Link
                                    to="/matrimony"
                                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#D97706] shadow-luxury hover:shadow-luxury-hover hover:scale-105 active:scale-95 transition-all"
                                >
                                    <HeartHandshake size={18} />
                                    <span>Explore Matrimony</span>
                                    <ArrowRight size={16} />
                                </Link>

                                <Link
                                    to="/matrimony?tab=register"
                                    className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl text-sm font-bold text-[#C2410C] bg-[#FFF7ED] border border-[#FED7AA] hover:bg-[#FFEDD5] transition-all"
                                >
                                    <span>Register Your Profile</span>
                                </Link>
                            </div>
                        </div>

                        {/* Feature Badges Card */}
                        <div className="lg:col-span-5 grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
                            {highlights.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EADCC8] hover:border-[#FED7AA] hover:bg-white transition-all shadow-sm flex items-start gap-4"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center shrink-0 mt-0.5">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-serif font-bold text-[#1C1917] mb-1">
                                            {item.title}
                                        </h4>
                                        <p className="text-xs text-[#78716C] leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default React.memo(MatrimonyTeaser);
