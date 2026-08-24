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
import MobileBottomNav from './components/MobileBottomNav';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';

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
    <div className="py-24 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-[#C2410C] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-[#78716C] uppercase tracking-widest font-mono">Loading Section...</span>
    </div>
);

const LandingPage = ({ onBookClick }) => (
    <>
        <SEO
            title="AstroPravin - Best Online Jyotish in Maharashtra & Solapur | Call with Jyotish Pravin Shriram"
            description="Consult India's Renowned Online Jyotish Pravin Shriram (Panditji - 25+ Yrs Exp). Accurate Horoscope Predictions on Call, Free 36 Guna Kundli Matching (Gun Milan), Matrimony Matchmaking, Certified Gemstones (Pukhraj, Neelam) & Vastu Shastra. Top Astrotalk & AstroSage Alternative."
            keywords="online jyotish, best jyotish in maharashtra, online jyotish consultation on phone, best jyotish in solapur, famous jyotish in pune, jyotish pravin shriram, pandit pravin shriram, call with jyotish, talk to astrologer online, kundli matching jyotish, patrika matching solapur, 36 guna milan marathi, marriage prediction by date of birth, matrimonial kundli matching, buy certified pukhraj stone online, neelam gemstone price, original rudraksha, vastu consultant for home, shani sade sati nivaran, mangal dosha remedies, rashi bhavishya, astrotalk alternative, astrosage free kundli, ganeshaspeaks, instaastro, astro pravin"
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
            {!isAdmin && <MobileBottomNav onBookClick={() => setIsBookingOpen(true)} />}
            <CartDrawer />
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
                <CartProvider>
                    <AppContent />
                    <Analytics />
                    <SpeedInsights />
                </CartProvider>
            </Router>
        </HelmetProvider>
    );
}
