import React, { useState } from 'react';
import { Sliders, Shield, Lock, Eye, Save } from 'lucide-react';

const SettingsVisibilitySection = () => {
  const [settings, setSettings] = useState({
    dailyInterestLimitBasic: 5,
    maxPhotosPerProfile: 10,
    verificationSlaDays: 2,
    autoCrmLeadAfterDays: 30,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-[#1C1917]">
      <div className="bg-white border border-[#EADCC8] p-5 rounded-3xl shadow-luxury">
        <h3 className="text-lg font-serif font-bold text-[#1C1917]">Matrimony System Rules & Configuration</h3>
        <p className="text-xs text-[#78716C]">Configure global rate limits and privacy controls</p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-[#EADCC8] rounded-3xl p-6 sm:p-8 space-y-5 text-xs shadow-luxury">
        <div>
          <label className="block font-bold text-[#1C1917] mb-1">
            Basic Member Daily Interest Limit
          </label>
          <p className="text-[#78716C] text-[11px] mb-2">
            Maximum number of interest requests a basic paid member can send per calendar day.
          </p>
          <input
            type="number"
            min="1"
            max="50"
            value={settings.dailyInterestLimitBasic}
            onChange={e => setSettings({ ...settings, dailyInterestLimitBasic: Number(e.target.value) })}
            className="w-full bg-[#FAF8F5] border border-[#EADCC8] rounded-xl p-3 text-[#1C1917] focus:outline-none focus:border-[#C2410C]"
          />
        </div>

        <div>
          <label className="block font-bold text-[#1C1917] mb-1">
            Maximum Photos Per Profile
          </label>
          <p className="text-[#78716C] text-[11px] mb-2">
            Limit on the number of photos a member can upload to their profile gallery.
          </p>
          <input
            type="number"
            min="1"
            max="20"
            value={settings.maxPhotosPerProfile}
            onChange={e => setSettings({ ...settings, maxPhotosPerProfile: Number(e.target.value) })}
            className="w-full bg-[#FAF8F5] border border-[#EADCC8] rounded-xl p-3 text-[#1C1917] focus:outline-none focus:border-[#C2410C]"
          />
        </div>

        <div>
          <label className="block font-bold text-[#1C1917] mb-1">
            Verification SLA Alert (Days)
          </label>
          <p className="text-[#78716C] text-[11px] mb-2">
            Flag profiles in queue if pending verification exceeds this number of days.
          </p>
          <input
            type="number"
            min="1"
            max="14"
            value={settings.verificationSlaDays}
            onChange={e => setSettings({ ...settings, verificationSlaDays: Number(e.target.value) })}
            className="w-full bg-[#FAF8F5] border border-[#EADCC8] rounded-xl p-3 text-[#1C1917] focus:outline-none focus:border-[#C2410C]"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white font-bold text-xs rounded-xl shadow-sm hover:scale-[1.01] transition-transform flex items-center justify-center gap-1.5 uppercase tracking-wider"
        >
          <Save size={14} />
          <span>{saved ? 'Settings Saved Successfully!' : 'Save System Rules'}</span>
        </button>
      </form>
    </div>
  );
};

export default React.memo(SettingsVisibilitySection);
