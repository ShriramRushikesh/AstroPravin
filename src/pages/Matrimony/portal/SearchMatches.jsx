import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Filter, RefreshCw, Sparkles, SlidersHorizontal,
  X, AlertCircle, Heart, Star
} from 'lucide-react';
import ProfileCard from './ProfileCard';
import ProfileDetail from './ProfileDetail';
import GunMilanResult from './GunMilanResult';
import { RASHIS, RELIGIONS, CASTES, MARITAL_STATUSES } from '../../../lib/matrimony/constants';
import { matrimonyApi } from '../../../services/matrimonyApi';

const SearchMatches = () => {
  const [profiles, setProfiles] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Selected profile for lightbox detail
  const [selectedProfile, setSelectedProfile] = useState(null);
  // Selected profile for Gun Milan modal
  const [gunMilanTargetId, setGunMilanTargetId] = useState(null);

  // Filter States
  const [filters, setFilters] = useState({
    gender: '',
    religion: '',
    caste: '',
    city: '',
    maritalStatus: '',
    manglik: 'any',
    ageMin: 18,
    ageMax: 50,
    heightMin: 140,
    heightMax: 200,
  });

  const fetchProfiles = useCallback(async (currentFilters = filters, currentPage = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await matrimonyApi.search({
        ...currentFilters,
        page: currentPage,
        limit: 12,
      });
      setProfiles(res.items || []);
      setTotal(res.total || 0);
      setPage(res.page || 1);
    } catch (err) {
      setError(err.message || 'Failed to load profiles');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProfiles(filters, 1);
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    setPage(1);
    fetchProfiles(filters, 1);
    setShowFiltersMobile(false);
  };

  const handleResetFilters = () => {
    const initial = {
      gender: '',
      religion: '',
      caste: '',
      city: '',
      maritalStatus: '',
      manglik: 'any',
      ageMin: 18,
      ageMax: 50,
      heightMin: 140,
      heightMax: 200,
    };
    setFilters(initial);
    setPage(1);
    fetchProfiles(initial, 1);
  };

  const handleInterest = async (targetUserId) => {
    try {
      await matrimonyApi.sendInterest(targetUserId);
      setProfiles(prev => prev.map(p => {
        if ((p.userId || p._id) === targetUserId) {
          return { ...p, interestStatus: 'pending' };
        }
        return p;
      }));
    } catch (err) {
      alert(err.message || 'Failed to send interest');
    }
  };

  const handleShortlist = async (targetUserId) => {
    try {
      const res = await matrimonyApi.toggleShortlist(targetUserId);
      setProfiles(prev => prev.map(p => {
        if ((p.userId || p._id) === targetUserId) {
          return { ...p, isShortlisted: res.shortlisted };
        }
        return p;
      }));
    } catch (err) {
      alert(err.message || 'Failed to toggle shortlist');
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header & Mobile Filter Trigger ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Find Your Vedic Match</h2>
          <p className="text-xs text-white/50">
            Showing <strong className="text-amber-400">{profiles.length}</strong> of <strong className="text-white">{total}</strong> verified active profiles
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="md:hidden px-3.5 py-2 bg-amber-500/20 text-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-amber-500/30"
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
          </button>

          <button
            onClick={() => fetchProfiles(filters, page)}
            className="p-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl border border-white/10 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* ── Filter Sidebar ──────────────────────────────────────────────── */}
        <div
          className={`w-full md:w-72 bg-neutral-900/90 border border-white/10 rounded-3xl p-5 space-y-4 backdrop-blur-xl h-fit ${
            showFiltersMobile ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-serif font-bold text-amber-300 flex items-center gap-1.5">
              <Filter size={14} /> Filter Candidates
            </span>
            <button onClick={handleResetFilters} className="text-[10px] text-white/40 hover:text-white underline">
              Reset All
            </button>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-[11px] font-medium text-white/60 mb-1">Gender</label>
            <select
              value={filters.gender}
              onChange={e => handleFilterChange('gender', e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-xs text-white focus:outline-none"
            >
              <option value="">All</option>
              <option value="female">Brides (Female)</option>
              <option value="male">Grooms (Male)</option>
            </select>
          </div>

          {/* Religion */}
          <div>
            <label className="block text-[11px] font-medium text-white/60 mb-1">Religion</label>
            <select
              value={filters.religion}
              onChange={e => handleFilterChange('religion', e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-xs text-white focus:outline-none"
            >
              <option value="">All Religions</option>
              {RELIGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Caste */}
          <div>
            <label className="block text-[11px] font-medium text-white/60 mb-1">Caste / Community</label>
            <input
              type="text"
              value={filters.caste}
              onChange={e => handleFilterChange('caste', e.target.value)}
              placeholder="e.g. Maratha, Brahmin"
              className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-xs text-white focus:outline-none"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-[11px] font-medium text-white/60 mb-1">City / Location</label>
            <input
              type="text"
              value={filters.city}
              onChange={e => handleFilterChange('city', e.target.value)}
              placeholder="e.g. Solapur, Pune"
              className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-xs text-white focus:outline-none"
            />
          </div>

          {/* Manglik */}
          <div>
            <label className="block text-[11px] font-medium text-white/60 mb-1">Manglik Status</label>
            <select
              value={filters.manglik}
              onChange={e => handleFilterChange('manglik', e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-xs text-white focus:outline-none"
            >
              <option value="any">Doesn't Matter</option>
              <option value="no">Non-Manglik</option>
              <option value="yes">Manglik Only</option>
            </select>
          </div>

          {/* Age Range Slider */}
          <div>
            <div className="flex justify-between text-[11px] text-white/60 mb-1">
              <span>Age Range</span>
              <span className="font-bold text-amber-400">{filters.ageMin} - {filters.ageMax} yrs</span>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                min="18"
                max="70"
                value={filters.ageMin}
                onChange={e => handleFilterChange('ageMin', Number(e.target.value))}
                className="w-1/2 bg-black/40 border border-white/10 rounded-lg p-1.5 text-xs text-white text-center"
              />
              <input
                type="number"
                min="18"
                max="70"
                value={filters.ageMax}
                onChange={e => handleFilterChange('ageMax', Number(e.target.value))}
                className="w-1/2 bg-black/40 border border-white/10 rounded-lg p-1.5 text-xs text-white text-center"
              />
            </div>
          </div>

          <button
            onClick={handleApplyFilters}
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold text-xs rounded-xl shadow-lg hover:brightness-110 transition-all uppercase tracking-wider mt-2"
          >
            Apply Filters
          </button>
        </div>

        {/* ── Profiles Grid ───────────────────────────────────────────────── */}
        <div className="flex-1">
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs mb-6">
              {error}
            </div>
          )}

          {loading ? (
            /* Skeleton Loader */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-4 space-y-4 animate-pulse">
                  <div className="aspect-[4/5] bg-white/10 rounded-2xl" />
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                  <div className="h-8 bg-white/10 rounded-xl" />
                </div>
              ))}
            </div>
          ) : profiles.length === 0 ? (
            /* Empty State */
            <div className="bg-neutral-900/60 border border-white/10 rounded-3xl p-12 text-center space-y-4">
              <div className="p-4 bg-white/5 text-amber-400 rounded-full w-fit mx-auto border border-white/10">
                <Search size={28} />
              </div>
              <h3 className="text-lg font-serif font-bold text-white">No Profiles Found</h3>
              <p className="text-xs text-white/50 max-w-sm mx-auto">
                No verified profiles matched your active filter criteria. Try broadening your age range or clearing caste/location filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-bold transition-all"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map(profile => (
                <ProfileCard
                  key={profile._id || profile.userId}
                  profile={profile}
                  onInterest={handleInterest}
                  onShortlist={handleShortlist}
                  onViewDetail={setSelectedProfile}
                  onGunMilan={setGunMilanTargetId}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      {selectedProfile && (
        <ProfileDetail
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
          onSendInterest={handleInterest}
          onToggleShortlist={handleShortlist}
          onGunMilan={(targetId) => {
            setSelectedProfile(null);
            setGunMilanTargetId(targetId);
          }}
        />
      )}

      {gunMilanTargetId && (
        <GunMilanResult
          targetProfileId={gunMilanTargetId}
          onClose={() => setGunMilanTargetId(null)}
        />
      )}
    </div>
  );
};

export default React.memo(SearchMatches);
