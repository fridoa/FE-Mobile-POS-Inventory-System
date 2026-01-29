import React from "react";
import { View } from "react-native";
import Skeleton from "../Skeleton";

const ProductRankingSkeleton = () => {
  return (
    <View className="flex-row items-center justify-between px-6 py-5 bg-white border-b border-slate-50">
      <View className="flex-[2] pr-2">
        <Skeleton width="85%" height={14} className="mb-2" />
        <Skeleton width="40%" height={8} />
      </View>

      <View className="items-center flex-1">
        <Skeleton width={40} height={20} borderRadius={8} />
      </View>

      <View className="items-end flex-1">
        <Skeleton width={30} height={16} className="mb-1" />
        <Skeleton width={20} height={8} />
      </View>
    </View>
  );
};

export default ProductRankingSkeleton;
