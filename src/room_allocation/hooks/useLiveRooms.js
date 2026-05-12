import { useState, useEffect } from 'react';
import { getAvailableRooms } from '../api/room.api';

export function useLiveRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAvailableRooms()
      .then(setRooms)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  /** Simulate a room occupancy update (called by socket handler) */
  const updateRoomOccupancy = (roomId, occupied) => {
    setRooms(prev =>
      prev.map(r => r.id === roomId ? { ...r, occupied } : r)
    );
  };

  return { rooms, loading, error, updateRoomOccupancy };
}
