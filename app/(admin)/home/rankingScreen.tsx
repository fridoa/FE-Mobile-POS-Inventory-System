import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ArrowUpDown, Package } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import ScreenWrapper from "@/components/ScreenWrapper";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import ProductRankingSkeleton from "@/components/ui/skeleton/Report/ProductRankingSkeleton";
import { useDateFilter } from "@/hooks/useDateFilter";
import { useDebounce } from "@/hooks/useDebounce";
import reportService, { IReportResponse, ITopProduct } from "@/services/report.service";
import { useLocalSearchParams } from "expo-router";

export default function RankingsScreen() {
  const { startDate, endDate } = useLocalSearchParams<{ startDate?: string; endDate?: string }>();
  const { getRange } = useDateFilter();
  
  const filters = useMemo(() => {
    if (startDate && endDate) {
      return { startDate, endDate };
    }
    return getRange("month");
  }, [startDate, endDate, getRange]);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("totalQty");
  const [order, setOrder] = useState("desc");

  const debouncedSearch = useDebounce(search, 500);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch, isRefetching } = useInfiniteQuery<IReportResponse<ITopProduct[]>, Error>({
    queryKey: ["product-performance", filters, debouncedSearch, sortBy, order],
    initialPageParam: 1,
    placeholderData: (previousData) => previousData,
    queryFn: async ({ pageParam = 1 }) => {
      return await reportService.getTopProducts({
        ...filters,
        search: debouncedSearch,
        sortBy,
        order,
        page: pageParam as number,
        limit: 20,
      });
    },
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage?.pagination || {};
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });

  const products = useMemo(() => {
    return data?.pages?.flatMap((page) => (Array.isArray(page?.data) ? page.data : [])) || [];
  }, [data]);

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortBy(field);
      setOrder("desc");
    }
  };

  const renderItem = useCallback(
    ({ item, index }: { item: ITopProduct; index: number }) => (
      <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-slate-50">
        <View className="flex-[2.5] pr-2">
          <Text numberOfLines={1} className="text-[14px] font-bold text-slate-800">
            {item.name}
          </Text>
          <View className="flex-row items-center mt-1">
            <View className={`px-1.5 py-0.5 rounded-md ${index < 3 ? "bg-amber-100" : "bg-slate-100"}`}>
              <Text className={`text-[9px] font-black uppercase tracking-tighter ${index < 3 ? "text-amber-700" : "text-slate-500"}`}>Rank #{index + 1}</Text>
            </View>
            {item.totalQty === 0 && (
              <View className="px-1.5 ml-2 bg-red-50 rounded">
                <Text className="text-[8px] font-bold text-red-500 uppercase">Stok Mati</Text>
              </View>
            )}
          </View>
        </View>

        <View className="items-center flex-1">
          <View className={`px-2 py-1 rounded-lg ${item.margin < 10 ? "bg-orange-50" : "bg-emerald-50"}`}>
            <Text className={`text-[11px] font-black ${item.margin < 10 ? "text-orange-600" : "text-emerald-600"}`}>{Math.round(item.margin || 0)}%</Text>
          </View>
        </View>

        <View className="items-end flex-1">
          <Text className={`text-[15px] font-black ${item.totalQty === 0 ? "text-red-500" : "text-slate-800"}`}>{item.totalQty || 0}</Text>
          <Text className="text-[8px] font-black text-slate-400 uppercase">Terjual</Text>
        </View>
      </View>
    ),
    [],
  );

  return (
    <ScreenWrapper>
      <View className="flex-1 bg-white">
        <PageHeader title="Ranking Produk" />

        {/* HEADER CONTROLS */}
        <View className="bg-white border-b border-slate-100">
          <SearchBar value={search} onChangeText={setSearch} placeholder="Cari produk di Toko Intan..." />

          <View className="flex-row items-center px-6 mt-1 mb-4">
            <TouchableOpacity onPress={() => toggleSort("totalQty")} className={`flex-row items-center px-4 py-2 mr-2 rounded-full border ${sortBy === "totalQty" ? "bg-emerald-600 border-emerald-600" : "bg-white border-slate-200"}`}>
              <Text className={`text-[10px] font-black uppercase ${sortBy === "totalQty" ? "text-white" : "text-slate-500"}`}>{sortBy === "totalQty" ? (order === "desc" ? "Terlaris" : "Kurang Laku") : "Volume"}</Text>
              <View className="ml-1.5">
                <ArrowUpDown size={10} color={sortBy === "totalQty" ? "white" : "#94A3B8"} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => toggleSort("margin")} className={`flex-row items-center px-4 py-2 rounded-full border ${sortBy === "margin" ? "bg-emerald-600 border-emerald-600" : "bg-white border-slate-200"}`}>
              <Text className={`text-[10px] font-black uppercase ${sortBy === "margin" ? "text-white" : "text-slate-500"}`}>Margin {sortBy === "margin" ? (order === "desc" ? "↓" : "↑") : ""}</Text>
            </TouchableOpacity>
          </View>

          {/* TABLE HEADERS */}
          <View className="flex-row items-center px-6 py-3 border-t bg-slate-50/80 border-slate-100">
            <Text className="flex-[2.5] text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Produk</Text>
            <Text className="flex-1 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Margin (%)</Text>
            <Text className="flex-1 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</Text>
          </View>
        </View>

        {/* LIST SECTION */}
        <View className="flex-1">
          {isLoading && products.length === 0 ? (
            <View className="flex-1">
              {[...Array(8)].map((_, i) => (
                <ProductRankingSkeleton key={i} />
              ))}
            </View>
          ) : (
            <FlashList
              data={products}
              keyExtractor={(item, index) => `${item._id}-${index}`}
              renderItem={renderItem}
              onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) fetchNextPage();
              }}
              onEndReachedThreshold={0.3}
              ListEmptyComponent={
                <View className="items-center justify-center py-20">
                  <Package size={48} color="#E2E8F0" />
                  <Text className="px-10 mt-4 font-bold text-center text-slate-400">{debouncedSearch ? `Produk "${debouncedSearch}" tidak ditemukan` : "Belum ada data penjualan bulan ini"}</Text>
                </View>
              }
              ListFooterComponent={
                isFetchingNextPage ? (
                  <View className="py-6">
                    <ActivityIndicator color="#059669" />
                  </View>
                ) : (
                  <View className="h-20" />
                )
              }
              refreshing={isRefetching}
              onRefresh={refetch}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
}
