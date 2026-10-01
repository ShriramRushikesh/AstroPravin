import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Sparkles, CheckCircle2, AlertTriangle, X, ShieldAlert } from 'lucide-react';
import { matrimonyApi } from '../../../services/matrimonyApi';
import { LotusCrest, ToranBorder } from '../components/MatrimonyDecorativeArt';

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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-2xl bg-white border border-[#EADCC8] rounded-3xl p-6 md:p-8 shadow-2xl relative my-8 text-[#1C1917]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-[#FAF8F5] hover:bg-[#F5EFE6] text-[#574F47] hover:text-[#1C1917] rounded-full border border-[#EADCC8] transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-[#FFFBEB] text-[#C2410C] rounded-2xl border border-[#FDE68A] mb-2 shadow-sm">
            <Compass size={28} />
          </div>
          <ToranBorder className="mb-3" />
          <h2 className="text-xl md:text-2xl font-serif font-bold text-[#1C1917]">
            Ashta Koota 36-Guna Milan Match
          </h2>
          <p className="text-xs text-[#78716C] mt-1">Vedic Astrological Compatibility Calculation</p>
        </div>

        {loading && (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-[#C2410C] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-[#C2410C] uppercase font-mono font-bold tracking-widest">
              Calculating 36 Guna Compatibility...
            </span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-2xl text-[#B91C1C] text-xs space-y-2 text-center">
            <AlertTriangle size={24} className="mx-auto" />
            <p>{error}</p>
          </div>
        )}

        {data && data.result && (
          <div className="space-y-6">
            {/* Header comparison pill */}
            <div className="flex items-center justify-between p-4 bg-[#FAF8F5] rounded-2xl border border-[#EADCC8] text-xs shadow-inner">
              <div>
                <span className="text-[#78716C] block text-[11px]">Your Profile:</span>
                <span className="font-serif font-bold text-[#1C1917]">{data.profileA.name}</span>
                <span className="text-[#C2410C] block text-[11px] font-semibold">({data.profileA.rashi} / {data.profileA.nakshatra})</span>
              </div>
              <div className="text-center font-bold text-[#D97706] text-sm px-3 py-1 bg-[#FEF3C7] rounded-lg border border-[#FDE68A]">
                VS
              </div>
              <div className="text-right">
                <span className="text-[#78716C] block text-[11px]">Target Match:</span>
                <span className="font-serif font-bold text-[#1C1917]">{data.profileB.name}</span>
                <span className="text-[#C2410C] block text-[11px] font-semibold">({data.profileB.rashi} / {data.profileB.nakshatra})</span>
              </div>
            </div>

            {/* Total Score Meter */}
            <div className="text-center p-6 bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7]/40 to-[#FFF7ED] border border-[#FCD34D] rounded-3xl space-y-2 shadow-sm">
              <span className="text-xs text-[#B45309] uppercase tracking-widest font-mono font-bold">Total Compatibility Score</span>
              <div className="text-5xl font-serif font-extrabold text-[#C2410C]">
                {data.result.totalScore} <span className="text-xl text-[#78716C] font-sans font-normal">/ 36</span>
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#15803D] bg-[#DCFCE7] px-3 py-1 rounded-full w-fit mx-auto">
                {data.result.compatibility.toUpperCase()} MATCH
              </div>
              <p className="text-xs text-[#574F47] max-w-md mx-auto pt-2 italic leading-relaxed">
                "{data.result.verdict}"
              </p>
            </div>

            {/* Ashta Koota 8 Points Breakdown Table */}
            <div className="bg-[#FAF8F5] border border-[#EADCC8] rounded-2xl overflow-hidden text-xs shadow-sm">
              <div className="grid grid-cols-3 bg-[#F5EFE6] p-2.5 font-bold text-[#78716C] uppercase tracking-wider text-[10px]">
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
                <div key={k.name} className="grid grid-cols-3 p-2.5 border-t border-[#EADCC8] items-center">
                  <span className="text-[#1C1917] font-medium">{k.name}</span>
                  <span className="text-center text-[#78716C] font-mono">{k.max}</span>
                  <span className="text-right font-mono font-bold text-[#C2410C]">{k.score ?? 0}</span>
                </div>
              ))}
            </div>

            {/* Dosha & Remedies */}
            {data.result.dosha && data.result.dosha.length > 0 && (
              <div className="p-4 bg-[#FFF7ED] border border-[#FFEDD5] rounded-2xl space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#C2410C] font-bold">
                  <ShieldAlert size={16} />
                  <span>Detected Doshas: {data.result.dosha.join(', ')}</span>
                </div>
                {data.result.remedies && (
                  <ul className="list-disc list-inside text-[#574F47] space-y-1 text-[11px] pt-1">
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
