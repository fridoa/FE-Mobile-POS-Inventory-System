import BarcodeScanner from "@/components/BarcodeScanner";
import CustomAlert, { CustomAlertProps } from "@/components/CustomAlert";
import ScreenWrapper from "@/components/ScreenWrapper";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import { useDebounce } from "@/hooks/useDebounce";
import productService from "@/services/product.service";
import { CartItem, useCartStore } from "@/stores/cart.store";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { Minus, Plus, ScanLine, ShoppingCart } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

const POSScreen = () => {
  const router = useRouter();
  const { cart, addToCart, updateQty, clearCart, getTotalPrice, getTotalQty } = useCartStore();

  const [showScanner, setShowScanner] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const [alertConfig, setAlertConfig] = useState<CustomAlertProps>({
    isVisible: false,
    type: "danger",
    title: "Kosongkan Keranjang",
    message: "Semua barang di keranjang akan dihapus. Lanjutkan?",
    confirmText: "Kosongkan",
    onConfirm: () => {
      clearCart();
      setAlertConfig((prev) => ({ ...prev, isVisible: false }));
    },
    onCancel: () => setAlertConfig((prev) => ({ ...prev, isVisible: false })),
  });

  const handleFindProduct = useCallback(
    async (query: string) => {
      if (!query || query.length < 3) return;

      setIsLoading(true);
      try {
        const response = await productService.getProduct({ search: query });
        const products = response || [];

        if (products.length > 0) {
          addToCart(products[0]);
          Toast.show({
            type: "success",
            text1: "Barang ditambahkan",
            text2: products[0].name,
          });
          setSearchQuery("");
        }
      } catch (error) {
        console.error("Search Error:", error);
      } finally {
        setIsLoading(false);
        setShowScanner(false);
      }
    },
    [addToCart],
  );

  useEffect(() => {
    if (debouncedSearch) {
      handleFindProduct(debouncedSearch);
    }
  }, [debouncedSearch, handleFindProduct]);

  const renderItem = useCallback(
    ({ item }: { item: CartItem }) => {
      // Menangani potensi undefined dengan Default Value
      const discountedPrice = item.price ?? 0;
      const originalPrice = item.basePrice ?? 0;
      const hasDiscount = (item.discount ?? 0) > 0;

      return (
        <View className="flex-row p-4 mb-3 bg-white border border-gray-100 shadow-sm rounded-3xl">
          <Image source={{ uri: item.imageUrl || "https://via.placeholder.com/100" }} className="w-16 h-16 bg-gray-100 rounded-2xl" />
          <View className="justify-between flex-1 ml-4">
            <View>
              <Text className="text-sm font-bold text-gray-800" numberOfLines={1}>
                {item.name}
              </Text>

              {/* Logika Tampilan Harga: Price (Final) & BasePrice (Coret) */}
              <View className="flex-row items-center mt-1">
                <Text className="text-xs font-bold text-emerald-600">Rp {discountedPrice.toLocaleString("id-ID")}</Text>
                {hasDiscount && <Text className="ml-2 text-gray-400 text-[10px] line-through">Rp {originalPrice.toLocaleString("id-ID")}</Text>}
              </View>
            </View>

            <View className="flex-row items-center justify-between mt-2">
              <View className="flex-row items-center px-2 py-1 bg-gray-50 rounded-xl">
                <TouchableOpacity onPress={() => updateQty(item._id!, -1)} className="p-1">
                  <Minus size={16} color="#059669" />
                </TouchableOpacity>
                <Text className="mx-4 font-bold text-gray-800">{item.qty}</Text>
                <TouchableOpacity onPress={() => updateQty(item._id!, 1)} className="p-1">
                  <Plus size={16} color="#059669" />
                </TouchableOpacity>
              </View>

              {/* Subtotal per Item menggunakan harga setelah diskon */}
              <Text className="text-xs font-black text-gray-800">Rp {(discountedPrice * item.qty).toLocaleString("id-ID")}</Text>
            </View>
          </View>
        </View>
      );
    },
    [updateQty],
  );

  return (
    <ScreenWrapper>
      <View className="flex-1 bg-gray-50">
        <PageHeader
          title="Kasir"
          rightElement={
            cart.length > 0 && (
              <TouchableOpacity onPress={() => setAlertConfig((prev) => ({ ...prev, isVisible: true }))}>
                <Text className="text-xs font-bold text-red-500">Kosongkan</Text>
              </TouchableOpacity>
            )
          }
        />

        <View className="flex-row items-center pr-4 bg-white border-b border-gray-100">
          <View className="flex-1">
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Ketik Nama atau Scan..." />
          </View>
          <TouchableOpacity onPress={() => setShowScanner(true)} className="items-center justify-center w-12 h-12 shadow-lg bg-emerald-600 rounded-2xl shadow-emerald-200">
            <ScanLine size={24} color="white" />
          </TouchableOpacity>
        </View>

        {isLoading && searchQuery.length >= 3 && (
          <View className="items-center py-2 bg-emerald-50">
            <Text className="text-[10px] text-emerald-600 font-bold italic">Mencari produk...</Text>
          </View>
        )}

        <FlashList
          data={cart}
          keyExtractor={(item) => item._id!}
          contentContainerStyle={{ padding: 16, paddingBottom: 150 }}
          ListEmptyComponent={
            <View className="items-center justify-center mt-32">
              <View className="p-8 mb-4 bg-white rounded-full">
                <ShoppingCart size={64} color="#D1D5DB" />
              </View>
              <Text className="text-lg font-bold text-gray-400">Belum ada barang</Text>
              <Text className="text-sm text-gray-400">Mulai ketik atau scan barcode</Text>
            </View>
          }
          renderItem={renderItem}
        />

        <View className="absolute bottom-0 left-0 right-0 bg-white p-5 rounded-t-[40px] shadow-2xl border-t border-gray-100">
          <View className="flex-row items-center justify-between px-2 mb-4">
            <View>
              <Text className="text-xs font-bold text-gray-400 uppercase">Total Barang</Text>
              <Text className="font-bold text-gray-800">{getTotalQty()} Items</Text>
            </View>
            <View className="items-end">
              <Text className="text-xs font-bold text-gray-400 uppercase">Total Bayar</Text>
              <Text className="text-2xl font-black text-emerald-600">Rp {getTotalPrice().toLocaleString("id-ID")}</Text>
            </View>
          </View>

          <TouchableOpacity
            disabled={cart.length === 0}
            className={`w-full py-4 rounded-2xl items-center shadow-lg ${cart.length === 0 ? "bg-gray-300" : "bg-emerald-600 shadow-emerald-200"}`}
            onPress={() => router.push("/(cashier)/home/pos/payment" as any)}
          >
            <Text className="text-lg font-bold text-white">Lanjutkan Bayar</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={showScanner} animationType="slide">
          <BarcodeScanner onScanned={(sku) => handleFindProduct(sku)} onClose={() => setShowScanner(false)} />
        </Modal>

        <CustomAlert {...alertConfig} />
      </View>
    </ScreenWrapper>
  );
};

export default POSScreen;
