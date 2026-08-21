import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X, Heart, Star, Compass, Phone, Mail, MapPin,
  Briefcase, GraduationCap, Users, Sparkles, ShieldCheck,
  Check, Lock, ChevronLeft, ChevronRight
} from 'lucide-react';
import { API_URL } from '../../../config';
import { LotusCrest } from '../components/MatrimonyDecorativeArt';

const ProfileDetail = ({ profile, onClose, onSendInterest, onToggleShortlist, onGunMilan }) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const photos = profile.photos || [];
  const currentPhoto = photos[activePhotoIdx];
  const photoUrl = currentPhoto ? `${API_URL}${currentPhoto.url}` : '/assets/avatar-placeholder.png';

  const age = profile.dateOfBirth
    ? Math.floor((new Date() - new Date(profile.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-4xl bg-white border border-[#EADCC8] rounded-3xl overflow-hidden shadow-2xl my-8 relative flex flex-col md:flex-row max-h-[90vh]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-[#FAF8F5] hover:bg-[#F5EFE6] text-[#574F47] hover:text-[#1C1917] rounded-full border border-[#EADCC8] transition-colors cursor-pointer shadow-sm"
        >
          <X size={18} />
        </button>

        {/* ── Left: Photo Gallery ────────────────────────────────────────── */}
        <div className="w-full md:w-5/12 bg-[#FAF8F5] flex flex-col justify-between p-6 border-b md:border-b-0 md:border-r border-[#EADCC8]">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white border border-[#EADCC8] group shadow-inner">
            <img
              src={photoUrl}
              alt={profile.fullName}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60'; }}
            />

            {photos.length > 1 && (
              <>
                <button
                  onClick={() => setActivePhotoIdx(prev => (prev === 0 ? photos.length - 1 : prev - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 text-[#1C1917] rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setActivePhotoIdx(prev => (prev === photos.length - 1 ? 0 : prev + 1))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 text-[#1C1917] rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}

            <div className="absolute bottom-2 right-2 px-2.5 py-0.5 bg-black/60 backdrop-blur-sm rounded-md text-[10px] text-white font-mono">
              {photos.length > 0 ? `${activePhotoIdx + 1} / ${photos.length}` : '1 / 1'}
            </div>
          </div>

          {/* Thumbnails */}
          {photos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto py-3">
              {photos.map((ph, idx) => (
                <button
                  key={ph.id || ph._id}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    idx === activePhotoIdx ? 'border-[#C2410C] scale-105 shadow-sm' : 'border-[#EADCC8] opacity-60'
                  }`}
                >
                  <img src={`${API_URL}${ph.url}`} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-2 pt-3">
            <button
              onClick={() => onSendInterest(profile.userId || profile._id)}
              className="w-full py-3 bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white font-bold text-xs rounded-xl shadow-md shadow-[#C2410C]/20 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
            >
              <Heart size={15} />
              <span>Send Interest Request</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onGunMilan(profile.userId || profile._id)}
                className="py-2.5 bg-[#FFFBEB] hover:bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Compass size={14} />
                <span>36 Guna Milan</span>
              </button>

              <button
                onClick={() => onToggleShortlist(profile.userId || profile._id)}
                className="py-2.5 bg-white hover:bg-[#FAF8F5] border border-[#EADCC8] text-[#574F47] hover:text-[#C2410C] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Star size={14} fill={profile.isShortlisted ? 'currentColor' : 'none'} />
                <span>Shortlist</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: Full Profile Details ─────────────────────────────────── */}
        <div className="w-full md:w-7/12 p-6 md:p-8 overflow-y-auto space-y-5 text-[#1C1917] text-xs">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-serif font-bold text-[#1C1917]">{profile.fullName}</h2>
              {profile.isProfileFeatured && (
                <span className="px-2.5 py-0.5 bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] text-[10px] font-bold rounded-md">
                  Featured
                </span>
              )}
            </div>
            <p className="text-[#C2410C] font-semibold text-xs mt-1">
              {age ? `${age} Years Old` : ''} • {profile.height ? `${profile.height} cm` : ''} • {profile.maritalStatus?.replace('_', ' ').toUpperCase()}
            </p>
          </div>

          {/* Section: Astrological */}
          <div className="bg-[#FAF8F5] border border-[#EADCC8] rounded-2xl p-4 space-y-3">
            <h4 className="font-serif font-bold text-[#B45309] text-sm flex items-center gap-1.5 border-b border-[#EADCC8] pb-2">
              <Sparkles size={14} className="text-[#D97706]" /> Vedic Horoscope & Astrological Details
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-[#78716C] block text-[11px]">Moon Sign (Rashi):</span><span className="font-semibold text-[#1C1917]">{profile.rashi || 'Not provided'}</span></div>
              <div><span className="text-[#78716C] block text-[11px]">Nakshatra:</span><span className="font-semibold text-[#1C1917]">{profile.nakshatra || 'Not provided'}</span></div>
              <div><span className="text-[#78716C] block text-[11px]">Manglik:</span><span className="font-semibold text-[#C2410C] capitalize">{profile.manglik || 'No'}</span></div>
              <div><span className="text-[#78716C] block text-[11px]">Birth Place:</span><span className="font-semibold text-[#1C1917]">{profile.birthPlace || 'Not specified'}</span></div>
              <div><span className="text-[#78716C] block text-[11px]">Birth Time:</span><span className="font-semibold text-[#1C1917]">{profile.birthTime || 'Not specified'}</span></div>
              <div><span className="text-[#78716C] block text-[11px]">Gotra:</span><span className="font-semibold text-[#1C1917]">{profile.gotra || 'Not specified'}</span></div>
            </div>
          </div>

          {/* Section: Education & Career */}
          <div className="bg-[#FAF8F5] border border-[#EADCC8] rounded-2xl p-4 space-y-3">
            <h4 className="font-serif font-bold text-[#B45309] text-sm flex items-center gap-1.5 border-b border-[#EADCC8] pb-2">
              <GraduationCap size={14} className="text-[#D97706]" /> Education & Career
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-[#78716C] block text-[11px]">Education:</span><span className="font-semibold text-[#1C1917]">{profile.education || 'Not specified'}</span></div>
              <div><span className="text-[#78716C] block text-[11px]">Degree / Stream:</span><span className="font-semibold text-[#1C1917]">{profile.educationDetails || '-'}</span></div>
              <div><span className="text-[#78716C] block text-[11px]">Occupation:</span><span className="font-semibold text-[#1C1917]">{profile.occupation || '-'}</span></div>
              <div><span className="text-[#78716C] block text-[11px]">Annual Income:</span><span className="font-semibold text-[#1C1917]">{profile.annualIncome ? `₹${profile.annualIncome.toLocaleString('en-IN')}` : 'Confidential'}</span></div>
              <div><span className="text-[#78716C] block text-[11px]">Work City:</span><span className="font-semibold text-[#1C1917]">{profile.workCity || profile.currentCity || '-'}</span></div>
            </div>
          </div>

          {/* Section: Family */}
          <div className="bg-[#FAF8F5] border border-[#EADCC8] rounded-2xl p-4 space-y-3">
            <h4 className="font-serif font-bold text-[#B45309] text-sm flex items-center gap-1.5 border-b border-[#EADCC8] pb-2">
              <Users size={14} className="text-[#D97706]" /> Family Background
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-[#78716C] block text-[11px]">Father's Name:</span><span className="font-semibold text-[#1C1917]">{profile.fatherName || '-'}</span></div>
              <div><span className="text-[#78716C] block text-[11px]">Father's Occupation:</span><span className="font-semibold text-[#1C1917]">{profile.fatherOccupation || '-'}</span></div>
              <div><span className="text-[#78716C] block text-[11px]">Mother's Name:</span><span className="font-semibold text-[#1C1917]">{profile.motherName || '-'}</span></div>
              <div><span className="text-[#78716C] block text-[11px]">Family Type:</span><span className="font-semibold text-[#1C1917] capitalize">{profile.familyType || 'Nuclear'}</span></div>
              <div><span className="text-[#78716C] block text-[11px]">Native Place:</span><span className="font-semibold text-[#1C1917]">{profile.nativePlace || '-'}</span></div>
            </div>
          </div>

          {/* Section: Contact Visibility */}
          <div className="bg-[#FAF8F5] border border-[#EADCC8] rounded-2xl p-4 space-y-3">
            <h4 className="font-serif font-bold text-[#B45309] text-sm flex items-center gap-1.5 border-b border-[#EADCC8] pb-2">
              <Phone size={14} className="text-[#D97706]" /> Contact Information
            </h4>
            {profile.contact ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#15803D] font-bold">
                  <ShieldCheck size={16} />
                  <span>Mutual Match Verified — Contact Details Revealed</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-white rounded-xl border border-[#EADCC8] flex items-center gap-2.5">
                    <Phone size={15} className="text-[#C2410C]" />
                    <span className="font-mono font-semibold">{profile.contact.mobile}</span>
                  </div>
                  {profile.contact.email && (
                    <div className="p-3 bg-white rounded-xl border border-[#EADCC8] flex items-center gap-2.5">
                      <Mail size={15} className="text-[#C2410C]" />
                      <span className="font-semibold">{profile.contact.email}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-white rounded-xl border border-[#EADCC8] flex items-center gap-3 text-[#78716C]">
                <Lock size={16} className="text-[#C2410C] shrink-0" />
                <span>Contact details are confidential. Send an interest request; once mutually accepted, contact info will be unlocked.</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default React.memo(ProfileDetail);
