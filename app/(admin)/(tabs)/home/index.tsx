import HomeSalesReport from "@/components/HomeSalesReport";
import MenuItem from "@/components/MenuItem";
import StatCard from "@/components/StatCard";
import notificationService from "@/services/notification.service";
import productService from "@/services/product.service";
import reportService from "@/services/report.service";
import { useAuthStore } from "@/stores/auth.store";
import formatRupiah from "@/utils/formatRupiah";
import { useQuery } from "@tanstack/react-query";
import { useRootNavigationState, useRouter, useSegments } from "expo-router";
import { Bell, Box, DollarSign, Layers, LogOut, PackagePlus, UserCog } from "lucide-react-native";
import React, { memo, useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AdminHomePage() {
  const rootNavigationState = useRootNavigationState();
  const segments: string[] = useSegments();
  const { user } = useAuthStore();
  const [isFinalReady, setIsFinalReady] = useState(false);

  useEffect(() => {
    if (rootNavigationState?.key && segments.includes("(admin)")) {
      const timer = setTimeout(() => setIsFinalReady(true), 1);
      return () => clearTimeout(timer);
    }
  }, [rootNavigationState?.key, segments]);

  if (!isFinalReady || !user?._id) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator color="#10b981" size="large" />
        <Text className="mt-4 font-bold text-slate-400">Sinkronisasi Navigasi...</Text>
      </View>
    );
  }

  return <AdminHomeContent />;
}

const AdminHomeContent = memo(() => {
  const router = useRouter();
  const { user, logoutAction } = useAuthStore();
  const insets = useSafeAreaInsets();

  const {
    data: reportResponse,
    isLoading: isReportLoading,
    refetch: refetchReport,
    isRefetching,
    isError,
  } = useQuery({
    queryKey: ["sales-summary", "home"],
    queryFn: () => reportService.getSalesSummary(),
    staleTime: 1000 * 60 * 5,
    refetchOnMount: "always",
  });

  const { data: lowStockProducts } = useQuery({
    queryKey: ["products", "low-stock"],
    queryFn: () => productService.getProduct({ stockStatus: "low" }),
    staleTime: 1000 * 60 * 5,
  });

  const lowStockCount = lowStockProducts?.length || 0;

  const { data: unreadData } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => notificationService.countUnread(),
    refetchInterval: 1000 * 30,
  });

  const stats = reportResponse?.data;
  const unreadCount = unreadData?.data?.count || 0;

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />

      <View style={{ paddingTop: insets.top + 10 }} className="flex-row items-center justify-between px-6 pb-2 bg-slate-50">
        <View className="flex-row items-center">
          <View className="items-center justify-center w-12 h-12 border-2 border-white rounded-full shadow-sm bg-emerald-100">
            <Text className="text-lg font-black text-emerald-700">{user?.username?.substring(0, 1).toUpperCase() || "A"}</Text>
          </View>

          <View className="ml-3">
            <Text className="text-[10px] font-black tracking-[1px] text-emerald-600/60 uppercase">Toko Intan</Text>
            <Text className="text-xl font-black leading-6 text-slate-800">Halo, {user?.username || "Admin"}</Text>
          </View>
        </View>

        {/* Action Buttons Group */}
        <View className="flex-row items-center bg-white/50 p-1.5 rounded-full border border-white">
          <TouchableOpacity onPress={() => router.push("/(admin)/home/notification")} className="relative items-center justify-center w-10 h-10">
            <Bell size={22} color="#64748B" />
            {unreadCount > 0 && <View className="absolute w-2.5 h-2.5 bg-orange-500 border-2 border-slate-50 rounded-full top-2 right-2" />}
          </TouchableOpacity>

          <View className="w-[1px] h-5 bg-slate-200 mx-1" />

          <TouchableOpacity onPress={() => logoutAction()} className="items-center justify-center w-10 h-10">
            <LogOut size={22} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetchReport} tintColor="#10b981" />} contentContainerStyle={{ paddingBottom: 60 }}>
        <View className="px-6 pt-8">
          {isError ? (
            <TouchableOpacity onPress={() => refetchReport()} className="items-center p-6 bg-red-50 rounded-[32px]">
              <Text className="font-bold text-center text-red-500">Gagal memuat data. Ketuk untuk coba lagi.</Text>
            </TouchableOpacity>
          ) : isReportLoading ? (
            <View className="h-48 items-center justify-center bg-slate-50 rounded-[32px] border border-slate-100 border-dashed">
              <ActivityIndicator color="#10b981" />
              <Text className="mt-4 text-xs font-bold text-slate-400">Menghitung Cuan...</Text>
            </View>
          ) : (
            <>
              <View>
                <StatCard isPrimary title="Total Omzet" value={formatRupiah(stats?.totalRevenue || 0)} icon={<DollarSign size={24} color="white" />} trend={`${stats?.totalTransactions || 0} Transaksi`} />
              </View>
            </>
          )}

          <HomeSalesReport summary={stats} />

          <Text className="text-[11px] font-black tracking-[2px] text-slate-400 uppercase mb-4 ml-1">Manajemen Toko</Text>
          <View className="flex-row flex-wrap justify-between">
            <MenuItem title="Produk" icon={Box} onPress={() => router.push("/(admin)/home/product")} />
            <MenuItem title="Kategori" icon={Layers} onPress={() => router.push("/(admin)/home/category")} />
            <MenuItem title="Kasir" icon={UserCog} onPress={() => router.push("/(admin)/home/cashier")} />
            <MenuItem title="Restock" icon={PackagePlus} color="bg-orange-50" onPress={() => router.push("/(admin)/home/restock")} badge={lowStockCount > 0 ? lowStockCount : undefined} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
});

AdminHomeContent.displayName = "AdminHomeContent";
