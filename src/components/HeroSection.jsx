import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Award, ShieldCheck, HeartHandshake, PhoneCall, ArrowRight, Calendar, Star, Heart } from 'lucide-react';
import { MandalaWatermark, SunburstCrest, LotusCrest } from './VedicDecorativeArt';

const HeroSection = ({ onBookClick }) => {
    return (
        <section className="relative w-full min-h-[90vh] lg:min-h-[92vh] pt-28 pb-16 px-4 md:px-8 flex items-center justify-center overflow-hidden bg-[#FAF8F5]">
            {/* Background 2D Sacred Mandala Watermarks */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
                <MandalaWatermark className="w-[500px] md:w-[750px] h-[500px] md:h-[750px] opacity-[0.035]" spin={true} />
            </div>
            
            {/* Ambient Radial Lighting */}
            <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-[#FFF7ED] to-[#FEF3C7]/40 rounded-full blur-3xl opacity-60 pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-[#FFF7ED] to-[#FED7AA]/40 rounded-full blur-3xl opacity-60 pointer-events-none" />

            <div className="max-w-6xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left Column: Vedic Astrologer Headlines & CTAs */}
                <div className="lg:col-span-7 text-center lg:text-left space-y-6">
                    
                    {/* Top Badges Row */}
                    <motion.div
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5"
                    >
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF7ED] border border-[#FED7AA] shadow-sm">
                            <SunburstCrest className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
                                Online Jyotish & Vastu • Solapur
                            </span>
                        </div>

                        {/* Highlighted Matrimony Feature Pill */}
                        <Link
                            to="/matrimony"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] hover:bg-[#FDE68A] transition-all text-xs font-bold shadow-sm group"
                        >
                            <Heart className="w-3.5 h-3.5 text-[#C2410C] fill-[#C2410C] group-hover:scale-110 transition-transform" />
                            <span>Matrimony Live</span>
                            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </motion.div>

                    {/* Main Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1C1917] tracking-tight leading-[1.15]"
                    >
                        Accurate Life Predictions & <span className="bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#D97706] bg-clip-text text-transparent">Online Jyotish</span> Guidance
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-base sm:text-lg text-[#44403C] leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal"
                    >
                        Consult <strong className="text-[#C2410C] font-semibold">Jyotish Pravin Shriram (Panditji)</strong> with 25+ years of mastery in Kundli Gun Milan, Career & Marriage Predictions, Vastu Shastra, and Certified Gemstones.
                    </motion.p>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
                    >
                        <button
                            onClick={onBookClick}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-base font-bold text-white bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#D97706] shadow-luxury hover:shadow-luxury-hover hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            <Calendar className="w-5 h-5 text-white" />
                            Book Consultation
                            <ArrowRight className="w-4 h-4 text-white/80" />
                        </button>

                        <Link
                            to="/matrimony"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-bold text-[#C2410C] bg-[#FFF7ED] border border-[#FED7AA] hover:bg-[#FFEDD5] hover:border-[#FDBA74] shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            <HeartHandshake className="w-5 h-5 text-[#C2410C]" />
                            <span>Matrimony</span>
                        </Link>
                    </motion.div>

                    {/* Trust Badges Bar */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="pt-6 border-t border-[#EADCC8] grid grid-cols-3 gap-4 text-center lg:text-left"
                    >
                        <div>
                            <div className="text-2xl font-bold font-serif text-[#C2410C]">25+</div>
                            <div className="text-xs text-[#78716C] font-medium">Years Mastery</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold font-serif text-[#D97706]">50,000+</div>
                            <div className="text-xs text-[#78716C] font-medium">Kundlis Read</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold font-serif text-[#C2410C]">4.9 ★</div>
                            <div className="text-xs text-[#78716C] font-medium">Verified Rating</div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Pandit Acharya Pravin Portrait Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="lg:col-span-5 flex justify-center"
                >
                    <div className="relative w-full max-w-sm">
                        {/* Golden Glowing Ring */}
                        <div className="absolute -inset-1.5 bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#D97706] rounded-3xl blur-md opacity-25" />
                        
                        {/* Main Card */}
                        <div className="relative bg-white border border-[#EADCC8] rounded-3xl p-6 shadow-luxury overflow-hidden">
                            {/* Inner Top Mandala Accent */}
                            <div className="absolute -top-12 -right-12 opacity-10 pointer-events-none">
                                <MandalaWatermark className="w-48 h-48" spin={false} />
                            </div>

                            {/* Image Container with Gold Border */}
                            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#FFF7ED] to-[#FAF8F5] border border-[#FED7AA] aspect-[4/5] flex items-center justify-center p-2">
                                <img
                                    src="/pravin-shriram.png"
                                    alt="Jyotish Pravin Shriram - Online Jyotish"
                                    className="w-full h-full object-contain filter drop-shadow-md"
                                    loading="eager"
                                />
                            </div>

                            {/* Credentials Header below Image */}
                            <div className="mt-5 text-center space-y-1">
                                <h3 className="text-xl font-serif font-bold text-[#1C1917]">
                                    Jyotish Pravin Shriram
                                </h3>
                                <p className="text-xs font-semibold text-[#C2410C] uppercase tracking-wider">
                                    Online Jyotish • Shriram Samupdeshan Kendra
                                </p>
                                <p className="text-xs text-[#78716C] pt-1">
                                    Vedic Jyotishi • Vastu Shastra • 36 Guna Kundli Matchmaker
                                </p>
                            </div>

                            {/* Quick Trust Highlights */}
                            <div className="mt-4 pt-4 border-t border-[#EADCC8] flex items-center justify-between text-[11px] text-[#44403C] font-medium">
                                <span className="flex items-center gap-1">
                                    <ShieldCheck className="w-3.5 h-3.5 text-[#C2410C]" /> Solapur & Online
                                </span>
                                <span className="flex items-center gap-1">
                                    <Award className="w-3.5 h-3.5 text-[#D97706]" /> 100% Authentic
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default React.memo(HeroSection);
