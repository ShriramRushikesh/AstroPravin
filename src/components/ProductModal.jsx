import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ShoppingBag, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { LotusCrest } from './VedicDecorativeArt';
import { API_URL } from '../config';

const ProductModal = ({ isOpen, onClose, product }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !product) return null;

    const rawImage = product.image;
    const imageSrc = rawImage && rawImage.startsWith('/public') ? `${API_URL}${rawImage}` : rawImage;

    const handleWhatsAppEnquiry = () => {
        const msg = `*New Order Enquiry* 🛍️\n\n*Product:* ${product.name}\n*Price:* ₹${product.price?.toLocaleString('en-IN')}\n*Category:* ${product.category || 'Vedic Artifact'}\n\n*Namaste Pandit Pravin Ji,*\nI want to order this energized spiritual product. Please guide me with payment and delivery details.\n🙏`;
        window.open(`https://wa.me/919921697908?text=${encodeURIComponent(msg)}`, '_blank');
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
                className="relative bg-[#FAF8F5] border border-[#EADCC8] w-full max-w-3xl max-h-[90vh] rounded-3xl overflow-hidden shadow-luxury-hover flex flex-col md:flex-row z-10"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white border border-[#EADCC8] flex items-center justify-center text-[#78716C] hover:text-[#C2410C] transition-colors shadow-sm"
                >
                    <X size={16} />
                </button>

                {/* Left: Image */}
                <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-[#F5F0E8] flex items-center justify-center">
                    {imageSrc && (imageSrc.startsWith('http') || imageSrc.startsWith('/')) ? (
                        <img src={imageSrc} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#FFF7ED] to-[#FAF8F5] flex items-center justify-center">
                            <Sparkles className="text-[#C2410C] w-16 h-16" />
                        </div>
                    )}
                </div>


                {/* Right: Details */}
                <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FFF7ED] border border-[#FED7AA] text-[10px] font-bold uppercase text-[#C2410C]">
                            <ShieldCheck size={12} /> Certified & Consecrated
                        </div>

                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1917]">
                            {product.name}
                        </h2>

                        <div className="text-2xl font-serif font-bold text-[#C2410C]">
                            ₹{typeof product.price === 'number' ? product.price.toLocaleString('en-IN') : product.price}
                        </div>

                        {product.power && (
                            <p className="text-xs font-semibold text-[#B45309]">
                                ✦ Astrological Power: {product.power}
                            </p>
                        )}

                        <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed">
                            {product.desc || product.description}
                        </p>

                        <div className="space-y-1.5 text-xs text-[#78716C] pt-2 border-t border-[#EADCC8]">
                            <p>• 100% Original & Certified Natural</p>
                            <p>• Consecrated with Vedic Vedic Mantras</p>
                            <p>• Dispatched in Secured Tamper-Proof Packaging</p>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            onClick={handleWhatsAppEnquiry}
                            className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#D97706] shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <ShoppingBag size={15} />
                            Order Instantly on WhatsApp
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default React.memo(ProductModal);
