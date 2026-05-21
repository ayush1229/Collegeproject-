/**
 * hooks/useLiveRooms.js — Live room map, event-driven
 *
 * Fetches rooms from GET /allocation/rooms/:hostelId.
 *
 * When does it refetch?
 *   - On initial mount (or hostelId change)
 *   - When ROUND_OPENED fires — the new round just started, room inventory
 *     is now settled after the previous round's allocation ran
 *   - When ROOM_MAP_UPDATED fires — backend pushes a full or partial refresh
 *
 * NO polling. Rounds are 10 minutes apart. Polling every 30s would be
 * unnecessary load with zero UX benefit. The socket event is exact.
 *
 * @param {string|null} hostelId
 */
import { useState, useEffect, useCallback } from 'react';
import { getAvailableRooms } from '../api/room.api.js';
import { allocationSocket, WS_EVENTS } from '../sockets/allocation.socket.js';

export function useLiveRooms(hostelId) {
    const [rooms,   setRooms]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);

    const fetchRooms = useCallback(async () => {
        if (!hostelId) { setLoading(false); return; }
        try {
            setError(null);
            const data = await getAvailableRooms(hostelId);
            setRooms(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [hostelId]);

    // ── Initial load ──────────────────────────────────────────────
    useEffect(() => { fetchRooms(); }, [fetchRooms]);

    // ── Event-driven refresh ──────────────────────────────────────
    useEffect(() => {
        // ROUND_OPENED: new round started — previous round's allocation
        // has completed, room inventory is fully settled. Refetch.
        const cleanupRoundOpened = allocationSocket.on(
            WS_EVENTS.ROUND_OPENED,
            () => fetchRooms()
        );

        // ROOM_MAP_UPDATED: backend can push either a full room list
        // or a single room's occupancy change (partial fill rule).
        const cleanupRoomUpdate = allocationSocket.on(
            WS_EVENTS.ROOM_MAP_UPDATED,
            (payload) => {
                if (payload.hostelId && payload.hostelId !== hostelId) return;

                if (payload.rooms) {
                    // Full map refresh
                    setRooms(payload.rooms);
                } else if (payload.roomId != null && payload.occupied != null) {
                    // Single-room occupancy update
                    setRooms((prev) =>
                        prev.map((r) =>
                            r.id === payload.roomId ? { ...r, occupied: payload.occupied } : r
                        )
                    );
                }
            }
        );

        // allocationSocket.on() returns a cleanup function directly
        return () => {
            cleanupRoundOpened();
            cleanupRoomUpdate();
        };
    }, [hostelId, fetchRooms]);

    /** Manual occupancy patch — kept for backward compatibility. */
    const updateRoomOccupancy = useCallback((roomId, occupied) => {
        setRooms((prev) =>
            prev.map((r) => r.id === roomId ? { ...r, occupied } : r)
        );
    }, []);

    return { rooms, loading, error, updateRoomOccupancy, refresh: fetchRooms };
}
