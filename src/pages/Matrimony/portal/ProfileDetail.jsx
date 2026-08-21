import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Heart, Star, Compass, Phone, Mail, MapPin,
  Briefcase, GraduationCap, Users, Sparkles, ShieldCheck,
  Check, Lock, ChevronLeft, ChevronRight
} from 'lucide-react';
import { API_URL } from '../../../config';

const ProfileDetail = ({ profile, onClose, onSendInterest, onToggleShortlist, onGunMilan }) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const photos = profile.photos || [];
  const currentPhoto = photos[activePhotoIdx];
  const photoUrl = currentPhoto ? `${API_URL}${currentPhoto.url}` : '/assets/avatar-placeholder.png';

  const age = profile.dateOfBirth
    ? Math.floor((new Date() - new Date(profile.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-neutral-900 border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl my-8 relative flex flex-col md:flex-row max-h-[90vh]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/60 hover:bg-black text-white/70 hover:text-white rounded-full border border-white/10 transition-colors"
        >
          <X size={18} />
        </button>

        {/* ── Left: Photo Gallery ────────────────────────────────────────── */}
        <div className="w-full md:w-5/12 bg-black/60 flex flex-col justify-between p-6 border-b md:border-b-0 md:border-r border-white/10">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-black/80 border border-white/10 group">
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
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setActivePhotoIdx(prev => (prev === photos.length - 1 ? 0 : prev + 1))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}

            <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 rounded text-[10px] text-white/70">
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
                  className={`w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    idx === activePhotoIdx ? 'border-amber-400 scale-105' : 'border-white/10 opacity-60'
                  }`}
                >
                  <img src={`${API_URL}${ph.url}`} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => onSendInterest(profile.userId || profile._id)}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold text-xs rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <Heart size={15} />
              <span>Send Interest Request</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onGunMilan(profile.userId || profile._id)}
                className="py-2.5 bg-white/5 hover:bg-white/10 border border-amber-500/30 text-amber-300 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Compass size={14} />
                <span>36 Guna Milan</span>
              </button>

              <button
                onClick={() => onToggleShortlist(profile.userId || profile._id)}
                className="py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Star size={14} />
                <span>Shortlist</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: Full Profile Details ─────────────────────────────────── */}
        <div className="w-full md:w-7/12 p-6 md:p-8 overflow-y-auto space-y-6 text-white text-xs">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-serif font-bold text-white">{profile.fullName}</h2>
              {profile.isProfileFeatured && (
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded-md">
                  Featured
                </span>
              )}
            </div>
            <p className="text-amber-400/90 font-medium text-xs mt-1">
              {age ? `${age} Years Old` : ''} • {profile.height ? `${profile.height} cm` : ''} • {profile.maritalStatus?.replace('_', ' ').toUpperCase()}
            </p>
          </div>

          {/* Section: Astrological */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            <h4 className="font-serif font-bold text-amber-300 text-sm flex items-center gap-1.5 border-b border-white/10 pb-2">
              <Sparkles size={14} /> Vedic Horoscope & Astrological Details
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-white/40 block">Moon Sign (Rashi):</span><span className="font-medium text-white">{profile.rashi || 'Not provided'}</span></div>
              <div><span className="text-white/40 block">Nakshatra:</span><span className="font-medium text-white">{profile.nakshatra || 'Not provided'}</span></div>
              <div><span className="text-white/40 block">Manglik:</span><span className="font-medium text-amber-400 capitalize">{profile.manglik || 'No'}</span></div>
              <div><span className="text-white/40 block">Birth Place:</span><span className="font-medium text-white">{profile.birthPlace || 'Not specified'}</span></div>
              <div><span className="text-white/40 block">Birth Time:</span><span className="font-medium text-white">{profile.birthTime || 'Not specified'}</span></div>
              <div><span className="text-white/40 block">Gotra:</span><span className="font-medium text-white">{profile.gotra || 'Not specified'}</span></div>
            </div>
          </div>

          {/* Section: Education & Career */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            <h4 className="font-serif font-bold text-amber-300 text-sm flex items-center gap-1.5 border-b border-white/10 pb-2">
              <GraduationCap size={14} /> Education & Career
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-white/40 block">Education:</span><span className="font-medium text-white">{profile.education || 'Not specified'}</span></div>
              <div><span className="text-white/40 block">Degree / Stream:</span><span className="font-medium text-white">{profile.educationDetails || '-'}</span></div>
              <div><span className="text-white/40 block">Occupation:</span><span className="font-medium text-white">{profile.occupation || '-'}</span></div>
              <div><span className="text-white/40 block">Annual Income:</span><span className="font-medium text-white">{profile.annualIncome ? `₹${profile.annualIncome.toLocaleString('en-IN')}` : 'Confidential'}</span></div>
              <div><span className="text-white/40 block">Work City:</span><span className="font-medium text-white">{profile.workCity || profile.currentCity || '-'}</span></div>
            </div>
          </div>

          {/* Section: Family */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            <h4 className="font-serif font-bold text-amber-300 text-sm flex items-center gap-1.5 border-b border-white/10 pb-2">
              <Users size={14} /> Family Background
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-white/40 block">Father's Name:</span><span className="font-medium text-white">{profile.fatherName || '-'}</span></div>
              <div><span className="text-white/40 block">Father's Occupation:</span><span className="font-medium text-white">{profile.fatherOccupation || '-'}</span></div>
              <div><span className="text-white/40 block">Mother's Name:</span><span className="font-medium text-white">{profile.motherName || '-'}</span></div>
              <div><span className="text-white/40 block">Family Type:</span><span className="font-medium text-white capitalize">{profile.familyType || 'Nuclear'}</span></div>
              <div><span className="text-white/40 block">Native Place:</span><span className="font-medium text-white">{profile.nativePlace || '-'}</span></div>
            </div>
          </div>

          {/* Section: Contact Visibility */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            <h4 className="font-serif font-bold text-amber-300 text-sm flex items-center gap-1.5 border-b border-white/10 pb-2">
              <Phone size={14} /> Contact Information
            </h4>
            {profile.contact ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <ShieldCheck size={16} />
                  <span>Mutual Match Verified — Contact Details Revealed</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-black/40 rounded-xl border border-white/10 flex items-center gap-2.5">
                    <Phone size={15} className="text-amber-400" />
                    <span>{profile.contact.mobile}</span>
                  </div>
                  {profile.contact.email && (
                    <div className="p-3 bg-black/40 rounded-xl border border-white/10 flex items-center gap-2.5">
                      <Mail size={15} className="text-amber-400" />
                      <span>{profile.contact.email}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-black/40 rounded-xl border border-white/10 flex items-center gap-3 text-white/50">
                <Lock size={16} className="text-amber-400/70 shrink-0" />
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
