import React from "react";
import { View } from "react-native";
import Skeleton from "./Skeleton";

export const CashierHomeSkeleton = () => (
  <View className="px-6 pt-6">
    <View className="p-6 mb-6 bg-emerald-600/10 border border-emerald-100 rounded-[32px]">
      <View className="flex-row items-center justify-between mb-4">
        <Skeleton width={120} height={12} className="bg-emerald-200/50" />
        <Skeleton width={40} height={40} borderRadius={14} className="bg-emerald-200/50" />
      </View>
      <Skeleton width={200} height={32} className="mb-2 bg-emerald-200/50" />
      <Skeleton width={80} height={10} className="bg-emerald-200/50" />
    </View>

    <View className="h-24 p-6 mb-8 bg-slate-100 rounded-3xl">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Skeleton width={48} height={48} borderRadius={16} />
          <View className="ml-4">
            <Skeleton width={120} height={18} className="mb-2" />
            <Skeleton width={180} height={10} />
          </View>
        </View>
        <Skeleton width={20} height={20} borderRadius={10} />
      </View>
    </View>

    <Skeleton width={100} height={10} className="mb-4 ml-1" />
    <View className="flex-row justify-between mb-8">
      <View className="w-[48%] bg-white p-4 rounded-3xl border border-slate-100 flex-row items-center">
        <Skeleton width={40} height={40} borderRadius={12} className="mr-3" />
        <Skeleton width={60} height={14} />
      </View>
      <View className="w-[48%] bg-white p-4 rounded-3xl border border-slate-100 flex-row items-center">
        <Skeleton width={40} height={40} borderRadius={12} className="mr-3" />
        <Skeleton width={60} height={14} />
      </View>
    </View>

    <View className="flex-row items-center justify-between px-1 mb-4">
      <Skeleton width={120} height={10} />
      <Skeleton width={60} height={10} />
    </View>
    <View className="bg-white rounded-[32px] border border-slate-100 overflow-hidden">
      {[1, 2, 3].map((i) => (
        <View key={i} className="flex-row items-center justify-between p-4 border-b border-slate-50">
          <View className="flex-row items-center">
            <Skeleton width={40} height={40} borderRadius={20} className="mr-3" />
            <View>
              <Skeleton width={80} height={12} className="mb-2" />
              <Skeleton width={50} height={8} />
            </View>
          </View>
          <View className="items-end">
            <Skeleton width={100} height={16} className="mb-2" />
            <Skeleton width={40} height={8} />
          </View>
        </View>
      ))}
    </View>
  </View>
);
