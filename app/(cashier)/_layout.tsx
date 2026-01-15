import { Stack } from "expo-router";
import React from "react";

export default function CashierLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        contentStyle: { backgroundColor: "white" },
      }}
    />
  );
}
