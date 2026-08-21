import React, { useState, useEffect } from 'react';
import { Camera, Check, X, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { matrimonyAdminService } from '../../../services/matrimonyAdminService';
import { API_URL } from '../../../config';

const PhotoReviewSection = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const data = await matrimonyAdminService.getPendingPhotos();
      setPhotos(data || []);
    } catch (err) {
      console.error('Failed to load pending photos', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleReview = async (photoId, status, reason = '') => {
    try {
      await matrimonyAdminService.reviewPhoto(photoId, status, reason);
      setPhotos(prev => prev.filter(p => (p._id || p.id) !== photoId));
    } catch (err) {
      alert(err.message || 'Failed to update photo status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
        <div>
          <h3 className="text-lg font-serif font-bold text-white">Photo Moderation Queue</h3>
          <p className="text-xs text-white/50">Approve or reject newly submitted candidate photographs</p>
        </div>
        <button
          onClick={fetchPhotos}
          className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white/80 rounded-xl border border-white/10 text-xs flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-white/40">Loading pending photos...</div>
      ) : photos.length === 0 ? (
        <div className="bg-neutral-900/60 border border-white/10 rounded-3xl p-12 text-center space-y-3">
          <ShieldCheck size={36} className="mx-auto text-emerald-400" />
          <h3 className="text-base font-serif font-bold text-white">No Pending Photos</h3>
          <p className="text-xs text-white/40">All member profile photos have been reviewed and approved.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {photos.map((ph) => (
            <div
              key={ph._id || ph.id}
              className="bg-neutral-900/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl flex flex-col justify-between"
            >
              <div className="aspect-square bg-black relative">
                <img
                  src={`${API_URL}${ph.url}`}
                  alt="Candidate"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-3 space-y-2">
                <div>
                  <h4 className="text-xs font-serif font-bold text-white truncate">
                    {ph.profile?.fullName || 'Member'}
                  </h4>
                  <span className="text-[10px] text-white/40 block">
                    {new Date(ph.uploadedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <button
                    onClick={() => handleReview(ph._id || ph.id, 'approved')}
                    className="py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[10px] rounded-lg shadow flex items-center justify-center gap-1 transition-all"
                  >
                    <Check size={12} /> Approve
                  </button>
                  <button
                    onClick={() => {
                      const reason = window.prompt('Enter rejection reason (optional):');
                      handleReview(ph._id || ph.id, 'rejected', reason || '');
                    }}
                    className="py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[10px] rounded-lg flex items-center justify-center gap-1 transition-all"
                  >
                    <X size={12} /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(PhotoReviewSection);
