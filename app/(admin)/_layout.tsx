import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        animationMatchesGesture: true,
        gestureEnabled: true,
        contentStyle: { backgroundColor: "#F9FAFB" },
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          animation: "fade",
        }}
      />
    </Stack>
  );
}
