/**
 * api/squad.api.js — Group/Squad REST calls
 *
 * Maps frontend "squad" terminology to backend "group" endpoints.
 * All functions return the unwrapped data (axios interceptor strips envelope).
 *
 * TODO: pass studentId / groupId from auth context once auth is wired.
 */
import client from './client.js';

/** Create a new squad. `primaryApplicantId` = current user's student ID. */
export const createSquad = (primaryApplicantId) =>
  client.post('/groups/create', { primaryApplicantId });

/** Leave the current squad. */
export const leaveSquad = (studentId) =>
  client.post('/groups/leave', { studentId });

/**
 * Transfer leader title to another squad member.
 * Blocked by backend if group is SOFT_LOCKED/HARD_LOCKED.
 */
export const transferLeadership = (groupId, newLeaderId) =>
  client.post('/groups/transfer-leadership', { groupId, newLeaderId });

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
