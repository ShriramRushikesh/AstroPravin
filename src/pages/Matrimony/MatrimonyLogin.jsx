import React, { useState } from 'react';
import { API_URL } from '../../config';
import { Shield, Key, Mail, Lock, Phone, User } from 'lucide-react';

const MatrimonyLogin = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forced password reset modal state
  const [mustResetToken, setMustResetToken] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Forgot password OTP modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState('username'); // 'username' | 'otp'
  const [forgotUsername, setForgotUsername] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpNewPassword, setOtpNewPassword] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/matrimony/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.must_reset_password) {
          setMustResetToken(data.token);
          setCurrentPassword(password);
        } else {
          localStorage.setItem('matrimonyToken', data.token);
          localStorage.setItem('matrimonyUserCode', data.user_code);
          onLoginSuccess(data.token);
        }
      } else {
        setError(data.message || 'Invalid username or password');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleForcedReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/matrimony/auth/reset-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mustResetToken}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Password reset successful! Please log in with your new password.');
        setMustResetToken(null);
        setPassword('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Server error during password reset.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setForgotMsg('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/matrimony/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: forgotUsername }),
      });
      const data = await res.json();
      setForgotMsg(data.message);
      setForgotStep('otp');
    } catch (err) {
      setForgotMsg('Error requesting OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setForgotMsg('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/matrimony/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: forgotUsername,
          otp: otpCode,
          new_password: otpNewPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Password reset successful! You can now log in.');
        setShowForgotModal(false);
        setForgotStep('username');
      } else {
        setForgotMsg(data.message || 'OTP verification failed');
      }
    } catch (err) {
      setForgotMsg('Error verifying OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void pt-28 pb-16 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-white/5 border border-amber-500/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-amber-500/20 rounded-2xl border border-amber-500/30 mb-3 text-amber-300">
            <Shield size={32} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">Matrimony Member Login</h2>
          <p className="text-xs text-white/50 mt-1">Authorized member access provided by Astro Pravin Admin</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/30 border border-red-500/40 rounded-xl text-red-300 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs text-white/60 mb-1">Username / Login ID</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 text-white/40" size={16} />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin-assigned username"
                className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 text-white/40" size={16} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="text-[11px] text-amber-400 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 shadow-lg shadow-amber-500/10 transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
          </button>
        </form>

        <p className="text-[10px] text-white/30 text-center mt-6">
          🔒 Private & Confidential. Accounts are created by Astro Pravin staff. Self-registration is restricted.
        </p>
      </div>

      {/* Forced Password Reset Modal */}
      {mustResetToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#1a0a12] border border-amber-500/40 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-serif font-bold text-amber-300 mb-2">First-Time Password Change Required</h3>
            <p className="text-xs text-white/60 mb-4">For security, you must set a new personal password before accessing your account.</p>

            <form onSubmit={handleForcedReset} className="space-y-3">
              <div>
                <label className="block text-[10px] text-white/40 mb-1">New Password (min 8 chars)</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] text-white/40 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-xs"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-amber-500 text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-amber-400 mt-2"
              >
                {loading ? 'Updating...' : 'Update Password & Continue'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password OTP Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#1a0a12] border border-amber-500/40 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute right-4 top-4 text-white/40 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-lg font-serif font-bold text-amber-300 mb-2">Reset Account Password</h3>
            {forgotMsg && <p className="text-xs text-amber-400 mb-3">{forgotMsg}</p>}

            {forgotStep === 'username' ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <p className="text-xs text-white/60">Enter your login username. An OTP will be emailed to your registered email address.</p>
                <div>
                  <input
                    type="text"
                    required
                    value={forgotUsername}
                    onChange={(e) => setForgotUsername(e.target.value)}
                    placeholder="Your username"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-amber-500 text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-amber-400"
                >
                  {loading ? 'Sending...' : 'Send Email OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <div>
                  <label className="block text-[10px] text-white/40 mb-1">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-xs text-center font-mono tracking-widest text-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-white/40 mb-1">Set New Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={otpNewPassword}
                    onChange={(e) => setOtpNewPassword(e.target.value)}
                    placeholder="New password"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-amber-500 text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-amber-400"
                >
                  {loading ? 'Verifying...' : 'Verify OTP & Reset Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatrimonyLogin;
