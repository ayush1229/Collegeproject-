/**
 * sockets/events.js — Backend WebSocket event names
 *
 * Mirrors exactly: hostel_backend/src/roomallocation/websocket/emitter.js WS_EVENTS
 * Keep in sync with the backend when adding new events.
 */
export const WS_EVENTS = {
  // Batch lifecycle
  BATCH_STARTED:    'BATCH_STARTED',
  BATCH_ENDED:      'BATCH_ENDED',
  NEXT_BATCH_READY: 'NEXT_BATCH_READY',

  // Round lifecycle
  ROUND_OPENED:     'ROUND_OPENED',
  ROUND_FROZEN:     'ROUND_FROZEN',
  ROUND_EXECUTED:   'ROUND_EXECUTED',
  ROUND_CYCLE_DONE: 'ROUND_CYCLE_DONE',

  // Room map
  ROOM_MAP_UPDATED: 'ROOM_MAP_UPDATED',

  // Evaluation outcomes
  EVALUATION_DONE:  'EVALUATION_DONE',

  // Phase changes
  PHASE_CHANGED:    'PHASE_CHANGED',

  // System control
  SYSTEM_PAUSED:    'SYSTEM_PAUSED',
  SYSTEM_RESUMED:   'SYSTEM_RESUMED',
};
