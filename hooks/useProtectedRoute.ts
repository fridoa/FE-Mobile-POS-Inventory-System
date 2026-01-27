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
    // LOG 1: Cek status masuk ke Hook
    console.log("[Guard] --- Check Route ---");
    console.log("[Guard] Info:", {
      currentGroup: currentGroup ?? "undefined",
      isAuthenticated,
      navReady: !!navigationState?.key,
      isLoading,
    });

    // Jangan lakukan apapun jika sistem dasar belum siap
    if (isLoading || !navigationState?.key) {
      console.log("[Guard] Skip: Auth masih loading atau Navigasi belum siap");
      return;
    }

    // Fungsi navigasi aman untuk menghindari benturan context
    const safeNavigate = (path: string) => {
      console.log(`[Guard] Mempersiapkan navigasi ke: ${path}`);
      setTimeout(() => {
        console.log(`[Guard] Eksekusi navigasi ke: ${path} (setAfterRender)`);
        router.replace(path as any);
      }, 1); // Delay 1ms memindahkan tugas ke event loop berikutnya
    };

    const inAuthGroup = currentGroup === "(auth)";
    const inAdminGroup = currentGroup === "(admin)";
    const inCashierGroup = currentGroup === "(cashier)";

    // LOGIKA REDIRECT
    if (!isAuthenticated) {
      if (!inAuthGroup) {
        console.log("[Guard] Kondisi: Tidak terautentikasi -> Redirect (auth)");
        safeNavigate("/(auth)");
      }
      return;
    }

    if (isAuthenticated && !user?.role) {
      console.warn("[Guard] Kondisi: Role hilang -> Logout & Redirect");
      logoutAction();
      safeNavigate("/(auth)");
      return;
    }

    // Role-Based Redirect
    if (user?.role === "admin") {
      if (!inAdminGroup) {
        console.log("[Guard] Kondisi: Admin salah rute -> Redirect (admin)");
        safeNavigate("/(admin)/(tabs)/home");
      }
    } else if (user?.role === "kasir" || user?.role === "karyawan") {
      // Kita handle kondisi undefined (akar /) sebagai target redirect ke home kasir
      if (!inCashierGroup) {
        console.log("[Guard] Kondisi: Kasir salah rute/Akar -> Redirect (cashier)");
        safeNavigate("/(cashier)/(tabs)/home");
      }
    } else {
      console.error("[Guard] Role tidak dikenali:", user?.role);
    }
  }, [isAuthenticated, user?.role, currentGroup, isLoading, navigationState?.key]);
}
