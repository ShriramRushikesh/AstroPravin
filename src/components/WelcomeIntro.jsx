import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LotusCrest } from './VedicDecorativeArt';

const WelcomeIntro = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        try {
            const hasSeenIntro = localStorage.getItem('hasSeenIntro');
            if (!hasSeenIntro && !import.meta.env.DEV) {
                setShow(true);
                document.body.style.overflow = 'hidden';

                const timer = setTimeout(() => {
                    setShow(false);
                    document.body.style.overflow = 'unset';
                    try { localStorage.setItem('hasSeenIntro', 'true'); } catch (e) {}
                }, 2200);

                return () => {
                    clearTimeout(timer);
                    document.body.style.overflow = 'unset';
                };
            }
        } catch (e) {
            // Ignore storage errors
        }
    }, []);

    if (!show) return null;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="welcome-screen"
                className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FAF8F5] text-[#1C1917] overflow-hidden pointer-events-auto"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.6 } }}
            >
                {/* Radial Glow */}
                <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-[#FFF7ED] via-[#FEF3C7] to-transparent rounded-full blur-3xl opacity-70" />

                {/* Content Container */}
                <div className="relative z-10 flex flex-col items-center text-center px-4 space-y-4">
                    {/* OM Symbol */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1.1 }}
                        transition={{ duration: 0.7 }}
                        className="text-7xl md:text-8xl text-[#C2410C] font-serif select-none"
                    >
                        ॐ
                    </motion.div>

                    {/* Brand Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-3xl md:text-5xl font-serif font-bold text-[#1C1917]"
                    >
                        Astro<span className="text-[#C2410C]">Pravin</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                        className="text-sm md:text-base text-[#78716C] italic font-serif"
                    >
                        Discover Ancient Vedic Wisdom & Authentic Life Guidance
                    </motion.p>

                    {/* Blessing */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.4 }}
                        className="text-xs text-[#B45309] font-bold tracking-widest uppercase pt-2"
                    >
                        || Shri Swami Samarth ||
                    </motion.p>
                </div>

                {/* Skip */}
                <button
                    onClick={() => {
                        setShow(false);
                        document.body.style.overflow = 'unset';
                    }}
                    className="absolute bottom-6 right-6 text-[#78716C] text-xs hover:text-[#C2410C] transition-colors z-20 underline"
                >
                    Skip Intro
                </button>
            </motion.div>
        </AnimatePresence>
    );
};

export default React.memo(WelcomeIntro);
