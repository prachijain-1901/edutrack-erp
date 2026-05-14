"use client";

import { create } from "zustand";
import type { StudentFilters } from "@/types";

// ─────────────────────────────────────────────
// Student Store
// ─────────────────────────────────────────────

interface StudentStore {
  // Selection
  selectedIds: Set<string>;
  toggleSelect: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  isSelected: (id: string) => boolean;

  // Filters
  filters: StudentFilters;
  setFilter: <K extends keyof StudentFilters>(key: K, value: StudentFilters[K]) => void;
  resetFilters: () => void;

  // UI State
  isFilterPanelOpen: boolean;
  toggleFilterPanel: () => void;
}

const DEFAULT_FILTERS: StudentFilters = {
  search: "",
  feeStatus: "all",
  isActive: "all",
  grade: "all",
  batchId: "all",
  attendanceBelow: null,
  sortBy: "name",
  sortOrder: "asc",
};

export const useStudentStore = create<StudentStore>((set, get) => ({
  // Selection state
  selectedIds: new Set(),
  toggleSelect: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { selectedIds: next };
    }),
  selectAll: (ids) => set({ selectedIds: new Set(ids) }),
  clearSelection: () => set({ selectedIds: new Set() }),
  isSelected: (id) => get().selectedIds.has(id),

  // Filters
  filters: DEFAULT_FILTERS,
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  // UI
  isFilterPanelOpen: false,
  toggleFilterPanel: () =>
    set((state) => ({ isFilterPanelOpen: !state.isFilterPanelOpen })),
}));
