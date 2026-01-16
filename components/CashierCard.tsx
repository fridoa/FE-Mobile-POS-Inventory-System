import { IUser } from "@/types/User";
import { User } from "lucide-react-native";
import React, { memo } from "react";
import { Text, View } from "react-native";

interface CashierCardProps {
  item: IUser;
}

const CashierCard: React.FC<CashierCardProps> = ({ item }) => {
  return (
    <View className="flex-row items-center justify-between p-4 mb-3 bg-white border border-gray-100 shadow-sm rounded-2xl">
      <View className="flex-row items-center flex-1">
        <View className="items-center justify-center w-10 h-10 mr-3 rounded-full bg-emerald-50">
          <User size={20} color="#059669" />
        </View>
        <View>
          <Text className="text-base font-bold text-gray-800 capitalize">{item.name}</Text>
          <Text className="text-xs text-gray-400">
            @{item.username} • <Text className="capitalize">{item.role}</Text>
          </Text>
        </View>
      </View>

      <View className={`px-2 py-1 rounded-lg ${item.isActive ? "bg-green-100" : "bg-red-100"}`}>
        <Text className={`text-[10px] font-medium ${item.isActive ? "text-green-700" : "text-red-600"}`}>{item.isActive ? "Active" : "Inactive"}</Text>
      </View>
    </View>
  );
};

export default memo(CashierCard);
