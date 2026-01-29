import React from "react";
import { View } from "react-native";
import Skeleton from "./Skeleton";

const HistoryItemSkeleton = () => {
  return (
    <View className="flex-row items-center p-4 mb-3 bg-white border border-slate-50 rounded-[24px] shadow-sm">
      <Skeleton width={44} height={44} borderRadius={14} className="bg-emerald-50/50" />

      <View className="flex-1 ml-4">
        <Skeleton width={100} height={10} className="mb-2" />
        <Skeleton width={130} height={18} className="mb-2" />
        <Skeleton width={80} height={10} />
      </View>

      <View className="items-end">
        <Skeleton width={60} height={10} className="mb-2" />
        <Skeleton width={16} height={16} borderRadius={8} />
      </View>
    </View>
  );
};

export default HistoryItemSkeleton;
