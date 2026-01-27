import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ArrowLeft, ArrowUpDown, Package } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import ScreenWrapper from "@/components/ScreenWrapper";
import SearchBar from "@/components/ui/SearchBar";
import { useDateFilter } from "@/hooks/useDateFilter";
import { useDebounce } from "@/hooks/useDebounce";
import reportService, { IReportResponse, ITopProduct } from "@/services/report.service";
import { FlashList } from "@shopify/flash-list";

export default function RankingsScreen() {
  const router = useRouter();
  const { getRange } = useDateFilter();
  const filters = getRange("month");

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("totalQty");
  const [order, setOrder] = useState("desc");

  const debouncedSearch = useDebounce(search, 500);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } = useInfiniteQuery<IReportResponse<ITopProduct[]>, Error>({
    queryKey: ["product-performance", filters, debouncedSearch, sortBy, order],
    initialPageParam: 1,
    placeholderData: (previousData) => previousData,

    queryFn: async ({ pageParam = 1 }) => {
      const res = await reportService.getTopProducts({
        ...filters,
        search: debouncedSearch,
        sortBy,
        order,
        page: pageParam as number,
        limit: 20,
      });
      return res;
    },

    getNextPageParam: (lastPage) => {
      const currentPage = lastPage?.pagination?.currentPage;
      const totalPages = lastPage?.pagination?.totalPages;

      if (typeof currentPage === "number" && typeof totalPages === "number" && currentPage < totalPages) {
        return currentPage + 1;
      }
      return undefined;
    },

    staleTime: 1000 * 60 * 5,
  });

  const products = useMemo(() => {
    return data?.pages?.flatMap((page) => (Array.isArray(page?.data) ? page.data : [])) || [];
  }, [data]);

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setOrder(order === "desc" ? "asc" : "desc");
    } else {
      setSortBy(field);
      setOrder("desc");
    }
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View className="flex-row items-center justify-between px-6 py-5 bg-white border-b border-slate-50">
      <View className="flex-[2] pr-2">
        <Text numberOfLines={2} className="text-[13px] font-bold text-slate-800 leading-4">
          {item.name}
        </Text>
        <View className="flex-row items-center mt-1">
          <Text className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Rank #{index + 1}</Text>
          {item.totalQty === 0 && (
            <View className="px-1.5 ml-2 bg-red-50 rounded">
              <Text className="text-[8px] font-bold text-red-500 uppercase">Tidak Laku</Text>
            </View>
          )}
        </View>
      </View>

      <View className="items-center flex-1">
        <View className={`px-2 py-0.5 rounded-lg ${item.margin < 10 ? "bg-orange-50" : "bg-emerald-50"}`}>
          <Text className={`text-[11px] font-black ${item.margin < 10 ? "text-orange-600" : "text-emerald-600"}`}>{Math.round(item.margin || 0)}%</Text>
        </View>
      </View>

      <View className="items-end flex-1">
        <Text className={`text-[14px] font-black ${item.totalQty === 0 ? "text-red-500" : "text-slate-800"}`}>{item.totalQty || 0}</Text>
        <Text className="text-[8px] font-black text-slate-300 uppercase">Pcs</Text>
      </View>
    </View>
  );

  return (
    <ScreenWrapper>
      <View className="flex-1 bg-white">
        {/* HEADER SECTION */}
        <View className="bg-white border-b border-slate-100">
          <View className="flex-row items-center px-6 py-4">
            <TouchableOpacity onPress={() => router.back()} className="p-2 mr-2 -ml-2">
              <ArrowLeft size={24} color="#1e293b" />
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-black text-slate-800">Performa Produk</Text>
              <Text className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Analisis Stok & Penjualan</Text>
            </View>
          </View>

          {/* 3. KOMPONEN SEARCH BAR */}
          <SearchBar value={search} onChangeText={setSearch} placeholder="Cari produk di Toko Intan..." />

          {/* SORTING TABS */}
          <View className="flex-row items-center px-6 mt-2 mb-4">
            <TouchableOpacity onPress={() => toggleSort("totalQty")} className={`flex-row items-center px-4 py-2 mr-2 rounded-full border ${sortBy === "totalQty" ? "bg-emerald-500 border-emerald-500" : "bg-white border-slate-200"}`}>
              <Text className={`text-[10px] font-black uppercase ${sortBy === "totalQty" ? "text-white" : "text-slate-400"}`}>{order === "asc" && sortBy === "totalQty" ? "Kurang Laku" : "Terlaris"}</Text>
              <View className="ml-1">
                <ArrowUpDown size={10} color={sortBy === "totalQty" ? "white" : "#94A3B8"} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => toggleSort("margin")} className={`flex-row items-center px-4 py-2 rounded-full border ${sortBy === "margin" ? "bg-emerald-500 border-emerald-500" : "bg-white border-slate-200"}`}>
              <Text className={`text-[10px] font-black uppercase ${sortBy === "margin" ? "text-white" : "text-slate-400"}`}>Margin {sortBy === "margin" && (order === "asc" ? "↑" : "↓")}</Text>
            </TouchableOpacity>
          </View>

          {/* COLUMN HEADERS */}
          <View className="flex-row items-center px-6 py-3 border-t bg-slate-50 border-slate-100">
            <Text className="flex-[2] text-[10px] font-black text-slate-400 uppercase tracking-widest">Produk</Text>
            <Text className="flex-1 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Margin</Text>
            <Text className="flex-1 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Terjual</Text>
          </View>
        </View>

        {/* LIST DENGAN INFINITE SCROLL */}
        <FlashList
          data={products}
          keyExtractor={(item, index) => `${item._id}-${index}`}
          renderItem={renderItem}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            !isLoading ? (
              <View className="items-center py-20">
                <Package size={40} color="#CBD5E1" />
                <Text className="mt-4 font-bold text-slate-400">Produk tidak ditemukan</Text>
              </View>
            ) : null
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-4">
                <ActivityIndicator color="#10b981" />
              </View>
            ) : (
              <View className="h-20" />
            )
          }
          refreshing={isLoading}
          onRefresh={refetch}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenWrapper>
  );
}
