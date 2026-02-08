import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { WifiOff } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";

interface OfflineBannerProps {
  message?: string;
}

const OfflineBanner: React.FC<OfflineBannerProps> = ({
  message = "Kamu sedang dalam mode offline. Beberapa fitur mungkin tidak tersedia.",
}) => {
  const { isOffline, isChecking } = useNetworkStatus();

  if (isChecking || !isOffline) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeInUp.duration(300)}
      exiting={FadeOutUp.duration(300)}
      className="mx-4 mb-3"
    >
      <View className="flex-row items-center px-4 py-3 border bg-amber-50 border-amber-200 rounded-2xl">
        <View className="p-2 mr-3 bg-amber-100 rounded-xl">
          <WifiOff size={18} color="#d97706" />
        </View>
        <View className="flex-1">
          <Text className="text-xs font-bold text-amber-800">Mode Offline</Text>
          <Text className="text-[11px] text-amber-600 mt-0.5">{message}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default OfflineBanner;
