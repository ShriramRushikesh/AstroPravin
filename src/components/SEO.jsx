import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, schema }) => {
    const siteTitle = 'Astro Pravin | Vedic Astrology & Consultancy';
    const defaultDesc = 'Get accurate Vedic astrology predictions for marriage, career, and wealth. Book a consultation with Astro Pravin for personalized Kundli reading and remedies.';
    const siteUrl = 'https://astropravin.com';
    const defaultImage = `${siteUrl}/social-share.jpg`; // Ensure you have a default share image in public folder

    return (
        <Helmet>
            <title>{title ? `${title} | Astro Pravin` : siteTitle}</title>
            <meta name="description" content={description || defaultDesc} />
            <meta name="keywords" content={keywords || 'best astrologer near me, online kundli matching free, free astrology consultation, horoscope today in marathi, rashi bhavishya, vastu tips for home, marriage prediction by date of birth, career astrology consultation online, gemstone recommendation astrologer, vedic astrology consultation India, love problem solution astrologer, best jyotish in Maharashtra, accurate birth chart reading, astrologer in Solapur, kundli milan online free'} />
            <meta name="robots" content="index, follow" />
            <meta http-equiv="content-language" content="en, mr" />
            <link rel="canonical" href={siteUrl + window.location.pathname} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title || siteTitle} />
            <meta property="og:description" content={description || defaultDesc} />
            <meta property="og:url" content={siteUrl + window.location.pathname} />
            <meta property="og:image" content={defaultImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content={title || siteTitle} />
            <meta property="twitter:description" content={description || defaultDesc} />
            <meta property="twitter:image" content={defaultImage} />

            {/* Structured Data (Schema.org) */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
