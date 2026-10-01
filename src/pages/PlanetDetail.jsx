import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Star, Shield, AlertTriangle, Sparkles, BookOpen,
    HelpCircle, ChevronDown, Award, Compass, HeartHandshake, CheckCircle2
} from 'lucide-react';
import { planets } from '../data/planetData';
import SEO from '../components/SEO';
import AdSenseUnit from '../components/AdSenseUnit';
import { MandalaWatermark, LotusCrest } from '../components/VedicDecorativeArt';

const PlanetDetail = () => {
    const { id } = useParams();
    const [openFaq, setOpenFaq] = useState(null);
    const planet = planets.find(p => p.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!planet) {
        return (
            <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col items-center justify-center font-sans px-4 text-center">
                <h1 className="text-3xl font-serif font-bold mb-4">Planet Profile Not Found</h1>
                <p className="text-[#78716C] mb-6 max-w-md">The celestial body you are exploring is not found in our directory.</p>
                <Link to="/planets" className="px-6 py-3 bg-[#FFF7ED] border border-[#FED7AA] text-[#C2410C] rounded-xl font-bold text-sm hover:bg-[#FFEDD5]">
                    ← Return to Planets Directory
                </Link>
            </div>
        );
    }

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const seoData = {
        title: `${planet.name} (${planet.englishName}) in Vedic Astrology | Meaning, Dignities & Remedies`,
        description: `Comprehensive Vedic guide on ${planet.name} (${planet.englishName}). Learn its spiritual significance, ${planet.mantra}, dignities (${planet.exaltation}), positive & afflicted traits, and authentic remedies.`,
        keywords: `${planet.name}, ${planet.englishName}, ${planet.name} in vedic astrology, ${planet.gemstone}, ${planet.name} mantra, ${planet.name} upay, ${planet.name} effects in kundli, best astrologer Solapur`,
    };

    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] pt-28 pb-20 relative overflow-hidden font-sans">
            <SEO {...seoData} />

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#78716C] mb-8">
                    <Link to="/" className="hover:text-[#C2410C] transition-colors">Home</Link>
                    <span>/</span>
                    <Link to="/planets" className="hover:text-[#C2410C] transition-colors">Navagrahas</Link>
                    <span>/</span>
                    <span className="text-[#C2410C] font-semibold">{planet.name}</span>
                </div>

                {/* Hero Card */}
                <div className="bg-white rounded-3xl p-8 md:p-12 border border-[#EADCC8] shadow-luxury mb-12 relative overflow-hidden">
                    <div className="grid lg:grid-cols-12 gap-10 items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="lg:col-span-5 flex flex-col items-center text-center space-y-4"
                        >
                            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-[#FFF7ED] via-[#FEF3C7] to-[#FAF8F5] border-4 border-[#FED7AA] shadow-luxury p-2 flex items-center justify-center">
                                {planet.img ? (
                                    <img
                                        src={planet.img}
                                        alt={planet.englishName}
                                        className="w-full h-full object-cover rounded-full filter drop-shadow-md"
                                    />
                                ) : (
                                    <div className="text-4xl font-serif text-[#C2410C] font-bold">
                                        {planet.name[0]}
                                    </div>
                                )}
                            </div>

                            {/* Beej Mantra Plaque */}
                            <div className="bg-[#FFFDF9] border border-[#EADCC8] p-4 rounded-2xl w-full">
                                <span className="text-[#C2410C] uppercase tracking-widest text-[10px] font-bold block mb-1">
                                    Vedic Beej Mantra
                                </span>
                                <p className="font-serif italic text-sm sm:text-base text-[#B45309]">
                                    "{planet.beejMantra || planet.mantra}"
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="lg:col-span-7 space-y-4"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF7ED] border border-[#FED7AA] rounded-full text-xs text-[#C2410C] font-bold uppercase tracking-wider">
                                <Sparkles size={13} /> {planet.sanskritTitle || 'Navagraha Lord'}
                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#1C1917]">
                                {planet.name} <span className="text-[#78716C] text-2xl font-light">({planet.englishName})</span>
                            </h1>

                            <p className="text-sm sm:text-base text-[#44403C] leading-relaxed">
                                {planet.description}
                            </p>

                            {/* Quick Stats Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                                <div className="p-3 bg-[#FAF8F5] border border-[#EADCC8] rounded-xl">
                                    <span className="text-[10px] uppercase text-[#78716C] font-bold block">Element / Tattva</span>
                                    <strong className="text-xs sm:text-sm text-[#1C1917]">{planet.element || 'Fire'}</strong>
                                </div>
                                <div className="p-3 bg-[#FAF8F5] border border-[#EADCC8] rounded-xl">
                                    <span className="text-[10px] uppercase text-[#78716C] font-bold block">Gemstone (Ratna)</span>
                                    <strong className="text-xs sm:text-sm text-[#C2410C]">{planet.gemstone || 'Natural'}</strong>
                                </div>
                                <div className="p-3 bg-[#FAF8F5] border border-[#EADCC8] rounded-xl">
                                    <span className="text-[10px] uppercase text-[#78716C] font-bold block">Ruling Day</span>
                                    <strong className="text-xs sm:text-sm text-[#1C1917]">{planet.day || 'Auspicious'}</strong>
                                </div>
                                <div className="p-3 bg-[#FAF8F5] border border-[#EADCC8] rounded-xl">
                                    <span className="text-[10px] uppercase text-[#78716C] font-bold block">Exaltation (Uchcha)</span>
                                    <strong className="text-xs sm:text-sm text-[#B45309]">{planet.exaltation || 'Direct'}</strong>
                                </div>
                                <div className="p-3 bg-[#FAF8F5] border border-[#EADCC8] rounded-xl">
                                    <span className="text-[10px] uppercase text-[#78716C] font-bold block">Debilitation (Neecha)</span>
                                    <strong className="text-xs sm:text-sm text-[#78716C]">{planet.debilitation || 'Opposite'}</strong>
                                </div>
                                <div className="p-3 bg-[#FAF8F5] border border-[#EADCC8] rounded-xl">
                                    <span className="text-[10px] uppercase text-[#78716C] font-bold block">Ruling Rashi</span>
                                    <strong className="text-xs sm:text-sm text-[#1C1917]">{planet.rashi || 'Zodiac Sign'}</strong>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Positive vs Afflicted Traits */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white rounded-3xl p-7 border border-[#EADCC8] shadow-luxury space-y-4">
                        <h3 className="text-lg font-serif font-bold text-[#1C1917] flex items-center gap-2">
                            <Shield className="text-[#C2410C]" size={18} />
                            Positive Astrological Influence
                        </h3>
                        <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed">
                            {planet.positiveEffects || 'Bestows mental courage, vitality, leadership, honor, and prosperity when well-placed in auspicious houses (1st, 5th, 9th, 10th).'}
                        </p>
                        {planet.do && (
                            <ul className="space-y-1.5 pt-2 text-xs text-[#44403C]">
                                {planet.do.map((item, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <CheckCircle2 size={13} className="text-[#C2410C]" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="bg-white rounded-3xl p-7 border border-[#EADCC8] shadow-luxury space-y-4">
                        <h3 className="text-lg font-serif font-bold text-[#1C1917] flex items-center gap-2">
                            <AlertTriangle className="text-[#D97706]" size={18} />
                            Afflicted or Weakened Symptoms
                        </h3>
                        <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed">
                            {planet.negativeEffects || 'Can cause physical lethargy, relationship friction, delays in career advancement, or financial fluctuations when placed in 6th, 8th, or 12th houses.'}
                        </p>
                        {planet.dont && (
                            <ul className="space-y-1.5 pt-2 text-xs text-[#78716C]">
                                {planet.dont.map((item, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <span className="text-[#C2410C] font-bold">✕</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Remedies & Upay */}
                <div className="bg-[#FFFDF9] rounded-3xl p-8 border border-[#FED7AA] shadow-luxury mb-12 space-y-4">
                    <h3 className="text-xl font-serif font-bold text-[#1C1917] flex items-center gap-2">
                        <LotusCrest className="w-5 h-5" />
                        Authentic Vedic Remedies (Upay)
                    </h3>
                    <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed">
                        {planet.remedies || 'Chant the prescribed Beej Mantra during morning Hora, wear certified natural energized gemstones, donate respective grains on the ruling day, and perform dedicated Navagraha Shanti pooja.'}
                    </p>
                </div>

                {/* FAQ Accordion */}
                {planet.faqs && planet.faqs.length > 0 && (
                    <div className="bg-white rounded-3xl p-8 border border-[#EADCC8] shadow-luxury space-y-4">
                        <h3 className="text-xl font-serif font-bold text-[#1C1917] mb-6">
                            Frequently Asked Questions about {planet.name}
                        </h3>
                        <div className="space-y-3">
                            {planet.faqs.map((faq, idx) => (
                                <div key={idx} className="border border-[#EADCC8] rounded-2xl overflow-hidden">
                                    <button
                                        onClick={() => toggleFaq(idx)}
                                        className="w-full p-4 text-left font-serif font-bold text-sm text-[#1C1917] flex items-center justify-between hover:bg-[#FAF8F5] transition-colors"
                                    >
                                        <span>{faq.question}</span>
                                        <ChevronDown size={16} className={`transform transition-transform ${openFaq === idx ? 'rotate-180 text-[#C2410C]' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === idx && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="px-4 pb-4 text-xs sm:text-sm text-[#78716C] leading-relaxed border-t border-[#EADCC8] pt-3"
                                            >
                                                {faq.answer}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(PlanetDetail);
