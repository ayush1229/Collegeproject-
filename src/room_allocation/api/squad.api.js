import { API_BASE_URL } from './config';

const BASE = `${API_BASE_URL}/api/groups`;

export const createSquad = async (name) => {
  try {
    const res = await fetch(`${BASE}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, primaryApplicantId: 3 }),
    });
    const data = await res.json();
    return data;
  } catch {
    return { success: false };
  }
};

export const leaveSquad = async () => {
  try {
    const res = await fetch(`${BASE}/leave`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: 3 }),
    });
    return await res.json();
  } catch {
    return { success: false };
  }
};

export const transferLeadership = async (memberId) => {
  try {
    const res = await fetch(`${BASE}/transfer-leadership`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentLeaderId: 3, newLeaderId: memberId }),
    });
    return await res.json();
  } catch {
    return { success: false };
  }
};

export const acceptInvite = async (inviteId) => {
  try {
    const res = await fetch(`${BASE}/accept-invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inviteId, studentId: 3 }),
    });
    return await res.json();
  } catch {
    return { success: false };
  }
};

export const rejectInvite = async (inviteId) => {
  try {
    const res = await fetch(`${BASE}/reject-invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inviteId }),
    });
    return await res.json();
  } catch {
    return { success: false };
  }
};

export const sendInvite = async (userId) => {
  try {
    const res = await fetch(`${BASE}/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromStudentId: 3, toStudentId: userId }),
    });
    return await res.json();
  } catch {
    return { success: false };
  }
};

export const removeMember = async (memberId) => {
  try {
    const res = await fetch(`${BASE}/remove-member`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leaderId: 3, memberId }),
    });
    return await res.json();
  } catch {
    return { success: false };
  }
};