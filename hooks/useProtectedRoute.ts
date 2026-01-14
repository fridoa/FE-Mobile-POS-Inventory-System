import { useAuthStore } from "@/stores/auth.store";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export function useProtectedRoute() {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)");
    } else if (isAuthenticated && inAuthGroup) {
      if (user?.role === "admin") {
        router.replace("/(admin)/home");
      } else if (user?.role === "kasir") {
        router.replace("/(cashier)/home");
      }
    }
  }, [isAuthenticated, user, segments, isLoading]);
}
