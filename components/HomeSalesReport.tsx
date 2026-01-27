import { useRouter } from "expo-router";
import { AlertTriangle, ChevronRight, TrendingUp } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

import { IDailyStat, ISalesSummary } from "@/services/report.service";

interface HomeSalesReportProps {
  summary?: ISalesSummary;
}

export default function HomeSalesReport({ summary }: HomeSalesReportProps) {
  const { width } = useWindowDimensions();
  const router = useRouter();

  const chartData = (summary?.dailyStats || [])
    .map((d: IDailyStat) => {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

      const monthIndex = d._id ? parseInt(d._id.split("-").pop() || "1") - 1 : 0;
      const label = monthNames[monthIndex] || "";

      return {
        value: d.revenue || 0,
        label: label,
        frontColor: "#10b981",
      };
    })
    .slice(-4);
  const margin = summary?.margin || 0;

  const maxVal = chartData.length > 0 ? Math.max(...chartData.map((d) => d.value)) * 1.2 : 10000;

  return (
    <View className="bg-white p-6 rounded-[35px] shadow-sm border border-gray-50 mb-6 shadow-slate-200">
      {/* HEADER SECTION */}
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-base font-black text-slate-800">Laporan Penjualan</Text>
          <Text className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Bulan Berjalan</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/(admin)/home/salesReport")} className="flex-row items-center px-4 py-2 border rounded-full bg-emerald-50 border-emerald-100">
          <Text className="text-[10px] font-black text-emerald-700 mr-1">Detail</Text>
          <ChevronRight size={12} color="#047857" />
        </TouchableOpacity>
      </View>

      {/* CHART SECTION */}
      <View className="items-center justify-center">
        <BarChart
          data={chartData}
          width={width - 120}
          height={160}
          barWidth={32}
          initialSpacing={25}
          spacing={20}
          barBorderRadius={6}
          hideRules
          yAxisThickness={0}
          xAxisThickness={0}
          noOfSections={3}
          maxValue={maxVal}
          yAxisLabelPrefix="Rp"
          yAxisLabelContainerStyle={{ width: 45 }}
          yAxisTextStyle={{ color: "#94A3B8", fontSize: 8, fontWeight: "bold" }}
          xAxisLabelTextStyle={{ color: "#94A3B8", fontSize: 9, fontWeight: "bold" }}
          isAnimated
          animationDuration={800}
        />
      </View>

      {/* INSIGHT ADVISOR SECTION */}
      {margin > 0 && (
        <View className={`flex-row items-center mt-4 p-3 rounded-2xl border ${margin < 10 ? "bg-orange-50 border-orange-100" : "bg-emerald-50 border-emerald-100"}`}>
          <View className={`p-1.5 rounded-lg mr-3 ${margin < 10 ? "bg-orange-500/10" : "bg-emerald-500/10"}`}>{margin < 10 ? <AlertTriangle size={14} color="#f97316" /> : <TrendingUp size={14} color="#059669" />}</View>

          <View className="flex-1">
            <Text numberOfLines={2} className={`text-[11px] leading-4 ${margin < 10 ? "text-orange-800" : "text-emerald-800"}`}>
              <Text className="font-black tracking-tighter uppercase">{margin < 10 ? "Perhatian: " : "Kinerja Bagus: "}</Text>
              {margin < 10 ? `Margin menipis (${margin}%). Tinjau harga beli!` : `Keuntungan stabil (${margin}%). Pertahankan performa!`}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
