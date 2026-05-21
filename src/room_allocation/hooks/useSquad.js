/**
 * hooks/useSquad.js — Squad state + all squad mutations
 *
 * Provides live squad data and action callbacks to any component.
 *
 * @param {string|null} studentId — current logged-in student's ID
 *
 * Returns:
 *   squad        — { groupId, status, isLeader, leaderId, members[] }
 *   loading      — boolean
 *   error        — Error | null
 *   pendingIn    — incoming requests/invites (for Invite Inbox)
 *   pendingOut   — sent invites still awaiting response
 *   publicGroups — all open groups for Browse Squads panel
 *   actions      — { createSquad, leaveSquad, transferLeadership, sendInvite,
 *                    acceptInvite, rejectInvite, refresh }
 */
import { useState, useEffect, useCallback } from 'react';
import {
  createSquad as apiCreate,
  leaveSquad as apiLeave,
  transferLeadership as apiTransfer,
  sendInvite as apiSendInvite,
  acceptInvite as apiAccept,
  rejectInvite as apiReject,
  getPendingRequests,
  getGroupMembers,
  getAllGroups,
} from '../api/squad.api.js';
import { allocationSocket, WS_EVENTS } from '../sockets/allocation.socket.js';

const EMPTY_SQUAD = {
  groupId:  null,
  status:   null,
  isLeader: false,
  leaderId: null,
  members:  [],
};

export function useSquad(studentId, hostelId) {
  const [squad,        setSquad]        = useState(EMPTY_SQUAD);
  const [pendingIn,    setPendingIn]     = useState([]);  // incoming invites
  const [pendingOut,   setPendingOut]    = useState([]);  // sent invites
  const [publicGroups, setPublicGroups]  = useState([]);
  const [loading,      setLoading]       = useState(true);
  const [error,        setError]         = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────
  const refresh = useCallback(async () => {
    if (!studentId) { setLoading(false); return; }
    try {
      setError(null);

      // Pending requests (both IN and OUT for this student/group)
      const reqsData  = await getPendingRequests().catch(() => ({ requests: [] }));
      const reqs      = reqsData.requests ?? reqsData ?? [];

      const incoming  = reqs.filter((r) =>
        r.request_type === 'INVITE_FROM_PRIMARY'
          ? r.student_id === studentId          // student received invite
          : r.group_id  && r.student_id === studentId // application I made
      );
      const outgoing  = reqs.filter((r) =>
        r.request_type === 'INVITE_FROM_PRIMARY' && r.primary_applicant_id === studentId
      );

      setPendingIn(incoming.map((r) => ({
        id:   r.id,
        name: r.sender_name ?? `Student ${r.student_id}`,
        meta: r.sender_cgpa ? `CGPA: ${r.sender_cgpa}` : '',
        abbr: r.sender_name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() ?? 'ST',
      })));
      setPendingOut(outgoing.map((r) => ({
        id:     r.id,
        name:   r.recipient_name ?? `Student ${r.student_id}`,
        status: r.status,
      })));

      // Public groups for browse
      const groupsData = await getAllGroups().catch(() => ({ groups: [] }));
      const groups     = groupsData.groups ?? groupsData ?? [];
      setPublicGroups(groups
        .filter((g) => g.status === 'FORMING' && g.member_count < 4)
        .map((g) => ({
          id:     g.id,
          name:   g.name ?? `Group ${g.id.slice(0, 6)}`,
          req:    g.min_cgpa ? `${g.min_cgpa}+` : 'Any',
          slots:  4 - (g.member_count ?? 1),
        }))
      );

      // Current student's group members (if they're in a group)
      // This is set separately by the parent or via getAllocationState;
      // here we just leave squad data to useAllocationState to inject.

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => { refresh(); }, [refresh]);

  // ── Real-time: phase change may affect squad state ──────────────
  useEffect(() => {
    const onPhase = () => refresh();
    allocationSocket.on(WS_EVENTS.PHASE_CHANGED, onPhase);
    allocationSocket.on(WS_EVENTS.EVALUATION_DONE, onPhase);
    return () => {
      allocationSocket.off(WS_EVENTS.PHASE_CHANGED, onPhase);
      allocationSocket.off(WS_EVENTS.EVALUATION_DONE, onPhase);
    };
  }, [refresh]);

  // ── Inject squad from external state (avoids duplicate fetches) ──
  const setSquadFromState = useCallback((allocationState) => {
    if (!allocationState) return;
    setSquad({
      groupId:  allocationState.groupId,
      status:   allocationState.groupStatus,
      isLeader: allocationState.isLeader,
      leaderId: null, // set if needed
      members:  [], // loaded separately via getGroupMembers
    });
  }, []);

  // ── Mutations ──────────────────────────────────────────────────
  const createSquad = useCallback(async () => {
    await apiCreate(studentId);
    await refresh();
  }, [studentId, refresh]);

  const leaveSquad = useCallback(async () => {
    await apiLeave(studentId);
    await refresh();
  }, [studentId, refresh]);

  const transferLeadership = useCallback(async (groupId, newLeaderId) => {
    await apiTransfer(groupId, newLeaderId);
    await refresh();
  }, [refresh]);

  const sendInvite = useCallback(async ({ groupId, targetStudentId, requestType }) => {
    await apiSendInvite({ groupId, studentId: targetStudentId, requestType });
    await refresh();
  }, [refresh]);

  const acceptInvite = useCallback(async (requestId) => {
    await apiAccept(requestId);
    await refresh();
  }, [refresh]);

  const rejectInvite = useCallback(async (requestId) => {
    await apiReject(requestId);
    await refresh();
  }, [refresh]);

  return {
    squad,
    pendingIn,
    pendingOut,
    publicGroups,
    loading,
    error,
    setSquadFromState,
    actions: {
      createSquad,
      leaveSquad,
      transferLeadership,
      sendInvite,
      acceptInvite,
      rejectInvite,
      refresh,
    },
  };
}
