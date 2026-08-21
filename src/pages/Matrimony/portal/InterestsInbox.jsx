import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Check, X, ArrowRight, MessageSquare, Clock } from 'lucide-react';
import { matrimonyApi } from '../../../services/matrimonyApi';
import { API_URL } from '../../../config';

const InterestsInbox = ({ onNavigateChat }) => {
  const [activeSubTab, setActiveSubTab] = useState('received'); // 'received' | 'sent'
  const [interests, setInterests] = useState({ received: [], sent: [] });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchInterests = async () => {
    setLoading(true);
    try {
      const data = await matrimonyApi.getInterests();
      setInterests({
        received: data.received || [],
        sent: data.sent || [],
      });
    } catch (err) {
      console.error('Failed to load interests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterests();
  }, []);

  const handleRespond = async (interestId, action) => {
    setActionLoading(interestId);
    try {
      await matrimonyApi.respondInterest(interestId, action);
      fetchInterests();
    } catch (err) {
      alert(err.message || 'Failed to respond to interest');
    } finally {
      setActionLoading(null);
    }
  };

  const list = activeSubTab === 'received' ? interests.received : interests.sent;

  return (
    <div className="space-y-6">
      {/* ── Sub-tabs ── */}
      <div className="flex items-center justify-between bg-white/5 border border-white/10 p-2 rounded-2xl flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('received')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'received'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <span>Received Interests</span>
            <span className="px-2 py-0.5 rounded-full bg-black/40 text-[10px] text-white/80">
              {interests.received.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('sent')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'sent'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <span>Sent Interests</span>
            <span className="px-2 py-0.5 rounded-full bg-black/40 text-[10px] text-white/80">
              {interests.sent.length}
            </span>
          </button>
        </div>
      </div>

      {/* ── List Content ── */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-white/40 uppercase tracking-widest font-mono">Loading Inbox...</span>
        </div>
      ) : list.length === 0 ? (
        <div className="bg-neutral-900/60 border border-white/10 rounded-3xl p-12 text-center space-y-3">
          <Heart size={32} className="mx-auto text-white/20" />
          <h3 className="text-base font-serif font-bold text-white">No {activeSubTab} interests yet</h3>
          <p className="text-xs text-white/40 max-w-sm mx-auto">
            {activeSubTab === 'received'
              ? 'When other verified members express interest in your profile, they will appear here.'
              : 'You have not sent any interest requests yet. Browse matches to connect!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map((item) => {
            const user = activeSubTab === 'received' ? item.senderUser : item.targetUser;
            const photo = item.photos?.[0];
            const photoUrl = photo ? `${API_URL}${photo.url}` : '/assets/avatar-placeholder.png';

            return (
              <div
                key={item._id}
                className="bg-neutral-900/80 border border-white/10 rounded-2xl p-4 backdrop-blur-xl flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={photoUrl}
                    alt="Candidate"
                    className="w-14 h-14 rounded-xl object-cover bg-black border border-white/10 shrink-0"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=60'; }}
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-serif font-bold text-white truncate">
                      {user?.fullName || 'Confidential Member'}
                    </h4>
                    <p className="text-[11px] text-white/60 truncate">
                      {user?.currentCity || 'Solapur'} • {user?.occupation || 'Professional'}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-white/40 mt-1">
                      <Clock size={11} />
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {item.status === 'accepted' ? (
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold rounded-lg uppercase">
                        Accepted Match
                      </span>
                      {onNavigateChat && (
                        <button
                          onClick={() => onNavigateChat(user?.userId || user?._id)}
                          className="p-1.5 bg-amber-500 text-black rounded-lg hover:brightness-110"
                          title="Chat Now"
                        >
                          <MessageSquare size={14} />
                        </button>
                      )}
                    </div>
                  ) : item.status === 'declined' ? (
                    <span className="px-2.5 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold rounded-lg uppercase">
                      Declined
                    </span>
                  ) : activeSubTab === 'received' ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleRespond(item._id, 'accept')}
                        disabled={actionLoading === item._id}
                        className="px-3 py-1.5 bg-emerald-500 text-black text-xs font-bold rounded-xl hover:brightness-110 transition-all flex items-center gap-1"
                      >
                        <Check size={13} /> Accept
                      </button>
                      <button
                        onClick={() => handleRespond(item._id, 'decline')}
                        disabled={actionLoading === item._id}
                        className="p-1.5 bg-white/5 hover:bg-rose-500/20 text-white/70 hover:text-rose-300 rounded-xl transition-all border border-white/10"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded-lg uppercase">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default React.memo(InterestsInbox);
