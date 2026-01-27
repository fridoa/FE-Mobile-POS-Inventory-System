import { IDailyStat } from "@/services/report.service";
import { Zap } from "lucide-react-native";
import React, { memo, useMemo } from "react";
import { Dimensions, Text, TextStyle, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const { width } = Dimensions.get("window");

interface RevenueChartProps {
  data: IDailyStat[];
  filterType: "7days" | "month" | "year" | "all";
}

const RevenueChart = memo(({ data, filterType }: RevenueChartProps) => {
  const isDataEmpty = !data || data.length === 0;
  const isLongTerm = filterType === "year" || filterType === "all";

  const getLabel = (id: string) => {
    if (!id || id === "-") return "-";
    const date = new Date(id);

    if (filterType === "7days") {
      const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
      return days[date.getDay()];
    }

    if (filterType === "year") {
      const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
      const parts = id.split("-");
      const monthIndex = parts.length > 1 ? Number(parts[1]) - 1 : date.getMonth();
      return months[monthIndex] || id;
    }

    if (filterType === "all") {
      const parts = id.split("-");
      if (parts.length >= 2) {
        const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
        return `${months[Number(parts[1]) - 1]} '${parts[0].slice(2)}`;
      }
    }

    return id.split("-")[2] || id;
  };

  const smartInsight = useMemo(() => {
    if (isDataEmpty) return "Belum ada data transaksi untuk dianalisis.";

    const peakItem = [...data].sort((a, b) => b.revenue - a.revenue)[0];
    const peakLabel = getLabel(peakItem._id);
    const peakValue = peakItem.revenue.toLocaleString("id-ID");

    if (filterType === "all" || filterType === "year") {
      return `${peakLabel} adalah puncaknya (Rp ${peakValue}). Stok barang kategori terlaris lebih awal ya!`;
    }

    return `Penjualan tertinggi pada ${peakLabel} (Rp ${peakValue}). Pastikan pelayanan tetap maksimal!`;
  }, [data, filterType, isDataEmpty]);

  const chartData = useMemo(() => {
    if (isDataEmpty) {
      return [{ value: 0, label: "N/A", frontColor: "transparent" }];
    }

    const maxRevenue = Math.max(...data.map((d) => d.revenue));

    return data.map((item) => {
      const isPeak = item.revenue === maxRevenue && maxRevenue > 0;

      return {
        value: item.revenue,
        label: getLabel(item._id),
        frontColor: isPeak ? "#34d399" : "#10b981",
        spacing: data.length > 10 ? 12 : 25,
        labelTextStyle: {
          color: isPeak ? "#059669" : "#94a3b8",
          fontSize: 9,
          fontWeight: isPeak ? "900" : "bold",
        } as TextStyle,
      };
    });
  }, [data, isDataEmpty, filterType]);

  const maxVal = useMemo(() => {
    if (isDataEmpty) return 10000;
    const peak = Math.max(...chartData.map((d) => d.value));
    return peak > 0 ? peak : 10000;
  }, [chartData, isDataEmpty]);

  return (
    <View style={{ backgroundColor: "rgba(255,255,255,0.65)" }} className="mx-5 mb-6 p-6 border border-white/80 rounded-[35px] shadow-sm shadow-slate-200">
      {/* HEADER */}
      <View className="mb-6">
        <Text className="text-base font-black text-slate-800">Tren Pendapatan</Text>
        <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isLongTerm ? "Analisis Jangka Panjang" : "Fluktuasi Harian"}</Text>
      </View>

      <View className="items-center justify-center">
        {isDataEmpty && (
          <View className="absolute z-10 items-center justify-center">
            <Text className="text-xs italic font-bold text-slate-300">Tidak ada data transaksi</Text>
          </View>
        )}

        {/* GRAFIK DENGAN KEY RESET */}
        <BarChart
          key={`chart-${filterType}-${data.length}`}
          data={chartData}
          width={width - 125}
          height={180}
          barWidth={isLongTerm ? 26 : 18}
          initialSpacing={15}
          noOfSections={4}
          maxValue={isLongTerm ? maxVal * 1.25 : maxVal * 1.3}
          yAxisThickness={0}
          xAxisThickness={0}
          yAxisLabelPrefix="Rp "
          yAxisLabelContainerStyle={{ width: 50 }}
          yAxisTextStyle={{ color: "#94A3B8", fontSize: 8 }}
          rulesType="dashed"
          rulesColor="rgba(148,163,184,0.12)"
          isAnimated
          animationDuration={500}
          renderTooltip={(item: any) =>
            item.value > 0 ? (
              <View className="px-2 py-1 -mt-8 rounded-md shadow-lg bg-slate-900">
                <Text className="text-white text-[10px] font-bold">Rp {item.value.toLocaleString("id-ID")}</Text>
              </View>
            ) : null
          }
        />
      </View>

      {/* DYNAMIC SMART INSIGHT BOX */}
      {!isDataEmpty && (
        <View className="flex-row items-start p-4 mt-6 border bg-amber-50/50 border-amber-100 rounded-2xl">
          <View className="p-2 mr-3 bg-amber-100 rounded-xl">
            <Zap size={14} color="#d97706" />
          </View>
          <View className="flex-1">
            <Text className="text-[10px] font-black text-amber-700 uppercase tracking-wider mb-1">Rekomendasi Bisnis</Text>
            <Text className="text-[11px] leading-4 text-slate-600 font-medium">{smartInsight}</Text>
          </View>
        </View>
      )}
    </View>
  );
});

RevenueChart.displayName = "RevenueChart";
export default RevenueChart;
