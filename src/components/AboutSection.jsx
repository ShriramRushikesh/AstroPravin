import React from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle2, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';
import { MandalaWatermark, LotusCrest } from './VedicDecorativeArt';

const AboutSection = () => {
    const qualities = [
        "25+ Years of Vedic Jyotish Mastery",
        "Expert in 36 Guna Kundli Matchmaking",
        "Vastu Shastra (Residential & Commercial)",
        "Certified Vedic Gemstones & Remedial Poojas",
        "Strict Adherence to Authentic Panchang",
        "Confidential One-on-One Consultations"
    ];

    return (
        <section className="relative py-24 bg-[#FAF8F5] overflow-hidden border-t border-[#EADCC8]">
            {/* Background Mandala Watermark */}
            <div className="absolute right-[-150px] top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                <MandalaWatermark className="w-[600px] h-[600px]" spin={false} />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

                    {/* Image Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="lg:col-span-5 relative"
                    >
                        <div className="relative mx-auto max-w-sm rounded-3xl bg-white border border-[#EADCC8] p-4 shadow-luxury overflow-hidden">
                            <div className="rounded-2xl overflow-hidden bg-gradient-to-b from-[#FFF7ED] to-[#FAF8F5] border border-[#FED7AA] aspect-[4/5] flex items-center justify-center p-2">
                                <img
                                    src="/pravin-shriram.png"
                                    alt="Pandit Pravin Shriram - Vedic Astrologer Solapur"
                                    loading="lazy"
                                    className="w-full h-full object-contain filter drop-shadow-md"
                                />
                            </div>

                            {/* 25+ Years Experience Badge */}
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, type: 'spring' }}
                                className="absolute -bottom-2 -right-2 bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#D97706] p-4 rounded-2xl text-white shadow-luxury flex flex-col items-center"
                            >
                                <span className="text-2xl font-bold font-serif leading-none">25+</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Years Mastery</span>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Content Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="lg:col-span-7 space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF7ED] border border-[#FED7AA]">
                            <LotusCrest className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
                                About Pandit Pravin Shriram
                            </span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1917] leading-tight">
                            Bridging Ancient Vedic Wisdom with <span className="bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#D97706] bg-clip-text text-transparent">Modern Practical Life</span>
                        </h2>

                        <p className="text-sm sm:text-base text-[#44403C] leading-relaxed">
                            Welcome to <strong>Shriram Samupdeshan Kendra</strong>, Solapur's foremost center for Vedic Astrology, Kundli Analysis, and Vastu Shastra. Led by <strong>Pandit Pravin Shriram</strong> with over 25 years of devoted study and practical consultations, we offer authentic astrological guidance to help individuals, families, and businesses make empowered life decisions.
                        </p>

                        <p className="text-sm sm:text-base text-[#78716C] leading-relaxed">
                            Whether you seek clarity regarding marriage compatibility (Gun Milan), career shifts, financial stability, or Vastu energy alignment, our consultations are grounded strictly in authentic classical Sanskrit texts and proven remedial measures.
                        </p>

                        {/* Qualities Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            {qualities.map((q, idx) => (
                                <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#EADCC8] shadow-sm">
                                    <CheckCircle2 size={16} className="text-[#C2410C] shrink-0" />
                                    <span className="text-xs sm:text-sm font-semibold text-[#1C1917]">{q}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default React.memo(AboutSection);
