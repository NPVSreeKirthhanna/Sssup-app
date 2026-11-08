import { WebRTCSignal } from '../types';

type EventCallback = (data: any) => void;

class RealtimeSyncManager {
  private channel: BroadcastChannel | null = null;
  private listeners: Map<string, Set<EventCallback>> = new Map();

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel('ssupp_realtime_channel');
      this.channel.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (type) {
          this.emitLocal(type, payload);
        }
      };
    }
  }

  public subscribe(eventType: string, callback: EventCallback): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);

    return () => {
      const set = this.listeners.get(eventType);
      if (set) {
        set.delete(callback);
      }
    };
  }

  public broadcast(eventType: string, payload: any): void {
    // 1. Emit locally in current tab
    this.emitLocal(eventType, payload);

    // 2. Broadcast to other tabs/windows
    if (this.channel) {
      try {
        this.channel.postMessage({ type: eventType, payload });
      } catch (e) {
        console.warn('BroadcastChannel error:', e);
      }
    }
  }

  private emitLocal(eventType: string, payload: any): void {
    const set = this.listeners.get(eventType);
    if (set) {
      set.forEach((cb) => cb(payload));
    }
  }

  // WebRTC Signal Broadcasting
  public sendWebRTCSignal(signal: WebRTCSignal): void {
    this.broadcast('webrtc_signal', signal);
  }
}

export const realtimeSync = new RealtimeSyncManager();
