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

  const handleCopyCredentials = () => {
    if (!createdCredentials) return;
    const text = `AstroPravin Vedic Matrimony Login Credentials:\nUsername: ${createdCredentials.username}\nTemp Password: ${createdCredentials.tempPassword}\nPortal Link: https://astropravin.com/matrimony`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleResetPassword = async (userId) => {
    if (!window.confirm('Generate a new temporary password for this user?')) return;
    try {
      const res = await matrimonyAdminService.resetPassword(userId);
      alert(`New Temporary Password Generated:\nUsername: ${res.username}\nPassword: ${res.tempPassword}`);
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
    <div className="space-y-6">
      {/* ── Header & Action Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
        <div>
          <h3 className="text-lg font-serif font-bold text-white">Member Directory</h3>
          <p className="text-xs text-white/50">Total enrolled members: <strong className="text-amber-400">{total}</strong></p>
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
          className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold text-xs rounded-xl shadow-lg hover:brightness-110 flex items-center gap-1.5 uppercase tracking-wider"
        >
          <UserPlus size={15} />
          <span>+ Enroll New Paid Member</span>
        </button>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-neutral-900/60 border border-white/10 p-4 rounded-2xl">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') fetchUsers(); }}
            placeholder="Search by name / user / phone..."
            className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
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
          className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
        >
          <option value="all">All Tiers</option>
          <option value="basic">Basic Tier</option>
          <option value="premium">Premium Tier</option>
        </select>

        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
        >
          <option value="all">All Genders</option>
          <option value="female">Brides (Female)</option>
          <option value="male">Grooms (Male)</option>
        </select>
      </div>

      {/* ── Members Table ── */}
      <div className="bg-neutral-900/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-white/50 uppercase tracking-wider text-[10px]">
                <th className="p-3.5">Member Name / Username</th>
                <th className="p-3.5">Gender / Age</th>
                <th className="p-3.5">Contact</th>
                <th className="p-3.5">Tier</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Payment</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-white/40">Loading members...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-white/40">No members found.</td>
                </tr>
              ) : (
                users.map((u) => {
                  const p = u.profile;
                  return (
                    <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-white font-serif">{p?.fullName || 'No Profile Yet'}</div>
                        <div className="text-[10px] text-amber-400 font-mono">{u.username}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="capitalize">{p?.gender || '-'}</span>
                        {p?.dateOfBirth && (
                          <span className="text-white/40 text-[10px] block">
                            {Math.floor((new Date() - new Date(p.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000))} yrs
                          </span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <div>{p?.mobile || '-'}</div>
                        <div className="text-[10px] text-white/40 truncate max-w-[120px]">{p?.currentCity || '-'}</div>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.tier === 'premium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-white/10 text-white/70'
                        }`}>
                          {u.tier}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.status === 'verified' || u.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : u.status === 'pending_verification'
                            ? 'bg-amber-500/20 text-amber-300'
                            : u.status === 'suspended'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-white/10 text-white/60'
                        }`}>
                          {u.status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-mono text-emerald-400">₹{u.membershipAmount || 0}</div>
                        <div className="text-[9px] text-white/40 uppercase">{u.membershipReceiptNumber || u.membershipMode}</div>
                      </td>
                      <td className="p-3.5 text-right space-x-1">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/80 hover:text-white transition-colors"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-neutral-900 border border-amber-500/40 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <UserPlus size={18} className="text-amber-400" />
                <span>Enroll New Offline Member</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-white/40 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {createdCredentials ? (
              <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <ShieldCheck size={18} />
                  <span>Member Account Created Successfully!</span>
                </div>
                <div className="bg-black/60 p-4 rounded-xl space-y-2 text-xs font-mono">
                  <div><span className="text-white/40">Username: </span><strong className="text-amber-400">{createdCredentials.username}</strong></div>
                  <div><span className="text-white/40">Temp Password: </span><strong className="text-amber-400">{createdCredentials.tempPassword}</strong></div>
                  <div><span className="text-white/40">Receipt No: </span><span className="text-white/80">{createdCredentials.receiptNumber}</span></div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyCredentials}
                    className="flex-1 py-2.5 bg-amber-500 text-black font-bold text-xs rounded-xl shadow hover:brightness-110 flex items-center justify-center gap-1.5"
                  >
                    <Copy size={13} />
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Credentials'}</span>
                  </button>
                  <button
                    onClick={() => {
                      const msg = `Hello ${createdCredentials.fullName}, your AstroPravin Matrimony account is ready.\nUsername: ${createdCredentials.username}\nPassword: ${createdCredentials.tempPassword}\nLogin: https://astropravin.com/matrimony`;
                      window.open(`https://wa.me/91${createdCredentials.mobile}?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1"
                  >
                    <Smartphone size={13} /> WhatsApp
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateMember} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-white/60 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={createForm.fullName}
                      onChange={e => setCreateForm({ ...createForm, fullName: e.target.value })}
                      placeholder="e.g. Anand Kulkarni"
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-white/60 mb-1">Mobile (WhatsApp) *</label>
                    <input
                      type="text"
                      required
                      value={createForm.mobile}
                      onChange={e => setCreateForm({ ...createForm, mobile: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-white/60 mb-1">Gender *</label>
                    <select
                      value={createForm.gender}
                      onChange={e => setCreateForm({ ...createForm, gender: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                    >
                      <option value="male">Male (Groom)</option>
                      <option value="female">Female (Bride)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-white/60 mb-1">Membership Plan</label>
                    <select
                      value={createForm.tier}
                      onChange={e => setCreateForm({ ...createForm, tier: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                    >
                      <option value="basic">Basic (Standard 1-Time Fee)</option>
                      <option value="premium">Premium (Featured & Gun Milan)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-white/60 mb-1">Amount Paid (₹)</label>
                    <input
                      type="number"
                      value={createForm.membershipAmount}
                      onChange={e => setCreateForm({ ...createForm, membershipAmount: Number(e.target.value) })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-white/60 mb-1">Payment Mode</label>
                    <select
                      value={createForm.membershipMode}
                      onChange={e => setCreateForm({ ...createForm, membershipMode: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                    >
                      <option value="cash">Cash at Shop</option>
                      <option value="online">Online / UPI / POS</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold text-xs rounded-xl shadow-lg hover:brightness-110 uppercase tracking-wider mt-2"
                >
                  Generate Credentials & Enroll Member
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Side Drawer: Manage Member ── */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-neutral-900 border-l border-white/10 h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="font-serif font-bold text-white text-base">{selectedUser.profile?.fullName}</h3>
                <span className="text-xs text-amber-400 font-mono">{selectedUser.username}</span>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-white/40 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Status Control */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-white/60">Account Status</label>
              <select
                value={selectedUser.status}
                onChange={(e) => handleStatusChange(selectedUser._id, e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white"
              >
                <option value="pending_profile">Pending Profile</option>
                <option value="pending_verification">Pending Verification</option>
                <option value="verified">Verified (Active)</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            {/* Tier Control */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-white/60">Access Tier</label>
              <select
                value={selectedUser.tier}
                onChange={(e) => handleTierChange(selectedUser._id, e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white"
              >
                <option value="basic">Basic (Standard)</option>
                <option value="premium">Premium (Featured & Priority)</option>
              </select>
            </div>

            {/* Contact Visibility Toggle */}
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
              <div>
                <span className="text-xs font-bold text-white block">Contact Info Visibility</span>
                <span className="text-[10px] text-white/40">Reveal mobile to mutual matches</span>
              </div>
              <input
                type="checkbox"
                checked={selectedUser.profile?.isContactVisible || false}
                onChange={(e) => handleToggleContact(selectedUser._id, e.target.checked)}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Password Reset */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <button
                onClick={() => handleResetPassword(selectedUser._id)}
                className="w-full py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <KeyRound size={14} />
                <span>Regenerate Temp Password</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(MemberManagementSection);
