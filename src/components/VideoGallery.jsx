import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Youtube, ExternalLink } from 'lucide-react';
import SEO from './SEO';
import { LotusCrest } from './VedicDecorativeArt';

const defaultVideos = [
    {
        _id: "vid-1",
        title: "Vedic Remedies for Navagraha Shanti (नवग्रह शांती उपाय)",
        desc: "Essential Vedic remedies and mantras to pacify planetary afflictions and bring positive energy into your life.",
        platform: "youtube",
        ytId: "dQw4w9WgXcQ",
        views: "15.4K",
        date: "Vedic Insights"
    },
    {
        _id: "vid-2",
        title: "Vastu Shastra Tips for Home Entrance & Prosperity (वास्तू नियम)",
        desc: "Crucial Vastu Shastra guidelines for your main door, pooja room, and kitchen directional energy alignment.",
        platform: "youtube",
        ytId: "dQw4w9WgXcQ",
        views: "12.8K",
        date: "Vastu Guide"
    },
    {
        _id: "vid-3",
        title: "Understanding Sade Sati & Saturn Transit (शनि साडेसाती मार्गदर्शन)",
        desc: "Demystifying Shani Sade Sati phases, common misconceptions, and authentic remedial solutions by Pandit Pravin Shriram.",
        platform: "youtube",
        ytId: "dQw4w9WgXcQ",
        views: "21.2K",
        date: "Astrology Series"
    }
];

const VideoGallery = () => {
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [videos, setVideos] = useState(defaultVideos);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await fetch(`${API_URL}/api/videos`);
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        setVideos(data);
                    }
                }
            } catch (error) {
                // Keep default
            }
        };
        fetchVideos();
    }, []);

    return (
        <section className="py-24 bg-[#FAF8F5] border-t border-[#EADCC8] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF7ED] border border-[#FED7AA]">
                        <LotusCrest className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
                            Vedic Media Satsang
                        </span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#1C1917]">
                        Video Satsang & <span className="bg-gradient-to-r from-[#C2410C] to-[#D97706] bg-clip-text text-transparent">Spiritual Discourses</span>
                    </h2>

                    <p className="text-sm text-[#78716C]">
                        Watch Pandit Pravin Shriram's authentic lectures on Kundli analysis, Vastu Shastra remedies, and Navagraha shanti.
                    </p>
                </div>

                {/* Videos Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {videos.map((vid, idx) => (
                        <motion.div
                            key={vid._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-3xl overflow-hidden border border-[#EADCC8] shadow-luxury hover:shadow-luxury-hover transition-all flex flex-col justify-between"
                        >
                            <div>
                                <div className="relative aspect-video bg-[#1C1917] flex items-center justify-center group overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/80 to-transparent z-10" />
                                    
                                    <a
                                        href="https://www.youtube.com/@PRAVINSHRIRAM-hi9zo"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="relative z-20 w-12 h-12 rounded-full bg-[#C2410C] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                                    >
                                        <Play size={20} className="ml-0.5 fill-white" />
                                    </a>
                                </div>

                                <div className="p-6 space-y-2">
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#C2410C] px-2 py-0.5 rounded bg-[#FFF7ED] border border-[#FED7AA]">
                                        {vid.date}
                                    </span>
                                    <h3 className="text-base font-serif font-bold text-[#1C1917] line-clamp-2">
                                        {vid.title}
                                    </h3>
                                    <p className="text-xs text-[#78716C] line-clamp-2 leading-relaxed">
                                        {vid.desc}
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 pt-0 border-t border-[#EADCC8]/60 mt-2">
                                <a
                                    href="https://www.youtube.com/@PRAVINSHRIRAM-hi9zo"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs font-bold text-[#C2410C] hover:underline"
                                >
                                    <Youtube size={14} />
                                    <span>Watch on YouTube</span>
                                    <ExternalLink size={12} />
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default React.memo(VideoGallery);
