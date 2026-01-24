import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const ReviewsSection = () => {
    // Mock reviews - in production, replace with Google Places API fetch
    const reviews = [
        {
            id: 1,
            name: "Pradip Pawar",
            rating: 5,
            text: "गुरुजी तुम्ही जे मला मार्गदर्शन केलं ते व्यवस्थित संपूर्णपणे खरं सांगितलं आहे त्यामुळे मी तुमचा आणि तुमच्या समुपदेशन केंद्राचा आभारी आहे येथून पुढे जे बी मार्गदर्शन लागेल ते मी तुमच्याकडूनच घेईन कारण तुम्ही पूर्णपणे मला सहकार्य केलं आहे खूप खूप आभारी आहे गुरुजी",
            date: "5 months ago"
        },
        {
            id: 2,
            name: "AARTI PATANKAR",
            rating: 5,
            text: "I had a wonderful experience with this astrology consultation. The predictions were accurate, guidance was practical, and remedies were truly helpful. Highly recommended!",
            date: "4 months ago"
        },
        {
            id: 3,
            name: "Narayan Boga",
            rating: 5,
            text: "गुरूजी आपण कुंडली पाहून जे सल्ला दिला ते तंतोतंत खरे ठरले, आपल्या सारखे गुरूजी मला लाभले हे मी माझे भाग्य समजतो. आपले सहवास सदा लाभावे",
            date: "4 months ago"
        }
    ];

    return (
        <section className="py-24 bg-black relative">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
                        Client <span className="text-secondary">Testimonials</span>
                    </h2>
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <span className="text-white/80">Rated 5.0</span>
                        <div className="flex text-secondary">
                            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                        </div>
                        <span className="text-white/50 text-sm">(based on Google Reviews)</span>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review, i) => (
                        <motion.a
                            href="https://www.google.com/maps/place/Shriram+samupdeshan+kendra+श्रीराम+समुपदेशन+केंद्र/@17.6836066,75.9320703,17z/data=!4m18!1m9!3m8!1s0x3bc5db359697c557:0x8c60245fc2d2824e!2zU2hyaXJhbSBzYW11cGRlc2hhbiBrZW5kcmEg4KS24KWN4KSw4KWA4KSw4KS-4KSuIOCkuOCkruClgeCkquCkpuClh-CktuCkqCDgpJXgpYfgpILgpKbgpY3gpLA!8m2!3d17.6836066!4d75.9346452!9m1!1b1!16s%2Fg%2F11xtwwddmq!3m7!1s0x3bc5db359697c557:0x8c60245fc2d2824e!8m2!3d17.6836066!4d75.9346452!9m1!1b1!16s%2Fg%2F11xtwwddmq?hl=en-IN&entry=ttu&g_ep=EgoyMDI2MDExMy4wIKXMDSoASAFQAw%3D%3D"
                            target="_blank"
                            rel="noopener noreferrer"
                            key={review.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/5 p-8 rounded-2xl border border-white/10 relative block hover:bg-white/10 transition-colors cursor-pointer group"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-black font-bold">
                                    {review.name[0]}
                                </div>
                                <div>
                                    <h4 className="text-white font-bold group-hover:text-secondary transition-colors">{review.name}</h4>
                                    <div className="flex text-secondary text-xs">
                                        {[...Array(review.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                                    </div>
                                </div>
                                <span className="ml-auto text-white/30 text-xs">{review.date}</span>
                            </div>
                            <p className="text-white/70 text-sm leading-relaxed">"{review.text}"</p>
                        </motion.a>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <a
                        href="https://www.google.com/search?client=safari&hs=ToAp&sca_esv=5c76aafb4d698346&rls=en&biw=1440&bih=820&aic=0&sxsrf=ANbL-n7zeKoaDVGwooChPg6Bfg8jtu3Blg:1768543051422&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOXAiL5YrX8tZgF1uNs2pp2xXxCMyQyEGCLegQ1Tdnwbxfd4a2NYPku41ApnIXUoIAMN6h4iAH7XC9sXCfdudthIRLHukA297vZ8RmQYDdmscn3dmcGT89nOGHpiRD3W56i9qpp5OQkgsOOzv6fnspaQTQlIhCo8MRe6jq4I6nVWbnvVkY1H991iHRuKz6KtuXdH9jsc%3D&q=Shriram+samupdeshan+kendra+श्रीराम+समुपदेशन+केंद्र+Reviews&sa=X&ved=2ahUKEwifi-aisI-SAxWRbPUHHd4LElcQ0bkNegQIHxAF"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-secondary hover:text-white transition-colors border-b border-secondary hover:border-white pb-1"
                    >
                        Read more reviews on Google
                    </a>
                </div>
            </div>
        </section>
    );
};

export default ReviewsSection;
