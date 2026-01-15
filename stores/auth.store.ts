import authService from "@/services/auth.service";
import { IUser } from "@/types/Auth";
import { clearTokens, getToken, setTokens } from "@/utils/auth";
import { create } from "zustand";

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAction: (user: IUser, accessToken: string, refreshToken: string) => Promise<void>;
  logoutAction: () => Promise<void>;
  initializeAction: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  loginAction: async (user, accessToken, refreshToken) => {
    await setTokens(accessToken, refreshToken);

    set({ user, isAuthenticated: true, isLoading: false });
  },

  logoutAction: async () => {
    await clearTokens();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  initializeAction: async () => {
    set({ isLoading: true });

    try {
      const token = await getToken("access");

      if (!token) {
        set({ user: null, isAuthenticated: false });
        return;
      }

      const response = await authService.getProfile();

      set({
        user: response.data,
        isAuthenticated: true,
      });
    } catch (err) {

      await clearTokens();
      set({ user: null, isAuthenticated: false, isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
