import { useAuthStore } from "@/stores/auth.store";
import { useRootNavigationState, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export function useProtectedRoute() {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (isLoading || !navigationState?.key) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inAdminGroup = segments[0] === "(admin)";
    const inCashierGroup = segments[0] === "(cashier)";

    if (!isAuthenticated) {
      if (!inAuthGroup) {
        router.replace("/(auth)");
      }
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
    }
  }, [isAuthenticated, user, segments, isLoading, navigationState?.key]);
}
