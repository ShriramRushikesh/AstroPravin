import React from 'react';
import { Helmet } from 'react-helmet-async';
import MatrimonyLayout from './MatrimonyLayout';
import SEO from '../../components/SEO';

const Matrimony = () => {
  return (
    <>
      <SEO
        title="Matrimony - Astro Pravin | Confidential Matchmaking"
        description="Privately managed matrimony service by Pandit Acharya Pravin. Verified profiles with Ashta Koota 36 Guna Milan matchmaking."
        keywords="matrimony, astrological matchmaking, 36 guna milan, solapur matrimony, kundli matching"
      />
      <MatrimonyLayout />
    </>
  );
};

export default React.memo(Matrimony);
