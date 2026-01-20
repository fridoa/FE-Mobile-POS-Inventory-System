import MenuItem from "@/components/MenuItem";
import notificationService from "@/services/notification.service";
import { useAuthStore } from "@/stores/auth.store";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { AlertTriangle, ArrowUpRight, Bell, Box, ClipboardList, Layers, LogOut, PackagePlus, ShoppingBag, Store, TrendingUp, UserCog, Wallet } from "lucide-react-native";
import React from "react";
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AdminHomePage = () => {
  const { user, logoutAction } = useAuthStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data: unreadData } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => notificationService.countUnread(),
    refetchInterval: 1000 * 30,
  });

  const unreadCount = unreadData?.data?.count || 0;

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header Section */}
      <View style={{ height: "35%", paddingTop: insets.top }} className="bg-[#059669] w-full absolute top-0 rounded-b-[40px] z-0">
        <View className="absolute right-0 w-32 h-32 -mr-10 rounded-full top-10 bg-white/10" />
      </View>

      <View style={{ flex: 1, paddingTop: insets.top }} className="z-10">
        {/* Top Bar */}
        <View className="flex-row items-center justify-between px-6 pt-4 pb-4">
          <View>
            <Text className="text-xs font-medium text-emerald-100">Selamat Datang,</Text>
            <Text className="text-xl font-bold text-white capitalize">{user?.username || "Owner"}</Text>
          </View>
          <View className="flex-row gap-3">
            <TouchableOpacity onPress={() => router.push("/(admin)/home/notification")} className="relative p-2.5 bg-white/20 rounded-xl">
              <Bell size={20} color="white" />
              {unreadCount > 0 && (
                <View className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full border-2 border-[#059669] items-center justify-center">
                  <Text className="text-[8px] font-bold text-white">{unreadCount > 9 ? "9+" : unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => logoutAction()} className="p-2.5 bg-white/20 rounded-xl">
              <LogOut size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Dashboard Summary Cards */}
          <View className="flex-row gap-3 px-6 mt-2">
            <View className="flex-1 p-4 bg-white border border-gray-100 shadow-sm rounded-3xl">
              <View className="self-start p-2 mb-2 rounded-lg bg-emerald-50">
                <Wallet size={16} color="#059669" />
              </View>
              <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Pendapatan</Text>
              <Text className="mt-1 text-lg font-black text-gray-800">Rp 2.4jt</Text>
              <View className="flex-row items-center mt-1">
                <ArrowUpRight size={12} color="#059669" />
                <Text className="text-emerald-600 text-[10px] font-bold ml-1">+12% hari ini</Text>
              </View>
            </View>

            <View className="flex-1 p-4 bg-white border border-gray-100 shadow-sm rounded-3xl">
              <View className="self-start p-2 mb-2 rounded-lg bg-blue-50">
                <ShoppingBag size={16} color="#3b82f6" />
              </View>
              <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Transaksi</Text>
              <Text className="mt-1 text-lg font-black text-gray-800">48</Text>
              <Text className="text-gray-400 text-[10px] mt-1">Pesanan selesai</Text>
            </View>
          </View>

          {/* Main Content Area */}
          <View className="bg-white rounded-t-[40px] mt-8 px-6 pt-8 min-h-screen shadow-2xl">
            {/* Banner Alert (Stok/Expired) */}
            {unreadCount > 0 && (
              <TouchableOpacity onPress={() => router.push("/(admin)/home/notification")} className="flex-row items-center p-4 mb-8 border border-orange-100 bg-orange-50 rounded-2xl">
                <View className="p-2 bg-orange-100 rounded-xl">
                  <AlertTriangle size={20} color="#f59e0b" />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-sm font-bold text-gray-800">Status Inventaris</Text>
                  <Text className="text-xs text-gray-500">Ada {unreadCount} produk butuh perhatian segera.</Text>
                </View>
              </TouchableOpacity>
            )}

            {/* Menu Sections */}
            <Text className="mb-4 text-[11px] font-bold tracking-[1.5px] text-gray-400 uppercase ml-1">Manajemen Inventaris</Text>
            <View className="flex-row flex-wrap justify-between mb-8">
              <MenuItem title="Produk" icon={Box} onPress={() => router.push("/(admin)/home/product")} />
              <MenuItem title="Kategori" icon={Layers} onPress={() => router.push("/(admin)/home/category")} />
              <MenuItem title="Kasir" icon={UserCog} onPress={() => router.push("/(admin)/home/cashier")} />
              <MenuItem title="Restock" icon={PackagePlus} color="bg-orange-50" onPress={() => router.push("/(admin)/home/restock")} />
            </View>

            <Text className="mb-4 text-[11px] font-bold tracking-[1.5px] text-gray-400 uppercase ml-1">Laporan Penjualan</Text>
            <View className="flex-row flex-wrap justify-between mb-6">
              <MenuItem title="Laporan" icon={ClipboardList} color="bg-blue-50" />
              <MenuItem title="Tren" icon={TrendingUp} color="bg-purple-50" />
              <View className="w-[23%]" />
            </View>

            {/* Hint Box */}
            <View className="p-5 mt-4 border border-gray-200 border-dashed bg-gray-50 rounded-3xl">
              <View className="flex-row items-center mb-1">
                <Store size={14} color="#9CA3AF" />
                <Text className="ml-2 text-xs font-bold text-gray-500">Toko Intan</Text>
              </View>
              <Text className="text-[10px] text-gray-400">Gunakan menu laporan untuk melihat performa harian kasir Anda.</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default AdminHomePage;
