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
          <h3 className="text-lg font-serif font-bold text-[#1C1917]">Matrimony Management Overview</h3>
          <p className="text-xs text-[#78716C]">Real-time status of members, verifications, and engagement</p>
        </div>
        <button
          onClick={fetchData}
          className="px-3.5 py-2 bg-white hover:bg-[#FFF7ED] text-[#44403C] hover:text-[#C2410C] rounded-xl border border-[#EADCC8] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Members', value: stats?.total || 0, color: 'text-[#1C1917]', icon: Users },
          { label: 'Active / Verified', value: (stats?.active || 0) + (stats?.verified || 0), color: 'text-emerald-700', icon: UserCheck },
          { label: 'Pending Verification', value: stats?.pending || 0, color: 'text-[#C2410C]', icon: Clock, jump: 'verification' },
          { label: 'Pending Photos', value: stats?.pendingPhotos || 0, color: 'text-[#D97706]', icon: Camera, jump: 'photos' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              onClick={() => s.jump && onJumpTab(s.jump)}
              className={`bg-white border border-[#EADCC8] rounded-3xl p-5 shadow-luxury transition-all ${
                s.jump ? 'cursor-pointer hover:border-[#FED7AA] hover:bg-[#FFFDF9]' : ''
              }`}
            >
              <div className="flex items-center justify-between text-[#78716C] mb-2">
                <span className="text-xs font-bold uppercase">{s.label}</span>
                <Icon size={16} className="text-[#C2410C]" />
              </div>
              <div className={`text-3xl font-serif font-bold ${s.color}`}>
                {loading ? '...' : s.value}
              </div>
              {s.jump && (
                <div className="flex items-center gap-1 text-[11px] text-[#C2410C] mt-2 font-bold">
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
        <div className="bg-white border border-[#EADCC8] rounded-3xl p-5 shadow-sm space-y-1">
          <span className="text-xs font-bold text-[#78716C] uppercase">Profile Views (Last 30 Days)</span>
          <div className="text-2xl font-serif font-bold text-blue-700">
            {activity?.viewsLast30Days ?? 0}
          </div>
        </div>

        <div className="bg-white border border-[#EADCC8] rounded-3xl p-5 shadow-sm space-y-1">
          <span className="text-xs font-bold text-[#78716C] uppercase">Interests Sent (Last 30 Days)</span>
          <div className="text-2xl font-serif font-bold text-rose-700">
            {activity?.interestsLast30Days ?? 0}
          </div>
        </div>

        <div className="bg-white border border-[#EADCC8] rounded-3xl p-5 shadow-sm space-y-1">
          <span className="text-xs font-bold text-[#78716C] uppercase">Messages Exchanged (30 Days)</span>
          <div className="text-2xl font-serif font-bold text-emerald-700">
            {activity?.messagesLast30Days ?? 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(OverviewSection);
