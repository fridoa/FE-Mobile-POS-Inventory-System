import StatCard from "@/components/StatCard"; // Menggunakan komponen yang sama dengan Admin
import reportService from "@/services/report.service";
import transactionService from "@/services/transaction.service";
import { useAuthStore } from "@/stores/auth.store";
import formatRupiah from "@/utils/formatRupiah";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Banknote, ChevronRight, Clock, History, LogOut, PackageSearch, ShoppingCart } from "lucide-react-native";
import React from "react";
import { RefreshControl, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CashierHomePage = () => {
  const { user, logoutAction } = useAuthStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // 1. Fetch Summary Hari Ini (Personal Kasir)
  const {
    data: summaryRes,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["sales-summary", "cashier-daily"],
    queryFn: () => reportService.getSalesSummary({ cashierId: user?._id }),
    staleTime: 1000 * 60 * 5,
  });

  // 2. Fetch 5 Transaksi Terbaru
  const { data: recentTransactionsRes } = useQuery({
    queryKey: ["transactions", "recent-home"],
    queryFn: () => transactionService.getAll({ limit: 5 }), // Sesuaikan service kamu
  });

  const stats = summaryRes?.data;
  const recentTransactions = recentTransactionsRes?.data || [];

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />

      {/* HEADER: Sama dengan Admin Style */}
      <View style={{ paddingTop: insets.top + 10 }} className="flex-row items-center justify-between px-6 pb-2 bg-slate-50">
        <View className="flex-row items-center">
          <View className="items-center justify-center w-12 h-12 border-2 border-white rounded-full shadow-sm bg-emerald-100">
            <Text className="text-lg font-black text-emerald-700">{user?.username?.substring(0, 1).toUpperCase() || "K"}</Text>
          </View>
          <View className="ml-3">
            <Text className="text-[10px] font-black tracking-[1px] text-emerald-600/60 uppercase">Shift Aktif</Text>
            <Text className="text-xl font-black leading-6 text-slate-800">{user?.username || "Kasir"}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => logoutAction()} className="p-2.5 bg-white rounded-full border border-slate-100 shadow-sm">
          <LogOut size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#059669" />} contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-6 pt-6">
          {/* STATS: Tanpa Grafik, Hanya Angka Utama */}
          <StatCard isPrimary title="Omzet Saya Hari Ini" value={formatRupiah(stats?.totalRevenue || 0)} icon={<Banknote size={24} color="white" />} trend={`${stats?.totalTransactions || 0} Transaksi`} />

          {/* HERO BUTTON: Create Order */}
          <TouchableOpacity activeOpacity={0.9} onPress={() => router.push("/(cashier)/home/pos/pos")} className="flex-row items-center justify-between p-6 mb-8 shadow-xl bg-emerald-600 rounded-3xl shadow-emerald-100">
            <View className="flex-row items-center flex-1">
              <View className="items-center justify-center w-12 h-12 bg-white/20 rounded-2xl">
                <ShoppingCart size={24} color="white" />
              </View>
              <View className="ml-4">
                <Text className="text-lg font-black text-white">Buat Pesanan</Text>
                <Text className="text-xs text-emerald-100">Klik untuk mulai melayani pelanggan</Text>
              </View>
            </View>
            <ChevronRight size={20} color="white" />
          </TouchableOpacity>

          {/* QUICK MENU */}
          <Text className="mb-4 ml-1 text-[11px] font-black tracking-[2px] text-slate-400 uppercase">Akses Cepat</Text>
          <View className="flex-row justify-between mb-8">
            <TouchableOpacity onPress={() => router.push("/(cashier)/(tabs)/inventory")} className="w-[48%] bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex-row items-center">
              <View className="items-center justify-center w-10 h-10 mr-3 bg-orange-50 rounded-2xl">
                <PackageSearch size={20} color="#f97316" />
              </View>
              <Text className="font-bold text-slate-700">Cek Stok</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/(cashier)/(tabs)/history")} className="w-[48%] bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex-row items-center">
              <View className="items-center justify-center w-10 h-10 mr-3 bg-blue-50 rounded-2xl">
                <History size={20} color="#3b82f6" />
              </View>
              <Text className="font-bold text-slate-700">Riwayat</Text>
            </TouchableOpacity>
          </View>

          {/* RECENT TRANSACTIONS: List Style */}
          <View className="flex-row items-center justify-between px-1 mb-4">
            <Text className="text-[11px] font-black tracking-[2px] text-slate-400 uppercase">Transaksi Terbaru</Text>
            <TouchableOpacity onPress={() => router.push("/(cashier)/(tabs)/history")}>
              <Text className="text-[11px] font-black text-emerald-600 uppercase">Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((item: any, index: number) => (
                <View key={item._id} className={`flex-row items-center justify-between p-4 ${index !== recentTransactions.length - 1 ? "border-b border-slate-50" : ""}`}>
                  <View className="flex-row items-center flex-1">
                    <View className="items-center justify-center w-10 h-10 mr-3 rounded-full bg-slate-50">
                      <Clock size={18} color="#94a3b8" />
                    </View>
                    <View>
                      <Text className="text-[13px] font-bold text-slate-800 uppercase">#{item.invoiceNumber?.slice(-6)}</Text>
                      <Text className="text-[10px] text-slate-400 font-medium">{item.paymentMethod || "Tunai"}</Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-[14px] font-black text-slate-800">{formatRupiah(item.totalAmount)}</Text>
                    <Text className="text-[9px] font-bold text-emerald-500 uppercase">Berhasil</Text>
                  </View>
                </View>
              ))
            ) : (
              <View className="items-center py-10">
                <Text className="text-xs italic font-bold text-slate-400">Belum ada transaksi hari ini</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CashierHomePage;
