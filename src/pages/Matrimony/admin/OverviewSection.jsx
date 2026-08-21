import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Clock, ShieldAlert, Sparkles, Camera, ArrowRight, RefreshCw } from 'lucide-react';
import { matrimonyAdminService } from '../../../services/matrimonyAdminService';

const OverviewSection = ({ onJumpTab }) => {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [overviewData, activityData] = await Promise.all([
        matrimonyAdminService.getOverviewAnalytics(),
        matrimonyAdminService.getActivityAnalytics(),
      ]);
      setStats(overviewData);
      setActivity(activityData);
    } catch (err) {
      console.error('Failed to load overview data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-serif font-bold text-white">Matrimony Management Overview</h3>
          <p className="text-xs text-white/50">Real-time status of members, verifications, and engagement</p>
        </div>
        <button
          onClick={fetchData}
          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl border border-white/10 text-xs flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Members', value: stats?.total || 0, color: 'text-white', icon: Users },
          { label: 'Active / Verified', value: (stats?.active || 0) + (stats?.verified || 0), color: 'text-emerald-400', icon: UserCheck },
          { label: 'Pending Verification', value: stats?.pending || 0, color: 'text-amber-400', icon: Clock, jump: 'verification' },
          { label: 'Pending Photos', value: stats?.pendingPhotos || 0, color: 'text-purple-400', icon: Camera, jump: 'photos' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              onClick={() => s.jump && onJumpTab(s.jump)}
              className={`bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md transition-all ${
                s.jump ? 'cursor-pointer hover:border-amber-500/40 hover:bg-white/10' : ''
              }`}
            >
              <div className="flex items-center justify-between text-white/40 mb-2">
                <span className="text-xs">{s.label}</span>
                <Icon size={16} />
              </div>
              <div className={`text-3xl font-serif font-bold ${s.color}`}>
                {loading ? '...' : s.value}
              </div>
              {s.jump && (
                <div className="flex items-center gap-1 text-[10px] text-amber-400 mt-2 font-medium">
                  <span>Review Queue</span>
                  <ArrowRight size={11} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Activity Overview ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-1">
          <span className="text-xs text-white/50">Profile Views (Last 30 Days)</span>
          <div className="text-2xl font-serif font-bold text-blue-400">
            {activity?.viewsLast30Days ?? 0}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-1">
          <span className="text-xs text-white/50">Interests Sent (Last 30 Days)</span>
          <div className="text-2xl font-serif font-bold text-rose-400">
            {activity?.interestsLast30Days ?? 0}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-1">
          <span className="text-xs text-white/50">Messages Exchanged (30 Days)</span>
          <div className="text-2xl font-serif font-bold text-emerald-400">
            {activity?.messagesLast30Days ?? 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(OverviewSection);
