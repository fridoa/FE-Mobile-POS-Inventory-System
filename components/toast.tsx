// src/utils/toastConfig.tsx
import { AlertOctagon, CheckCircle2, X } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Toast, { BaseToastProps } from "react-native-toast-message";

export const toast = {
  success: ({ text1, text2 }: BaseToastProps) => (
    <View className="w-[95%] self-center bg-[#004d3d] rounded-full flex-row items-center p-3 px-4 shadow-2xl">
      <View className="bg-[#10b981] rounded-full p-1.5">
        <CheckCircle2 color="white" size={20} strokeWidth={3} />
      </View>

      <View className="justify-center flex-1 ml-3">
        <Text className="text-sm font-semibold leading-tight text-white">{text1}</Text>
        {text2 && <Text className="text-gray-300 text-xs mt-0.5">{text2}</Text>}
      </View>

      <TouchableOpacity onPress={() => Toast.hide()} className="p-1 ml-2 rounded-full bg-white/10">
        <X color="white" size={16} opacity={0.8} />
      </TouchableOpacity>
    </View>
  ),

  error: ({ text1, text2 }: BaseToastProps) => (
    <View className="w-[95%] self-center bg-[#5a0c08] rounded-full flex-row items-center p-3 px-4 shadow-2xl">
      <View className="bg-[#ef4444] rounded-full p-1.5">
        <AlertOctagon color="white" size={20} strokeWidth={3} />
      </View>

      <View className="justify-center flex-1 ml-3">
        <Text className="text-sm font-semibold leading-tight text-white">{text1}</Text>
        {text2 && <Text className="text-gray-300 text-xs mt-0.5">{text2}</Text>}
      </View>

      <TouchableOpacity onPress={() => Toast.hide()} className="p-1 ml-2 rounded-full bg-white/10">
        <X color="white" size={16} opacity={0.8} />
      </TouchableOpacity>
    </View>
  ),
};
