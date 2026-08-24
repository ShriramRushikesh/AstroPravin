import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Calendar, Sparkles, ShoppingBag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { LotusCrest } from './VedicDecorativeArt';
import { useCart } from '../context/CartContext';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Planets', href: '/planets' },
    { name: 'Numerology', href: '/numerology' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Matrimony', href: '/matrimony' },
    { name: 'Store', href: '/store' },
    { name: 'Contact', href: '/contact' },
];

const Navbar = ({ onBookClick }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { totalItemsCount, openCart } = useCart();

    useEffect(() => {
        let isScrolledState = false;
        const handleScroll = () => {
            const isScrolledNow = window.scrollY > 30;
            if (isScrolledNow !== isScrolledState) {
                isScrolledState = isScrolledNow;
                setScrolled(isScrolledNow);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on page transition
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.4 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    scrolled
                        ? 'py-2.5 bg-[#FAF8F5]/90 backdrop-blur-xl border-b border-[#EADCC8] shadow-luxury'
                        : 'py-4 bg-[#FAF8F5]/75 backdrop-blur-md border-b border-[#EADCC8]/60'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between">
                        {/* Brand Logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-9 h-9 rounded-xl bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                                <LotusCrest className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-serif font-bold text-[#1C1917] tracking-tight leading-none">
                                    Astro<span className="text-[#C2410C]">Pravin</span>
                                </span>
                                <span className="text-[10px] text-[#78716C] tracking-widest uppercase font-medium mt-0.5">
                                    Online Jyotish
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Links */}
                        <div className="hidden lg:flex items-center gap-1 bg-[#F5F0E8]/70 px-3 py-1.5 rounded-full border border-[#EADCC8]/80 shadow-sm">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        to={link.href}
                                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                                            isActive
                                                ? 'bg-[#C2410C] text-white shadow-sm'
                                                : link.name === 'Matrimony'
                                                    ? 'text-[#C2410C] hover:bg-[#FFF7ED] font-bold'
                                                    : 'text-[#44403C] hover:text-[#C2410C] hover:bg-white/60'
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Desktop CTA & Cart Buttons */}
                        <div className="hidden md:flex items-center gap-3">
                            <button
                                onClick={openCart}
                                className="relative p-2.5 rounded-xl bg-[#FFF7ED] border border-[#FED7AA] text-[#C2410C] hover:bg-[#FED7AA]/50 transition-all shadow-sm flex items-center justify-center cursor-pointer"
                                aria-label="Open Shopping Bag"
                                title="Shopping Bag"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                {totalItemsCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#C2410C] text-white text-[10px] font-bold flex items-center justify-center shadow-md animate-pulse">
                                        {totalItemsCount}
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={onBookClick}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#D97706] shadow-sm hover:shadow-luxury-hover hover:scale-105 active:scale-95 transition-all"
                            >
                                <Calendar className="w-3.5 h-3.5" />
                                Consult Jyotishji
                            </button>
                        </div>

                        {/* Mobile Menu & Cart Toggle */}
                        <div className="flex items-center gap-2 lg:hidden">
                            <button
                                onClick={openCart}
                                className="relative p-2 rounded-lg bg-[#FFF7ED] border border-[#FED7AA] text-[#C2410C] flex items-center justify-center shadow-sm"
                                aria-label="Open Shopping Bag"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                {totalItemsCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#C2410C] text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                                        {totalItemsCount}
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={onBookClick}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#C2410C] shadow-sm"
                            >
                                <Calendar className="w-3 h-3" />
                                <span>Talk to Jyotish</span>
                            </button>

                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 rounded-xl text-[#44403C] hover:text-[#C2410C] bg-[#F5F0E8] border border-[#EADCC8] focus:outline-none"
                                aria-label="Toggle Navigation Menu"
                            >
                                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Slide Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed top-[68px] left-0 right-0 z-40 bg-[#FAF8F5]/98 backdrop-blur-2xl border-b border-[#EADCC8] shadow-luxury-hover overflow-hidden lg:hidden"
                    >
                        <div className="px-5 py-6 space-y-2">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        to={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                            isActive
                                                ? 'bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA]'
                                                : 'text-[#44403C] hover:bg-[#F5F0E8]'
                                        }`}
                                    >
                                        <span>{link.name}</span>
                                        {link.name === 'Matrimony' && (
                                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA]">
                                                New
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}

                            <div className="pt-4 border-t border-[#EADCC8]">
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        onBookClick();
                                    }}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#D97706] shadow-sm"
                                >
                                    <Calendar className="w-4 h-4" />
                                    Book Astro Consultation
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default React.memo(Navbar);
