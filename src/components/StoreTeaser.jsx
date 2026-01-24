import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

const StoreTeaser = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchTopProducts = async () => {
            try {

                const apiUrl = API_URL;
                const res = await fetch(`${apiUrl}/api/products`);
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data.slice(0, 3)); // Only take top 3
                }
            } catch (error) {
                console.error('Failed to fetch products', error);
            }
        }
        fetchTopProducts();
    }, []);

    return (
        <section className="relative py-24 bg-void overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                <div className="mb-16">
                    <span className="text-primary tracking-[0.3em] uppercase text-sm font-semibold">The Treasury</span>
                    <h2 className="text-4xl md:text-5xl font-serif text-white mt-2 mb-6">Celestial Artifacts</h2>
                    <p className="text-white/60 max-w-2xl mx-auto">
                        Energetically charged Gemstones, Yantras, and Rudrakshas to align your destiny.
                    </p>
                </div>

                {/* Preview Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {products.map((product, i) => (
                        <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer border border-white/10"
                        >
                            {product.image && (product.image.startsWith('http') || product.image.startsWith('/')) ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <div className={`w-full h-full bg-gradient-to-br ${product.image || 'from-gray-800 to-gray-900'}`} />
                            )}
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex flex-col items-center justify-center p-4">
                                <Sparkles className="text-secondary mb-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300" />
                                <h3 className="text-xl font-serif text-white group-hover:text-secondary transition-colors">{product.name}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <Link to="/store">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-transparent border border-secondary/30 hover:border-secondary text-secondary rounded-full font-medium tracking-wide flex items-center mx-auto gap-2 group transition-colors"
                    >
                        Enter The Treasury <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </Link>
            </div>
        </section>
    );
};

export default StoreTeaser;
