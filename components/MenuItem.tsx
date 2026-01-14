import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const MenuItem = ({ title, icon: Icon, onPress, color = "bg-emerald-50" }: any) => {
  return (
    <View className="items-center w-1/4 mb-6">
      <TouchableOpacity onPress={onPress} className={`w-14 h-14 ${color} rounded-2xl items-center justify-center shadow-sm mb-2`} activeOpacity={0.7}>
        <Icon size={24} color="#059669" strokeWidth={2} />
      </TouchableOpacity>
      <Text className="w-20 text-xs font-semibold leading-4 text-center text-gray-700">{title}</Text>
    </View>
  );
};

export default MenuItem;
