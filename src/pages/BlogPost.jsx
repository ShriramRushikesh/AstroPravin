import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_URL } from '../config';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import BookingModal from '../components/BookingModal';
import SEO from '../components/SEO';

const BlogPost = () => {
    const { slug } = useParams();
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchBlog = async () => {
            try {

                const apiUrl = API_URL;
                const res = await fetch(`${apiUrl}/api/blogs/${slug}`);
                if (res.ok) {
                    setPost(await res.json());
                } else {
                    setPost(null);
                }
            } catch (error) {
                console.error('Failed to fetch blog', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-void flex items-center justify-center text-white/50">
                Loading article...
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-void flex flex-col items-center justify-center text-white px-4">
                <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
                <Link to="/blogs" className="text-gold hover:underline">← Back to Blogs</Link>
            </div>
        );
    }

    // Helper to strip HTML tags for preview
    const stripHtml = (html) => {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    const seoData = {
        title: post.title,
        description: post.subtitle || stripHtml(post.content).substring(0, 160),
        keywords: `${post.category}, astrology, pravin shriram`,
        image: post.image,
        schema: {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "datePublished": post.createdAt,
            "author": {
                "@type": "Person",
                "name": "Astro Pravin"
            }
        }
    };

    return (
        <>
            <div className="min-h-screen bg-void pt-24 pb-12 px-6">
                <SEO {...seoData} />

                <article className="max-w-3xl mx-auto">
                    <Link to="/blogs" className="inline-flex items-center gap-2 text-white/50 hover:text-gold transition-colors mb-8">
                        <ArrowLeft size={20} /> Back to Blog
                    </Link>

                    <header className="mb-10 text-center">
                        <span className="px-3 py-1 bg-saffron/10 border border-saffron/30 rounded-full text-xs text-saffron uppercase tracking-widest font-bold">
                            {post.category}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-serif text-white mt-6 mb-4 leading-tight">
                            {post.title}
                        </h1>
                        <div className="text-white/40 text-sm">
                            Published on {new Date(post.createdAt).toLocaleDateString()} • By {post.author || 'Astro Pravin'}
                        </div>
                    </header>

                    <div className="aspect-video rounded-2xl overflow-hidden mb-10 border border-white/10">
                        <img
                            src={post.image || "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1000&auto=format&fit=crop"}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Content Body */}
                    <div
                        className="prose prose-invert prose-base md:prose-lg max-w-none text-white/80"
                        dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
                    />

                    {/* Bottom CTA */}
                    <div className="mt-16 p-8 bg-gradient-to-r from-cosmic-blue to-indigo-900 border border-white/10 rounded-2xl text-center">
                        <h3 className="text-2xl font-serif text-white mb-4">Want a Personal Reading?</h3>
                        <p className="text-white/70 mb-8 max-w-lg mx-auto">
                            Every chart is unique. Book a 1-on-1 consultation to analyze your specific situation.
                        </p>
                        <button
                            onClick={() => setIsBookingOpen(true)}
                            className="px-8 py-4 bg-gradient-to-r from-saffron to-gold rounded-full text-cosmic-blue font-bold tracking-widest hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                        >
                            BOOK CONSULTATION NOW
                        </button>
                    </div>

                </article>
            </div>
            <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
        </>
    );
};

export default BlogPost;
