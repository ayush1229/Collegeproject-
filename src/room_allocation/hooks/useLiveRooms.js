/**
 * hooks/useLiveRooms.js - Live room map, event-driven
 */
import { useState, useEffect, useCallback } from 'react';
import { getAvailableRooms } from '../api/room.api.js';
import { allocationSocket, WS_EVENTS } from '../sockets/allocation.socket.js';

export function useLiveRooms(hostelId) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRooms = useCallback(async () => {
    if (!hostelId) {
      setRooms([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userStr = localStorage.getItem('user');
      const studentId = userStr ? JSON.parse(userStr).id : null;
      const data = await getAvailableRooms(hostelId, studentId);
      setRooms(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [hostelId]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    const cleanupRoundOpened = allocationSocket.on(WS_EVENTS.ROUND_OPENED, () => fetchRooms());

    const cleanupRoomUpdate = allocationSocket.on(WS_EVENTS.ROOM_MAP_UPDATED, (payload) => {
      if (payload.hostelId && String(payload.hostelId) !== String(hostelId)) return;
      fetchRooms();
    });

    return () => {
      cleanupRoundOpened();
      cleanupRoomUpdate();
    };
  }, [hostelId, fetchRooms]);

  const updateRoomOccupancy = useCallback((roomId, occupied) => {
    setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, occupied } : r)));
  }, []);

  return { rooms, loading, error, updateRoomOccupancy, refresh: fetchRooms };
}