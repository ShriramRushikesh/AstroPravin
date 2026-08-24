import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, schema }) => {
    const siteTitle = 'AstroPravin - Best Online Jyotish in Maharashtra & Solapur | Call with Jyotish Pravin Shriram';
    const defaultDesc = 'Consult India\'s Renowned Online Jyotish Pravin Shriram (Panditji - 25+ Yrs Exp). Accurate Horoscope Predictions on Call, Free 36 Guna Kundli Matching (Gun Milan), Matrimony Matchmaking, Certified Gemstones (Pukhraj, Neelam) & Vastu Shastra.';
    const siteUrl = 'https://astropravin.com';
    const defaultImage = `${siteUrl}/pravin-shriram.png`;

    return (
        <Helmet>
            <title>{title ? `${title} | Astro Pravin` : siteTitle}</title>
            <meta name="description" content={description || defaultDesc} />
            <meta name="keywords" content={keywords || 'online jyotish, best jyotish in maharashtra, online jyotish consultation on phone, best jyotish in solapur, famous jyotish in pune, jyotish pravin shriram, pandit pravin shriram, call with jyotish, talk to astrologer online, kundli matching jyotish, patrika matching solapur, 36 guna milan marathi, marriage prediction by date of birth, matrimonial kundli matching, buy certified pukhraj stone online, neelam gemstone price, original rudraksha, vastu consultant for home, shani sade sati nivaran, mangal dosha remedies, rashi bhavishya, astrotalk alternative, astrosage free kundli, ganeshaspeaks, instaastro, astro pravin'} />
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
