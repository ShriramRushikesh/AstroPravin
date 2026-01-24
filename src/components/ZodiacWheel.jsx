import React from 'react';
import { motion } from 'framer-motion';

const ZodiacWheel = () => {
    return (
        <div className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] opacity-30 select-none pointer-events-none">
            {/* Outer Ring */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-[1px] border-hero-saffron/20 rounded-full border-dashed"
            />

            {/* Zodiac Symbols Ring (Simplified representation) */}
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
                className="absolute inset-10 border-[1px] border-hero-gold/10 rounded-full flex items-center justify-center p-12"
            >
                <div className="w-full h-full border border-white/5 rounded-full relative">
                    {/* Decorate with some pseudo-zodiac markers */}
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-hero-saffron rounded-full"
                            style={{
                                top: '50%',
                                left: '50%',
                                transform: `rotate(${i * 30}deg) translate(300px) rotate(-${i * 30}deg)`
                            }}
                        />
                    ))}
                    {/* Inner geometric lines */}
                    <svg className="absolute inset-0 w-full h-full text-hero-saffron/10" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.2" />
                        <path d="M50 2 L50 98 M2 50 L98 50" stroke="currentColor" strokeWidth="0.1" />
                        <path d="M16 16 L84 84 M84 16 L16 84" stroke="currentColor" strokeWidth="0.1" />
                    </svg>
                </div>
            </motion.div>

            {/* Inner Mandala */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[25%] border border-hero-gold/20 rounded-full flex items-center justify-center"
            >
                <div className="w-4 h-4 bg-hero-gold rounded-full shadow-[0_0_20px_#FFD700]" />
            </motion.div>
        </div>
    );
};

export default ZodiacWheel;
