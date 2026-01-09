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
            <meta name="keywords" content={keywords || 'vedic astrology, online astrology consultation, horoscope reading, kundli matching, indian astrologer, astrology remedies, love astrology, career astrology'} />
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
