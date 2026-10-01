import React from 'react';
import { motion } from 'framer-motion';
import { Star, ExternalLink, Quote } from 'lucide-react';
import { LotusCrest } from './VedicDecorativeArt';

const ReviewsSection = () => {
    const reviews = [
        {
            id: 1,
            name: "Pradip Pawar",
            rating: 5,
            text: "गुरुजी तुम्ही जे मला मार्गदर्शन केलं ते व्यवस्थित संपूर्णपणे खरं सांगितलं आहे त्यामुळे मी तुमचा आणि तुमच्या समुपदेशन केंद्राचा आभारी आहे. येथून पुढे जे बी मार्गदर्शन लागेल ते मी तुमच्याकडूनच घेईन कारण तुम्ही पूर्णपणे मला सहकार्य केलं आहे खूप खूप आभारी आहे गुरुजी.",
            date: "Verified Devotee"
        },
        {
            id: 2,
            name: "Aarti Patankar",
            rating: 5,
            text: "I had a wonderful experience with this astrology consultation. The Kundli matching predictions were accurate, guidance was practical, and the suggested remedies were truly helpful. Highly recommended for everyone seeking authentic Vedic advice!",
            date: "Verified Devotee"
        },
        {
            id: 3,
            name: "Narayan Boga",
            rating: 5,
            text: "गुरूजी आपण कुंडली पाहून जे सल्ला दिला ते तंतोतंत खरे ठरले. आपल्या सारखे गुरूजी मला लाभले हे मी माझे भाग्य समजतो. आपले सहवास सदा लाभावे हीच स्वामी चरणी प्रार्थना.",
            date: "Verified Devotee"
        }
    ];

    return (
        <section className="py-24 bg-[#FAF8F5] border-t border-[#EADCC8] relative overflow-hidden">
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
                            Devotee Experiences
                        </span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#1C1917]">
                        Trusted by <span className="bg-gradient-to-r from-[#C2410C] to-[#D97706] bg-clip-text text-transparent">Thousands of Families</span>
                    </h2>

                    <div className="flex justify-center items-center gap-2 pt-1">
                        <span className="text-sm font-bold text-[#1C1917]">4.9 / 5.0 Rating</span>
                        <div className="flex text-[#D97706]">
                            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                        </div>
                        <span className="text-xs text-[#78716C] font-medium">(Google & Justdial Reviews)</span>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review, i) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-8 rounded-3xl border border-[#EADCC8] shadow-luxury hover:shadow-luxury-hover transition-all relative flex flex-col justify-between"
                        >
                            <div>
                                <Quote className="w-8 h-8 text-[#FED7AA] mb-4" />
                                
                                <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed mb-6 italic">
                                    "{review.text}"
                                </p>
                            </div>

                            <div className="pt-4 border-t border-[#EADCC8]/80 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white font-bold flex items-center justify-center text-sm shadow-sm">
                                    {review.name[0]}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-[#1C1917]">{review.name}</h4>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="flex text-[#D97706]">
                                            {[...Array(review.rating)].map((_, idx) => <Star key={idx} size={11} fill="currentColor" />)}
                                        </div>
                                        <span className="text-[10px] text-[#78716C] font-medium">• {review.date}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <a
                        href="https://jsdl.in/DT-9979FYHCSEX"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C2410C] hover:underline"
                    >
                        <span>Read all verified reviews on Google & Justdial</span>
                        <ExternalLink size={13} />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default React.memo(ReviewsSection);
