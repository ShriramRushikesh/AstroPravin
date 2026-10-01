import React, { useState } from 'react';
import { API_URL } from '../../config';
import { User, Briefcase, Users, Moon, Heart, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

const RASHI_LIST = ['Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)', 'Karka (Cancer)', 'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchika (Scorpio)', 'Dhanu (Sagittarius)', 'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)'];
const NAKSHATRA_LIST = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
const NADI_LIST = ['Adi', 'Madhya', 'Antya'];

const ProfileWizard = ({ existingProfile, userState, onSaveSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    profile_for: existingProfile?.profile_for || 'self',
    full_name: existingProfile?.full_name || '',
    gender: existingProfile?.gender || 'male',
    date_of_birth: existingProfile?.date_of_birth || '',
    height: existingProfile?.height || "5'7\"",
    weight: existingProfile?.weight || '',
    complexion: existingProfile?.complexion || 'Fair',
    blood_group: existingProfile?.blood_group || 'O+',
    religion: existingProfile?.religion || 'Hindu',
    caste: existingProfile?.caste || 'Maratha',
    sub_caste: existingProfile?.sub_caste || '',
    marital_status: existingProfile?.marital_status || 'Never Married',
    city: existingProfile?.city || '',
    state: existingProfile?.state || 'Maharashtra',
    country: existingProfile?.country || 'India',
    contact_phone: existingProfile?.contact_phone || '',
    whatsapp_phone: existingProfile?.whatsapp_phone || '',
    about_me: existingProfile?.about_me || '',

    education: {
      highest_education: existingProfile?.education?.highest_education || 'B.Tech / B.E.',
      education_detail: existingProfile?.education?.education_detail || '',
      college: existingProfile?.education?.college || '',
      employed_in: existingProfile?.education?.employed_in || 'Private Sector',
      occupation: existingProfile?.education?.occupation || 'Software Engineer',
      annual_income: existingProfile?.education?.annual_income || '10-15 Lakh',
    },

    family: {
      family_type: existingProfile?.family?.family_type || 'Nuclear',
      family_status: existingProfile?.family?.family_status || 'Upper Middle Class',
      father_name: existingProfile?.family?.father_name || '',
      father_occupation: existingProfile?.family?.father_occupation || '',
      mother_name: existingProfile?.family?.mother_name || '',
      mother_occupation: existingProfile?.family?.mother_occupation || '',
      brothers: existingProfile?.family?.brothers ?? 1,
      sisters: existingProfile?.family?.sisters ?? 0,
      native_place: existingProfile?.family?.native_place || '',
    },

    lifestyle: {
      diet: existingProfile?.lifestyle?.diet || 'Vegetarian',
      smoking: existingProfile?.lifestyle?.smoking || 'No',
      drinking: existingProfile?.lifestyle?.drinking || 'No',
      hobbies: existingProfile?.lifestyle?.hobbies || ['Reading', 'Music'],
      mother_tongue: existingProfile?.lifestyle?.mother_tongue || 'Marathi',
    },

    horoscope: {
      rashi: existingProfile?.horoscope?.rashi || 'Mesha (Aries)',
      nakshatra: existingProfile?.horoscope?.nakshatra || 'Ashwini',
      gotra: existingProfile?.horoscope?.gotra || 'Kashyap',
      nadi: existingProfile?.horoscope?.nadi || 'Madhya',
      manglik: existingProfile?.horoscope?.manglik || 'No',
      birth_date: existingProfile?.horoscope?.birth_date || '',
      birth_time: existingProfile?.horoscope?.birth_time || '10:30 AM',
      birth_place: existingProfile?.horoscope?.birth_place || 'Solapur',
    },

    partner_preferences: {
      min_age: existingProfile?.partner_preferences?.min_age || 22,
      max_age: existingProfile?.partner_preferences?.max_age || 30,
      religion: existingProfile?.partner_preferences?.religion || 'Hindu',
      manglik_preference: existingProfile?.partner_preferences?.manglik_preference || 'Non-Manglik',
      education: existingProfile?.partner_preferences?.education || 'Graduate',
      income: existingProfile?.partner_preferences?.income || '5 Lakh+',
    },
  });

  const handleSave = async (isFinal = false) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('matrimonyToken');
      const res = await fetch(`${API_URL}/api/matrimony/profile/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        if (isFinal) {
          alert('Profile setup complete! Submitted for review.');
        }
        onSaveSuccess && onSaveSuccess(data);
      }
    } catch (err) {
      console.error('Save failed', err);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: 'Personal Details', icon: User },
    { num: 2, label: 'Education & Career', icon: Briefcase },
    { num: 3, label: 'Family & Lifestyle', icon: Users },
    { num: 4, label: 'Kundli & Horoscope', icon: Moon },
    { num: 5, label: 'Partner Preferences', icon: Heart },
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white/5 border border-amber-500/20 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
      {/* Wizard Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-amber-300">Complete Matrimony Profile</h2>
          <p className="text-xs text-white/50">Step {step} of 5 — {steps[step - 1].label}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold font-serif text-amber-400">{userState?.completeness || 0}%</div>
          <div className="text-[10px] text-white/40 uppercase tracking-wider">Completeness</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all duration-500"
          style={{ width: `${(step / 5) * 100}%` }}
        />
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-5 gap-1">
        {steps.map((s) => {
          const Icon = s.icon;
          const active = s.num === step;
          const done = s.num < step;
          return (
            <button
              key={s.num}
              onClick={() => setStep(s.num)}
              className={`p-2 rounded-xl text-center flex flex-col items-center transition-all ${active ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : done ? 'text-emerald-400' : 'text-white/30'}`}
            >
              <Icon size={16} />
              <span className="text-[9px] mt-1 hidden md:block font-bold">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* STEP 1: Personal Details */}
      {step === 1 && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 mb-1">Creating Profile For</label>
              <select
                value={form.profile_for}
                onChange={(e) => setForm({ ...form, profile_for: e.target.value })}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white"
              >
                <option value="self">Self</option>
                <option value="son">Son</option>
                <option value="daughter">Daughter</option>
                <option value="brother">Brother</option>
                <option value="sister">Sister</option>
                <option value="relative">Relative</option>
              </select>
            </div>

            <div>
              <label className="block text-white/60 mb-1">Full Name</label>
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="Candidate Full Name"
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-white/60 mb-1">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white"
              >
                <option value="male">Groom (Male)</option>
                <option value="female">Bride (Female)</option>
              </select>
            </div>

            <div>
              <label className="block text-white/60 mb-1">Date of Birth</label>
              <input
                type="date"
                value={form.date_of_birth}
                onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-white/60 mb-1">Religion & Caste</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={form.religion}
                  onChange={(e) => setForm({ ...form, religion: e.target.value })}
                  placeholder="Religion"
                  className="px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white"
                />
                <input
                  type="text"
                  value={form.caste}
                  onChange={(e) => setForm({ ...form, caste: e.target.value })}
                  placeholder="Caste"
                  className="px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/60 mb-1">City & State</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="City"
                  className="px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white"
                />
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  placeholder="State"
                  className="px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/60 mb-1">WhatsApp Phone Number</label>
              <input
                type="text"
                value={form.whatsapp_phone}
                onChange={(e) => setForm({ ...form, whatsapp_phone: e.target.value })}
                placeholder="10-digit mobile"
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/60 mb-1">About Myself / Candidate</label>
            <textarea
              rows={3}
              value={form.about_me}
              onChange={(e) => setForm({ ...form, about_me: e.target.value })}
              placeholder="Brief description of personality, values, and expectations..."
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white"
            />
          </div>
        </div>
      )}

      {/* STEP 2: Education & Career */}
      {step === 2 && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 mb-1">Highest Education</label>
              <input
                type="text"
                value={form.education.highest_education}
                onChange={(e) => setForm({ ...form, education: { ...form.education, highest_education: e.target.value } })}
                placeholder="e.g. B.Tech, MBA, MBBS, M.Com"
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-white/60 mb-1">Employed In</label>
              <select
                value={form.education.employed_in}
                onChange={(e) => setForm({ ...form, education: { ...form.education, employed_in: e.target.value } })}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white"
              >
                <option value="Private Sector">Private Sector</option>
                <option value="Government Sector">Government Sector</option>
                <option value="Business / Entrepreneur">Business / Entrepreneur</option>
                <option value="Not Working">Not Working</option>
              </select>
            </div>

            <div>
              <label className="block text-white/60 mb-1">Occupation / Designation</label>
              <input
                type="text"
                value={form.education.occupation}
                onChange={(e) => setForm({ ...form, education: { ...form.education, occupation: e.target.value } })}
                placeholder="e.g. Senior Developer, Bank Manager"
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-white/60 mb-1">Annual Income</label>
              <input
                type="text"
                value={form.education.annual_income}
                onChange={(e) => setForm({ ...form, education: { ...form.education, annual_income: e.target.value } })}
                placeholder="e.g. 8-12 Lakhs / Year"
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Family & Lifestyle */}
      {step === 3 && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 mb-1">Father's Name & Occupation</label>
              <input
                type="text"
                value={form.family.father_name}
                onChange={(e) => setForm({ ...form, family: { ...form.family, father_name: e.target.value } })}
                placeholder="Father Full Name"
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-white/60 mb-1">Mother's Name & Occupation</label>
              <input
                type="text"
                value={form.family.mother_name}
                onChange={(e) => setForm({ ...form, family: { ...form.family, mother_name: e.target.value } })}
                placeholder="Mother Full Name"
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-white/60 mb-1">Diet Preference</label>
              <select
                value={form.lifestyle.diet}
                onChange={(e) => setForm({ ...form, lifestyle: { ...form.lifestyle, diet: e.target.value } })}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white"
              >
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Eggetarian">Eggetarian</option>
                <option value="Jain">Jain</option>
              </select>
            </div>

            <div>
              <label className="block text-white/60 mb-1">Mother Tongue</label>
              <input
                type="text"
                value={form.lifestyle.mother_tongue}
                onChange={(e) => setForm({ ...form, lifestyle: { ...form.lifestyle, mother_tongue: e.target.value } })}
                placeholder="e.g. Marathi, Hindi, Kannada"
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Horoscope & Kundli */}
      {step === 4 && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 mb-1">Rashi (Moon Sign)</label>
              <select
                value={form.horoscope.rashi}
                onChange={(e) => setForm({ ...form, horoscope: { ...form.horoscope, rashi: e.target.value } })}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white"
              >
                {RASHI_LIST.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/60 mb-1">Nakshatra (Birth Star)</label>
              <select
                value={form.horoscope.nakshatra}
                onChange={(e) => setForm({ ...form, horoscope: { ...form.horoscope, nakshatra: e.target.value } })}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white"
              >
                {NAKSHATRA_LIST.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/60 mb-1">Gotra</label>
              <input
                type="text"
                value={form.horoscope.gotra}
                onChange={(e) => setForm({ ...form, horoscope: { ...form.horoscope, gotra: e.target.value } })}
                placeholder="Family Gotra"
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-white/60 mb-1">Nadi (Adi/Madhya/Antya)</label>
              <select
                value={form.horoscope.nadi}
                onChange={(e) => setForm({ ...form, horoscope: { ...form.horoscope, nadi: e.target.value } })}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white"
              >
                {NADI_LIST.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/60 mb-1">Manglik Status</label>
              <select
                value={form.horoscope.manglik}
                onChange={(e) => setForm({ ...form, horoscope: { ...form.horoscope, manglik: e.target.value } })}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white"
              >
                <option value="No">No</option>
                <option value="Yes">Yes (Manglik)</option>
                <option value="Partial">Partial / Anshik</option>
                <option value="Don't Know">Don't Know</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: Partner Preferences */}
      {step === 5 && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 mb-1">Age Range Preference</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={form.partner_preferences.min_age}
                  onChange={(e) => setForm({ ...form, partner_preferences: { ...form.partner_preferences, min_age: Number(e.target.value) } })}
                  placeholder="Min Age"
                  className="px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white"
                />
                <input
                  type="number"
                  value={form.partner_preferences.max_age}
                  onChange={(e) => setForm({ ...form, partner_preferences: { ...form.partner_preferences, max_age: Number(e.target.value) } })}
                  placeholder="Max Age"
                  className="px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/60 mb-1">Manglik Preference</label>
              <select
                value={form.partner_preferences.manglik_preference}
                onChange={(e) => setForm({ ...form, partner_preferences: { ...form.partner_preferences, manglik_preference: e.target.value } })}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white"
              >
                <option value="Non-Manglik">Non-Manglik Only</option>
                <option value="Manglik OK">Manglik OK</option>
                <option value="Any">Doesn't Matter</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Wizard Footer Controls */}
      <div className="flex justify-between items-center pt-4 border-t border-white/10">
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-xs font-bold flex items-center gap-1"
          >
            <ChevronLeft size={16} /> Previous Step
          </button>
        ) : <div />}

        {step < 5 ? (
          <button
            onClick={async () => {
              await handleSave(false);
              setStep(step + 1);
            }}
            disabled={loading}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs flex items-center gap-1"
          >
            Save & Continue <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={() => handleSave(true)}
            disabled={loading}
            className="px-8 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-black font-bold rounded-xl text-xs flex items-center gap-1 shadow-lg"
          >
            <CheckCircle2 size={16} /> Complete & Submit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileWizard;
