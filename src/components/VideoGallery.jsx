import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';
import SEO from './SEO';

const VideoGallery = () => {
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const apiUrl = API_URL;
                const res = await fetch(`${apiUrl}/api/videos`);
                if (res.ok) {
                    setVideos(await res.json());
                }
            } catch (error) {
                console.error('Failed to fetch videos', error);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, []);

    // Video Object Schema for SEO
    const schema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": videos.map((v, i) => ({
            "@type": "VideoObject",
            "position": i + 1,
            "name": v.title,
            "description": v.desc,
            "thumbnailUrl": `https://img.youtube.com/vi/${v.ytId}/hqdefault.jpg`,
            "uploadDate": v.date || "2024-01-01",
            "contentUrl": `https://www.youtube.com/watch?v=${v.ytId}`
        }))
    };

    return (
        <section className="relative py-24 bg-void overflow-hidden">
            <SEO
                title="Astrology Videos & Remedies (Upay) - Astro Pravin"
                description="Watch simple remedies (Upay) for money, marriage, and health problems. Daily horoscope (Rashi Bhavishya) and planetary changes explained in simple language."
                keywords="Astrology Videos, Upay, Totke, Remedies, Rashi Bhavishya, Grah Gochar, Planetary Transit, Solapur Astrologer Video, Marathi Astrology, Daily Horoscope"
                schema={schema}
            />

            {/* Background Decor */}
            <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-red-900/10 blur-[150px] rounded-full pointer-events-none -translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-saffron tracking-[0.3em] uppercase text-sm font-semibold">Free Wisdom</span>
                    <h2 className="text-4xl md:text-5xl font-serif text-white mt-2 mb-6">Latest Vedic Insights</h2>
                    <p className="text-white/60 max-w-2xl mx-auto">
                        Watch our latest videos on planetary transits, remedies, and astrological predictions to transform your life.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {videos.map((video, index) => (
                        <motion.div
                            key={video._id || index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group cursor-pointer"
                            onClick={() => setSelectedVideo(video)}
                        >
                            {/* Thumbnail Wrapper */}
                            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group-hover:border-saffron/50 transition-colors shadow-2xl">
                                <img
                                    src={`https://img.youtube.com/vi/${video.ytId}/hqdefault.jpg`}
                                    alt={video.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                                        <Play className="fill-white text-white ml-1" />
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="mt-4">
                                <h3 className="text-xl font-serif text-white group-hover:text-gold transition-colors line-clamp-2">{video.title}</h3>
                                <p className="text-white/50 text-sm mt-2 line-clamp-2">{video.desc}</p>
                                <div className="flex items-center gap-4 mt-3 text-xs text-white/30 uppercase tracking-wider">
                                    <span>{video.views} Views</span>
                                    <span>•</span>
                                    <span>{video.date}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-lg flex items-center justify-center p-4"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-white/10 rounded-full text-white transition-colors"
                            >
                                <X />
                            </button>
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${selectedVideo.ytId}?autoplay=1`}
                                title={selectedVideo.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default VideoGallery;
