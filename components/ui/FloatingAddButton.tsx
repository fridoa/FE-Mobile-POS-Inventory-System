import { Plus } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";

interface FloatingAddButtonProps extends TouchableOpacityProps {
  label: string;
}

const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({ label, ...props }) => {
  return (
    <View className="absolute z-50 w-full px-4 bottom-6">
      <TouchableOpacity activeOpacity={0.8} className="flex-row items-center justify-center w-full py-4 shadow-lg bg-[#059669] rounded-2xl" style={{ elevation: 5, shadowColor: "#059669" }} {...props}>
        <Plus size={24} color="white" />
        <Text className="ml-2 text-base font-bold text-white">{label}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FloatingAddButton;
