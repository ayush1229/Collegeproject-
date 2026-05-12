const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

export const getAvailableRooms = async () => {
  await delay();
  return [
    { id: 'C-302', block: 'C', floor: 3, type: '4-Seater', total: 4, occupied: 2 },
    { id: 'C-312', block: 'C', floor: 3, type: '4-Seater', total: 4, occupied: 0 },
    { id: 'C-401', block: 'C', floor: 4, type: '2-Seater', total: 2, occupied: 1 },
    { id: 'B-118', block: 'B', floor: 1, type: '2-Seater', total: 2, occupied: 0 },
    { id: 'B-205', block: 'B', floor: 2, type: '4-Seater', total: 4, occupied: 3 },
    { id: 'B-302', block: 'B', floor: 3, type: '4-Seater', total: 4, occupied: 1 },
    { id: 'A-101', block: 'A', floor: 1, type: '2-Seater', total: 2, occupied: 2 },
    { id: 'A-201', block: 'A', floor: 2, type: '4-Seater', total: 4, occupied: 0 },
    { id: 'D-414', block: 'D', floor: 4, type: '4-Seater', total: 4, occupied: 2 },
    { id: 'D-301', block: 'D', floor: 3, type: '2-Seater', total: 2, occupied: 0 },
    { id: 'A-302', block: 'A', floor: 3, type: '4-Seater', total: 4, occupied: 4 },
    { id: 'B-410', block: 'B', floor: 4, type: '2-Seater', total: 2, occupied: 0 },
  ];
};

export const getRoomDetails  = async (id) => { await delay(); return { id }; };
export const getRoomOccupancy = async (id) => { await delay(); return { id, occupied: 2, total: 4 }; };
