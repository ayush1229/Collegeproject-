import { WS_EVENTS } from '../constants/websocketEvents';

/** Stubbed websocket — replace URL and enable real events when backend is ready */
class AllocationSocket {
  constructor() { this._handlers = {}; this._ws = null; }

  connect(url = 'ws://localhost:8080/allocation') {
    console.info('[AllocationSocket] stub — not connecting to', url);
    return this;
  }

  on(event, handler) {
    if (!this._handlers[event]) this._handlers[event] = [];
    this._handlers[event].push(handler);
    return this;
  }

  off(event, handler) {
    if (!this._handlers[event]) return;
    this._handlers[event] = this._handlers[event].filter(h => h !== handler);
    return this;
  }

  /** Simulate server push — useful for manual testing */
  _emit(event, payload) {
    (this._handlers[event] || []).forEach(h => h(payload));
  }

  disconnect() {
    this._ws?.close();
    this._handlers = {};
  }
}

export const allocationSocket = new AllocationSocket();
export { WS_EVENTS };
