/**
 * hooks/useLiveRooms.js — Live room map during LIVE_BATCHES phase
 *
 * Fetches rooms from GET /allocation/rooms/:hostelId.
 * Subscribes to ROOM_MAP_UPDATED socket event to update occupancy in real time
 * without a full refetch (one room at a time).
 *
 * @param {string|null} hostelId — required to fetch rooms
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

  // Initial load
  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  // Real-time: ROOM_MAP_UPDATED carries updated room(s)
  // Payload: { hostelId, rooms?: Room[], roomId?: string, occupied?: number }
  useEffect(() => {
    const onRoomUpdate = (payload) => {
      if (payload.hostelId && payload.hostelId !== hostelId) return; // different hostel

      if (payload.rooms) {
        // Full refresh pushed by backend
        setRooms(payload.rooms);
        return;
      }

      if (payload.roomId != null && payload.occupied != null) {
        // Lightweight single-room update (partial fill after allocation)
        setRooms((prev) =>
          prev.map((r) =>
            r.id === payload.roomId
              ? { ...r, occupied: payload.occupied }
              : r
          )
        );
      }
    };

    allocationSocket.on(WS_EVENTS.ROOM_MAP_UPDATED, onRoomUpdate);
    // Also re-fetch after each round executes (room state is fully settled)
    allocationSocket.on(WS_EVENTS.ROUND_EXECUTED, () => fetchRooms());

    return () => {
      allocationSocket.off(WS_EVENTS.ROOM_MAP_UPDATED, onRoomUpdate);
      allocationSocket.off(WS_EVENTS.ROUND_EXECUTED,   fetchRooms);
    };
  }, [hostelId, fetchRooms]);

  /** Manual occupancy update — kept for backward compatibility. */
  const updateRoomOccupancy = useCallback((roomId, occupied) => {
    setRooms((prev) =>
      prev.map((r) => r.id === roomId ? { ...r, occupied } : r)
    );
  }, []);

  return { rooms, loading, error, updateRoomOccupancy, refresh: fetchRooms };
}
