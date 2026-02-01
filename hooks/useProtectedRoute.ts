import { useAuthStore } from "@/stores/auth.store";
import { useRootNavigationState, useRouter, useSegments } from "expo-router";
import { useEffect, useRef } from "react";

export function useProtectedRoute() {
  const { isAuthenticated, user, isLoading, logoutAction, isInitialized } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const hasNavigated = useRef(false);

  useEffect(() => {
    const isNavigationReady = !!navigationState?.key;
    if (isLoading || !isNavigationReady || !isInitialized) {
      return;
    }

    const currentGroup = segments[0] as string | undefined;
    const inAuthGroup = currentGroup === "(auth)";
    const inAdminGroup = currentGroup === "(admin)";
    const inCashierGroup = currentGroup === "(cashier)";

    if (hasNavigated.current && !isAuthenticated) {
      hasNavigated.current = false;
    }

    if (!isAuthenticated) {
      if (!inAuthGroup) {
        router.replace("/(auth)");
      }
      return;
    }

    if (!user || !user.role) {
      console.error("[Guard] Auth terdeteksi tapi role tidak ditemukan. Memaksa logout.");
      logoutAction();
      router.replace("/(auth)");
      return;
    }

    const userRole = user.role.toLowerCase();
    const isInCorrectGroup = (userRole === "admin" && inAdminGroup) || ((userRole === "kasir" || userRole === "karyawan") && inCashierGroup);

    if (isInCorrectGroup) {
      hasNavigated.current = true;
      return;
    }

    if (hasNavigated.current) {
      return;
    }

    if (userRole === "admin") {
      if (!inAdminGroup) {
        hasNavigated.current = true;
        router.replace("/(admin)/(tabs)/home");
      }
    } else if (userRole === "kasir" || userRole === "karyawan") {
      if (!inCashierGroup) {
        hasNavigated.current = true;
        router.replace("/(cashier)/(tabs)/home");
      }
    } else {
      console.warn("[Guard] Role tidak dikenali:", userRole);
      logoutAction();
      router.replace("/(auth)");
    }
  }, [isAuthenticated, user?.role, segments, isLoading, navigationState?.key, router]);
}
