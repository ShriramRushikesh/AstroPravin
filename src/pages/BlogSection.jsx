import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, User, Clock, BookOpen, Search, Sparkles } from 'lucide-react';
import { API_URL } from '../config';
import { staticBlogPosts } from '../data/blogData';
import SEO from '../components/SEO';
import BookingModal from '../components/BookingModal';
import AdSenseUnit from '../components/AdSenseUnit';

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
                        // Merge without duplicate slugs
                        const existingSlugs = new Set(apiPosts.map(p => p.slug));
                        const filteredStatic = staticBlogPosts.filter(p => !existingSlugs.has(p.slug));
                        setPosts([...apiPosts, ...filteredStatic]);
                    }
                }
            } catch (error) {
                // Silently fallback to static rich posts — guarantees high value content is always rendered
                console.debug('Blog fetch fallback active');
            }
        };
        fetchBlogs();
    }, []);

    // SEO Data
    const seoData = {
        title: 'Vedic Astrology Blog & Guides | Kundli, Vastu, Gemology & Remedies - Astro Pravin',
        description: 'Explore comprehensive Vedic astrology articles by Pandit Pravin Shriram. In-depth guides on Kundli Milan (Gun Milan), planetary transits, Vastu Shastra, Gemstones, and Sade Sati remedies.',
        keywords: 'astrology blog, vedic astrology articles, kundli matching guide, vastu tips home, gemstone wearing rules, numerology destiny numbers, sade sati remedies, shani transit, mangal dosha facts',
        schema: {
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Astro Pravin Vedic Wisdom Hub",
            "description": "Authentic Vedic Astrology, Vastu Shastra, and Numerology Guides",
            "publisher": {
                "@type": "Organization",
                "name": "Astro Pravin - Shriram Samupdeshan Kendra",
                "logo": "https://astropravin.com/pravin-shriram.png"
            }
        }
    };

    const categories = [
        { id: 'all', label: 'All Guides' },
        { id: 'Astrology', label: 'Kundli & Astrology' },
        { id: 'Vastu', label: 'Vastu Shastra' },
        { id: 'Gemstones', label: 'Gemstones (Ratna)' },
        { id: 'Numerology', label: 'Numerology' },
        { id: 'Remedies', label: 'Upay & Remedies' },
        { id: 'Festivals', label: 'Muhurta & Panchang' }
    ];

    const filteredPosts = posts.filter(post => {
        const matchesCategory = filter === 'all' || post.category === filter;
        const matchesSearch = searchTerm === '' ||
            post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.summary?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Helper to strip HTML tags for preview
    const stripHtml = (html) => {
        if (!html) return '';
        return html.replace(/<[^>]*>?/gm, '');
    };

    return (
        <div className="min-h-screen bg-void pt-28 pb-20 px-6 font-sans">
            <SEO {...seoData} />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <span className="text-secondary tracking-[0.3em] uppercase text-xs font-semibold flex items-center justify-center gap-2">
                        <Sparkles size={14} /> Vedic Wisdom & Knowledge Base
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif text-white mt-3 mb-6 leading-tight">
                        Astrological Insights & Guides
                    </h1>
                    <p className="text-white/70 text-lg leading-relaxed">
                        Deep dive into the ancient science of stars, planetary transits, and classical Vedic remedies curated by Pandit Pravin Shriram (25+ Years Experience).
                    </p>
                </div>

                {/* Top Compliant Ad Unit */}
                <AdSenseUnit slot="auto" format="horizontal" className="max-w-4xl mx-auto" />

                {/* Search & Category Filter Bar */}
                <div className="max-w-4xl mx-auto mb-12 space-y-6">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search topics (e.g. Kundli Milan, Sade Sati, Vastu, Gemstones, Numerology)..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-secondary transition-colors text-sm"
                        />
                    </div>

                    {/* Category Buttons */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setFilter(cat.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all border ${
                                    filter === cat.id
                                        ? 'bg-secondary/20 border-secondary text-secondary shadow-[0_0_15px_rgba(255,215,0,0.15)]'
                                        : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Blog Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post, i) => (
                            <Link to={`/blog/${post.slug}`} key={post._id || post.slug} className="group block">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-secondary/40 transition-all h-full flex flex-col hover:shadow-2xl hover:-translate-y-1"
                                >
                                    {/* Image Wrapper */}
                                    <div className="h-52 relative overflow-hidden bg-zinc-900">
                                        <img
                                            src={post.image || "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1000&auto=format&fit=crop"}
                                            alt={post.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-amber-300 border border-amber-400/30 uppercase tracking-widest font-semibold">
                                            {post.category || 'Vedic Guide'}
                                        </div>
                                    </div>

                                    {/* Content Info */}
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-4 text-xs text-white/50 mb-3">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar size={13} /> {new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock size={13} /> {post.readTime || '8 min read'}
                                                </span>
                                            </div>

                                            <h2 className="text-xl font-serif text-white mb-3 group-hover:text-secondary transition-colors leading-snug">
                                                {post.title}
                                            </h2>

                                            <p className="text-white/60 text-sm mb-6 line-clamp-3 leading-relaxed">
                                                {post.subtitle || post.summary || stripHtml(post.content).substring(0, 140) + '...'}
                                            </p>
                                        </div>

                                        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                                            <span className="text-xs text-white/50 flex items-center gap-1.5">
                                                <User size={13} className="text-secondary" /> {post.author || 'Pandit Pravin Shriram'}
                                            </span>
                                            <div className="flex items-center gap-1 text-secondary text-xs font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                                                Read Guide <ChevronRight size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-16 bg-white/5 border border-white/10 rounded-3xl">
                            <BookOpen size={48} className="mx-auto text-white/30 mb-4" />
                            <h3 className="text-xl font-serif text-white">No articles found matching "{searchTerm}"</h3>
                            <p className="text-white/60 text-sm mt-2">Try clearing your search query or selecting a different category.</p>
                            <button
                                onClick={() => { setSearchTerm(''); setFilter('all'); }}
                                className="mt-4 px-6 py-2 bg-secondary/20 border border-secondary text-secondary rounded-xl text-xs font-semibold"
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Bottom In-Feed Ad Unit */}
                <AdSenseUnit slot="auto" format="rectangle" className="max-w-3xl mx-auto" />
            </div>

            <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
        </div>
    );
};

export default BlogSection;
