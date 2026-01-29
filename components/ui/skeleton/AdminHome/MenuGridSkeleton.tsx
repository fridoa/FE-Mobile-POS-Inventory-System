import { View } from "react-native";
import Skeleton from "../Skeleton";

export const MenuGridSkeleton = () => (
  <View>
    <Skeleton width={120} height={10} className="mb-4 ml-1" />
    <View className="flex-row flex-wrap justify-between">
      {[1, 2, 3, 4].map((i) => (
        <View key={i} className="items-center w-[22%] mb-4">
          <Skeleton width={60} height={60} borderRadius={18} className="mb-2" />
          <Skeleton width={50} height={10} />
        </View>
      ))}
    </View>
  </View>
);
