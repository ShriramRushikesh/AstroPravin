import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WelcomeIntro = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Check if user has seen the intro
        const hasSeenIntro = localStorage.getItem('hasSeenIntro');
        if (!hasSeenIntro) {
            setShow(true);
            // Lock scrolling
            document.body.style.overflow = 'hidden';

            // Cleanup timer
            const timer = setTimeout(() => {
                setShow(false);
                document.body.style.overflow = 'unset';
                localStorage.setItem('hasSeenIntro', 'true');
            }, 4500); // 4.5 seconds total duration

            return () => {
                clearTimeout(timer);
                document.body.style.overflow = 'unset';
            };
        }
    }, []);

    return (
        <AnimatePresence mode="wait">
            {show && (
                <motion.div
                    key="welcome-screen"
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white overflow-hidden"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 1.0 } }}
                >
                    {/* Background Stars/Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-black opacity-90"></div>

                    {/* Floating Particles */}
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute bg-white rounded-full opacity-0"
                            animate={{
                                opacity: [0, 1, 0],
                                scale: [0, 1.5, 0],
                                y: [0, -100]
                            }}
                            transition={{
                                duration: 3,
                                delay: Math.random() * 2,
                                repeat: Infinity
                            }}
                            style={{
                                width: Math.random() * 3 + 1 + 'px',
                                height: Math.random() * 3 + 1 + 'px',
                                left: Math.random() * 100 + '%',
                                top: Math.random() * 100 + '%',
                            }}
                        />
                    ))}

                    {/* Content Container */}
                    <div className="relative z-10 flex flex-col items-center text-center px-4">

                        {/* 1. OM Symbol */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                            animate={{ opacity: 1, scale: 1.2, rotate: 0 }}
                            transition={{ duration: 1 }}
                            className="text-8xl md:text-9xl text-yellow-400 font-serif mb-6 drop-shadow-lg"
                        >
                            ॐ
                        </motion.div>

                        {/* 2. Main Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="text-4xl md:text-6xl font-serif text-white tracking-wider mb-2"
                        >
                            <span className="text-orange-500">Astro</span> Pravin
                        </motion.h1>

                        {/* 3. Subtitle */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.8, duration: 0.8 }}
                            className="flex flex-col items-center space-y-2"
                        >
                            <div className="h-[1px] w-24 bg-yellow-500/50 my-2"></div>
                            <p className="text-lg md:text-xl text-gray-300 font-light italic">
                                Are You Ready to Discover Your Destiny?
                            </p>
                        </motion.div>

                        {/* 4. Blessing */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2.5, duration: 1 }}
                            className="mt-8 text-sm text-yellow-500/80 font-medium tracking-widest uppercase"
                        >
                            || Shri Swami Samarth ||
                        </motion.p>
                    </div>

                    {/* Skip Button (Safety) */}
                    <button
                        onClick={() => setShow(false)}
                        className="absolute bottom-8 right-8 text-gray-500 text-xs hover:text-white transition-colors z-20 underline"
                    >
                        Skip Intro
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WelcomeIntro;
