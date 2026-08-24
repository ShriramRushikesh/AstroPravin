import { useState, useEffect, useCallback } from 'react';
import { matrimonyApi } from '../../../services/matrimonyApi';

export const useMatrimonyAuth = () => {
  const [token, setToken] = useState(() => sessionStorage.getItem('matrimonyToken') || localStorage.getItem('matrimonyToken'));
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('matrimonyUser') || localStorage.getItem('matrimonyUser');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [profile, setProfile] = useState(null);
  const [registrationConfig, setRegistrationConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    sessionStorage.removeItem('matrimonyToken');
    sessionStorage.removeItem('matrimonyUser');
    localStorage.removeItem('matrimonyToken');
    localStorage.removeItem('matrimonyUser');
    setToken(null);
    setUser(null);
    setProfile(null);
  }, []);

  const fetchCurrentAuth = useCallback(async (authToken) => {
    if (!authToken) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await matrimonyApi.getMe();
      if (data?.user) {
        setUser(data.user);
        sessionStorage.setItem('matrimonyUser', JSON.stringify(data.user));
      }
      if (data?.profile) {
        setProfile(data.profile);
      }
      if (data?.registrationConfig) {
        setRegistrationConfig(data.registrationConfig);
      }
    } catch (err) {
      console.error('Auth verification failed', err);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (token) {
      fetchCurrentAuth(token);
    } else {
      setLoading(false);
    }
  }, [token, fetchCurrentAuth]);

  const login = async (username, password) => {
    const res = await matrimonyApi.login(username, password);
    sessionStorage.setItem('matrimonyToken', res.token);
    sessionStorage.setItem('matrimonyUser', JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);
    if (res.profile) setProfile(res.profile);
    if (res.registrationConfig) setRegistrationConfig(res.registrationConfig);
    return res;
  };

  const register = async (formData) => {
    const res = await matrimonyApi.register(formData);
    sessionStorage.setItem('matrimonyToken', res.token);
    sessionStorage.setItem('matrimonyUser', JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);
    if (res.profile) setProfile(res.profile);
    if (res.registrationConfig) setRegistrationConfig(res.registrationConfig);
    return res;
  };

  const submitPayment = async (paymentData) => {
    const res = await matrimonyApi.submitPayment(paymentData);
    if (res.user) {
      setUser(res.user);
      sessionStorage.setItem('matrimonyUser', JSON.stringify(res.user));
    }
    if (res.profile) setProfile(res.profile);
    return res;
  };

  const updateUserState = (userData, profileData) => {
    if (userData) {
      setUser(userData);
      sessionStorage.setItem('matrimonyUser', JSON.stringify(userData));
      localStorage.setItem('matrimonyUser', JSON.stringify(userData));
    }
    if (profileData) {
      setProfile(profileData);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    const res = await matrimonyApi.changePassword(currentPassword, newPassword);
    if (user) {
      const updated = { ...user, isFirstLogin: false };
      setUser(updated);
      sessionStorage.setItem('matrimonyUser', JSON.stringify(updated));
    }
    return res;
  };

  const refreshProfile = async () => {
    if (token) {
      await fetchCurrentAuth(token);
    }
  };

  const isPendingPayment =
    user?.status === 'pending_payment' ||
    user?.paymentStatus === 'unpaid' ||
    user?.status === 'pending_payment_verification' ||
    user?.paymentStatus === 'pending_verification';

  return {
    token,
    user,
    profile,
    registrationConfig,
    loading,
    isAuthenticated: !!token && !!user,
    isFirstLogin: !!user?.isFirstLogin,
    isPendingPayment,
    login,
    register,
    submitPayment,
    updateUserState,
    changePassword,
    logout,
    refreshProfile,
  };
};
