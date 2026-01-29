import { IProduct } from "@/types/Product";
import { Package } from "lucide-react-native";
import { memo } from "react";
import { Image, Text, View } from "react-native";

interface ProductCardProps {
  item: IProduct;
}

function ProductCard({ item }: ProductCardProps) {
  const finalPrice = item.price ?? 0;
  const originalPrice = item.basePrice ?? 0;
  const discountPercent = item.discount ?? 0;
  const hasDiscount = discountPercent > 0;

  return (
    <View className="flex-row items-center p-3 mb-3 bg-white border border-gray-100 shadow-sm rounded-2xl">
      {/* BAGIAN GAMBAR & BADGE DISKON */}
      <View className="relative items-center justify-center w-20 h-20 overflow-hidden bg-gray-50 rounded-xl">
        {item.imageUrl ? <Image source={{ uri: item.imageUrl }} className="w-full h-full" resizeMode="cover" /> : <Package size={28} color="#D1D5DB" />}

        {/* Badge Diskon hanya tampil jika > 0 */}
        {hasDiscount && (
          <View className="absolute top-0 right-0 px-2 py-0.5 bg-red-500 rounded-bl-lg">
            <Text className="text-[10px] font-bold text-white">-{discountPercent}%</Text>
          </View>
        )}
      </View>

      {/* INFORMASI PRODUK */}
      <View className="flex-1 ml-4 justify-between h-[72px]">
        <View>
          <Text className="text-sm font-semibold text-gray-800" numberOfLines={2}>
            {item.name}
          </Text>
          <Text className="mt-1 text-[11px] text-gray-500 font-medium">Stok: {item.stock}</Text>
        </View>

        {/* LOGIKA TAMPILAN HARGA */}
        <View className="flex-row items-center mt-1">
          <View className="flex-1">
            {/* Harga Utama (Sudah harga final dari backend) */}
            <Text className="text-base font-black text-emerald-600">Rp {finalPrice.toLocaleString("id-ID")}</Text>

            {/* Harga Coret (Tampil jika ada diskon) */}
            {hasDiscount && <Text className="text-[10px] text-gray-400 line-through font-medium">Rp {originalPrice.toLocaleString("id-ID")}</Text>}
          </View>
        </View>
      </View>
    </View>
  );
}

ProductCard.displayName = "ProductCard";

export default memo(ProductCard);
