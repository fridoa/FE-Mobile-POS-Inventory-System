import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="home/index" />

      <Stack.Screen
        name="home/cashier"
        options={{
          animation: "slide_from_right",
          presentation: "card",
        }}
      />

    </Stack>
  );
}
