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
      <div className="flex items-center justify-between gap-4 flex-wrap bg-white border border-[#EADCC8] p-4 sm:p-5 rounded-3xl shadow-sm">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#1C1917]">Find Your Match</h2>
          <p className="text-xs text-[#78716C]">
            Showing <strong className="text-[#C2410C]">{profiles.length}</strong> of <strong className="text-[#1C1917]">{total}</strong> verified active profiles
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="md:hidden px-3.5 py-2 bg-[#FEF3C7] text-[#B45309] rounded-xl text-xs font-bold flex items-center gap-1.5 border border-[#FDE68A]"
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
          </button>

          <button
            onClick={() => fetchProfiles(filters, page)}
            className="p-2.5 bg-[#FAF8F5] hover:bg-[#F5EFE6] text-[#574F47] hover:text-[#1C1917] rounded-xl border border-[#EADCC8] transition-colors"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* ── Filter Sidebar (Luxury Light Card) ─────────────────────────── */}
        <div
          className={`w-full md:w-72 bg-white border border-[#EADCC8] rounded-3xl p-5 space-y-4 shadow-sm h-fit shrink-0 ${
            showFiltersMobile ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="flex items-center justify-between border-b border-[#F5EFE6] pb-3">
            <span className="text-xs font-serif font-bold text-[#C2410C] flex items-center gap-1.5">
              <Filter size={14} /> Filter Candidates
            </span>
            <button onClick={handleResetFilters} className="text-[10px] text-[#78716C] hover:text-[#C2410C] underline cursor-pointer">
              Reset All
            </button>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-[11px] font-bold text-[#574F47] uppercase tracking-wider mb-1">Gender</label>
            <select
              value={filters.gender}
              onChange={e => handleFilterChange('gender', e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#EADCC8] rounded-xl p-2.5 text-xs text-[#1C1917] focus:border-[#C2410C] focus:outline-none"
            >
              <option value="">All Candidates</option>
              <option value="female">Brides (Female)</option>
              <option value="male">Grooms (Male)</option>
            </select>
          </div>

          {/* Religion */}
          <div>
            <label className="block text-[11px] font-bold text-[#574F47] uppercase tracking-wider mb-1">Religion</label>
            <select
              value={filters.religion}
              onChange={e => handleFilterChange('religion', e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#EADCC8] rounded-xl p-2.5 text-xs text-[#1C1917] focus:border-[#C2410C] focus:outline-none"
            >
              <option value="">All Religions</option>
              {RELIGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Caste */}
          <div>
            <label className="block text-[11px] font-bold text-[#574F47] uppercase tracking-wider mb-1">Caste / Community</label>
            <input
              type="text"
              value={filters.caste}
              onChange={e => handleFilterChange('caste', e.target.value)}
              placeholder="e.g. Maratha, Brahmin"
              className="w-full bg-[#FAF8F5] border border-[#EADCC8] rounded-xl p-2.5 text-xs text-[#1C1917] focus:border-[#C2410C] focus:outline-none"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-[11px] font-bold text-[#574F47] uppercase tracking-wider mb-1">City / Location</label>
            <input
              type="text"
              value={filters.city}
              onChange={e => handleFilterChange('city', e.target.value)}
              placeholder="e.g. Solapur, Pune"
              className="w-full bg-[#FAF8F5] border border-[#EADCC8] rounded-xl p-2.5 text-xs text-[#1C1917] focus:border-[#C2410C] focus:outline-none"
            />
          </div>

          {/* Manglik */}
          <div>
            <label className="block text-[11px] font-bold text-[#574F47] uppercase tracking-wider mb-1">Manglik Status</label>
            <select
              value={filters.manglik}
              onChange={e => handleFilterChange('manglik', e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#EADCC8] rounded-xl p-2.5 text-xs text-[#1C1917] focus:border-[#C2410C] focus:outline-none"
            >
              <option value="any">Doesn't Matter</option>
              <option value="no">Non-Manglik</option>
              <option value="yes">Manglik Only</option>
            </select>
          </div>

          {/* Age Range Slider */}
          <div>
            <div className="flex justify-between text-[11px] text-[#574F47] mb-1 font-medium">
              <span>Age Range</span>
              <span className="font-bold text-[#C2410C] font-mono">{filters.ageMin} - {filters.ageMax} yrs</span>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                min="18"
                max="70"
                value={filters.ageMin}
                onChange={e => handleFilterChange('ageMin', Number(e.target.value))}
                className="w-1/2 bg-[#FAF8F5] border border-[#EADCC8] rounded-lg p-2 text-xs text-[#1C1917] text-center font-mono"
              />
              <input
                type="number"
                min="18"
                max="70"
                value={filters.ageMax}
                onChange={e => handleFilterChange('ageMax', Number(e.target.value))}
                className="w-1/2 bg-[#FAF8F5] border border-[#EADCC8] rounded-lg p-2 text-xs text-[#1C1917] text-center font-mono"
              />
            </div>
          </div>

          <button
            onClick={handleApplyFilters}
            className="w-full py-3 bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white font-bold text-xs rounded-xl shadow-md shadow-[#C2410C]/20 hover:brightness-105 active:scale-95 transition-all uppercase tracking-wider mt-2 cursor-pointer"
          >
            Apply Filters
          </button>
        </div>

        {/* ── Profiles Grid ───────────────────────────────────────────────── */}
        <div className="flex-1">
          {error && (
            <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-2xl text-[#B91C1C] text-xs mb-6">
              {error}
            </div>
          )}

          {loading ? (
            /* Skeleton Loader */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white border border-[#EADCC8] rounded-3xl p-4 space-y-4 animate-pulse">
                  <div className="aspect-[4/5] bg-[#FAF8F5] rounded-2xl" />
                  <div className="h-4 bg-[#F5EFE6] rounded w-3/4" />
                  <div className="h-3 bg-[#FAF8F5] rounded w-1/2" />
                  <div className="h-8 bg-[#F5EFE6] rounded-xl" />
                </div>
              ))}
            </div>
          ) : profiles.length === 0 ? (
            /* Empty State */
            <div className="bg-white border border-[#EADCC8] rounded-3xl p-12 text-center space-y-4 shadow-sm">
              <div className="p-4 bg-[#FFFBEB] text-[#C2410C] rounded-full w-fit mx-auto border border-[#FDE68A]">
                <Search size={28} />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#1C1917]">No Profiles Found</h3>
              <p className="text-xs text-[#78716C] max-w-sm mx-auto">
                No verified profiles matched your active filter criteria. Try broadening your age range or clearing caste/location filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-[#FAF8F5] hover:bg-[#F5EFE6] border border-[#EADCC8] text-[#C2410C] rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
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
