import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Sparkles, BookOpen, Heart, Users, Compass,
  Camera, Check, ChevronRight, ChevronLeft, Upload, Trash2,
  AlertCircle, CheckCircle2, ShieldCheck
} from 'lucide-react';
import {
  RASHIS, NAKSHATRAS, RELIGIONS, CASTES, MARITAL_STATUSES,
  EDUCATION_LEVELS, OCCUPATIONS, COMPLEXIONS, BLOOD_GROUPS,
  MANGLIK_OPTIONS, FAMILY_TYPES, FAMILY_STATUSES
} from '../../../lib/matrimony/constants';
import { matrimonyApi } from '../../../services/matrimonyApi';
import { API_URL } from '../../../config';

const WIZARD_STEPS = [
  { id: 1, title: 'Basic Info', icon: User },
  { id: 2, title: 'Appearance', icon: Sparkles },
  { id: 3, title: 'Astrological', icon: Compass },
  { id: 4, title: 'Career & Edu', icon: BookOpen },
  { id: 5, title: 'Family', icon: Users },
  { id: 6, title: 'Partner Prefs', icon: Heart },
  { id: 7, title: 'Photos', icon: Camera },
];

const ProfileWizard = ({ existingProfile, existingPhotos, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [photos, setPhotos] = useState(existingPhotos || []);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1
    fullName: existingProfile?.fullName || '',
    dateOfBirth: existingProfile?.dateOfBirth ? existingProfile.dateOfBirth.substring(0, 10) : '',
    gender: existingProfile?.gender || 'male',
    religion: existingProfile?.religion || 'Hindu',
    caste: existingProfile?.caste || '',
    subCaste: existingProfile?.subCaste || '',
    gotra: existingProfile?.gotra || '',
    motherTongue: existingProfile?.motherTongue || 'Marathi',
    maritalStatus: existingProfile?.maritalStatus || 'never_married',
    mobile: existingProfile?.mobile || '',
    email: existingProfile?.email || '',
    currentCity: existingProfile?.currentCity || 'Solapur',
    currentState: existingProfile?.currentState || 'Maharashtra',
    currentCountry: existingProfile?.currentCountry || 'India',

    // Step 2
    height: existingProfile?.height || 165,
    weight: existingProfile?.weight || 65,
    complexion: existingProfile?.complexion || 'Fair',
    bloodGroup: existingProfile?.bloodGroup || 'O+',
    disability: existingProfile?.disability || false,
    disabilityDetails: existingProfile?.disabilityDetails || '',

    // Step 3
    birthTime: existingProfile?.birthTime || '',
    birthPlace: existingProfile?.birthPlace || '',
    rashi: existingProfile?.rashi || '',
    nakshatra: existingProfile?.nakshatra || '',
    manglik: existingProfile?.manglik || 'no',

    // Step 4
    education: existingProfile?.education || '',
    educationDetails: existingProfile?.educationDetails || '',
    occupation: existingProfile?.occupation || '',
    employerName: existingProfile?.employerName || '',
    annualIncome: existingProfile?.annualIncome || 0,
    workCity: existingProfile?.workCity || '',
    workCountry: existingProfile?.workCountry || 'India',

    // Step 5
    fatherName: existingProfile?.fatherName || '',
    fatherOccupation: existingProfile?.fatherOccupation || '',
    motherName: existingProfile?.motherName || '',
    motherOccupation: existingProfile?.motherOccupation || '',
    siblings: existingProfile?.siblings || 0,
    siblingDetails: existingProfile?.siblingDetails || '',
    familyType: existingProfile?.familyType || 'nuclear',
    familyStatus: existingProfile?.familyStatus || 'middle_class',
    nativePlace: existingProfile?.nativePlace || '',

    // Step 6
    partnerAgeMin: existingProfile?.partnerAgeMin || 21,
    partnerAgeMax: existingProfile?.partnerAgeMax || 30,
    partnerHeightMin: existingProfile?.partnerHeightMin || 150,
    partnerHeightMax: existingProfile?.partnerHeightMax || 185,
    partnerReligion: existingProfile?.partnerReligion || ['Hindu'],
    partnerCaste: existingProfile?.partnerCaste || [],
    partnerMaritalStatus: existingProfile?.partnerMaritalStatus || ['never_married'],
    partnerEducation: existingProfile?.partnerEducation || '',
    partnerOccupation: existingProfile?.partnerOccupation || '',
    partnerAnnualIncomeMin: existingProfile?.partnerAnnualIncomeMin || 0,
    partnerManglik: existingProfile?.partnerManglik || 'any',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    setError('');
    setSaving(true);
    try {
      // Partial save to backend
      await matrimonyApi.saveProfile({
        ...formData,
        currentStep,
      });

      if (currentStep < 7) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Final submission
        await matrimonyApi.saveProfile({
          ...formData,
          isFinalSubmit: true,
        });
        setIsSubmitted(true);
        if (onComplete) onComplete();
      }
    } catch (err) {
      setError(err.message || 'Failed to save profile step');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (photos.length >= 10) {
      setError('Maximum 10 photos allowed.');
      return;
    }

    setUploadingPhoto(true);
    setError('');
    try {
      const isMain = photos.length === 0;
      const uploaded = await matrimonyApi.uploadPhoto(file, isMain);
      setPhotos(prev => [...prev, uploaded]);
    } catch (err) {
      setError(err.message || 'Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      await matrimonyApi.deletePhoto(photoId);
      setPhotos(prev => prev.filter(p => (p._id || p.id) !== photoId));
    } catch (err) {
      setError(err.message || 'Failed to delete photo');
    }
  };

  const handleSetMainPhoto = async (photoId) => {
    try {
      await matrimonyApi.setProfilePicture(photoId);
      setPhotos(prev => prev.map(p => ({
        ...p,
        isProfilePicture: (p._id || p.id) === photoId,
      })));
    } catch (err) {
      setError(err.message || 'Failed to set main photo');
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-neutral-900/90 border border-amber-500/40 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6"
        >
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
            <ShieldCheck size={36} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">Profile Submitted for Verification!</h2>
          <p className="text-sm text-white/70 leading-relaxed max-w-lg mx-auto">
            Thank you for completing your Vedic Matrimony profile. Pandit Acharya Pravin and our staff will review and verify your details and photos shortly. Once verified, your profile will be active in search matches.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold text-xs rounded-xl shadow-lg hover:brightness-110 transition-all uppercase tracking-wider"
          >
            Go To My Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* ── Top Progress Header ────────────────────────────────────────────── */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-serif font-bold text-amber-300">Complete Your Matrimony Profile</h2>
            <p className="text-xs text-white/50">Step {currentStep} of 7: {WIZARD_STEPS[currentStep - 1].title}</p>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400">
            {Math.round(((currentStep - 1) / 7) * 100)}% Completed
          </span>
        </div>

        {/* Stepper Dots / Icons */}
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {WIZARD_STEPS.map((step) => {
            const Icon = step.icon;
            const isDone = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            return (
              <div
                key={step.id}
                onClick={() => { if (step.id < currentStep) setCurrentStep(step.id); }}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl text-center transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold'
                    : isDone
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-white/30 border border-transparent'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isCurrent ? 'bg-amber-500 text-black' : isDone ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
                  {isDone ? <Check size={14} /> : <Icon size={14} />}
                </div>
                <span className="text-[10px] hidden md:block truncate w-full">{step.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Form Step Container ───────────────────────────────────────────── */}
      <div className="bg-neutral-900/90 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* ── STEP 1: Basic Information ── */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-base font-serif font-bold text-amber-300 border-b border-white/10 pb-2">
                  Personal & Community Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={e => handleChange('fullName', e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Date of Birth *</label>
                    <input
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={e => handleChange('dateOfBirth', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Gender *</label>
                    <select
                      value={formData.gender}
                      onChange={e => handleChange('gender', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Marital Status *</label>
                    <select
                      value={formData.maritalStatus}
                      onChange={e => handleChange('maritalStatus', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none"
                    >
                      {MARITAL_STATUSES.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Religion</label>
                    <select
                      value={formData.religion}
                      onChange={e => handleChange('religion', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none"
                    >
                      {RELIGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Caste</label>
                    <input
                      type="text"
                      value={formData.caste}
                      onChange={e => handleChange('caste', e.target.value)}
                      placeholder="e.g. Maratha / Brahmin"
                      className="w-full bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Gotra</label>
                    <input
                      type="text"
                      value={formData.gotra}
                      onChange={e => handleChange('gotra', e.target.value)}
                      placeholder="e.g. Kashyap"
                      className="w-full bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Mother Tongue</label>
                    <input
                      type="text"
                      value={formData.motherTongue}
                      onChange={e => handleChange('motherTongue', e.target.value)}
                      placeholder="e.g. Marathi / Hindi"
                      className="w-full bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: Appearance & Physical ── */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-base font-serif font-bold text-amber-300 border-b border-white/10 pb-2">
                  Physical Characteristics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Height (in cm)</label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={e => handleChange('height', Number(e.target.value))}
                      placeholder="e.g. 172"
                      className="w-full bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none"
                    />
                    <span className="text-[10px] text-white/40 mt-1 block">Approx {Math.floor(formData.height / 30.48)}' {Math.round((formData.height % 30.48) / 2.54)}"</span>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Weight (in kg)</label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={e => handleChange('weight', Number(e.target.value))}
                      placeholder="e.g. 68"
                      className="w-full bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Complexion</label>
                    <select
                      value={formData.complexion}
                      onChange={e => handleChange('complexion', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none"
                    >
                      {COMPLEXIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Blood Group</label>
                    <select
                      value={formData.bloodGroup}
                      onChange={e => handleChange('bloodGroup', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none"
                    >
                      {BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3: Astrological Details ── */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-base font-serif font-bold text-amber-300 border-b border-white/10 pb-2">
                  Vedic Horoscope & Kundli Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Birth Time (Exact)</label>
                    <input
                      type="time"
                      value={formData.birthTime}
                      onChange={e => handleChange('birthTime', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Birth Place / City</label>
                    <input
                      type="text"
                      value={formData.birthPlace}
                      onChange={e => handleChange('birthPlace', e.target.value)}
                      placeholder="e.g. Solapur, Maharashtra"
                      className="w-full bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Moon Sign (Rashi)</label>
                    <select
                      value={formData.rashi}
                      onChange={e => handleChange('rashi', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none"
                    >
                      <option value="">-- Select Rashi --</option>
                      {RASHIS.map(r => <option key={r} value={r.split(' ')[0]}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Nakshatra</label>
                    <select
                      value={formData.nakshatra}
                      onChange={e => handleChange('nakshatra', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none"
                    >
                      <option value="">-- Select Nakshatra --</option>
                      {NAKSHATRAS.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Manglik Status</label>
                    <select
                      value={formData.manglik}
                      onChange={e => handleChange('manglik', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none"
                    >
                      {MANGLIK_OPTIONS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 4: Education & Career ── */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-base font-serif font-bold text-amber-300 border-b border-white/10 pb-2">
                  Education & Professional Background
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Highest Education</label>
                    <select
                      value={formData.education}
                      onChange={e => handleChange('education', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none"
                    >
                      <option value="">-- Select Level --</option>
                      {EDUCATION_LEVELS.map(ed => <option key={ed} value={ed}>{ed}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Degree Details</label>
                    <input
                      type="text"
                      value={formData.educationDetails}
                      onChange={e => handleChange('educationDetails', e.target.value)}
                      placeholder="e.g. B.Tech Computer Science"
                      className="w-full bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Occupation</label>
                    <select
                      value={formData.occupation}
                      onChange={e => handleChange('occupation', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none"
                    >
                      <option value="">-- Select Occupation --</option>
                      {OCCUPATIONS.map(occ => <option key={occ} value={occ}>{occ}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Annual Income (₹ INR)</label>
                    <input
                      type="number"
                      value={formData.annualIncome}
                      onChange={e => handleChange('annualIncome', Number(e.target.value))}
                      placeholder="e.g. 1200000"
                      className="w-full bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Work City</label>
                    <input
                      type="text"
                      value={formData.workCity}
                      onChange={e => handleChange('workCity', e.target.value)}
                      placeholder="e.g. Pune / Mumbai"
                      className="w-full bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 5: Family Details ── */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h3 className="text-base font-serif font-bold text-amber-300 border-b border-white/10 pb-2">
                  Family Background
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Father's Name</label>
                    <input
                      type="text"
                      value={formData.fatherName}
                      onChange={e => handleChange('fatherName', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Father's Occupation</label>
                    <input
                      type="text"
                      value={formData.fatherOccupation}
                      onChange={e => handleChange('fatherOccupation', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Mother's Name</label>
                    <input
                      type="text"
                      value={formData.motherName}
                      onChange={e => handleChange('motherName', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Mother's Occupation</label>
                    <input
                      type="text"
                      value={formData.motherOccupation}
                      onChange={e => handleChange('motherOccupation', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Family Type</label>
                    <select
                      value={formData.familyType}
                      onChange={e => handleChange('familyType', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none"
                    >
                      {FAMILY_TYPES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Native Place</label>
                    <input
                      type="text"
                      value={formData.nativePlace}
                      onChange={e => handleChange('nativePlace', e.target.value)}
                      placeholder="e.g. Solapur"
                      className="w-full bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 6: Partner Preferences ── */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <h3 className="text-base font-serif font-bold text-amber-300 border-b border-white/10 pb-2">
                  Partner Expectations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Age Range ({formData.partnerAgeMin} - {formData.partnerAgeMax} yrs)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="18"
                        max="70"
                        value={formData.partnerAgeMin}
                        onChange={e => handleChange('partnerAgeMin', Number(e.target.value))}
                        className="w-1/2 bg-black/40 border border-white/10 rounded-xl p-2 text-sm text-white"
                      />
                      <span className="text-white/40">to</span>
                      <input
                        type="number"
                        min="18"
                        max="70"
                        value={formData.partnerAgeMax}
                        onChange={e => handleChange('partnerAgeMax', Number(e.target.value))}
                        className="w-1/2 bg-black/40 border border-white/10 rounded-xl p-2 text-sm text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Min Annual Income (₹)</label>
                    <input
                      type="number"
                      value={formData.partnerAnnualIncomeMin}
                      onChange={e => handleChange('partnerAnnualIncomeMin', Number(e.target.value))}
                      placeholder="e.g. 500000"
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Manglik Preference</label>
                    <select
                      value={formData.partnerManglik}
                      onChange={e => handleChange('partnerManglik', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-sm text-white"
                    >
                      <option value="any">Doesn't Matter / Any</option>
                      <option value="no">Non-Manglik Only</option>
                      <option value="yes">Manglik Only</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 7: Photos ── */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-serif font-bold text-amber-300 border-b border-white/10 pb-2">
                    Profile Photos (Up to 10)
                  </h3>
                  <p className="text-xs text-white/50 mt-1">
                    Upload clear, recent photographs. The first photo will be set as your main display photo.
                  </p>
                </div>

                {/* Photo Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {photos.map((ph) => {
                    const id = ph._id || ph.id;
                    const isMain = ph.isProfilePicture;
                    return (
                      <div key={id} className="relative group rounded-2xl overflow-hidden border border-white/10 bg-black aspect-square">
                        <img
                          src={`${API_URL}${ph.url}`}
                          alt="Photo"
                          className="w-full h-full object-cover"
                        />
                        {isMain && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-black text-[9px] font-bold rounded-md shadow-md uppercase">
                            Main Photo
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                          {!isMain && (
                            <button
                              type="button"
                              onClick={() => handleSetMainPhoto(id)}
                              className="px-2 py-1 bg-amber-500 text-black text-[10px] font-bold rounded-lg"
                            >
                              Make Main
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeletePhoto(id)}
                            className="p-1.5 bg-rose-500/80 text-white rounded-lg hover:bg-rose-600"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Upload Box */}
                  {photos.length < 10 && (
                    <label className="border-2 border-dashed border-white/20 hover:border-amber-500/50 rounded-2xl flex flex-col items-center justify-center gap-2 p-4 cursor-pointer transition-colors aspect-square text-center">
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                        onChange={handlePhotoUpload}
                        disabled={uploadingPhoto}
                      />
                      {uploadingPhoto ? (
                        <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <div className="p-3 bg-white/5 rounded-full text-amber-400">
                            <Upload size={18} />
                          </div>
                          <span className="text-xs text-white/70 font-medium">+ Add Photo</span>
                          <span className="text-[10px] text-white/30">JPG, PNG (max 5MB)</span>
                        </>
                      )}
                    </label>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Navigation Buttons ────────────────────────────────────────── */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
          <button
            type="button"
            disabled={currentStep === 1 || saving}
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft size={14} />
            <span>Previous</span>
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={handleNext}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-black text-xs font-bold rounded-xl shadow-lg hover:brightness-110 active:scale-[0.99] transition-all flex items-center gap-1.5"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : currentStep === 7 ? (
              <>
                <CheckCircle2 size={14} />
                <span>Submit Profile for Review</span>
              </>
            ) : (
              <>
                <span>Save & Continue</span>
                <ChevronRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProfileWizard);
