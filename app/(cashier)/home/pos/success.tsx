import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle, Home, Share2 } from "lucide-react-native";
import React, { useMemo } from "react";
import { ScrollView, Share, Text, TouchableOpacity, View } from "react-native";

import ScreenWrapper from "@/components/ScreenWrapper";
import formatRupiah from "@/utils/formatRupiah";
import { FlashList } from "@shopify/flash-list";

interface ISuccessItem {
  name: string;
  quantity: number;
  basePrice: number;
  price: number;
  discountAmount: number;
  subtotal: number;
}

export default function SuccessScreen() {
  const router = useRouter();
  const { data } = useLocalSearchParams();

  const transaction = useMemo(() => {
    try {
      return data ? JSON.parse(data as string) : null;
    } catch (e) {
      return null;
    }
  }, [data]);

  const totalSavings = useMemo(() => {
    if (!transaction) return 0;
    return transaction.items.reduce((acc: number, item: ISuccessItem) => acc + item.discountAmount * item.quantity, 0);
  }, [transaction]);

  const handleShare = async () => {
    if (!transaction) return;
    try {
      const itemText = transaction.items.map((it: ISuccessItem) => `${it.name} x${it.quantity}`).join("\n");

      await Share.share({
        message: `*STRUK TOKO INTAN*\n\n${itemText}\n----------\nTotal: ${formatRupiah(transaction.total_price)}\nHemat: ${formatRupiah(totalSavings)}\nBayar: ${formatRupiah(transaction.money_receive)}\nKembali: ${formatRupiah(transaction.money_return)}\n\nTerima Kasih!`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (!transaction) return null;

  return (
    <ScreenWrapper bg="#F9FAFB">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* ICON & STATUS */}
        <View className="items-center py-10">
          <View className="items-center justify-center w-20 h-20 mb-4 rounded-full shadow-sm bg-emerald-100">
            <CheckCircle size={48} color="#059669" />
          </View>
          <Text className="text-2xl font-black text-gray-800">Pembayaran Berhasil</Text>
          <Text className="mt-1 text-gray-400">
            {new Date(transaction.transaction_date).toLocaleString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        {/* KARTU STRUK */}
        <View className="p-6 mx-6 bg-white border border-gray-100 shadow-sm rounded-3xl">
          <View className="flex-row justify-between mb-4">
            <Text className="font-medium text-gray-400">Kasir</Text>
            <Text className="font-bold text-gray-800 capitalize">{transaction.cashier_name}</Text>
          </View>

          <View className="my-4 border-t border-gray-200 border-dashed" />

          {/* DAFTAR BARANG */}
          <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Item Belanja</Text>
          <FlashList<ISuccessItem>
            data={transaction.items}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={({ item }) => (
              <View className="flex-row justify-between mb-3">
                <View className="flex-1 mr-4">
                  <Text className="font-bold text-gray-700" numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="text-xs text-gray-400">{item.quantity} x </Text>
                    {/* HARGA CORET JIKA ADA DISKON */}
                    {item.basePrice > item.price && <Text className="text-[10px] text-gray-300 line-through mr-1">{formatRupiah(item.basePrice)}</Text>}
                    <Text className="text-xs font-bold text-emerald-600">{formatRupiah(item.price)}</Text>
                  </View>
                </View>
                <Text className="font-bold text-gray-700">{formatRupiah(item.subtotal)}</Text>
              </View>
            )}
            scrollEnabled={false}
          />

          <View className="my-4 border-t border-gray-100" />

          {/* DETAIL PEMBAYARAN */}
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Total Tagihan</Text>
              <Text className="font-black text-gray-800">{formatRupiah(transaction.total_price)}</Text>
            </View>

            {/* TAMPILKAN TOTAL HEMAT JIKA ADA DISKON */}
            {totalSavings > 0 && (
              <View className="flex-row justify-between">
                <Text className="italic font-medium text-emerald-600">Total Hemat ✨</Text>
                <Text className="font-bold text-emerald-600">-{formatRupiah(totalSavings)}</Text>
              </View>
            )}

            <View className="flex-row justify-between">
              <Text className="text-gray-500">Uang Tunai</Text>
              <Text className="font-bold text-gray-800">{formatRupiah(transaction.money_receive)}</Text>
            </View>

            <View className="flex-row justify-between pt-2 mt-2 border-t border-gray-50">
              <Text className="text-lg font-black text-gray-800">Kembalian</Text>
              <Text className="text-lg font-black text-orange-500">{formatRupiah(transaction.money_return)}</Text>
            </View>
          </View>
        </View>

        {/* ACTION BUTTONS */}
        <View className="px-6 mt-10 mb-10 space-y-4 gap-y-4">
          <TouchableOpacity className="flex-row items-center justify-center py-5 shadow-lg bg-emerald-700 rounded-2xl shadow-emerald-200" onPress={() => router.replace("/(cashier)/(tabs)/home")}>
            <Home size={20} color="white" />
            <Text className="ml-3 text-base font-black text-white">Selesai & Kembali</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleShare} className="flex-row items-center justify-center py-4 bg-white border border-gray-200 rounded-2xl">
            <Share2 size={20} color="#374151" />
            <Text className="ml-2 font-bold text-gray-700">Bagikan Struk</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
