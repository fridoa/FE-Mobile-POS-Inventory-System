import ScreenWrapper from "@/components/ScreenWrapper";
import PageHeader from "@/components/ui/PageHeader";
import ProductCard from "@/components/ui/ProductCard";
import SearchBar from "@/components/ui/SearchBar";
import { useDebounce } from "@/hooks/useDebounce";
import productService from "@/services/product.service";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { PackageSearch, Plus } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native";

export default function ProductScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const {
    data: products,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["product", debouncedSearch],
    queryFn: () => productService.getProduct(debouncedSearch),
  });

  return (
    <ScreenWrapper>
      <View className="flex-1 bg-white">
        <PageHeader title="Inventaris Produk" />

        <SearchBar placeholder="Cari nama produk atau SKU..." value={searchQuery} onChangeText={setSearchQuery} />

        <View className="flex-1 px-4 mt-2">
          {isLoading && !isRefetching ? (
            <View className="items-center justify-center flex-1">
              <ActivityIndicator size="large" color="#059669" />
            </View>
          ) : isError ? (
            <View className="items-center justify-center flex-1 p-6">
              <Text className="mb-2 text-lg font-bold text-gray-800">Gagal Memuat Data</Text>
              <TouchableOpacity onPress={() => refetch()} className="px-6 py-2 bg-emerald-600 rounded-xl">
                <Text className="font-bold text-white">Coba Lagi</Text>
              </TouchableOpacity>
            </View>
          ) : products && products.length > 0 ? (
            <FlatList
              data={products}
              keyExtractor={(item) => item._id || Math.random().toString()}
              renderItem={({ item }) => (
                <TouchableOpacity activeOpacity={0.7} onPress={() => router.push({ pathname: "/(admin)/home/product/editProduct/[_id]", params: { _id: item._id as string } })}>
                  <ProductCard item={item} />
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
              refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={["#059669"]} />}
            />
          ) : (
            <View className="items-center justify-center flex-1 p-10">
              <View className="p-6 mb-4 rounded-full bg-emerald-50">
                <PackageSearch size={64} color="#059669" />
              </View>
              <Text className="mb-1 text-lg font-bold text-gray-900">Produk Tidak Ditemukan</Text>
              <Text className="text-center text-gray-500">{searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : "Daftar produk Anda masih kosong."}</Text>
            </View>
          )}
        </View>

        <View className="absolute bottom-10 right-6">
          <TouchableOpacity onPress={() => router.push("/(admin)/home/product/addProduct")} className="flex-row items-center px-6 py-4 shadow-lg bg-emerald-600 rounded-2xl shadow-emerald-200" activeOpacity={0.9}>
            <Plus size={24} color="#FFFFFF" strokeWidth={3} />
            <Text className="ml-2 text-base font-bold text-white">Tambah</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}
