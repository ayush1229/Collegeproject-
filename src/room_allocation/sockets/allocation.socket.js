/**
 * sockets/allocation.socket.js — Real Socket.IO client
 *
 * Single shared socket instance for the entire room-allocation module.
 *
 * Usage:
 *   import { allocationSocket } from '../sockets/allocation.socket';
 *   allocationSocket.connect(hostelId);
 *   allocationSocket.on(WS_EVENTS.ROUND_OPENED, (payload) => { ... });
 *   allocationSocket.disconnect();
 *
 * The socket connects to the backend Socket.IO server and automatically
 * joins the hostel's room so it only receives events for that hostel.
 */
import { io } from 'socket.io-client';
import { WS_EVENTS } from './events.js';

const WS_URL = import.meta.env.VITE_WS_URL ?? 'http://localhost:5000';

class AllocationSocket {
  constructor() {
    this._socket = null;
    this._hostelId = null;
  }

  /**
   * Connect to the backend and join the hostel's socket room.
   * Idempotent — calling connect() twice does nothing.
   *
   * @param {string} hostelId — used as the Socket.IO room name
   */
  connect(hostelId) {
    if (this._socket?.connected) return this;
    this._hostelId = hostelId;

    this._socket = io(WS_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      // TODO: pass auth token once auth is implemented
      // auth: { token: getToken() },
    });

    this._socket.on('connect', () => {
      console.info(`[AllocationSocket] Connected — joining hostel room: ${hostelId}`);
      if (hostelId) {
        this._socket.emit('join_hostel', { hostelId });
      }
    });

    this._socket.on('connect_error', (err) => {
      console.warn('[AllocationSocket] Connection error:', err.message);
    });

    this._socket.on('disconnect', (reason) => {
      console.info('[AllocationSocket] Disconnected:', reason);
    });

    return this;
  }

  /**
   * Subscribe to a backend event.
   * @param {string} event — one of WS_EVENTS
   * @param {function} handler — receives the payload object
   */
  on(event, handler) {
    this._socket?.on(event, handler);
    return this;
  }

  /**
   * Unsubscribe from a backend event.
   */
  off(event, handler) {
    this._socket?.off(event, handler);
    return this;
  }

  /**
   * Cleanly disconnect and clear all listeners.
   * Call this on component unmount / page leave.
   */
  disconnect() {
    if (this._socket) {
      this._socket.removeAllListeners();
      this._socket.disconnect();
      this._socket = null;
    }
    this._hostelId = null;
  }

  get isConnected() {
    return this._socket?.connected ?? false;
  }
}

export const allocationSocket = new AllocationSocket();
export { WS_EVENTS };
