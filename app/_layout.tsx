import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { toast as toastConfig } from "../components/toast";
import "../global.css";

export default function RootLayout() {
  return (
    <>
      <Stack />;
      <Toast config={toastConfig} />
    </>
  );
}
