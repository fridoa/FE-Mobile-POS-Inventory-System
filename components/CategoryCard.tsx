import { Layers, Pencil } from "lucide-react-native";
import React, { memo, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ReanimatedSwipeable, { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";

import { ICategory } from "@/types/Category";
import SwipeableDeleteAction from "./ui/SwipeableDeleteAction";

interface CategoryCardProps {
  item: ICategory;
  onEdit: (category: ICategory) => void;
  onDelete: (id: string, closeSwipe: () => void) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ item, onEdit, onDelete }) => {
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
          <View className="items-center justify-center w-12 h-12 mr-3 rounded-full bg-blue-50">
            <Layers size={24} color="#059669" />
          </View>

          <View className="flex-1">
            <Text className="text-base font-bold text-gray-800 capitalize" numberOfLines={1}>
              {item.name}
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

export default memo(CategoryCard);
