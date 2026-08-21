import React from 'react';
import { Helmet } from 'react-helmet-async';
import MatrimonyLayout from './MatrimonyLayout';
import SEO from '../../components/SEO';

const Matrimony = () => {
  return (
    <>
      <SEO
        title="Vedic Matrimony Portal - Astro Pravin | Confidential Astrological Matchmaking"
        description="Privately managed Vedic astrology matrimony service by Pandit Acharya Pravin. Verified profiles with Ashta Koota 36 Guna Milan matchmaking."
        keywords="vedic matrimony, astrological matchmaking, 36 guna milan, solapur matrimony, kundli matching"
      />
      <MatrimonyLayout />
    </>
  );
};

export default React.memo(Matrimony);
