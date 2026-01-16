import { Pencil, User } from "lucide-react-native";
import React, { memo, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ReanimatedSwipeable, { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";

import { IUser } from "@/types/User";
import SwipeableDeleteAction from "./ui/SwipeableDeleteAction";

interface CashierCardProps {
  item: IUser;
  onEdit: (user: IUser) => void;
  onDelete: (id: string, onCancel: () => void) => void;
}

const CashierCard: React.FC<CashierCardProps> = ({ item, onEdit, onDelete }) => {
  const swipeableRef = useRef<SwipeableMethods>(null);

  const closeSwipe = () => {
    swipeableRef.current?.close();
  };
  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      containerStyle={{ width: "100%" }}
      renderRightActions={(progress, dragX) => (
        <View style={{ width: "100%", flex: 1 }}>
          <SwipeableDeleteAction progress={progress} dragX={dragX} onDelete={() => {}} />
        </View>
      )}
      onSwipeableWillOpen={(direction) => {
        if (direction === "left" && item._id) {
          onDelete(item._id, closeSwipe);
        }
      }}
      friction={1}
      rightThreshold={40}
      enableTrackpadTwoFingerGesture
      activeOffsetX={[-10, 10]}
      failOffsetY={[-5, 5]}
    >
      <View className="flex-row items-center justify-between p-4 mb-3 bg-white border border-gray-100 shadow-sm rounded-2xl">
        <View className="flex-row items-center flex-1">
          {/* Avatar Icon Section */}
          <View className="items-center justify-center w-12 h-12 mr-3 rounded-full bg-emerald-50">
            <User size={24} color="#059669" />
          </View>

          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Text className="mr-2 text-base font-bold text-gray-800 capitalize" numberOfLines={1}>
                {item.name}
              </Text>

              <View className={`px-2 py-0.5 rounded-full ${item.isActive ? "bg-green-100" : "bg-red-100"}`}>
                <Text className={`text-[8px] font-bold ${item.isActive ? "text-green-700" : "text-red-600"}`}>{item.isActive ? "ACTIVE" : "INACTIVE"}</Text>
              </View>
            </View>

            <Text className="text-xs text-gray-400">
              @{item.username} • <Text className="capitalize">{item.role}</Text>
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => onEdit(item)} className="p-2 ml-2 bg-gray-50 rounded-xl" activeOpacity={0.7}>
          <Pencil size={18} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </ReanimatedSwipeable>
  );
};

export default memo(CashierCard);
