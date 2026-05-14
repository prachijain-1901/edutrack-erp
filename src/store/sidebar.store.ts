import { create } from "zustand";

// ─────────────────────────────────────────────
// Sidebar Store
// ─────────────────────────────────────────────

interface SidebarStore {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
  openMobile: () => void;
  closeMobile: () => void;
  toggleMobile: () => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  isCollapsed: false,
  isMobileOpen: false,
  toggleCollapsed: () =>
    set((state) => ({ isCollapsed: !state.isCollapsed })),
  setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
  openMobile: () => set({ isMobileOpen: true }),
  closeMobile: () => set({ isMobileOpen: false }),
  toggleMobile: () =>
    set((state) => ({ isMobileOpen: !state.isMobileOpen })),
}));
