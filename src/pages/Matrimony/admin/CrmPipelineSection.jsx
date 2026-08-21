import React, { useState, useEffect } from 'react';
import {
  PhoneCall, Calendar, Plus, X, Search, Clock,
  CheckCircle2, AlertCircle, ChevronRight, User
} from 'lucide-react';
import { CRM_STAGES } from '../../../lib/matrimony/constants';
import { matrimonyAdminService } from '../../../services/matrimonyAdminService';

const CrmPipelineSection = () => {
  const [leads, setLeads] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [leadTimeline, setLeadTimeline] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(false);

  // Modals
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);

  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Solapur',
    source: 'shop_visit',
    priority: 'medium',
    notes: '',
  });

  const [callForm, setCallForm] = useState({
    durationSeconds: 120,
    outcome: 'answered',
    notes: '',
  });

  const [followUpForm, setFollowUpForm] = useState({
    scheduledAt: '',
    nextAction: 'Follow-up call on subscription',
  });

  const fetchLeadsAndStats = async () => {
    setLoading(true);
    try {
      const [leadsData, statsData] = await Promise.all([
        matrimonyAdminService.listLeads(),
        matrimonyAdminService.getCrmDashboard(),
      ]);
      setLeads(leadsData || []);
      setDashboardStats(statsData);
    } catch (err) {
      console.error('Failed to load CRM data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadsAndStats();
  }, []);

  const handleOpenLeadDrawer = async (lead) => {
    setSelectedLead(lead);
    setTimelineLoading(true);
    try {
      const data = await matrimonyAdminService.getLeadTimeline(lead._id);
      setLeadTimeline(data.timeline || []);
    } catch (err) {
      console.error('Failed to load timeline', err);
    } finally {
      setTimelineLoading(false);
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    try {
      await matrimonyAdminService.createLead(leadForm);
      setShowAddLeadModal(false);
      fetchLeadsAndStats();
    } catch (err) {
      alert(err.message || 'Failed to create lead');
    }
  };

  const handleStageChange = async (leadId, newStage) => {
    try {
      await matrimonyAdminService.updateLead(leadId, { stage: newStage });
      fetchLeadsAndStats();
      if (selectedLead && selectedLead._id === leadId) {
        setSelectedLead(prev => ({ ...prev, stage: newStage }));
      }
    } catch (err) {
      alert(err.message || 'Failed to update stage');
    }
  };

  const handleLogCall = async (e) => {
    e.preventDefault();
    if (!selectedLead) return;
    try {
      await matrimonyAdminService.logCall(selectedLead._id, callForm);
      setShowCallModal(false);
      handleOpenLeadDrawer(selectedLead);
    } catch (err) {
      alert(err.message || 'Failed to log call');
    }
  };

  const handleScheduleFollowUp = async (e) => {
    e.preventDefault();
    if (!selectedLead) return;
    try {
      await matrimonyAdminService.scheduleFollowUp(selectedLead._id, followUpForm);
      setShowFollowUpModal(false);
      handleOpenLeadDrawer(selectedLead);
      fetchLeadsAndStats();
    } catch (err) {
      alert(err.message || 'Failed to schedule follow-up');
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header & Stats ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
        <div>
          <h3 className="text-lg font-serif font-bold text-white">Matrimony CRM & Sales Pipeline</h3>
          <p className="text-xs text-white/50">
            Conversion Rate: <strong className="text-emerald-400 font-mono">{dashboardStats?.conversionRate || '0%'}</strong> • Overdue Follow-ups: <strong className="text-rose-400 font-mono">{dashboardStats?.overdueCount || 0}</strong>
          </p>
        </div>

        <button
          onClick={() => setShowAddLeadModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-bold text-xs rounded-xl shadow-lg hover:brightness-110 flex items-center gap-1.5"
        >
          <Plus size={15} />
          <span>+ Add New Lead</span>
        </button>
      </div>

      {/* ── Kanban Board (5 Columns) ── */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {CRM_STAGES.map((st) => {
          const stageLeads = leads.filter(l => l.stage === st.id);
          return (
            <div
              key={st.id}
              className="bg-neutral-900/80 border border-white/10 rounded-2xl p-3 flex flex-col min-w-[220px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${st.color}`}>
                  {st.label}
                </span>
                <span className="text-xs font-mono font-bold text-white/50">{stageLeads.length}</span>
              </div>

              {/* Cards */}
              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[60vh]">
                {stageLeads.length === 0 ? (
                  <div className="p-4 text-center text-[11px] text-white/20">No leads in stage</div>
                ) : (
                  stageLeads.map((lead) => (
                    <div
                      key={lead._id}
                      onClick={() => handleOpenLeadDrawer(lead)}
                      className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-500/30 rounded-xl p-3 cursor-pointer transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-serif font-bold text-white truncate">{lead.name}</h4>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          lead.priority === 'high' ? 'bg-rose-500/20 text-rose-300' : 'text-white/40'
                        }`}>
                          {lead.priority}
                        </span>
                      </div>

                      <div className="text-[11px] text-white/60 flex items-center gap-1.5">
                        <PhoneCall size={11} className="text-amber-400" />
                        <span>{lead.phone}</span>
                      </div>

                      {lead.nextFollowUpAt && (
                        <div className="text-[10px] text-amber-400/80 flex items-center gap-1">
                          <Clock size={10} />
                          <span>Next: {new Date(lead.nextFollowUpAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Modal: Add New Lead ── */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-neutral-900 border border-emerald-500/40 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif font-bold text-white text-base">Add New CRM Lead</h3>
              <button onClick={() => setShowAddLeadModal(false)} className="text-white/40 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/60 mb-1">Lead / Candidate Name *</label>
                <input
                  type="text"
                  required
                  value={leadForm.name}
                  onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-white/60 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={leadForm.phone}
                  onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-white/60 mb-1">City</label>
                <input
                  type="text"
                  value={leadForm.city}
                  onChange={e => setLeadForm({ ...leadForm, city: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-white/60 mb-1">Notes / Astrological Preference</label>
                <textarea
                  value={leadForm.notes}
                  onChange={e => setLeadForm({ ...leadForm, notes: e.target.value })}
                  placeholder="Looking for Maratha bride, software engineer in Pune..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white h-20"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 text-black font-bold rounded-xl hover:brightness-110"
              >
                Save Lead to Pipeline
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Lead Detail Drawer ── */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-lg bg-neutral-900 border-l border-white/10 h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="font-serif font-bold text-white text-lg">{selectedLead.name}</h3>
                <p className="text-xs text-white/50">{selectedLead.phone} • {selectedLead.city}</p>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-white/40 hover:text-white"><X size={18} /></button>
            </div>

            {/* Stage Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs text-white/60">Pipeline Stage</label>
              <select
                value={selectedLead.stage}
                onChange={(e) => handleStageChange(selectedLead._id, e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white"
              >
                {CRM_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowCallModal(true)}
                className="py-2.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <PhoneCall size={14} /> Log Call
              </button>
              <button
                onClick={() => setShowFollowUpModal(true)}
                className="py-2.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Calendar size={14} /> Schedule Follow-up
              </button>
            </div>

            {/* Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-serif font-bold text-white/80 uppercase tracking-wider">History & Calls</h4>
              {timelineLoading ? (
                <div className="text-xs text-white/40">Loading history...</div>
              ) : leadTimeline.length === 0 ? (
                <div className="p-4 text-center text-xs text-white/30 bg-black/30 rounded-xl">No logs recorded yet.</div>
              ) : (
                <div className="space-y-2">
                  {leadTimeline.map((item) => (
                    <div key={item.id} className="p-3 bg-black/40 rounded-xl border border-white/5 text-xs space-y-1">
                      <div className="flex justify-between items-center text-white/40 text-[10px]">
                        <span className="uppercase font-bold text-amber-400">{item.type}</span>
                        <span>{new Date(item.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-white/80">{item.data.notes || item.data.nextAction || item.data.outcome}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Log Call */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-neutral-900 border border-white/10 rounded-2xl p-5 space-y-3 text-xs">
            <h4 className="font-bold text-white text-sm">Log Phone Call</h4>
            <form onSubmit={handleLogCall} className="space-y-3">
              <select
                value={callForm.outcome}
                onChange={e => setCallForm({ ...callForm, outcome: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white"
              >
                <option value="answered">Answered / Discussed</option>
                <option value="no_answer">No Answer</option>
                <option value="busy">Busy</option>
                <option value="wrong_number">Wrong Number</option>
              </select>
              <textarea
                value={callForm.notes}
                onChange={e => setCallForm({ ...callForm, notes: e.target.value })}
                placeholder="Call notes..."
                className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white h-20"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowCallModal(false)} type="button" className="px-3 py-1.5 bg-white/5 rounded-lg text-white">Cancel</button>
                <button type="submit" className="px-3 py-1.5 bg-amber-500 text-black font-bold rounded-lg">Save Call</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Schedule Follow-up */}
      {showFollowUpModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-neutral-900 border border-white/10 rounded-2xl p-5 space-y-3 text-xs">
            <h4 className="font-bold text-white text-sm">Schedule Follow-up Task</h4>
            <form onSubmit={handleScheduleFollowUp} className="space-y-3">
              <div>
                <label className="block text-white/60 mb-1">Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={followUpForm.scheduledAt}
                  onChange={e => setFollowUpForm({ ...followUpForm, scheduledAt: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white"
                />
              </div>
              <input
                type="text"
                value={followUpForm.nextAction}
                onChange={e => setFollowUpForm({ ...followUpForm, nextAction: e.target.value })}
                placeholder="Next action description..."
                className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowFollowUpModal(false)} type="button" className="px-3 py-1.5 bg-white/5 rounded-lg text-white">Cancel</button>
                <button type="submit" className="px-3 py-1.5 bg-purple-500 text-white font-bold rounded-lg">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(CrmPipelineSection);
