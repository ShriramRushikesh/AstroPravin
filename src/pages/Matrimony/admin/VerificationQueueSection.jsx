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

  const handleVerifyPayment = async (userId, approved) => {
    try {
      const notes = approved ? 'Verified by Admin against Bank Statement' : 'Invalid or Uncredited UTR';
      await matrimonyAdminService.verifyMemberPayment(userId, approved, notes);
      fetchQueue();
      if (selectedItem?._id === userId) {
        setSelectedItem(prev => ({
          ...prev,
          paymentStatus: approved ? 'verified' : 'rejected',
          status: approved ? 'pending_profile' : 'pending_payment',
        }));
      }
      alert(approved ? 'Payment verified successfully!' : 'Payment rejected.');
    } catch (err) {
      alert(err.message || 'Failed to update payment status');
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
    <div className="space-y-6 text-[#1C1917]">
      <div className="bg-white border border-[#EADCC8] p-5 rounded-3xl shadow-luxury flex items-center justify-between">
        <div>
          <h3 className="text-lg font-serif font-bold text-[#1C1917]">Verification Queue</h3>
          <p className="text-xs text-[#78716C]">Profiles submitted and awaiting staff verification</p>
        </div>
        <span className="px-3.5 py-1 bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA] text-xs font-bold rounded-full font-mono">
          {queue.length} Pending
        </span>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-[#78716C]">Loading verification queue...</div>
      ) : queue.length === 0 ? (
        <div className="bg-white border border-[#EADCC8] rounded-3xl p-12 text-center space-y-3 shadow-sm">
          <ShieldCheck size={36} className="mx-auto text-emerald-600" />
          <h3 className="text-base font-serif font-bold text-[#1C1917]">All Clear!</h3>
          <p className="text-xs text-[#78716C]">No pending profile submissions require verification right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ── Left: Candidate List (4 cols) ── */}
          <div className="lg:col-span-4 bg-white border border-[#EADCC8] rounded-3xl p-4 divide-y divide-[#EADCC8]/60 max-h-[70vh] overflow-y-auto shadow-luxury">
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
                    isSelected ? 'bg-[#FFF7ED] border border-[#FED7AA]' : 'hover:bg-[#FAF8F5]'
                  }`}
                >
                  <img
                    src={photoUrl}
                    alt="Photo"
                    className="w-12 h-12 rounded-xl object-cover bg-[#FAF8F5] border border-[#EADCC8] shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-serif font-bold text-[#1C1917] truncate">{p?.fullName || 'No Name'}</h4>
                    <span className="text-[10px] text-[#C2410C] font-mono font-bold block">{item.username}</span>
                    <span className="text-[10px] text-[#78716C] block">Submitted {new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Right: Detail Inspection Panel (8 cols) ── */}
          <div className="lg:col-span-8 bg-white border border-[#EADCC8] rounded-3xl p-6 space-y-6 shadow-luxury">
            {selectedItem ? (
              <>
                <div className="flex flex-wrap items-center justify-between border-b border-[#EADCC8] pb-4 gap-4">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-[#1C1917]">{selectedItem.profile?.fullName}</h3>
                    <p className="text-xs text-[#78716C]">
                      Username: <strong className="text-[#C2410C] font-mono">{selectedItem.username}</strong> • Mobile: {selectedItem.profile?.mobile}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveProfile(selectedItem._id)}
                      className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm hover:scale-105 transition-transform flex items-center gap-1"
                    >
                      <Check size={14} /> Approve & Verify Profile
                    </button>
                    <button
                      onClick={() => setShowRejectModal(true)}
                      className="px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl hover:bg-rose-100 transition-colors"
                    >
                      Reject Profile
                    </button>
                  </div>
                </div>

                {/* Payment / UTR Verification Card */}
                <div className="p-4 bg-[#FAF8F5] border border-[#EADCC8] rounded-2xl flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-[#78716C] uppercase">Payment / UTR Status</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono font-bold text-sm text-[#1C1917]">
                        UTR: {selectedItem.paymentDetails?.transactionId || selectedItem.membershipReceiptNumber || 'None'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        selectedItem.paymentStatus === 'verified'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : selectedItem.paymentStatus === 'pending_verification'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {selectedItem.paymentStatus || 'unpaid'}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#78716C]">Amount: ₹{selectedItem.membershipAmount || 1100} • {selectedItem.membershipMode || 'UPI'}</span>
                  </div>

                  {selectedItem.paymentStatus !== 'verified' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerifyPayment(selectedItem._id, true)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
                      >
                        ✓ Verify ₹1100 Credit
                      </button>
                      <button
                        onClick={() => handleVerifyPayment(selectedItem._id, false)}
                        className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold"
                      >
                        ✕ Reject Fake UTR
                      </button>
                    </div>
                  )}
                </div>

                {/* Uploaded Photos Grid for Review */}
                <div>
                  <h4 className="text-xs font-serif font-bold text-[#C2410C] uppercase tracking-wider mb-2">
                    Uploaded Photos ({selectedItem.photos?.length || 0})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {selectedItem.photos?.map((ph) => (
                      <div key={ph._id || ph.id} className="relative group rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#EADCC8] aspect-square">
                        <img src={`${API_URL}${ph.url}`} alt="Candidate" className="w-full h-full object-cover" />
                        <div className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-white/90 text-[9px] rounded-full text-[#1C1917] font-mono uppercase font-bold border border-[#EADCC8]">
                          {ph.status}
                        </div>
                        <div className="absolute inset-0 bg-[#1C1917]/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                          <button
                            onClick={() => handleReviewPhoto(ph._id || ph.id, 'approved')}
                            className="px-2 py-1 bg-emerald-500 text-white rounded-lg text-[10px] font-bold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReviewPhoto(ph._id || ph.id, 'rejected')}
                            className="px-2 py-1 bg-rose-500 text-white rounded-lg text-[10px] font-bold"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Profile Fields Snapshot */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-[#FAF8F5] p-4 rounded-2xl border border-[#EADCC8]">
                  <div><span className="text-[#78716C] block">Religion/Caste:</span><strong>{selectedItem.profile?.religion} / {selectedItem.profile?.caste}</strong></div>
                  <div><span className="text-[#78716C] block">Rashi / Nakshatra:</span><strong>{selectedItem.profile?.rashi || '-'} / {selectedItem.profile?.nakshatra || '-'}</strong></div>
                  <div><span className="text-[#78716C] block">Manglik:</span><strong>{selectedItem.profile?.manglik || 'No'}</strong></div>
                  <div><span className="text-[#78716C] block">Education:</span><strong>{selectedItem.profile?.education || '-'}</strong></div>
                  <div><span className="text-[#78716C] block">Profession:</span><strong>{selectedItem.profile?.profession || '-'}</strong></div>
                  <div><span className="text-[#78716C] block">Location:</span><strong>{selectedItem.profile?.currentCity || '-'}</strong></div>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-[#78716C] text-xs">Select a candidate from the left list to review.</div>
            )}
          </div>
        </div>
      )}

      {/* ── Reject Profile Modal ── */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-[#1C1917]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FAF8F5] border border-[#EADCC8] rounded-3xl p-6 shadow-luxury space-y-4">
            <h3 className="text-base font-serif font-bold text-[#1C1917]">Reject Profile Submission</h3>
            <p className="text-xs text-[#78716C]">Please provide a reason so the devotee can correct their details.</p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="E.g. Incomplete birth details, unclear photo..."
              className="w-full bg-white border border-[#EADCC8] rounded-xl p-3 text-xs text-[#1C1917] focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 bg-[#F5F0E8] text-[#44403C] rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectProfile}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(VerificationQueueSection);
