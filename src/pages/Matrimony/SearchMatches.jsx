import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import { Search, Heart, Star, Lock, MapPin, Briefcase, GraduationCap, ShieldCheck, Sparkles } from 'lucide-react';

const SearchMatches = ({ userState, myProfile }) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    gender: myProfile?.gender === 'male' ? 'female' : 'male',
    min_age: 20,
    max_age: 35,
    city: '',
    religion: '',
    caste: '',
  });

  const [gunMilanResult, setGunMilanResult] = useState({}); // { [code]: gunaScore }

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('matrimonyToken');
      const queryParams = new URLSearchParams(filters).toString();
      const res = await fetch(`${API_URL}/api/matrimony/search?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setProfiles(data.profiles || []);
      }
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendInterest = async (toProfileId, code) => {
    try {
      const token = localStorage.getItem('matrimonyToken');
      const res = await fetch(`${API_URL}/api/matrimony/interests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ to_profile_id: toProfileId, message: 'Interested in connecting!' }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Interest request sent to ${code}!`);
      } else {
        alert(data.message || 'Could not send interest');
      }
    } catch (err) {
      alert('Error sending interest request');
    }
  };

  const handleToggleShortlist = async (toProfileId) => {
    try {
      const token = localStorage.getItem('matrimonyToken');
      const res = await fetch(`${API_URL}/api/matrimony/shortlist/${toProfileId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
      }
    } catch (err) {
      alert('Error toggling shortlist');
    }
  };

  const handleQuickGunMilan = async (targetId, code) => {
    if (!myProfile?._id) {
      alert('Please complete your profile first');
      return;
    }
    try {
      const token = localStorage.getItem('matrimonyToken');
      const res = await fetch(`${API_URL}/api/matrimony/gun-milan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ profileAId: myProfile._id, profileBId: targetId }),
      });
      const data = await res.json();
      if (res.ok) {
        setGunMilanResult((prev) => ({ ...prev, [code]: data.gunaScore }));
      }
    } catch (err) {
      console.error('Gun Milan failed', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Filter Bar ──────────────────────────────────────────────────────── */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-4">
        <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
          <Search size={18} className="text-amber-400" /> Search Matches
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-white/40 mb-1">Looking For</label>
            <select
              value={filters.gender}
              onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white"
            >
              <option value="female">Bride (Female)</option>
              <option value="male">Groom (Male)</option>
            </select>
          </div>
          <div>
            <label className="block text-white/40 mb-1">City</label>
            <input
              type="text"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              placeholder="e.g. Solapur, Pune"
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white"
            />
          </div>
          <div>
            <label className="block text-white/40 mb-1">Caste</label>
            <input
              type="text"
              value={filters.caste}
              onChange={(e) => setFilters({ ...filters, caste: e.target.value })}
              placeholder="e.g. Maratha, Brahmin"
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchMatches}
              disabled={loading}
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
            >
              {loading ? 'Searching...' : 'Apply Filters'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Profiles Grid ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profiles.map((p) => (
          <div
            key={p._id || p.code}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-amber-500/30 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 overflow-hidden flex items-center justify-center font-bold text-amber-300 font-serif">
                    {p.primary_photo ? (
                      <img src={p.primary_photo} alt={p.full_name} className="w-full h-full object-cover" />
                    ) : (
                      p.code
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-base font-serif font-bold text-white">{p.full_name || p.name}</h4>
                      <ShieldCheck size={14} className="text-emerald-400" />
                    </div>
                    <p className="text-xs text-amber-400 font-mono font-bold">{p.code}</p>
                    <p className="text-xs text-white/50">{p.age} Yrs • {p.height || "5'6\""}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleShortlist(p._id)}
                  className="p-2 bg-white/5 hover:bg-amber-500/20 text-white/40 hover:text-amber-300 rounded-xl transition-colors"
                  title="Shortlist"
                >
                  <Star size={16} />
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-white/70">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-white/40 shrink-0" />
                  <span>{p.city || 'Solapur'}, {p.state || 'Maharashtra'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap size={14} className="text-white/40 shrink-0" />
                  <span>{p.education?.highest_education || 'Graduate'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase size={14} className="text-white/40 shrink-0" />
                  <span>{p.education?.occupation || 'Employed'} • {p.education?.annual_income || 'Income N/A'}</span>
                </div>
                <div className="pt-2 text-[11px] text-amber-300/80">
                  🚩 Rashi: {p.horoscope?.rashi || p.rashi || 'N/A'} • Nakshatra: {p.horoscope?.nakshatra || p.nakshatra || 'N/A'}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
              {gunMilanResult[p.code] ? (
                <div className="text-xs font-bold text-amber-300 bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1">
                  <Sparkles size={14} /> Guna Milan: {gunMilanResult[p.code]} / 36
                </div>
              ) : (
                <button
                  onClick={() => handleQuickGunMilan(p._id, p.code)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-xs font-bold transition-all"
                >
                  Check Guna Match
                </button>
              )}

              <button
                onClick={() => handleSendInterest(p._id, p.code)}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-xl text-xs uppercase tracking-wider hover:brightness-110 shadow-md flex items-center gap-1.5"
              >
                <Heart size={14} /> Express Interest
              </button>
            </div>
          </div>
        ))}
      </div>

      {profiles.length === 0 && !loading && (
        <div className="p-12 text-center text-white/30 text-xs bg-white/5 rounded-3xl border border-white/10">
          No verified matrimony matches found matching your filters.
        </div>
      )}
    </div>
  );
};

export default SearchMatches;
