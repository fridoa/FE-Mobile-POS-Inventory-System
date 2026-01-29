import { View } from "react-native";
import Skeleton from "../Skeleton";

export const HomeSalesReportSkeleton = () => (
  <View className="p-6 mb-8 bg-white border border-slate-100 rounded-[32px] shadow-sm">
    <View className="flex-row items-center justify-between mb-8">
      <View>
        <Skeleton width={140} height={16} className="mb-2" />
        <Skeleton width={100} height={10} />
      </View>
      <Skeleton width={60} height={30} borderRadius={15} />
    </View>

    <View className="flex-row items-end justify-around h-32 px-2">
      <Skeleton width={35} height="20%" borderRadius={8} />
      <Skeleton width={35} height="80%" borderRadius={8} />
      <Skeleton width={35} height="70%" borderRadius={8} />
      <Skeleton width={35} height="60%" borderRadius={8} />
    </View>

    <View className="flex-row justify-around mt-4">
      <Skeleton width={30} height={8} />
      <Skeleton width={30} height={8} />
      <Skeleton width={30} height={8} />
      <Skeleton width={30} height={8} />
    </View>
  </View>
);
