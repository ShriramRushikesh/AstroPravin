import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Shield, AlertTriangle } from 'lucide-react';
import { planets } from '../data/planetData';
import SEO from '../components/SEO';

const PlanetDetail = () => {
    const { id } = useParams();
    const planet = planets.find(p => p.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!planet) return <div className="text-white flex items-center justify-center h-screen">Planet not found</div>;

    const seoData = {
        title: `${planet.name} (${planet.englishName}) in Vedic Astrology | Meaning & Remedies`,
        description: `Learn about ${planet.name} (${planet.englishName}) in Vedic Astrology. Discover its significance, mantra (${planet.mantra}), controls, and powerful remedies to strengthen it.`,
        keywords: `${planet.name}, ${planet.englishName}, ${planet.name} planet astrology, vedic astrology planets, ${planet.name} mantra, ${planet.name} remedies, ${planet.name} effects`
    };

    return (
        <>
            <SEO {...seoData} />
            <div className="min-h-screen bg-void text-white pt-24 pb-12 relative overflow-hidden">
                {/* Background Glow */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b ${planet.color} opacity-20 blur-[150px] rounded-full pointer-events-none`} />

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-secondary transition-colors mb-8">
                        <ArrowLeft size={20} /> Back to Cosmos
                    </Link>

                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        {/* Visual Side */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center"
                        >
                            <motion.div
                                animate={{ y: [0, -20, 0], rotate: 360 }}
                                transition={{
                                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                                    rotate: { duration: 100, repeat: Infinity, ease: "linear" }
                                }}
                                className={`w-[70vw] h-[70vw] max-w-[250px] max-h-[250px] md:w-96 md:h-96 md:max-w-none md:max-h-none rounded-full ${!planet.img ? `bg-gradient-to-br ${planet.color}` : ''} ${planet.glow} shadow-2xl mb-8 relative flex items-center justify-center`}
                            >
                                {planet.img ? (
                                    <img
                                        src={planet.img}
                                        alt={planet.englishName}
                                        className="w-full h-full object-cover rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                                    />
                                ) : (
                                    <div className="absolute inset-0 rounded-full mix-blend-multiply bg-black/20" />
                                )}
                            </motion.div>

                            <div className="glass p-6 rounded-xl text-center w-full max-w-md">
                                <h3 className="text-primary uppercase tracking-widest text-sm mb-2">Vedic Mantra</h3>
                                <p className="font-serif italic text-lg leading-relaxed text-secondary">"{planet.mantra}"</p>
                            </div>
                        </motion.div>

                        {/* Content Side */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8 text-center md:text-left"
                        >
                            <div>
                                <h1 className="text-3xl md:text-6xl font-serif font-bold text-white mb-2">{planet.name}</h1>
                                <h2 className="text-xl md:text-2xl text-white/50">{planet.englishName}</h2>
                            </div>

                            <p className="text-lg text-white/80 leading-relaxed md:border-l-2 md:border-secondary/50 md:pl-4">
                                {planet.description}
                            </p>

                            <div>
                                <h3 className="text-xl font-serif text-white mb-4 flex items-center gap-2 justify-center md:justify-start">
                                    <Star className="text-secondary" size={20} /> Controls
                                </h3>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    {planet.controls.map((c, i) => (
                                        <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-sm border border-white/5">{c}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="bg-emerald-900/20 border border-emerald-500/20 p-5 rounded-xl text-left">
                                    <h3 className="text-emerald-400 font-serif mb-3 flex items-center gap-2 justify-center md:justify-start">
                                        <Shield size={18} /> Do's (Positive)
                                    </h3>
                                    <ul className="list-disc list-inside text-sm text-emerald-100/70 space-y-1">
                                        {planet.do.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </div>
                                <div className="bg-red-900/20 border border-red-500/20 p-5 rounded-xl text-left">
                                    <h3 className="text-red-400 font-serif mb-3 flex items-center gap-2 justify-center md:justify-start">
                                        <AlertTriangle size={18} /> Don'ts (Negative)
                                    </h3>
                                    <ul className="list-disc list-inside text-sm text-red-100/70 space-y-1">
                                        {planet.dont.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-serif text-white mb-4">Remedies (Upay)</h3>
                                <div className="space-y-3">
                                    {planet.remedies.map((r, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 glass rounded-lg hover:bg-white/10 transition-colors">
                                            <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-xs text-secondary font-bold mt-0.5">
                                                {i + 1}
                                            </div>
                                            <p className="text-white/90 text-sm">{r}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PlanetDetail;
