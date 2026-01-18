import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";

export default function ScannerOverlay() {
  const scanPos = useSharedValue(0);
  const cornerScale = useSharedValue(1);

  useEffect(() => {
    // Animasi Laser
    scanPos.value = withRepeat(withTiming(1, { duration: 2500 }), -1, true);

    // Animasi Denyut pada sudut kotak
    cornerScale.value = withRepeat(withSequence(withTiming(1.1, { duration: 1000 }), withTiming(1, { duration: 1000 })), -1, true);
  }, []);

  const laserStyle = useAnimatedStyle(() => ({
    top: interpolate(scanPos.value, [0, 1], [10, 260]),
  }));

  const cornerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cornerScale.value }],
  }));

  return (
    <View className="absolute inset-0 items-center justify-center">
      <View className="absolute inset-0 bg-black/70" />
      <View className="relative w-72 h-72">
        {/* Sudut-Sudut Pulsing */}
        <Animated.View style={cornerStyle} className="absolute inset-0">
          <View className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-emerald-500 rounded-tl-3xl" />
          <View className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-emerald-500 rounded-tr-3xl" />
          <View className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-emerald-500 rounded-bl-3xl" />
          <View className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-emerald-500 rounded-br-3xl" />
        </Animated.View>

        {/* Laser Neon Gradient */}
        <Animated.View style={[laserStyle, { position: "absolute", width: "100%", height: 40 }]}>
          <LinearGradient colors={["transparent", "rgba(16, 185, 129, 0.4)", "transparent"]} style={{ flex: 1 }} />
          <View className="h-[2px] w-full bg-emerald-400 shadow-lg shadow-emerald-500" />
        </Animated.View>
      </View>

      <View className="px-8 py-3 mt-12 border bg-white/10 rounded-2xl border-white/20">
        <Text className="font-bold tracking-widest text-center text-white uppercase">Scanning Mode</Text>
        <Text className="mt-1 text-xs text-center text-emerald-300">Arahkan barcode ke dalam bingkai</Text>
      </View>
    </View>
  );
}
