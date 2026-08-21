import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Planets', href: '/planets' },
    { name: 'Numerology', href: '/numerology' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Matrimony', href: '/matrimony' },
    { name: 'Contact', href: '/contact' },
    { name: 'Store', href: '/store' },
];

const Navbar = ({ onBookClick }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const isMatrimony = location.pathname === '/matrimony';

    useEffect(() => {
        let isScrolledState = false;
        const handleScroll = () => {
            const isScrolledNow = window.scrollY > 50;
            if (isScrolledNow !== isScrolledState) {
                isScrolledState = isScrolledNow;
                setScrolled(isScrolledNow);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    scrolled
                        ? 'py-3 bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl'
                        : isMatrimony
                            ? 'py-4 bg-gradient-to-b from-[#240615]/90 via-[#18040E]/60 to-transparent backdrop-blur-md border-b border-amber-500/20'
                            : 'py-5 bg-gradient-to-b from-black/80 via-black/30 to-transparent'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div
                        className={`flex items-center justify-between px-5 sm:px-6 py-2.5 rounded-2xl transition-all duration-300 ${
                            isMatrimony
                                ? 'bg-white/[0.04] backdrop-blur-xl border border-amber-500/25 shadow-[0_4px_25px_rgba(245,158,11,0.08)]'
                                : scrolled
                                    ? 'bg-white/[0.04] backdrop-blur-md border border-white/10 shadow-lg'
                                    : 'bg-transparent'
                        }`}
                    >
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <Link to="/" className="text-2xl font-serif text-white font-bold tracking-tight group flex items-center gap-1.5">
                                <span className="text-orange-500 group-hover:scale-105 transition-transform">Astro</span>
                                <span className={isMatrimony ? "text-gradient-gold" : "text-gradient-primary"}>Pravin</span>
                            </Link>
                        </div>

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-7">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        to={link.href}
                                        className={`relative text-xs uppercase tracking-widest font-semibold transition-all py-1.5 ${
                                            isActive
                                                ? isMatrimony
                                                    ? 'text-amber-300 font-bold'
                                                    : 'text-secondary font-bold'
                                                : isMatrimony
                                                    ? 'text-white/70 hover:text-amber-300'
                                                    : 'text-white/70 hover:text-white'
                                        }`}
                                    >
                                        {link.name}
                                        {isActive && (
                                            <motion.span
                                                layoutId="navUnderline"
                                                className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                                                    isMatrimony
                                                        ? 'bg-gradient-to-r from-amber-400 to-yellow-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                                                        : 'bg-secondary shadow-[0_0_8px_rgba(217,70,239,0.8)]'
                                                }`}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* CTA Button */}
                        <div className="hidden md:block">
                            <button
                                onClick={onBookClick}
                                className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wider transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
                                    isMatrimony
                                        ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black shadow-amber-500/20 hover:brightness-110'
                                        : 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-[0_0_20px_rgba(217,70,239,0.4)]'
                                }`}
                            >
                                BOOK CONSULTATION
                            </button>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className={`md:hidden p-2 rounded-xl border border-white/10 ${isMatrimony ? 'text-amber-400 bg-amber-500/10' : 'text-white bg-white/5'}`}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle Navigation Menu"
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
                        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        className="fixed inset-0 z-40 bg-black/95 flex flex-col items-center justify-center space-y-6 md:hidden px-6 text-center"
                    >
                        <div className="w-12 h-1 bg-amber-500/40 rounded-full mb-4" />
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`text-xl font-serif tracking-wider transition-colors ${
                                        isActive ? 'text-amber-400 font-bold' : 'text-white/80 hover:text-white'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                        <button
                            onClick={() => {
                                setMobileMenuOpen(false);
                                onBookClick();
                            }}
                            className="mt-6 px-8 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black font-bold rounded-2xl tracking-wider text-sm shadow-xl"
                        >
                            BOOK CONSULTATION
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default React.memo(Navbar);
