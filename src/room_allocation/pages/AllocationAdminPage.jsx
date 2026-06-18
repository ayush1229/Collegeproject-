import { useEffect, useMemo, useState } from 'react';
import AllocationLayout from '../layouts/AllocationLayout';
import RankUpdatePanel from '../components/admin/RankUpdatePanel';

const API_BASE = 'http://localhost:5000/api/admin';

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AllocationAdminPage() {
  const [hostels, setHostels]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [fromHostelId, setFromHostelId] = useState('');
  const [toHostelId, setToHostelId]     = useState('');
  const [allocationDate, setAllocationDate] = useState('');
  const [saving, setSaving]             = useState(false);
  const [message, setMessage]           = useState('');

  const fromHostel = useMemo(
    () => hostels.find((h) => String(h.id) === String(fromHostelId)) ?? null,
    [hostels, fromHostelId]
  );

  const loadHostels = async () => {
    setLoading(true);
    setError('');
    try {
      const res  = await fetch(`${API_BASE}/hostels`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message ?? 'Failed to fetch hostels');
      const list = data.hostels ?? [];
      setHostels(list);
      if (!fromHostelId && list.length) {
        setFromHostelId(list[0].id);
        setToHostelId(list[0].target_hostel_id ?? list[0].id);
        setAllocationDate(list[0].allocation_date?.slice(0, 10) ?? '');
      }
    } catch (err) {
      setError(err.message ?? 'Failed to load hostels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadHostels(); }, []);

  useEffect(() => {
    if (fromHostel) {
      setAllocationDate(fromHostel.allocation_date ? String(fromHostel.allocation_date).slice(0, 10) : '');
      setToHostelId(fromHostel.target_hostel_id ?? fromHostel.id);
    }
  }, [fromHostel?.id]);

  const handleSetDate = async (e) => {
    e.preventDefault();
    if (!fromHostelId || !toHostelId || !allocationDate) return;
    setSaving(true); setMessage(''); setError('');
    try {
      const res = await fetch(`${API_BASE}/set-allocation-date`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromHostelId, toHostelId, allocationDate }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message ?? 'Failed to set allocation date');
      const fromName = data.fromHostel?.name ?? fromHostelId;
      const toName   = data.toHostel?.name   ?? toHostelId;
      setMessage(`Allocation date set for "${fromName}". Students will be allocated rooms in "${toName}".`);
      await loadHostels();
    } catch (err) {
      setError(err.message ?? 'Failed to set allocation date');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AllocationLayout phase="Admin" batch="Allocation Control">
      <div className="max-w-5xl mx-auto flex flex-col gap-5 pt-4">

        {/* Header */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-5">
          <h1 className="text-[20px] font-black text-text-primary tracking-tight">Allocation Admin</h1>
          <p className="text-[12px] text-text-muted mt-1">
            Set the allocation date, configure hostel mapping, and upload rank/CGPA data.
          </p>
        </div>

        {/* From/To + Date form */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-5">
          <h2 className="text-[13px] font-bold text-text-secondary tracking-[0.05em] mb-4">
            ALLOCATION SCHEDULE
          </h2>
          <form className="flex flex-col gap-4" onSubmit={handleSetDate}>
            <div className="flex flex-col md:flex-row gap-4">
              <label className="flex-1 text-[12px] font-semibold text-text-secondary">
                From Hostel <span className="ml-1 font-normal text-text-muted">(students participating)</span>
                <select
                  id="from-hostel-select"
                  className="mt-1 w-full border border-border rounded px-3 py-2 bg-canvas text-text-primary"
                  value={fromHostelId}
                  onChange={(e) => setFromHostelId(e.target.value)}
                  disabled={loading || saving}
                >
                  {hostels.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
              </label>

              <div className="hidden md:flex items-end pb-2 text-text-muted text-lg font-bold select-none">→</div>

              <label className="flex-1 text-[12px] font-semibold text-text-secondary">
                To Hostel <span className="ml-1 font-normal text-text-muted">(rooms that will be allocated)</span>
                <select
                  id="to-hostel-select"
                  className="mt-1 w-full border border-border rounded px-3 py-2 bg-canvas text-text-primary"
                  value={toHostelId}
                  onChange={(e) => setToHostelId(e.target.value)}
                  disabled={loading || saving}
                >
                  {hostels.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
              </label>
            </div>

            {fromHostelId && toHostelId && fromHostelId !== toHostelId && (
              <div className="text-[11px] bg-blue-50 border border-blue-200 text-blue-700 rounded px-3 py-2">
                Students of <strong>{hostels.find(h => h.id === fromHostelId)?.name}</strong> will see and be
                assigned rooms from <strong>{hostels.find(h => h.id === toHostelId)?.name}</strong>.
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <label className="text-[12px] font-semibold text-text-secondary">
                Allocation Date (Saturday)
                <input
                  type="date"
                  id="allocation-date-input"
                  className="mt-1 block border border-border rounded px-3 py-2 bg-canvas text-text-primary"
                  value={allocationDate}
                  onChange={(e) => setAllocationDate(e.target.value)}
                  disabled={loading || saving}
                  required
                />
              </label>
              <button
                type="submit"
                id="set-allocation-date-btn"
                disabled={saving || !fromHostelId || !toHostelId || !allocationDate}
                className="px-4 py-2 rounded bg-crimson text-white text-[12px] font-bold tracking-[0.06em] disabled:opacity-50"
              >
                {saving ? 'SAVING…' : 'SET DATE'}
              </button>
            </div>

            {message && <p className="text-[12px] font-semibold text-emerald-700">{message}</p>}
            {error   && <p className="text-[12px] font-semibold text-crimson">{error}</p>}
          </form>
        </div>

        {/* Rank + CGPA upload */}
        <RankUpdatePanel />

        {/* Hostels table */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-border text-[12px] font-bold tracking-[0.06em] text-text-secondary">HOSTELS</div>
          {loading ? (
            <div className="p-4 text-[12px] text-text-muted">Loading hostels…</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead className="bg-canvas text-text-secondary">
                  <tr>
                    <th className="text-left px-4 py-2">Name</th>
                    <th className="text-left px-4 py-2">Phase</th>
                    <th className="text-left px-4 py-2">Allocation Date</th>
                    <th className="text-left px-4 py-2">Lobby Opens At</th>
                    <th className="text-left px-4 py-2">Rooms From (To Hostel)</th>
                  </tr>
                </thead>
                <tbody>
                  {hostels.map((h) => {
                    const toHostel = hostels.find((t) => t.id === h.target_hostel_id);
                    return (
                      <tr key={h.id} className="border-t border-border">
                        <td className="px-4 py-2 text-text-primary font-semibold">{h.name}</td>
                        <td className="px-4 py-2 text-text-secondary">{h.current_phase}</td>
                        <td className="px-4 py-2 text-text-secondary">
                          {h.allocation_date ? String(h.allocation_date).slice(0, 10) : '-'}
                        </td>
                        <td className="px-4 py-2 text-text-secondary">
                          {h.lobby_opens_at ? new Date(h.lobby_opens_at).toLocaleString() : '-'}
                        </td>
                        <td className="px-4 py-2">
                          {toHostel ? (
                            <span className="inline-flex items-center gap-1 text-blue-700 font-semibold">
                              <span>{h.name}</span>
                              <span className="text-text-muted">→</span>
                              <span>{toHostel.name}</span>
                            </span>
                          ) : (
                            <span className="text-text-muted">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AllocationLayout>
  );
}