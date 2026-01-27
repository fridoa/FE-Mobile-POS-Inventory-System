import BarcodeScanner from "@/components/BarcodeScanner";
import CustomAlert, { CustomAlertProps } from "@/components/CustomAlert";
import ScreenWrapper from "@/components/ScreenWrapper";
import PageHeader from "@/components/ui/PageHeader";
import productService from "@/services/product.service";
import { CartItem, useCartStore } from "@/stores/cart.store";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { Minus, Plus, ScanLine, Search, ShoppingCart, X } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Image, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

const POSScreen = () => {
  const { cart, addToCart, updateQty, clearCart, getTotalPrice, getTotalQty } = useCartStore();

  const [showScanner, setShowScanner] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState<CustomAlertProps>({
    isVisible: false,
    type: "danger",
    title: "Kosongkan Keranjang",
    message: "Semua barang di keranjang akan dihapus. Lanjutkan?",
    confirmText: "Kosongkan",
    onConfirm: () => {},
    onCancel: () => {},
  });

  const handleFindProduct = useCallback(
    async (sku: string) => {
      if (!sku) return;
      setIsLoading(true);
      try {
        const products = await productService.getProduct({ search: sku });
        if (products.length > 0) {
          addToCart(products[0]);
          Toast.show({ type: "success", text1: "Barang ditambahkan", text2: products[0].name });
        } else {
          Toast.show({ type: "error", text1: "Produk tidak ditemukan", text2: `SKU: ${sku}` });
        }
      } catch (error) {
        Toast.show({ type: "error", text1: "Gagal memproses" });
      } finally {
        setIsLoading(false);
        setShowScanner(false);
        setSearchQuery("");
      }
    },
    [addToCart],
  );

  const handleClearCart = useCallback(() => {
    setAlertConfig({
      isVisible: true,
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
  }, [clearCart]);

  const handleSearchChange = useCallback((text: string) => setSearchQuery(text), []);
  const handleSearchSubmit = useCallback(() => handleFindProduct(searchQuery), [searchQuery, handleFindProduct]);
  const handleScannerOpen = useCallback(() => setShowScanner(true), []);
  const handleScannerClose = useCallback(() => setShowScanner(false), []);

  const keyExtractor = useCallback((item: CartItem) => item._id as string, []);

  const renderItem = useCallback(
    ({ item }: { item: CartItem }) => {
      const originalPrice = Number(item.price);
      const discount = item.discount ?? 0;
      const finalPrice = originalPrice - (originalPrice * discount) / 100;

      return (
        <View className="flex-row p-4 mb-3 bg-white border shadow-sm rounded-3xl border-gray-50">
          <Image source={{ uri: item.imageUrl || "https://via.placeholder.com/100" }} className="w-16 h-16 bg-gray-100 rounded-2xl" />
          <View className="justify-between flex-1 ml-4">
            <View>
              <Text className="text-sm font-bold text-gray-800" numberOfLines={1}>
                {item.name}
              </Text>
              <View className="flex-row items-center mt-1">
                <Text className="text-xs font-bold text-emerald-600">Rp {finalPrice.toLocaleString("id-ID")}</Text>
                {discount > 0 && <Text className="text-gray-300 text-[10px] line-through ml-2">Rp {originalPrice.toLocaleString("id-ID")}</Text>}
              </View>
            </View>
            <View className="flex-row items-center justify-between mt-2">
              <View className="flex-row items-center px-2 py-1 bg-gray-50 rounded-xl">
                <TouchableOpacity onPress={() => updateQty(item._id as string, -1)} className="p-1">
                  <Minus size={16} color="#059669" />
                </TouchableOpacity>
                <Text className="mx-4 font-bold text-gray-800">{item.qty}</Text>
                <TouchableOpacity onPress={() => updateQty(item._id as string, 1)} className="p-1">
                  <Plus size={16} color="#059669" />
                </TouchableOpacity>
              </View>
              <Text className="text-xs font-black text-gray-800">Rp {(finalPrice * item.qty).toLocaleString("id-ID")}</Text>
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
          title="Buat Pesanan"
          rightElement={
            cart.length > 0 && (
              <TouchableOpacity onPress={handleClearCart}>
                <Text className="text-xs font-bold text-red-500">Kosongkan</Text>
              </TouchableOpacity>
            )
          }
        />

        {/* Bar Pencarian & Scan */}
        <View className="flex-row gap-3 px-4 py-3 bg-white border-b border-gray-100">
          <View className="flex-row items-center flex-1 h-12 px-4 bg-gray-100 rounded-2xl">
            <Search size={18} color="#9CA3AF" />
            <TextInput className="flex-1 ml-2 text-sm font-medium" placeholder="Ketik SKU atau Nama..." value={searchQuery} onChangeText={handleSearchChange} onSubmitEditing={handleSearchSubmit} />
            {searchQuery !== "" && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <X size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={handleScannerOpen} className="items-center justify-center w-12 h-12 shadow-lg bg-emerald-600 rounded-2xl shadow-emerald-200">
            <ScanLine size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Daftar Belanjaan */}
        <FlashList
          data={cart}
          keyExtractor={keyExtractor}
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
          ListEmptyComponent={
            <View className="items-center justify-center mt-32">
              <View className="p-8 mb-4 bg-white rounded-full">
                <ShoppingCart size={64} color="#D1D5DB" />
              </View>
              <Text className="text-lg font-bold text-gray-400">Keranjang Kosong</Text>
              <Text className="text-sm text-gray-400">Scan barcode barang untuk memulai</Text>
            </View>
          }
          renderItem={renderItem}
        />

        {/* Footer Summary */}
        <View className="absolute bottom-0 left-0 right-0 bg-white p-5 rounded-t-[40px] shadow-2xl border-t border-gray-100">
          <View className="flex-row items-center justify-between px-2 mb-4">
            <View>
              <Text className="text-xs font-bold tracking-wider text-gray-400 uppercase">Total Barang</Text>
              <Text className="font-bold text-gray-800">{getTotalQty()} Items</Text>
            </View>
            <View className="items-end">
              <Text className="text-xs font-bold tracking-wider text-gray-400 uppercase">Total Bayar</Text>
              <Text className="text-2xl font-black text-emerald-600">Rp {getTotalPrice().toLocaleString("id-ID")}</Text>
            </View>
          </View>

          <TouchableOpacity
            disabled={cart.length === 0}
            className={`w-full py-4 rounded-2xl items-center shadow-lg ${cart.length === 0 ? "bg-gray-300" : "bg-emerald-600 shadow-emerald-200"}`}
            onPress={() => router.push("/(cashier)/home/pos/payment")}
          >
            <Text className="text-lg font-bold text-white">Lanjutkan Pembayaran</Text>
          </TouchableOpacity>
        </View>

        {/* Modal Scanner */}
        <Modal visible={showScanner} animationType="slide">
          <BarcodeScanner onScanned={handleFindProduct} onClose={handleScannerClose} />
          {isLoading && (
            <View className="absolute inset-0 items-center justify-center bg-black/50">
              <ActivityIndicator size="large" color="white" />
            </View>
          )}
        </Modal>

        <CustomAlert {...alertConfig} />
      </View>
    </ScreenWrapper>
  );
};

export default POSScreen;
