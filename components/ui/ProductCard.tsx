import { IProduct } from "@/types/Product";
import { Package } from "lucide-react-native";
import { memo } from "react";
import { Image, Text, View } from "react-native";

interface ProductCardProps {
  item: IProduct;
}

function ProductCard({ item }: ProductCardProps) {
  const price = item.price ?? 0;
  const hasDiscount = !!(item.discount && item.discount > 0);
  const discountedPrice = hasDiscount ? price - (price * item.discount!) / 100 : price;

  return (
    <View className="flex-row items-center p-3 mb-3 bg-white border border-gray-100 shadow-sm rounded-2xl">
      <View className="relative items-center justify-center w-20 h-20 overflow-hidden bg-gray-50 rounded-xl">
        {item.imageUrl ? <Image source={{ uri: item.imageUrl }} className="w-full h-full" resizeMode="cover" /> : <Package size={28} color="#D1D5DB" />}

        {hasDiscount && (
          <View className="absolute top-0 right-0 px-2 py-0.5 bg-red-500 rounded-bl-lg">
            <Text className="text-[10px] font-bold text-white">-{item.discount}%</Text>
          </View>
        )}
      </View>

      <View className="flex-1 ml-4 justify-between h-[72px]">
        <View>
          <Text className="text-sm font-semibold text-gray-800" numberOfLines={2}>
            {item.name}
          </Text>
          <Text className="mt-1 text-xs text-gray-500">Stok: {item.stock}</Text>
        </View>

        <View className="flex-row items-center mt-1">
          <View className="flex-1">
            <Text className="text-base font-bold text-emerald-600">Rp {Math.round(discountedPrice).toLocaleString("id-ID")}</Text>
            {hasDiscount && <Text className="text-[10px] text-gray-400 line-through">Rp {price.toLocaleString("id-ID")}</Text>}
          </View>
        </View>
      </View>
    </View>
  );
}

ProductCard.displayName = "ProductCard";

export default memo(ProductCard);
