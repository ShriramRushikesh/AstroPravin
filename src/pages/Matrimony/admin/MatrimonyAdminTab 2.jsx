import React, { useState, Suspense, lazy } from 'react';
import {
  LayoutDashboard, Users, ShieldCheck, Camera,
  Kanban, Sliders, FileText, BarChart2
} from 'lucide-react';

const OverviewSection = lazy(() => import('./OverviewSection'));
const MemberManagementSection = lazy(() => import('./MemberManagementSection'));
const VerificationQueueSection = lazy(() => import('./VerificationQueueSection'));
const PhotoReviewSection = lazy(() => import('./PhotoReviewSection'));
const CrmPipelineSection = lazy(() => import('./CrmPipelineSection'));
const SettingsVisibilitySection = lazy(() => import('./SettingsVisibilitySection'));
const AuditLogSection = lazy(() => import('./AuditLogSection'));
const AnalyticsSection = lazy(() => import('./AnalyticsSection'));

const SubTabLoader = () => (
  <div className="py-16 text-center text-xs text-[#78716C]">Loading section...</div>
);

const MatrimonyAdminTab = () => {
  const [activeSubTab, setActiveSubTab] = useState('overview');

  const subTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'members', label: 'Members Directory', icon: Users },
    { id: 'verification', label: 'Verification Queue', icon: ShieldCheck },
    { id: 'photos', label: 'Photo Moderation', icon: Camera },
    { id: 'crm', label: 'CRM Pipeline', icon: Kanban },
    { id: 'settings', label: 'Rules & Limits', icon: Sliders },
    { id: 'audit', label: 'Audit Log', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  ];

  return (
    <div className="space-y-6">
      {/* ── Sub Navigation Switcher ─────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 overflow-x-auto bg-white border border-[#EADCC8] p-2 rounded-3xl shadow-sm pb-2">
        {subTabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeSubTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(t.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white shadow-sm'
                  : 'text-[#44403C] hover:text-[#C2410C] hover:bg-[#FFF7ED]'
              }`}
            >
              <Icon size={14} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Sub Tab Content ─────────────────────────────────────────────── */}
      <Suspense fallback={<SubTabLoader />}>
        {activeSubTab === 'overview' && (
          <OverviewSection onJumpTab={(tabId) => setActiveSubTab(tabId)} />
        )}
        {activeSubTab === 'members' && <MemberManagementSection />}
        {activeSubTab === 'verification' && <VerificationQueueSection />}
        {activeSubTab === 'photos' && <PhotoReviewSection />}
        {activeSubTab === 'crm' && <CrmPipelineSection />}
        {activeSubTab === 'settings' && <SettingsVisibilitySection />}
        {activeSubTab === 'audit' && <AuditLogSection />}
        {activeSubTab === 'analytics' && <AnalyticsSection />}
      </Suspense>
    </div>
  );
};

export default React.memo(MatrimonyAdminTab);
