import { Button, Text, View } from "react-native";
import Toast from "react-native-toast-message";

export default function Index() {
  const showSuccessToast = () => {
    Toast.show({
      type: "success",
      text1: "Berhasil!",
      text2: "Data inventory berhasil disimpan 👋",
    });
  };

  const showErrorToast = () => {
    Toast.show({
      type: "error",
      text1: "Gagal!",
      text2: "Terjadi kesalahan saat menghubungi server ❌",
    });
  };

  return (
    <View className="items-center justify-center flex-1 gap-5">
      <Text className="mb-5 text-xl font-bold">Test Custom Toast</Text>

      <Button title="Munculkan Success Toast" onPress={showSuccessToast} color="#10b981" />

      <Button title="Munculkan Error Toast" onPress={showErrorToast} color="#ef4444" />
    </View>
  );
}
