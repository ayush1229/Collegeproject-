const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

export const createSquad = async (name) => { await delay(); return { id: 's1', name }; };
export const leaveSquad  = async ()     => { await delay(); return { success: true };  };
export const transferLeadership = async (memberId) => { await delay(); return { newLeaderId: memberId }; };
export const acceptInvite = async (inviteId) => { await delay(); return { success: true, inviteId }; };
export const rejectInvite = async (inviteId) => { await delay(); return { success: true, inviteId }; };
export const sendInvite   = async (userId)   => { await delay(); return { success: true, userId };   };
export const removeMember = async (memberId) => { await delay(); return { success: true, memberId }; };
