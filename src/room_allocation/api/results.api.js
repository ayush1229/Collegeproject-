import { API_BASE_URL } from './config';

export const getFinalAllocation = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/allocation/status/3`);
    const data = await res.json();
    const result = data.result;

    return {
      status: result?.allotted ? 'ALLOCATED' : 'PENDING_MIGRATION',
      room: result?.room ? {
        id: result.room.room_number ?? result.room.id,
        block: result.room.room_number?.split('_')[0] ?? 'Block A',
        floor: 1,
        type: result.room.room_type ?? '3-Seater',
        hostel: result.room.hostel_id ?? 'Hostel Block',
      } : null,
      method: 'Preference Match',
      round: 1,
      batch: 'Batch #12',
      allocatedAt: new Date().toISOString(),
      roommates: [],
      moveInWindow: { start: '2026-05-15', end: '2026-05-20' },
    };
  } catch {
    return {
      status: 'PENDING_MIGRATION',
      room: null,
      method: 'Preference Match',
      round: 1,
      batch: 'Batch #12',
      allocatedAt: new Date().toISOString(),
      roommates: [],
      moveInWindow: { start: '2026-05-15', end: '2026-05-20' },
    };
  }
};

export const downloadAllotmentLetter = async () => {
  return { url: '#' };
};