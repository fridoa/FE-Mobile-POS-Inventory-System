import { Stack } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function AdminLayout() {
  return (
    <View className="flex-1">
      <Stack
        screenOptions={{
          headerShown: false, // Sembunyikan header bawaan agar desain custom Anda yang muncul
          animation: "fade", // Animasi halus saat admin menu berubah
          contentStyle: { backgroundColor: "white" },
        }}
      />
    </View>
  );
}
