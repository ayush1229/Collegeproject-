/**
 * constants/websocketEvents.js
 *
 * Re-exports WS_EVENTS from sockets/events.js so existing imports
 * like `import { WS_EVENTS } from '../constants/websocketEvents'`
 * continue to work after the socket refactor.
 *
 * Single source of truth is sockets/events.js — do not add new events here.
 */
export { WS_EVENTS } from '../sockets/events.js';
