import React, { useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, LayoutDashboard, Search, Heart, MessageSquare,
  Star, User, LogOut, Sparkles, AlertCircle, CreditCard
} from 'lucide-react';
import { useMatrimonyAuth } from './hooks/useMatrimonyAuth';
import MatrimonyLogin from './auth/MatrimonyLogin';
import ForceChangePassword from './auth/ForceChangePassword';
import MembershipPaymentGate from './components/MembershipPaymentGate';
import { MatrimonyAmbientBackground, LotusCrest, ToranBorder } from './components/MatrimonyDecorativeArt';

// ── Lazy-loaded tab views ───────────────────────────────────────────────────
const PortalDashboard = lazy(() => import('./portal/PortalDashboard'));
const SearchMatches = lazy(() => import('./portal/SearchMatches'));
const InterestsInbox = lazy(() => import('./portal/InterestsInbox'));
const MatrimonyChat = lazy(() => import('./portal/MatrimonyChat'));
const MyShortlist = lazy(() => import('./portal/MyShortlist'));
const MyProfile = lazy(() => import('./portal/MyProfile'));
const ProfileWizard = lazy(() => import('./onboarding/ProfileWizard'));

const TabLoader = () => (
  <div className="py-20 flex flex-col items-center justify-center gap-3">
    <div className="w-8 h-8 border-2 border-[#C2410C] border-t-transparent rounded-full animate-spin" />
    <span className="text-xs text-[#78716C] uppercase tracking-widest font-mono">Loading Section...</span>
  </div>
);

const MatrimonyLayout = () => {
  const {
    token, user, profile, loading, isAuthenticated,
    isFirstLogin, isPendingPayment, login, register, submitPayment,
    changePassword, logout, refreshProfile
  } = useMatrimonyAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [chatPartnerId, setChatPartnerId] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] pt-28 flex items-center justify-center relative">
        <MatrimonyAmbientBackground />
        <div className="flex flex-col items-center gap-3 relative z-10">
          <div className="w-8 h-8 border-2 border-[#C2410C] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#C2410C] uppercase tracking-widest font-mono font-bold">
            Connecting to Vedic Matrimony Portal...
          </span>
        </div>
      </div>
    );
  }

  // If not authenticated, show login/register
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-[#FAF8F5] pt-20">
        <MatrimonyAmbientBackground />
        <MatrimonyLogin onLoginSuccess={login} onRegisterSuccess={register} />
      </div>
    );
  }

  // If membership registration fee is pending, show payment gate
  if (isPendingPayment) {
    return (
      <div className="relative min-h-screen bg-[#FAF8F5] pt-20">
        <MatrimonyAmbientBackground />
        <MembershipPaymentGate
          user={user}
          onPaymentCompleted={async (paymentData) => {
            await submitPayment(paymentData);
            await refreshProfile();
          }}
          onLogout={logout}
        />
      </div>
    );
  }

  // If first login, force change password gate
  if (isFirstLogin) {
    return (
      <div className="relative min-h-screen bg-[#FAF8F5] pt-20">
        <MatrimonyAmbientBackground />
        <ForceChangePassword onPasswordChanged={changePassword} />
      </div>
    );
  }

  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'search', label: 'Search Matches', icon: Search },
    { id: 'interests', label: 'Interests', icon: Heart },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'shortlist', label: 'Shortlist', icon: Star },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  return (
    <div className="relative min-h-screen bg-[#FAF8F5] pt-24 md:pt-28 pb-20 px-4 sm:px-6 md:px-8 text-[#1C1917] overflow-hidden">
      {/* ── 2D Ambient Indian Art Background ── */}
      <MatrimonyAmbientBackground />

      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        {/* ── Top Navigation Bar ────────────────────────────────────────── */}
        <div className="bg-white/95 border border-[#EADCC8] backdrop-blur-xl rounded-3xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-4 shadow-[0_8px_30px_rgba(194,65,12,0.04),0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FFFBEB] rounded-2xl border border-[#FDE68A] text-[#C2410C] shadow-sm">
              <LotusCrest size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-serif font-bold text-[#1C1917] leading-tight">Vedic Matrimony</h1>
                <span className="px-2.5 py-0.5 bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] text-[10px] font-bold rounded-full uppercase tracking-wider">
                  {user?.tier || 'Basic'} Member
                </span>
              </div>
              <p className="text-[11px] text-[#78716C] flex items-center gap-1.5 mt-0.5">
                <span>Member:</span>
                <strong className="text-[#C2410C] font-mono font-semibold">{user?.username}</strong>
                <span>•</span>
                <span className={`inline-flex items-center gap-1 font-semibold ${user?.status === 'verified' || user?.status === 'active' ? 'text-[#15803D]' : 'text-[#B45309]'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${user?.status === 'verified' || user?.status === 'active' ? 'bg-[#16A34A]' : 'bg-[#D97706] animate-ping'}`} />
                  {user?.status === 'pending_profile' ? 'ACTIVE' : user?.status?.toUpperCase()}
                </span>
              </p>
            </div>
          </div>

          {/* Navigation Pill Buttons */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            {navTabs.map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white shadow-md shadow-[#C2410C]/20 scale-[1.02]'
                      : 'text-[#574F47] hover:text-[#1C1917] hover:bg-[#FAF8F5] border border-transparent'
                  }`}
                >
                  <Icon size={14} className={active ? 'text-white' : ''} />
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              );
            })}

            <button
              onClick={logout}
              className="p-2 sm:px-3 sm:py-2 bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FECACA] text-[#B91C1C] rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ml-1 cursor-pointer hover:scale-105"
              title="Logout"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>

        {/* ── Active Tab View ───────────────────────────────────────────── */}
        <Suspense fallback={<TabLoader />}>
          {activeTab === 'dashboard' && (
            <PortalDashboard
              user={user}
              profile={profile}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'search' && <SearchMatches />}

          {activeTab === 'interests' && (
            <InterestsInbox
              onNavigateChat={(partnerId) => {
                setChatPartnerId(partnerId);
                setActiveTab('chat');
              }}
            />
          )}

          {activeTab === 'chat' && (
            <MatrimonyChat initialPartnerId={chatPartnerId} />
          )}

          {activeTab === 'shortlist' && <MyShortlist />}

          {activeTab === 'profile' && (
            <MyProfile onEditProfile={() => setActiveTab('wizard')} />
          )}

          {activeTab === 'wizard' && (
            <ProfileWizard
              existingProfile={profile}
              onComplete={() => {
                refreshProfile();
                setActiveTab('dashboard');
              }}
            />
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default React.memo(MatrimonyLayout);
