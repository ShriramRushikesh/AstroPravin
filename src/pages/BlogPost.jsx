import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Share2, HelpCircle, Sparkles, CheckCircle2, Bookmark } from 'lucide-react';
import { API_URL } from '../config';
import { staticBlogPosts } from '../data/blogData';
import BookingModal from '../components/BookingModal';
import SEO from '../components/SEO';
import AdSenseUnit from '../components/AdSenseUnit';

const BlogPost = () => {
    const { slug } = useParams();
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchBlog = async () => {
            // Check static posts first for instant display
            const staticMatch = staticBlogPosts.find(p => p.slug === slug);
            if (staticMatch) {
                setPost(staticMatch);
                setLoading(false);
                return;
            }

            // Fallback to API if not in static collection
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
            <div className="min-h-screen bg-void flex items-center justify-center text-white/50 font-sans">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                    <span>Loading Vedic Guide...</span>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-void flex flex-col items-center justify-center text-white px-4 font-sans text-center">
                <h1 className="text-3xl font-serif mb-3">Vedic Guide Not Found</h1>
                <p className="text-white/60 mb-6 max-w-md">The astrological guide you are looking for may have been updated or moved.</p>
                <Link to="/blogs" className="px-6 py-3 bg-secondary/20 border border-secondary text-secondary rounded-xl font-semibold text-sm">
                    ← Explore All Vedic Guides
                </Link>
            </div>
        );
    }

    // Helper to strip HTML tags
    const stripHtml = (html) => {
        if (!html) return '';
        return html.replace(/<[^>]*>?/gm, '');
    };

    // Related posts
    const relatedPosts = staticBlogPosts
        .filter(p => p.slug !== post.slug)
        .slice(0, 3);

    const seoData = {
        title: `${post.title} | Astro Pravin`,
        description: post.subtitle || post.summary || stripHtml(post.content).substring(0, 160),
        keywords: `${post.category}, Vedic astrology, Pandit Pravin Shriram, Solapur astrologer, Kundli guide, remedies`,
        image: post.image,
        schema: {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": post.subtitle || post.summary,
            "image": post.image,
            "datePublished": post.createdAt,
            "author": {
                "@type": "Person",
                "name": post.author || "Pandit Pravin Shriram",
                "jobTitle": "Senior Vedic Astrologer",
                "url": "https://astropravin.com/about"
            },
            "publisher": {
                "@type": "Organization",
                "name": "Astro Pravin - Shriram Samupdeshan Kendra",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://astropravin.com/pravin-shriram.png"
                }
            },
            ...(post.faqs && post.faqs.length > 0 ? {
                "mainEntity": {
                    "@type": "FAQPage",
                    "mainEntity": post.faqs.map(f => ({
                        "@type": "Question",
                        "name": f.question,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": f.answer
                        }
                    }))
                }
            } : {})
        }
    };

    return (
        <div className="min-h-screen bg-void pt-28 pb-20 px-6 font-sans text-white">
            <SEO {...seoData} />

            <article className="max-w-4xl mx-auto">
                {/* Breadcrumbs & Navigation */}
                <div className="flex items-center justify-between gap-4 mb-8 text-xs text-white/50">
                    <Link to="/blogs" className="inline-flex items-center gap-1.5 hover:text-secondary transition-colors font-medium">
                        <ArrowLeft size={16} /> All Guides
                    </Link>
                    <button
                        onClick={handleShare}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
                        title="Share Guide"
                    >
                        <Share2 size={14} /> {copied ? 'Link Copied!' : 'Share Article'}
                    </button>
                </div>

                {/* Article Header */}
                <header className="mb-10 text-center">
                    <span className="px-4 py-1.5 bg-secondary/10 border border-secondary/30 rounded-full text-xs text-secondary uppercase tracking-widest font-bold inline-block mb-6">
                        {post.category || 'Vedic Astrology'}
                    </span>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-6 leading-tight tracking-tight max-w-3xl mx-auto">
                        {post.title}
                    </h1>

                    {post.subtitle && (
                        <p className="text-white/70 text-base md:text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
                            {post.subtitle}
                        </p>
                    )}

                    {/* Metadata Row */}
                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/50 border-t border-b border-white/10 py-4 max-w-2xl mx-auto">
                        <span className="flex items-center gap-1.5">
                            <User size={14} className="text-secondary" /> {post.author || 'Pandit Pravin Shriram'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                            <Calendar size={14} /> {new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                            <Clock size={14} /> {post.readTime || '8 min read'}
                        </span>
                    </div>
                </header>

                {/* Top Ad Unit */}
                <AdSenseUnit slot="auto" format="horizontal" />

                {/* Featured Image */}
                <div className="aspect-video rounded-3xl overflow-hidden mb-12 border border-white/10 shadow-2xl bg-zinc-900">
                    <img
                        src={post.image || "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1200&auto=format&fit=crop"}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Article Content */}
                <div
                    className="prose prose-invert prose-amber max-w-none text-white/80 text-base md:text-lg leading-relaxed space-y-6 [&>h2]:text-2xl [&>h2]:md:text-3xl [&>h2]:font-serif [&>h2]:text-amber-400 [&>h2]:mt-10 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-serif [&>h3]:text-white [&>h3]:mt-6 [&>h3]:mb-3 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2 [&>strong]:text-white"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Mid-Article Compliant Ad Unit */}
                <AdSenseUnit slot="auto" format="rectangle" />

                {/* Frequently Asked Questions Section (if available) */}
                {post.faqs && post.faqs.length > 0 && (
                    <div className="mt-16 bg-white/[0.03] border border-white/10 rounded-3xl p-8 space-y-6">
                        <div className="flex items-center gap-2 text-secondary text-sm font-semibold uppercase tracking-wider">
                            <HelpCircle size={18} />
                            <span>Frequently Asked Questions</span>
                        </div>
                        <h3 className="text-2xl font-serif text-white">Common Inquiries on this Topic</h3>
                        <div className="space-y-4 pt-2">
                            {post.faqs.map((faq, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2">
                                    <h4 className="font-semibold text-white text-base">{faq.question}</h4>
                                    <p className="text-white/70 text-sm leading-relaxed">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Author Bio Box (E-E-A-T signal for Google AdSense) */}
                <div className="mt-14 p-6 sm:p-8 bg-white/5 border border-white/10 rounded-3xl flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <img
                        src="/pravin-shriram.png"
                        alt="Pandit Pravin Shriram"
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-secondary shrink-0 shadow-lg"
                    />
                    <div className="space-y-2 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                            <h4 className="text-lg font-serif text-white font-bold">{post.author || 'Pandit Pravin Shriram'}</h4>
                            <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full font-medium">Author & Astrologer</span>
                        </div>
                        <p className="text-xs text-secondary font-semibold uppercase tracking-wider">
                            {post.authorRole || 'Founder, Shriram Samupdeshan Kendra (25+ Years Experience)'}
                        </p>
                        <p className="text-white/70 text-sm leading-relaxed">
                            Pandit Pravin Shriram is a renowned authority in Vedic Astrology, Kundli Milan, and Vastu Shastra based in Solapur, Maharashtra. He provides personalized, classical guidance adhering strictly to astronomical Panchang.
                        </p>
                    </div>
                </div>

                {/* Bottom CTA Box */}
                <div className="mt-14 p-8 bg-gradient-to-r from-amber-500/10 via-purple-900/30 to-black border border-white/15 rounded-3xl text-center space-y-4 shadow-2xl">
                    <span className="text-secondary text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5">
                        <Sparkles size={14} /> Personal Chart Reading
                    </span>
                    <h3 className="text-2xl md:text-3xl font-serif text-white">Need a Tailored Analysis for Your Horoscope?</h3>
                    <p className="text-white/70 text-sm max-w-lg mx-auto leading-relaxed">
                        Every Janma Kundli is unique. Schedule a one-on-one consultation with Pandit Pravin Shriram to analyze planetary Dashas, remedies, and career/marital prospects.
                    </p>
                    <button
                        onClick={() => setIsBookingOpen(true)}
                        className="mt-4 px-8 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold rounded-full text-sm shadow-xl hover:scale-105 transition-all"
                    >
                        Book Consultation With Pandit Ji
                    </button>
                </div>

                {/* Related Articles */}
                {relatedPosts.length > 0 && (
                    <div className="mt-20 border-t border-white/10 pt-12">
                        <h3 className="text-2xl font-serif text-white mb-8">Related Vedic Guides</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            {relatedPosts.map(rel => (
                                <Link to={`/blog/${rel.slug}`} key={rel.slug} className="group block bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-secondary/40 transition-all p-4 flex flex-col justify-between">
                                    <div>
                                        <div className="text-[11px] text-secondary font-semibold uppercase tracking-wider mb-2">
                                            {rel.category}
                                        </div>
                                        <h4 className="text-sm font-serif text-white group-hover:text-secondary transition-colors font-semibold leading-snug line-clamp-2 mb-2">
                                            {rel.title}
                                        </h4>
                                    </div>
                                    <span className="text-xs text-white/40 mt-4 flex items-center gap-1">
                                        <Clock size={12} /> {rel.readTime}
                                    </span>
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

export default BlogPost;
