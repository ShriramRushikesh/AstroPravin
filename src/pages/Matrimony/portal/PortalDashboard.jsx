import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, Search, Heart, MessageSquare, ShieldCheck,
  AlertTriangle, ArrowRight, Compass, Users, CheckCircle2
} from 'lucide-react';

const PortalDashboard = ({ user, profile, completeness, onNavigateTab }) => {
  const isVerified = user?.status === 'verified' || user?.status === 'active';
  const isPendingVerification = user?.status === 'pending_verification';
  const isPendingProfile = user?.status === 'pending_profile';

  return (
    <div className="space-y-6">
      {/* ── Status Banner ── */}
      {isPendingVerification && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-amber-300 text-xs"
        >
          <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-400" />
          <div className="space-y-1">
            <span className="font-bold block">Profile Awaiting Admin Verification</span>
            <p className="text-white/70 leading-relaxed">
              Your profile is under review by Pandit Acharya Pravin and our matrimony team. Once verified, your profile will be made active in search results.
            </p>
          </div>
        </motion.div>
      )}

      {isPendingProfile && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-2xl flex items-center justify-between gap-4 text-orange-300 text-xs flex-wrap"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle size={18} className="shrink-0 text-orange-400" />
            <div>
              <span className="font-bold block">Complete Your Profile Setup</span>
              <p className="text-white/70">Please fill out all 7 steps in the profile wizard to begin matching.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('wizard')}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold text-xs rounded-xl shadow-md hover:brightness-110"
          >
            Complete Wizard →
          </button>
        </motion.div>
      )}

      {/* ── Welcome & Profile Completeness Card ── */}
      <div className="bg-gradient-to-br from-neutral-900/90 via-neutral-900/60 to-amber-950/20 border border-amber-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase rounded-lg">
                Tier: {user?.tier || 'Basic'} Member
              </span>
              {isVerified && (
                <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase rounded-lg flex items-center gap-1">
                  <ShieldCheck size={12} /> Verified Profile
                </span>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">
              Namaste, <span className="text-amber-300">{profile?.fullName || user?.username}</span>
            </h2>
            <p className="text-xs text-white/60 max-w-md leading-relaxed">
              Explore verified Vedic matches, check 36-Guna Kundli compatibility, and send confidential connection interests.
            </p>
          </div>

          {/* Completeness Gauge */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-5 w-full md:w-64 space-y-2 text-center">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">Profile Completeness</span>
              <span className="font-bold font-mono text-amber-400">{completeness || profile?.profileCompleteness || 0}%</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${completeness || profile?.profileCompleteness || 15}%` }}
              />
            </div>
            <button
              onClick={() => onNavigateTab('wizard')}
              className="text-[11px] text-amber-400/80 hover:text-amber-300 underline block w-full mt-2"
            >
              Update / Edit Profile Details
            </button>
          </div>
        </div>
      </div>

      {/* ── Quick Action Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            title: 'Search Matches',
            desc: 'Browse verified candidates with astrological & lifestyle filters.',
            icon: Search,
            tab: 'search',
            btnText: 'Search Profiles',
            color: 'from-amber-500/20 to-orange-500/10 text-amber-400',
          },
          {
            title: 'Interests Inbox',
            desc: 'Manage incoming connection requests and sent interests.',
            icon: Heart,
            tab: 'interests',
            btnText: 'View Interests',
            color: 'from-rose-500/20 to-pink-500/10 text-rose-400',
          },
          {
            title: 'Mutual Match Chat',
            desc: 'Direct confidential messaging with accepted matches.',
            icon: MessageSquare,
            tab: 'chat',
            btnText: 'Open Chat',
            color: 'from-blue-500/20 to-cyan-500/10 text-blue-400',
          },
        ].map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.title}
              onClick={() => onNavigateTab(act.tab)}
              className="group bg-neutral-900/80 border border-white/10 hover:border-amber-500/40 rounded-3xl p-6 backdrop-blur-xl transition-all cursor-pointer flex flex-col justify-between space-y-4 hover:shadow-xl"
            >
              <div className="space-y-3">
                <div className={`p-3.5 rounded-2xl w-fit bg-gradient-to-br border border-white/10 ${act.color}`}>
                  <Icon size={22} />
                </div>
                <h3 className="text-base font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                  {act.title}
                </h3>
                <p className="text-xs text-white/60 leading-relaxed">{act.desc}</p>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>{act.btnText}</span>
                <ArrowRight size={14} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(PortalDashboard);
