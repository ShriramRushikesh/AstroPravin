import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, CheckCircle2, QrCode, Copy, Check,
  PhoneCall, ArrowRight, Sparkles, Lock, Clock, HeartHandshake, AlertCircle, MessageSquare,
  HelpCircle, UserCheck
} from 'lucide-react';
import { LotusCrest, ToranBorder, MandalaWatermark } from './MatrimonyDecorativeArt';

const MembershipPaymentGate = ({ user, registrationConfig, onPaymentCompleted, onLogout }) => {
  const [transactionId, setTransactionId] = useState('');
  const [paymentMode, setPaymentMode] = useState('upi');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditingUtr, setIsEditingUtr] = useState(false);
  const [copyNotice, setCopyNotice] = useState('');

  // Dynamic admin-configurable values with defaults
  const upiId = registrationConfig?.upiId || 'rishi.shriram5@ybl';
  const payeeName = registrationConfig?.payeeName || 'RUSHIKESH PRAVIN SHRIRAM';
  const amount = registrationConfig?.membershipFee || 199;
  const originalAmount = registrationConfig?.originalFee || 499;
  const packageDuration = registrationConfig?.durationText || '3 Months Vedic Membership';
  const supportPhone = '7875542000';
  const formattedPhone = '+91 78755 42000';

  // Dedicated Official PhonePe QR Asset with online generator fallback
  const officialQrPath = '/phonepe-qr.png';
  const fallbackQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(`upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=AstroPravin%20Matrimony%20${user?.username || ''}`)}&color=000000&bgcolor=FFFFFF`;

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(upiId);
    setCopied(true);
    setCopyNotice('UPI ID copied to clipboard!');
    setTimeout(() => {
      setCopied(false);
      setCopyNotice('');
    }, 2500);
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
            {isPendingVerification ? 'Payment Verification In Progress' : 'Scan & Pay Membership Fee'}
          </h2>
          <p className="text-xs sm:text-sm text-[#78716C] max-w-lg mx-auto mt-1.5 leading-relaxed">
            Welcome, <strong className="text-[#C2410C] font-semibold">{user?.fullName || user?.username}</strong>. 
            Scan the verified QR code below using any UPI app (PhonePe, GPay, Paytm, BHIM) or use the UPI ID to pay.
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
                  href={`https://wa.me/91${supportPhone}?text=${encodeURIComponent(`Pranam Panditji, I have paid the Matrimony Registration Fee of ₹${amount}. My Username is: ${user?.username} and UTR is: ${submittedUtr}. Please verify and unlock my portal access.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-center cursor-pointer"
                >
                  <MessageSquare size={16} />
                  <span>Send Screenshot on WhatsApp ({formattedPhone}) for Fast Approval</span>
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#EADCC8]">
              <button
                type="button"
                onClick={() => setIsEditingUtr(true)}
                className="text-xs font-bold text-[#C2410C] hover:underline cursor-pointer"
              >
                Change or Re-enter UTR Number
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="text-xs text-[#78716C] hover:text-[#1C1917] underline cursor-pointer"
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
                    <ShieldCheck size={13} /> 100% Direct & Zero Extra Charges
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

            {/* Direct QR Code & UPI ID Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mb-6">
              {/* Official Square PhonePe QR Code */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-3.5 bg-[#FAF8F5] border border-[#EADCC8] rounded-2xl text-center shadow-inner">
                <div className="p-2 bg-white rounded-xl border border-[#E5D7C5] shadow-md mb-2 w-full max-w-[210px] flex items-center justify-center overflow-hidden">
                  <img
                    src={officialQrPath}
                    alt="Scan Official UPI QR Code"
                    className="w-full h-auto object-contain rounded-lg max-h-56"
                    onError={(e) => {
                      e.target.src = fallbackQrUrl;
                    }}
                  />
                </div>
                <span className="text-[11px] font-bold text-[#44403C] flex items-center gap-1">
                  <QrCode size={13} className="text-[#C2410C]" /> Scan with Any UPI App
                </span>
                <span className="text-[10px] text-[#78716C] mt-0.5">PhonePe • Google Pay • Paytm • BHIM</span>
              </div>

              {/* Payee Info, Copy UPI ID, and Direct Phone Helpline */}
              <div className="md:col-span-7 space-y-3.5">
                <div className="bg-[#FAF8F5] border border-[#EADCC8] rounded-2xl p-4 space-y-3">
                  <div>
                    <span className="text-[10px] text-[#78716C] block uppercase font-bold tracking-wider">
                      Official Account Holder / Payee:
                    </span>
                    <strong className="text-[#1C1917] text-sm block font-serif">{payeeName}</strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#78716C] block uppercase font-bold tracking-wider mb-1">
                      Official UPI ID:
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white border border-[#EADCC8] rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-[#1C1917] select-all truncate shadow-inner">
                        {upiId}
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="px-3.5 py-2 bg-[#FFF7ED] hover:bg-[#FFEDD5] border border-[#FED7AA] text-[#C2410C] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
                      >
                        {copied ? <Check size={14} className="text-[#15803D]" /> : <Copy size={14} />}
                        <span>{copied ? 'Copied' : 'Copy UPI'}</span>
                      </button>
                    </div>
                    {copyNotice && (
                      <p className="text-[11px] font-semibold text-emerald-700 mt-1">{copyNotice}</p>
                    )}
                  </div>
                </div>

                {/* Trust & Direct Personal Support Callout */}
                <div className="p-3.5 bg-gradient-to-r from-[#F0FDF4] to-[#DCFCE7]/40 border border-[#BBF7D0] rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#15803D]">
                    <UserCheck size={16} className="text-[#16A34A] shrink-0" />
                    <span>Direct Kendra Helpline & Support</span>
                  </div>
                  <p className="text-[11px] text-[#374151] leading-relaxed">
                    Have questions or facing any issue? Connect directly with our Kendra coordinator:
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={`tel:${supportPhone}`}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <PhoneCall size={12} />
                      <span>Call {formattedPhone}</span>
                    </a>
                    <a
                      href={`https://wa.me/91${supportPhone}?text=${encodeURIComponent(`Namaste, I need help with the Matrimony Registration Payment of ₹${amount}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <MessageSquare size={12} />
                      <span>WhatsApp</span>
                    </a>
                  </div>
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
                    placeholder="e.g. 423985729104 (From Bank/UPI SMS or App)"
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
              <span className="text-[11px] text-[#78716C]">
                Shriram Samupdeshan Kendra • Helpline: <strong>{formattedPhone}</strong>
              </span>

              <button
                type="button"
                onClick={onLogout}
                className="text-[11px] text-[#78716C] hover:text-[#1C1917] underline cursor-pointer"
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
