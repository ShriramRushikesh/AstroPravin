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
    <div className="space-y-6 text-[#1C1917]">
      <div className="flex items-center justify-between bg-white border border-[#EADCC8] p-5 rounded-3xl shadow-luxury">
        <div>
          <h3 className="text-lg font-serif font-bold text-[#1C1917]">Photo Moderation Queue</h3>
          <p className="text-xs text-[#78716C]">Approve or reject newly submitted candidate photographs</p>
        </div>
        <button
          onClick={fetchPhotos}
          className="px-3.5 py-2 bg-white hover:bg-[#FFF7ED] text-[#44403C] hover:text-[#C2410C] rounded-xl border border-[#EADCC8] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-[#78716C]">Loading pending photos...</div>
      ) : photos.length === 0 ? (
        <div className="bg-white border border-[#EADCC8] rounded-3xl p-12 text-center space-y-3 shadow-sm">
          <ShieldCheck size={36} className="mx-auto text-emerald-600" />
          <h3 className="text-base font-serif font-bold text-[#1C1917]">No Pending Photos</h3>
          <p className="text-xs text-[#78716C]">All member profile photos have been reviewed and approved.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {photos.map((ph) => (
            <div
              key={ph._id || ph.id}
              className="bg-white border border-[#EADCC8] rounded-3xl overflow-hidden shadow-luxury flex flex-col justify-between"
            >
              <div className="aspect-square bg-[#FAF8F5] relative border-b border-[#EADCC8]">
                <img
                  src={`${API_URL}${ph.url}`}
                  alt="Candidate"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-3 space-y-2">
                <div>
                  <h4 className="text-xs font-serif font-bold text-[#1C1917] truncate">
                    {ph.profile?.fullName || 'Member'}
                  </h4>
                  <span className="text-[10px] text-[#78716C] block">
                    {new Date(ph.uploadedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <button
                    onClick={() => handleReview(ph._id || ph.id, 'approved')}
                    className="py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg shadow-sm flex items-center justify-center gap-1 transition-all"
                  >
                    <Check size={12} /> Approve
                  </button>
                  <button
                    onClick={() => {
                      const reason = window.prompt('Enter rejection reason (optional):');
                      handleReview(ph._id || ph.id, 'rejected', reason || '');
                    }}
                    className="py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold rounded-lg flex items-center justify-center gap-1 transition-all"
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
