import { API_URL } from '../../config';
import { UserCheck, Eye, Heart, MessageSquare, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';

const PortalDashboard = ({ userState, myProfile, onNavigateTab }) => {
  return (
    <div className="space-y-6">
      {/* ── Status Banner (Rule-driven from UserStateResolver) ──────────────── */}
      {userState?.banner && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-bold ${
          userState.is_suspended
            ? 'bg-red-950/40 border-red-500/40 text-red-300'
            : userState.verification_status === 'verified'
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
            : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
        }`}>
          <AlertTriangle size={18} className="shrink-0" />
          <span>{userState.banner}</span>
        </div>
      )}

      {/* ── Welcome & Profile Overview Card ─────────────────────────────────── */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/20 rounded-3xl p-6 relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-serif font-bold text-white">
                Namaste, {myProfile?.full_name || 'Member'}
              </h2>
              {userState?.verification_status === 'verified' && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                  <ShieldCheck size={12} /> Verified Profile
                </span>
              )}
            </div>
            <p className="text-xs text-white/50 mt-1">
              Member Code: <strong className="text-amber-400 font-mono">{myProfile?.code}</strong> • Active Tier: <strong className="text-amber-300 uppercase font-bold">{userState?.tier || 'Free'}</strong>
            </p>
          </div>

          {/* Profile Completeness Circle */}
          <div className="flex items-center gap-3 bg-black/40 border border-white/10 px-4 py-2.5 rounded-2xl">
            <div className="text-right">
              <div className="text-xs font-bold text-white">Profile Strength</div>
              <div className="text-[10px] text-white/40">{userState?.completeness}% Completed</div>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-amber-500 flex items-center justify-center text-xs font-bold text-amber-300 font-serif">
              {userState?.completeness}%
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Activity Metric Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Profile Views', value: '12', icon: Eye, color: 'text-blue-400', tab: 'views' },
          { label: 'Interests Received', value: '4', icon: Heart, color: 'text-amber-400', tab: 'interests' },
          { label: 'Mutual Matches', value: '2', icon: Sparkles, color: 'text-emerald-400', tab: 'interests' },
          { label: 'Messages', value: '5', icon: MessageSquare, color: 'text-purple-400', tab: 'chat' },
        ].map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.label}
              onClick={() => onNavigateTab(m.tab)}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left hover:bg-white/10 transition-all"
            >
              <div className="flex justify-between items-center mb-2">
                <Icon size={18} className={m.color} />
                <span className={`text-2xl font-bold font-serif ${m.color}`}>{m.value}</span>
              </div>
              <div className="text-xs text-white/60 font-semibold">{m.label}</div>
            </button>
          );
        })}
      </div>

      {/* ── Plan Limit Feature Access Summary ────────────────────────────────── */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
        <h3 className="text-lg font-serif font-bold text-white">Your Plan Privileges ({userState?.tier?.toUpperCase()})</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className={`p-3 rounded-xl border ${userState?.features?.contacts_visible ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-black/30 border-white/10 text-white/40'}`}>
            📞 Phone/Email Contact Unlock: {userState?.features?.contacts_visible ? 'ENABLED' : 'LOCKED (Upgrade to Silver+)'}
          </div>
          <div className="p-3 rounded-xl border bg-black/30 border-white/10 text-white/70">
            💌 Interests Limit: {userState?.features?.interests_per_day} Per Day
          </div>
          <div className={`p-3 rounded-xl border ${userState?.features?.chat_enabled ? 'bg-purple-500/10 border-purple-500/30 text-purple-300' : 'bg-black/30 border-white/10 text-white/40'}`}>
            💬 Mutual In-App Chat: {userState?.features?.chat_enabled ? 'ENABLED' : 'LOCKED (Upgrade to Silver+)'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalDashboard;
