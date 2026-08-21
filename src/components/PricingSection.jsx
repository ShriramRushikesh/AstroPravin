import React, { useEffect, useState } from 'react';
import { API_URL } from '../config';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, Calendar, HeartHandshake, Home, Star, ShieldCheck } from 'lucide-react';
import { LotusCrest } from './VedicDecorativeArt';

const defaultConsultations = [
    {
        _id: 'kundli-milan',
        name: 'Kundli Milan & Marriage Match',
        price: '1,100',
        description: 'Authentic 36 Guna Ashtakoot matching, Mangal Dosha analysis, Navamsha D9 evaluation, and compatibility remedies.',
        features: ['36 Guna Scorecard', 'Mangal Dosha Remedies', 'Nadi & Bhakoot Check', 'Direct Pandit Consultation'],
        badge: 'Most Popular'
    },
    {
        _id: 'complete-patrika',
        name: 'Complete Life & Career Horoscope',
        price: '1,500',
        description: 'Comprehensive birth chart analysis covering career trajectory, financial yogas, health indicators, and Sade Sati remedies.',
        features: ['120-Year Dasha System', 'Dhana & Raj Yoga Analysis', 'Gemstone Recommendation', 'Detailed PDF Report'],
        badge: 'Recommended'
    },
    {
        _id: 'vastu-shastra',
        name: 'Vastu Shastra Consultation',
        price: '2,500',
        description: 'Directional energy audit for residential homes, shops, offices, and factories. Non-demolition remedial remedies.',
        features: ['Directional Energy Mapping', 'Main Door & Kitchen Vastu', 'Commercial Space Audit', 'Remedial Energy Pyramids'],
        badge: 'Comprehensive'
    }
];

const PricingSection = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch(`${API_URL}/api/services`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setServices(data);
                    } else {
                        setServices(defaultConsultations);
                    }
                } else {
                    setServices(defaultConsultations);
                }
            } catch (error) {
                setServices(defaultConsultations);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    return (
        <section className="py-24 bg-[#F5F0E8]/60 border-t border-[#EADCC8] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16 space-y-3"
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF7ED] border border-[#FED7AA]">
                        <LotusCrest className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
                            Auspicious Consultations
                        </span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#1C1917]">
                        Authentic Vedic Consultation <span className="bg-gradient-to-r from-[#C2410C] to-[#D97706] bg-clip-text text-transparent">Services</span>
                    </h2>

                    <p className="text-sm sm:text-base text-[#78716C] max-w-2xl mx-auto">
                        Clear, compassionate, and confidential guidance with Pandit Pravin Shriram. Available online via WhatsApp/Phone or in-person at Solapur Kendra.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => {
                        const isPopular = service.badge === 'Most Popular' || index === 0;
                        return (
                            <motion.div
                                key={service._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`rounded-3xl p-8 transition-all relative flex flex-col justify-between ${
                                    isPopular
                                        ? 'bg-white border-2 border-[#C2410C] shadow-luxury-hover scale-[1.02]'
                                        : 'bg-white border border-[#EADCC8] shadow-luxury hover:shadow-luxury-hover'
                                }`}
                            >
                                {isPopular && (
                                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white text-[11px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-sm">
                                        ★ Most Requested
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-xl font-serif font-bold text-[#1C1917] mb-2">
                                        {service.name || service.title}
                                    </h3>
                                    
                                    <div className="flex items-baseline gap-1 mb-4">
                                        <span className="text-3xl font-serif font-bold text-[#C2410C]">
                                            ₹{typeof service.price === 'number' ? service.price.toLocaleString('en-IN') : service.price}
                                        </span>
                                        <span className="text-xs text-[#78716C]">/ consultation</span>
                                    </div>

                                    <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed mb-6">
                                        {service.description}
                                    </p>

                                    {service.features && (
                                        <div className="space-y-2.5 mb-8 border-t border-[#EADCC8] pt-4">
                                            {service.features.map((feat, fIdx) => (
                                                <div key={fIdx} className="flex items-center gap-2 text-xs text-[#44403C]">
                                                    <CheckCircle2 size={14} className="text-[#C2410C] shrink-0" />
                                                    <span>{feat}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <a
                                    href={`https://wa.me/919921697908?text=${encodeURIComponent(`Namaste Pandit Pravin, I would like to book a consultation for ${service.name || service.title}.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-full py-3.5 rounded-xl text-center text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
                                        isPopular
                                            ? 'bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white hover:from-[#9A3412] hover:to-[#C2410C]'
                                            : 'bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA] hover:bg-[#FFEDD5]'
                                    }`}
                                >
                                    <Calendar size={14} />
                                    Book via WhatsApp
                                </a>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default React.memo(PricingSection);
