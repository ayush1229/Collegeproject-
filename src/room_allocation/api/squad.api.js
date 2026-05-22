/**
 * api/squad.api.js — Group/Squad REST calls
 *
 * Maps frontend "squad" terminology to backend "group" endpoints.
 * All functions return the unwrapped data (axios interceptor strips envelope).
 *
 * TODO: pass studentId / groupId from auth context once auth is wired.
 */
import client from './client.js';

/** Create a new squad. `leaderId` = current user's student ID. */
export const createSquad = (studentId) =>
  client.post('/groups/create', { leaderId: studentId });

/** Leave the current squad. */
export const leaveSquad = (studentId) =>
  client.post('/groups/leave', { studentId });

/**
 * Transfer leader title to another squad member.
 * Blocked by backend if group is SOFT_LOCKED/HARD_LOCKED.
 */
export const transferLeadership = (groupId, newLeaderId) =>
  client.post('/groups/transfer-leadership', { groupId, newLeaderId });

/** Kick a member from the group. */
export const kickMember = (groupId, leaderId, memberId) =>
  client.post('/groups/kick', { groupId, leaderId, memberId });

/**
 * Accept an incoming invite/request.
 * Works during LOBBY (and SOFT_LOCK if group has < 4 members).
 */
export const acceptInvite = (requestId) =>
  client.post('/groups/accept-invite', { requestId, status: 'ACCEPTED' });

/** Reject an incoming invite/request. */
export const rejectInvite = (requestId) =>
  client.post('/groups/accept-invite', { requestId, status: 'REJECTED' });

/**
 * Send an invite to a student (leader → student: INVITE_FROM_PRIMARY)
 * or a student applying to a group (APPLICATION_FROM_STUDENT).
 */
export const sendInvite = ({ groupId, studentId, requestType = 'INVITE_FROM_PRIMARY' }) =>
  client.post('/groups/invite', { groupId, studentId, requestType });

/** Get all pending group requests for a student or group. */
export const getPendingRequests = () =>
  client.get('/groups/requests');

/** Get the members of a specific group. */
export const getGroupMembers = (groupId) =>
  client.get(`/groups/${groupId}/members`);

/** Get all groups (used for browse/public squads view). */
export const getAllGroups = () =>
  client.get('/groups/');

// Search students by name or roll number (no cgpa/rank exposed)
export const searchStudents = (q) => {
  if (!q || q.length < 2) return Promise.resolve({ students: [] });
  return client.get(`/students/search?q=${encodeURIComponent(q)}`);
};

// Get group members with cgpa (for group members only)
export const getGroupMembersWithCgpa = (groupId) =>
  client.get(`/students/group-members/${groupId}`);

// Dev tool: Add bot to squad
export const addBotToSquad = (groupId) =>
  client.post(`/allocation/dev/add-bot`, { groupId });
