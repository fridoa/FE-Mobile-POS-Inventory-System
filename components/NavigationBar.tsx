import { useRouter } from "expo-router";
import { PackagePlus, Store, User } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

const NavigationBar = () => {
  const router = useRouter();
  return (
    <View className="absolute z-10 flex-row items-center justify-around h-16 px-2 bg-white border border-gray-100 rounded-full shadow-xl bottom-6 left-6 right-6 shadow-gray-200">
      <TouchableOpacity className="items-center justify-center w-12 h-12 rounded-full shadow-lg bg-emerald-600 shadow-emerald-200" activeOpacity={0.8}>
        <Store size={22} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        className="items-center justify-center w-12 h-12"
        activeOpacity={0.5}
      >
        <PackagePlus size={24} color="#9ca3af" />
      </TouchableOpacity>

      <TouchableOpacity className="items-center justify-center w-12 h-12" onPress={() => router.push("/(admin)/profile")}>
        <User size={24} color="#9ca3af" />
      </TouchableOpacity>
    </View>
  );
};

export default NavigationBar;
