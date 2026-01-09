import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles } from 'lucide-react';

const ProductCard = ({ product }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-gold/30 transition-all duration-500"
        >
            {/* Holographic Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" />

            {/* Product Visual */}
            <div className="h-48 w-full bg-black/20 relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                {product.image && (product.image.startsWith('http') || product.image.startsWith('/')) ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${product.image || 'from-gray-800 to-gray-900'}`} />
                )}

                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />

                <div className="absolute top-2 right-2">
                    {product.inStock === false && (
                        <span className="px-2 py-1 bg-red-500/80 rounded text-[10px] text-white font-bold uppercase">
                            Sold Out
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="text-white font-serif text-lg truncate group-hover:text-gold transition-colors">{product.name}</h3>
                <p className="text-white/40 text-sm mt-1 mb-4 h-10 overflow-hidden line-clamp-2">{product.description || product.desc}</p>

                <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-4">
                    <span className="text-saffron font-bold">₹{product.price.toLocaleString()}</span>
                    <button
                        onClick={() => {
                            const msg = `*New Order Enquiry* 🛍️\n\n*Product:* ${product.name}\n*Price:* ₹${product.price.toLocaleString()}\n*Category:* ${product.category || 'Start'}\n\n*Hello Astro Pravin Ji,*\nI am interested in buying this spiritual artifact. Please share availability and payment details. \n\n🙏`;
                            const waUrl = `https://wa.me/919999999999?text=${encodeURIComponent(msg)}`;
                            window.open(waUrl, '_blank');
                        }}
                        className="p-2 rounded-full bg-white/5 hover:bg-gold hover:text-cosmic-blue text-gold transition-all"
                        title="Buy on WhatsApp"
                    >
                        <ShoppingBag size={18} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
