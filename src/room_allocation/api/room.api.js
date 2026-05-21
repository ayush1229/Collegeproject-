import { API_BASE_URL } from './config';

export const getAvailableRooms = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/preferences/rooms`);
    const data = await res.json();
    return data.rooms.map(room => ({
  id: room.id,
  roomNumber: room.room_number,  // ye add karo
  block: room.room_number?.split('_')[0] ?? 'N/A',
  floor: 1,
  type: room.room_type ?? '3-Seater',
  total: room.max_capacity,
  occupied: room.current_occupancy,
}));
  } catch {
    return [];
  }
};

export const getRoomDetails = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/preferences/rooms`);
    const data = await res.json();
    return data.rooms.find(r => r.id === id) ?? { id };
  } catch {
    return { id };
  }
};

export const getRoomOccupancy = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/preferences/rooms`);
    const data = await res.json();
    const room = data.rooms.find(r => r.id === id);
    return { id, occupied: room?.current_occupancy ?? 0, total: room?.max_capacity ?? 4 };
  } catch {
    return { id, occupied: 0, total: 4 };
  }
};