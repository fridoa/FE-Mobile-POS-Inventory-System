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
  isInitialized: boolean;
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
      isInitialized: false,

      loginAction: async (user, accessToken, refreshToken) => {
        await setTokens(accessToken, refreshToken);
        set({ user, isAuthenticated: true, isLoading: false });
      },

      logoutAction: async () => {
        await clearTokens();
        set({ user: null, isAuthenticated: false, isLoading: false });
      },

      initializeAction: async () => {
        if (get().isInitialized) {
          return;
        }

        setupAxiosInterceptors(() => {
          get().logoutAction();
        });

        try {
          const token = await getToken("access");
          if (!token) {
            set({ isLoading: false, isAuthenticated: false, isInitialized: true });
            return;
          }

          const currentState = get();
          if (currentState.user && currentState.isAuthenticated) {
            set({ isLoading: false, isInitialized: true });

            authService
              .getProfile()
              .then((response) => {
                const userData = response.data;
                if (userData && userData.role) {
                  set({ user: userData });
                }
              })
              .catch((err) => {
                console.warn("[AUTH] Background profile refresh failed:", err.message);
              });

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
            isInitialized: true,
          });
        } catch (err: any) {
          const isNetworkError = err.message === "Network Error" || err.code === "ERR_NETWORK";

          if (isNetworkError) {
            const currentState = get();
            set({ isLoading: false, isInitialized: true, isAuthenticated: currentState.isAuthenticated && !!currentState.user });
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
