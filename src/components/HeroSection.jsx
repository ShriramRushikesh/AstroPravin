import React, { Suspense, lazy, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ZodiacWheel from './ZodiacWheel';
import ErrorBoundary from './ErrorBoundary';

// Lazy-load Three.js StarField
const StarField = lazy(() => import('./StarField'));

// Lightweight CSS-only star fallback while Three.js loads
const StarFallback = React.memo(() => {
    const stars = useMemo(() => {
        return Array.from({ length: 40 }).map((_, i) => ({
            id: i,
            width: `${(i % 3) + 1}px`,
            height: `${(i % 3) + 1}px`,
            top: `${(i * 17) % 100}%`,
            left: `${(i * 23) % 100}%`,
            opacity: 0.3 + (i % 5) * 0.1,
            animationDuration: `${2 + (i % 4)}s`,
            animationDelay: `${(i % 3) * 0.5}s`,
        }));
    }, []);

    return (
        <div className="absolute inset-0 bg-void overflow-hidden pointer-events-none">
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute rounded-full bg-hero-gold"
                    style={{
                        width: star.width,
                        height: star.height,
                        top: star.top,
                        left: star.left,
                        opacity: star.opacity,
                        animation: `pulse ${star.animationDuration} ease-in-out infinite`,
                        animationDelay: star.animationDelay,
                    }}
                />
            ))}
        </div>
    );
});

const HeroSection = ({ onBookClick }) => {
    const { scrollY } = useScroll();
    const yBackend = useTransform(scrollY, [0, 500], [0, 150]);
    const yMid = useTransform(scrollY, [0, 500], [0, 80]);
    const opacityHero = useTransform(scrollY, [0, 300], [1, 0]);
    const scaleSun = useTransform(scrollY, [0, 500], [1, 1.3]);

    return (
        <div className="relative w-full min-h-screen overflow-hidden bg-void flex items-center justify-center">
            {/* Layer 1: Three.js Starfield Background (lazy-loaded with fallback) */}
            <div className="absolute inset-0 z-0">
                <ErrorBoundary fallback={<StarFallback />}>
                    <Suspense fallback={<StarFallback />}>
                        <StarField />
                    </Suspense>
                </ErrorBoundary>
            </div>

            {/* Layer 2: Parallax Zodiac Wheel */}
            <motion.div
                style={{ y: yBackend }}
                className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
            >
                <ZodiacWheel />
            </motion.div>

            {/* Glowing Sun Effect behind text */}
            <motion.div
                style={{ y: yMid, scale: scaleSun }}
                className="absolute z-20 w-64 h-64 bg-hero-saffron/20 blur-[100px] rounded-full pointer-events-none"
            />

            {/* Layer 3: Foreground Content */}
            <motion.div
                style={{ opacity: opacityHero }}
                className="relative z-30 text-center px-4 max-w-4xl mx-auto"
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <h2 className="text-hero-saffron tracking-[0.099em] text-sm md:text-base mb-4 uppercase font-sans font-semibold">
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
                        className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-hero-gold/30 rounded-full text-hero-gold font-semibold tracking-wider hover:bg-hero-gold hover:text-cosmic-blue transition-all duration-300 shadow-[0_0_30px_rgba(255,215,0,0.2)]"
                    >
                        BOOK CONSULTATION
                    </motion.button>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10 z-30 flex flex-col items-center gap-2 pointer-events-none"
            >
                <span className="text-xs text-white/30 tracking-widest uppercase">ABOUT US</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-hero-gold/50 to-transparent" />
            </motion.div>
        </div>
    );
};

export default React.memo(HeroSection);
