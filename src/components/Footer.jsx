import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone, Star } from 'lucide-react';

const Footer = () => {
    const [visitCount, setVisitCount] = React.useState(null);

    React.useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/visits`)
            .then(res => res.json())
            .then(data => setVisitCount(data.count))
            .catch(err => console.error('Fetch visit error', err));
    }, []);

    return (
        <footer className="bg-black/90 border-t border-white/10 text-white/60 font-sans pt-16 pb-8 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-saffron/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand Column */}
                    <div>
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <Star className="text-gold fill-gold" size={24} />
                            <span className="text-2xl font-serif text-white tracking-wide">Astro Pravin</span>
                        </Link>
                        <p className="leading-relaxed mb-6">
                            <span className="text-white font-serif text-lg mb-6">AstroPravin</span> is the official online platform of <span className="text-gradient-gold"><strong>Shriram Samupdeshan Kendra</strong></span> , offering authentic Marathi Vedic astrology, kundli analysis, and personalized remedies to help people find clarity in life, career, and relationships through trusted ancient wisdom.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.instagram.com/shriramsamupdeshankendra?igsh=MWtqdHlrcDB2MW1sZw==" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-gold hover:text-black transition-colors"><Instagram size={28} /></a>
                            <a href="https://www.facebook.com/share/1DbV4mf9jH/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-gold hover:text-black transition-colors"><Facebook size={28} /></a>
                            <a href="https://www.youtube.com/@PRAVINSHRIRAM-hi9zo" className="p-2 bg-white/5 rounded-full hover:bg-gold hover:text-black transition-colors"><Youtube size={28} /></a>
                            <a href="https://jsdl.in/DT-9979FYHCSEX" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-gold hover:text-black transition-colors font-bold text-xs flex items-center justify-center w-[44px] h-[44px]" title="Rated on Justdial" size={28}>JD</a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-serif text-lg mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><Link to="/" className="hover:text-gold transition-colors">Home</Link></li>
                            <li><Link to="/numerology" className="hover:text-gold transition-colors">Numerology</Link></li>
                            <li><Link to="/planets" className="hover:text-gold transition-colors">Planets</Link></li>
                            <li><Link to="/blogs" className="hover:text-gold transition-colors">Blog</Link></li>
                            <li><Link to="/videos" className="hover:text-gold transition-colors">Videos</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-white font-serif text-lg mb-6">Our Services</h3>
                        <ul className="space-y-3">
                            <li className="hover:text-gold cursor-pointer transition-colors">Personal Consultation</li>
                            <li className="hover:text-gold cursor-pointer transition-colors">Match Making</li>
                            <li className="hover:text-gold cursor-pointer transition-colors">Gemstone Recommendation</li>
                            <li className="hover:text-gold cursor-pointer transition-colors">Vastu Shastra</li>
                            <li className="hover:text-gold cursor-pointer transition-colors">Numerology</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-serif text-lg mb-6">Contact Us</h3>
                        <ul className="space-y-4 mb-6">
                            <li className="flex items-start gap-3">
                                <MapPin className="mt-1 text-gold" size={40} />
                                <span>Shop no.2,3, S.S Icon shopping complex, Gharkul road, Solapur - 413006</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-gold" size={18} />
                                <span><a href="tel:+919921697908">+91 99216 97908</a></span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-gold" size={18} />
                                <span><a href="mailto:pravin.shriram@gmail.com">pravin.shriram@gmail.com</a></span>
                            </li>
                        </ul>
                        {/* Map Embed */}
                        <div className="rounded-lg overflow-hidden border border-white/10 h-48 w-full">
                            <iframe
                                title="Office Location"
                                src="https://www.google.com/maps/embed?pb=!4v1767349561152!6m8!1m7!1sTkv02Rj-fmGREl8uvnfHmQ!2m2!1d17.67872176018039!2d75.93450994017743!3f204.90698098286538!4f10.498427275404723!5f1.0641078130381885"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                    <p>&copy; {new Date().getFullYear()} Astro Pravin. All rights reserved. • <span className="text-gold/80">Visits: {visitCount ? visitCount.toLocaleString() : '...'}</span>
                        <br />Made with ❤️ for <strong>BABA</strong> by~ <strong>Rushikesh Shriram</strong>
                    </p>
                    <div className="flex gap-6">
                        <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms-conditions" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link to="/admin" className="hover:text-white transition-colors opacity-50 hover:opacity-100">Admin</Link>
                    </div>
                </div>
            </div>
        </footer >
    );
};

export default Footer;
