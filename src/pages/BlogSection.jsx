import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, User } from 'lucide-react';
import SEO from '../components/SEO';
import BookingModal from '../components/BookingModal'; // Re-use modal logic if needed

const BlogSection = () => {
    const [posts, setPosts] = useState([]);
    const [filter, setFilter] = useState('all');
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const apiUrl = API_URL;
                const res = await fetch(`${apiUrl}/api/blogs`);
                if (res.ok) {
                    setPosts(await res.json());
                }
            } catch (error) {
                console.error('Failed to fetch blogs', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    // SEO Data
    const seoData = {
        title: 'Astrology Blog - Horoscopes, Love, Career & Remedies',
        description: 'Read the latest Vedic astrology insights. Daily horoscopes, love compatibility, career predictions, and powerful remedies by Astro Pravin.',
        keywords: 'astrology blog, vedic astrology articles, horoscope readings, astrology remedies, love astrology blog, career astrology tips',
        image: 'https://astropravin.com/blog-share.jpg',
        schema: {
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Astro Pravin Blog",
            "description": "Expert Vedic Astrology Articles"
        }
    };

    const categories = [
        { id: 'all', label: 'All Insights' },
        { id: 'Astrology', label: 'Astrology' },
        { id: 'Numerology', label: 'Numerology' },
        { id: 'Vastu', label: 'Vastu' },
        { id: 'Festivals', label: 'Festivals' }
    ];

    const filteredPosts = filter === 'all' ? posts : posts.filter(p => p.category === filter);

    // Helper to strip HTML tags for preview
    const stripHtml = (html) => {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    return (
        <>
            <div className="min-h-screen bg-void pt-24 pb-12 px-6">
                <SEO {...seoData} />

                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <span className="text-saffron tracking-[0.3em] uppercase text-sm font-semibold">Vedic Knowledge Base</span>
                        <h1 className="text-4xl md:text-6xl font-serif text-white mt-2 mb-6">Astro Wisdom</h1>
                        <p className="text-white/60 max-w-2xl mx-auto">
                            Deep dive into the ancient science of stars. Learn how planetary movements affect your daily life.
                        </p>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setFilter(cat.id)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${filter === cat.id
                                    ? 'bg-saffron/20 border-saffron text-saffron'
                                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Blog Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            <div className="col-span-full text-center text-white/50">Loading articles...</div>
                        ) : filteredPosts.length > 0 ? (
                            filteredPosts.map((post, i) => (
                                <Link to={`/blogs/${post.slug}`} key={post._id} className="group block">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-gold/30 transition-all h-full flex flex-col"
                                    >
                                        {/* Image Placeholder */}
                                        <div className={`h-48 relative overflow-hidden group-hover:opacity-90 transition-opacity`}>
                                            <img
                                                src={post.image || "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1000&auto=format&fit=crop"}
                                                alt={post.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white border border-white/10 uppercase tracking-widest">
                                                {post.category}
                                            </div>
                                        </div>

                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex items-center gap-4 text-xs text-white/40 mb-3">
                                                <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.createdAt).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-1"><User size={12} /> {post.author || 'Astro Pravin'}</span>
                                            </div>
                                            <h2 className="text-xl font-serif text-white mb-3 group-hover:text-gold transition-colors leading-tight line-clamp-2">
                                                {post.title}
                                            </h2>
                                            <p className="text-white/60 text-sm mb-6 flex-1 line-clamp-3">
                                                {post.subtitle || stripHtml(post.content).substring(0, 100) + '...'}
                                            </p>
                                            <div className="flex items-center text-saffron text-sm font-bold tracking-wide uppercase group-hover:translate-x-2 transition-transform">
                                                Read Article <ChevronRight size={16} />
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-white/50 py-12">
                                No articles found. Check back soon for cosmic wisdom!
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
        </>
    );
};

export default BlogSection;
