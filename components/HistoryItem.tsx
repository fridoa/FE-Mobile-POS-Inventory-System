import { ITransactionHistoryItem } from "@/services/transaction.service";
import formatRupiah from "@/utils/formatRupiah";
import { format, isToday } from "date-fns";
import { id } from "date-fns/locale";
import { ChevronRight, ReceiptText } from "lucide-react-native";
import React, { memo, useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface HistoryItemProps {
  item: ITransactionHistoryItem;
  onPress: () => void;
}

const HistoryItem = memo(({ item, onPress }: HistoryItemProps) => {
  const displayDate = useMemo(() => {
    const date = new Date(item.createdAt);

    if (isToday(date)) {
      return `Hari ini, ${format(date, "HH:mm")}`;
    }
    return format(date, "dd MMM, HH:mm", { locale: id });
  }, [item.createdAt]);

  const totalItems = item.items.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="flex-row items-center p-4 mb-3 bg-white border shadow-sm border-slate-100 rounded-2xl">
      <View className="items-center justify-center w-12 h-12 rounded-xl bg-emerald-50">
        <ReceiptText size={22} color="#059669" />
      </View>

      <View className="flex-1 ml-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-[10px] font-bold tracking-tighter uppercase text-slate-400">{item.transactionNumber}</Text>
          <Text className="text-[10px] text-slate-400 font-bold">{displayDate}</Text>
        </View>

        <Text className="mt-0.5 text-base font-black text-slate-800">{formatRupiah(item.totalAmount)}</Text>

        <Text className="text-[10px] text-slate-400 mt-1 font-medium">{totalItems} Produk • Tunai</Text>
      </View>

      <View className="ml-2">
        <ChevronRight size={18} color="#CBD5E1" />
      </View>
    </TouchableOpacity>
  );
});

HistoryItem.displayName = "HistoryItem";
export default HistoryItem;
