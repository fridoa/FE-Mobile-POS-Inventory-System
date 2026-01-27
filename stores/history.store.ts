import { create } from "zustand";

export type FilterType = "today" | "7days" | "month" | "custom" | "all" | "year";

interface HistoryFilters {
  type: FilterType;
  startDate?: string;
  endDate?: string;
  displayLabel: string;
}

interface HistoryState {
  filters: HistoryFilters;
  setFilters: (filters: HistoryFilters) => void;
  resetFilters: () => void;
}

const now = new Date();
const todayStr = now.toISOString().split("T")[0];

export const useHistoryStore = create<HistoryState>((set) => ({
  filters: {
    type: "today",
    startDate: todayStr,
    endDate: todayStr,
    displayLabel: "Hari Ini",
  },
  setFilters: (newFilters) => set({ filters: newFilters }),
  resetFilters: () =>
    set({
      filters: {
        type: "today",
        startDate: todayStr,
        endDate: todayStr,
        displayLabel: "Hari Ini",
      },
    }),
}));
