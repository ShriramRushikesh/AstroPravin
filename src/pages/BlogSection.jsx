import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, User, Clock, BookOpen, Search, Sparkles, ArrowRight } from 'lucide-react';
import { API_URL } from '../config';
import { staticBlogPosts } from '../data/blogData';
import SEO from '../components/SEO';
import BookingModal from '../components/BookingModal';
import { MandalaWatermark, LotusCrest } from '../components/VedicDecorativeArt';

const BlogSection = () => {
    const [posts, setPosts] = useState(staticBlogPosts);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await fetch(`${API_URL}/api/blogs`);
                if (res.ok) {
                    const apiPosts = await res.json();
                    if (Array.isArray(apiPosts) && apiPosts.length > 0) {
                        const existingSlugs = new Set(apiPosts.map(p => p.slug));
                        const filteredStatic = staticBlogPosts.filter(p => !existingSlugs.has(p.slug));
                        setPosts([...apiPosts, ...filteredStatic]);
                    }
                }
            } catch (error) {
                // Fallback kept
            }
        };
        fetchBlogs();
    }, []);

    const seoData = {
        title: 'Vedic Astrology Blog & Guides | Kundli, Vastu, Gemology & Remedies - Astro Pravin',
        description: 'Explore comprehensive Vedic astrology articles by Pandit Pravin Shriram. In-depth guides on Kundli Milan, planetary transits, Vastu Shastra, Gemstones, and Sade Sati remedies.',
        keywords: 'astrology blog, vedic astrology articles, kundli matching guide, vastu tips home, gemstone wearing rules, numerology destiny numbers, sade sati remedies, shani transit, mangal dosha facts',
    };

    const categories = [
        { id: 'all', label: 'All Guides' },
        { id: 'Astrology', label: 'Kundli & Astrology' },
        { id: 'Vastu', label: 'Vastu Shastra' },
        { id: 'Gemstones', label: 'Gemstones (Ratna)' },
        { id: 'Numerology', label: 'Vedic Numerology' },
        { id: 'Remedies', label: 'Vedic Remedies' }
    ];

    const filteredPosts = posts.filter(post => {
        const matchesCat = filter === 'all' || (post.category && post.category.toLowerCase().includes(filter.toLowerCase()));
        const matchesSearch = searchTerm === '' ||
            post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCat && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#FAF8F5] pt-28 pb-24 px-4 sm:px-6 relative overflow-hidden font-sans">
            <SEO {...seoData} />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF7ED] border border-[#FED7AA]">
                        <LotusCrest className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
                            Vedic Jnana & Wisdom
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#1C1917]">
                        Authentic Vedic Astrology <span className="bg-gradient-to-r from-[#C2410C] to-[#D97706] bg-clip-text text-transparent">Articles & Guides</span>
                    </h1>

                    <p className="text-sm text-[#78716C] leading-relaxed">
                        Authored by Pandit Pravin Shriram. Deep dives into Kundli Milan, Navamsha chart readings, Vastu Shastra rules, and remedial gemstone recommendations.
                    </p>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 bg-white p-4 rounded-2xl border border-[#EADCC8] shadow-sm">
                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setFilter(cat.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    filter === cat.id
                                        ? 'bg-[#C2410C] text-white shadow-sm'
                                        : 'bg-[#F5F0E8] text-[#44403C] hover:bg-[#EADCC8]'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search size={14} className="absolute left-3.5 top-3 text-[#78716C]" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search Vedic articles..."
                            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#EADCC8] text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C2410C]"
                        />
                    </div>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {filteredPosts.map((post, idx) => (
                        <motion.div
                            key={post.slug || post._id || idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white rounded-3xl overflow-hidden border border-[#EADCC8] shadow-luxury hover:shadow-luxury-hover transition-all flex flex-col justify-between group"
                        >
                            <div>
                                <div className="relative aspect-[16/9] overflow-hidden bg-[#FAF8F5]">
                                    {post.image ? (
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            loading="lazy"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = 'https://images.unsplash.com/photo-1532012164546-f432f2e3ef54?q=80&w=800&auto=format&fit=crop';
                                            }}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-[#FFF7ED] to-[#FAF8F5] flex items-center justify-center">
                                            <BookOpen className="w-12 h-12 text-[#C2410C]" />
                                        </div>
                                    )}

                                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-[#FED7AA] text-[10px] font-bold text-[#C2410C]">
                                        {post.category || 'Vedic Shastra'}
                                    </div>
                                </div>

                                <div className="p-6 space-y-2.5">
                                    <div className="flex items-center gap-3 text-[11px] text-[#78716C]">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} /> {post.date || 'Vedic Archive'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} /> {post.readTime || '5 min read'}
                                        </span>
                                    </div>

                                    <h2 className="text-lg font-serif font-bold text-[#1C1917] group-hover:text-[#C2410C] transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>

                                    <p className="text-xs sm:text-sm text-[#44403C] line-clamp-3 leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 pt-0 border-t border-[#EADCC8]/60 mt-4">
                                <Link
                                    to={`/blog/${post.slug}`}
                                    className="inline-flex items-center gap-1 text-xs font-bold text-[#C2410C] hover:underline"
                                >
                                    <span>Read Full Guide</span>
                                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
        </div>
    );
};

export default React.memo(BlogSection);
