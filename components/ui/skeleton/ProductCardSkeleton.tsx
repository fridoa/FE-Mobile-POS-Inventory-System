import React from "react";
import { View } from "react-native";
import Skeleton from "./Skeleton";

const ProductCardSkeleton = () => {
  return (
    <View className="flex-row items-center p-4 mb-4 bg-white border border-slate-100 rounded-3xl">
      <Skeleton width={80} height={80} borderRadius={20} className="bg-slate-100" />

      <View className="justify-center flex-1 ml-4">
        <Skeleton width="80%" height={16} className="mb-2" />

        <Skeleton width="40%" height={10} className="mb-4" />

        <View className="flex-row items-end justify-between">
          <View>
            <Skeleton width={100} height={20} className="mb-1" />
            <Skeleton width={60} height={10} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProductCardSkeleton;
