import { useQuery } from "@tanstack/react-query";
import { Calendar, ChevronRight, Trophy } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";

import FinancialSummary from "@/components/FinancialSummary";
import RevenueChart from "@/components/RevenueChart";
import ScreenWrapper from "@/components/ScreenWrapper";
import PageHeader from "@/components/ui/PageHeader";

import HistoryFilterModal from "@/components/HistoryFilterModal";
import { FinancialSummarySkeleton } from "@/components/ui/skeleton/Report/FinancialSummarySkeleton";
import { RevenueChartSkeleton } from "@/components/ui/skeleton/Report/RevenueChartSkeleton";
import Skeleton from "@/components/ui/skeleton/Skeleton";
import { FilterType, formatLocal, useDateFilter } from "@/hooks/useDateFilter";
import reportService from "@/services/report.service";
import { router } from "expo-router";

export default function SalesReportScreen() {
  const { activeFilter, setActiveFilter, getRange } = useDateFilter();

  const [filters, setFilters] = useState(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    return {
      startDate: formatLocal(firstDay),
      endDate: formatLocal(now),
    };
  });

  const [isModalVisible, setIsModalVisible] = useState(false);

  const chartFilterType = useMemo<"7days" | "month" | "year" | "all">(() => {
    switch (activeFilter) {
      case "today":
      case "7days":
        return "7days";
      case "month":
      case "custom":
        return "month";
      case "year":
        return "year";
      default:
        return "all";
    }
  }, [activeFilter]);

  const {
    data: summaryRes,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["sales-summary", filters],
    queryFn: () => reportService.getSalesSummary(filters),
    staleTime: 1000 * 60 * 5,
  });

  const summary = summaryRes?.data;

  const handleApplyModal = (type: FilterType, start: Date, end: Date) => {
    setActiveFilter(type);

    if (type === "month") {
      const firstDay = new Date(start.getFullYear(), start.getMonth(), 1);
      const lastDay = new Date(start.getFullYear(), start.getMonth() + 1, 0);

      setFilters({
        startDate: formatLocal(firstDay),
        endDate: formatLocal(lastDay),
      });
    } else if (type === "all") {
      setFilters({ startDate: "", endDate: "" });
    } else if (type === "custom") {
      setFilters({
        startDate: formatLocal(start),
        endDate: formatLocal(end),
      });
    } else {
      const range = getRange(type);
      setFilters(range);
    }
    setIsModalVisible(false);
  };

  return (
    <ScreenWrapper>
      <View className="flex-1 bg-slate-50">
        <PageHeader title="Analisis Penjualan" />

        {/* SECTION: FILTER DROPDOWN */}
        <View className="px-5 mb-4 ">
          <TouchableOpacity onPress={() => setIsModalVisible(true)} className="flex-row items-center justify-between p-4 bg-white border shadow-sm border-gray-50 rounded-2xl shadow-slate-100">
            <View className="flex-row items-center">
              <View className="p-2 mr-3 rounded-xl bg-emerald-50">
                <Calendar size={18} color="#059669" />
              </View>
              <View>
                <Text className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Periode Laporan</Text>
                <Text className="text-sm font-bold text-slate-700">{!filters.startDate ? "Semua Waktu" : filters.startDate === filters.endDate ? "Hari Ini" : `${filters.startDate} s/d ${filters.endDate}`}</Text>
              </View>
            </View>
            <Text className="text-[10px] font-bold text-white bg-emerald-600 px-3 py-1 rounded-full">Ubah</Text>
          </TouchableOpacity>
        </View>

        <ScrollView refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#10b981" />} contentContainerStyle={{ paddingBottom: 30 }}>
          {isLoading ? (
            <View>
              <FinancialSummarySkeleton />
              <RevenueChartSkeleton />

              <View className="mx-5 p-5 bg-white border border-slate-100 rounded-[32px]">
                <View className="flex-row items-center">
                  <Skeleton width={48} height={48} borderRadius={16} className="mr-4" />
                  <View>
                    <Skeleton width={120} height={14} className="mb-2" />
                    <Skeleton width={180} height={10} />
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <>
              <FinancialSummary totalRevenue={summary?.totalRevenue || 0} totalCost={summary?.totalCost || 0} netProfit={summary?.netProfit || 0} margin={summary?.margin || 0} revenueTrend={summary?.revenueTrend || 0} />

              <RevenueChart data={summary?.dailyStats || []} filterType={chartFilterType} />
            </>
          )}

          <TouchableOpacity onPress={() => router.push({ pathname: "/(admin)/home/rankingScreen", params: { startDate: filters.startDate, endDate: filters.endDate } })} className="flex-row items-center justify-between h-20 px-5 mx-5 bg-white border border-l-4 shadow-sm border-l-emerald-500 border-slate-100 rounded-2xl">
            <View className="flex-row items-center">
              <Trophy size={20} color="#059669" />
              <View className="ml-4">
                <Text className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Overview</Text>
                <Text className="text-base font-bold text-slate-800">Cek Produk Terlaris</Text>
              </View>
            </View>

            <ChevronRight size={20} color="#CBD5E1" />
          </TouchableOpacity>
        </ScrollView>

        <HistoryFilterModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} currentType={activeFilter} onApply={handleApplyModal} />
      </View>
    </ScreenWrapper>
  );
}
