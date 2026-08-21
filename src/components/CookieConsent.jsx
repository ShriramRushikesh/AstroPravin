import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Cookie, ShieldCheck, X } from 'lucide-react';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        try {
            const consent = localStorage.getItem('astropravin_cookie_consent');
            if (!consent) {
                // Short delay so page loads smoothly first
                const timer = setTimeout(() => setIsVisible(true), 1200);
                return () => clearTimeout(timer);
            }
        } catch (e) {
            // Storage disabled in strict private mode
        }
    }, []);

    const handleConsent = (choice) => {
        try {
            localStorage.setItem('astropravin_cookie_consent', choice);
        } catch (e) {}
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-black/90 backdrop-blur-xl border border-white/15 p-5 rounded-2xl shadow-2xl text-white font-sans"
                >
                    <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 shrink-0 mt-0.5">
                            <Cookie size={20} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold font-serif text-white tracking-wide">Cookie & Privacy Notice</h3>
                            <p className="text-xs text-white/70 mt-1 leading-relaxed">
                                We and our trusted partners (including Google AdSense) use cookies to analyze site traffic, personalize content, and display relevant advertising in compliance with our policies.
                            </p>
                        </div>
                        <button
                            onClick={() => handleConsent('dismissed')}
                            className="text-white/40 hover:text-white transition-colors p-1"
                            aria-label="Close Cookie Banner"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10 text-xs">
                        <Link
                            to="/privacy-policy"
                            className="text-secondary hover:underline flex items-center gap-1 font-medium"
                        >
                            <ShieldCheck size={14} /> Privacy Policy
                        </Link>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleConsent('essential')}
                                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 text-xs font-medium transition-colors"
                            >
                                Essential Only
                            </button>
                            <button
                                onClick={() => handleConsent('accepted')}
                                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-bold transition-all shadow-md"
                            >
                                Accept All
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default React.memo(CookieConsent);
