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
      <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
        <h2 className="text-xl font-serif font-bold text-white">My Shortlisted Profiles</h2>
        <p className="text-xs text-white/50">Bookmarked candidates saved for quick review</p>
      </div>

      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-white/40 uppercase tracking-widest font-mono">Loading Shortlist...</span>
        </div>
      ) : profiles.length === 0 ? (
        <div className="bg-neutral-900/60 border border-white/10 rounded-3xl p-12 text-center space-y-3">
          <Star size={32} className="mx-auto text-white/20" />
          <h3 className="text-base font-serif font-bold text-white">Your shortlist is empty</h3>
          <p className="text-xs text-white/40 max-w-sm mx-auto">
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
