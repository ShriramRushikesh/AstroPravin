import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Calendar, RefreshCcw } from 'lucide-react';
import SEO from './SEO';

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
        career: "Research, Occult, Philosophy, Tech"
    },
    8: {
        planet: "Saturn (Shani)",
        description: "Governed by Saturn, you are the karma yogi. Number 8 symbolizes power, material success, and justice. You are resilient, ambitious, and achieve great heights through persistence and hard work.",
        luckyColor: "Black, Dark Blue, Violet",
        luckyDay: "Saturday",
        traits: ["Authority", "Persistence", "Justice"],
        career: "Law, Real Estate, Finance, Administration"
    },
    9: {
        planet: "Mars (Mangal)",
        description: "Ruled by Mars, you are the warrior with a compassionate heart. Number 9 embodies courage, energy, and humanitarianism. You are dynamic, selfless, and driven to make a positive impact on the world.",
        luckyColor: "Red, Coral, Maroon",
        luckyDay: "Tuesday",
        traits: ["Courage", "Humanitarianism", "Energy"],
        career: "Defense, Sports, Social Work, Surgery"
    }
};

const NumerologyGenerator = () => {
    const [formData, setFormData] = useState({
        day: '',
        month: '',
        year: ''
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (value.length <= 4) { // Basic length check
            setFormData({ ...formData, [name]: value });
        }
    };

    const calculateSum = (num) => {
        let sum = num;
        while (sum > 9) {
            sum = sum.toString().split('').reduce((acc, curr) => acc + parseInt(curr), 0);
        }
        return sum;
    };

    const generateNumerology = (e) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            const { day, month, year } = formData;

            // Calculate Mulank (Birth Number) - Sum of day only
            const mulank = calculateSum(parseInt(day));

            // Calculate Bhagyank (Life Path Number) - Sum of day + month + year
            const fullDateSum = parseInt(day) + parseInt(month) + parseInt(year);
            const bhagyank = calculateSum(fullDateSum);

            setResult({
                mulank: {
                    number: mulank,
                    data: numerologyData[mulank]
                },
                bhagyank: {
                    number: bhagyank,
                    data: numerologyData[bhagyank]
                }
            });
            setLoading(false);
        }, 1500); // Fake delay for effect
    };

    const resetForm = () => {
        setResult(null);
        setFormData({ day: '', month: '', year: '' });
    };

    const inputClass = "w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white focus:border-gold outline-none md:text-lg text-center font-bold tracking-wider placeholder:font-normal placeholder:text-sm";

    return (
        <section className="min-h-screen py-20 bg-void relative overflow-hidden flex flex-col items-center justify-center">
            <SEO
                title="Free Numerology Calculator | Mulank & Bhagyank"
                description="Discover your Life Path Number (Bhagyank) and Birth Number (Mulank) with our free Vedic Numerology Calculator. Get insights into your personality and destiny."
                keywords="numerology calculator, mulank calculator, bhagyank calculator, free numerology, vedic numerology, life path number, destiny number"
            />

            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(255,215,0,0.05),_transparent_70%)]" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-4 relative z-10 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-saffron to-gold mb-4 py-1">
                        Vedic Numerology
                    </h2>
                    <p className="text-white/60 text-lg max-w-2xl mx-auto">
                        Reveal the hidden patterns of your life through the power of numbers. Calculate your Mulank (Birth Number) and Bhagyank (Destiny Number).
                    </p>
                </motion.div>

                {!result ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-10 rounded-3xl max-w-lg mx-auto shadow-2xl"
                    >
                        <form onSubmit={generateNumerology} className="space-y-6">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-white/70 mb-2 text-xs uppercase tracking-wider text-center">Day</label>
                                    <input
                                        type="number"
                                        name="day"
                                        placeholder="DD"
                                        value={formData.day}
                                        onChange={handleInputChange}
                                        className={inputClass}
                                        min="1" max="31"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/70 mb-2 text-xs uppercase tracking-wider text-center">Month</label>
                                    <input
                                        type="number"
                                        name="month"
                                        placeholder="MM"
                                        value={formData.month}
                                        onChange={handleInputChange}
                                        className={inputClass}
                                        min="1" max="12"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/70 mb-2 text-xs uppercase tracking-wider text-center">Year</label>
                                    <input
                                        type="number"
                                        name="year"
                                        placeholder="YYYY"
                                        value={formData.year}
                                        onChange={handleInputChange}
                                        className={inputClass}
                                        min="1900" max="2100"
                                        required
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-saffron to-gold text-black font-bold text-lg uppercase tracking-wide rounded-xl shadow-[0_0_20px_rgba(255,165,0,0.3)] flex justify-center items-center gap-2"
                            >
                                {loading ? <Sparkles className="animate-spin" /> : <Star className="fill-current" />}
                                {loading ? "Calculating..." : "Reveal Your Numbers"}
                            </motion.button>
                        </form>
                    </motion.div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Mulank Card */}
                        <ResultCard
                            title="Mulank (Birth Number)"
                            number={result.mulank.number}
                            data={result.mulank.data}
                            delay={0.1}
                            color="from-orange-400 to-red-500"
                        />

                        {/* Bhagyank Card */}
                        <ResultCard
                            title="Bhagyank (Destiny Number)"
                            number={result.bhagyank.number}
                            data={result.bhagyank.data}
                            delay={0.2}
                            color="from-blue-400 to-purple-500"
                        />

                        <div className="md:col-span-2 flex justify-center mt-8">
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                onClick={resetForm}
                                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center gap-2 transition-colors border border-white/20"
                            >
                                <RefreshCcw size={18} /> Calculate Another
                            </motion.button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

const ResultCard = ({ title, number, data, delay, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative group hover:border-white/30 transition-colors"
    >
        <div className={`h-2 w-full bg-gradient-to-r ${color}`} />
        <div className="p-8">
            <h3 className="text-white/60 text-sm uppercase tracking-widest text-center mb-2">{title}</h3>

            <div className="flex justify-center items-center mb-6 relative">
                <div className="w-24 h-24 rounded-full border-2 border-white/20 flex items-center justify-center text-5xl font-serif text-gold font-bold relative z-10 bg-black/50">
                    {number}
                </div>
                <div className={`absolute w-32 h-32 bg-gradient-to-r ${color} rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity`} />
            </div>

            <h4 className="text-center text-xl font-bold text-white mb-1">{data.planet}</h4>
            <p className="text-center text-white/50 text-sm mb-6">Ruling Planet</p>

            <div className="space-y-4 text-center">
                <p className="text-white/90 leading-relaxed italic">"{data.description}"</p>

                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
                    <div className="bg-black/20 p-3 rounded-lg">
                        <p className="text-xs text-white/50 uppercase mb-1">Lucky Color</p>
                        <p className="text-white font-medium">{data.luckyColor}</p>
                    </div>
                    <div className="bg-black/20 p-3 rounded-lg">
                        <p className="text-xs text-white/50 uppercase mb-1">Lucky Day</p>
                        <p className="text-white font-medium">{data.luckyDay}</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {data.traits.map((trait, i) => (
                        <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-xs text-gold border border-gold/20">
                            {trait}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    </motion.div>
);

export default NumerologyGenerator;
