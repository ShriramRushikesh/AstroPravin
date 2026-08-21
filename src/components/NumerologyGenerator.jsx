import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Calendar, RefreshCcw, BookOpen, ShieldCheck, CheckCircle2 } from 'lucide-react';
import SEO from './SEO';
import AdSenseUnit from './AdSenseUnit';
import { MandalaWatermark, LotusCrest } from './VedicDecorativeArt';

const numerologyData = {
    1: {
        planet: "Sun (Surya)",
        description: "Ruled by the Sun, you are a natural-born leader with immense self-confidence. Number 1 represents independence, innovation, and the drive to succeed. You are ambitious, authoritative, and destined for high positions.",
        luckyColor: "Orange, Gold, Ruby Red",
        luckyDay: "Sunday",
        traits: ["Leadership", "Ambition", "Independence"],
        career: "Politics, CEO, Entrepreneurship, Govt. Services"
    },
    2: {
        planet: "Moon (Chandra)",
        description: "Governed by the Moon, you are the peacemaker of numerology. Number 2 signifies intuition, emotion, and balance. You are diplomatic, sensitive, and excel in partnerships, always seeking harmony in life.",
        luckyColor: "White, Silver, Pearl",
        luckyDay: "Monday",
        traits: ["Intuition", "Diplomacy", "Sensitivity"],
        career: "Arts, Psychology, Healing, Creative Fields"
    },
    3: {
        planet: "Jupiter (Guru)",
        description: "Influenced by Jupiter, you are the wisdom seeker and communicator. Number 3 embodies creativity, optimism, and joy. You are socially magnetic, inspiring others with your knowledge and positive energy.",
        luckyColor: "Yellow, Saffron, Purple",
        luckyDay: "Thursday",
        traits: ["Wisdom", "Creativity", "Optimism"],
        career: "Teaching, Advisory, Writing, Entertainment"
    },
    4: {
        planet: "Rahu",
        description: "Ruled by Rahu, you are the powerhouse of discipline and stability. Number 4 represents structure, order, and practicality. You are a hard worker who builds solid foundations and challenges the norms.",
        luckyColor: "Electric Blue, Grey, Khaki",
        luckyDay: "Sunday",
        traits: ["Discipline", "Practicality", "Determination"],
        career: "IT, Engineering, Architecture, Research"
    },
    5: {
        planet: "Mercury (Budh)",
        description: "Governed by Mercury, you are the free spirit and adventurer. Number 5 indicates versatility, high intelligence, and excellent communication. You thrive on change, freedom, and exploring new horizons.",
        luckyColor: "Green, Emerald, Turquoise",
        luckyDay: "Wednesday",
        traits: ["Adaptability", "Intelligence", "Freedom"],
        career: "Journalism, Marketing, Travel, Business"
    },
    6: {
        planet: "Venus (Shukra)",
        description: "Ruled by Venus, you are the nurturer and lover of beauty. Number 6 creates harmony, luxury, and compassion. You are family-oriented, responsible, and have a creating magnetism that attracts abundance.",
        luckyColor: "White, Pink, Light Blue",
        luckyDay: "Friday",
        traits: ["Compassion", "Luxury", "Responsibility"],
        career: "Fashion, Media, Luxury Goods, Counseling"
    },
    7: {
        planet: "Ketu",
        description: "Influenced by Ketu, you are the mystic investigator. Number 7 represents spirituality, deep analysis, and intuition. You are a truth-seeker who looks beyond the surface to understand the mysteries of life.",
        luckyColor: "Cat's Eye, Grey, Multi-colored",
        luckyDay: "Monday",
        traits: ["Spirituality", "Analysis", "Intuition"],
        career: "Research, Occult Sciences, Philosophy, Investigation"
    },
    8: {
        planet: "Saturn (Shani)",
        description: "Ruled by Saturn, you are the powerhouse of karma and manifestation. Number 8 represents material success, endurance, and justice. You achieve greatness through perseverance and overcoming life tests.",
        luckyColor: "Dark Blue, Black, Purple",
        luckyDay: "Saturday",
        traits: ["Perseverance", "Justice", "Manifestation"],
        career: "Law, Real Estate, Heavy Industry, Banking"
    },
    9: {
        planet: "Mars (Mangal)",
        description: "Governed by Mars, you are the passionate warrior. Number 9 symbolizes courage, universal brotherhood, and humanitarian service. You possess immense physical energy and a protective instinct.",
        luckyColor: "Deep Red, Coral, Maroon",
        luckyDay: "Tuesday",
        traits: ["Courage", "Generosity", "Dynamism"],
        career: "Defense, Surgery, Sports, Social Work"
    }
};

const NumerologyGenerator = () => {
    const [birthDate, setBirthDate] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const calculateNumerology = (e) => {
        e.preventDefault();
        if (!birthDate) return;

        setLoading(true);
        setTimeout(() => {
            const dateParts = birthDate.split('-');
            const year = dateParts[0];
            const month = dateParts[1];
            const day = dateParts[2];

            // Calculate Mulank (Day of birth)
            const sumDigits = (numStr) => {
                let sum = numStr.split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
                while (sum > 9) {
                    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
                }
                return sum;
            };

            const mulank = sumDigits(day);
            const bhagyank = sumDigits(year + month + day);

            setResult({
                mulank,
                bhagyank,
                mulankData: numerologyData[mulank],
                bhagyankData: numerologyData[bhagyank]
            });
            setLoading(false);
        }, 300);
    };

    const resetCalc = () => {
        setBirthDate('');
        setResult(null);
    };

    return (
        <div className="min-h-screen bg-[#FAF8F5] pt-28 pb-24 px-4 sm:px-6 relative overflow-hidden font-sans">
            <SEO
                title="Vedic Numerology Calculator (Mulank & Bhagyank) | AstroPravin"
                description="Calculate your Vedic Root Number (Mulank) and Destiny Number (Bhagyank) for free. Discover your ruling planet, lucky colors, compatible careers, and character traits."
                keywords="vedic numerology calculator, mulank calculator, bhagyank calculator, birth date numerology, lucky color by date of birth, astro pravin"
            />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF7ED] border border-[#FED7AA]">
                        <LotusCrest className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
                            Sankhya Shastra
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#1C1917]">
                        Vedic Numerology <span className="bg-gradient-to-r from-[#C2410C] to-[#D97706] bg-clip-text text-transparent">Calculator</span>
                    </h1>

                    <p className="text-sm text-[#78716C]">
                        Enter your date of birth to calculate your <strong>Mulank (Root Number)</strong> and <strong>Bhagyank (Destiny Number)</strong> based on authentic Vedic principles.
                    </p>
                </div>

                {/* Input Card */}
                <div className="bg-white rounded-3xl p-8 border border-[#EADCC8] shadow-luxury mb-12 max-w-lg mx-auto">
                    <form onSubmit={calculateNumerology} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-[#44403C] uppercase tracking-wider mb-2">
                                Select Your Date of Birth
                            </label>
                            <div className="relative">
                                <Calendar size={16} className="absolute left-3.5 top-3 text-[#78716C]" />
                                <input
                                    type="date"
                                    required
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EADCC8] text-[#1C1917] focus:outline-none focus:border-[#C2410C]"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={loading || !birthDate}
                                className="flex-1 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#C2410C] to-[#EA580C] shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Sparkles size={14} />
                                {loading ? 'Calculating Numbers...' : 'Calculate Vedic Numbers'}
                            </button>

                            {result && (
                                <button
                                    type="button"
                                    onClick={resetCalc}
                                    className="px-4 py-3 rounded-xl bg-[#F5F0E8] text-[#78716C] hover:text-[#1C1917] hover:bg-[#EADCC8] transition-colors"
                                    title="Reset"
                                >
                                    <RefreshCcw size={16} />
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Results Section */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="space-y-8"
                        >
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Mulank Card */}
                                <div className="bg-white rounded-3xl p-8 border border-[#FED7AA] shadow-luxury space-y-4 relative overflow-hidden">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
                                            Root Number (Mulank)
                                        </span>
                                        <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-2xl font-serif font-bold text-[#C2410C]">
                                            {result.mulank}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-serif font-bold text-[#1C1917]">
                                            Governed by {result.mulankData.planet}
                                        </h3>
                                        <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                                            {result.mulankData.description}
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t border-[#EADCC8] space-y-1.5 text-xs text-[#44403C]">
                                        <p><strong>Lucky Colors:</strong> {result.mulankData.luckyColor}</p>
                                        <p><strong>Auspicious Day:</strong> {result.mulankData.luckyDay}</p>
                                        <p><strong>Ideal Careers:</strong> {result.mulankData.career}</p>
                                    </div>
                                </div>

                                {/* Bhagyank Card */}
                                <div className="bg-white rounded-3xl p-8 border border-[#FDE68A] shadow-luxury space-y-4 relative overflow-hidden">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
                                            Destiny Number (Bhagyank)
                                        </span>
                                        <div className="w-12 h-12 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-2xl font-serif font-bold text-[#B45309]">
                                            {result.bhagyank}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-serif font-bold text-[#1C1917]">
                                            Destiny Guide: {result.bhagyankData.planet}
                                        </h3>
                                        <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                                            {result.bhagyankData.description}
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t border-[#EADCC8] space-y-1.5 text-xs text-[#44403C]">
                                        <p><strong>Key Strengths:</strong> {result.bhagyankData.traits.join(', ')}</p>
                                        <p><strong>Favorable Day:</strong> {result.bhagyankData.luckyDay}</p>
                                        <p><strong>Life Path Alignment:</strong> {result.bhagyankData.career}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default React.memo(NumerologyGenerator);
