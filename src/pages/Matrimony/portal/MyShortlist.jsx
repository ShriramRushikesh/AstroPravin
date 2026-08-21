import React, { useState, useEffect } from 'react';
import { Star, AlertCircle } from 'lucide-react';
import ProfileCard from './ProfileCard';
import ProfileDetail from './ProfileDetail';
import GunMilanResult from './GunMilanResult';
import { matrimonyApi } from '../../../services/matrimonyApi';

const MyShortlist = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [gunMilanTargetId, setGunMilanTargetId] = useState(null);

  const fetchShortlisted = async () => {
    setLoading(true);
    try {
      const data = await matrimonyApi.getShortlisted();
      setProfiles(data || []);
    } catch (err) {
      console.error('Failed to load shortlist', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShortlisted();
  }, []);

  const handleInterest = async (targetUserId) => {
    try {
      await matrimonyApi.sendInterest(targetUserId);
      alert('Interest sent successfully!');
    } catch (err) {
      alert(err.message || 'Failed to send interest');
    }
  };

  const handleToggleShortlist = async (targetUserId) => {
    try {
      await matrimonyApi.toggleShortlist(targetUserId);
      fetchShortlisted();
    } catch (err) {
      alert(err.message || 'Failed to update shortlist');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#EADCC8] p-4 sm:p-5 rounded-3xl shadow-sm">
        <h2 className="text-xl font-serif font-bold text-[#1C1917]">My Shortlisted Profiles</h2>
        <p className="text-xs text-[#78716C]">Bookmarked candidates saved for quick review</p>
      </div>

      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-[#C2410C] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#78716C] uppercase tracking-widest font-mono">Loading Shortlist...</span>
        </div>
      ) : profiles.length === 0 ? (
        <div className="bg-white border border-[#EADCC8] rounded-3xl p-12 text-center space-y-3 shadow-sm">
          <div className="p-3 bg-[#FFFBEB] text-[#B45309] rounded-full w-fit mx-auto border border-[#FDE68A]">
            <Star size={28} />
          </div>
          <h3 className="text-base font-serif font-bold text-[#1C1917]">Your shortlist is empty</h3>
          <p className="text-xs text-[#78716C] max-w-sm mx-auto">
            Click the star icon on any profile card to save profiles you like here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((p) => (
            <ProfileCard
              key={p._id || p.userId}
              profile={{ ...p, isShortlisted: true }}
              onInterest={handleInterest}
              onShortlist={handleToggleShortlist}
              onViewDetail={setSelectedProfile}
              onGunMilan={setGunMilanTargetId}
            />
          ))}
        </div>
      )}

      {selectedProfile && (
        <ProfileDetail
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
          onSendInterest={handleInterest}
          onToggleShortlist={handleToggleShortlist}
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

export default React.memo(MyShortlist);
