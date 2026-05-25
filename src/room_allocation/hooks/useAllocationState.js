/**
 * hooks/useAllocationState.js — Student's current allocation state
 *
 * Fetches from /allocation/status/:studentId on mount,
 * then re-fetches whenever any lifecycle event fires.
 *
 * Does NOT call connect()/disconnect() — AllocationLayout owns the socket.
 *
 * @param {string|null} studentId
 */
import { useState, useEffect, useCallback } from 'react';
import { getAllocationState } from '../api/allocation.api.js';
import { allocationSocket, WS_EVENTS } from '../sockets/allocation.socket.js';

const REFETCH_EVENTS = [
    WS_EVENTS.PHASE_CHANGED,
    WS_EVENTS.BATCH_STARTED,
    WS_EVENTS.BATCH_ENDED,
    WS_EVENTS.EVALUATION_DONE,
    WS_EVENTS.ROUND_CYCLE_DONE,
];

export function useAllocationState(studentId) {
    const [state,   setState]   = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);

    const fetch = useCallback(async () => {
        if (!studentId) { setLoading(false); return; }
        try {
            setError(null);
            const s = await getAllocationState(studentId);
            setState(s);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [studentId]);

    // Initial load
    useEffect(() => { fetch(); }, [fetch]);

    // Re-fetch on any event that changes phase or batch state
    useEffect(() => {
        const cleanups = REFETCH_EVENTS.map((evt) => {
            const handler = (payload) => {
                if (evt === WS_EVENTS.PHASE_CHANGED) {
                    console.log(`[Frontend] Detected phase change via WebSocket! New Phase: ${payload.phase}`);
                    // Instantly update the UI based on the payload (Optimistic update)
                    setState(prev => {
                        if (!prev) return prev;
                        let newGroupStatus = prev.groupStatus;
                        if (payload.phase === 'SOFT_LOCK' && prev.hasSquad) newGroupStatus = 'SOFT_LOCKED';
                        else if (payload.phase === 'LIVE_BATCHES' && prev.hasSquad) newGroupStatus = 'HARD_LOCKED';
                        else if (payload.phase === 'LOBBY') newGroupStatus = 'FORMING';
                        
                        return { ...prev, phase: payload.phase, groupStatus: newGroupStatus };
                    });
                }
                // Still fetch in background to sync heavy data (e.g. batch numbers)
                fetch();
            };
            return allocationSocket.on(evt, handler);
        });
        return () => cleanups.forEach((cleanup) => cleanup());
    }, [fetch]);

    // Join the hostel WebSocket room as soon as we have a hostelId.
    // This ensures ALL pages receive live events without needing to thread
    // hostelId as a prop through AllocationLayout.
    useEffect(() => {
        if (state?.hostelId) {
            allocationSocket.joinHostel(state.hostelId);
        }
    }, [state?.hostelId]);

    return { state, loading, error, refresh: fetch };
}
