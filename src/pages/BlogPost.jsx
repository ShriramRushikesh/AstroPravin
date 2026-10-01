import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Share2, HelpCircle, Sparkles, CheckCircle2, Bookmark, ChevronRight } from 'lucide-react';
import { API_URL } from '../config';
import { staticBlogPosts } from '../data/blogData';
import BookingModal from '../components/BookingModal';
import SEO from '../components/SEO';
import { LotusCrest } from '../components/VedicDecorativeArt';

const BlogPost = () => {
    const { slug } = useParams();
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchBlog = async () => {
            const staticMatch = staticBlogPosts.find(p => p.slug === slug);
            if (staticMatch) {
                setPost(staticMatch);
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${API_URL}/api/blogs/${slug}`);
                if (res.ok) {
                    setPost(await res.json());
                } else {
                    setPost(null);
                }
            } catch (error) {
                setPost(null);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [slug]);

    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-[#78716C] font-sans">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-[#C2410C] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs">Loading Vedic Guide...</span>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center text-[#1C1917] px-4 font-sans text-center">
                <h1 className="text-3xl font-serif font-bold mb-3">Vedic Guide Not Found</h1>
                <p className="text-[#78716C] mb-6 max-w-md">The astrological guide you are looking for may have been updated or moved.</p>
                <Link to="/blogs" className="px-6 py-3 bg-[#FFF7ED] border border-[#FED7AA] text-[#C2410C] rounded-xl font-bold text-sm">
                    ← Explore All Vedic Guides
                </Link>
            </div>
        );
    }

    const stripHtml = (html) => {
        if (!html) return '';
        return html.replace(/<[^>]*>?/gm, '');
    };

    const relatedPosts = staticBlogPosts
        .filter(p => p.slug !== post.slug)
        .slice(0, 3);

    const seoData = {
        title: `${post.title} | Astro Pravin`,
        description: post.subtitle || post.summary || stripHtml(post.content).substring(0, 160),
        keywords: `${post.category}, Vedic astrology, Pandit Pravin Shriram, Solapur astrologer, Kundli guide, remedies`,
        image: post.image,
    };

    return (
        <div className="min-h-screen bg-[#FAF8F5] pt-28 pb-20 px-4 sm:px-6 font-sans text-[#1C1917]">
            <SEO {...seoData} />

            <article className="max-w-4xl mx-auto">
                {/* Breadcrumbs & Navigation */}
                <div className="flex items-center justify-between gap-4 mb-8 text-xs text-[#78716C]">
                    <Link to="/blogs" className="inline-flex items-center gap-1.5 hover:text-[#C2410C] transition-colors font-medium">
                        <ArrowLeft size={16} /> All Guides
                    </Link>
                    <button
                        onClick={handleShare}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#EADCC8] rounded-xl text-[#44403C] hover:text-[#C2410C] hover:bg-[#FFF7ED] transition-colors text-xs font-semibold shadow-sm"
                        title="Share Guide"
                    >
                        <Share2 size={13} /> {copied ? 'Link Copied!' : 'Share Article'}
                    </button>
                </div>

                {/* Article Header */}
                <header className="mb-10 text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF7ED] border border-[#FED7AA] text-xs font-bold uppercase text-[#C2410C]">
                        <LotusCrest className="w-3.5 h-3.5" />
                        <span>{post.category || 'Vedic Astrology'}</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#1C1917] leading-tight max-w-3xl mx-auto">
                        {post.title}
                    </h1>

                    {post.subtitle && (
                        <p className="text-[#44403C] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                            {post.subtitle}
                        </p>
                    )}

                    {/* Metadata Row */}
                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#78716C] border-t border-b border-[#EADCC8] py-3 max-w-2xl mx-auto">
                        <span className="flex items-center gap-1.5">
                            <User size={13} className="text-[#C2410C]" /> {post.author || 'Pandit Pravin Shriram'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                            <Calendar size={13} /> {new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                            <Clock size={13} /> {post.readTime || '6 min read'}
                        </span>
                    </div>
                </header>

                {/* Main Content Card */}
                <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EADCC8] shadow-luxury mb-12">
                    {post.image && (
                        <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-8 border border-[#EADCC8]">
                            <img
                                src={post.image}
                                alt={post.title}
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1532012164546-f432f2e3ef54?q=80&w=800&auto=format&fit=crop';
                                }}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* HTML / Rich Text Render */}
                    <div
                        className="prose prose-stone max-w-none text-xs sm:text-sm md:text-base leading-relaxed text-[#44403C] space-y-4"
                        dangerouslySetInnerHTML={{ __html: post.content || post.excerpt || '' }}
                    />
                </div>

                {/* Consultation CTA Card */}
                <div className="bg-gradient-to-br from-[#FFF7ED] to-[#FAF8F5] rounded-3xl p-8 border border-[#FED7AA] shadow-luxury text-center mb-12 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#FED7AA] flex items-center justify-center mx-auto text-[#C2410C] shadow-sm">
                        <LotusCrest className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-[#1C1917]">
                        Need Personalized Kundli or Vastu Advice?
                    </h3>
                    <p className="text-xs sm:text-sm text-[#78716C] max-w-lg mx-auto">
                        Speak directly with Pandit Pravin Shriram for detailed birth chart analysis, marriage compatibility remedies, and remedial solutions.
                    </p>
                    <button
                        onClick={() => setIsBookingOpen(true)}
                        className="px-8 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#C2410C] to-[#EA580C] shadow-sm hover:scale-105 transition-transform"
                    >
                        Book Personal Consultation
                    </button>
                </div>

                {/* Related Articles */}
                {relatedPosts.length > 0 && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-serif font-bold text-[#1C1917]">
                            Explore More Vedic Insights
                        </h3>
                        <div className="grid sm:grid-cols-3 gap-6">
                            {relatedPosts.map((rel) => (
                                <Link
                                    key={rel.slug}
                                    to={`/blog/${rel.slug}`}
                                    className="bg-white p-6 rounded-2xl border border-[#EADCC8] shadow-sm hover:shadow-luxury transition-all group"
                                >
                                    <span className="text-[10px] uppercase font-bold text-[#C2410C]">
                                        {rel.category}
                                    </span>
                                    <h4 className="text-sm font-serif font-bold text-[#1C1917] group-hover:text-[#C2410C] transition-colors mt-2 line-clamp-2">
                                        {rel.title}
                                    </h4>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </article>

            <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
        </div>
    );
};

export default React.memo(BlogPost);
