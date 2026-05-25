import { useEffect, useMemo, useState } from 'react';
import AllocationLayout from '../layouts/AllocationLayout';

const API_BASE = 'http://localhost:5000/api/admin';

export default function AllocationAdminPage() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedHostelId, setSelectedHostelId] = useState('');
  const [allocationDate, setAllocationDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const selectedHostel = useMemo(
    () => hostels.find((h) => String(h.id) === String(selectedHostelId)) ?? null,
    [hostels, selectedHostelId]
  );

  const loadHostels = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/hostels`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message ?? 'Failed to fetch hostels');
      }

      setHostels(data.hostels ?? []);
      if (!selectedHostelId && data.hostels?.length) {
        setSelectedHostelId(data.hostels[0].id);
        setAllocationDate(data.hostels[0].allocation_date?.slice(0, 10) ?? '');
      }
    } catch (err) {
      setError(err.message ?? 'Failed to load hostels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHostels();
  }, []);

  useEffect(() => {
    if (selectedHostel?.allocation_date) {
      setAllocationDate(String(selectedHostel.allocation_date).slice(0, 10));
    } else {
      setAllocationDate('');
    }
  }, [selectedHostel?.id]);

  const handleSetDate = async (e) => {
    e.preventDefault();
    if (!selectedHostelId || !allocationDate) return;

    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch(`${API_BASE}/set-allocation-date`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostelId: selectedHostelId, allocationDate }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message ?? 'Failed to set allocation date');
      }

      setMessage(`Allocation date updated for ${data.hostel?.name ?? 'hostel'}.`);
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
        <div className="bg-card border border-border rounded-xl shadow-sm p-5">
          <h1 className="text-[20px] font-black text-text-primary tracking-tight">Allocation Admin</h1>
          <p className="text-[12px] text-text-muted mt-1">Public page: view hostels and set allocation date without authentication.</p>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm p-5">
          <form className="flex flex-col md:flex-row md:items-end gap-4" onSubmit={handleSetDate}>
            <label className="flex-1 text-[12px] font-semibold text-text-secondary">
              Hostel
              <select
                className="mt-1 w-full border border-border rounded px-3 py-2 bg-canvas text-text-primary"
                value={selectedHostelId}
                onChange={(e) => setSelectedHostelId(e.target.value)}
                disabled={loading || saving}
              >
                {hostels.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-[12px] font-semibold text-text-secondary">
              Allocation Date (Saturday)
              <input
                type="date"
                className="mt-1 border border-border rounded px-3 py-2 bg-canvas text-text-primary"
                value={allocationDate}
                onChange={(e) => setAllocationDate(e.target.value)}
                disabled={loading || saving}
                required
              />
            </label>

            <button
              type="submit"
              disabled={saving || !selectedHostelId || !allocationDate}
              className="px-4 py-2 rounded bg-crimson text-white text-[12px] font-bold tracking-[0.06em] disabled:opacity-50"
            >
              {saving ? 'SAVING...' : 'SET DATE'}
            </button>
          </form>

          {message && <p className="mt-3 text-[12px] font-semibold text-emerald-700">{message}</p>}
          {error && <p className="mt-3 text-[12px] font-semibold text-crimson">{error}</p>}
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-border text-[12px] font-bold tracking-[0.06em] text-text-secondary">HOSTELS</div>
          {loading ? (
            <div className="p-4 text-[12px] text-text-muted">Loading hostels...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead className="bg-canvas text-text-secondary">
                  <tr>
                    <th className="text-left px-4 py-2">Name</th>
                    <th className="text-left px-4 py-2">Phase</th>
                    <th className="text-left px-4 py-2">Allocation Date</th>
                    <th className="text-left px-4 py-2">Lobby Opens At</th>
                  </tr>
                </thead>
                <tbody>
                  {hostels.map((h) => (
                    <tr key={h.id} className="border-t border-border">
                      <td className="px-4 py-2 text-text-primary font-semibold">{h.name}</td>
                      <td className="px-4 py-2 text-text-secondary">{h.current_phase}</td>
                      <td className="px-4 py-2 text-text-secondary">{h.allocation_date ? String(h.allocation_date).slice(0, 10) : '-'}</td>
                      <td className="px-4 py-2 text-text-secondary">{h.lobby_opens_at ? new Date(h.lobby_opens_at).toLocaleString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AllocationLayout>
  );
}