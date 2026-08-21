import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, User, Sparkles, ArrowRight, AlertCircle, PhoneCall, HeartHandshake } from 'lucide-react';

const MatrimonyLogin = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onLoginSuccess(username.trim(), password);
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 pt-24 md:pt-28 pb-16 overflow-hidden">
      {/* ── Atmospheric Vedic Cosmic Background ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-amber-500/10 via-orange-600/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-amber-600/5 rounded-full blur-2xl" />
        {/* Subtle decorative concentric aura ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-amber-500/10 rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] border border-amber-500/5 rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-neutral-900/80 border border-amber-500/30 rounded-3xl p-6 sm:p-8 md:p-9 backdrop-blur-2xl shadow-[0_10px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(245,158,11,0.12)] relative z-10"
      >
        {/* Header Badge & Title */}
        <div className="text-center mb-8 relative">
          <div className="inline-flex items-center justify-center p-3.5 bg-gradient-to-br from-amber-500/25 to-orange-500/15 border border-amber-500/40 rounded-2xl text-amber-400 mb-4 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
            <Shield size={28} className="drop-shadow" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
            Vedic Matrimony Portal
          </h1>
          <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[11px] font-semibold text-amber-300 tracking-wider uppercase">
            <Sparkles size={12} className="text-amber-400" />
            <span>Confidential & Verified Matching</span>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs flex items-start gap-2.5 shadow-inner"
          >
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
            <span className="leading-relaxed">{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold text-amber-200/80 uppercase tracking-widest mb-2">
              Membership Username
            </label>
            <div className="relative group">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-amber-400 transition-colors" />
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. ap_rahul_4821"
                className="w-full bg-black/50 border border-white/10 group-hover:border-white/20 focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/20 focus:outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-amber-200/80 uppercase tracking-widest mb-2">
              Password
            </label>
            <div className="relative group">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-amber-400 transition-colors" />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/50 border border-white/10 group-hover:border-white/20 focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/20 focus:outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black font-bold text-sm rounded-2xl shadow-[0_4px_25px_rgba(245,158,11,0.3)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Enter Matrimony Portal</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Offline Registration Notice */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <div className="flex items-center justify-center gap-2 mb-2 text-white/70 text-xs">
            <HeartHandshake size={14} className="text-amber-400" />
            <span className="font-semibold">Vedic Offline Membership</span>
          </div>
          <p className="text-[11px] text-white/50 leading-relaxed max-w-xs mx-auto">
            Accounts are enrolled exclusively at our AstroPravin office. Your temporary credentials will be issued upon profile verification.
          </p>
          <a
            href="https://wa.me/919921697908?text=Hello%20Pandit%20Pravin,%20I%20would%20like%20to%20enroll%20for%20AstroPravin%20Matrimony%20Membership."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl text-xs font-semibold text-amber-300 transition-all hover:scale-105"
          >
            <PhoneCall size={13} />
            <span>Need Help? Contact Pandit Acharya Pravin</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default React.memo(MatrimonyLogin);
