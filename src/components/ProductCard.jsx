import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles, ShieldCheck } from 'lucide-react';

const ProductCard = ({ product, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            onClick={onClick}
            className="group relative bg-white border border-[#EADCC8] rounded-3xl overflow-hidden shadow-luxury hover:shadow-luxury-hover transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
            {/* Visual */}
            <div className="h-52 w-full bg-[#FAF8F5] relative overflow-hidden">
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

                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-full border border-[#FED7AA] text-[10px] font-bold text-[#C2410C] flex items-center gap-1 shadow-sm">
                    <ShieldCheck size={11} /> Certified
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                    <h3 className="text-base font-serif font-bold text-[#1C1917] group-hover:text-[#C2410C] transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                    
                    {product.power && (
                        <p className="text-xs text-[#C2410C] font-semibold mt-1">
                            ✦ {product.power}
                        </p>
                    )}

                    <p className="text-xs text-[#78716C] mt-1.5 line-clamp-2 leading-relaxed">
                        {product.desc || product.description}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#EADCC8]">
                    <span className="text-base font-serif font-bold text-[#1C1917]">
                        ₹{typeof product.price === 'number' ? product.price.toLocaleString('en-IN') : product.price}
                    </span>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            const msg = `*New Order Enquiry* 🛍️\n\n*Product:* ${product.name}\n*Price:* ₹${product.price?.toLocaleString('en-IN')}\n\n*Namaste Pandit Pravin Ji,*\nI am interested in ordering this energized spiritual artifact. Please share availability and delivery process.\n🙏`;
                            window.open(`https://wa.me/919921697908?text=${encodeURIComponent(msg)}`, '_blank');
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA] hover:bg-[#C2410C] hover:text-white transition-all text-xs font-bold shadow-sm"
                        title="Order via WhatsApp"
                    >
                        <ShoppingBag size={13} />
                        <span>Order</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default React.memo(ProductCard);
