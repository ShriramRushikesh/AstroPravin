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
    <div className="group bg-neutral-900/80 border border-white/10 hover:border-amber-500/40 rounded-3xl overflow-hidden backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between">
      {/* ── Image & Badges ── */}
      <div className="relative aspect-[4/5] overflow-hidden bg-black/40 cursor-pointer" onClick={() => onViewDetail(profile)}>
        <img
          src={photoUrl}
          alt={profile.fullName}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {profile.isProfileFeatured ? (
            <span className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-[10px] font-bold rounded-lg shadow-lg uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={11} /> Featured
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-black/60 border border-white/10 text-white/80 text-[10px] rounded-lg backdrop-blur-md">
              {profile.religion || 'Vedic'}
            </span>
          )}

          <button
            onClick={(e) => { e.stopPropagation(); onShortlist(profile.userId || profile._id); }}
            className={`p-2 rounded-xl backdrop-blur-md transition-all pointer-events-auto ${
              profile.isShortlisted
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                : 'bg-black/60 border border-white/10 text-white/70 hover:text-amber-400 hover:bg-black/80'
            }`}
            title="Shortlist"
          >
            <Star size={14} fill={profile.isShortlisted ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-base font-serif font-bold text-white leading-snug group-hover:text-amber-300 transition-colors">
              {profile.fullName}
            </h3>
            {age && <span className="text-xs text-amber-400 font-mono font-bold">• {age} yrs</span>}
          </div>

          <div className="flex items-center gap-2 text-xs text-white/70 mt-1 flex-wrap">
            {profile.currentCity && (
              <span className="flex items-center gap-1">
                <MapPin size={11} className="text-amber-400" />
                {profile.currentCity}
              </span>
            )}
            {profile.occupation && (
              <span className="flex items-center gap-1">
                <Briefcase size={11} className="text-amber-400" />
                {profile.occupation.split(' / ')[0]}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Details & Astrological Info ── */}
      <div className="p-4 space-y-3 bg-white/[0.02]">
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-black/30 border border-white/5 rounded-xl p-2">
            <span className="text-white/40 block">Caste:</span>
            <span className="text-white/80 font-medium truncate block">{profile.caste || 'Open'}</span>
          </div>
          <div className="bg-black/30 border border-white/5 rounded-xl p-2">
            <span className="text-white/40 block">Rashi:</span>
            <span className="text-amber-400/90 font-medium truncate block">{profile.rashi || 'Not Set'}</span>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onInterest(profile.userId || profile._id)}
            disabled={isInterestSent}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              isInterestSent
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-gradient-to-r from-amber-500 to-amber-400 text-black hover:brightness-110 shadow-lg shadow-amber-500/10'
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
            className="p-2.5 bg-white/5 hover:bg-white/10 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-bold transition-colors"
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
