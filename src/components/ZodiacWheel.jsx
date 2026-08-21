import React from 'react';
import { motion } from 'framer-motion';

const ZodiacWheel = () => {
    return (
        <div className="relative w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] md:w-[600px] md:h-[600px] lg:w-[750px] lg:h-[750px] opacity-30 select-none pointer-events-none">
            {/* Outer Ring */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-hero-saffron/20 rounded-full border-dashed"
            />

            {/* Zodiac Symbols Ring */}
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[8%] border border-hero-gold/15 rounded-full flex items-center justify-center"
            >
                <div className="w-full h-full border border-white/5 rounded-full relative">
                    <svg className="absolute inset-0 w-full h-full text-hero-saffron/20" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.2" />
                        <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="0.15" strokeDasharray="1 2" />
                        <path d="M50 2 L50 98 M2 50 L98 50" stroke="currentColor" strokeWidth="0.15" />
                        <path d="M16 16 L84 84 M84 16 L16 84" stroke="currentColor" strokeWidth="0.15" />
                        
                        {/* 12 Zodiac Dot Markers positioned relatively */}
                        {Array.from({ length: 12 }).map((_, i) => {
                            const angle = (i * 30 * Math.PI) / 180;
                            const cx = 50 + 44 * Math.cos(angle);
                            const cy = 50 + 44 * Math.sin(angle);
                            return (
                                <circle
                                    key={i}
                                    cx={cx}
                                    cy={cy}
                                    r="1.2"
                                    fill="#FF9933"
                                />
                            );
                        })}
                    </svg>
                </div>
            </motion.div>

            {/* Inner Mandala */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[25%] border border-hero-gold/20 rounded-full flex items-center justify-center"
            >
                <div className="w-3 h-3 md:w-4 md:h-4 bg-hero-gold rounded-full shadow-[0_0_15px_#FFD700]" />
            </motion.div>
        </div>
    );
};

export default React.memo(ZodiacWheel);
