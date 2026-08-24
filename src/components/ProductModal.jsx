import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ShoppingBag, Sparkles, ShieldCheck, Zap, Plus, Minus, CheckCircle2, Truck } from 'lucide-react';
import { API_URL } from '../config';
import { useCart } from '../context/CartContext';

const ProductModal = ({ isOpen, onClose, product }) => {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedCarat, setSelectedCarat] = useState(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setQuantity(1);
            if (product?.carat) setSelectedCarat(product.carat);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, product]);

    if (!isOpen || !product) return null;

    const rawImage = product.image;
    const imageSrc = rawImage && rawImage.startsWith('/public') ? `${API_URL}${rawImage}` : rawImage;
    const originalPrice = product.originalPrice || Math.round(product.price * 1.25);
    const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

    const handleAddToCart = () => {
        addToCart(product, quantity, selectedCarat);
        onClose();
    };

    const handleBuyNow = () => {
        addToCart(product, quantity, selectedCarat);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-[#1C1917]/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className="relative bg-[#FAF8F5] border border-[#EADCC8] w-full max-w-3xl max-h-[92vh] rounded-3xl overflow-hidden shadow-luxury-hover flex flex-col md:flex-row z-10"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 border border-[#EADCC8] flex items-center justify-center text-[#78716C] hover:text-[#C2410C] transition-colors shadow-sm"
                >
                    <X size={16} />
                </button>

                {/* Left: Image */}
                <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-[#F5F0E8] flex items-center justify-center overflow-hidden">
                    {imageSrc && (imageSrc.startsWith('http') || imageSrc.startsWith('/')) ? (
                        <img src={imageSrc} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#FFF7ED] to-[#FAF8F5] flex items-center justify-center">
                            <Sparkles className="text-[#C2410C] w-16 h-16" />
                        </div>
                    )}

                    {discountPercent > 0 && (
                        <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-[#C2410C] text-white text-[11px] font-bold shadow-md">
                            {discountPercent}% OFF
                        </div>
                    )}
                </div>

                {/* Right: Details */}
                <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#FFF7ED] border border-[#FED7AA] text-[10px] font-bold uppercase text-[#C2410C]">
                                <ShieldCheck size={12} /> 100% Certified Natural
                            </span>
                            {product.rulingPlanet && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[10px] font-bold text-[#B45309]">
                                    🪐 {product.rulingPlanet}
                                </span>
                            )}
                        </div>

                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1917] leading-snug">
                            {product.name}
                        </h2>

                        {/* Pricing */}
                        <div className="flex items-baseline gap-2.5">
                            <span className="text-2xl font-serif font-bold text-[#C2410C]">
                                ₹{(product.price * quantity).toLocaleString('en-IN')}
                            </span>
                            {originalPrice > product.price && (
                                <span className="text-sm text-[#A8A29E] line-through font-mono">
                                    ₹{(originalPrice * quantity).toLocaleString('en-IN')}
                                </span>
                            )}
                        </div>

                        {product.power && (
                            <p className="text-xs font-semibold text-[#B45309] bg-[#FFFBEB] p-2 rounded-xl border border-[#FDE68A]">
                                ✦ Astrological Power: {product.power}
                            </p>
                        )}

                        <p className="text-xs text-[#44403C] leading-relaxed">
                            {product.desc || product.description}
                        </p>

                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-3 pt-2 border-t border-[#EADCC8]">
                            <span className="text-xs font-bold text-[#44403C] uppercase">Quantity:</span>
                            <div className="flex items-center border border-[#EADCC8] rounded-xl bg-white shadow-sm">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-2 text-[#44403C] hover:text-[#C2410C] transition-colors"
                                >
                                    <Minus size={12} />
                                </button>
                                <span className="px-3 text-xs font-bold text-[#1C1917]">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="p-2 text-[#44403C] hover:text-[#C2410C] transition-colors"
                                >
                                    <Plus size={12} />
                                </button>
                            </div>
                        </div>

                        {/* Trust Bullets */}
                        <div className="space-y-1 text-[11px] text-[#78716C] pt-2 border-t border-[#EADCC8]">
                            <p className="flex items-center gap-1.5">
                                <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                                <span>Government Lab Certification Included</span>
                            </p>
                            <p className="flex items-center gap-1.5">
                                <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                                <span>Individualized Prana Pratishtha Consecration</span>
                            </p>
                            <p className="flex items-center gap-1.5">
                                <Truck size={12} className="text-emerald-600 shrink-0" />
                                <span>Free Insured Express Courier across India</span>
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-6 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            className="py-3 rounded-xl text-xs font-bold text-[#C2410C] bg-[#FFF7ED] border border-[#FED7AA] hover:bg-[#FED7AA]/50 shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                            <ShoppingBag size={14} />
                            <span>Add to Cart</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleBuyNow}
                            className="py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#C2410C] to-[#EA580C] hover:from-[#9A3412] hover:to-[#C2410C] shadow-md shadow-[#C2410C]/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                            <Zap size={14} />
                            <span>Buy with Razorpay</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default React.memo(ProductModal);
