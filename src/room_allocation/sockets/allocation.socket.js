/**
 * sockets/allocation.socket.js — Socket.IO singleton
 *
 * Architecture rules:
 *   - connect() is called ONCE by AllocationLayout on mount.
 *   - disconnect() is called ONCE by AllocationLayout on unmount.
 *   - joinHostel(hostelId) is called whenever the active hostel changes.
 *   - Individual hooks ONLY call .on() / .off() — never connect/disconnect.
 *
 * This avoids all three React lifecycle bugs:
 *   1. Strict Mode remount: only the Layout unmounts/remounts, not every hook.
 *   2. Listener accumulation: hooks register named handlers and clean them up.
 *   3. Multi-room: joinHostel() explicitly leaves the old room and joins the new one.
 */

import { io } from 'socket.io-client';
import { WS_EVENTS } from './events.js';

// Matches hostel_backend port (5000). Override with VITE_WS_URL if needed.
const WS_URL = import.meta.env.VITE_WS_URL ?? 'http://localhost:5000';

class AllocationSocket {
    constructor() {
        this._socket = io(WS_URL, {
            transports:          ['websocket', 'polling'],
            reconnectionAttempts: 10,
            reconnectionDelay:    2000,
            autoConnect:          false // Wait for AllocationLayout to connect
        });
        this._hostelId  = null;

        this._socket.on('connect', () => {
            console.info('[AllocationSocket] Connected:', this._socket.id);
            // Rejoin the hostel room after reconnection
            if (this._hostelId) {
                this._socket.emit('join_hostel', { hostelId: this._hostelId });
            }
        });

        this._socket.on('connect_error', (err) => {
            // Log but never throw — socket errors must not crash the app
            console.warn('[AllocationSocket] Connection error:', err.message);
        });

        this._socket.on('disconnect', (reason) => {
            console.info('[AllocationSocket] Disconnected:', reason);
        });
    }

    // ── Lifecycle (called by AllocationLayout only) ───────────────

    /**
     * Connect to the backend Socket.IO server.
     * Safe to call once on layout mount. Does nothing if already connected.
     */
    connect() {
        if (!this._socket.connected) {
            this._socket.connect();
        }
        return this;
    }

    /**
     * Switch to a different hostel room.
     * Leaves the previous room, joins the new one.
     * Safe to call even before the socket is fully connected —
     * the 'connect' handler above will emit join_hostel on reconnect.
     */
    joinHostel(hostelId) {
        if (hostelId === this._hostelId) return this; // no-op

        // Leave previous room
        if (this._hostelId && this._socket?.connected) {
            this._socket.emit('leave_hostel', { hostelId: this._hostelId });
        }

        this._hostelId = hostelId;

        // Join new room (or queue for reconnect handler)
        if (this._socket?.connected && hostelId) {
            this._socket.emit('join_hostel', { hostelId });
        }

        return this;
    }

    /**
     * Disconnect cleanly. Called only by AllocationLayout on unmount.
     */
    disconnect() {
        if (this._socket && this._socket.connected) {
            this._socket.disconnect();
        }
    }

    // ── Event subscription (used by hooks) ───────────────────────

    /**
     * Subscribe to a backend event.
     * @param {string}   event   — one of WS_EVENTS
     * @param {function} handler — receives the payload
     * @returns cleanup function for useEffect return
     */
    on(event, handler) {
        this._socket?.on(event, handler);
        return () => this._socket?.off(event, handler);
    }

    /**
     * Unsubscribe a specific handler.
     */
    off(event, handler) {
        this._socket?.off(event, handler);
    }

    get isConnected() {
        return this._socket?.connected ?? false;
    }
}

// One instance shared across the entire allocation module
export const allocationSocket = new AllocationSocket();
export { WS_EVENTS };
