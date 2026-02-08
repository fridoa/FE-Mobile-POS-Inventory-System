import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Text, useWindowDimensions, View } from "react-native";
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
          topLabelComponent: () => <Text style={{ fontSize: 9, color: "#059669", marginBottom: 4, fontWeight: "bold" }}>{(d.revenue / 1000).toFixed(0)}k</Text>,
        };
      })

      .slice(-5);
  }, [summary?.dailyStats]);

  const maxVal = useMemo(() => {
    return chartData.length > 0 ? Math.max(...chartData.map((d) => d.value)) * 1.3 : 10000;
  }, [chartData]);

  return (
    <View className="bg-emerald-50/60 p-6 rounded-[35px] shadow-sm border border-emerald-100 mb-6 shadow-emerald-100/50">
      <View className="items-center justify-center min-h-[180px]">
        {chartData.length === 0 ? (
          <Text className="text-xs italic text-slate-300">Belum ada data trend</Text>
        ) : (
          <BarChart
            data={chartData}
            width={width - 60}
            height={160}
            barWidth={32}
            initialSpacing={15}
            spacing={20}
            hideRules
            yAxisThickness={0}
            xAxisThickness={0}
            noOfSections={3}
            maxValue={maxVal}
            
            showGradient
            frontColor="#34D399"
            gradientColor="#059669"
            barBorderTopLeftRadius={8}
            barBorderTopRightRadius={8}
            
            yAxisLabelPrefix="Rp"
            yAxisLabelContainerStyle={{ width: 45 }}
            yAxisTextStyle={{ color: "#64748B", fontSize: 8, fontWeight: "bold" }}
            xAxisLabelTextStyle={{ color: "#64748B", fontSize: 8, fontWeight: "bold" }}
            isAnimated
            animationDuration={800}
          />
        )}
      </View>
    </View>
  );
}


