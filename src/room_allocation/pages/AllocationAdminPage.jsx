/**
 * AllocationAdminPage.jsx
 *
 * Admin control panel for the room allocation cycle:
 *   • FROM hostel + date picker
 *   • Room pool configurator (multi-hostel, per-room selection)
 *   • Rank / CGPA upload panel
 *   • Hostels status table
 *
 * Data layer:
 *   - useQuery(adminKeys.hostels())  → hostel list for selectors + status table
 *   - RoomPoolConfigurator manages its own queries internally
 */
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient.js';
import { adminKeys } from '../hooks/queryKeys.js';
import { getAdminHostels } from '../api/admin.api.js';
import AllocationLayout from '../layouts/AllocationLayout';
import RankUpdatePanel from '../components/admin/RankUpdatePanel';
import RoomPoolConfigurator from '../components/admin/RoomPoolConfigurator';

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AllocationAdminPage() {
    const [fromHostelId, setFromHostelId]     = useState('');
    const [allocationDate, setAllocationDate] = useState('');
    const [poolSavedMsg, setPoolSavedMsg]     = useState('');

    // ── Hostels query ─────────────────────────────────────────────────────────
    const {
        data: hostels = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: adminKeys.hostels(),
        queryFn:  getAdminHostels,
        staleTime: 30_000,
    });

    // Seed initial selection once hostels load
    useEffect(() => {
        if (!fromHostelId && hostels.length) {
            setFromHostelId(hostels[0].id);
            setAllocationDate(hostels[0].allocation_date?.slice(0, 10) ?? '');
        }
    }, [hostels, fromHostelId]);

    // Sync date when admin changes the FROM hostel
    const fromHostel = useMemo(
        () => hostels.find(h => String(h.id) === String(fromHostelId)) ?? null,
        [hostels, fromHostelId]
    );
    useEffect(() => {
        if (fromHostel) {
            setAllocationDate(
                fromHostel.allocation_date ? String(fromHostel.allocation_date).slice(0, 10) : ''
            );
        }
    }, [fromHostel?.id]);

    const handlePoolSaved = (result) => {
        setPoolSavedMsg(
            `✓ Pool saved — ${result.poolSize} rooms · date set to ${allocationDate}`
        );
        // Refresh the hostel list so the table reflects the new allocation_date
        queryClient.invalidateQueries({ queryKey: adminKeys.hostels() });
    };

    const handleFromHostelChange = (id) => {
        setFromHostelId(id);
        setPoolSavedMsg('');
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <AllocationLayout phase="Admin" batch="Allocation Control">
            <div className="max-w-5xl mx-auto flex flex-col gap-5 pt-4">

                {/* Header */}
                <div className="bg-card border border-border rounded-xl shadow-sm p-5">
                    <h1 className="text-[20px] font-black text-text-primary tracking-tight">
                        Allocation Admin
                    </h1>
                    <p className="text-[12px] text-text-muted mt-1">
                        Configure the room pool, set the allocation date, and upload rank/CGPA data.
                    </p>
                </div>

                {/* FROM hostel + date + pool configurator */}
                <div className="bg-card border border-border rounded-xl shadow-sm p-5">
                    <h2 className="text-[13px] font-bold text-text-secondary tracking-[0.05em] mb-4">
                        ALLOCATION SCHEDULE
                    </h2>

                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <label className="flex-1 text-[12px] font-semibold text-text-secondary">
                            From Hostel
                            <span className="ml-1 font-normal text-text-muted">
                                (students participating)
                            </span>
                            <select
                                id="from-hostel-select"
                                className="mt-1 w-full border border-border rounded px-3 py-2
                                    bg-canvas text-text-primary"
                                value={fromHostelId}
                                onChange={(e) => handleFromHostelChange(e.target.value)}
                                disabled={isLoading}
                            >
                                {hostels.map(h => (
                                    <option key={h.id} value={h.id}>{h.name}</option>
                                ))}
                            </select>
                        </label>

                        <label className="text-[12px] font-semibold text-text-secondary">
                            Allocation Date
                            <span className="ml-1 font-normal text-text-muted">(Saturday)</span>
                            <input
                                type="date"
                                id="allocation-date-input"
                                className="mt-1 block border border-border rounded px-3 py-2
                                    bg-canvas text-text-primary"
                                value={allocationDate}
                                onChange={(e) => {
                                    setAllocationDate(e.target.value);
                                    setPoolSavedMsg('');
                                }}
                                disabled={isLoading}
                            />
                        </label>
                    </div>

                    {poolSavedMsg && (
                        <p className="text-[12px] font-semibold text-emerald-700 mb-3">
                            {poolSavedMsg}
                        </p>
                    )}
                    {error && (
                        <p className="text-[12px] font-semibold text-crimson mb-3">
                            {error.message}
                        </p>
                    )}

                    {/* Room Pool Configurator */}
                    <div className="border-t border-border pt-4">
                        <p className="text-[12px] font-bold text-text-secondary tracking-[0.05em] mb-3">
                            TO HOSTELS — ROOM POOL
                            <span className="ml-2 font-normal text-text-muted normal-case tracking-normal">
                                Select specific rooms from one or more hostels
                            </span>
                        </p>

                        {fromHostelId ? (
                            <RoomPoolConfigurator
                                fromHostelId={fromHostelId}
                                allocationDate={allocationDate}
                                onSaved={handlePoolSaved}
                            />
                        ) : (
                            <p className="text-[12px] text-text-muted italic">
                                Select a From Hostel first.
                            </p>
                        )}
                    </div>
                </div>

                {/* Rank + CGPA upload */}
                <RankUpdatePanel />

                {/* Hostels status table */}
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="px-4 py-3 border-b border-border text-[12px] font-bold
                        tracking-[0.06em] text-text-secondary">
                        HOSTELS
                    </div>

                    {isLoading ? (
                        <div className="p-4 text-[12px] text-text-muted animate-pulse">
                            Loading hostels…
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-[12px]">
                                <thead className="bg-canvas text-text-secondary">
                                    <tr>
                                        <th className="text-left px-4 py-2">Name</th>
                                        <th className="text-left px-4 py-2">Phase</th>
                                        <th className="text-left px-4 py-2">Allocation Date</th>
                                        <th className="text-left px-4 py-2">Lobby Opens At</th>
                                        <th className="text-left px-4 py-2">To Hostel (legacy)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hostels.map(h => {
                                        const toHostel = hostels.find(t => t.id === h.target_hostel_id);
                                        return (
                                            <tr key={h.id} className="border-t border-border">
                                                <td className="px-4 py-2 text-text-primary font-semibold">
                                                    {h.name}
                                                </td>
                                                <td className="px-4 py-2 text-text-secondary">
                                                    {h.current_phase}
                                                </td>
                                                <td className="px-4 py-2 text-text-secondary">
                                                    {h.allocation_date
                                                        ? String(h.allocation_date).slice(0, 10)
                                                        : '—'}
                                                </td>
                                                <td className="px-4 py-2 text-text-secondary">
                                                    {h.lobby_opens_at
                                                        ? new Date(h.lobby_opens_at).toLocaleString()
                                                        : '—'}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {toHostel ? (
                                                        <span className="inline-flex items-center gap-1
                                                            text-blue-700 font-semibold">
                                                            <span>{h.name}</span>
                                                            <span className="text-text-muted">→</span>
                                                            <span>{toHostel.name}</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-text-muted">—</span>
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