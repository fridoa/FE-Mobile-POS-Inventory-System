import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "expo-router";
import { Store } from "lucide-react-native";
import React, { useEffect } from "react";
import { ActivityIndicator, Animated, Text, View } from "react-native";

export default function Index() {
  const { user } = useAuthStore();
  const router = useRouter();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(() => {
      if (!user?._id) {
        router.replace("/(auth)");
      } else {
        if (user.role === "admin") {
          router.replace("/(admin)/(tabs)/home");
        } else {
          router.replace("/(cashier)/(tabs)/home");
        }
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [user, fadeAnim]);

  return (
    <View className="items-center justify-center flex-1 bg-emerald-600">
      <Animated.View style={{ opacity: fadeAnim }} className="items-center">
        {/* Logo Toko Intan */}
        <View className="w-24 h-24 bg-white/20 rounded-[32px] items-center justify-center mb-6">
          <Store size={48} color="white" />
        </View>

        <Text className="text-3xl font-black tracking-tighter text-white">TOKO INTAN</Text>
        <Text className="text-emerald-100 text-xs font-bold tracking-[4px] uppercase mt-2">Management System</Text>

        <View className="mt-20">
          <ActivityIndicator color="white" size="small" />
        </View>
      </Animated.View>
    </View>
  );
}
