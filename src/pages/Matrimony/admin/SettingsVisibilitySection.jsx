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
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
        <h3 className="text-lg font-serif font-bold text-white">Matrimony System Rules & Configuration</h3>
        <p className="text-xs text-white/50">Configure global rate limits and privacy controls</p>
      </div>

      <form onSubmit={handleSave} className="bg-neutral-900/80 border border-white/10 rounded-3xl p-6 space-y-5 text-xs backdrop-blur-xl">
        <div>
          <label className="block font-bold text-white mb-1">
            Basic Member Daily Interest Limit
          </label>
          <p className="text-white/40 text-[11px] mb-2">
            Maximum number of interest requests a basic paid member can send per calendar day.
          </p>
          <input
            type="number"
            min="1"
            max="50"
            value={settings.dailyInterestLimitBasic}
            onChange={e => setSettings({ ...settings, dailyInterestLimitBasic: Number(e.target.value) })}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white"
          />
        </div>

        <div>
          <label className="block font-bold text-white mb-1">
            Maximum Photos Per Profile
          </label>
          <p className="text-white/40 text-[11px] mb-2">
            Limit on the number of photos a member can upload to their profile gallery.
          </p>
          <input
            type="number"
            min="1"
            max="20"
            value={settings.maxPhotosPerProfile}
            onChange={e => setSettings({ ...settings, maxPhotosPerProfile: Number(e.target.value) })}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white"
          />
        </div>

        <div>
          <label className="block font-bold text-white mb-1">
            Verification SLA Alert (Days)
          </label>
          <p className="text-white/40 text-[11px] mb-2">
            Flag profiles in queue if pending verification exceeds this number of days.
          </p>
          <input
            type="number"
            min="1"
            max="14"
            value={settings.verificationSlaDays}
            onChange={e => setSettings({ ...settings, verificationSlaDays: Number(e.target.value) })}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold text-xs rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider"
        >
          <Save size={14} />
          <span>{saved ? 'Settings Saved Successfully!' : 'Save System Rules'}</span>
        </button>
      </form>
    </div>
  );
};

export default React.memo(SettingsVisibilitySection);
