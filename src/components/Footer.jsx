import React from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';
import { Facebook, Instagram, Youtube, Mail, MapPin, Phone, ShieldCheck, HeartHandshake } from 'lucide-react';
import { LotusCrest, ToranBorder } from './VedicDecorativeArt';

const Footer = () => {
    const [visitCount, setVisitCount] = React.useState(null);

    React.useEffect(() => {
        fetch(`${API_URL}/api/visits`)
            .then(res => res.json())
            .then(data => setVisitCount(data.count))
            .catch(() => {
                setVisitCount('—');
            });
    }, []);

    return (
        <footer className="bg-[#F5F0E8] border-t border-[#EADCC8] text-[#44403C] font-sans pt-16 pb-8 relative overflow-hidden">
            {/* Auspicious Toran Garland at Top of Footer */}
            <div className="absolute top-0 left-0 right-0">
                <ToranBorder />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center shadow-sm">
                                <LotusCrest className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-serif font-bold text-[#1C1917] tracking-tight">
                                Astro<span className="text-[#C2410C]">Pravin</span>
                            </span>
                        </Link>
                        
                        <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed">
                            Official digital portal of <strong className="text-[#1C1917]">Shriram Samupdeshan Kendra</strong>, Solapur. Guided by <strong className="text-[#C2410C]">Pandit Pravin Shriram</strong> with 25+ years of Vedic scholarship in Kundli Matching, Vastu Shastra, and Certified Gemstones.
                        </p>

                        <div className="flex gap-2.5 pt-2">
                            <a
                                href="https://www.instagram.com/shriramsamupdeshankendra?igsh=MWtqdHlrcDB2MW1sZw=="
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-white border border-[#EADCC8] flex items-center justify-center text-[#44403C] hover:text-[#C2410C] hover:border-[#FED7AA] hover:bg-[#FFF7ED] transition-colors"
                                title="Instagram"
                            >
                                <Instagram size={18} />
                            </a>
                            <a
                                href="https://www.facebook.com/share/1DbV4mf9jH/?mibextid=wwXIfr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-white border border-[#EADCC8] flex items-center justify-center text-[#44403C] hover:text-[#C2410C] hover:border-[#FED7AA] hover:bg-[#FFF7ED] transition-colors"
                                title="Facebook"
                            >
                                <Facebook size={18} />
                            </a>
                            <a
                                href="https://www.youtube.com/@PRAVINSHRIRAM-hi9zo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-white border border-[#EADCC8] flex items-center justify-center text-[#44403C] hover:text-[#C2410C] hover:border-[#FED7AA] hover:bg-[#FFF7ED] transition-colors"
                                title="YouTube"
                            >
                                <Youtube size={18} />
                            </a>
                            <a
                                href="https://jsdl.in/DT-9979FYHCSEX"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-white border border-[#EADCC8] flex items-center justify-center text-[#44403C] hover:text-[#C2410C] hover:border-[#FED7AA] hover:bg-[#FFF7ED] transition-colors font-bold text-xs"
                                title="Rated on Justdial"
                            >
                                JD
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-[#1C1917] font-serif font-bold text-base mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C]" />
                            Quick Links
                        </h3>
                        <ul className="space-y-2.5 text-xs sm:text-sm">
                            <li><Link to="/" className="text-[#78716C] hover:text-[#C2410C] transition-colors">Home</Link></li>
                            <li><Link to="/about" className="text-[#78716C] hover:text-[#C2410C] transition-colors">About Pandit Pravin</Link></li>
                            <li><Link to="/matrimony" className="text-[#C2410C] font-semibold hover:underline">Vedic Matrimony Portal</Link></li>
                            <li><Link to="/blogs" className="text-[#78716C] hover:text-[#C2410C] transition-colors">Vedic Wisdom Blog</Link></li>
                            <li><Link to="/planets" className="text-[#78716C] hover:text-[#C2410C] transition-colors">Navagraha Planets Guide</Link></li>
                            <li><Link to="/numerology" className="text-[#78716C] hover:text-[#C2410C] transition-colors">Numerology Calculator</Link></li>
                            <li><Link to="/store" className="text-[#78716C] hover:text-[#C2410C] transition-colors">Gemstones & Rudraksha</Link></li>
                            <li><Link to="/contact" className="text-[#78716C] hover:text-[#C2410C] transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Vedic Services */}
                    <div>
                        <h3 className="text-[#1C1917] font-serif font-bold text-base mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                            Vedic Consultations
                        </h3>
                        <ul className="space-y-2.5 text-xs sm:text-sm text-[#78716C]">
                            <li>• Kundli Matchmaking (36 Guna)</li>
                            <li>• Career & Financial Horoscope</li>
                            <li>• Vastu Shastra Energy Audit</li>
                            <li>• Shani Sade Sati Remedies</li>
                            <li>• Mangal Dosha Resolution</li>
                            <li>• Certified Astrological Gemstones</li>
                            <li>• Navagraha Shanti Poojas</li>
                        </ul>
                    </div>

                    {/* Contact & Address */}
                    <div className="space-y-3">
                        <h3 className="text-[#1C1917] font-serif font-bold text-base mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C]" />
                            Consultation Kendra
                        </h3>
                        
                        <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[#78716C]">
                            <MapPin size={16} className="text-[#C2410C] shrink-0 mt-0.5" />
                            <span>Shop no.2,3, S.S Icon shopping complex, Gharkul road, Solapur - 413006, Maharashtra</span>
                        </div>

                        <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#78716C]">
                            <Phone size={16} className="text-[#C2410C] shrink-0" />
                            <a href="tel:+919921697908" className="hover:text-[#C2410C] transition-colors font-medium">
                                +91 99216 97908
                            </a>
                        </div>

                        <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#78716C]">
                            <Mail size={16} className="text-[#C2410C] shrink-0" />
                            <a href="mailto:pravin.shriram@gmail.com" className="hover:text-[#C2410C] transition-colors">
                                pravin.shriram@gmail.com
                            </a>
                        </div>

                        {visitCount !== null && (
                            <div className="pt-3">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-[#EADCC8] text-[11px] text-[#78716C] font-mono">
                                    <span>👁️ Total Visits:</span>
                                    <strong className="text-[#C2410C]">{visitCount}</strong>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Legal Copyright */}
                <div className="pt-8 border-t border-[#EADCC8] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78716C]">
                    <p>© {new Date().getFullYear()} AstroPravin • Shriram Samupdeshan Kendra. All Rights Reserved.</p>
                    <div className="flex flex-wrap items-center gap-4">
                        <Link to="/privacy-policy" className="hover:text-[#C2410C]">Privacy Policy</Link>
                        <Link to="/terms-conditions" className="hover:text-[#C2410C]">Terms & Conditions</Link>
                        <Link to="/disclaimer" className="hover:text-[#C2410C]">Disclaimer</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default React.memo(Footer);
