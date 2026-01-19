import MenuItem from "@/components/MenuItem";
import NavigationBar from "@/components/NavigationBar";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "expo-router";
import { BarChart3, Box, ClipboardList, Layers, LogOut, PackagePlus, Settings, Store, TrendingUp, UserCog } from "lucide-react-native";
import React from "react";
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AdminHomePage = () => {
  const { user, logoutAction } = useAuthStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    logoutAction();
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

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

          <TouchableOpacity onPress={handleLogout} className="p-3 bg-white/10 rounded-2xl">
            <LogOut size={20} color="white" />
          </TouchableOpacity>
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
              <MenuItem title="Analitik" icon={BarChart3} color="bg-indigo-50" />
              <View className="w-[23%]" />
            </View>

            <Text className="mb-4 text-[10px] font-black tracking-[2px] text-gray-400 uppercase">Pengaturan</Text>
            <View className="flex-row flex-wrap justify-start gap-4">
              <MenuItem title="Info Toko" icon={Store} color="bg-gray-50" />
              <MenuItem title="Settings" icon={Settings} color="bg-gray-50" />
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default AdminHomePage;
