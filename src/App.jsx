import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from "@vercel/analytics/react";
import HeroSection from './components/HeroSection';
import { API_URL } from './config';
import ScrollSections from './components/ScrollSections';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import BookingModal from './components/BookingModal';
import PlanetsSection from './components/PlanetsSection';
import StoreSection from './components/StoreSection';
import StoreTeaser from './components/StoreTeaser';
import VideoGallery from './components/VideoGallery';
import PlanetDetail from './pages/PlanetDetail';
import BlogSection from './pages/BlogSection';
import BlogPost from './pages/BlogPost';
import AdminDashboard from './pages/AdminDashboard';
import Store from './pages/Store';
import NumerologyGenerator from './components/NumerologyGenerator';
import SEO from './components/SEO';
import AboutSection from './components/AboutSection';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import ErrorBoundary from './components/ErrorBoundary';
import WelcomeIntro from './components/WelcomeIntro';
import PricingSection from './components/PricingSection';
import ReviewsSection from './components/ReviewsSection';

const LandingPage = ({ onBookClick }) => (
    <>
        <SEO
            title="Best Astrologer in Solapur - Astro Pravin | Kundli & Vastu Consultant"
            description="Acharya Pravin: Verified Astrologer in Solapur. Specialist in Kundli Matching, Marriage Problems, Career Guidance, and Vastu Shastra. 20+ Years Experience."
            keywords="Best Astrologer in Solapur, Jyotish Solapur, Gun Milan, Kundli Matching, Vastu Consultant, Astro Pravin, Gemstones Solapur, Marriage Astrologer"
        />
        <HeroSection onBookClick={onBookClick} />
        <AboutSection />
        <PricingSection />
        <StoreTeaser />
        <ReviewsSection />
    </>
);

// Separate component to use router hooks
const AppContent = () => {
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');

    // Scroll to Top on Route Change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    // Increment Visitor Count
    useEffect(() => {
        const hasVisited = sessionStorage.getItem('visited');
        if (!hasVisited) {
            fetch(`${API_URL}/api/visits/increment`, { method: 'POST' })
                .then(res => res.json())
                .catch(err => console.error('Visit error', err));
            sessionStorage.setItem('visited', 'true');
        }
    }, []);

    // Scroll to section handling = location.pathname.startsWith('/admin');

    return (
        <div className="flex flex-col min-h-screen">
            <WelcomeIntro />
            {!isAdmin && <Navbar onBookClick={() => setIsBookingOpen(true)} />}
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<ErrorBoundary><LandingPage onBookClick={() => setIsBookingOpen(true)} /></ErrorBoundary>} />
                    <Route path="/planets" element={<ErrorBoundary><PlanetsSection /></ErrorBoundary>} />
                    <Route path="/numerology" element={<ErrorBoundary><div className="pt-20 md:pt-24"><NumerologyGenerator /></div></ErrorBoundary>} />
                    <Route path="/videos" element={<ErrorBoundary><div className="pt-20 md:pt-24"><VideoGallery /></div></ErrorBoundary>} />
                    <Route path="/planet/:id" element={<ErrorBoundary><PlanetDetail /></ErrorBoundary>} />
                    <Route path="/blogs" element={<ErrorBoundary><BlogSection /></ErrorBoundary>} />
                    <Route path="/blog/:slug" element={<ErrorBoundary><BlogPost /></ErrorBoundary>} />
                    <Route path="/admin" element={<ErrorBoundary><AdminDashboard /></ErrorBoundary>} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-conditions" element={<TermsConditions />} />
                    <Route path="/store" element={<ErrorBoundary><Store /></ErrorBoundary>} />
                </Routes>
            </main>
            {!isAdmin && <Footer />}
            <FloatingWhatsApp />
            <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
        </div>
    );
};

function App() {
    return (
        <HelmetProvider>
            <Router>
                <AppContent />
                <Analytics />
            </Router>
        </HelmetProvider>
    );
}

export default App;
