import { useAuthStore } from "@/stores/auth.store";
import { useRootNavigationState, useRouter, useSegments } from "expo-router";
import { useEffect, useMemo } from "react";

/**
 * Hook untuk memproteksi rute berdasarkan status autentikasi dan role user.
 * Dioptimalkan untuk meminimalkan flicker dan mencegah loop navigasi.
 */
export function useProtectedRoute() {
  const { isAuthenticated, user, isLoading, logoutAction } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  const currentGroup = useMemo(() => segments[0] as string | undefined, [segments]);

  useEffect(() => {
    const isNavigationReady = !!navigationState?.key;
    if (isLoading || !isNavigationReady) {
      return;
    }

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
      console.error("[Guard] Auth terdeteksi tapi role tidak ditemukan. Memaksa logout.");
      logoutAction();
      router.replace("/(auth)");
      return;
    }

    const userRole = user?.role?.toLowerCase();

    if (userRole === "admin") {
      if (!inAdminGroup) {
        router.replace("/(admin)/(tabs)/home");
      }
    } else if (userRole === "kasir" || userRole === "karyawan") {
      if (!inCashierGroup) {
        router.replace("/(cashier)/(tabs)/home");
      }
    } else {
      console.warn("[Guard] Role tidak dikenali:", userRole);
      logoutAction();
      router.replace("/(auth)");
    }
  }, [isAuthenticated, user?.role, currentGroup, isLoading, navigationState?.key, router]);
}
