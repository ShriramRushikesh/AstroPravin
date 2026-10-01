import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Sparkles } from 'lucide-react';
import { API_URL } from '../config';
import SEO from './SEO';

const KundliGenerator = () => {
    const [formData, setFormData] = useState({
        name: '',
        day: '',
        month: '',
        year: '',
        birthTime: '',
        place: '',
        mobile: ''
    });
    const [showPreview, setShowPreview] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState(null);
    const [citySuggestions, setCitySuggestions] = useState([]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const generateKundli = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Parse time
            const [hour, minute] = formData.birthTime ? formData.birthTime.split(':') : ['00', '00'];

            const payload = { ...formData, hour, minute };


            const apiUrl = API_URL;
            const response = await fetch(`${apiUrl}/api/kundli/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (data.success) {
                setResultData(data);
                setShowPreview(true);
            } else {
                alert("Error generating Kundli. Please try again.");
            }
        } catch (error) {
            console.error(error);
            alert("Server error.");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white focus:border-secondary outline-none";

    return (
        <section className="min-h-screen py-20 bg-void relative overflow-hidden">
            <SEO
                title="Kundli Generator | Vedic Birth Chart & Analysis"
                description="Generate your Janam Kundli online. Get detailed Vedic birth chart analysis, planetary positions, and astrological predictions instantly."
                keywords="kundli generator, vedic birth chart, janma kundli, online horoscope, indian astrology, birth chart calculator, vedic astrology software, kundli matching, kundali online"
            />
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(255,215,0,0.05),_transparent_70%)]" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4">
                        Kundli Generation
                    </h2>
                    <p className="text-white/60 text-lg max-w-2xl mx-auto">
                        Unlock the secrets of your destiny. Generate your Vedic Birth Chart instantly with our advanced ancient algorithms.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Form */}
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-4 md:p-8 rounded-2xl">
                        <form onSubmit={generateKundli} className="space-y-4 md:space-y-6">
                            <div>
                                <label className="block text-white/70 mb-2 text-xs md:text-sm uppercase tracking-wider">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    onChange={handleInputChange}
                                    className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white focus:border-secondary outline-none text-sm md:text-base"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-2 md:gap-4">
                                <div>
                                    <label className="block text-white/70 mb-2 text-xs md:text-sm uppercase tracking-wider">Day</label>
                                    <input type="number" name="day" placeholder="DD" onChange={handleInputChange} className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white focus:border-secondary outline-none text-sm md:text-base" required />
                                </div>
                                <div>
                                    <label className="block text-white/70 mb-2 text-xs md:text-sm uppercase tracking-wider">Month</label>
                                    <input type="number" name="month" placeholder="MM" onChange={handleInputChange} className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white focus:border-secondary outline-none text-sm md:text-base" required />
                                </div>
                                <div>
                                    <label className="block text-white/70 mb-2 text-xs md:text-sm uppercase tracking-wider">Year</label>
                                    <input type="number" name="year" placeholder="YYYY" onChange={handleInputChange} className={`${inputClass} text-sm md:text-base`} required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-white/70 mb-2 text-sm uppercase tracking-wider">Time (24H)</label>
                                    <input
                                        type="time"
                                        name="birthTime"
                                        onChange={handleInputChange}
                                        className={`${inputClass} [color-scheme:dark]`}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/70 mb-2 text-sm uppercase tracking-wider">Mobile Number</label>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        onChange={handleInputChange}
                                        className={inputClass}
                                        placeholder="+91 XXXXX XXXXX"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-white/70 mb-2 text-sm uppercase tracking-wider">Birth Place</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="place"
                                        value={formData.place}
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            if (e.target.value.length > 2) {
                                                const timer = setTimeout(() => {
                                                    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${e.target.value}`)
                                                        .then(res => res.json())
                                                        .then(data => setCitySuggestions(data))
                                                        .catch(err => console.error(err));
                                                }, 500);
                                                return () => clearTimeout(timer);
                                            } else {
                                                setCitySuggestions([]);
                                            }
                                        }}
                                        className={inputClass}
                                        placeholder="Search City..."
                                        autoComplete="off"
                                        required
                                    />
                                    {citySuggestions.length > 0 && (
                                        <ul className="absolute z-50 w-full bg-black/90 border border-white/20 rounded-lg mt-1 max-h-48 overflow-y-auto backdrop-blur-md shadow-xl">
                                            {citySuggestions.map((city, index) => (
                                                <li
                                                    key={index}
                                                    onClick={() => {
                                                        setFormData({ ...formData, place: city.display_name.split(',')[0] + ", " + city.display_name.split(',').slice(-1)[0].trim() });
                                                        setCitySuggestions([]);
                                                    }}
                                                    className="p-3 text-white/80 hover:bg-white/10 hover:text-secondary cursor-pointer text-sm border-b border-white/5 last:border-none transition-colors"
                                                >
                                                    {city.display_name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            <button disabled={loading} className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-black font-bold text-lg uppercase tracking-wide rounded-xl shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:scale-[1.02] transition-transform flex justify-center items-center gap-2">
                                {loading ? (
                                    <>
                                        <Sparkles className="animate-spin" /> Generating...
                                    </>
                                ) : (
                                    "Generate Kundli"
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Preview Area */}
                    <div className="relative flex justify-center items-center">
                        {!showPreview ? (
                            <div className="text-center opacity-50">
                                <Sparkles size={64} className="mx-auto text-secondary mb-4 animate-pulse" />
                                <p className="text-white">Enter details to reveal your cosmic map</p>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full relative"
                            >
                                <div className="border-4 border-primary p-4">
                                    <h3 className="text-center font-serif text-2xl mb-4 text-black font-bold">Lagna Chart</h3>
                                    {/* Simplified North Indian Chart SVG */}
                                    <svg viewBox="0 0 200 200" className="w-full h-auto border border-black mb-4">
                                        <rect x="0" y="0" width="200" height="200" fill="none" stroke="black" strokeWidth="2" />
                                        <line x1="0" y1="0" x2="200" y2="200" stroke="black" strokeWidth="1" />
                                        <line x1="200" y1="0" x2="0" y2="200" stroke="black" strokeWidth="1" />
                                        <line x1="0" y1="100" x2="100" y2="0" stroke="black" strokeWidth="1" />
                                        <line x1="100" y1="0" x2="200" y2="100" stroke="black" strokeWidth="1" />
                                        <line x1="200" y1="100" x2="100" y2="200" stroke="black" strokeWidth="1" />
                                        <line x1="100" y1="200" x2="0" y2="100" stroke="black" strokeWidth="1" />
                                        <text x="100" y="90" fontSize="10" textAnchor="middle">1 (Asc)</text>
                                    </svg>

                                    <div className="text-center space-y-2 mb-4">
                                        <p className="text-black text-xl font-bold">{resultData.kundliData.lagna} Lagna</p>
                                        <p className="text-gray-600 text-sm">Moon in {resultData.kundliData.moonSign}</p>
                                        <p className="text-green-600 font-bold text-xs mt-2">
                                            ✅ PDF sent to {formData.mobile}
                                        </p>
                                    </div>

                                    <a href={resultData.pdfUrl} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors">
                                        <Download size={16} /> Download PDF
                                    </a>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                                    <p className="text-4xl font-bold -rotate-45 text-black">ASTROPRAVIN</p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default KundliGenerator;
