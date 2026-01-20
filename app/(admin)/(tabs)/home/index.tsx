import MenuItem from "@/components/MenuItem";
import notificationService from "@/services/notification.service";
import { useAuthStore } from "@/stores/auth.store";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { AlertTriangle, Bell, Box, ClipboardList, Layers, LogOut, PackagePlus, Store, TrendingUp, UserCog } from "lucide-react-native";
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

  const handleLogout = () => {
    logoutAction();
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background Header Emerald */}
      <View style={{ height: "40%", paddingTop: insets.top }} className="bg-[#059669] w-full absolute top-0 rounded-b-[50px] z-0">
        <View className="absolute right-0 w-32 h-32 -mr-10 rounded-full top-10 bg-white/10" />
        <View className="absolute w-20 h-20 rounded-full top-40 left-10 bg-white/5" />
      </View>

      <View style={{ flex: 1, paddingTop: insets.top }} className="z-10">
        <View className="flex-row items-start justify-between px-6 pt-4 pb-6">
          <View>
            <Text className="mb-1 text-sm font-medium text-emerald-100">Selamat Datang,</Text>
            <Text className="text-2xl font-bold text-white capitalize">{user?.username || "Admin"}</Text>
            <View className="flex-row items-center self-start px-3 py-1 mt-2 rounded-full bg-white/20">
              <Store size={14} color="white" />
              <Text className="ml-2 text-xs font-semibold text-white">Inventory System</Text>
            </View>
          </View>

          {/* Action Buttons: Bell & Logout */}
          <View className="flex-row gap-2">
            <TouchableOpacity onPress={() => router.push("/(admin)/home/notification")} className="relative p-3 bg-white/10 rounded-2xl">
              <Bell size={20} color="white" />
              {unreadCount > 0 && (
                <View className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-[#059669] items-center justify-center">
                  <Text className="text-[8px] font-bold text-white">{unreadCount > 9 ? "9+" : unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout} className="p-3 bg-white/10 rounded-2xl">
              <LogOut size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-1 bg-white shadow-2xl rounded-t-[40px] mt-2">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: insets.bottom + 120,
              paddingHorizontal: 20,
              paddingTop: 30,
            }}
          >
            {/* Banner Peringatan Stok Kritis (Hanya muncul jika ada notifikasi unread) */}
            {unreadCount > 0 && (
              <TouchableOpacity onPress={() => router.push("/(admin)/home/notification")} activeOpacity={0.8} className="flex-row items-center p-4 mb-6 border border-orange-100 bg-orange-50 rounded-3xl">
                <View className="p-2 bg-orange-100 rounded-xl">
                  <AlertTriangle size={20} color="#f59e0b" />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-sm font-bold text-gray-800">Perhatian!</Text>
                  <Text className="text-xs text-gray-500">Ada {unreadCount} produk butuh perhatian (Stok/Expired).</Text>
                </View>
              </TouchableOpacity>
            )}

            <Text className="mb-4 text-[10px] font-black tracking-[2px] text-gray-400 uppercase">Manajemen</Text>
            <View className="flex-row flex-wrap justify-between mb-6">
              <MenuItem title="Produk" icon={Box} onPress={() => router.push("/(admin)/home/product")} />
              <MenuItem title="Kategori" icon={Layers} onPress={() => router.push("/(admin)/home/category")} />
              <MenuItem title="Kasir" icon={UserCog} onPress={() => router.push("/(admin)/home/cashier")} />
              <MenuItem title="Restock" icon={PackagePlus} color="bg-orange-50" onPress={() => router.push("/(admin)/home/restock")} />
            </View>

            <Text className="mb-4 text-[10px] font-black tracking-[2px] text-gray-400 uppercase">Laporan & Analisa</Text>
            <View className="flex-row flex-wrap justify-between mb-6">
              <MenuItem title="Laporan" icon={ClipboardList} color="bg-blue-50" />
              <MenuItem title="Tren" icon={TrendingUp} color="bg-purple-50" />
              <View className="w-[23%]" />
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default AdminHomePage;
