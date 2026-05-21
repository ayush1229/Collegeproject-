/**
 * api/room.api.js — Room data REST calls
 *
 * Backend shape:  { id, room_number, max_capacity, current_occupancy, hostel_id, room_type }
 * Frontend shape: { id, block, floor, type, total, occupied }
 *
 * The normaliseRoom() adapter bridges the two.
 */
import client from './client.js';

/**
 * Parse block and floor from room_number, e.g. "C-302" → block:"C", floor:3.
 * Falls back gracefully for non-standard formats.
 */
function normaliseRoom(r) {
  const parts = (r.room_number ?? r.id ?? '').split('-');
  const block  = parts[0] ?? '?';
  const num    = parts[1] ?? '';
  const floor  = num.length >= 1 ? parseInt(num[0], 10) : 0;

  return {
    id:       r.id,
    roomNo:   r.room_number,
    block,
    floor,
    type:     r.max_capacity === 4 ? '4-Seater'
            : r.max_capacity === 3 ? '3-Seater'
            : r.max_capacity === 2 ? '2-Seater'
            :                        '1-Seater',
    total:    r.max_capacity,
    occupied: r.current_occupancy,
  };
}

/**
 * Fetch the live room map for a hostel (available rooms only).
 * Called by useLiveRooms during LIVE_BATCHES phase.
 */
export const getAvailableRooms = async (hostelId) => {
  const data = await client.get(`/allocation/rooms/${hostelId}`);
  // Backend wraps: { success, rooms: [...] }
  const rooms = data.rooms ?? data ?? [];
  return rooms.map(normaliseRoom);
};

/** Get full details of one room. */
export const getRoomDetails = async (id) => {
  const data = await client.get(`/rooms/${id}`);
  return normaliseRoom(data.room ?? data);
};

/** Get occupancy for one room (lightweight). */
export const getRoomOccupancy = async (id) => {
  const data = await client.get(`/rooms/${id}`);
  const r = data.room ?? data;
  return { id, occupied: r.current_occupancy, total: r.max_capacity };
};
