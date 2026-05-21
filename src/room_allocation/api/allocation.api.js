/**
 * api/allocation.api.js — Allocation state and preference submission
 *
 * Backend: GET /allocation/status/:studentId
 * Returns: { phase, group, batch, submission, isAllocated, isPenalized, ... }
 *
 * Frontend useAllocationState expects:
 *   { phase, hasSquad, isLeader, batchActive, isAllocated, isPenalized,
 *     waitingForBatch, submitted, groupId, batchId, roundNumber, hostelId }
 */
import client from './client.js';

/**
 * Normalise the backend /allocation/status response into the shape
 * the frontend hooks expect.
 */
function normaliseStatus(raw) {
  const r = raw.result ?? raw;
  const phase = r.hostel_phase ?? 'LOBBY';

  return {
    // Phase (maps directly to backend system_phase_enum)
    phase,

    // Squad / group state
    hasSquad:       !!r.group_id,
    groupId:        r.group_id   ?? null,
    groupStatus:    r.group_status ?? null,
    isLeader:       r.is_leader  ?? false,

    // Batch state
    hostelId:       r.hostel_id  ?? null,
    batchId:        r.batch_id   ?? null,
    batchNumber:    r.batch_number ?? null,
    batchActive:    phase === 'LIVE_BATCHES',
    waitingForBatch: phase === 'SOFT_LOCK' || (phase === 'LIVE_BATCHES' && !r.batch_is_active),
    roundNumber:    r.current_round ?? null,

    // Submission state
    submitted:      r.submitted_this_round ?? false,
    isRollover:     r.is_rollover_priority ?? false,
    groupRank:      r.group_rank ?? null,

    // Outcome
    isAllocated:    r.is_allotted ?? false,
    isPenalized:    r.group_status === 'PENALIZED',
    allocatedRoomId: r.allocated_room_id ?? null,
  };
}

/** Get the current student's full allocation state. */
export const getAllocationState = async (studentId) => {
  if (!studentId) return null;
  const data = await client.get(`/allocation/status/${studentId}`);
  return normaliseStatus(data);
};

/** Alias used by some components. */
export const getCurrentBatch = async (studentId) => {
  const state = await getAllocationState(studentId);
  return {
    batchId:     state.batchId,
    batchNumber: state.batchNumber,
    rank:        state.groupRank,
    rollover:    state.isRollover,
    round:       state.roundNumber,
    hostelId:    state.hostelId,
  };
};

/**
 * Submit a ranked list of room preferences for the current round.
 *
 * @param {{ groupId, batchId, roundNumber, submittedBy, preferences: string[] }} payload
 *   preferences: ordered array of room UUIDs (max 10)
 */
export const submitPreferences = async (payload) => {
  const data = await client.post('/allocation/submit-preferences', payload);
  return data.result ?? data;
};

/** Get the submission history for a batch. */
export const getAllocationHistory = async (batchId) => {
  if (!batchId) return [];
  const data = await client.get(`/allocation/results/${batchId}`);
  const submissions = data.result?.submissions ?? [];
  return submissions.map((s) => ({
    batchId:  s.batch_id,
    round:    s.round_number,
    result:   s.allocation_result,
    room:     s.room_number ?? null,
    ts:       s.submitted_at,
  }));
};
