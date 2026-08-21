import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, Search, Heart, MessageSquare, ShieldCheck,
  AlertTriangle, ArrowRight, Compass, Users, CheckCircle2, PhoneCall
} from 'lucide-react';
import { LotusCrest, ToranBorder } from '../components/MatrimonyDecorativeArt';

const PortalDashboard = ({ user, profile, completeness, onNavigateTab }) => {
  const isVerified = user?.status === 'verified' || user?.status === 'active';
  const isPendingVerification = user?.status === 'pending_verification';
  const isPendingProfile = user?.status === 'pending_profile';

  return (
    <div className="space-y-6">
      {/* ── Status Banner (Verification Review) ── */}
      {isPendingVerification && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-[#FFFBEB] border border-[#FCD34D] rounded-2xl flex items-start gap-3 text-[#B45309] text-xs shadow-sm"
        >
          <AlertTriangle size={18} className="shrink-0 mt-0.5 text-[#D97706]" />
          <div className="space-y-1">
            <span className="font-bold block">Profile Under Astrological Review</span>
            <p className="text-[#574F47] leading-relaxed">
              Your profile is undergoing confidential review by Pandit Acharya Pravin. Once verified, your horoscope details will be highlighted for Ashta Koota matching.
            </p>
          </div>
        </motion.div>
      )}

      {isPendingProfile && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-[#FFF7ED] border border-[#FFEDD5] rounded-2xl flex items-center justify-between gap-4 text-[#C2410C] text-xs flex-wrap shadow-sm"
        >
          <div className="flex items-center gap-3">
            <Sparkles size={18} className="shrink-0 text-[#EA580C]" />
            <div>
              <span className="font-bold block">Complete Your Astrological & Family Details</span>
              <p className="text-[#574F47]">Fill out your Rashi, Nakshatra, and preferences to discover higher Guna matches.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('wizard')}
            className="px-4 py-2 bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white font-bold text-xs rounded-xl shadow-md hover:brightness-105 transition-all cursor-pointer"
          >
            Complete Profile Wizard →
          </button>
        </motion.div>
      )}

      {/* ── Welcome & Profile Completeness Card ── */}
      <div className="bg-white border border-[#EADCC8] rounded-3xl p-6 md:p-8 shadow-[0_10px_35px_rgba(194,65,12,0.04)] relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] text-[10px] font-bold uppercase rounded-lg">
                {user?.tier || 'Basic'} Vedic Member
              </span>
              <span className="px-3 py-1 bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D] text-[10px] font-bold uppercase rounded-lg flex items-center gap-1">
                <ShieldCheck size={12} /> Fee Paid & Verified
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1C1917]">
              Namaste, <span className="text-[#C2410C]">{profile?.fullName || user?.fullName || user?.username}</span>
            </h2>
            <p className="text-xs text-[#78716C] max-w-md leading-relaxed">
              Explore verified Vedic matches, calculate Ashta Koota 36-Guna compatibility, and send confidential connection interests.
            </p>
          </div>

          {/* Completeness Gauge */}
          <div className="bg-[#FAF8F5] border border-[#EADCC8] rounded-2xl p-5 w-full md:w-64 space-y-2 text-center shadow-inner">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#78716C] font-medium">Profile Completeness</span>
              <span className="font-bold font-mono text-[#C2410C]">{completeness || profile?.profileCompleteness || 35}%</span>
            </div>
            <div className="w-full bg-[#E5D7C5] h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#D97706] to-[#C2410C] h-full rounded-full transition-all duration-500"
                style={{ width: `${completeness || profile?.profileCompleteness || 35}%` }}
              />
            </div>
            <button
              onClick={() => onNavigateTab('wizard')}
              className="text-[11px] font-bold text-[#C2410C] hover:underline block w-full mt-2"
            >
              Update / Edit Profile Details
            </button>
          </div>
        </div>
      </div>

      {/* ── Quick Action Grid (Luxury Light Tiles) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            title: 'Search Matches',
            desc: 'Browse verified candidates with astrological, rashi & lifestyle filters.',
            icon: Search,
            tab: 'search',
            btnText: 'Search Profiles',
            color: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
          },
          {
            title: 'Interests Inbox',
            desc: 'Manage incoming connection requests and sent connection interests.',
            icon: Heart,
            tab: 'interests',
            btnText: 'View Interests',
            color: 'bg-[#FFF1F2] text-[#BE123C] border-[#FECDD3]',
          },
          {
            title: 'Mutual Match Chat',
            desc: 'Direct confidential messaging with accepted horoscope matches.',
            icon: MessageSquare,
            tab: 'chat',
            btnText: 'Open Chat',
            color: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
          },
        ].map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.title}
              onClick={() => onNavigateTab(act.tab)}
              className="group bg-white border border-[#EADCC8] hover:border-[#C2410C]/40 rounded-3xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 hover:shadow-[0_12px_35px_rgba(194,65,12,0.08)] hover:-translate-y-0.5"
            >
              <div className="space-y-3">
                <div className={`p-3 rounded-2xl w-fit border ${act.color} shadow-sm`}>
                  <Icon size={22} />
                </div>
                <h3 className="text-base font-serif font-bold text-[#1C1917] group-hover:text-[#C2410C] transition-colors">
                  {act.title}
                </h3>
                <p className="text-xs text-[#78716C] leading-relaxed">{act.desc}</p>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-[#C2410C] group-hover:translate-x-1 transition-transform">
                <span>{act.btnText}</span>
                <ArrowRight size={14} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Pandit Consultation Banner ── */}
      <div className="bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7]/40 to-[#FFF7ED] border border-[#FCD34D] rounded-3xl p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B45309]">Astrological Guidance</span>
          <h4 className="text-base font-serif font-bold text-[#1C1917]">Need 36-Guna Kundli Matchmaking Consultation?</h4>
          <p className="text-xs text-[#574F47]">
            Connect directly with Pandit Acharya Pravin for personalized horoscope matching and marital remedy advice.
          </p>
        </div>
        <a
          href="https://wa.me/919921697908?text=Namaste%20Pandit%20Pravin,%20I%20would%20like%20to%20consult%20regarding%20Matrimony%20horoscope%20matching."
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 hover:scale-105"
        >
          <PhoneCall size={14} />
          <span>Consult Pandit Pravin</span>
        </a>
      </div>
    </div>
  );
};

export default React.memo(PortalDashboard);
