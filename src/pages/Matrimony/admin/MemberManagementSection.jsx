import React, { useState, useEffect } from 'react';
import {
  Users, UserPlus, Search, Filter, ShieldCheck, KeyRound,
  Eye, Check, X, Copy, RefreshCw, Smartphone, ChevronRight
} from 'lucide-react';
import { matrimonyAdminService } from '../../../services/matrimonyAdminService';

const MemberManagementSection = () => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');

  // Modal & Drawer states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [copied, setCopied] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // New member form
  const [createForm, setCreateForm] = useState({
    fullName: '',
    mobile: '',
    email: '',
    gender: 'male',
    membershipAmount: 2100,
    membershipMode: 'cash',
    membershipReceiptNumber: '',
    tier: 'basic',
    notes: '',
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await matrimonyAdminService.listUsers({
        page,
        limit: 20,
        search,
        status: statusFilter,
        tier: tierFilter,
        gender: genderFilter,
      });
      setUsers(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load members', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, statusFilter, tierFilter, genderFilter]);

  const handleCreateMember = async (e) => {
    e.preventDefault();
    try {
      const res = await matrimonyAdminService.createMember(createForm);
      setCreatedCredentials(res.member);
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to create member');
    }
  };

  const handleResetPassword = async (userId) => {
    if (!confirm('Generate a new random password for this member?')) return;
    try {
      const res = await matrimonyAdminService.resetMemberPassword(userId);
      setCreatedCredentials(res.member);
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to reset password');
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await matrimonyAdminService.updateStatus(userId, newStatus);
      fetchUsers();
      if (selectedUser) setSelectedUser(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleTierChange = async (userId, newTier) => {
    try {
      await matrimonyAdminService.updateTier(userId, newTier);
      fetchUsers();
      if (selectedUser) setSelectedUser(prev => ({ ...prev, tier: newTier }));
    } catch (err) {
      alert(err.message || 'Failed to update tier');
    }
  };

  const handleToggleContact = async (userId, val) => {
    try {
      await matrimonyAdminService.toggleContactVisibility(userId, val);
      fetchUsers();
      if (selectedUser) {
        setSelectedUser(prev => ({
          ...prev,
          profile: { ...prev.profile, isContactVisible: val },
        }));
      }
    } catch (err) {
      alert(err.message || 'Failed to toggle contact visibility');
    }
  };

  return (
    <div className="space-y-6 text-[#1C1917]">
      {/* ── Header & Action Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-[#EADCC8] p-5 rounded-3xl shadow-luxury">
        <div>
          <h3 className="text-lg font-serif font-bold text-[#1C1917]">Member Directory</h3>
          <p className="text-xs text-[#78716C]">Total enrolled members: <strong className="text-[#C2410C] font-bold">{total}</strong></p>
        </div>

        <button
          onClick={() => {
            setCreatedCredentials(null);
            setCreateForm({
              fullName: '',
              mobile: '',
              email: '',
              gender: 'male',
              membershipAmount: 2100,
              membershipMode: 'cash',
              membershipReceiptNumber: `REC-${Date.now().toString().slice(-6)}`,
              tier: 'basic',
              notes: '',
            });
            setShowCreateModal(true);
          }}
          className="px-4 py-2.5 bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white font-bold text-xs rounded-xl shadow-sm hover:scale-105 transition-transform flex items-center gap-1.5 uppercase tracking-wider"
        >
          <UserPlus size={15} />
          <span>+ Enroll New Paid Member</span>
        </button>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-white border border-[#EADCC8] p-4 rounded-3xl shadow-sm">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') fetchUsers(); }}
            placeholder="Search by name / user / phone..."
            className="w-full bg-[#FAF8F5] border border-[#EADCC8] rounded-xl py-2 pl-9 pr-3 text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C2410C]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#FAF8F5] border border-[#EADCC8] rounded-xl px-3 py-2 text-xs text-[#1C1917] focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="pending_profile">Pending Profile Setup</option>
          <option value="pending_verification">Pending Verification</option>
          <option value="verified">Verified</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>

        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="bg-[#FAF8F5] border border-[#EADCC8] rounded-xl px-3 py-2 text-xs text-[#1C1917] focus:outline-none"
        >
          <option value="all">All Tiers</option>
          <option value="basic">Basic Tier</option>
          <option value="premium">Premium Tier</option>
        </select>

        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          className="bg-[#FAF8F5] border border-[#EADCC8] rounded-xl px-3 py-2 text-xs text-[#1C1917] focus:outline-none"
        >
          <option value="all">All Genders</option>
          <option value="female">Brides (Female)</option>
          <option value="male">Grooms (Male)</option>
        </select>
      </div>

      {/* ── Members Table ── */}
      <div className="bg-white border border-[#EADCC8] rounded-3xl overflow-hidden shadow-luxury">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#EADCC8] bg-[#F5F0E8] text-[#44403C] uppercase tracking-wider text-[10px] font-bold">
                <th className="p-3.5">Member Name / Username</th>
                <th className="p-3.5">Gender / Age</th>
                <th className="p-3.5">Contact</th>
                <th className="p-3.5">Tier</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Payment</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EADCC8]/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#78716C]">Loading members...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#78716C]">No members found.</td>
                </tr>
              ) : (
                users.map((u) => {
                  const p = u.profile;
                  return (
                    <tr key={u._id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-[#1C1917] font-serif">{p?.fullName || 'No Profile Yet'}</div>
                        <div className="text-[10px] text-[#C2410C] font-mono font-bold">{u.username}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="capitalize text-[#1C1917]">{p?.gender || '-'}</span>
                        {p?.dateOfBirth && (
                          <span className="text-[#78716C] text-[10px] block">
                            {Math.floor((new Date() - new Date(p.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000))} yrs
                          </span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-[#1C1917]">{p?.mobile || '-'}</div>
                        <div className="text-[10px] text-[#78716C] truncate max-w-[120px]">{p?.currentCity || '-'}</div>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.tier === 'premium' ? 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]' : 'bg-[#F5F0E8] text-[#44403C]'
                        }`}>
                          {u.tier}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.status === 'verified' || u.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : u.status === 'pending_verification'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : u.status === 'suspended'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-stone-50 text-stone-700 border border-stone-200'
                        }`}>
                          {u.status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-emerald-700">₹{u.membershipAmount || 0}</div>
                        <div className="text-[9px] text-[#78716C] uppercase">{u.membershipReceiptNumber || u.membershipMode}</div>
                      </td>
                      <td className="p-3.5 text-right space-x-1">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="px-2.5 py-1 bg-[#FFF7ED] hover:bg-[#FFEDD5] border border-[#FED7AA] rounded-lg text-[#C2410C] font-bold transition-colors"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal: Create New Member ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-[#1C1917]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#FAF8F5] border border-[#EADCC8] rounded-3xl p-6 md:p-8 shadow-luxury-hover space-y-5">
            <div className="flex items-center justify-between border-b border-[#EADCC8] pb-3">
              <h3 className="text-base font-serif font-bold text-[#1C1917] flex items-center gap-2">
                <UserPlus size={18} className="text-[#C2410C]" />
                <span>Enroll New Offline Member</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-[#78716C] hover:text-[#1C1917]">
                <X size={18} />
              </button>
            </div>

            {createdCredentials ? (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                  <Check size={16} /> Member Enrolled Successfully!
                </div>
                <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1 font-mono text-xs text-[#1C1917]">
                  <div><strong>Username:</strong> {createdCredentials.username}</div>
                  <div><strong>Temporary Password:</strong> {createdCredentials.tempPassword}</div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`AstroPravin Matrimony Login:\nUsername: ${createdCredentials.username}\nPassword: ${createdCredentials.tempPassword}\nLogin at: https://astropravin.com/matrimony`);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="w-full py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Copy size={13} /> {copied ? 'Credentials Copied!' : 'Copy Login Details for Devotee'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateMember} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#44403C] font-bold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={createForm.fullName}
                      onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
                      className="w-full bg-white border border-[#EADCC8] rounded-xl p-2.5 text-[#1C1917] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#44403C] font-bold mb-1">Mobile / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={createForm.mobile}
                      onChange={(e) => setCreateForm({ ...createForm, mobile: e.target.value })}
                      className="w-full bg-white border border-[#EADCC8] rounded-xl p-2.5 text-[#1C1917] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#44403C] font-bold mb-1">Gender *</label>
                    <select
                      value={createForm.gender}
                      onChange={(e) => setCreateForm({ ...createForm, gender: e.target.value })}
                      className="w-full bg-white border border-[#EADCC8] rounded-xl p-2.5 text-[#1C1917] focus:outline-none"
                    >
                      <option value="male">Groom (Male)</option>
                      <option value="female">Bride (Female)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#44403C] font-bold mb-1">Membership Fee (₹) *</label>
                    <input
                      type="number"
                      value={createForm.membershipAmount}
                      onChange={(e) => setCreateForm({ ...createForm, membershipAmount: Number(e.target.value) })}
                      className="w-full bg-white border border-[#EADCC8] rounded-xl p-2.5 text-[#1C1917] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white font-bold rounded-xl text-xs shadow-sm hover:scale-[1.01] transition-transform"
                >
                  Generate Credentials & Enroll
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Drawer: Manage Member ── */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-[#1C1917]/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-[#FAF8F5] border-l border-[#EADCC8] p-6 h-full overflow-y-auto space-y-6 text-xs text-[#1C1917]">
            <div className="flex items-center justify-between border-b border-[#EADCC8] pb-3">
              <h3 className="text-base font-serif font-bold">Manage Member</h3>
              <button onClick={() => setSelectedUser(null)} className="text-[#78716C] hover:text-[#1C1917]">
                <X size={18} />
              </button>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#EADCC8] space-y-2">
              <div className="text-base font-bold font-serif">{selectedUser.profile?.fullName || selectedUser.username}</div>
              <div className="text-xs text-[#C2410C] font-mono font-bold">Username: {selectedUser.username}</div>
              <div className="text-xs text-[#78716C]">Phone: {selectedUser.profile?.mobile}</div>
            </div>

            <div className="space-y-3">
              <label className="block font-bold text-[#44403C] uppercase text-[11px]">Membership Status</label>
              <select
                value={selectedUser.status}
                onChange={(e) => handleStatusChange(selectedUser._id, e.target.value)}
                className="w-full bg-white border border-[#EADCC8] rounded-xl p-2.5 text-[#1C1917]"
              >
                <option value="pending_profile">Pending Profile Setup</option>
                <option value="pending_verification">Pending Verification</option>
                <option value="verified">Verified</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="block font-bold text-[#44403C] uppercase text-[11px]">Tier</label>
              <select
                value={selectedUser.tier}
                onChange={(e) => handleTierChange(selectedUser._id, e.target.value)}
                className="w-full bg-white border border-[#EADCC8] rounded-xl p-2.5 text-[#1C1917]"
              >
                <option value="basic">Basic (Standard Matchmaking)</option>
                <option value="premium">Premium (Featured & Priority)</option>
              </select>
            </div>

            <div className="pt-4 border-t border-[#EADCC8]">
              <button
                onClick={() => handleResetPassword(selectedUser._id)}
                className="w-full py-2.5 bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <KeyRound size={14} /> Reset Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(MemberManagementSection);
