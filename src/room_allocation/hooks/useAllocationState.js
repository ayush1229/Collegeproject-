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
        // Register a handler for each event, collect their cleanup functions
        const cleanups = REFETCH_EVENTS.map((evt) =>
            allocationSocket.on(evt, fetch)
        );
        return () => cleanups.forEach((cleanup) => cleanup());
    }, [fetch]);

    return { state, loading, error, refresh: fetch };
}
