import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Sparkles, Star } from 'lucide-react';

const ProductModal = ({ isOpen, onClose, product }) => {
    // Lock Body Scroll when Modal is Open
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

    const handleWhatsAppEnquiry = () => {
        const msg = `*New Order Enquiry* 🛍️\n\n*Product:* ${product.name}\n*Price:* ₹${product.price.toLocaleString()}\n*Category:* ${product.category || 'Spiritual Artifiact'}\n\n*Hello Astro Pravin Ji,*\nI am interested in buying this spiritual artifact. Please share availability and payment details. \n\n🙏`;
        const waUrl = `https://wa.me/919921697908?text=${encodeURIComponent(msg)}`;
        window.open(waUrl, '_blank');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-[#050510] border border-white/10 w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-[110] p-2 bg-black/50 hover:bg-white/10 rounded-full transition-colors text-white"
                >
                    <X size={24} />
                </button>

                {/* Left: Image Container */}
                <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-void">
                    {product.image && (product.image.startsWith('http') || product.image.startsWith('/')) ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${product.image || 'from-gray-800 to-gray-900'} flex items-center justify-center`}>
                            <Sparkles className="text-white/20" size={64} />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent md:hidden" />
                </div>

                {/* Right: Content Container */}
                <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto custom-scrollbar flex flex-col">
                    <div className="mb-2">
                        <span className="text-secondary text-xs font-bold uppercase tracking-widest bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                            {product.category || 'Energized Artifact'}
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-serif text-white mb-4 leading-tight">
                        {product.name}
                    </h2>

                    <div className="flex items-center gap-2 mb-6 text-primary">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                        </div>
                        <span className="text-xs text-white/40 uppercase tracking-tighter">Premium Vedic Tool</span>
                    </div>

                    <div className="text-2xl font-bold text-white mb-6">
                        ₹{product.price.toLocaleString()}
                    </div>

                    <div className="border-t border-white/10 pt-6 mb-8 flex-grow">
                        <h4 className="text-white/40 text-xs uppercase font-bold mb-4 tracking-widest flex items-center gap-2">
                            <Sparkles size={14} /> Description & Benefits
                        </h4>
                        <p className="text-white/80 leading-relaxed font-light whitespace-pre-wrap">
                            {product.description || product.desc}
                        </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-auto pt-6 flex flex-col gap-4">
                        <button
                            onClick={handleWhatsAppEnquiry}
                            className="w-full py-4 bg-gradient-to-r from-primary to-secondary rounded-2xl text-cosmic-blue font-bold text-lg uppercase tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,153,51,0.3)] flex items-center justify-center gap-3"
                        >
                            <ShoppingBag size={22} />
                            Enquire on WhatsApp
                        </button>
                        <p className="text-center text-[10px] text-white/30 uppercase tracking-[0.2em]">
                            Direct consultation with Astro Pravin Ji for initialization
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProductModal;
