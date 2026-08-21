import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, CheckCircle2, QrCode, Copy, Check, ExternalLink,
  PhoneCall, ArrowRight, Sparkles, Lock, Clock, HeartHandshake, AlertCircle, RefreshCw, MessageSquare
} from 'lucide-react';
import { LotusCrest, ToranBorder, MandalaWatermark } from './MatrimonyDecorativeArt';

const MembershipPaymentGate = ({ user, registrationConfig, onPaymentCompleted, onLogout }) => {
  const [transactionId, setTransactionId] = useState('');
  const [paymentMode, setPaymentMode] = useState('upi');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditingUtr, setIsEditingUtr] = useState(false);

  // Dynamic admin-configurable values with defaults
  const upiId = registrationConfig?.upiId || 'rishi.shriram5@ybl';
  const payeeName = registrationConfig?.payeeName || 'RUSHIKESH PRAVIN SHRIRAM';
  const amount = registrationConfig?.membershipFee || 199;
  const originalAmount = registrationConfig?.originalFee || 499;
  const packageDuration = registrationConfig?.durationText || '3 Months Vedic Membership';

  // Native standard UPI Intent Deep Link for default payment app redirection
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`AstroPravin Matrimony 3M ${user?.username || ''}`)}`;

  // Dedicated Official PhonePe QR Asset with online generator fallback
  const officialQrPath = '/phonepe-qr.jpg';
  const fallbackQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(upiDeepLink)}&color=000000&bgcolor=FFFFFF`;

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isPendingVerification = (user?.status === 'pending_payment_verification' || user?.paymentStatus === 'pending_verification') && !isEditingUtr;

  const handlePaymentSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');

    const cleanUtr = transactionId.trim().toUpperCase();
    if (!cleanUtr) {
      setError('Please enter your 12-digit UPI Transaction Ref / UTR Number.');
      return;
    }

    // Strict validation: UTR is 10 to 22 alphanumeric characters
    const utrRegex = /^[A-Z0-9]{10,22}$/;
    if (!utrRegex.test(cleanUtr)) {
      setError('Invalid UTR format. Bank / UPI UTR reference must be 12 digits or a valid transaction reference (10-22 alphanumeric characters).');
      return;
    }

    // Check for obvious bogus repeated patterns
    const repeatedPattern = /^(.)\1{9,}$/;
    if (repeatedPattern.test(cleanUtr) || cleanUtr === '123456789012' || cleanUtr === '1234567890' || cleanUtr.toLowerCase().includes('test')) {
      setError('Invalid transaction reference. Please provide the authentic 12-digit UTR from your PhonePe, GPay, Paytm, or Bank app.');
      return;
    }

    setLoading(true);
    try {
      await onPaymentCompleted({
        transactionId: cleanUtr,
        paymentMode,
        amount,
      });
      setIsEditingUtr(false);
    } catch (err) {
      setError(err.message || 'Payment submission failed. Please check the details or contact support.');
    } finally {
      setLoading(false);
    }
  };

  const submittedUtr = user?.paymentDetails?.transactionId || user?.membershipReceiptNumber;

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 py-12 text-[#1C1917]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
        <MandalaWatermark size={650} opacity={0.04} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl bg-white border border-[#EADCC8] rounded-3xl p-6 sm:p-9 shadow-[0_20px_60px_rgba(194,65,12,0.06),0_2px_10px_rgba(0,0,0,0.03)] relative z-10"
      >
        {/* Top Crest & Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-2">
            <LotusCrest size={42} />
          </div>
          <ToranBorder className="mb-4" />

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#FEF3C7] border border-[#FDE68A] rounded-full text-[11px] font-bold text-[#B45309] uppercase tracking-wider mb-2.5 shadow-sm">
            <Sparkles size={12} className="text-[#D97706]" />
            <span>Step 2: Vedic Matrimony Activation</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917] tracking-tight">
            {isPendingVerification ? 'Payment Verification In Progress' : 'Unlock Verified Matrimony Access'}
          </h2>
          <p className="text-xs sm:text-sm text-[#78716C] max-w-lg mx-auto mt-1.5 leading-relaxed">
            Welcome, <strong className="text-[#C2410C] font-semibold">{user?.fullName || user?.username}</strong>. To maintain 100% verified, genuine, and privacy-protected matchmaking, a nominal membership fee is required.
          </p>
        </div>

        {/* ── CONDITIONAL VIEW: IF UTR IS PENDING ADMIN VERIFICATION ── */}
        {isPendingVerification ? (
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7]/40 to-[#FFF7ED] border border-[#FCD34D] rounded-3xl space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
                <Clock size={24} className="animate-pulse" />
              </div>

              <div>
                <h3 className="font-serif font-bold text-lg text-[#1C1917]">UTR Submitted for Bank Verification</h3>
                <p className="text-xs text-[#78716C] mt-1 max-w-md mx-auto">
                  Your 12-digit transaction reference has been logged. Kendra staff is reconciling the credit. Your account will be unlocked as soon as verified.
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#EADCC8] font-mono text-xs text-left space-y-1.5 shadow-inner">
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Transaction / UTR Reference:</span>
                  <strong className="text-[#C2410C] text-sm">{submittedUtr}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Membership Package:</span>
                  <strong className="text-[#1C1917]">{packageDuration}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Amount Paid:</span>
                  <strong className="text-emerald-700 font-bold">₹{amount}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Status:</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold text-[10px] rounded-full uppercase">
                    Awaiting Admin Approval
                  </span>
                </div>
              </div>

              {/* Instant WhatsApp Approval Fast-Track */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/919921697908?text=${encodeURIComponent(`Pranam Panditji, I have paid the Matrimony Registration Fee of ₹${amount}. My Username is: ${user?.username} and UTR is: ${submittedUtr}. Please verify and unlock my portal access.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-center"
                >
                  <MessageSquare size={16} />
                  <span>Send Screenshot on WhatsApp for Instant Approval</span>
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#EADCC8]">
              <button
                type="button"
                onClick={() => setIsEditingUtr(true)}
                className="text-xs font-bold text-[#C2410C] hover:underline"
              >
                Change or Re-enter UTR Number
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="text-xs text-[#78716C] hover:text-[#1C1917] underline"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* ── REGULAR PAYMENT INSTRUCTION & UTR SUBMISSION ── */
          <>
            {/* Pricing & Privilege Value Card */}
            <div className="bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7]/40 to-[#FFF7ED] border border-[#FCD34D]/60 rounded-2xl p-5 mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#FDE68A] pb-4 mb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#B45309]">Vedic Matrimony Package</span>
                  <div className="flex items-baseline gap-2.5 mt-0.5">
                    <span className="text-3xl font-serif font-extrabold text-[#C2410C]">₹{amount}</span>
                    <span className="text-sm line-through text-[#A8A29E]">₹{originalAmount}</span>
                    <span className="px-2 py-0.5 bg-[#DC2626]/10 text-[#DC2626] font-bold text-[10px] rounded-md uppercase">
                      {packageDuration}
                    </span>
                  </div>
                </div>
                <div className="text-right sm:text-right text-xs text-[#78716C]">
                  <span className="inline-flex items-center gap-1 text-[#15803D] font-bold bg-[#DCFCE7] px-2.5 py-1 rounded-full text-[11px]">
                    <ShieldCheck size={13} /> Direct UPI Bank Transfer
                  </span>
                </div>
              </div>

              {/* Included Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#44403C]">
                {[
                  '100% Pandit Verified Match Profiles',
                  'Ashta Koota 36-Guna Kundli Matchmaker',
                  'Direct Confidential Chat & Interests',
                  'Privacy Shield: Photo & Contact Protection',
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-[#C2410C] shrink-0" />
                    <span className="font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* QR Code & Direct UPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mb-6">
              {/* Official PhonePe / UPI QR Code Box */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-3 bg-[#FAF8F5] border border-[#EADCC8] rounded-2xl text-center shadow-inner">
                <div className="p-2 bg-white rounded-xl border border-[#E5D7C5] shadow-md mb-2 w-full max-w-[200px] flex items-center justify-center overflow-hidden">
                  <img
                    src={officialQrPath}
                    alt="Scan UPI QR Code to Pay Registration Fee"
                    className="w-full h-auto object-contain rounded-lg max-h-52"
                    onError={(e) => {
                      e.target.src = fallbackQrUrl;
                    }}
                  />
                </div>
                <span className="text-[11px] font-bold text-[#44403C] flex items-center gap-1">
                  <QrCode size={13} className="text-[#C2410C]" /> Scan with Any UPI App
                </span>
                <span className="text-[10px] text-[#78716C] mt-0.5">PhonePe • GPay • Paytm • BHIM</span>
              </div>

              {/* UPI Details & Mobile Direct Pay Button */}
              <div className="md:col-span-7 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#574F47] uppercase tracking-wider mb-1">
                    Official Payee Name & UPI ID
                  </label>
                  <div className="bg-[#FAF8F5] border border-[#EADCC8] rounded-xl p-2.5 mb-2 text-xs">
                    <span className="text-[10px] text-[#78716C] block uppercase font-semibold">Account Holder:</span>
                    <strong className="text-[#1C1917] block font-mono text-xs">{payeeName}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-[#F5EFE6] border border-[#EADCC8] rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-[#1C1917] select-all truncate">
                      {upiId}
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="px-3.5 py-2.5 bg-[#FAF8F5] hover:bg-[#F5EFE6] border border-[#EADCC8] text-[#C2410C] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
                    >
                      {copied ? <Check size={14} className="text-[#15803D]" /> : <Copy size={14} />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Mobile Direct Pay Button (Redirection to Default UPI App) */}
                <a
                  href={upiDeepLink}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#D97706] hover:brightness-105 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-center cursor-pointer active:scale-98"
                >
                  <span>Pay ₹{amount} on PhonePe / GPay / Paytm</span>
                  <ExternalLink size={14} />
                </a>

                <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-[11px] text-[#15803D] flex items-start gap-2">
                  <ShieldCheck size={15} className="shrink-0 mt-0.5 text-[#16A34A]" />
                  <span className="leading-snug">
                    Payment is credited directly to <strong>{payeeName}</strong>. Safe & non-third-party.
                  </span>
                </div>
              </div>
            </div>

            {/* UTR Submission Form */}
            <form onSubmit={handlePaymentSubmit} className="space-y-4 pt-4 border-t border-[#EADCC8]">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-[#B91C1C] text-xs flex items-center gap-2"
                >
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-[#574F47] uppercase tracking-wider mb-1.5">
                  Paste 12-Digit UPI / UTR Reference Number *
                </label>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    required
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. 423985729104 (From Bank/UPI SMS)"
                    className="flex-1 bg-[#FAF8F5] border border-[#EADCC8] focus:border-[#C2410C] focus:bg-white focus:ring-2 focus:ring-[#C2410C]/20 rounded-xl px-4 py-3 text-xs text-[#1C1917] placeholder-[#A8A29E] font-mono outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#C2410C]/20 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shrink-0"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Submit for Verification</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-[#A8A29E] mt-1.5">
                  Located in your PhonePe / GPay / Paytm payment receipt under <strong>"UPI Ref No."</strong> or <strong>"UTR"</strong>.
                </p>
              </div>
            </form>

            {/* Footer Actions */}
            <div className="mt-6 pt-5 border-t border-[#F5EFE6] flex flex-wrap items-center justify-between gap-3 text-xs">
              <a
                href="https://wa.me/919921697908?text=Hello%20Pandit%20Pravin,%20I%20have%20transferred%20the%20Matrimony%20Registration%20Fee%20for%20my%20account."
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-[#15803D] hover:underline flex items-center gap-1"
              >
                <PhoneCall size={12} />
                <span>WhatsApp Helpline (+91 99216 97908)</span>
              </a>

              <button
                type="button"
                onClick={onLogout}
                className="text-[11px] text-[#78716C] hover:text-[#1C1917] underline"
              >
                Exit / Sign Out
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default React.memo(MembershipPaymentGate);
