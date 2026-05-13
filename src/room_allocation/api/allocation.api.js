/* Pure HTTP stubs — replace with real axios/fetch calls when backend is ready */

const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

/** Returns the user's current allocation state */
export const getAllocationState = async () => {
  await delay();
  return {
    phase: 'LOBBY',
    hasSquad: true,
    isLeader: true,
    batchActive: false,
    isAllocated: false,
    isPenalized: false,
    waitingForBatch: false,
    submitted: false,
  };
};

export const getCurrentBatch = async () => {
  await delay();
  return { batchId: 'Batch #12', eta: 1413, rank: 1, rollover: true };
};

export const submitPreferences = async (roomIds) => {
  await delay(800);
  return { success: true, submittedAt: new Date().toISOString(), rooms: roomIds };
};

export const getAllocationHistory = async () => {
  await delay();
  return [
    { batchId: 'Batch #08', round: null, result: 'ROLLOVER',  room: null,   ts: '2026-05-10T22:15:00Z' },
    { batchId: 'Batch #10', round: 2,    result: 'MISSED',    room: null,   ts: '2026-05-11T01:30:00Z' },
    { batchId: 'Batch #12', round: 1,    result: 'ALLOCATED', room: 'C-312',ts: '2026-05-11T23:34:00Z' },
  ];
};
