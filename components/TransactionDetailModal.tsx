import { ITransactionHistoryItem } from "@/services/transaction.service";
import formatRupiah from "@/utils/formatRupiah";
import { FlashList } from "@shopify/flash-list";
import { ShoppingBag, User, X } from "lucide-react-native";
import React, { useMemo } from "react";
import { Modal, Platform, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  visible: boolean;
  onClose: () => void;
  transaction: ITransactionHistoryItem | null;
}

export default function TransactionDetailModal({ visible, onClose, transaction }: Props) {
  const insets = useSafeAreaInsets();
  const totalSavings = useMemo(() => {
    if (!transaction) return 0;
    return transaction.items.reduce((acc, item) => acc + (item.discount || 0), 0);
  }, [transaction]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="formSheet" onRequestClose={onClose}>
      <View className="flex-1 bg-slate-50" style={{ paddingTop: Platform.OS === "android" ? insets.top : 0 }}>
        {/* HEADER MODAL */}
        <View className="flex-row items-center p-5 bg-white border-b border-slate-100">
          <TouchableOpacity onPress={onClose} hitSlop={10}>
            <X size={24} color="#64748B" />
          </TouchableOpacity>
          <Text className="flex-1 mr-6 text-lg font-black text-center text-slate-800">Detail Transaksi</Text>
        </View>

        {transaction && (
          <View className="flex-1 p-6">
            {/* CARD 1: RINGKASAN TOTAL */}
            <View className="items-center p-6 mb-6 bg-white border shadow-sm rounded-3xl border-slate-100">
              <Text className="text-4xl font-black text-emerald-600">{formatRupiah(transaction.totalAmount)}</Text>
              <Text className="text-[10px] font-bold text-slate-300 uppercase mt-2 tracking-widest">{transaction.transactionNumber}</Text>
            </View>

            {/* CARD 2: DAFTAR ITEM BELANJA */}
            <View className="flex-1 p-6 mb-6 bg-white border shadow-sm rounded-3xl border-slate-100">
              <View className="flex-row items-center pb-3 mb-4 border-b border-slate-50">
                <ShoppingBag size={16} color="#059669" />
                <Text className="ml-2 font-bold text-slate-800">Item Belanja</Text>
              </View>

              <FlashList
                data={transaction.items}
                keyExtractor={(item, index) => item._id || index.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View className="flex-row justify-between mb-4">
                    <View className="flex-1 pr-4">
                      <Text className="font-bold text-slate-700" numberOfLines={1}>
                        {item.name}
                      </Text>
                      <View className="flex-row items-center">
                        <Text className="text-[11px] text-slate-400">{`${item.quantity} x `}</Text>

                        {(item.basePrice || 0) > (item.price || 0) && <Text className="text-[10px] text-slate-300 line-through mr-1">{formatRupiah(item.basePrice)}</Text>}

                        <Text className="text-[11px] font-bold text-emerald-600">{formatRupiah(item.price)}</Text>
                      </View>
                    </View>
                    <Text className="font-bold text-slate-800">{formatRupiah(item.subtotal)}</Text>
                  </View>
                )}
                ListFooterComponent={
                  <View className="pt-4 mt-2 border-t border-dashed border-slate-100">
                    {/* INFORMASI TOTAL HEMAT */}
                    {totalSavings > 0 && (
                      <View className="flex-row justify-between mb-2">
                        <Text className="text-xs italic font-bold text-emerald-600">Total Hemat ✨</Text>
                        <Text className="text-xs font-black text-emerald-600">-{formatRupiah(totalSavings)}</Text>
                      </View>
                    )}

                    <View className="flex-row justify-between mb-2">
                      <Text className="text-xs font-bold text-slate-400">Tunai</Text>
                      <Text className="text-xs font-black text-slate-800">{formatRupiah(transaction.payAmount)}</Text>
                    </View>

                    <View className="flex-row items-center justify-between">
                      <Text className="text-xs font-bold text-slate-400">Kembalian</Text>
                      <Text className="text-lg font-black text-orange-500">{formatRupiah(transaction.changeAmount)}</Text>
                    </View>
                  </View>
                }
              />
            </View>

            {/* CARD 3: INFORMASI KASIR */}
            <View className="flex-row items-center p-4 mb-4 border bg-emerald-50 rounded-2xl border-emerald-100">
              <View className="items-center justify-center w-10 h-10 mr-4 rounded-full bg-emerald-600">
                <User size={20} color="white" />
              </View>
              <View>
                <Text className="text-[10px] font-bold text-emerald-600 uppercase">Petugas Kasir</Text>
                <Text className="font-bold text-emerald-900">{transaction.cashierId?.name || "Kasir Toko Intan"}</Text>
              </View>
            </View>

            <Text className="text-center text-[10px] text-slate-300 mt-auto mb-4 font-bold uppercase tracking-widest">{`Dicatat pada: ${new Date(transaction.createdAt).toLocaleString("id-ID")}`}</Text>

            <View style={{ height: insets.bottom }} />
          </View>
        )}
      </View>
    </Modal>
  );
}
