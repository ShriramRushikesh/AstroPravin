import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ onBookClick }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Planets', href: '/planets' },
        { name: 'Numerology', href: '/numerology' },
        { name: 'Videos', href: '/videos' },
        { name: 'Blogs', href: '/blogs' },
        { name: 'Store', href: '/store' },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-4' : 'py-6'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div
                        className={`flex items-center justify-between px-6 py-3 rounded-full transition-all duration-300 ${scrolled
                            ? 'bg-cosmic-blue/70 backdrop-blur-md border border-white/10 shadow-lg'
                            : 'bg-transparent'
                            }`}
                    >
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-serif text-white font-bold tracking-tight">
                                Astro<span className="text-gradient-primary">Pravin</span>
                            </span>
                        </div>

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className="text-white/80 hover:text-secondary transition-colors text-sm uppercase tracking-widest font-medium"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <div className="hidden md:block">
                            <button
                                onClick={onBookClick}
                                className="px-6 py-2 bg-gradient-to-r from-primary to-secondary rounded-full text-white text-xs font-bold tracking-widest hover:shadow-[0_0_20px_rgba(217,70,239,0.4)] transition-shadow"
                            >
                                BOOK NOW
                            </button>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden text-white"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-void/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 md:hidden"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-2xl font-serif text-white hover:text-secondary transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <button
                            onClick={() => {
                                setMobileMenuOpen(false);
                                onBookClick();
                            }}
                            className="px-8 py-3 bg-primary rounded-full text-white font-bold tracking-widest"
                        >
                            BOOK CONSULTATION
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
