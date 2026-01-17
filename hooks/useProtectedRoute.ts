import { useAuthStore } from "@/stores/auth.store";
import { useRootNavigationState, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export function useProtectedRoute() {
  const { isAuthenticated, user, isLoading, logoutAction } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  const currentGroup = segments[0] as string | undefined;

  useEffect(() => {
    if (isLoading || !navigationState?.key) return;

    const inAuthGroup = currentGroup === "(auth)";
    const inAdminGroup = currentGroup === "(admin)";
    const inCashierGroup = currentGroup === "(cashier)";

    if (!isAuthenticated) {
      if (!inAuthGroup) {
        router.replace("/(auth)");
      }
      return;
    }

    if (isAuthenticated && !user?.role) {
      console.warn("User terautentikasi tapi role hilang. Memaksa logout.");
      logoutAction();
      router.replace("/(auth)");
      return;
    }

    if (user?.role === "admin") {
      if (!inAdminGroup) {
        router.replace("/(admin)/home");
      }
    } else if (user?.role === "kasir" || user?.role === "karyawan") {
      if (!inCashierGroup) {
        router.replace("/(cashier)/home");
      }
    } else {
      console.error("Role tidak dikenali:", user?.role);
    }
  }, [isAuthenticated, user?.role, currentGroup, isLoading, navigationState?.key]);
}
