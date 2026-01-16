import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { planets } from '../data/planetData';

const PlanetCard = ({ planet, index }) => {
    return (
        <section className="min-h-screen w-full flex items-center justify-center overflow-hidden snap-center relative py-12 md:py-0">
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-0" />
            <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-left order-2 md:order-1 pt-4 md:pt-0"
                >
                    <div className="flex items-center gap-4 mb-2 md:mb-4 relative">
                        <span className="text-5xl md:text-8xl font-serif text-white/10 font-bold absolute -top-8 md:-top-20 -left-2 md:-left-10 select-none pointer-events-none">
                            {index + 1}
                        </span>
                        <h2 className="text-3xl md:text-6xl lg:text-8xl font-serif font-bold text-white relative z-10 tracking-widest uppercase break-words leading-tight">
                            {planet.englishName}
                        </h2>
                    </div>
                    <div className="inline-block bg-white/10 backdrop-blur-md px-3 py-1 md:px-4 md:py-1 rounded-full text-gold text-xs md:text-sm font-bold tracking-widest mb-4 md:mb-6 border border-white/20 uppercase">
                        {planet.role || 'Cosmic Force'}
                    </div>
                    <p className="text-white/80 text-sm md:text-lg leading-relaxed mb-6 md:mb-8 max-w-xl font-light line-clamp-4 md:line-clamp-none">
                        {planet.description}
                    </p>

                    <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8">
                        {planet.do && planet.do.slice(0, 2).map((item, i) => (
                            <span key={i} className="px-3 py-1 md:px-4 md:py-2 rounded-full border border-white/10 bg-white/5 text-white/70 text-[10px] md:text-xs uppercase tracking-wider hover:bg-white/10 transition-colors">
                                {item}
                            </span>
                        ))}
                    </div>

                    <Link
                        to={`/planet/${planet.id}`}
                        className="inline-flex items-center gap-2 px-6 py-2 md:px-8 md:py-3 bg-white text-black font-bold uppercase tracking-widest text-xs md:text-sm rounded hover:bg-gold transition-colors"
                    >
                        Explore <ArrowRight size={16} />
                    </Link>
                </motion.div>

                {/* Planet Visual (3D Render or Fallback) */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, rotate: -20 }}
                    whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
                    className="relative flex justify-center perspective-1000 order-1 md:order-2 h-[300px] md:h-auto items-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                        className="relative z-10 w-[200px] h-[200px] md:w-[500px] md:h-[500px]"
                    >
                        {planet.img ? (
                            <img
                                src={planet.img}
                                alt={planet.englishName}
                                className="w-full h-full object-contain mix-blend-screen filter drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]"
                            />
                        ) : (
                            <div
                                className="w-full h-full rounded-full shadow-[0_0_100px_rgba(255,255,255,0.2)] animate-pulse-slow backdrop-blur-3xl"
                                style={{
                                    background: `radial-gradient(circle at 30% 30%, ${planet.color.includes('from') ? '#fff' : planet.color}, #000)`,
                                    boxShadow: `0 0 80px ${planet.color.includes('orange') ? 'orange' : 'white'}40`
                                }}
                            >
                                <div className={`w-full h-full rounded-full bg-gradient-to-br ${planet.color} opacity-80 mix-blend-overlay`} />
                            </div>
                        )}
                    </motion.div>

                    {/* Atmospheric Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/5 blur-[100px] rounded-full pointer-events-none" />
                </motion.div>
            </div>
        </section>
    );
};

const PlanetsSection = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const colors = ["#0c0c0c", "#1a1a2e", "#2b0f0f", "#0f2b1a", "#2b220f", "#2b0f1a", "#0f162b", "#1a1a1a", "#1a0f0f"]; // Dark variants corresponding to planets

    const bgColor = useTransform(
        scrollYProgress,
        [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1],
        ["#000000", ...colors]
    );

    const smoothBgColor = useSpring(bgColor, { stiffness: 50, damping: 20 });

    return (
        <motion.div
            ref={containerRef}
            className="relative"
            style={{ backgroundColor: smoothBgColor }}
        >
            {/* Header intro */}
            <section className="h-screen flex flex-col items-center justify-center text-center px-4 snap-center relative">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="relative z-10"
                >
                    <h2 className="text-5xl md:text-9xl font-serif text-white mb-6 tracking-tighter">The Navagrahas</h2>
                    <p className="text-white/60 text-xl md:text-2xl max-w-3xl mx-auto mb-12 font-light">
                        Journey through the nine cosmic influencers that shape your destiny.
                    </p>
                    <div className="animate-bounce text-white/50 flex justify-center">
                        <ChevronDown size={48} />
                    </div>
                </motion.div>
            </section>

            <div className="pb-20">
                {planets.map((planet, index) => (
                    <PlanetCard key={planet.id} planet={planet} index={index} />
                ))}
            </div>

        </motion.div>
    );
};

export default PlanetsSection;
