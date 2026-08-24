import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import HeroSection from './components/HeroSection';
import { API_URL } from './config';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import BookingModal from './components/BookingModal';
import SEO from './components/SEO';
import AboutSection from './components/AboutSection';
import MatrimonyTeaser from './components/MatrimonyTeaser';
import ErrorBoundary from './components/ErrorBoundary';
import WelcomeIntro from './components/WelcomeIntro';
import PricingSection from './components/PricingSection';
import ReviewsSection from './components/ReviewsSection';
import StoreTeaser from './components/StoreTeaser';
import CookieConsent from './components/CookieConsent';

// ─── Lazy-loaded route components (only download when navigated to) ───
const PlanetsSection = lazy(() => import('./components/PlanetsSection'));
const NumerologyGenerator = lazy(() => import('./components/NumerologyGenerator'));
const VideoGallery = lazy(() => import('./components/VideoGallery'));
const PlanetDetail = lazy(() => import('./pages/PlanetDetail'));
const BlogSection = lazy(() => import('./pages/BlogSection'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Store = lazy(() => import('./pages/Store'));
const Matrimony = lazy(() => import('./pages/Matrimony'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));

// ─── Minimal loading fallback ───
const PageLoader = () => (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-[#C2410C] border-t-transparent rounded-full animate-spin" />
            <span className="text-[#78716C] text-xs font-bold tracking-widest uppercase">Loading AstroPravin...</span>
        </div>
    </div>
);

const LandingPage = ({ onBookClick }) => (
    <>
        <SEO
            title="AstroPravin - Best Astrologer in Solapur | Vedic Kundli, Matrimony, Vastu & Gemstones"
            description="Leading Vedic Astrologer Pandit Pravin Shriram. Online Kundli Matching (Gun Milan), Matrimony Services, Certified Gemstones (Pukhraj, Neelam, Manik), Vastu Shastra, and Career Predictions. 25+ Years Experience."
            keywords="astrotalk, astrosage, instraastro, ganeshaspeaks, best astrologer near me, astrologer in Solapur, best astrologer in Maharashtra, online kundli matching free, free astrology consultation, matrimony, marathi matrimony kundli matching, 36 guna milan, buy certified gemstones online, pukhraj stone price, neelam gemstone, rudraksha original, vastu tips for home, marriage prediction by date of birth, career astrology consultation online, shani sade sati remedies, mangal dosha nivaran, astro pravin"
        />
        <HeroSection onBookClick={onBookClick} />
        <MatrimonyTeaser />
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
        try {
            const hasVisited = sessionStorage.getItem('visited');
            if (!hasVisited) {
                fetch(`${API_URL}/api/visits/increment`, { method: 'POST' })
                    .then(res => res.json())
                    .catch(() => { }); // Silently fail — never block UI
                sessionStorage.setItem('visited', 'true');
            }
        } catch (e) {
            // Ignore storage access errors in private browsing
        }
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
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
                        <Route path="/store" element={<ErrorBoundary><Store /></ErrorBoundary>} />
                        <Route path="/matrimony" element={<ErrorBoundary><Matrimony /></ErrorBoundary>} />
                        <Route path="/about" element={<ErrorBoundary><AboutUs /></ErrorBoundary>} />
                        <Route path="/contact" element={<ErrorBoundary><ContactUs /></ErrorBoundary>} />
                        <Route path="/privacy-policy" element={<ErrorBoundary><PrivacyPolicy /></ErrorBoundary>} />
                        <Route path="/terms-conditions" element={<ErrorBoundary><TermsConditions /></ErrorBoundary>} />
                        <Route path="/disclaimer" element={<ErrorBoundary><Disclaimer /></ErrorBoundary>} />
                        <Route path="/admin/*" element={<ErrorBoundary><AdminDashboard /></ErrorBoundary>} />
                    </Routes>
                </Suspense>
            </main>
            {!isAdmin && <Footer />}
            <FloatingWhatsApp />
            <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
            <CookieConsent />
        </div>
    );
};

export default function App() {
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
