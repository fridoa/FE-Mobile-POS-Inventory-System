import { AlertCircle, History as HistoryIcon, Package, Tag, Wallet, X } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Dimensions, Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BarcodeScanner from "@/components/BarcodeScanner";
import productService from "@/services/product.service";
import { IProduct } from "@/types/Product";
import formatRupiah from "@/utils/formatRupiah";

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
      translateY.value = withSpring(0, { damping: 18, stiffness: 90 });
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
        setError("Produk tidak ditemukan di database Toko Intan");
      }
    } catch (err) {
      setError("Gagal mengambil data. Cek koneksi server Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  const closeSheet = () => {
    setScannedProduct(null);
    setError(null);
  };

  const priceDisplay = useMemo(() => {
    if (!scannedProduct) return null;
    const basePrice = scannedProduct.price ?? 0;
    const discount = scannedProduct.discount ?? 0;
    const hasDiscount = discount > 0;
    const finalPrice = hasDiscount ? basePrice - (basePrice * discount) / 100 : basePrice;

    return { basePrice, finalPrice, discount, hasDiscount };
  }, [scannedProduct]);

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 1. SCANNER ENGINE */}
      <BarcodeScanner onScanned={handleScan} />

      {/* 2. OVERLAY INSTRUCTIONS */}
      {!scannedProduct && !error && (
        <View style={{ top: insets.top + 20 }} className="absolute left-0 right-0 items-center">
          <View className="px-6 py-3 border rounded-full bg-black/60 border-white/20 backdrop-blur-md">
            {isLoading ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator color="#10b981" size="small" />
                <Text className="font-bold text-white">Memproses Barcode...</Text>
              </View>
            ) : (
              <Text className="text-sm font-medium text-white">Arahkan kamera ke Barcode Produk</Text>
            )}
          </View>
        </View>
      )}

      {/* 3. PRODUCT INFORMATION SHEET */}
      <Animated.View style={[animatedStyle, { paddingBottom: insets.bottom }]} className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[40px] shadow-2xl h-[75%]">
        {/* Close Button Handle */}
        <TouchableOpacity onPress={closeSheet} className="absolute self-center p-3 bg-white border border-gray-100 rounded-full shadow-xl -top-14">
          <X size={28} color="#059669" />
        </TouchableOpacity>

        <View className="flex-1 p-6">
          {error ? (
            <View className="items-center justify-center flex-1">
              <View className="p-6 mb-4 rounded-full bg-red-50">
                <AlertCircle size={60} color="#ef4444" />
              </View>
              <Text className="text-xl font-black text-center text-gray-800">{error}</Text>
              <TouchableOpacity onPress={closeSheet} className="px-10 py-4 mt-8 bg-gray-900 rounded-3xl">
                <Text className="font-black text-white">SCAN ULANG</Text>
              </TouchableOpacity>
            </View>
          ) : scannedProduct && priceDisplay ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* HEADER: IMAGE & NAME */}
              <View className="flex-row items-center gap-5 mb-8">
                <View className="w-28 h-28 bg-gray-50 rounded-[32px] border border-gray-100 items-center justify-center overflow-hidden">
                  {scannedProduct.imageUrl ? <Image source={{ uri: scannedProduct.imageUrl }} className="w-full h-full" /> : <Package size={40} color="#D1D5DB" />}
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2 mb-1">
                    <Text className="text-[10px] font-black text-emerald-600 uppercase tracking-[2px]">Toko Intan</Text>
                    {priceDisplay.hasDiscount && (
                      <View className="bg-red-500 px-2 py-0.5 rounded-md">
                        <Text className="text-[8px] font-black text-white">PROMO</Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-2xl font-black leading-7 text-gray-800" numberOfLines={2}>
                    {scannedProduct.name}
                  </Text>
                  <Text className="mt-1 text-xs font-bold tracking-widest text-gray-400 uppercase">{scannedProduct.sku}</Text>
                </View>
              </View>

              {/* PRICE & STOCK GRID */}
              <View className="flex-row gap-4 mb-6">
                {/* HARGA JUAL */}
                <View className="flex-1 bg-emerald-50/50 border border-emerald-100 p-5 rounded-[32px]">
                  <View className="flex-row items-center gap-2 mb-3">
                    <Wallet size={16} color="#059669" />
                    <Text className="text-[10px] font-bold text-emerald-800/50 uppercase tracking-widest">Harga Jual</Text>
                  </View>
                  <Text className="text-2xl font-black text-emerald-900">{formatRupiah(priceDisplay.finalPrice)}</Text>
                  {priceDisplay.hasDiscount && (
                    <View className="flex-row items-center mt-1 gap-1.5">
                      <Text className="text-xs text-gray-400 line-through">{formatRupiah(priceDisplay.basePrice)}</Text>
                      <View className="bg-red-100 px-1.5 py-0.5 rounded-lg">
                        <Text className="text-[10px] font-black text-red-600">-{priceDisplay.discount}%</Text>
                      </View>
                    </View>
                  )}
                </View>

                {/* SISA STOK */}
                <View className="flex-1 bg-slate-50 border border-slate-100 p-5 rounded-[32px]">
                  <View className="flex-row items-center gap-2 mb-3">
                    <Package size={16} color="#64748b" />
                    <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sisa Stok</Text>
                  </View>
                  <Text className={`text-2xl font-black ${(scannedProduct.stock ?? 0) <= 5 ? "text-red-600" : "text-slate-800"}`}>
                    {scannedProduct.stock ?? 0}
                    <Text className="text-xs font-medium text-slate-400"> Pcs</Text>
                  </Text>
                  {(scannedProduct.stock ?? 0) <= 5 && <Text className="text-[9px] font-bold text-red-500 mt-1 uppercase italic">Stok Menipis!</Text>}
                </View>
              </View>

              {/* ADDITIONAL SPECS */}
              <View className="bg-gray-50 p-6 rounded-[32px] space-y-4">
                <View className="flex-row items-center justify-between pb-4 border-b border-gray-100">
                  <View className="flex-row items-center gap-3">
                    <Tag size={20} color="#94A3B8" />
                    <Text className="font-medium text-gray-500">Kategori</Text>
                  </View>
                  <Text className="font-bold text-gray-800">{typeof scannedProduct.category === "object" ? scannedProduct.category.name : "Umum"}</Text>
                </View>

                <View className="flex-row items-center justify-between pt-2">
                  <View className="flex-row items-center gap-3">
                    <HistoryIcon size={20} color="#94A3B8" />
                    <Text className="font-medium text-gray-500">Data Terupdate</Text>
                  </View>
                  <Text className="font-bold text-gray-800">{scannedProduct.updatedAt ? new Date(scannedProduct.updatedAt).toLocaleDateString("id-ID") : "-"}</Text>
                </View>
              </View>

              {/* BOTTOM ACTIONS (Optional) */}
              <View className="flex-row gap-3 mt-6">
                <TouchableOpacity className="flex-1 bg-emerald-600 p-5 rounded-[24px] items-center shadow-lg shadow-emerald-200">
                  <Text className="text-xs font-black tracking-widest text-white uppercase">Update Stok</Text>
                </TouchableOpacity>
              </View>

              <View className="h-20" />
            </ScrollView>
          ) : (
            <View className="items-center justify-center flex-1">
              <ActivityIndicator size="large" color="#10b981" />
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

export default InventoryScreen;
