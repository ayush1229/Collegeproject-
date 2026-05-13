const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

export const getFinalAllocation = async () => {
  await delay();
  return {
    status: 'ALLOCATED', // ALLOCATED | ROLLOVER | PENDING_MIGRATION
    room: { id: 'C-312', block: 'C', floor: 3, type: '4-Seater', hostel: 'Block C Hostel' },
    method: 'Preference Match',
    round: 1,
    batch: 'Batch #12',
    allocatedAt: '2026-05-11T23:34:00Z',
    roommates: [
      { id: 2, name: 'Arjun Sharma', cgpa: 9.20, batch: 'BT-2024', initials: 'AS' },
      { id: 3, name: 'Priya Mehta',  cgpa: 8.75, batch: 'BT-2024', initials: 'PM' },
      { id: 4, name: 'Rohan Das',    cgpa: 9.10, batch: 'BT-2024', initials: 'RD' },
    ],
    moveInWindow: { start: '2026-05-15', end: '2026-05-20' },
  };
};

export const downloadAllotmentLetter = async () => {
  await delay(500);
  return { url: '#' };
};
