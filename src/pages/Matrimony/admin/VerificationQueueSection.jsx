import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, X, Eye, AlertCircle, Clock, Sparkles } from 'lucide-react';
import { matrimonyAdminService } from '../../../services/matrimonyAdminService';
import { API_URL } from '../../../config';

const VerificationQueueSection = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const data = await matrimonyAdminService.getPendingVerifications();
      setQueue(data || []);
      if (data && data.length > 0 && !selectedItem) {
        setSelectedItem(data[0]);
      }
    } catch (err) {
      console.error('Failed to load verification queue', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleApproveProfile = async (userId) => {
    try {
      await matrimonyAdminService.updateStatus(userId, 'verified');
      fetchQueue();
      setSelectedItem(null);
    } catch (err) {
      alert(err.message || 'Failed to approve profile');
    }
  };

  const handleRejectProfile = async () => {
    if (!selectedItem) return;
    try {
      await matrimonyAdminService.updateStatus(selectedItem._id, 'rejected', rejectionReason);
      setShowRejectModal(false);
      setRejectionReason('');
      fetchQueue();
      setSelectedItem(null);
    } catch (err) {
      alert(err.message || 'Failed to reject profile');
    }
  };

  const handleReviewPhoto = async (photoId, status) => {
    try {
      await matrimonyAdminService.reviewPhoto(photoId, status);
      fetchQueue();
    } catch (err) {
      alert(err.message || 'Failed to review photo');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md flex items-center justify-between">
        <div>
          <h3 className="text-lg font-serif font-bold text-white">Verification Queue</h3>
          <p className="text-xs text-white/50">Profiles submitted and awaiting staff verification</p>
        </div>
        <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-lg font-mono">
          {queue.length} Pending
        </span>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-white/40">Loading verification queue...</div>
      ) : queue.length === 0 ? (
        <div className="bg-neutral-900/60 border border-white/10 rounded-3xl p-12 text-center space-y-3">
          <ShieldCheck size={36} className="mx-auto text-emerald-400" />
          <h3 className="text-base font-serif font-bold text-white">All Clear!</h3>
          <p className="text-xs text-white/40">No pending profile submissions require verification right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ── Left: Candidate List (4 cols) ── */}
          <div className="lg:col-span-4 bg-neutral-900/80 border border-white/10 rounded-3xl p-4 divide-y divide-white/5 max-h-[70vh] overflow-y-auto">
            {queue.map((item) => {
              const p = item.profile;
              const isSelected = selectedItem?._id === item._id;
              const photo = item.photos?.[0];
              const photoUrl = photo ? `${API_URL}${photo.url}` : '/assets/avatar-placeholder.png';

              return (
                <div
                  key={item._id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-3 rounded-2xl flex items-center gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-amber-500/20 border border-amber-500/40' : 'hover:bg-white/5'
                  }`}
                >
                  <img
                    src={photoUrl}
                    alt="Photo"
                    className="w-12 h-12 rounded-xl object-cover bg-black border border-white/10 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-serif font-bold text-white truncate">{p?.fullName || 'No Name'}</h4>
                    <span className="text-[10px] text-amber-400 font-mono block">{item.username}</span>
                    <span className="text-[10px] text-white/40 block">Submitted {new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Right: Detail Inspection Panel (8 cols) ── */}
          <div className="lg:col-span-8 bg-neutral-900/80 border border-white/10 rounded-3xl p-6 space-y-6">
            {selectedItem ? (
              <>
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-white">{selectedItem.profile?.fullName}</h3>
                    <p className="text-xs text-white/50">
                      Username: <strong className="text-amber-400 font-mono">{selectedItem.username}</strong> • Mobile: {selectedItem.profile?.mobile}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveProfile(selectedItem._id)}
                      className="px-4 py-2 bg-emerald-500 text-black font-bold text-xs rounded-xl hover:brightness-110 shadow-md flex items-center gap-1"
                    >
                      <Check size={14} /> Approve & Verify Profile
                    </button>
                    <button
                      onClick={() => setShowRejectModal(true)}
                      className="px-4 py-2 bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs rounded-xl hover:bg-rose-500/30"
                    >
                      Reject Profile
                    </button>
                  </div>
                </div>

                {/* Uploaded Photos Grid for Review */}
                <div>
                  <h4 className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider mb-2">
                    Uploaded Photos ({selectedItem.photos?.length || 0})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {selectedItem.photos?.map((ph) => (
                      <div key={ph._id || ph.id} className="relative group rounded-xl overflow-hidden bg-black border border-white/10 aspect-square">
                        <img src={`${API_URL}${ph.url}`} alt="Candidate" className="w-full h-full object-cover" />
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 text-[9px] rounded text-white font-mono uppercase">
                          {ph.status}
                        </div>
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                          <button
                            onClick={() => handleReviewPhoto(ph._id || ph.id, 'approved')}
                            className="p-1 bg-emerald-500 text-black rounded text-[10px] font-bold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReviewPhoto(ph._id || ph.id, 'rejected')}
                            className="p-1 bg-rose-500 text-white rounded text-[10px]"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Profile Fields Snapshot */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-black/40 p-4 rounded-2xl border border-white/5">
                  <div><span className="text-white/40 block">Religion/Caste:</span>{selectedItem.profile?.religion} / {selectedItem.profile?.caste}</div>
                  <div><span className="text-white/40 block">Rashi / Nakshatra:</span>{selectedItem.profile?.rashi || '-'} / {selectedItem.profile?.nakshatra || '-'}</div>
                  <div><span className="text-white/40 block">Manglik:</span>{selectedItem.profile?.manglik || 'No'}</div>
                  <div><span className="text-white/40 block">Education:</span>{selectedItem.profile?.education || '-'}</div>
                  <div><span className="text-white/40 block">Occupation:</span>{selectedItem.profile?.occupation || '-'}</div>
                  <div><span className="text-white/40 block">Annual Income:</span>₹{selectedItem.profile?.annualIncome?.toLocaleString('en-IN') || '0'}</div>
                  <div><span className="text-white/40 block">Location:</span>{selectedItem.profile?.currentCity}, {selectedItem.profile?.currentState}</div>
                  <div><span className="text-white/40 block">Father:</span>{selectedItem.profile?.fatherName || '-'} ({selectedItem.profile?.fatherOccupation})</div>
                </div>
              </>
            ) : (
              <div className="text-center py-16 text-white/40 text-xs">Select a candidate on the left to review</div>
            )}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-neutral-900 border border-rose-500/40 rounded-3xl p-6 space-y-4">
            <h4 className="font-serif font-bold text-white text-base">Reject Profile Submission</h4>
            <p className="text-xs text-white/50">Provide reason for rejection so the member can correct their information.</p>
            <textarea
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              placeholder="e.g. Blurry photograph, incorrect date of birth format"
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white h-24 focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 bg-white/5 text-white text-xs rounded-xl">
                Cancel
              </button>
              <button onClick={handleRejectProfile} className="px-4 py-2 bg-rose-500 text-white font-bold text-xs rounded-xl">
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(VerificationQueueSection);
