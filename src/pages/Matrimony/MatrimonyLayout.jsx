import React, { useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, LayoutDashboard, Search, Heart, MessageSquare,
  Star, User, LogOut, Sparkles, FileText
} from 'lucide-react';
import { useMatrimonyAuth } from './hooks/useMatrimonyAuth';
import MatrimonyLogin from './auth/MatrimonyLogin';
import ForceChangePassword from './auth/ForceChangePassword';

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
    <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    <span className="text-xs text-white/40 uppercase tracking-widest font-mono">Loading Section...</span>
  </div>
);

const MatrimonyLayout = () => {
  const {
    token, user, profile, loading, isAuthenticated,
    isFirstLogin, login, changePassword, logout, refreshProfile
  } = useMatrimonyAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [chatPartnerId, setChatPartnerId] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-void pt-28 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-amber-400/80 uppercase tracking-widest font-mono">
            Connecting to Matrimony Portal...
          </span>
        </div>
      </div>
    );
  }

  // If not authenticated, show login
  if (!isAuthenticated) {
    return <MatrimonyLogin onLoginSuccess={login} />;
  }

  // If first login, force change password gate
  if (isFirstLogin) {
    return <ForceChangePassword onPasswordChanged={changePassword} />;
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
    <div className="relative min-h-screen bg-void pt-24 md:pt-28 pb-20 px-4 sm:px-6 md:px-8 text-white overflow-hidden">
      {/* ── Ambient Background Lighting ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-[600px] h-[300px] bg-amber-600/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-orange-600/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        {/* ── Top Navigation Bar ────────────────────────────────────────── */}
        <div className="bg-neutral-900/80 border border-amber-500/25 backdrop-blur-2xl rounded-3xl p-3.5 sm:p-4.5 flex flex-wrap items-center justify-between gap-4 shadow-[0_10px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(245,158,11,0.08)]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-500/20 to-orange-500/10 rounded-2xl border border-amber-500/30 text-amber-300 shadow-md">
              <Shield size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-serif font-bold text-amber-300 leading-tight">Vedic Matrimony</h1>
                <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  {user?.tier || 'Basic'}
                </span>
              </div>
              <p className="text-[11px] text-white/50 flex items-center gap-1.5 mt-0.5">
                <span>Member:</span>
                <strong className="text-amber-400 font-mono font-medium">{user?.username}</strong>
                <span>•</span>
                <span className={`inline-flex items-center gap-1 font-semibold ${user?.status === 'verified' || user?.status === 'active' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${user?.status === 'verified' || user?.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`} />
                  {user?.status?.toUpperCase()}
                </span>
              </p>
            </div>
          </div>

          {/* Nav buttons */}
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
                      ? 'bg-gradient-to-r from-amber-500/25 to-yellow-500/25 text-amber-300 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)] scale-[1.02]'
                      : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon size={14} className={active ? 'text-amber-400' : ''} />
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              );
            })}

            <button
              onClick={logout}
              className="p-2 sm:px-3 sm:py-2 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ml-1 cursor-pointer hover:scale-105"
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
