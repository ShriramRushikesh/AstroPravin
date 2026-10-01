import React from 'react';

/**
 * Lightweight 2D Indian Art Decorative Vectors & Motifs
 * Pure SVG vectors with high-performance CSS hardware acceleration.
 * Clean, minimal, non-distracting luxury Indian wedding aesthetic.
 */

// ── Subtle Background Watermark Mandala ─────────────────────────────────────
export const MandalaWatermark = ({ className = '', size = 500, opacity = 0.04 }) => (
  <svg
    viewBox="0 0 200 200"
    width={size}
    height={size}
    className={`pointer-events-none select-none text-[#C2410C] ${className}`}
    style={{ opacity }}
    fill="currentColor"
  >
    <path d="M100 10 C105 45 145 45 150 10 C155 45 195 45 190 60 C165 75 165 115 190 140 C155 155 155 195 140 190 C125 165 85 165 60 190 C45 155 45 155 10 140 C35 115 35 75 10 60 C45 45 45 45 60 10 C75 35 115 35 100 10 Z" fill="none" stroke="currentColor" strokeWidth="0.75" />
    <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
    <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.75" />
    <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
    <circle cx="100" cy="100" r="20" fill="none" stroke="currentColor" strokeWidth="0.75" />
    {/* 8 Radial Lotus Petals */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <g key={i} transform={`rotate(${angle} 100 100)`}>
        <path d="M100 20 C92 40 92 60 100 70 C108 60 108 40 100 20 Z" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="100" cy="20" r="2" fill="currentColor" />
        <path d="M100 60 Q95 50 100 40 Q105 50 100 60" fill="currentColor" opacity="0.3" />
      </g>
    ))}
  </svg>
);

// ── Elegant Paisley / Kalka Accent Flourish ──────────────────────────────────
export const PaisleyFlourish = ({ className = '', size = 32 }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={`inline-block text-[#C2410C] ${className}`}
    fill="currentColor"
  >
    <path
      d="M24 4 C14 4 6 12 6 22 C6 31 13 38 22 41 C21 37 20 33 22 29 C24 25 28 23 30 20 C32 17 31 13 28 10 C26 8 23 7 24 4 Z"
      fill="currentColor"
      opacity="0.85"
    />
    <circle cx="16" cy="22" r="3" fill="#D97706" />
    <circle cx="22" cy="16" r="2" fill="#D97706" />
    <path d="M10 24 C10 32 17 38 24 40" stroke="#D97706" strokeWidth="1.2" fill="none" />
  </svg>
);

// ── Golden Lotus Crest ───────────────────────────────────────────────────────
export const LotusCrest = ({ className = '', size = 36 }) => (
  <svg
    viewBox="0 0 64 48"
    width={size}
    height={size}
    className={`inline-block text-[#B45309] ${className}`}
    fill="currentColor"
  >
    {/* Center petal */}
    <path d="M32 4 C27 16 27 30 32 40 C37 30 37 16 32 4 Z" fill="currentColor" />
    {/* Left Petals */}
    <path d="M32 40 C22 36 12 26 14 14 C20 22 26 32 32 40 Z" fill="currentColor" opacity="0.75" />
    <path d="M32 40 C14 38 4 30 6 22 C14 26 22 34 32 40 Z" fill="currentColor" opacity="0.5" />
    {/* Right Petals */}
    <path d="M32 40 C42 36 52 26 50 14 C44 22 38 32 32 40 Z" fill="currentColor" opacity="0.75" />
    <path d="M32 40 C50 38 60 30 58 22 C50 26 42 34 32 40 Z" fill="currentColor" opacity="0.5" />
    {/* Base stem flourish */}
    <path d="M20 44 Q32 40 44 44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

// ── Auspicious Toran Border Band (Top Divider) ──────────────────────────────
export const ToranBorder = ({ className = '' }) => (
  <div className={`w-full flex items-center justify-center gap-2 overflow-hidden select-none py-1 opacity-70 ${className}`}>
    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D97706]/40 to-[#C2410C]/60" />
    <div className="flex items-center gap-1.5 text-[#C2410C] shrink-0">
      <span className="w-1.5 h-1.5 rotate-45 bg-[#D97706] rounded-[1px]" />
      <span className="w-2 h-2 rotate-45 bg-[#C2410C] rounded-[1px]" />
      <span className="w-1.5 h-1.5 rotate-45 bg-[#D97706] rounded-[1px]" />
    </div>
    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#D97706]/40 to-[#C2410C]/60" />
  </div>
);

// ── Subtle 2D Ambient Floating Aesthetic Background ─────────────────────────
export const MatrimonyAmbientBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#FAF8F5]">
    {/* Soft Warm Saffron and Porcelain Ambient Light Gradients */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-[#FEF3C7]/40 via-[#FDF2E9]/25 to-transparent blur-3xl" />
    <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-[#FDE68A]/20 rounded-full blur-3xl" />
    <div className="absolute top-1/3 -right-32 w-[600px] h-[600px] bg-[#FFEDD5]/30 rounded-full blur-3xl" />
    <div className="absolute -bottom-32 left-1/4 w-[700px] h-[500px] bg-[#FEF3C7]/20 rounded-full blur-3xl" />

    {/* Subtle Watermark Mandalas placed strategically */}
    <div className="absolute top-12 left-6 opacity-30">
      <MandalaWatermark size={420} opacity={0.035} />
    </div>
    <div className="absolute bottom-16 right-8 opacity-30">
      <MandalaWatermark size={500} opacity={0.03} />
    </div>

    {/* Fine Linen Texture Pattern (SVG) */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.02] mix-blend-multiply" xmlns="http://www.w3.org/2000/svg">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);
