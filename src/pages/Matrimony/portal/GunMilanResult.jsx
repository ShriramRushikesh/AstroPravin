import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Sparkles, CheckCircle2, AlertTriangle, X, ShieldAlert } from 'lucide-react';
import { matrimonyApi } from '../../../services/matrimonyApi';

const GunMilanResult = ({ targetProfileId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGunMilan = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await matrimonyApi.calculateGunMilan(targetProfileId);
        setData(res);
      } catch (err) {
        setError(err.message || 'Failed to calculate Gun Milan compatibility.');
      } finally {
        setLoading(false);
      }
    };

    if (targetProfileId) fetchGunMilan();
  }, [targetProfileId]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-neutral-900 border border-amber-500/40 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative my-8"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black text-white/70 hover:text-white rounded-full border border-white/10 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30 mb-2">
            <Compass size={28} />
          </div>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-white">
            Ashta Koota 36-Guna Milan Match
          </h2>
          <p className="text-xs text-white/50 mt-1">Vedic Astrological Compatibility Calculation</p>
        </div>

        {loading && (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-amber-400/80 uppercase font-mono tracking-widest">
              Calculating 36 Guna Compatibility...
            </span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs space-y-2 text-center">
            <AlertTriangle size={24} className="mx-auto text-rose-400" />
            <p>{error}</p>
          </div>
        )}

        {data && data.result && (
          <div className="space-y-6">
            {/* Header comparison pill */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 text-xs">
              <div>
                <span className="text-white/40 block">Your Profile:</span>
                <span className="font-serif font-bold text-white">{data.profileA.name}</span>
                <span className="text-amber-400 block text-[11px]">({data.profileA.rashi} / {data.profileA.nakshatra})</span>
              </div>
              <div className="text-center font-bold text-amber-400 text-sm">VS</div>
              <div className="text-right">
                <span className="text-white/40 block">Target Match:</span>
                <span className="font-serif font-bold text-white">{data.profileB.name}</span>
                <span className="text-amber-400 block text-[11px]">({data.profileB.rashi} / {data.profileB.nakshatra})</span>
              </div>
            </div>

            {/* Total Score Meter */}
            <div className="text-center p-6 bg-gradient-to-br from-amber-500/20 via-black to-black border border-amber-500/40 rounded-3xl space-y-2">
              <span className="text-xs text-white/50 uppercase tracking-widest font-mono">Compatibility Score</span>
              <div className="text-5xl font-serif font-bold text-amber-300">
                {data.result.totalScore} <span className="text-xl text-white/40 font-sans">/ 36</span>
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                {data.result.compatibility.toUpperCase()} MATCH
              </div>
              <p className="text-xs text-white/70 max-w-md mx-auto pt-2 italic">
                "{data.result.verdict}"
              </p>
            </div>

            {/* Ashta Koota 8 Points Breakdown Table */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden text-xs">
              <div className="grid grid-cols-3 bg-white/5 p-2.5 font-bold text-white/50 uppercase tracking-wider text-[10px]">
                <span>Koota Parameter</span>
                <span className="text-center">Max Points</span>
                <span className="text-right">Obtained</span>
              </div>
              {[
                { name: '1. Varna (Work & Ego)', max: 1, score: data.result.breakdown?.varna },
                { name: '2. Vashya (Dominance / Mutual Love)', max: 2, score: data.result.breakdown?.vashya },
                { name: '3. Tara (Destiny / Health)', max: 3, score: data.result.breakdown?.tara },
                { name: '4. Yoni (Physical Compatibility)', max: 4, score: data.result.breakdown?.yoni },
                { name: '5. Graha Maitri (Mental Harmony)', max: 5, score: data.result.breakdown?.grahaMaitri },
                { name: '6. Gana (Temperament & Nature)', max: 6, score: data.result.breakdown?.gana },
                { name: '7. Bhakoot (Family Welfare & Love)', max: 7, score: data.result.breakdown?.bhakoot },
                { name: '8. Nadi (Physiology & Genes)', max: 8, score: data.result.breakdown?.nadi },
              ].map(k => (
                <div key={k.name} className="grid grid-cols-3 p-2.5 border-t border-white/5 items-center">
                  <span className="text-white/80">{k.name}</span>
                  <span className="text-center text-white/40 font-mono">{k.max}</span>
                  <span className="text-right font-mono font-bold text-amber-400">{k.score ?? 0}</span>
                </div>
              ))}
            </div>

            {/* Dosha & Remedies */}
            {data.result.dosha && data.result.dosha.length > 0 && (
              <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center gap-2 text-orange-400 font-bold">
                  <ShieldAlert size={16} />
                  <span>Detected Doshas: {data.result.dosha.join(', ')}</span>
                </div>
                {data.result.remedies && (
                  <ul className="list-disc list-inside text-white/70 space-y-1 text-[11px] pt-1">
                    {data.result.remedies.map((rem, i) => (
                      <li key={i}>{rem}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default React.memo(GunMilanResult);
