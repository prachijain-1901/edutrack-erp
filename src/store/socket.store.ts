import { create } from "zustand";

interface SocketState {
  isConnected: boolean;
  lastEvent: any | null;
  setConnected: (connected: boolean) => void;
  setLastEvent: (event: any) => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  isConnected: false,
  lastEvent: null,
  setConnected: (connected) => set({ isConnected: connected }),
  setLastEvent: (event) => set({ lastEvent: event }),
}));
