import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import StarField from './StarField';
import ZodiacWheel from './ZodiacWheel';

const HeroSection = ({ onBookClick }) => {
    const { scrollY } = useScroll();
    const yBackend = useTransform(scrollY, [0, 500], [0, 200]);
    const yMid = useTransform(scrollY, [0, 500], [0, 100]);
    const opacityHero = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <div className="relative w-full min-h-screen overflow-hidden bg-void flex items-center justify-center">
            {/* Layer 1: Three.js Starfield Background */}
            <div className="absolute inset-0 z-0">
                <StarField />
            </div>

            {/* Layer 2: Parallax Zodiac Wheel */}
            <motion.div
                style={{ y: yBackend }}
                className="absolute inset-0 z-10 flex items-center justify-center"
            >
                <ZodiacWheel />
            </motion.div>

            {/* Glowing Sun Effect behind text */}
            <motion.div
                style={{ y: yMid, scale: useTransform(scrollY, [0, 500], [1, 1.5]) }}
                className="absolute z-20 w-64 h-64 bg-saffron/20 blur-[100px] rounded-full"
            />

            {/* Layer 3: Foreground Content */}
            <motion.div
                style={{ opacity: opacityHero }}
                className="relative z-30 text-center px-4 max-w-4xl mx-auto"
            >
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <h2 className="text-saffron tracking-[0.099em] text-sm md:text-base mb-4 uppercase font-sans">
                        Shriram Samupdeshan Kendra
                    </h2>
                    <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif text-white mb-6 drop-shadow-2xl">
                        Best Astrologer <span className="text-gradient-gold">in Solapur</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/70 mb-10 font-light tracking-wide">
                        Love • Career • Wealth • Karma
                    </p>

                    <motion.button
                        onClick={onBookClick}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-gold/30 rounded-full text-gold font-semibold tracking-wider hover:bg-gold hover:text-cosmic-blue transition-all duration-300 shadow-[0_0_30px_rgba(255,215,0,0.2)]"
                    >
                        BOOK CONSULTATION
                    </motion.button>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10 z-30 flex flex-col items-center gap-2"
            >
                <span className="text-xs text-white/30 tracking-widest uppercase">ABOUT US</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-gold/50 to-transparent" />
            </motion.div>
        </div>
    );
};

export default HeroSection;
