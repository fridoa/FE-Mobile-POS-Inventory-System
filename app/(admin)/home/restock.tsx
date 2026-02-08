import OfflineBanner from "@/components/OfflineBanner";
import { RestockCard } from "@/components/restockCard";
import ScreenWrapper from "@/components/ScreenWrapper";
import PageHeader from "@/components/ui/PageHeader";
import RestockCardSkeleton from "@/components/ui/skeleton/RestockCardSkeleton";
import { useRestock } from "@/hooks/useResctock";
import { IProduct } from "@/types/Product";
import { FlashList } from "@shopify/flash-list";
import { MessageCircle, PackageOpen } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { RefreshControl, StatusBar, Text, TouchableOpacity, View } from "react-native";

export default function RestockScreen() {
  const { products, isLoading, updateStock, isUpdating, refresh, shareToWhatsApp } = useRestock();

  const [plannedOrders, setPlannedOrders] = useState<Record<string, string>>({});

  const handleOrderChange = useCallback((id: string, val: string) => {
    setPlannedOrders((prev) => ({ ...prev, [id]: val }));
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: IProduct }) => (
      <RestockCard product={item} isUpdating={isUpdating} orderValue={plannedOrders[item._id!] || ""} onOrderChange={(val) => handleOrderChange(item._id!, val)} onUpdate={(newStock) => updateStock({ id: item._id!, newStock })} />
    ),
    [isUpdating, plannedOrders, handleOrderChange, updateStock],
  );

  const keyExtractor = useCallback((item: IProduct) => item._id!, []);

  return (
    <ScreenWrapper>
      <View className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" />
        <PageHeader title="Manajemen Restock" />
        <OfflineBanner message="Mode offline. Data stok mungkin tidak akurat." />

        {isLoading ? (
          <View className="flex-1 px-4 mt-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <RestockCardSkeleton key={i} />
            ))}
          </View>
        ) : (
          <View className="flex-1">
            <FlashList
              data={products}
              keyExtractor={keyExtractor}
              contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
              refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} tintColor="#059669" />}
              renderItem={renderItem}
              ListEmptyComponent={
                <View className="items-center justify-center px-10 mt-24">
                  <PackageOpen size={64} color="#D1D5DB" />
                  <Text className="mt-4 text-lg font-bold text-gray-800">Stok Toko Aman!</Text>
                </View>
              }
            />

            {/* Floating Action Button (FAB) WhatsApp */}
            {products.length > 0 && (
              <TouchableOpacity onPress={() => shareToWhatsApp(plannedOrders)} activeOpacity={0.9} className="absolute items-center justify-center w-16 h-16 rounded-full shadow-xl bottom-10 right-6 bg-emerald-600 shadow-emerald-400">
                <MessageCircle size={32} color="white" />
                <View className="absolute items-center justify-center w-6 h-6 bg-red-500 border-2 border-white rounded-full -top-1 -right-1">
                  <Text className="text-white text-[10px] font-bold">{Object.values(plannedOrders).filter((v) => parseInt(v) > 0).length}</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
}
