import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, schema }) => {
    const siteTitle = 'AstroPravin - Call with Pandit Pravin Shriram | Best Astrologer in Solapur & Maharashtra';
    const defaultDesc = 'Talk to & Call with India\'s Trusted Vedic Astrologer Pandit Pravin Shriram (25+ Yrs Exp). Accurate Horoscope Predictions, Free 36 Guna Kundli Matching (Gun Milan), Matrimony Matchmaking, Certified Gemstones (Pukhraj, Neelam) & Vastu Shastra.';
    const siteUrl = 'https://astropravin.com';
    const defaultImage = `${siteUrl}/pravin-shriram.png`;

    return (
        <Helmet>
            <title>{title ? `${title} | Astro Pravin` : siteTitle}</title>
            <meta name="description" content={description || defaultDesc} />
            <meta name="keywords" content={keywords || 'call with pandit pravin shriram, talk to astrologer online, best astrologer in solapur, best astrologer in maharashtra, online astrologer consultation on phone, online kundli matching free, 36 guna milan marathi, marriage prediction by date of birth, matrimonial kundli matching, buy certified pukhraj stone online, neelam gemstone price, original rudraksha, vastu consultant for home, shani sade sati nivaran, mangal dosha remedies, rashi bhavishya, astrotalk alternative, astrosage free kundli, ganeshaspeaks, instaastro, astro pravin, pandit pravin shriram'} />
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
