import { setupAxiosInterceptors } from "@/lib/axios/instance";
import authService from "@/services/auth.service";
import { IUser } from "@/types/User";
import { clearTokens, getToken, setTokens } from "@/utils/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAction: (user: IUser, accessToken: string, refreshToken: string) => Promise<void>;
  logoutAction: () => Promise<void>;
  initializeAction: () => Promise<void>;
  setUser: (user: IUser) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
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
        setupAxiosInterceptors(() => {
          get().logoutAction();
        });

        try {
          const token = await getToken("access");
          if (!token) {
            set({ isLoading: false, isAuthenticated: false });
            return;
          }

          const response = await authService.getProfile();
          const userData = response.data;

          if (!userData || !userData.role) {
            throw new Error("Invalid User Role from API");
          }

          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: any) {
          const isNetworkError = err.message === "Network Error" || err.code === "ERR_NETWORK";

          if (isNetworkError) {
            set({ isLoading: false });
          } else {
            console.warn("Init error, logging out:", err.message);
            get().logoutAction();
          }
        }
      },

      setUser: (user: IUser) => {
        set({ user });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
