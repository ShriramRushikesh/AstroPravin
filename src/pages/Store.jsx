import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Search,
  Filter,
  ShieldCheck,
  Award,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ShoppingBag,
  Gem,
  Flame,
  ArrowUpDown,
  Truck,
  Lock,
  PhoneCall
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { API_URL } from '../config';
import { products as fallbackProducts } from '../data/productData';
import SEO from '../components/SEO';
import { MandalaWatermark, LotusCrest } from '../components/VedicDecorativeArt';
import { useCart } from '../context/CartContext';

const Store = () => {
    const { totalItemsCount, subtotalAmount, openCart } = useCart();
    const [products, setProducts] = useState(fallbackProducts);
    const [filteredProducts, setFilteredProducts] = useState(fallbackProducts);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-low' | 'price-high'
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [openFaq, setOpenFaq] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_URL}/api/products`);
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        const activeProducts = data.filter(p => p.inStock);
                        if (activeProducts.length > 0) {
                            setProducts(activeProducts);
                            setFilteredProducts(activeProducts);
                        }
                    }
                }
            } catch (error) {
                // Fallback kept
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        let result = [...products];

        if (activeCategory !== 'all') {
            result = result.filter(p => p.category === activeCategory);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            result = result.filter(p =>
                p.name?.toLowerCase().includes(q) ||
                p.desc?.toLowerCase().includes(q) ||
                p.description?.toLowerCase().includes(q) ||
                p.power?.toLowerCase().includes(q) ||
                p.rulingPlanet?.toLowerCase().includes(q)
            );
        }

        if (sortBy === 'price-low') {
            result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        } else if (sortBy === 'price-high') {
            result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        }

        setFilteredProducts(result);
    }, [activeCategory, searchQuery, sortBy, products]);

    const categories = [
        { id: 'all', label: 'All Artifacts', count: products.length, icon: Sparkles },
        { id: 'gemstones', label: 'Certified Gemstones (Ratna)', count: products.filter(p => p.category === 'gemstones').length, icon: Gem },
        { id: 'rudraksha', label: 'Nepali Rudraksha', count: products.filter(p => p.category === 'rudraksha').length, icon: Flame },
        { id: 'yantras', label: 'Energized Yantras', count: products.filter(p => p.category === 'yantras').length, icon: ShieldCheck }
    ];

    const storeFaqs = [
        {
            q: "Are the gemstones 100% natural and government lab certified?",
            a: "Yes. Every gemstone in our treasury is 100% natural, unheated, and untreated earth-mined stone. Each piece comes with an official gemological test certificate verifying its authenticity, cut, carat weight, and origin."
        },
        {
            q: "How does Pandit Pravin energize (Prana Pratishtha) the spiritual items?",
            a: "Before packaging, every gemstone, Rudraksha, and Yantra undergoes individualized Vedic consecration during auspicious planetary Horas with 1,008 Sanskrit Beej Mantras, holy Ganga water purification, and personalized intention prayers for the devotee."
        },
        {
            q: "How does the 1-Click Razorpay payment and delivery work?",
            a: "Simply click 'Add to Cart' or 'Buy Now', enter your delivery address, and pay securely via UPI (Google Pay, PhonePe, Paytm), Credit/Debit Card, or NetBanking. You receive instant order receipt confirmation and tracking updates."
        },
        {
            q: "What is the delivery time across India?",
            a: "We provide Free Insured Express Courier delivery across India. Deliveries generally reach within 3 to 5 business days with tamper-evident insured packaging."
        }
    ];

    return (
        <div className="min-h-screen bg-[#FAF8F5] pt-24 pb-28 px-4 sm:px-6 relative overflow-hidden font-sans">
            <SEO
                title="AstroPravin Spiritual Store | Certified Vedic Gemstones, Nepali Rudraksha & Energized Yantras"
                description="Buy 100% certified natural Vedic gemstones (Pukhraj, Neelam, Manik, Panna), genuine Nepali Rudraksha beads, and energized brass Yantras blessed by Pandit Pravin Shriram. 1-Click Razorpay checkout with Free Insured Delivery across India."
                keywords="buy certified gemstones online, original yellow sapphire price, authentic blue sapphire, certified nepali rudraksha, energized shree yantra, pukhraj stone online, astropravin store, vedic ratna shop"
            />

            {/* Background Decorative Mandala */}
            <div className="absolute top-20 right-[-120px] opacity-[0.035] pointer-events-none">
                <MandalaWatermark className="w-[650px] h-[650px]" spin={false} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">

                {/* ── STORE HERO BANNER ────────────────────────────────────────── */}
                <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF7ED] border border-[#FED7AA] shadow-sm">
                        <LotusCrest className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
                            Vedic Treasury & Consecrated Artifacts
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#1C1917] tracking-tight">
                        Certified Gemstones, Sacred Rudraksha & <span className="bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#D97706] bg-clip-text text-transparent">Energized Yantras</span>
                    </h1>

                    <p className="text-sm sm:text-base text-[#44403C] leading-relaxed max-w-2xl mx-auto">
                        100% natural, lab-tested astrological gemstones and spiritual artifacts, personally consecrated with Vedic Prana Pratishtha rituals by <strong className="text-[#C2410C]">Jyotish Pravin Shriram</strong>.
                    </p>
                </div>

                {/* ── TRUST PILLARS STRIP ──────────────────────────────────────── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                    <div className="bg-white border border-[#EADCC8] rounded-2xl p-3.5 flex items-center gap-3 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#C2410C] shrink-0">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-[#1C1917]">100% Lab Certified</h4>
                            <p className="text-[10px] text-[#78716C]">Government Lab Tested</p>
                        </div>
                    </div>

                    <div className="bg-white border border-[#EADCC8] rounded-2xl p-3.5 flex items-center gap-3 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#C2410C] shrink-0">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-[#1C1917]">Prana Pratishtha</h4>
                            <p className="text-[10px] text-[#78716C]">Individually Consecrated</p>
                        </div>
                    </div>

                    <div className="bg-white border border-[#EADCC8] rounded-2xl p-3.5 flex items-center gap-3 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#C2410C] shrink-0">
                            <Truck size={20} />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-[#1C1917]">Free Insured Delivery</h4>
                            <p className="text-[10px] text-[#78716C]">All States Across India</p>
                        </div>
                    </div>

                    <div className="bg-white border border-[#EADCC8] rounded-2xl p-3.5 flex items-center gap-3 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#C2410C] shrink-0">
                            <Lock size={20} />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-[#1C1917]">Razorpay Secure</h4>
                            <p className="text-[10px] text-[#78716C]">UPI, Cards & Netbanking</p>
                        </div>
                    </div>
                </div>

                {/* ── CONTROLS & FILTERING BAR ─────────────────────────────────── */}
                <div className="bg-white border border-[#EADCC8] rounded-3xl p-4 sm:p-5 shadow-luxury mb-8 space-y-4">
                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2">
                        {categories.map(cat => {
                            const IconComp = cat.icon;
                            const isActive = activeCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer ${
                                        isActive
                                            ? 'bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white shadow-md shadow-[#C2410C]/25'
                                            : 'bg-[#FAF8F5] text-[#44403C] hover:bg-[#F5EFE6] border border-[#EADCC8]'
                                    }`}
                                >
                                    <IconComp size={13} />
                                    <span>{cat.label}</span>
                                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                                        isActive ? 'bg-white/25 text-white' : 'bg-[#EADCC8]/60 text-[#78716C]'
                                    }`}>
                                        {cat.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Search & Sort Row */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#EADCC8]/60">
                        {/* Search Box */}
                        <div className="relative w-full sm:w-80">
                            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]" />
                            <input
                                type="text"
                                placeholder="Search by name, stone, ruling planet..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#EADCC8] rounded-xl text-xs text-[#1C1917] focus:outline-none focus:border-[#C2410C]"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#78716C] hover:text-[#C2410C]"
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        {/* Sort Dropdown & Cart Quick Pill */}
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                            <div className="flex items-center gap-2">
                                <ArrowUpDown size={13} className="text-[#78716C]" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-3 py-2 bg-[#FAF8F5] border border-[#EADCC8] rounded-xl text-xs font-semibold text-[#44403C] focus:outline-none focus:border-[#C2410C]"
                                >
                                    <option value="featured">Featured Order</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                </select>
                            </div>

                            {/* View Cart Button */}
                            <button
                                onClick={openCart}
                                className="px-4 py-2 bg-[#FFF7ED] hover:bg-[#FED7AA]/50 text-[#C2410C] border border-[#FED7AA] rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
                            >
                                <ShoppingBag size={14} />
                                <span>Bag ({totalItemsCount})</span>
                                {subtotalAmount > 0 && (
                                    <span className="font-mono text-[#C2410C] font-extrabold">
                                        • ₹{subtotalAmount.toLocaleString('en-IN')}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── PRODUCT GRID ────────────────────────────────────────────── */}
                {filteredProducts.length === 0 ? (
                    <div className="bg-white border border-[#EADCC8] rounded-3xl p-16 text-center space-y-4 max-w-md mx-auto shadow-sm">
                        <div className="w-16 h-16 rounded-full bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#C2410C] mx-auto">
                            <Search size={24} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base font-serif font-bold text-[#1C1917]">No Matching Artifacts</h3>
                            <p className="text-xs text-[#78716C]">
                                We couldn't find items matching "{searchQuery}". Try searching for Pukhraj, Neelam, Rudraksha, or Yantra.
                            </p>
                        </div>
                        <button
                            onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                            className="px-5 py-2 bg-[#C2410C] text-white text-xs font-bold rounded-xl shadow-sm"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard
                                key={product._id || product.id || product.name}
                                product={product}
                                onQuickView={(prod) => setSelectedProduct(prod)}
                            />
                        ))}
                    </div>
                )}

                {/* ── ASTROLOGICAL CONSULTATION HELPLINE BANNER ─────────────────── */}
                <div className="mt-16 bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7]/40 to-[#FFF7ED] border border-[#FCD34D] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                    <div className="space-y-2 text-center md:text-left">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#B45309]">
                            Personalized Gemstone Recommendation
                        </span>
                        <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1917]">
                            Unsure Which Gemstone Fits Your Kundli?
                        </h3>
                        <p className="text-xs sm:text-sm text-[#574F47] max-w-xl">
                            Wearing the wrong stone can create adverse planetary effects. Consult <strong>Jyotish Pravin Shriram</strong> for an individualized birth chart analysis before wearing.
                        </p>
                    </div>

                    <a
                        href="https://wa.me/919921697908?text=Namaste%20Pandit%20Pravin,%20I%20would%20like%20to%20consult%20for%20Gemstone%20Recommendation%20based%20on%20my%20Kundli."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3.5 bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-bold rounded-2xl shadow-lg shadow-[#C2410C]/25 transition-all flex items-center gap-2 shrink-0 hover:scale-105"
                    >
                        <PhoneCall size={15} />
                        <span>Get Gemstone Recommendation</span>
                    </a>
                </div>

                {/* ── STORE FAQS ACCORDION ─────────────────────────────────────── */}
                <div className="mt-16 max-w-3xl mx-auto space-y-4">
                    <div className="text-center space-y-1 mb-8">
                        <h3 className="text-2xl font-serif font-bold text-[#1C1917]">
                            Frequently Asked Questions
                        </h3>
                        <p className="text-xs text-[#78716C]">
                            Everything you need to know about our certified gemstones and delivery
                        </p>
                    </div>

                    {storeFaqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="bg-white border border-[#EADCC8] rounded-2xl overflow-hidden shadow-sm transition-all"
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                className="w-full px-5 py-4 flex items-center justify-between text-left text-xs font-bold text-[#1C1917] hover:text-[#C2410C] transition-colors"
                            >
                                <span className="flex items-center gap-2.5">
                                    <HelpCircle size={15} className="text-[#C2410C] shrink-0" />
                                    {faq.q}
                                </span>
                                <ChevronDown
                                    size={16}
                                    className={`text-[#78716C] transition-transform duration-200 shrink-0 ml-2 ${
                                        openFaq === idx ? 'rotate-180 text-[#C2410C]' : ''
                                    }`}
                                />
                            </button>

                            {openFaq === idx && (
                                <div className="px-5 pb-4 pt-1 text-xs text-[#574F47] leading-relaxed border-t border-[#FAF8F5]">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </div>

            {/* ── QUICK VIEW PRODUCT MODAL ────────────────────────────────────── */}
            <ProductModal
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                product={selectedProduct}
            />

            {/* ── FLOATING MOBILE CART BAR ────────────────────────────────────── */}
            {totalItemsCount > 0 && (
                <div className="md:hidden fixed bottom-18 left-0 right-0 z-40 px-4 pointer-events-none">
                    <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        onClick={openCart}
                        className="w-full max-w-sm mx-auto py-3 px-4 bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#D97706] text-white rounded-2xl font-bold text-xs shadow-xl shadow-[#C2410C]/35 flex items-center justify-between pointer-events-auto border-2 border-white/20"
                    >
                        <div className="flex items-center gap-2">
                            <ShoppingBag size={16} />
                            <span>{totalItemsCount} item{totalItemsCount > 1 ? 's' : ''} in Bag</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono">
                            <span>₹{subtotalAmount.toLocaleString('en-IN')}</span>
                            <span>→</span>
                        </div>
                    </motion.button>
                </div>
            )}
        </div>
    );
};

export default React.memo(Store);
