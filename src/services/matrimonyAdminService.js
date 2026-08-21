import { API_URL } from '../config';

const getAdminAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
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

export const matrimonyAdminService = {
  // ── Users & Members ───────────────────────────────────────────────────────
  listUsers: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v);
    });
    const res = await fetch(`${API_URL}/api/matrimony/admin/users?${query.toString()}`, {
      headers: { ...getAdminAuthHeader() },
    });
    return handleResponse(res);
  },

  createMember: async (memberData) => {
    const res = await fetch(`${API_URL}/api/matrimony/admin/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAdminAuthHeader() },
      body: JSON.stringify(memberData),
    });
    return handleResponse(res);
  },

  getMemberDetail: async (userId) => {
    const res = await fetch(`${API_URL}/api/matrimony/admin/users/${userId}`, {
      headers: { ...getAdminAuthHeader() },
    });
    return handleResponse(res);
  },

  updateStatus: async (userId, status, rejectionReason = '') => {
    const res = await fetch(`${API_URL}/api/matrimony/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAdminAuthHeader() },
      body: JSON.stringify({ status, rejectionReason }),
    });
    return handleResponse(res);
  },

  verifyMemberPayment: async (userId, approved, notes = '') => {
    const res = await fetch(`${API_URL}/api/matrimony/admin/users/${userId}/verify-payment`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAdminAuthHeader() },
      body: JSON.stringify({ approved, notes }),
    });
    return handleResponse(res);
  },

  updateTier: async (userId, tier) => {
    const res = await fetch(`${API_URL}/api/matrimony/admin/users/${userId}/tier`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAdminAuthHeader() },
      body: JSON.stringify({ tier }),
    });
    return handleResponse(res);
  },

  toggleContactVisibility: async (userId, isContactVisible) => {
    const res = await fetch(`${API_URL}/api/matrimony/admin/users/${userId}/contact-visibility`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAdminAuthHeader() },
      body: JSON.stringify({ isContactVisible }),
    });
    return handleResponse(res);
  },

  toggleFeatured: async (userId, isFeatured) => {
    const res = await fetch(`${API_URL}/api/matrimony/admin/users/${userId}/featured`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAdminAuthHeader() },
      body: JSON.stringify({ isFeatured }),
    });
    return handleResponse(res);
  },

  resetPassword: async (userId) => {
    const res = await fetch(`${API_URL}/api/matrimony/admin/users/${userId}/reset-password`, {
      method: 'POST',
      headers: { ...getAdminAuthHeader() },
    });
    return handleResponse(res);
  },

  // ── Verification & Photos ─────────────────────────────────────────────────
  getPendingVerifications: async () => {
    const res = await fetch(`${API_URL}/api/matrimony/admin/users/pending-verification`, {
      headers: { ...getAdminAuthHeader() },
    });
    return handleResponse(res);
  },

  getPendingPhotos: async () => {
    const res = await fetch(`${API_URL}/api/matrimony/admin/users/pending-photos`, {
      headers: { ...getAdminAuthHeader() },
    });
    return handleResponse(res);
  },

  reviewPhoto: async (photoId, status, reason = '') => {
    const res = await fetch(`${API_URL}/api/matrimony/admin/photos/${photoId}/review`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAdminAuthHeader() },
      body: JSON.stringify({ status, reason }),
    });
    return handleResponse(res);
  },

  // ── CRM ───────────────────────────────────────────────────────────────────
  listLeads: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v);
    });
    const res = await fetch(`${API_URL}/api/matrimony/admin/crm/leads?${query.toString()}`, {
      headers: { ...getAdminAuthHeader() },
    });
    return handleResponse(res);
  },

  createLead: async (leadData) => {
    const res = await fetch(`${API_URL}/api/matrimony/admin/crm/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAdminAuthHeader() },
      body: JSON.stringify(leadData),
    });
    return handleResponse(res);
  },

  updateLead: async (leadId, updateData) => {
    const res = await fetch(`${API_URL}/api/matrimony/admin/crm/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAdminAuthHeader() },
      body: JSON.stringify(updateData),
    });
    return handleResponse(res);
  },

  scheduleFollowUp: async (leadId, followUpData) => {
    const res = await fetch(`${API_URL}/api/matrimony/admin/crm/leads/${leadId}/followups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAdminAuthHeader() },
      body: JSON.stringify(followUpData),
    });
    return handleResponse(res);
  },

  completeFollowUp: async (followupId, completeData) => {
    const res = await fetch(`${API_URL}/api/matrimony/admin/crm/followups/${followupId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAdminAuthHeader() },
      body: JSON.stringify(completeData),
    });
    return handleResponse(res);
  },

  logCall: async (leadId, callData) => {
    const res = await fetch(`${API_URL}/api/matrimony/admin/crm/leads/${leadId}/calls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAdminAuthHeader() },
      body: JSON.stringify(callData),
    });
    return handleResponse(res);
  },

  getLeadTimeline: async (leadId) => {
    const res = await fetch(`${API_URL}/api/matrimony/admin/crm/leads/${leadId}/timeline`, {
      headers: { ...getAdminAuthHeader() },
    });
    return handleResponse(res);
  },

  getCrmDashboard: async () => {
    const res = await fetch(`${API_URL}/api/matrimony/admin/crm/dashboard`, {
      headers: { ...getAdminAuthHeader() },
    });
    return handleResponse(res);
  },

  // ── Analytics & Audit ─────────────────────────────────────────────────────
  getOverviewAnalytics: async () => {
    const res = await fetch(`${API_URL}/api/matrimony/admin/analytics/overview`, {
      headers: { ...getAdminAuthHeader() },
    });
    return handleResponse(res);
  },

  getActivityAnalytics: async () => {
    const res = await fetch(`${API_URL}/api/matrimony/admin/analytics/activity`, {
      headers: { ...getAdminAuthHeader() },
    });
    return handleResponse(res);
  },

  getAuditLogs: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v);
    });
    const res = await fetch(`${API_URL}/api/matrimony/admin/audit?${query.toString()}`, {
      headers: { ...getAdminAuthHeader() },
    });
    return handleResponse(res);
  },
};
