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
      <div className="flex items-center justify-between bg-white border border-[#EADCC8] p-2 rounded-2xl flex-wrap gap-2 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('received')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'received'
                ? 'bg-[#C2410C] text-white shadow-sm'
                : 'text-[#574F47] hover:text-[#1C1917] hover:bg-[#FAF8F5]'
            }`}
          >
            <span>Received Interests</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeSubTab === 'received' ? 'bg-white/20 text-white' : 'bg-[#FAF8F5] text-[#78716C]'}`}>
              {interests.received.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('sent')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'sent'
                ? 'bg-[#C2410C] text-white shadow-sm'
                : 'text-[#574F47] hover:text-[#1C1917] hover:bg-[#FAF8F5]'
            }`}
          >
            <span>Sent Interests</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeSubTab === 'sent' ? 'bg-white/20 text-white' : 'bg-[#FAF8F5] text-[#78716C]'}`}>
              {interests.sent.length}
            </span>
          </button>
        </div>
      </div>

      {/* ── List Content ── */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-[#C2410C] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#78716C] uppercase tracking-widest font-mono">Loading Inbox...</span>
        </div>
      ) : list.length === 0 ? (
        <div className="bg-white border border-[#EADCC8] rounded-3xl p-12 text-center space-y-3 shadow-sm">
          <div className="p-3.5 bg-[#FFF1F2] text-[#BE123C] rounded-full w-fit mx-auto border border-[#FECDD3]">
            <Heart size={28} />
          </div>
          <h3 className="text-base font-serif font-bold text-[#1C1917]">No {activeSubTab} interests yet</h3>
          <p className="text-xs text-[#78716C] max-w-sm mx-auto">
            {activeSubTab === 'received'
              ? 'When other verified members express interest in your profile, they will appear here.'
              : 'You have not sent any interest requests yet. Browse matches to connect!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map((item) => {
            const candidate = activeSubTab === 'received' ? item.senderUser : item.targetUser;
            const photo = item.photos?.[0];
            const photoUrl = photo ? `${API_URL}${photo.url}` : '/assets/avatar-placeholder.png';

            return (
              <div
                key={item._id}
                className="bg-white border border-[#EADCC8] hover:border-[#C2410C]/30 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={photoUrl}
                    alt="Candidate"
                    className="w-14 h-14 rounded-xl object-cover bg-[#FAF8F5] border border-[#EADCC8] shrink-0"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=60'; }}
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-serif font-bold text-[#1C1917] truncate">
                      {candidate?.fullName || 'Confidential Member'}
                    </h4>
                    <p className="text-[11px] text-[#78716C] truncate">
                      {candidate?.currentCity || 'Solapur'} • {candidate?.occupation || 'Professional'}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-[#A8A29E] mt-1">
                      <Clock size={11} />
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {item.status === 'accepted' ? (
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] text-[10px] font-bold rounded-lg uppercase">
                        Accepted Match
                      </span>
                      {onNavigateChat && (
                        <button
                          onClick={() => onNavigateChat(candidate?.userId || candidate?._id)}
                          className="p-2 bg-[#C2410C] text-white rounded-lg hover:brightness-105 shadow-xs cursor-pointer"
                          title="Chat Now"
                        >
                          <MessageSquare size={14} />
                        </button>
                      )}
                    </div>
                  ) : item.status === 'declined' ? (
                    <span className="px-2.5 py-1 bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA] text-[10px] font-bold rounded-lg uppercase">
                      Declined
                    </span>
                  ) : activeSubTab === 'received' ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleRespond(item._id, 'accept')}
                        disabled={actionLoading === item._id}
                        className="px-3 py-1.5 bg-[#15803D] text-white text-xs font-bold rounded-xl hover:brightness-105 transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Check size={13} /> Accept
                      </button>
                      <button
                        onClick={() => handleRespond(item._id, 'decline')}
                        disabled={actionLoading === item._id}
                        className="p-1.5 bg-[#FAF8F5] hover:bg-[#FEF2F2] text-[#78716C] hover:text-[#B91C1C] rounded-xl transition-all border border-[#EADCC8] cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <span className="px-2.5 py-1 bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] text-[10px] font-bold rounded-lg uppercase">
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
