import BarcodeScanner from "@/components/BarcodeScanner";
import NavigationBar from "@/components/NavigationBar";
import productService from "@/services/product.service";
import { IProduct } from "@/types/Product";
import { AlertCircle, History as HistoryIcon, Package, Tag, Wallet, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const InventoryScreen = () => {
  const [scannedProduct, setScannedProduct] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const translateY = useSharedValue(SCREEN_HEIGHT);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    if (scannedProduct || error) {
      translateY.value = withSpring(0, { damping: 15, stiffness: 90 });
    } else {
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 });
    }
  }, [scannedProduct, error]);

  const handleScan = async (sku: string) => {
    if (isLoading || scannedProduct || error) return;

    setIsLoading(true);
    setError(null);

    try {
      const product = await productService.getProductBySKU(sku);
      if (product) {
        setScannedProduct(product);
      } else {
        setError("Produk tidak terdaftar di sistem");
      }
    } catch (err) {
      setError("Gagal mengambil data produk. Periksa koneksi Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  const closeSheet = () => {
    setScannedProduct(null);
    setError(null);
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <BarcodeScanner onScanned={handleScan} />

      {!scannedProduct && !error && (
        <View style={{ top: insets.top + 20 }} className="absolute left-0 right-0 items-center">
          <View className="px-6 py-3 border rounded-full bg-black/50 border-white/20 backdrop-blur-md">
            {isLoading ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator color="white" size="small" />
                <Text className="text-sm font-medium text-white">Mencari data...</Text>
              </View>
            ) : (
              <Text className="text-sm italic font-medium text-center text-white">Arahkan kamera ke Barcode Produk</Text>
            )}
          </View>
        </View>
      )}

      <Animated.View style={[animatedStyle, { paddingBottom: insets.bottom + 20 }]} className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[40px] p-6 shadow-2xl h-[70%]">
        <TouchableOpacity onPress={closeSheet} className="absolute self-center p-3 bg-white border border-gray-100 rounded-full shadow-lg -top-12">
          <X size={24} color="#059669" />
        </TouchableOpacity>

        {error ? (
          <View className="items-center justify-center flex-1 p-6">
            <AlertCircle size={64} color="#ef4444" />
            <Text className="mt-4 text-xl font-bold text-center text-gray-800">{error}</Text>
            <TouchableOpacity onPress={closeSheet} className="px-10 py-3 mt-8 bg-gray-100 rounded-2xl">
              <Text className="font-bold text-gray-600">Scan Lagi</Text>
            </TouchableOpacity>
          </View>
        ) : scannedProduct ? (
          <ScrollView showsVerticalScrollIndicator={false} className="mt-2">
            <View className="flex-row items-center gap-5 mb-8">
              <View className="items-center justify-center w-24 h-24 overflow-hidden border border-gray-100 bg-gray-50 rounded-3xl">
                {scannedProduct.imageUrl ? <Image source={{ uri: scannedProduct.imageUrl }} className="w-full h-full" /> : <Package size={40} color="#D1D5DB" />}
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-800" numberOfLines={2}>
                  {scannedProduct.name}
                </Text>
                <View className="self-start px-3 py-1 mt-2 rounded-lg bg-emerald-100">
                  <Text className="text-xs font-bold tracking-wider uppercase text-emerald-700">{scannedProduct.sku}</Text>
                </View>
              </View>
            </View>

            <View className="flex-row gap-4 mb-8">
              <View className="flex-1 p-5 border bg-emerald-50/50 rounded-3xl border-emerald-100">
                <View className="flex-row items-center gap-2 mb-2">
                  <Wallet size={16} color="#059669" />
                  <Text className="text-[10px] font-bold uppercase text-emerald-700/60 tracking-widest">Harga Jual</Text>
                </View>
                <Text className="text-xl font-black text-emerald-900">Rp {scannedProduct.price?.toLocaleString("id-ID") ?? "0"}</Text>
              </View>

              <View className="flex-1 p-5 border border-orange-100 bg-orange-50/50 rounded-3xl">
                <View className="flex-row items-center gap-2 mb-2">
                  <Package size={16} color="#f97316" />
                  <Text className="text-[10px] font-bold uppercase text-orange-700/60 tracking-widest">Sisa Stok</Text>
                </View>
                <Text className={`text-xl font-black ${(scannedProduct.stock ?? 0) <= (scannedProduct.minStock ?? 5) ? "text-red-600" : "text-orange-900"}`}>
                  {scannedProduct.stock ?? 0}
                  <Text className="text-xs font-medium text-orange-700/40"> Pcs</Text>
                </Text>
              </View>
            </View>

            <View className="p-5 space-y-4 bg-gray-50 rounded-3xl">
              <View className="flex-row items-center justify-between pb-4 border-b border-gray-100">
                <View className="flex-row items-center gap-3">
                  <Tag size={20} color="#9CA3AF" />
                  <Text className="font-medium text-gray-500">Kategori</Text>
                </View>
                <Text className="font-bold text-gray-800">{typeof scannedProduct.category === "object" ? scannedProduct.category.name : "Umum"}</Text>
              </View>

              <View className="flex-row items-center justify-between pt-2">
                <View className="flex-row items-center gap-3">
                  <HistoryIcon size={20} color="#9CA3AF" />
                  <Text className="font-medium text-gray-500">Update Terakhir</Text>
                </View>
                <Text className="font-bold text-gray-800">{scannedProduct.updatedAt ? new Date(scannedProduct.updatedAt).toLocaleDateString("id-ID") : "-"}</Text>
              </View>
            </View>

            <View className="h-20" />
          </ScrollView>
        ) : (
          <View className="items-center justify-center flex-1">
            <ActivityIndicator size="large" color="#059669" />
          </View>
        )}
      </Animated.View>

    </View>
  );
};

export default InventoryScreen;
