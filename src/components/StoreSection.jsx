import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import SEO from './SEO';
import { API_URL } from '../config';

const StoreSection = () => {
    const [filter, setFilter] = useState('all');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const apiUrl = API_URL;
                const res = await fetch(`${apiUrl}/api/products`);
                if (res.ok) {
                    setProducts(await res.json());
                }
            } catch (error) {
                console.error('Failed to fetch products', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const categories = [
        { id: 'all', label: 'All Artifacts' },
        { id: 'gemstones', label: 'Gemstones' },
        { id: 'yantras', label: 'Yantras' },
        { id: 'kawach', label: 'Kawach' },
        { id: 'rudraksha', label: 'Rudraksha' }
    ];

    const filteredProducts = filter === 'all'
        ? products
        : products.filter(p => p.category === filter);

    return (
        <section className="relative py-24 bg-void overflow-hidden">
            <SEO
                title="Spiritual Store - Gemstones, Yantras, & Kawach | Astro Pravin"
                description="Buy authentic, energized gemstones, yantras, and kawach for health, wealth, and prosperity. Hand-picked and blessed by Astro Pravin."
                keywords="buy gemstones online, authentic yantras, astrology store, energised kawach, rudraksha, vedic remedies store, spiritual artifacts"
            />
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-primary tracking-[0.3em] uppercase text-sm font-semibold">Spiritual Store</span>
                    <h2 className="text-4xl md:text-5xl font-serif text-white mt-2 mb-6">Energized Artifacts</h2>
                    <p className="text-white/60 max-w-2xl mx-auto">
                        Ancient Vedic tools energized with mantras to attract health, wealth, and prosperity.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex justify-center flex-wrap gap-4 mb-12">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setFilter(cat.id)}
                            className={`px-6 py-2 rounded-full text-sm font-medium tracking-wide transition-all border ${filter === cat.id
                                ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(255,153,51,0.3)]'
                                : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:text-white'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    <AnimatePresence>
                        {filteredProducts.map(product => (
                            <ProductCard
                                key={product._id || product.id}
                                product={product}
                                onClick={() => setSelectedProduct(product)}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Product Detail Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <ProductModal
                        isOpen={!!selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                        product={selectedProduct}
                    />
                )}
            </AnimatePresence>
        </section>
    );
};

export default StoreSection;
