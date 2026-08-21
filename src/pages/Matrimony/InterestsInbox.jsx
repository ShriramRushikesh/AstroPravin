import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import { Heart, CheckCircle2, XCircle, Clock } from 'lucide-react';

const InterestsInbox = ({ myProfile, onNavigateChat }) => {
  const [activeTab, setActiveTab] = useState('received'); // 'received' | 'sent' | 'accepted'
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInterests(activeTab);
  }, [activeTab]);

  const fetchInterests = async (type) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('matrimonyToken');
      const res = await fetch(`${API_URL}/api/matrimony/interests?type=${type}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setInterests(data || []);
      }
    } catch (err) {
      console.error('Failed to fetch interests', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (interestId, status) => {
    try {
      const token = localStorage.getItem('matrimonyToken');
      const res = await fetch(`${API_URL}/api/matrimony/interests/${interestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        alert(`Interest ${status}!`);
        fetchInterests(activeTab);
      }
    } catch (err) {
      alert('Error responding to interest');
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Sub-tab bar ──────────────────────────────────────────────────────── */}
      <div className="flex gap-2 border-b border-white/10 pb-4">
        {[
          { id: 'received', label: '📥 Received Interests' },
          { id: 'sent', label: '📤 Sent Interests' },
          { id: 'accepted', label: '💖 Accepted Matches' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === t.id ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-white/40 hover:text-white'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── List ────────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        {interests.map((item) => {
          const partner = item.other_profile;
          return (
            <div
              key={item._id}
              className="bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 overflow-hidden flex items-center justify-center font-bold text-amber-300 font-serif">
                  {partner?.primary_photo ? (
                    <img src={partner.primary_photo} alt={partner.full_name} className="w-full h-full object-cover" />
                  ) : (
                    partner?.code
                  )}
                </div>
                <div>
                  <h4 className="text-base font-serif font-bold text-white">{partner?.full_name || 'Member'}</h4>
                  <p className="text-xs text-amber-400 font-mono font-bold">{partner?.code}</p>
                  <p className="text-xs text-white/50">{partner?.gender} • {partner?.age} Yrs • {partner?.city}</p>
                  {item.message && <p className="text-xs text-white/70 italic mt-1 font-sans">"{item.message}"</p>}
                </div>
              </div>

              {/* Action buttons based on active tab */}
              {activeTab === 'received' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRespond(item._id, 'accepted')}
                    className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={14} /> Accept Match
                  </button>
                  <button
                    onClick={() => handleRespond(item._id, 'declined')}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <XCircle size={14} /> Decline
                  </button>
                </div>
              )}

              {activeTab === 'sent' && (
                <div className="text-xs text-amber-400 font-bold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 flex items-center gap-1">
                  <Clock size={14} /> Response Pending
                </div>
              )}

              {activeTab === 'accepted' && (
                <button
                  onClick={() => onNavigateChat && onNavigateChat(partner?._id)}
                  className="px-5 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:brightness-110"
                >
                  💬 Start Chat
                </button>
              )}
            </div>
          );
        })}

        {interests.length === 0 && !loading && (
          <div className="p-12 text-center text-white/30 text-xs bg-white/5 rounded-3xl border border-white/10">
            No {activeTab} interest requests found.
          </div>
        )}
      </div>
    </div>
  );
};

export default InterestsInbox;
