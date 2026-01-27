import { toast as toastConfig } from "@/components/toast";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { asyncStoragePersister } from "@/lib/persister";
import { useAuthStore } from "@/stores/auth.store";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { SplashScreen, Stack, useRootNavigationState } from "expo-router";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ReanimatedLogLevel, configureReanimatedLogger } from "react-native-reanimated";
import Toast from "react-native-toast-message";
import "../global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60 * 24 * 7,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: 1,
    },
  },
});

SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  const { user, isLoading, initializeAction } = useAuthStore();
  const navigationState = useRootNavigationState();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log("[Layout] 1. initializeAction dipanggil");
    initializeAction();
  }, []);

  useEffect(() => {
    const navigationReady = !!navigationState?.key;
    console.log("[Layout] 2. Monitoring Status:", { navigationReady, isLoading });

    if (navigationReady && !isLoading) {
      console.log("[Layout] 3. Sistem Siap, isReady set True");
      setIsReady(true);
      SplashScreen.hideAsync();
    }
  }, [isLoading, navigationState?.key]);

  useProtectedRoute();

  useEffect(() => {
    if (isReady && user) {
      console.log("[Layout] 4. User terdeteksi, inisialisasi fitur tambahan...");
    }
  }, [isReady, user]);

  console.log("[Layout] 5. Rendering Stack Tree...");

  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false,
  });

  return (
    <GestureHandlerRootView className="flex-1">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
        <Stack.Screen name="(cashier)" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        hydrateOptions: {},
      }}
    >
      <InitialLayout />
      <Toast config={toastConfig} />
    </PersistQueryClientProvider>
  );
}
