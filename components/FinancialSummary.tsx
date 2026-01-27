import formatRupiah from "@/utils/formatRupiah";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, DollarSign, ShoppingBag, TrendingDown, TrendingUp } from "lucide-react-native";
import React, { memo } from "react";
import { Text, View } from "react-native";

interface FinancialSummaryProps {
  totalRevenue?: number;
  totalCost?: number;
  netProfit?: number;
  margin?: number;
  revenueTrend?: number;
}

const FinancialSummary = memo(({ totalRevenue = 0, totalCost = 0, netProfit = 0, margin = 0, revenueTrend = 0 }: FinancialSummaryProps) => {
  const isProfit = netProfit >= 0;
  const isRevUp = revenueTrend >= 0;

  return (
    <View className="px-5 mb-6">
      <View style={{ backgroundColor: "rgba(255, 255, 255, 0.65)" }} className="p-6 mb-4 border border-white/80 rounded-[35px] shadow-sm shadow-slate-200">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-[10px] font-black tracking-[2px] text-slate-400 uppercase">Total Omzet</Text>
          <View className="p-2 bg-emerald-500/10 rounded-2xl">
            <DollarSign size={20} color="#059669" />
          </View>
        </View>
        <Text className="text-3xl font-black tracking-tight text-slate-800">{formatRupiah(totalRevenue)}</Text>

        <View className="flex-row items-center mt-2">
          {revenueTrend !== 0 ? (
            <>
              {isRevUp ? <ArrowUpRight size={14} color="#10b981" /> : <ArrowDownRight size={14} color="#ef4444" />}
              <Text className={`text-[11px] font-bold ml-1 ${isRevUp ? "text-emerald-500" : "text-red-500"}`}>
                {Math.abs(revenueTrend)}% <Text className="font-medium text-slate-400">dari periode sebelumnya</Text>
              </Text>
            </>
          ) : (
            <Text className="text-[11px] font-medium text-slate-400 italic">Data tren tidak tersedia untuk periode ini</Text>
          )}
        </View>
      </View>

      <View className="flex-row justify-between">
        <View style={{ backgroundColor: "rgba(255, 255, 255, 0.65)", width: "48%" }} className="p-5 border border-white/80 rounded-[30px] shadow-sm shadow-slate-200">
          <View className="self-start p-2 mb-3 bg-slate-500/10 rounded-xl">
            <ShoppingBag size={18} color="#64748b" />
          </View>
          <Text className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Modal</Text>
          {/* Menggunakan totalCost */}
          <Text className="text-base font-black text-slate-700">{formatRupiah(totalCost)}</Text>
        </View>

        <View
          style={{
            backgroundColor: isProfit ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)",
            width: "48%",
          }}
          className={`p-5 border rounded-[30px] shadow-sm ${isProfit ? "border-emerald-200/50" : "border-red-200/50"}`}
        >
          <View className={`p-2 mb-3 self-start rounded-xl ${isProfit ? "bg-emerald-500/10" : "bg-red-500/10"}`}>{isProfit ? <TrendingUp size={18} color="#059669" /> : <TrendingDown size={18} color="#dc2626" />}</View>
          <Text className={`text-[10px] font-black uppercase mb-1 ${isProfit ? "text-emerald-600" : "text-red-600"}`}>Laba Bersih</Text>
          <Text className={`text-base font-black ${isProfit ? "text-emerald-700" : "text-red-700"}`}>{formatRupiah(netProfit)}</Text>

          {/* INDIKATOR MARGIN */}
          <View className="flex-row items-center mt-3">
            <Text className="text-[10px] font-bold text-slate-500">Margin: </Text>
            <Text className={`text-[10px] font-black ${margin < 10 ? "text-orange-500" : "text-emerald-600"}`}>{margin}%</Text>
            {margin < 10 && margin > 0 && <AlertTriangle size={10} color="#f97316" style={{ marginLeft: 4 }} />}
          </View>
        </View>
      </View>
    </View>
  );
});

FinancialSummary.displayName = "FinancialSummary";
export default FinancialSummary;
