import React from "react";
import { View } from "react-native";
import Skeleton from "./Skeleton"; 

const CategoryCardSkeleton = () => {
  return (
    <View className="flex-row items-center p-4 mb-3 bg-white border shadow-sm border-slate-100 rounded-2xl">
      <Skeleton width={48} height={48} borderRadius={16} className="bg-slate-100" />

      <View className="flex-1 ml-4">
        <Skeleton width="60%" height={16} borderRadius={4} />
      </View>

      <Skeleton width={24} height={24} borderRadius={6} />
    </View>
  );
};

export default CategoryCardSkeleton;
