import React from "react";
import { View } from "react-native";
import Skeleton from "./Skeleton";

const RestockCardSkeleton = () => {
  return (
    <View className="flex-row items-center p-4 mb-4 bg-white border border-slate-100 rounded-[28px] shadow-sm">
      <Skeleton width={70} height={70} borderRadius={18} className="bg-slate-50" />

      <View className="flex-1 ml-4">
        <Skeleton width="70%" height={14} className="mb-2" />
        <View className="flex-row items-center">
          <Skeleton width={40} height={10} className="mr-2" />
          <Skeleton width={60} height={14} borderRadius={6} className="bg-orange-50/50" />
        </View>
      </View>

      <View className="items-end">
        <Skeleton width={80} height={36} borderRadius={12} />
      </View>
    </View>
  );
};

export default RestockCardSkeleton;
