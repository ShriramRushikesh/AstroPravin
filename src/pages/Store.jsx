import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Search, Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';

const Store = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
                const res = await fetch(`${apiUrl}/api/products`);
                if (res.ok) {
                    const data = await res.json();
                    const activeProducts = data.filter(p => p.inStock);
                    setProducts(activeProducts);
                    setFilteredProducts(activeProducts);
                }
            } catch (error) {
                console.error('Failed to fetch products', error);
            } finally {
                setLoading(false);
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
            result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        setFilteredProducts(result);
    }, [activeCategory, searchQuery, products]);

    const categories = [
        { id: 'all', label: 'All Treasures' },
        { id: 'gemstones', label: 'Gemstones' },
        { id: 'yantras', label: 'Yantras' },
        { id: 'kawach', label: 'Kawach' },
        { id: 'rudraksha', label: 'Rudraksha' }
    ];

    return (
        <div className="min-h-screen bg-void text-white">
            <SEO
                title="Celestial Treasury | Astro Pravin Store"
                description="Explore our exclusive collection of energized gemstones, yantras, and rudrakshas. Hand-selected for spiritual growth and prosperity."
            />

            {/* Hero Section */}
            <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-void/50 to-void" />
                    <img
                        src="https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2694&auto=format&fit=crop"
                        alt="Cosmic Store Background"
                        className="w-full h-full object-cover opacity-40"
                    />
                </div>

                <div className="relative z-10 text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-saffron tracking-[0.4em] uppercase text-sm font-semibold mb-4 block">
                            Energized Artifacts
                        </span>
                        <h1 className="text-5xl md:text-7xl font-serif mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-gold to-white">
                            Celestial Treasury
                        </h1>
                        <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto font-light">
                            Discover ancient tools for modern spiritual elevation. Each item is energized with Vedic mantras.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 sticky top-24 z-20 bg-void/80 backdrop-blur-xl p-4 rounded-2xl border border-white/5 shadow-2xl">

                    {/* Categories - Desktop */}
                    <div className="hidden md:flex gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-4 py-2 rounded-full text-sm transition-all border ${activeCategory === cat.id
                                    ? 'bg-gold text-black font-bold border-gold'
                                    : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:text-white'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                        <input
                            type="text"
                            placeholder="Search artifacts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-64 bg-black/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-white focus:border-gold outline-none transition-colors"
                        />
                    </div>

                    {/* Mobile Category Scroll */}
                    <div className="flex md:hidden w-full overflow-x-auto gap-2 no-scrollbar pb-2">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all border ${activeCategory === cat.id
                                    ? 'bg-gold text-black font-bold border-gold'
                                    : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:text-white'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
                    </div>
                ) : (
                    /* Product Grid */
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        <AnimatePresence>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(product => (
                                    <ProductCard key={product._id} product={product} />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20 text-white/30">
                                    <Sparkles className="mx-auto mb-4 opacity-50" size={48} />
                                    <p>No treasures found matching your quest.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>


        </div>
    );
};

export default Store;
