import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Heart, Briefcase, Gem, Sparkles } from 'lucide-react';

const Section = ({ title, subtitle, icon: Icon, color, children, parallaxY }) => {
    return (
        <motion.div
            style={{ y: parallaxY }}
            className="relative min-h-screen flex items-center justify-center p-6 border-t border-white/5"
        >
            <div className={`absolute inset-0 bg-gradient-to-b ${color} opacity-30 pointer-events-none`} />

            <div className="relative z-10 max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <div className="text-left space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 glass rounded-full text-gold">
                                <Icon size={24} />
                            </div>
                            <h3 className="text-saffron font-serif text-xl tracking-widest uppercase">{subtitle}</h3>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight">
                            {title}
                        </h2>
                        <p className="text-white/60 text-lg leading-relaxed">
                            Discover the ancient secrets written in the stars.
                            Our AI-powered Vedic engine analyzes your unique cosmic signature
                            to reveal hidden opportunities.
                        </p>
                    </motion.div>
                </div>

                {/* Visual/Interactive Element */}
                <div className="relative h-[400px] md:h-[500px] flex items-center justify-center">
                    {children}
                </div>
            </div>
        </motion.div>
    );
};

const KundliGrid = () => (
    <div className="relative w-full h-full flex items-center justify-center">
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
            className="w-[300px] h-[300px] border-2 border-saffron/30 rounded-full absolute"
        />
        <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
            className="w-[200px] h-[200px] border border-gold/20 rotate-45 absolute" // Simplified square/diamond
        />
        {/* Simplified Kundli Houses visualization */}
        <svg viewBox="0 0 100 100" className="w-[350px] h-[350px] absolute text-saffron/20 stroke-current stroke-[0.5] fill-none">
            <rect x="25" y="25" width="50" height="50" />
            <path d="M25 25 L75 75 M75 25 L25 75" />
            <path d="M50 0 L100 50 L50 100 L0 50 Z" />
        </svg>
    </div>
);

const LoveOrbit = () => (
    <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="relative z-10"
        >
            <Heart size={120} className="text-pink-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]" strokeWidth={1} />
        </motion.div>
        {/* Orbiting planets */}
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute w-[200px] h-[200px]"
        >
            <div className="w-4 h-4 bg-pink-200 rounded-full absolute -top-2 left-1/2 shadow-[0_0_10px_white]" />
        </motion.div>
    </div>
);

const CareerGraph = () => (
    <div className="relative w-full h-full flex items-end justify-center gap-4 pb-10">
        {[40, 60, 30, 80, 50, 90].map((h, i) => (
            <motion.div
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.1 }}
                className="w-8 md:w-12 bg-gradient-to-t from-emerald-900/50 to-emerald-400/50 border-t border-emerald-300 backdrop-blur-sm rounded-t-lg relative group"
            >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-300 font-bold">
                    {h}%
                </div>
            </motion.div>
        ))}
    </div>
);

const ScrollSections = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);

    return (
        <div ref={containerRef} className="relative z-20 bg-void/50 backdrop-blur-[2px]">
            {/* Section 1: Birth & Kundli */}
            <Section
                title="The Cosmic Blueprint"
                subtitle="Birth Chart Analysis"
                icon={Sparkles}
                color="from-transparent via-blue-900/10 to-transparent"
                parallaxY={y1}
            >
                <KundliGrid />
            </Section>

            {/* Section 2: Love */}
            <Section
                title="Venus & Compatibility"
                subtitle="Love & Relationships"
                icon={Heart}
                color="bg-venus-glow"
                parallaxY={y2}
            >
                <LoveOrbit />
            </Section>

            {/* Section 3: Career */}
            <Section
                title="Saturn's Return"
                subtitle="Career & Wealth"
                icon={Briefcase}
                color="bg-saturn-gold"
                parallaxY={y1} // Reuse parallax speed or create new
            >
                <CareerGraph />
            </Section>

            {/* Section 4: Remedies Call to Action */}
            <Section
                title="Sacred Remedies"
                subtitle="Gemstones & Yantras"
                icon={Gem}
                color="bg-mystic-deep"
                parallaxY={y3}
            >
                <div className="grid grid-cols-2 gap-4 w-full">
                    {[1, 2, 3, 4].map((i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10, scale: 1.05 }}
                            className="aspect-square glass-card flex items-center justify-center group cursor-pointer"
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/5 rounded-full shadow-inner flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-shadow">
                                <span className="text-2xl">💎</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Section>
        </div>
    );
};

export default ScrollSections;
