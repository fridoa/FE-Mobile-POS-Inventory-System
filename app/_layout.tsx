import { toast as toastConfig } from "@/components/toast";
import { NetworkStatusProvider } from "@/hooks/useNetworkStatus";
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
import { ActivityIndicator, Image, View } from "react-native";

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

function ProtectedRouteHandler() {
  useProtectedRoute();
  return null;
}

function InitialLayout() {
  const { user, isLoading, isInitialized, initializeAction } = useAuthStore();
  const navigationState = useRootNavigationState();
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    initializeAction();

    configureReanimatedLogger({
      level: ReanimatedLogLevel.warn,
      strict: false,
    });
  }, [initializeAction]);

  useEffect(() => {
    if (isReady && user) {
      registerForPushNotificationsAsync().then((token) => {
        if (token) {
          authService.updateFCMToken(token);
        }
      });

      const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
        const { data } = response.notification.request.content;
        if (data?.productId) {
          router.push({
            pathname: "/(admin)/home/product/editProduct/[_id]",
            params: { _id: data.productId },
          } as Href);
        }
      });

      return () => responseSubscription.remove();
    }
  }, [isReady, user, router]);

  useEffect(() => {
    const navigationReady = !!navigationState?.key;

    if (navigationReady && !isLoading && isInitialized) {
      const timer = setTimeout(() => {
        setIsReady(true);
        SplashScreen.hideAsync();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isInitialized, navigationState?.key]);

  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#059669",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image source={require("@/assets/images/splash-screen.png")} style={{ width: 250, height: 250, marginBottom: 20 }} resizeMode="contain" />
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <ProtectedRouteHandler />
      <Stack screenOptions={{ headerShown: false, animation: "fade_from_bottom" }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(admin)" />
        <Stack.Screen name="(cashier)" />
      </Stack>
    </GestureHandlerRootView>
  );
}

const PERSISTABLE_QUERY_KEYS = ["products", "categories"];

export default function RootLayout() {
  return (
    <NetworkStatusProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: asyncStoragePersister,
          maxAge: 1000 * 60 * 60 * 24,
          dehydrateOptions: {
            shouldDehydrateQuery: (query) => {
              const queryKey = query.queryKey[0] as string;
              return query.state.status === "success" && PERSISTABLE_QUERY_KEYS.includes(queryKey);
            },
          },
        }}
      >
        <InitialLayout />
        <Toast config={toastConfig} />
      </PersistQueryClientProvider>
    </NetworkStatusProvider>
  );
}
