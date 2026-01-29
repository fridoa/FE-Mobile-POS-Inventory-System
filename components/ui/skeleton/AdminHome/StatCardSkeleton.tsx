import { View } from "react-native";
import Skeleton from "../Skeleton";

export const StatCardSkeleton = () => (
  <View className="p-6 mb-6 bg-emerald-600/10 border border-emerald-100 rounded-[32px]">
    <View className="flex-row items-center justify-between mb-6">
      <Skeleton width={48} height={48} borderRadius={16} className="bg-emerald-200/50" />
      <Skeleton width={80} height={24} borderRadius={20} className="bg-emerald-200/50" />
    </View>

    <Skeleton width={100} height={10} className="mb-2 bg-emerald-200/50" />
    <Skeleton width={220} height={36} className="bg-emerald-200/50" />
  </View>
);
