import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: "white" },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="forgotPassword" options={{ title: "Lupa Password" }} />
      <Stack.Screen name="resetPassword" options={{ title: "Atur Ulang Password" }} />
    </Stack>
  );
}
