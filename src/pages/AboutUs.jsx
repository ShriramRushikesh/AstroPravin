import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Award, Shield, CheckCircle2, MapPin, Phone, Calendar, Heart, BookOpen, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import BookingModal from '../components/BookingModal';

const AboutUs = () => {
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    const pillars = [
        {
            icon: <Award className="text-secondary" size={28} />,
            title: "25+ Years Experience",
            desc: "Over two decades of dedicated study, classical chart interpretation, and counseling helping individuals navigate life transitions."
        },
        {
            icon: <Shield className="text-secondary" size={28} />,
            title: "Strict Date Panchang",
            desc: "All calculations and remedial rituals adhere strictly to authentic astronomical panchang and auspicious planetary horas."
        },
        {
            icon: <Heart className="text-secondary" size={28} />,
            title: "Empathetic Counseling",
            desc: "We practice fear-free, constructive astrology focusing on positive psychological empowerment and practical life remedies."
        },
        {
            icon: <Sparkles className="text-secondary" size={28} />,
            title: "Authentic Remedies",
            desc: "Recommendations focus on pure gemstones, Vedic mantras, positive lifestyle alignment, and sacred Pooja rituals."
        }
    ];

    const milestones = [
        { year: "1999", title: "Foundation of Practice", desc: "Commenced Vedic astrology research and personal counseling rooted in Solapur." },
        { year: "2008", title: "Shriram Samupdeshan Kendra", desc: "Established the permanent counseling center in Solapur for horoscope & Vastu consultancy." },
        { year: "2018", title: "Global Consultations", desc: "Expanded consultations to NRI clients across the US, UK, Gulf, and Europe via digital platforms." },
        { year: "2024+", title: "Digital AstroPravin", desc: "Launched modern digital Vedic calculators, educational insights, and Matrimony compatibility systems." }
    ];

    const seoData = {
        title: "About Pandit Pravin Shriram | Best Astrologer in Solapur (25+ Yrs Exp)",
        description: "Learn about Pandit Pravin Shriram, founder of Shriram Samupdeshan Kendra. Over 25 years of mastery in Vedic Astrology, Kundli Matching, Vastu Shastra, and Gemology.",
        keywords: "Pandit Pravin Shriram, best astrologer in Solapur, Shriram Samupdeshan Kendra, Vedic astrologer Maharashtra, authentic kundli reading, vastu consultant Solapur",
        schema: {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "mainEntity": {
                "@type": "Person",
                "name": "Pandit Pravin Shriram",
                "jobTitle": "Senior Vedic Astrologer & Vastu Consultant",
                "worksFor": {
                    "@type": "Organization",
                    "name": "Shriram Samupdeshan Kendra - Astro Pravin",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "Shop no.2,3, S.S Icon shopping complex, Gharkul road",
                        "addressLocality": "Solapur",
                        "addressRegion": "Maharashtra",
                        "postalCode": "413006",
                        "addressCountry": "IN"
                    }
                },
                "image": "https://astropravin.com/pravin-shriram.png",
                "description": "Renowned Vedic Astrologer, Numerologist, and Vastu Shastra consultant with over 25 years of experience."
            }
        }
    };

    return (
        <div className="min-h-screen bg-void text-white pt-28 pb-20 px-6 font-sans">
            <SEO {...seoData} />

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-secondary uppercase tracking-[0.3em] text-xs font-semibold">Our Heritage & Mission</span>
                    <h1 className="text-4xl md:text-6xl font-serif text-white mt-3 mb-6 leading-tight">
                        Bridging Ancient Cosmic Wisdom with Modern Clarity
                    </h1>
                    <p className="text-white/70 text-lg leading-relaxed">
                        Welcome to <strong className="text-white">Astro Pravin</strong>, the online home of <strong className="text-white">Shriram Samupdeshan Kendra</strong>. For over 25 years, our mission has been to provide authentic, transparent, and transformative Vedic guidance to help you make informed decisions in life, love, career, and spiritual growth.
                    </p>
                </div>

                {/* Founder Feature Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24 bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12">
                    <div className="lg:col-span-5 relative">
                        <div className="relative z-10 rounded-2xl overflow-hidden border-2 border-secondary/40 shadow-[0_0_40px_rgba(255,215,0,0.15)] max-w-md mx-auto">
                            <img
                                src="/pravin-shriram.png"
                                alt="Pandit Pravin Shriram - Vedic Astrologer Solapur"
                                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        <div className="absolute -bottom-4 -right-2 bg-gradient-to-br from-amber-400 to-amber-600 text-black px-6 py-3 rounded-2xl font-bold shadow-xl flex items-center gap-2">
                            <Star size={18} fill="currentColor" />
                            <span>25+ Years Mastery</span>
                        </div>
                    </div>

                    <div className="lg:col-span-7 space-y-6">
                        <div className="flex items-center gap-2 text-secondary text-sm font-semibold uppercase tracking-wider">
                            <BookOpen size={18} />
                            <span>Meet the Astrologer</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif text-white leading-snug">
                            Pandit Pravin Shriram
                        </h2>
                        <p className="text-white/80 leading-relaxed text-base">
                            Pandit Pravin Shriram is a distinguished Vedic scholar, astrologer, and Vastu consultant based in Solapur, Maharashtra. Guided by deep reverence for classical scriptures such as <em>Brihat Parashara Hora Shastra</em>, <em>Jataka Parijata</em>, and <em>Muhurta Chintamani</em>, he has spent over two decades interpreting horoscopes with precision and psychological insight.
                        </p>
                        <p className="text-white/80 leading-relaxed text-base">
                            Unlike fatalistic approaches that inspire fear, Pandit ji emphasizes the power of conscious decision-making (<em>Purushartha</em>) combined with accurate cosmic timing. His consultations blend rigorous mathematical calculations with compassionate listening, making complex planetary cycles understandable and actionable.
                        </p>

                        <div className="pt-4 flex flex-wrap gap-4">
                            <button
                                onClick={() => setIsBookingOpen(true)}
                                className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold rounded-xl text-sm hover:brightness-110 transition-all shadow-lg"
                            >
                                Book Personal Consultation
                            </button>
                            <Link
                                to="/blogs"
                                className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-sm transition-all border border-white/10"
                            >
                                Read Vedic Insights
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 4 Pillars of Excellence */}
                <div className="mb-24">
                    <div className="text-center mb-12">
                        <span className="text-secondary text-xs uppercase tracking-widest font-semibold">Our Principles</span>
                        <h2 className="text-3xl md:text-4xl font-serif text-white mt-2">Why Families Trust Astro Pravin</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {pillars.map((p, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-secondary/30 transition-all flex flex-col"
                            >
                                <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-xl w-fit mb-4">
                                    {p.icon}
                                </div>
                                <h3 className="text-xl font-serif text-white mb-2">{p.title}</h3>
                                <p className="text-white/60 text-sm leading-relaxed flex-1">{p.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Timeline & Heritage */}
                <div className="mb-24 bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12">
                    <div className="text-center mb-12">
                        <span className="text-secondary text-xs uppercase tracking-widest font-semibold">Our Journey</span>
                        <h2 className="text-3xl md:text-4xl font-serif text-white mt-2">Two Decades of Service</h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {milestones.map((m, idx) => (
                            <div key={idx} className="relative border-l-2 border-secondary/30 pl-6 space-y-2">
                                <span className="text-secondary font-serif text-2xl font-bold">{m.year}</span>
                                <h4 className="text-white font-semibold text-lg">{m.title}</h4>
                                <p className="text-white/60 text-sm leading-relaxed">{m.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Physical Center Details */}
                <div className="bg-gradient-to-r from-amber-500/10 via-purple-900/20 to-black border border-white/10 rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto space-y-6">
                    <h3 className="text-2xl md:text-3xl font-serif text-white">Visit Our Physical Center in Solapur</h3>
                    <p className="text-white/70 max-w-xl mx-auto text-sm leading-relaxed">
                        We welcome you to visit our consultation office for personal horoscope analysis, Vastu blueprint reviews, and authentic gemstone verification.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-white/80 pt-2">
                        <span className="flex items-center gap-2">
                            <MapPin size={16} className="text-secondary" /> Shop 2, 3, S.S Icon Complex, Gharkul Road, Solapur
                        </span>
                        <span className="flex items-center gap-2">
                            <Phone size={16} className="text-secondary" /> +91 99216 97908
                        </span>
                    </div>
                    <div className="pt-4">
                        <Link
                            to="/contact"
                            className="inline-block px-8 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold rounded-full text-sm shadow-xl hover:scale-105 transition-all"
                        >
                            Get In Touch With Us
                        </Link>
                    </div>
                </div>
            </div>

            <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
        </div>
    );
};

export default AboutUs;
