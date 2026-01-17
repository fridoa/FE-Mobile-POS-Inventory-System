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
            get().logoutAction();
            return;
          }

          const response = await authService.getProfile();
          const userData = response.data;

          if (!userData || !userData.role) {
            console.error("Critical: Server returned user data without role!", userData);

            throw new Error("Invalid User Role from API");
          }

          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: any) {
          const isNetworkError = err.message === "Network Error" || err.code === "ERR_NETWORK";
          const isAuthError = err.response?.status === 401 || err.message === "Invalid User Role from API";

          if (isNetworkError) {
            console.log("Offline mode: Using cached user data.");
            set({ isLoading: false });
          } else if (isAuthError) {
            console.warn("Session invalid or Data corrupt. Logging out.");
            get().logoutAction();
          } else {
            console.error("Unexpected init error:", err);

            set({ isLoading: false });
          }
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
