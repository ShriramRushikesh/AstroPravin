import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Lock, User, Sparkles, ArrowRight, AlertCircle,
  PhoneCall, HeartHandshake, Calendar, MapPin, CheckCircle2, UserPlus, LogIn
} from 'lucide-react';
import { LotusCrest, ToranBorder, MandalaWatermark } from '../components/MatrimonyDecorativeArt';

const MatrimonyLogin = ({ onLoginSuccess, onRegisterSuccess }) => {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  
  // Login State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register State
  const [registerData, setRegisterData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    gender: 'female',
    dateOfBirth: '',
    caste: 'Brahmin',
    subCaste: '',
    religion: 'Hindu',
    currentCity: 'Pune',
    currentState: 'Maharashtra',
    motherTongue: 'Marathi',
    profileCreatedBy: 'Self',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onLoginSuccess(loginIdentifier.trim(), loginPassword);
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!registerData.fullName.trim()) {
      setError('Please enter candidate full name.');
      return;
    }
    if (!registerData.phone.trim() || registerData.phone.trim().length < 10) {
      setError('Please enter a valid 10-digit WhatsApp phone number.');
      return;
    }
    if (!registerData.dateOfBirth) {
      setError('Please select candidate Date of Birth.');
      return;
    }
    if (!registerData.password || registerData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      if (onRegisterSuccess) {
        await onRegisterSuccess(registerData);
      } else {
        await onLoginSuccess(registerData.phone.trim(), registerData.password);
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please check the details or contact support.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 py-12">
      {/* Background Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
        <MandalaWatermark size={700} opacity={0.035} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl bg-white border border-[#EADCC8] rounded-3xl p-6 sm:p-9 shadow-[0_20px_60px_rgba(194,65,12,0.06),0_2px_10px_rgba(0,0,0,0.03)] relative z-10"
      >
        {/* Header Crest & Vedic Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-2">
            <LotusCrest size={44} />
          </div>
          <ToranBorder className="mb-3" />

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917] tracking-tight">
            AstroPravin Matrimony
          </h1>
          <p className="text-xs text-[#78716C] max-w-sm mx-auto mt-1">
            Pandit Pravin Shriram's Confidential & Verified Matchmaking
          </p>

          {/* Mode Switcher Tabs */}
          <div className="mt-5 p-1 bg-[#FAF8F5] border border-[#EADCC8] rounded-2xl flex items-center gap-1 max-w-xs mx-auto shadow-inner">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white text-[#C2410C] shadow-sm border border-[#EADCC8]'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              <LogIn size={13} />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => { setAuthMode('register'); setError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'register'
                  ? 'bg-white text-[#C2410C] shadow-sm border border-[#EADCC8]'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              <UserPlus size={13} />
              <span>New Registration</span>
            </button>
          </div>
        </div>

        {/* Upfront Registration Fee Disclosure Banner (When in register mode) */}
        {authMode === 'register' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7]/40 to-[#FFF7ED] border border-[#FCD34D] rounded-2xl p-4 text-xs text-[#78716C] space-y-2 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#B45309] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#D97706]" />
                Transparent One-Time Registration Fee
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif font-extrabold text-[#C2410C] text-lg">₹1,100</span>
                <span className="line-through text-[#A8A29E] text-xs">₹2,100</span>
              </div>
            </div>
            <p className="text-[11px] leading-relaxed text-[#574F47]">
              Access to full matchmaking, verified profiles, and 36-Guna Kundli matching requires a one-time verification fee after profile creation.
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-[10px] text-[#44403C] pt-1">
              <div className="flex items-center gap-1">
                <CheckCircle2 size={12} className="text-[#15803D] shrink-0" />
                <span>Pandit Verified Profiles</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 size={12} className="text-[#15803D] shrink-0" />
                <span>Ashta Koota Kundli Milan</span>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3.5 bg-[#FEF2F2] border border-[#FECACA] rounded-2xl text-[#B91C1C] text-xs flex items-start gap-2.5 shadow-inner"
          >
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </motion.div>
        )}

        {/* ── Sign In Form ────────────────────────────────────────────── */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-[#574F47] uppercase tracking-wider mb-1.5">
                Username or Phone Number
              </label>
              <div className="relative group">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E] group-focus-within:text-[#C2410C] transition-colors" />
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="e.g. 9921697908 or ap_rahul_4821"
                  className="w-full bg-[#FAF8F5] border border-[#EADCC8] group-hover:border-[#D4AF37] focus:border-[#C2410C] focus:bg-white focus:ring-2 focus:ring-[#C2410C]/20 rounded-2xl py-3.5 pl-11 pr-4 text-xs sm:text-sm text-[#1C1917] placeholder-[#A8A29E] focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#574F47] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative group">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E] group-focus-within:text-[#C2410C] transition-colors" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FAF8F5] border border-[#EADCC8] group-hover:border-[#D4AF37] focus:border-[#C2410C] focus:bg-white focus:ring-2 focus:ring-[#C2410C]/20 rounded-2xl py-3.5 pl-11 pr-4 text-xs sm:text-sm text-[#1C1917] placeholder-[#A8A29E] focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-[#C2410C]/20 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Enter Matrimony</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        {/* ── New Candidate Registration Form ────────────────────────────── */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-[#574F47] uppercase tracking-wider mb-1">
                  Candidate Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={registerData.fullName}
                  onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                  placeholder="e.g. Rahul Patil"
                  className="w-full bg-[#FAF8F5] border border-[#EADCC8] focus:border-[#C2410C] focus:bg-white focus:ring-2 focus:ring-[#C2410C]/20 rounded-xl py-2.5 px-3 text-xs text-[#1C1917] placeholder-[#A8A29E] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#574F47] uppercase tracking-wider mb-1">
                  Looking For (Gender) *
                </label>
                <select
                  value={registerData.gender}
                  onChange={(e) => setRegisterData({ ...registerData, gender: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#EADCC8] focus:border-[#C2410C] focus:bg-white focus:ring-2 focus:ring-[#C2410C]/20 rounded-xl py-2.5 px-3 text-xs text-[#1C1917] outline-none cursor-pointer"
                >
                  <option value="female">Bride (Female)</option>
                  <option value="male">Groom (Male)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-[#574F47] uppercase tracking-wider mb-1">
                  WhatsApp Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  placeholder="e.g. 9921697908"
                  className="w-full bg-[#FAF8F5] border border-[#EADCC8] focus:border-[#C2410C] focus:bg-white focus:ring-2 focus:ring-[#C2410C]/20 rounded-xl py-2.5 px-3 text-xs text-[#1C1917] placeholder-[#A8A29E] font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#574F47] uppercase tracking-wider mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  required
                  value={registerData.dateOfBirth}
                  onChange={(e) => setRegisterData({ ...registerData, dateOfBirth: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#EADCC8] focus:border-[#C2410C] focus:bg-white focus:ring-2 focus:ring-[#C2410C]/20 rounded-xl py-2.5 px-3 text-xs text-[#1C1917] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-[#574F47] uppercase tracking-wider mb-1">
                  Caste / Community
                </label>
                <input
                  type="text"
                  value={registerData.caste}
                  onChange={(e) => setRegisterData({ ...registerData, caste: e.target.value })}
                  placeholder="e.g. Maratha, Brahmin, Lingayat"
                  className="w-full bg-[#FAF8F5] border border-[#EADCC8] focus:border-[#C2410C] focus:bg-white focus:ring-2 focus:ring-[#C2410C]/20 rounded-xl py-2.5 px-3 text-xs text-[#1C1917] placeholder-[#A8A29E] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#574F47] uppercase tracking-wider mb-1">
                  Current City & State
                </label>
                <input
                  type="text"
                  value={registerData.currentCity}
                  onChange={(e) => setRegisterData({ ...registerData, currentCity: e.target.value })}
                  placeholder="e.g. Solapur, Pune, Mumbai"
                  className="w-full bg-[#FAF8F5] border border-[#EADCC8] focus:border-[#C2410C] focus:bg-white focus:ring-2 focus:ring-[#C2410C]/20 rounded-xl py-2.5 px-3 text-xs text-[#1C1917] placeholder-[#A8A29E] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#574F47] uppercase tracking-wider mb-1">
                Create Account Password (min 6 characters) *
              </label>
              <input
                type="password"
                required
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                placeholder="Create a secure password"
                className="w-full bg-[#FAF8F5] border border-[#EADCC8] focus:border-[#C2410C] focus:bg-white focus:ring-2 focus:ring-[#C2410C]/20 rounded-xl py-2.5 px-3 text-xs text-[#1C1917] placeholder-[#A8A29E] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-[#C2410C]/20 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-3 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account & Proceed to Activation (₹1,100)</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        {/* Offline Support & Pandit Helpline */}
        <div className="mt-7 pt-5 border-t border-[#F5EFE6] text-center">
          <p className="text-[11px] text-[#78716C] leading-relaxed">
            Need consultation or custom assistance with horoscope matchmaking?
          </p>
          <a
            href="https://wa.me/919921697908?text=Hello%20Pandit%20Pravin,%20I%20need%20help%20with%20AstroPravin%20Matrimony%20Membership."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#FAF8F5] hover:bg-[#F5EFE6] border border-[#EADCC8] rounded-xl text-xs font-bold text-[#C2410C] transition-all hover:scale-105 shadow-sm"
          >
            <PhoneCall size={13} />
            <span>Contact Pandit Pravin Shriram (+91 99216 97908)</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default React.memo(MatrimonyLogin);
