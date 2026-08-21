import React from 'react';

/**
 * 2D Sacred Vedic Mandala Watermark (pure SVG, 0ms lag)
 */
export const MandalaWatermark = ({ className = "w-96 h-96 opacity-[0.04]", spin = true }) => (
  <svg
    viewBox="0 0 200 200"
    className={`${className} ${spin ? 'animate-[spin_120s_linear_infinite]' : ''}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="100" cy="100" r="92" stroke="#C2410C" strokeWidth="0.75" strokeDasharray="2 3" />
    <circle cx="100" cy="100" r="76" stroke="#D97706" strokeWidth="0.75" />
    <circle cx="100" cy="100" r="60" stroke="#C2410C" strokeWidth="0.5" strokeDasharray="4 2" />
    <circle cx="100" cy="100" r="42" stroke="#D97706" strokeWidth="0.75" />
    <circle cx="100" cy="100" r="24" stroke="#C2410C" strokeWidth="0.5" />
    <circle cx="100" cy="100" r="8" fill="#C2410C" fillOpacity="0.2" />

    {/* 8-Pointed Star Petals */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
      <g key={deg} transform={`rotate(${deg} 100 100)`}>
        <path d="M100 8 Q106 35 100 58 Q94 35 100 8Z" fill="#C2410C" fillOpacity="0.12" stroke="#C2410C" strokeWidth="0.5" />
        <path d="M100 24 Q104 45 100 62 Q96 45 100 24Z" fill="#D97706" fillOpacity="0.15" stroke="#D97706" strokeWidth="0.4" />
        <circle cx="100" cy="16" r="2.5" fill="#D97706" />
        <circle cx="100" cy="70" r="1.5" fill="#C2410C" />
      </g>
    ))}

    {/* 16 Auxiliary Radiations */}
    {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg) => (
      <g key={deg} transform={`rotate(${deg} 100 100)`}>
        <path d="M100 40 Q103 60 100 76 Q97 60 100 40Z" fill="#D97706" fillOpacity="0.1" stroke="#D97706" strokeWidth="0.3" />
        <circle cx="100" cy="36" r="1.5" fill="#C2410C" />
      </g>
    ))}
  </svg>
);

/**
 * Sacred Surya Sunburst Crest
 */
export const SunburstCrest = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="22" fill="#FFF7ED" stroke="#C2410C" strokeWidth="1.5" />
    <circle cx="50" cy="50" r="14" fill="#D97706" fillOpacity="0.2" stroke="#D97706" strokeWidth="1" />
    <circle cx="50" cy="50" r="6" fill="#C2410C" />
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
      <g key={deg} transform={`rotate(${deg} 50 50)`}>
        <path
          d={i % 2 === 0 ? "M50 8 L52 24 L48 24 Z" : "M50 14 L51.5 24 L48.5 24 Z"}
          fill={i % 2 === 0 ? "#C2410C" : "#D97706"}
        />
      </g>
    ))}
  </svg>
);

/**
 * Sacred Lotus Crest
 */
export const LotusCrest = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 6 C25.5 16 31 24 35 32 C31 34 26 35 24 35 C22 35 17 34 13 32 C17 24 22.5 16 24 6 Z" fill="#C2410C" fillOpacity="0.85" />
    <path d="M24 16 C27 22 35 27 42 30 C36 34 29 36 24 36 C19 36 12 34 6 30 C13 27 21 22 24 16 Z" fill="#EA580C" fillOpacity="0.65" />
    <path d="M24 24 C28 28 36 31 44 33 C39 37 32 39 24 39 C16 39 9 37 4 33 C12 31 20 28 24 24 Z" fill="#D97706" fillOpacity="0.5" />
    <circle cx="24" cy="38" r="2" fill="#C2410C" />
    <circle cx="24" cy="10" r="1.5" fill="#D97706" />
  </svg>
);

/**
 * Auspicious Toran Garland Border
 */
export const ToranBorder = ({ className = "w-full h-4" }) => (
  <svg viewBox="0 0 400 16" className={className} preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 2 Q25 14 50 2 Q75 14 100 2 Q125 14 150 2 Q175 14 200 2 Q225 14 250 2 Q275 14 300 2 Q325 14 350 2 Q375 14 400 2" stroke="#EADCC8" strokeWidth="1.2" />
    <path d="M0 5 Q25 15 50 5 Q75 15 100 5 Q125 15 150 5 Q175 15 200 5 Q225 15 250 5 Q275 15 300 5 Q325 15 350 5 Q375 15 400 5" stroke="#C2410C" strokeOpacity="0.4" strokeWidth="0.8" strokeDasharray="3 3" />
    {[25, 75, 125, 175, 225, 275, 325, 375].map((cx) => (
      <circle key={cx} cx={cx} cy="10" r="2" fill="#D97706" />
    ))}
  </svg>
);

/**
 * Full page ambient light background
 */
export const VedicAmbientBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#FAF8F5]">
    {/* Soft Warm Radial Highlights */}
    <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#FFF7ED] via-[#FEF3C7]/40 to-transparent blur-3xl opacity-70" />
    <div className="absolute top-1/3 -left-40 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-[#FFF7ED] via-[#FED7AA]/30 to-transparent blur-3xl opacity-60" />
    <div className="absolute -bottom-40 right-1/4 w-[650px] h-[650px] rounded-full bg-gradient-to-tl from-[#FEF3C7] via-[#FFF7ED]/40 to-transparent blur-3xl opacity-65" />

    {/* Subtle Watermark Mandalas */}
    <div className="absolute top-20 right-[-100px] opacity-[0.035]">
      <MandalaWatermark className="w-[500px] h-[500px]" spin={true} />
    </div>
    <div className="absolute bottom-20 left-[-120px] opacity-[0.03]">
      <MandalaWatermark className="w-[600px] h-[600px]" spin={false} />
    </div>
  </div>
);
