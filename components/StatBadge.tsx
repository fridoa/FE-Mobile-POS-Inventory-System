import { LucideIcon } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

interface StatBadgeProps {
  label: string;
  value: string;
  icon: LucideIcon;
}

const StatBadge = ({ label, value, icon: Icon }: StatBadgeProps) => {
  return (
    <View className="flex-row items-center px-4 py-2 mx-1 border bg-white/10 rounded-xl border-white/20">
      <View className="bg-white/20 p-1.5 rounded-lg mr-3">
        <Icon size={16} color="white" />
      </View>
      <View>
        <Text className="text-emerald-50 text-[10px] uppercase font-bold">{label}</Text>
        <Text className="text-base font-bold text-white">{value}</Text>
      </View>
    </View>
  );
};

export default StatBadge;
