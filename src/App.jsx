import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react"
import HeroSection from './components/HeroSection';
import { API_URL } from './config';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import BookingModal from './components/BookingModal';
import SEO from './components/SEO';
import AboutSection from './components/AboutSection';
import ErrorBoundary from './components/ErrorBoundary';
import WelcomeIntro from './components/WelcomeIntro';
import PricingSection from './components/PricingSection';
import ReviewsSection from './components/ReviewsSection';
import StoreTeaser from './components/StoreTeaser';

// ─── Lazy-loaded route components (only download when navigated to) ───
const PlanetsSection = lazy(() => import('./components/PlanetsSection'));
const NumerologyGenerator = lazy(() => import('./components/NumerologyGenerator'));
const VideoGallery = lazy(() => import('./components/VideoGallery'));
const PlanetDetail = lazy(() => import('./pages/PlanetDetail'));
const BlogSection = lazy(() => import('./pages/BlogSection'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Store = lazy(() => import('./pages/Store'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));

// ─── Minimal loading fallback ───
const PageLoader = () => (
    <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
            <span className="text-white/40 text-sm tracking-widest uppercase">Loading...</span>
        </div>
    </div>
);

const LandingPage = ({ onBookClick }) => (
    <>
        <SEO
            title="Best Astrologer in Solapur - Astro Pravin | Kundli & Vastu Consultant"
            description="Acharya Pravin: Verified Astrologer in Solapur. Specialist in Kundli Matching, Marriage Problems, Career Guidance, and Vastu Shastra. 25+ Years Experience. Book consultation online."
            keywords="best astrologer near me, astrologer in Solapur, online kundli matching, free astrology consultation, vastu consultant Maharashtra, gemstone recommendation, vedic astrology India, marriage prediction by date of birth, love problem solution, career astrology"
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

    // Increment Visitor Count (non-blocking, fire-and-forget)
    useEffect(() => {
        const hasVisited = sessionStorage.getItem('visited');
        if (!hasVisited) {
            fetch(`${API_URL}/api/visits/increment`, { method: 'POST' })
                .then(res => res.json())
                .catch(() => {}); // Silently fail — never block UI
            sessionStorage.setItem('visited', 'true');
        }
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <WelcomeIntro />
            {!isAdmin && <Navbar onBookClick={() => setIsBookingOpen(true)} />}
            <main className="flex-grow">
                <Suspense fallback={<PageLoader />}>
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
                </Suspense>
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
                <SpeedInsights />
            </Router>
        </HelmetProvider>
    );
}

export default App;
