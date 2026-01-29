import { View } from "react-native";
import Skeleton from "../Skeleton";

export const RevenueChartSkeleton = () => (
  <View className="mx-5 p-6 mb-6 bg-white border border-slate-100 rounded-[32px] shadow-sm">
    <View className="mb-8">
      <Skeleton width={140} height={16} className="mb-2" />
      <Skeleton width={100} height={10} />
    </View>

    <View className="flex-row items-end justify-between h-40 px-2">
      <Skeleton width={15} height="30%" borderRadius={4} />
      <Skeleton width={15} height="20%" borderRadius={4} />
      <Skeleton width={15} height="60%" borderRadius={4} />
      <Skeleton width={15} height="90%" borderRadius={4} />
      <Skeleton width={15} height="40%" borderRadius={4} />
      <Skeleton width={15} height="70%" borderRadius={4} />
      <Skeleton width={15} height="25%" borderRadius={4} />
    </View>

    <View className="flex-row justify-between px-1 mt-4">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <Skeleton key={i} width={12} height={8} />
      ))}
    </View>
  </View>
);
