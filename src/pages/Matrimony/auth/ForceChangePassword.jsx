import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';
import { LotusCrest } from '../components/MatrimonyDecorativeArt';

const ForceChangePassword = ({ onPasswordChanged }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await onPasswordChanged(currentPassword, newPassword);
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 pt-20 pb-16 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white border border-[#EADCC8] rounded-3xl p-6 sm:p-8 shadow-xl relative z-10 text-[#1C1917]"
      >
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-[#FFFBEB] text-[#C2410C] rounded-2xl border border-[#FDE68A] mb-3 shadow-sm">
            <KeyRound size={26} />
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1917]">First-Time Login Security</h2>
          <p className="text-xs text-[#78716C] mt-1 max-w-xs mx-auto leading-relaxed">
            Please set a new private password for your matrimony account to complete your activation.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-[#FEF2F2] border border-[#FECACA] rounded-2xl text-[#B91C1C] text-xs flex items-center gap-2.5">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-[#574F47] uppercase tracking-wider mb-1.5">
              Temporary / Current Password
            </label>
            <div className="relative group">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78716C] group-focus-within:text-[#C2410C]" />
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EADCC8] focus:border-[#C2410C] focus:bg-white rounded-2xl py-3 pl-11 pr-4 text-xs text-[#1C1917] focus:outline-none transition-all"
                placeholder="Enter initial password"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#574F47] uppercase tracking-wider mb-1.5">
              New Private Password
            </label>
            <div className="relative group">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78716C] group-focus-within:text-[#C2410C]" />
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EADCC8] focus:border-[#C2410C] focus:bg-white rounded-2xl py-3 pl-11 pr-4 text-xs text-[#1C1917] focus:outline-none transition-all"
                placeholder="Minimum 6 characters"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#574F47] uppercase tracking-wider mb-1.5">
              Confirm New Password
            </label>
            <div className="relative group">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78716C] group-focus-within:text-[#C2410C]" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EADCC8] focus:border-[#C2410C] focus:bg-white rounded-2xl py-3 pl-11 pr-4 text-xs text-[#1C1917] focus:outline-none transition-all"
                placeholder="Re-enter new password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white font-bold text-xs rounded-2xl shadow-md shadow-[#C2410C]/20 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Save Password & Proceed</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default React.memo(ForceChangePassword);
