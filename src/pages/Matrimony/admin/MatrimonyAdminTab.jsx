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
  <div className="py-16 text-center text-xs text-white/40">Loading section...</div>
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
      <div className="flex items-center gap-1.5 overflow-x-auto bg-white/5 border border-white/10 p-2 rounded-2xl backdrop-blur-md pb-2">
        {subTabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeSubTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(t.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/30 to-amber-600/30 text-amber-300 border border-amber-500/40 shadow-lg'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
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
