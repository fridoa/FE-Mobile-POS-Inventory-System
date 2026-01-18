import { Plus } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";

interface FloatingAddButtonProps extends TouchableOpacityProps {
  label: string;
}

const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({ label, ...props }) => {
  return (
    <View className="absolute z-50 right-6 bottom-10">
      <TouchableOpacity activeOpacity={0.9} className="flex-row items-center px-6 py-4 shadow-lg bg-emerald-600 rounded-2xl shadow-emerald-200" style={{ elevation: 5 }} {...props}>
        <Plus size={24} color="white" strokeWidth={3} />
        <Text className="ml-2 text-base font-bold text-white">{label}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FloatingAddButton;
