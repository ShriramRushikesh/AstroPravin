import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, KeyRound, ShieldAlert, AlertCircle, ArrowRight } from 'lucide-react';

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
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 pt-24 md:pt-28 pb-16 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-neutral-900/85 border border-amber-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-[0_10px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(245,158,11,0.12)] relative z-10"
      >
        <div className="text-center mb-6">
          <div className="inline-flex p-3.5 bg-gradient-to-br from-amber-500/20 to-orange-500/10 text-amber-400 rounded-2xl border border-amber-500/40 mb-3 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <KeyRound size={26} />
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">First-Time Login Security</h2>
          <p className="text-xs text-white/60 mt-1 max-w-xs mx-auto leading-relaxed">
            Please set a new private password for your matrimony account to complete your activation.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle size={16} className="shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-amber-200/80 uppercase tracking-widest mb-1.5">
              Temporary / Current Password
            </label>
            <div className="relative group">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-amber-400" />
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 group-hover:border-white/20 focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 rounded-2xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none transition-all"
                placeholder="Enter shop receipt password"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-amber-200/80 uppercase tracking-widest mb-1.5">
              New Private Password
            </label>
            <div className="relative group">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-amber-400" />
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 group-hover:border-white/20 focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 rounded-2xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none transition-all"
                placeholder="Minimum 6 characters"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-amber-200/80 uppercase tracking-widest mb-1.5">
              Confirm New Password
            </label>
            <div className="relative group">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-amber-400" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 group-hover:border-white/20 focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 rounded-2xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none transition-all"
                placeholder="Re-enter new password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black font-bold text-sm rounded-2xl shadow-[0_4px_25px_rgba(245,158,11,0.3)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Save Password & Proceed</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default React.memo(ForceChangePassword);
