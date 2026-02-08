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
      <View className="mb-12 mt-2 mx-2">
        <View className="absolute inset-0 bg-blue-500 rounded-[32px] transform -rotate-6 translate-y-2 opacity-60" />
        
        <View className="absolute inset-0 bg-rose-500 rounded-[32px] transform -rotate-3 translate-y-1 opacity-80" />
        
        <View className="bg-emerald-500 p-6 rounded-[32px] shadow-xl shadow-emerald-500/30">
          <View className="flex-row items-start justify-between mb-4">
            <View className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">{icon}</View>
            {trend && (
              <View className="px-3 py-1 rounded-full bg-white/30">
                <Text className="text-white text-[10px] font-bold">{trend}</Text>
              </View>
            )}
          </View>
          <View>
            <Text className="text-xs font-bold tracking-widest uppercase text-emerald-100">Total Omzet</Text>
            <Text className="mt-1 text-3xl font-black text-white" numberOfLines={1} adjustsFontSizeToFit>
              {value}
            </Text>
          </View>
        </View>
      </View>
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
