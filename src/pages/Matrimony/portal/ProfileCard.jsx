import React from 'react';
import { Heart, Star, MapPin, Briefcase, Sparkles, Compass, Check, ArrowRight } from 'lucide-react';
import { API_URL } from '../../../config';

const ProfileCard = ({ profile, onInterest, onShortlist, onViewDetail, onGunMilan }) => {
  const mainPhoto = profile.photos?.find(p => p.isProfilePicture) || profile.photos?.[0];
  const photoUrl = mainPhoto ? `${API_URL}${mainPhoto.url}` : '/assets/avatar-placeholder.png';

  const age = profile.dateOfBirth
    ? Math.floor((new Date() - new Date(profile.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  const isInterestSent = profile.interestStatus === 'pending' || profile.interestStatus === 'accepted';

  return (
    <div className="group bg-white border border-[#EADCC8] hover:border-[#C2410C]/40 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-[0_15px_40px_rgba(194,65,12,0.09)] flex flex-col justify-between hover:-translate-y-1">
      {/* ── Image & Badges ── */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#FAF8F5] cursor-pointer" onClick={() => onViewDetail(profile)}>
        <img
          src={photoUrl}
          alt={profile.fullName}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60'; }}
        />
        {/* Subtle Soft Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {profile.isProfileFeatured ? (
            <span className="px-2.5 py-1 bg-gradient-to-r from-[#D97706] to-[#C2410C] text-white text-[10px] font-bold rounded-lg shadow-md uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={11} /> Featured
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-white/90 border border-[#EADCC8] text-[#44403C] text-[10px] font-semibold rounded-lg backdrop-blur-md shadow-sm">
              {profile.religion || 'Vedic'}
            </span>
          )}

          <button
            onClick={(e) => { e.stopPropagation(); onShortlist(profile.userId || profile._id); }}
            className={`p-2 rounded-xl backdrop-blur-md transition-all pointer-events-auto shadow-sm ${
              profile.isShortlisted
                ? 'bg-[#F59E0B] text-white shadow-md'
                : 'bg-white/90 border border-[#EADCC8] text-[#78716C] hover:text-[#C2410C] hover:bg-white'
            }`}
            title="Shortlist"
          >
            <Star size={14} fill={profile.isShortlisted ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-base font-serif font-bold text-white leading-snug group-hover:text-[#FDE68A] transition-colors drop-shadow-sm">
              {profile.fullName}
            </h3>
            {age && <span className="text-xs text-[#FDE68A] font-mono font-bold">• {age} yrs</span>}
          </div>

          <div className="flex items-center gap-2 text-xs text-white/90 mt-1 flex-wrap drop-shadow-sm">
            {profile.currentCity && (
              <span className="flex items-center gap-1">
                <MapPin size={11} className="text-[#FDE68A]" />
                {profile.currentCity}
              </span>
            )}
            {profile.occupation && (
              <span className="flex items-center gap-1">
                <Briefcase size={11} className="text-[#FDE68A]" />
                {profile.occupation.split(' / ')[0]}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Details & Astrological Info ── */}
      <div className="p-4 space-y-3 bg-[#FAF8F5]/60 border-t border-[#F5EFE6]">
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-white border border-[#EADCC8] rounded-xl p-2 shadow-xs">
            <span className="text-[#78716C] block text-[10px]">Caste:</span>
            <span className="text-[#1C1917] font-semibold truncate block">{profile.caste || 'Open'}</span>
          </div>
          <div className="bg-white border border-[#EADCC8] rounded-xl p-2 shadow-xs">
            <span className="text-[#78716C] block text-[10px]">Rashi:</span>
            <span className="text-[#C2410C] font-semibold truncate block">{profile.rashi || 'Not Set'}</span>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onInterest(profile.userId || profile._id)}
            disabled={isInterestSent}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              isInterestSent
                ? 'bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]'
                : 'bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white hover:brightness-105 shadow-md shadow-[#C2410C]/15 active:scale-95'
            }`}
          >
            {isInterestSent ? (
              <>
                <Check size={14} />
                <span>Interest Sent</span>
              </>
            ) : (
              <>
                <Heart size={14} />
                <span>Send Interest</span>
              </>
            )}
          </button>

          <button
            onClick={() => onGunMilan(profile.userId || profile._id)}
            className="p-2.5 bg-[#FFFBEB] hover:bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] rounded-xl text-xs font-bold transition-all hover:scale-105 shadow-xs cursor-pointer"
            title="Calculate 36 Guna Milan"
          >
            <Compass size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProfileCard);
