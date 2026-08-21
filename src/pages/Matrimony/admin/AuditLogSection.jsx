import React, { useState, useEffect } from 'react';
import { FileText, Download, Filter, RefreshCw } from 'lucide-react';
import { matrimonyAdminService } from '../../../services/matrimonyAdminService';

const AuditLogSection = () => {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await matrimonyAdminService.getAuditLogs({
        page,
        limit: 25,
        action: actionFilter,
      });
      setLogs(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, actionFilter]);

  const handleExportCsv = () => {
    if (logs.length === 0) return;
    const headers = ['Timestamp', 'Action', 'TargetUser', 'Notes', 'IPAddress'];
    const rows = logs.map(l => [
      `"${new Date(l.timestamp).toLocaleString()}"`,
      `"${l.action || ''}"`,
      `"${l.targetUserId || ''}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      `"${l.ipAddress || ''}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Matrimony_Audit_Logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
        <div>
          <h3 className="text-lg font-serif font-bold text-white">Staff Action Audit Log</h3>
          <p className="text-xs text-white/50">Immutable trail of all admin and staff changes</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            disabled={logs.length === 0}
            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-30"
          >
            <Download size={13} />
            <span>Export to Excel</span>
          </button>
          <button
            onClick={fetchLogs}
            className="p-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl border border-white/10 transition-colors"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      <div className="bg-neutral-900/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-white/50 uppercase tracking-wider text-[10px]">
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Target Member</th>
                <th className="p-3.5">Notes / Detail</th>
                <th className="p-3.5">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-white/40">Loading audit log...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-white/40">No audit events recorded yet.</td></tr>
              ) : (
                logs.map((l) => (
                  <tr key={l._id} className="hover:bg-white/[0.02]">
                    <td className="p-3.5 text-white/60 font-mono text-[11px]">
                      {new Date(l.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded font-mono uppercase">
                        {l.action}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-white/80">{l.targetUserId || '-'}</td>
                    <td className="p-3.5 text-white/70 max-w-xs truncate">{l.notes || JSON.stringify(l.after || {})}</td>
                    <td className="p-3.5 text-white/40 font-mono text-[10px]">{l.ipAddress || '127.0.0.1'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AuditLogSection);
