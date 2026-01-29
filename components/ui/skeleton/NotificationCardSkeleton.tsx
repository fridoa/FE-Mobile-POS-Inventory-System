import React from "react";
import { View } from "react-native";
import Skeleton from "./Skeleton";

const NotificationCardSkeleton = () => {
  return (
    <View className="flex-row items-start p-4 mb-3 bg-white border border-gray-100 rounded-3xl">
      <Skeleton width={44} height={44} borderRadius={16} className="bg-slate-50" />

      <View className="flex-1 ml-4">
        <View className="flex-row items-center justify-between mb-2">
          <Skeleton width="70%" height={14} borderRadius={4} />
          <Skeleton width={8} height={8} borderRadius={4} className="bg-red-100" />
        </View>

        <Skeleton width="90%" height={10} className="mb-1.5" />
        <Skeleton width="60%" height={10} className="mb-3" />

        <Skeleton width={80} height={8} borderRadius={2} />
      </View>
    </View>
  );
};

export default NotificationCardSkeleton;
