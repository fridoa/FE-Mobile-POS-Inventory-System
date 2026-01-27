import { LinearGradient } from "expo-linear-gradient";
import React, { memo } from "react";
import { Text, useWindowDimensions, View } from "react-native";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  isPrimary?: boolean;
}

const StatCard = memo(({ title, value, icon, trend, isPrimary = false }: StatCardProps) => {
  const { width } = useWindowDimensions();

  if (isPrimary) {
    return (
      // Gunakan w-full agar otomatis mengikuti padding parent (AdminHomeContent)
      <LinearGradient colors={["#059669", "#10b981"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="p-6 rounded-[32px] shadow-2xl shadow-emerald-600/40 mb-4 w-full overflow-hidden">
        <View className="flex-row items-start justify-between mb-4">
          <View className="p-3 bg-white/20 rounded-2xl">{icon}</View>
          {trend && (
            <View className="px-3 py-1 rounded-full bg-white/30">
              <Text className="text-white text-[10px] font-bold">{trend}</Text>
            </View>
          )}
        </View>
        <View>
          <Text className="text-xs font-medium tracking-widest uppercase text-white/80">{title}</Text>
          <Text className="mt-1 text-3xl font-black text-white" numberOfLines={1} adjustsFontSizeToFit>
            {value}
          </Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <View className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-50 mb-4 overflow-hidden" style={{ width: (width - 60) / 2 }}>
      <View className="items-center justify-center w-12 h-12 mb-4 bg-emerald-50 rounded-2xl">{icon}</View>
      <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{title}</Text>
      <Text className="mt-1 text-base font-black text-gray-900" numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      {trend && <Text className="text-emerald-500 text-[9px] font-bold mt-2 italic">{trend}</Text>}
    </View>
  );
});

StatCard.displayName = "StatCard";
export default StatCard;
