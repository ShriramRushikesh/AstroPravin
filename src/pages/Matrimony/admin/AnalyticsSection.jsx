import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Heart, MessageSquare, BarChart2 } from 'lucide-react';
import { matrimonyAdminService } from '../../../services/matrimonyAdminService';

const AnalyticsSection = () => {
  const [overview, setOverview] = useState(null);
  const [activity, setActivity] = useState(null);
  const [crmStats, setCrmStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [ov, act, crm] = await Promise.all([
          matrimonyAdminService.getOverviewAnalytics(),
          matrimonyAdminService.getActivityAnalytics(),
          matrimonyAdminService.getCrmDashboard(),
        ]);
        setOverview(ov);
        setActivity(act);
        setCrmStats(crm);
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
        <h3 className="text-lg font-serif font-bold text-white">Matrimony Performance Analytics</h3>
        <p className="text-xs text-white/50">Growth metrics, engagement funnel, and member activity</p>
      </div>

      {/* Funnel Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-sm">
            <Users size={16} />
            <span>Member Onboarding Funnel</span>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-white/60">Total Enrolled:</span>
              <span className="font-bold text-white">{overview?.total || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Verified Active:</span>
              <span className="font-bold text-emerald-400">{(overview?.active || 0) + (overview?.verified || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Pending Verification:</span>
              <span className="font-bold text-amber-400">{overview?.pending || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 text-rose-400 font-serif font-bold text-sm">
            <Heart size={16} />
            <span>Engagement & Matchmaking</span>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-white/60">30-Day Profile Views:</span>
              <span className="font-bold text-white">{activity?.viewsLast30Days || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">30-Day Interests Sent:</span>
              <span className="font-bold text-rose-400">{activity?.interestsLast30Days || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">30-Day Messages:</span>
              <span className="font-bold text-emerald-400">{activity?.messagesLast30Days || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 text-blue-400 font-serif font-bold text-sm">
            <TrendingUp size={16} />
            <span>CRM Sales Conversion</span>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-white/60">Total Pipeline Leads:</span>
              <span className="font-bold text-white">{crmStats?.totalLeads || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Conversion Rate:</span>
              <span className="font-bold text-emerald-400">{crmStats?.conversionRate || '0%'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Today's Follow-ups:</span>
              <span className="font-bold text-amber-400">{crmStats?.todayFollowUps || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AnalyticsSection);
