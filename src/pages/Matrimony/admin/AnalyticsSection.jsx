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
    <div className="space-y-6 text-[#1C1917]">
      <div className="bg-white border border-[#EADCC8] p-5 rounded-3xl shadow-luxury">
        <h3 className="text-lg font-serif font-bold text-[#1C1917]">Matrimony Performance Analytics</h3>
        <p className="text-xs text-[#78716C]">Growth metrics, engagement funnel, and member activity</p>
      </div>

      {/* Funnel Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#EADCC8] rounded-3xl p-6 shadow-luxury space-y-4">
          <div className="flex items-center gap-2 text-[#C2410C] font-serif font-bold text-sm">
            <Users size={16} />
            <span>Member Onboarding Funnel</span>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between pb-2 border-b border-[#EADCC8]/60">
              <span className="text-[#78716C]">Total Enrolled:</span>
              <span className="font-bold text-[#1C1917]">{overview?.total || 0}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#EADCC8]/60">
              <span className="text-[#78716C]">Verified Active:</span>
              <span className="font-bold text-emerald-700">{(overview?.active || 0) + (overview?.verified || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#78716C]">Pending Verification:</span>
              <span className="font-bold text-[#C2410C]">{overview?.pending || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#EADCC8] rounded-3xl p-6 shadow-luxury space-y-4">
          <div className="flex items-center gap-2 text-rose-700 font-serif font-bold text-sm">
            <Heart size={16} />
            <span>Engagement & Matchmaking</span>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between pb-2 border-b border-[#EADCC8]/60">
              <span className="text-[#78716C]">30-Day Profile Views:</span>
              <span className="font-bold text-[#1C1917]">{activity?.viewsLast30Days || 0}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#EADCC8]/60">
              <span className="text-[#78716C]">30-Day Interests Sent:</span>
              <span className="font-bold text-rose-700">{activity?.interestsLast30Days || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#78716C]">30-Day Messages:</span>
              <span className="font-bold text-emerald-700">{activity?.messagesLast30Days || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#EADCC8] rounded-3xl p-6 shadow-luxury space-y-4">
          <div className="flex items-center gap-2 text-blue-700 font-serif font-bold text-sm">
            <TrendingUp size={16} />
            <span>CRM Sales Conversion</span>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between pb-2 border-b border-[#EADCC8]/60">
              <span className="text-[#78716C]">Total Pipeline Leads:</span>
              <span className="font-bold text-[#1C1917]">{crmStats?.totalLeads || 0}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#EADCC8]/60">
              <span className="text-[#78716C]">Conversion Rate:</span>
              <span className="font-bold text-emerald-700">{crmStats?.conversionRate || '0%'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#78716C]">Today's Follow-ups:</span>
              <span className="font-bold text-[#C2410C]">{crmStats?.todayFollowUps || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AnalyticsSection);
