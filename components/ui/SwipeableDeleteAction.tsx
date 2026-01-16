import { Trash2 } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { SharedValue } from "react-native-reanimated";

interface SwipeableDeleteActionProps {
  onDelete: () => void;
  progress: SharedValue<number>;
  dragX: SharedValue<number>;
}

const SwipeableDeleteAction: React.FC<SwipeableDeleteActionProps> = ({ onDelete }) => {
  return (
    <View className="flex-row items-center justify-end flex-1 px-8 mb-3 bg-red-500 rounded-2xl">
      <Trash2 size={24} color="white" />
    </View>
  );
};

export default SwipeableDeleteAction;
