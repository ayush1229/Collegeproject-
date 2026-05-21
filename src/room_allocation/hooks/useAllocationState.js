/**
 * hooks/useAllocationState.js — Student's current allocation state
 *
 * Fetches state from /allocation/status/:studentId and keeps it live
 * by listening to PHASE_CHANGED, BATCH_STARTED, EVALUATION_DONE socket events.
 *
 * @param {string|null} studentId
 */
import { useState, useEffect, useCallback } from 'react';
import { getAllocationState } from '../api/allocation.api.js';
import { allocationSocket, WS_EVENTS } from '../sockets/allocation.socket.js';

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

  // Re-fetch on any lifecycle event that changes phase or batch state
  useEffect(() => {
    const handlers = [
      WS_EVENTS.PHASE_CHANGED,
      WS_EVENTS.BATCH_STARTED,
      WS_EVENTS.BATCH_ENDED,
      WS_EVENTS.EVALUATION_DONE,
      WS_EVENTS.ROUND_CYCLE_DONE,
    ];
    const handler = () => fetch();
    handlers.forEach((evt) => allocationSocket.on(evt, handler));
    return () => handlers.forEach((evt) => allocationSocket.off(evt, handler));
  }, [fetch]);

  return { state, loading, error, refresh: fetch };
}
