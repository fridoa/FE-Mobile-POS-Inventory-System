import React from "react";
import { View } from "react-native";
import Skeleton from "../Skeleton";

export const FinancialSummarySkeleton = () => (
  <View className="px-5 mb-6">
    <View className="p-6 mb-4 bg-white border border-slate-100 rounded-[32px] shadow-sm">
      <View className="flex-row items-center justify-between mb-4">
        <Skeleton width={80} height={10} />
        <Skeleton width={40} height={40} borderRadius={14} />
      </View>
      <Skeleton width={200} height={32} className="mb-2" />
      <Skeleton width={120} height={10} />
    </View>

    <View className="flex-row justify-between">
      <View className="w-[48%] p-5 bg-white border border-slate-100 rounded-[32px] shadow-sm">
        <Skeleton width={32} height={32} borderRadius={10} className="mb-3" />
        <Skeleton width={60} height={10} className="mb-2" />
        <Skeleton width={100} height={20} />
      </View>
      <View className="w-[48%] p-5 bg-emerald-50/50 border border-emerald-100 rounded-[32px] shadow-sm">
        <Skeleton width={32} height={32} borderRadius={10} className="mb-3 bg-emerald-100" />
        <Skeleton width={60} height={10} className="mb-2 bg-emerald-100" />
        <Skeleton width={100} height={20} className="bg-emerald-100" />
      </View>
    </View>
  </View>
);
