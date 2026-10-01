import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';
import { planets } from '../data/planetData';
import { MandalaWatermark, LotusCrest } from './VedicDecorativeArt';
import SEO from './SEO';

const PlanetsSection = () => {
    return (
        <div className="min-h-screen bg-[#FAF8F5] pt-28 pb-24 px-4 sm:px-6 relative overflow-hidden">
            <SEO
                title="Navagraha 9 Planets in Vedic Astrology | AstroPravin"
                description="Explore the spiritual power, dignities, mantras, and authentic Vedic remedies for all 9 Navagrahas (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu)."
                keywords="navagraha astrology, 9 planets in vedic astrology, surya, chandra, mangal, budh, guru, shukra, shani, rahu, ketu, vedic astrologer solapur"
            />

            {/* Background Mandala Watermark */}
            <div className="absolute top-1/4 right-[-100px] opacity-[0.03] pointer-events-none">
                <MandalaWatermark className="w-[500px] h-[500px]" spin={true} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF7ED] border border-[#FED7AA]">
                        <LotusCrest className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
                            Navagraha Shastra
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#1C1917]">
                        The 9 Celestial Forces in <span className="bg-gradient-to-r from-[#C2410C] to-[#D97706] bg-clip-text text-transparent">Vedic Astrology</span>
                    </h1>

                    <p className="text-sm sm:text-base text-[#78716C] leading-relaxed">
                        In classical Jyotish Shastra, each planet governs specific dimensions of karma, intellect, prosperity, relationships, and spiritual evolution. Explore each Navagraha's traits, mantras, and remedies.
                    </p>
                </div>

                {/* 9 Planets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {planets.map((planet, index) => (
                        <motion.div
                            key={planet.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-3xl p-7 border border-[#EADCC8] shadow-luxury hover:shadow-luxury-hover transition-all flex flex-col justify-between group"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold font-mono text-[#C2410C] px-2.5 py-0.5 rounded-full bg-[#FFF7ED] border border-[#FED7AA]">
                                        #{index + 1} Navagraha
                                    </span>
                                    <span className="text-xs text-[#78716C] font-semibold">
                                        {planet.role || 'Cosmic Archetype'}
                                    </span>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-serif font-bold text-[#1C1917] group-hover:text-[#C2410C] transition-colors">
                                        {planet.name} <span className="text-sm font-sans font-normal text-[#78716C]">({planet.englishName})</span>
                                    </h2>
                                    <p className="text-xs text-[#B45309] font-medium mt-0.5">
                                        Ruling Day: {planet.day || 'Auspicious Period'} • Gemstone: {planet.gemstone || 'Natural'}
                                    </p>
                                </div>

                                <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed line-clamp-3">
                                    {planet.description}
                                </p>

                                {planet.mantra && (
                                    <div className="p-3 rounded-xl bg-[#FFFDF9] border border-[#EADCC8] text-xs font-serif text-[#C2410C] italic">
                                        "{planet.mantra}"
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 border-t border-[#EADCC8]/80 mt-6 flex items-center justify-between">
                                <span className="text-xs font-semibold text-[#78716C]">
                                    Dignity: {planet.exaltation ? `${planet.exaltation} Exalt` : 'Vedic State'}
                                </span>

                                <Link
                                    to={`/planet/${planet.id}`}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#C2410C] to-[#EA580C] shadow-sm hover:scale-105 transition-transform"
                                >
                                    <span>Learn More</span>
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default React.memo(PlanetsSection);
