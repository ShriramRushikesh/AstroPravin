import { API_URL } from '../config';

const getAuthHeader = () => {
  const token = sessionStorage.getItem('matrimonyToken') || localStorage.getItem('matrimonyToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.message || `Request failed with status ${res.status}`;
    throw new Error(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
  }
  return data;
};

export const matrimonyApi = {
  // ── Auth & Registration ───────────────────────────────────────────────────
  getPaymentConfig: async () => {
    const res = await fetch(`${API_URL}/api/matrimony/auth/payment-config`);
    return handleResponse(res);
  },

  getPlans: async () => {
    const res = await fetch(`${API_URL}/api/matrimony/payment/plans`);
    return handleResponse(res);
  },

  createRazorpayOrder: async (planId) => {
    const res = await fetch(`${API_URL}/api/matrimony/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ planId }),
    });
    return handleResponse(res);
  },

  verifyRazorpayPayment: async (paymentData) => {
    const res = await fetch(`${API_URL}/api/matrimony/payment/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(paymentData),
    });
    return handleResponse(res);
  },

  register: async (formData) => {
    const res = await fetch(`${API_URL}/api/matrimony/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    return handleResponse(res);
  },

  login: async (username, password) => {
    const res = await fetch(`${API_URL}/api/matrimony/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return handleResponse(res);
  },

  submitPayment: async (paymentData) => {
    const res = await fetch(`${API_URL}/api/matrimony/auth/submit-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(paymentData),
    });
    return handleResponse(res);
  },

  changePassword: async (currentPassword, newPassword) => {
    const res = await fetch(`${API_URL}/api/matrimony/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await fetch(`${API_URL}/api/matrimony/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // ── Profile ────────────────────────────────────────────────────────────────
  getProfile: async () => {
    const res = await fetch(`${API_URL}/api/matrimony/profile`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  saveProfile: async (profileData) => {
    const res = await fetch(`${API_URL}/api/matrimony/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(profileData),
    });
    return handleResponse(res);
  },

  getCompleteness: async () => {
    const res = await fetch(`${API_URL}/api/matrimony/profile/completeness`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  uploadPhoto: async (file, isProfilePicture = false) => {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('isProfilePicture', isProfilePicture ? 'true' : 'false');

    const res = await fetch(`${API_URL}/api/matrimony/profile/photos`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData,
    });
    return handleResponse(res);
  },

  deletePhoto: async (photoId) => {
    const res = await fetch(`${API_URL}/api/matrimony/profile/photos/${photoId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  setProfilePicture: async (photoId) => {
    const res = await fetch(`${API_URL}/api/matrimony/profile/photos/${photoId}/main`, {
      method: 'PATCH',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // ── Discovery & Search ─────────────────────────────────────────────────────
  search: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => query.append(key, v));
        } else {
          query.append(key, value);
        }
      }
    });

    const res = await fetch(`${API_URL}/api/matrimony/discover/search?${query.toString()}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  getSingleProfile: async (profileId) => {
    const res = await fetch(`${API_URL}/api/matrimony/discover/${profileId}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  toggleShortlist: async (targetUserId) => {
    const res = await fetch(`${API_URL}/api/matrimony/discover/shortlist/${targetUserId}`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  getShortlisted: async () => {
    const res = await fetch(`${API_URL}/api/matrimony/discover/shortlisted`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // ── Interactions & Matches ─────────────────────────────────────────────────
  getInterests: async () => {
    const res = await fetch(`${API_URL}/api/matrimony/interactions/interests`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  sendInterest: async (receiverUserId) => {
    const res = await fetch(`${API_URL}/api/matrimony/interactions/interests/${receiverUserId}`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  respondInterest: async (interestId, action) => {
    const res = await fetch(`${API_URL}/api/matrimony/interactions/interests/${interestId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ action }),
    });
    return handleResponse(res);
  },

  getMatches: async () => {
    const res = await fetch(`${API_URL}/api/matrimony/interactions/matches`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // ── Gun Milan ─────────────────────────────────────────────────────────────
  calculateGunMilan: async (targetProfileId) => {
    const res = await fetch(`${API_URL}/api/matrimony/gun-milan/${targetProfileId}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // ── Chat ──────────────────────────────────────────────────────────────────
  getConversations: async () => {
    const res = await fetch(`${API_URL}/api/matrimony/chat/conversations`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  getMessages: async (partnerUserId, page = 1, limit = 50) => {
    const res = await fetch(`${API_URL}/api/matrimony/chat/conversations/${partnerUserId}?page=${page}&limit=${limit}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  sendMessage: async (partnerUserId, message) => {
    const res = await fetch(`${API_URL}/api/matrimony/chat/conversations/${partnerUserId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ message }),
    });
    return handleResponse(res);
  },
};
