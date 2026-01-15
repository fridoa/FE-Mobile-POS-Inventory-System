import { toast as toastConfig } from "@/components/toast";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useAuthStore } from "@/stores/auth.store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import "../global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  const { isLoading, initializeAction } = useAuthStore();

  useEffect(() => {
    initializeAction();
  }, []);

  useProtectedRoute();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(admin)" options={{ headerShown: false }} />
      <Stack.Screen name="(cashier)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <InitialLayout />
      <Toast config={toastConfig} />
    </QueryClientProvider>
  );
}
