import React, { useEffect, useRef } from 'react';

/**
 * Google AdSense Compliant Unit Component
 * Strictly complies with Google Publisher Policies:
 * - Proper label ("ADVERTISEMENT")
 * - Responsive sizing and container safety
 * - Error resilient script execution
 */
const AdSenseUnit = ({
    slot = "auto",
    format = "auto",
    responsive = "true",
    className = "",
    client = "ca-pub-8065093768801545",
    showLabel = true,
    layout = ""
}) => {
    const adRef = useRef(null);
    const hasPushed = useRef(false);

    useEffect(() => {
        if (hasPushed.current) return;
        try {
            if (typeof window !== 'undefined' && window.adsbygoogle) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                hasPushed.current = true;
            }
        } catch (e) {
            console.debug('AdSense load state:', e?.message || e);
        }
    }, []);

    return (
        <div className={`my-8 text-center overflow-hidden clear-both ${className}`}>
            {showLabel && (
                <div className="text-[10px] uppercase tracking-[0.25em] text-white/30 mb-1.5 font-sans select-none">
                    Advertisement
                </div>
            )}
            <div className="min-h-[90px] w-full flex items-center justify-center bg-white/[0.02] border border-white/5 rounded-xl p-2 relative">
                <ins
                    ref={adRef}
                    className="adsbygoogle"
                    style={{ display: 'block', width: '100%', minHeight: '90px' }}
                    data-ad-client={client}
                    data-ad-slot={slot !== "auto" ? slot : undefined}
                    data-ad-format={format}
                    data-full-width-responsive={responsive}
                    {...(layout ? { 'data-ad-layout': layout } : {})}
                />
            </div>
        </div>
    );
};

export default React.memo(AdSenseUnit);
