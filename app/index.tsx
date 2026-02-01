import { ActivityIndicator, Image, View } from "react-native";

export default function Index() {
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
