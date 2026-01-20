import { toast as toastConfig } from "@/components/toast";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useAuthStore } from "@/stores/auth.store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { SplashScreen, Stack, useRootNavigationState, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import "../global.css";

import { registerForPushNotificationsAsync } from "@/lib/notification";
import authService from "@/services/auth.service";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 15,
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
  const router = useRouter();

  useEffect(() => {
    initializeAction();
  }, []);

  useEffect(() => {
    if (isReady && user) {
      registerForPushNotificationsAsync().then((token) => {
        if (token) {
          authService.updateFCMToken(token);
        }
      });

      const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;

        if (data?.type === "RESTOCK_SCREEN") {
          router.push("/(admin)/home/restock");
        } else if (data?.type === "NOTIFICATION_SCREEN") {
          router.push("/(admin)/home/notification");
        }
      });

      return () => {
        responseSubscription.remove();
      };
    }
  }, [isReady, user]);

  useProtectedRoute();

  useEffect(() => {
    const navigationReady = !!navigationState?.key;

    if (navigationReady && !isLoading) {
      setIsReady(true);
      SplashScreen.hideAsync();
    }
  }, [isLoading, navigationState?.key]);

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
    <QueryClientProvider client={queryClient}>
      <InitialLayout />
      <Toast config={toastConfig} />
    </QueryClientProvider>
  );
}
