import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Search, Filter, ShieldCheck, Award, CheckCircle2, HelpCircle, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { API_URL } from '../config';
import { products as fallbackProducts } from '../data/productData';
import SEO from '../components/SEO';
import { MandalaWatermark, LotusCrest } from '../components/VedicDecorativeArt';

const Store = () => {
    const [products, setProducts] = useState(fallbackProducts);
    const [filteredProducts, setFilteredProducts] = useState(fallbackProducts);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
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
        let result = products;

        if (activeCategory !== 'all') {
            result = result.filter(p => p.category === activeCategory);
        }

        if (searchQuery) {
            result = result.filter(p =>
                p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.desc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.power?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredProducts(result);
    }, [activeCategory, searchQuery, products]);

    const categories = [
        { id: 'all', label: 'All Artifacts' },
        { id: 'gemstones', label: 'Natural Gemstones (Ratna)' },
        { id: 'rudraksha', label: 'Sacred Rudraksha' },
        { id: 'yantras', label: 'Energized Yantras' }
    ];

    const storeFaqs = [
        {
            q: "Are the gemstones certified and 100% authentic natural?",
            a: "Yes. Every single gemstone in our treasury is 100% natural, earth-mined, untreated, and accompanied by a recognized government-approved gemological laboratory test certificate."
        },
        {
            q: "How does Pandit Pravin energize (Prana Pratishtha) the spiritual items?",
            a: "Before dispatch, each item undergoes individualized Vedic consecration during auspicious planetary Horas using sacred Sanskrit Beej Mantras, holy Ganga water purification, and personalized intention rituals for the devotee."
        },
        {
            q: "How can I order and receive delivery?",
            a: "You can click on any product to enquire directly on WhatsApp (+91 99216 97908). We provide secure, insured, tamper-proof courier delivery across all states in India and worldwide."
        }
    ];

    return (
        <div className="min-h-screen bg-[#FAF8F5] pt-28 pb-24 px-4 sm:px-6 relative overflow-hidden font-sans">
            <SEO
                title="Energized Gemstones, Rudraksha & Yantras | AstroPravin Store"
                description="Buy 100% certified natural Vedic gemstones (Pukhraj, Neelam, Manik, Panna), genuine Nepali Rudraksha beads, and energized copper Yantras blessed by Pandit Pravin Shriram."
                keywords="buy certified gemstones, original yellow sapphire, authentic blue sapphire, nepali rudraksha, energized yantras, astropravin store"
            />

            {/* Background Decorative */}
            <div className="absolute top-20 right-[-120px] opacity-[0.03] pointer-events-none">
                <MandalaWatermark className="w-[600px] h-[600px]" spin={false} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF7ED] border border-[#FED7AA]">
                        <LotusCrest className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
                            Vedic Gemstone & Artifact Treasury
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#1C1917]">
                        Energized <span className="bg-gradient-to-r from-[#C2410C] to-[#D97706] bg-clip-text text-transparent">Gemstones & Rudraksha</span>
                    </h1>

                    <p className="text-sm text-[#78716C] leading-relaxed">
                        Conducted under rigorous Vedic traditions. Every gem is lab-tested and consecrated with Prana Pratishtha for planetary alignment and spiritual protection.
                    </p>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 bg-white p-4 rounded-2xl border border-[#EADCC8] shadow-sm">
                    {/* Category Pills */}
                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    activeCategory === cat.id
                                        ? 'bg-[#C2410C] text-white shadow-sm'
                                        : 'bg-[#F5F0E8] text-[#44403C] hover:bg-[#EADCC8]'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-72">
                        <Search size={14} className="absolute left-3.5 top-3 text-[#78716C]" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search gemstones, yantras..."
                            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#EADCC8] text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C2410C]"
                        />
                    </div>
                </div>

                {/* Products Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-[#EADCC8] p-8">
                        <p className="text-sm text-[#78716C]">No artifacts found matching your criteria.</p>
                        <button
                            onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                            className="mt-4 px-4 py-2 bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA] rounded-xl text-xs font-bold"
                        >
                            Reset Filter
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                onClick={() => setSelectedProduct(product)}
                            />
                        ))}
                    </div>
                )}

                {/* Store FAQs */}
                <div className="bg-white rounded-3xl p-8 border border-[#EADCC8] shadow-luxury max-w-4xl mx-auto space-y-4">
                    <h3 className="text-xl font-serif font-bold text-[#1C1917] mb-6 text-center">
                        Frequently Asked Questions about Vedic Artifacts
                    </h3>
                    <div className="space-y-3">
                        {storeFaqs.map((faq, idx) => (
                            <div key={idx} className="border border-[#EADCC8] rounded-2xl overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full p-4 text-left font-serif font-bold text-xs sm:text-sm text-[#1C1917] flex items-center justify-between hover:bg-[#FAF8F5] transition-colors"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown size={16} className={`transform transition-transform ${openFaq === idx ? 'rotate-180 text-[#C2410C]' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {openFaq === idx && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="px-4 pb-4 text-xs text-[#78716C] leading-relaxed border-t border-[#EADCC8] pt-3"
                                        >
                                            {faq.a}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Product Modal */}
            <ProductModal
                isOpen={!!selectedProduct}
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </div>
    );
};

export default React.memo(Store);
