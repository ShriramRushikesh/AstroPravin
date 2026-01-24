import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle } from 'lucide-react';

const AboutSection = () => {
    const qualities = [
        "25+ Years of Experience",
        "Expert in Vedic Astrology & Numerology",
        "Vastu Shastra & Psychology Consultant",
        "Authentic Pooja Services (Home & Online)",
        "Strict Adherence to Date Panchang",
        "Trusted & Perfectionist Approach"
    ];

    return (
        <section className="relative py-20 bg-void overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Image Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        {/* Decorative Rings */}
                        <div className="absolute inset-0 border-2 border-secondary/30 rounded-t-full rounded-b-[1000px] scale-110 animate-pulse-slow" />
                        <div className="absolute inset-0 border border-primary/20 rounded-t-full rounded-b-[1000px] scale-125" />

                        <div className="relative z-10 rounded-t-full rounded-b-[200px] overflow-hidden border-b-4 border-secondary shadow-[0_0_50px_rgba(255,215,0,0.2)]">
                            <img
                                src="/pravin-shriram.png"
                                alt="Pravin Shriram - Vedic Astrologer"
                                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                            />
                        </div>

                        {/* Experience Badge */}
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, type: 'spring' }}
                            className="absolute -bottom-6 -right-6 bg-gradient-to-br from-secondary to-primary p-6 rounded-full text-black shadow-lg z-20"
                        >
                            <span className="block text-3xl font-bold font-serif">25+</span>
                            <span className="block text-xs font-semibold uppercase tracking-wider">Years Exp.</span>
                        </motion.div>
                    </motion.div>

                    {/* Content Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-2 mb-4 text-secondary/80">
                            <Star size={16} fill="currentColor" />
                            <span className="uppercase tracking-widest text-sm font-semibold">Meet Your Guide</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
                            Pandit <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Pravin Shriram</span>
                        </h2>

                        <p className="text-white/70 text-lg leading-relaxed mb-6">
                            A distinguished authority in the cosmic sciences, Pravin Shriram brings over two decades of profound expertise in <strong>Vedic Astrology</strong> and <strong>Numerology</strong>. Renowned for his perfectionism and deep insight, he bridges the gap between ancient wisdom and modern psychology to offer solutions that truly resonate.
                        </p>

                        <p className="text-white/70 text-lg leading-relaxed mb-8">
                            Whether you seek clarity through a Kundli Analysis, harmony through Vastu Shastra, or spiritual peace through authentic <strong>Pooja services</strong> (available both at your home and online), Pravin ji's approach is rooted in trust and precision. He strictly adheres to the <strong>Date Panchang</strong> to ensure every ritual and remedy is performed at the most auspicious moment.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {qualities.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + (index * 0.1) }}
                                    className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5 hover:border-secondary/30 transition-colors"
                                >
                                    <CheckCircle className="text-secondary shrink-0" size={18} />
                                    <span className="text-white/90 text-sm font-medium">{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default AboutSection;
