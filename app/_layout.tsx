import { toast as toastConfig } from "@/components/toast";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { asyncStoragePersister } from "@/lib/persister";
import { useAuthStore } from "@/stores/auth.store";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import * as Notifications from "expo-notifications";
import { Href, SplashScreen, Stack, useRootNavigationState, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ReanimatedLogLevel, configureReanimatedLogger } from "react-native-reanimated";
import Toast from "react-native-toast-message";
import "../global.css";

import { registerForPushNotificationsAsync } from "@/lib/notification";
import authService from "@/services/auth.service";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60 * 24 * 7,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false,
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

    configureReanimatedLogger({
      level: ReanimatedLogLevel.warn,
      strict: false,
    });
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
        if (data?.productId) {
          router.push({
            pathname: "/(admin)/home/product/editProduct/[_id]",
            params: { _id: data.productId },
          } as Href);
        }
      });

      return () => responseSubscription.remove();
    }
  }, [isReady, user]);

  useProtectedRoute();

  useEffect(() => {
    const navigationReady = !!navigationState?.key;

    if (navigationReady && !isLoading) {
      const timer = setTimeout(() => {
        setIsReady(true);
        SplashScreen.hideAsync();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isLoading, navigationState?.key]);

  if (!isReady) return null;

  return (
    <GestureHandlerRootView className="flex-1">
      <Stack screenOptions={{ headerShown: false, animation: "fade_from_bottom" }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(admin)" />
        <Stack.Screen name="(cashier)" />
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
      }}
    >
      <InitialLayout />
      <Toast config={toastConfig} />
    </PersistQueryClientProvider>
  );
}
