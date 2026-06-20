import { create } from "zustand";
import type { User, SidebarMenu } from "../types/Auth.types";
import { getMe } from "../api/me";

interface AuthState {
  user: User | null;
  sidebar: SidebarMenu[];
  isAuthenticated: boolean;
  isLoading: boolean;
  hasFetched: boolean;
  setAuth: (user: User, sidebar: SidebarMenu[]) => void;
  clearAuth: () => void;
  fetchMe: () => Promise<void>;
  resetFetch: () => void; // ← tambah
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  sidebar: [],
  isAuthenticated: false,
  isLoading: false,
  hasFetched: false,

  setAuth: (user, sidebar) =>
    set({ user, sidebar, isAuthenticated: true, isLoading: false, hasFetched: true }),

  clearAuth: () =>
    set({ user: null, sidebar: [], isAuthenticated: false, isLoading: false, hasFetched: true }),

  fetchMe: async () => {
    if (get().hasFetched) return;
    set({ isLoading: true });
    try {
      const { data } = await getMe();
      get().setAuth(data.user, data.sidebar);
    } catch {
      get().clearAuth();
    }
  },

  resetFetch: () => set({ hasFetched: false }),
}));