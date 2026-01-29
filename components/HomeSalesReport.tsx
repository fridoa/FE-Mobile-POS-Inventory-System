import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React, { useMemo } from "react";
import { Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

import { IDailyStat, ISalesSummary } from "@/services/report.service";
import { getReportLabel } from "@/utils/label";

interface HomeSalesReportProps {
  summary?: ISalesSummary;
}

export default function HomeSalesReport({ summary }: HomeSalesReportProps) {
  const { width } = useWindowDimensions();
  const router = useRouter();

  const chartData = useMemo(() => {
    return (summary?.dailyStats || [])
      .map((d: IDailyStat) => {
        const label = getReportLabel(d._id, "year");

        return {
          value: d.revenue || 0,
          label: label,
          frontColor: "#10b981",

          topLabelComponent: () => <Text style={{ fontSize: 8, color: "#94A3B8", marginBottom: 4 }}>{(d.revenue / 1000).toFixed(0)}k</Text>,
        };
      })

      .slice(-6);
  }, [summary?.dailyStats]);

  const maxVal = useMemo(() => {
    return chartData.length > 0 ? Math.max(...chartData.map((d) => d.value)) * 1.3 : 10000;
  }, [chartData]);

  return (
    <View className="bg-white p-6 rounded-[35px] shadow-sm border border-gray-50 mb-6 shadow-slate-200">
      {/* HEADER SECTION */}
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-base font-black text-slate-800">Laporan Penjualan</Text>
          <Text className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Trend Penjualan</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/(admin)/home/salesReport")} className="flex-row items-center px-4 py-2 border rounded-full bg-emerald-50 border-emerald-100">
          <Text className="text-[10px] font-black text-emerald-700 mr-1">Detail</Text>
          <ChevronRight size={12} color="#047857" />
        </TouchableOpacity>
      </View>

      {/* CHART SECTION */}
      <View className="items-center justify-center min-h-[180px]">
        {chartData.length === 0 ? (
          <Text className="text-xs italic text-slate-300">Belum ada data trend</Text>
        ) : (
          <BarChart
            data={chartData}
            width={width - 130}
            height={160}
            barWidth={28}
            initialSpacing={15}
            spacing={20}
            hideRules
            yAxisThickness={0}
            xAxisThickness={0}
            noOfSections={3}
            maxValue={maxVal}
            yAxisLabelPrefix="Rp"
            yAxisLabelContainerStyle={{ width: 45 }}
            yAxisTextStyle={{ color: "#94A3B8", fontSize: 8, fontWeight: "bold" }}
            xAxisLabelTextStyle={{ color: "#94A3B8", fontSize: 8, fontWeight: "bold" }}
            isAnimated
            animationDuration={800}
          />
        )}
      </View>
    </View>
  );
}
