import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles, ShieldCheck, Zap, Plus, Check } from 'lucide-react';
import { API_URL } from '../config';
import { useCart } from '../context/CartContext';

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop';

export const normalizeProductImage = (img) => {
    if (!img) return DEFAULT_FALLBACK_IMAGE;
    if (typeof img !== 'string') return DEFAULT_FALLBACK_IMAGE;
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    if (img.startsWith('/public')) return `${API_URL}${img}`;
    if (img.startsWith('/uploads')) return `${API_URL}/public${img}`;
    if (img.startsWith('uploads/')) return `${API_URL}/public/${img}`;
    return `${API_URL}/public/uploads/${img}`;
};

const ProductCard = ({ product, onQuickView }) => {
    const { addToCart } = useCart();
    const imageSrc = normalizeProductImage(product.image);
    const numericPrice = typeof product.price === 'number' ? product.price : Number(String(product.price).replace(/[^0-9.]/g, '')) || 0;
    const originalPrice = product.originalPrice ? (typeof product.originalPrice === 'number' ? product.originalPrice : Number(String(product.originalPrice).replace(/[^0-9.]/g, '')) || Math.round(numericPrice * 1.25)) : Math.round(numericPrice * 1.25);
    const discountPercent = originalPrice > numericPrice ? Math.round(((originalPrice - numericPrice) / originalPrice) * 100) : 0;

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart(product, 1);
    };

    const handleBuyNow = (e) => {
        e.stopPropagation();
        addToCart(product, 1);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            onClick={() => onQuickView && onQuickView(product)}
            className="group relative bg-white border border-[#EADCC8] rounded-3xl overflow-hidden shadow-luxury hover:shadow-luxury-hover transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
            {/* Visual Image Container */}
            <div className="h-56 w-full bg-[#FAF8F5] relative overflow-hidden">
                <img
                    src={imageSrc}
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {discountPercent > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-[#C2410C] text-white text-[10px] font-bold shadow-sm">
                            {discountPercent}% OFF
                        </span>
                    )}
                </div>

                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-[#FED7AA] text-[10px] font-bold text-[#C2410C] flex items-center gap-1 shadow-sm">
                    <ShieldCheck size={11} /> 100% Certified
                </div>

                {/* Ruling Planet / Power Ribbon */}
                {product.rulingPlanet && (
                    <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] text-amber-200 font-medium flex items-center justify-between border border-white/10">
                        <span>🪐 {product.rulingPlanet}</span>
                        {product.carat && <span className="font-bold text-white">{product.carat}</span>}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                    <h3 className="text-sm sm:text-base font-serif font-bold text-[#1C1917] group-hover:text-[#C2410C] transition-colors line-clamp-1">
                        {product.name}
                    </h3>

                    {product.power && (
                        <p className="text-[11px] text-[#C2410C] font-semibold mt-1 flex items-center gap-1">
                            <Sparkles size={11} /> {product.power}
                        </p>
                    )}

                    <p className="text-xs text-[#78716C] mt-1.5 line-clamp-2 leading-relaxed">
                        {product.desc || product.description}
                    </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EADCC8]">
                    {/* Price Row */}
                    <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-lg font-bold text-[#1C1917]">
                            ₹{numericPrice.toLocaleString('en-IN')}
                        </span>
                        {originalPrice > numericPrice && (
                            <span className="text-xs text-[#A8A29E] line-through">
                                ₹{originalPrice.toLocaleString('en-IN')}
                            </span>
                        )}
                    </div>

                    {/* Action Buttons Row */}
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            className="w-full py-2 px-2.5 rounded-xl bg-[#FFF7ED] hover:bg-[#FED7AA]/50 text-[#C2410C] border border-[#FED7AA] font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm cursor-pointer"
                        >
                            <Plus size={13} />
                            <span>Add</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleBuyNow}
                            className="w-full py-2 px-2.5 rounded-xl bg-gradient-to-r from-[#C2410C] to-[#EA580C] hover:from-[#9A3412] hover:to-[#C2410C] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md shadow-[#C2410C]/20 cursor-pointer"
                        >
                            <Zap size={13} />
                            <span>Buy Now</span>
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default React.memo(ProductCard);
