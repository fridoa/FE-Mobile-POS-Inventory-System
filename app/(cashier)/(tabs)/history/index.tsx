import HistoryFilterModal from "@/components/HistoryFilterModal";
import HistoryItem from "@/components/HistoryItem";
import TransactionDetailModal from "@/components/TransactionDetailModal";
import HistoryItemSkeleton from "@/components/ui/skeleton/HistoryItemSkeleton";
import transactionService, { ITransactionHistoryItem } from "@/services/transaction.service";
import { useAuthStore } from "@/stores/auth.store";
import { FilterType, useHistoryStore } from "@/stores/history.store";
import { FlashList } from "@shopify/flash-list";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { ChevronRight, Filter, ShoppingBag } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { filters, setFilters } = useHistoryStore();

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTrx, setSelectedTrx] = useState<ITransactionHistoryItem | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isRefetching, refetch } = useInfiniteQuery({
    queryKey: ["history", filters, user?._id],
    queryFn: ({ pageParam = 1 }) =>
      transactionService.getAll({
        page: pageParam as number,
        limit: 10,
        cashierId: user?._id,
        startDate: filters.startDate,
        endDate: filters.endDate,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    enabled: !!user?._id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60 * 24 * 7,
    placeholderData: keepPreviousData,
    refetchOnMount: "always",
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const flatData = useMemo(() => data?.pages.flatMap((page) => page.data) || [], [data]);

  const handleApplyFilter = (type: FilterType, start: Date, end: Date) => {
    const todayStr = new Date().toISOString().split("T")[0];
    let startDate: string | undefined;
    let endDate: string | undefined;
    let label = "";

    if (type === "today") {
      startDate = todayStr;
      endDate = todayStr;
      label = "Hari Ini";
    } else if (type === "7days") {
      const d = new Date();
      d.setDate(new Date().getDate() - 7);
      startDate = d.toISOString().split("T")[0];
      endDate = todayStr;
      label = "7 Hari Terakhir";
    } else if (type === "month") {
      const y = start.getFullYear();
      const m = start.getMonth();
      startDate = new Date(y, m, 1).toISOString().split("T")[0];
      endDate = new Date(y, m + 1, 0).toISOString().split("T")[0];
      label = start.toLocaleString("id-ID", { month: "long", year: "numeric" });
    } else if (type === "custom") {
      startDate = start.toISOString().split("T")[0];
      endDate = end.toISOString().split("T")[0];
      label = `${start.toLocaleDateString("id-ID", { day: "numeric", month: "short" })} - ${end.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}`;
    } else {
      label = "Semua Transaksi";
    }

    setFilters({ type, startDate, endDate, displayLabel: label });
    setFilterModalVisible(false);
  };

  const renderItem = useCallback(
    ({ item }: { item: ITransactionHistoryItem }) => (
      <HistoryItem
        item={item}
        onPress={() => {
          setSelectedTrx(item);
          setDetailModalVisible(true);
        }}
      />
    ),
    [],
  );

  const keyExtractor = useCallback((item: ITransactionHistoryItem) => item._id, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC", paddingTop: insets.top }}>
      <StatusBar barStyle="dark-content" />

      <View className="px-6 py-4 bg-white border-b border-slate-100">
        <Text className="mb-4 text-2xl font-black text-slate-800">Riwayat</Text>
        <TouchableOpacity onPress={() => setFilterModalVisible(true)} className="flex-row items-center justify-between p-4 bg-white border-2 shadow-sm border-emerald-50 rounded-2xl">
          <View className="flex-row items-center flex-1">
            <View className="p-2 mr-3 rounded-lg bg-emerald-50">
              <Filter size={18} color="#059669" />
            </View>
            <View>
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rentang Waktu</Text>
              <Text className="text-sm font-bold text-emerald-700">{filters.displayLabel}</Text>
            </View>
          </View>
          <ChevronRight size={20} color="#059669" />
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        {isLoading && flatData.length === 0 ? (
          <View className="px-5 pt-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <HistoryItemSkeleton key={i} />
            ))}
          </View>
        ) : (
          <FlashList<ITransactionHistoryItem>
            data={flatData}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            onRefresh={refetch}
            refreshing={isRefetching}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
            onEndReachedThreshold={0.5}
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
            ListEmptyComponent={
              !isLoading ? (
                <View className="items-center justify-center mt-20 opacity-40">
                  <ShoppingBag size={80} color="#94A3B8" />
                  <Text className="mt-4 text-lg font-bold text-slate-500">Belum Ada Data</Text>
                  <Text className="px-10 text-sm text-center text-slate-400">{`Tidak ada transaksi pada "${filters.displayLabel}"`}</Text>
                </View>
              ) : (
                <ActivityIndicator color="#059669" className="mt-20" />
              )
            }
          />
        )}
      </View>

      <HistoryFilterModal visible={filterModalVisible} onClose={() => setFilterModalVisible(false)} currentType={filters.type} onApply={handleApplyFilter} />

      <TransactionDetailModal visible={detailModalVisible} onClose={() => setDetailModalVisible(false)} transaction={selectedTrx} />
    </View>
  );
}
