/**
 * api/admin.api.js — Admin allocation pool REST calls
 *
 * All functions use the shared client (auth headers, error throwing)
 * and return plain JS values ready for TanStack Query.
 */
import client from './client.js';

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Fetch all hostels (admin view — name, phase, dates).
 * Used by AllocationAdminPage to populate the From-Hostel selector
 * and the status table.
 */
export const getAdminHostels = async () => {
    const data = await client.get('/admin/hostels');
    return data.hostels ?? [];
};

/**
 * Fetch all hostels with their rooms, grouped for the pool configurator.
 * Returns: [{ id, name, type, rooms: [{ id, room_number, block, ... }] }]
 */
export const getHostelsWithRooms = async () => {
    const data = await client.get('/admin/hostels-with-rooms');
    return data.hostels ?? [];
};

/**
 * Fetch the current room pool for a FROM hostel.
 * Returns: { fromHostelId, totalRooms, hostels: [{ hostelId, hostelName, rooms: [] }] }
 */
export const getAllocationPool = async (fromHostelId) => {
    if (!fromHostelId) return { fromHostelId, totalRooms: 0, hostels: [] };
    const data = await client.get(`/admin/allocation-pool/${fromHostelId}`);
    return data;
};

// ─── Mutations ────────────────────────────────────────────────────────────────

/**
 * Save (replace) the room pool for a FROM hostel.
 *
 * @param {{ fromHostelId, allocationDate, hostels: [{ hostelId, rooms: string[]|'ALL' }] }} payload
 */
export const setAllocationPool = async (payload) => {
    const data = await client.post('/admin/set-allocation-pool', payload);
    return data;
};
