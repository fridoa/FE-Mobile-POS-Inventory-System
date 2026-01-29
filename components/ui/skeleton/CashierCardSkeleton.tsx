import React from "react";
import { View } from "react-native";
import Skeleton from "./Skeleton";

const CashierCardSkeleton = () => {
  return (
    <View className="flex-row items-center p-5 mb-4 bg-white border border-slate-100 rounded-[32px] shadow-sm">
      <Skeleton width={48} height={48} borderRadius={24} className="bg-slate-50" />

      <View className="flex-1 ml-4">
        <View className="flex-row items-center mb-1">
          <Skeleton width={120} height={16} className="mr-2" />
          <Skeleton width={50} height={16} borderRadius={8} className="bg-emerald-50/50" />
        </View>
        <Skeleton width={80} height={10} />
      </View>

      <Skeleton width={24} height={24} borderRadius={8} />
    </View>
  );
};

export default CashierCardSkeleton;
