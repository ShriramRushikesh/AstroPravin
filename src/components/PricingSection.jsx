import React, { useEffect, useState } from 'react';
import { API_URL } from '../config';
import { motion } from 'framer-motion';
import { CheckCircle, Sliders } from 'lucide-react';

const PricingSection = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const apiUrl = API_URL;
                const res = await fetch(`${apiUrl}/api/services`);
                if (res.ok) {
                    setServices(await res.json());
                }
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch services', error);
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    if (loading) {
        return (
            <section className="py-24 bg-void relative overflow-hidden min-h-[500px]">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <div className="h-10 w-64 bg-white/10 skeleton mx-auto mb-4 rounded-lg"></div>
                        <div className="h-6 w-96 bg-white/10 skeleton mx-auto rounded-lg"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-2xl h-[320px]">
                                <div className="h-8 w-48 bg-white/10 skeleton mb-4 rounded-lg"></div>
                                <div className="h-10 w-32 bg-white/10 skeleton mb-6 rounded-lg"></div>
                                <div className="h-20 w-full bg-white/10 skeleton mb-6 rounded-lg"></div>
                                <div className="h-12 w-full bg-white/10 skeleton rounded-lg"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!loading && services.length === 0) return null;

    return (
        <section className="py-24 bg-void relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(255,215,0,0.05),_transparent_70%)]" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4">
                        Divine Services
                    </h2>
                    <p className="text-white/60 text-lg max-w-2xl mx-auto">
                        Unlock the path to clarity and success with our premium astrological consultations.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={service._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:border-secondary/50 transition-colors group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Sliders size={64} className="text-secondary" />
                            </div>

                            <h3 className="text-2xl font-serif text-white mb-2">{service.name}</h3>
                            <div className="text-secondary text-3xl font-bold mb-4">₹{service.price}</div>
                            <p className="text-white/60 mb-6 min-h-[80px]">{service.description}</p>

                            <button onClick={() => window.location.href = '#contact'} className="w-full py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-secondary hover:text-black transition-all border border-white/20 hover:border-transparent">
                                Book Now
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
