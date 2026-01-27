import React, { memo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface MenuItemProps {
  title: string;
  icon: any;
  onPress: () => void;
  color?: string;
  badge?: number;
}

const MenuItem = memo(({ title, icon: Icon, onPress, color = "bg-emerald-50", badge }: MenuItemProps) => {
  return (
    <View className="items-center w-1/4 mb-6">
      <TouchableOpacity onPress={onPress} className={`w-14 h-14 ${color} rounded-2xl items-center justify-center shadow-sm mb-2 relative`} activeOpacity={0.7}>
        <Icon size={24} color="#059669" strokeWidth={2} />

        {badge !== undefined && badge > 0 && (
          <View className="absolute -top-1 -right-1 bg-red-500 min-w-[20px] h-[20px] rounded-full items-center justify-center border-2 border-white px-1 shadow-sm">
            <Text className="text-white text-[9px] font-black text-center">{badge > 99 ? "99+" : badge}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text className="w-20 text-xs font-semibold leading-4 text-center text-gray-700">{title}</Text>
    </View>
  );
});

MenuItem.displayName = "MenuItem";

export default MenuItem;
