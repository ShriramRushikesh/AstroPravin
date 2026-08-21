import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Edit3, ShieldCheck, Camera, Sparkles, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { matrimonyApi } from '../../../services/matrimonyApi';
import { API_URL } from '../../../config';

const MyProfile = ({ onEditProfile }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await matrimonyApi.getProfile();
        setProfileData(data);
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-white/40 uppercase font-mono tracking-widest">Loading Profile...</span>
      </div>
    );
  }

  const p = profileData?.profile;
  const photos = profileData?.photos || [];
  const mainPhoto = photos.find(ph => ph.isProfilePicture) || photos[0];
  const photoUrl = mainPhoto ? `${API_URL}${mainPhoto.url}` : '/assets/avatar-placeholder.png';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-neutral-900/90 border border-amber-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-black border-2 border-amber-400 shadow-xl shrink-0">
              <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-serif font-bold text-white">{p?.fullName || 'My Profile'}</h2>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded uppercase">
                  {p?.maritalStatus?.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-white/60">
                {p?.currentCity || 'Solapur'} • {p?.religion || 'Hindu'} ({p?.caste || 'Open'})
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-amber-400">
                <Sparkles size={12} />
                <span>Rashi: {p?.rashi || 'Not Set'} • Nakshatra: {p?.nakshatra || 'Not Set'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onEditProfile}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold text-xs rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center gap-1.5 shrink-0 uppercase tracking-wider"
          >
            <Edit3 size={14} />
            <span>Edit Full Profile</span>
          </button>
        </div>

        {/* Gallery Thumbnails */}
        {photos.length > 0 && (
          <div className="pt-6">
            <h4 className="text-xs font-serif font-bold text-white/70 uppercase tracking-wider mb-3">
              Uploaded Photos ({photos.length})
            </h4>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {photos.map((ph) => (
                <div key={ph._id || ph.id} className="w-16 h-16 rounded-xl overflow-hidden bg-black border border-white/10 shrink-0 relative">
                  <img src={`${API_URL}${ph.url}`} alt="Photo" className="w-full h-full object-cover" />
                  {ph.isProfilePicture && (
                    <div className="absolute bottom-0 inset-x-0 bg-amber-500 text-black text-[8px] font-bold text-center">
                      MAIN
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(MyProfile);
