import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';
import { products as localProducts } from '../data/productData';
import { LotusCrest } from './VedicDecorativeArt';

const StoreTeaser = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                const res = await fetch(`${API_URL}/api/products`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setProducts(data.slice(0, 3));
                        return;
                    }
                }
            } catch (error) {
                // Use fallback local data
            }
            setProducts(localProducts.slice(0, 3));
        };
        fetchTopProducts();
    }, []);

    return (
        <section className="relative py-24 bg-[#FAF8F5] border-t border-[#EADCC8] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                <div className="mb-14 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF7ED] border border-[#FED7AA]">
                        <LotusCrest className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
                            Certified Vedic Artifacts
                        </span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#1C1917]">
                        Energized <span className="bg-gradient-to-r from-[#C2410C] to-[#D97706] bg-clip-text text-transparent">Gemstones & Rudraksha</span>
                    </h2>
                    
                    <p className="text-sm sm:text-base text-[#78716C] max-w-2xl mx-auto">
                        100% natural, lab-certified gemstones and authentic Himalayan Rudraksha beads consecrated with Prana Pratishtha by Pandit Pravin Shriram.
                    </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {products.map((product, i) => (
                        <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group bg-white rounded-3xl overflow-hidden border border-[#EADCC8] shadow-luxury hover:shadow-luxury-hover transition-all text-left flex flex-col justify-between"
                        >
                            <div>
                                <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F0E8]">
                                    {product.image && (product.image.startsWith('http') || product.image.startsWith('/')) ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            loading="lazy"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-[#FFF7ED] to-[#FAF8F5] flex items-center justify-center">
                                            <Sparkles className="w-12 h-12 text-[#C2410C]" />
                                        </div>
                                    )}
                                    
                                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#FED7AA] text-[10px] font-bold text-[#C2410C] flex items-center gap-1 shadow-sm">
                                        <ShieldCheck size={12} /> Certified Natural
                                    </div>
                                </div>

                                <div className="p-6 space-y-2">
                                    <h3 className="text-base font-serif font-bold text-[#1C1917] group-hover:text-[#C2410C] transition-colors line-clamp-1">
                                        {product.name}
                                    </h3>
                                    
                                    {product.power && (
                                        <p className="text-xs text-[#C2410C] font-semibold">
                                            ✦ {product.power}
                                        </p>
                                    )}

                                    <p className="text-xs text-[#78716C] line-clamp-2 leading-relaxed">
                                        {product.desc || product.description}
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 pt-0 flex items-center justify-between border-t border-[#EADCC8]/60 mt-2">
                                <span className="text-lg font-serif font-bold text-[#C2410C]">
                                    ₹{typeof product.price === 'number' ? product.price.toLocaleString('en-IN') : product.price}
                                </span>
                                
                                <Link
                                    to="/store"
                                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1C1917] group-hover:text-[#C2410C] transition-colors"
                                >
                                    <span>View Details</span>
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* View Full Catalog CTA */}
                <div>
                    <Link
                        to="/store"
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#C2410C] to-[#EA580C] shadow-luxury hover:shadow-luxury-hover hover:scale-105 active:scale-95 transition-all"
                    >
                        <span>Explore Full Vedic Store Catalog</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default React.memo(StoreTeaser);
