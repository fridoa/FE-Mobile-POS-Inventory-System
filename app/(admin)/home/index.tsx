import MenuItem from "@/components/MenuItem";
import NavigationBar from "@/components/NavigationBar";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "expo-router";
import { BarChart3, Box, ClipboardList, Layers, LogOut, PackagePlus, Settings, Store, TrendingUp, UserCog } from "lucide-react-native";
import React from "react";
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AdminHomePage = () => {
  const { user, logoutAction } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logoutAction();
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#059669" />

      <View className="bg-[#059669] h-[35vh] w-full absolute top-0 rounded-b-[40px] z-0">
        <View className="absolute right-0 w-32 h-32 -mr-10 rounded-full top-10 bg-white/5" />
        <View className="absolute w-20 h-20 rounded-full top-40 left-10 bg-white/5" />
      </View>

      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <View className="flex-1">
          <View className="flex-row items-start justify-between px-6 pt-2 pb-8">
            <View>
              <Text className="mb-1 text-sm font-medium text-emerald-100">Selamat Datang,</Text>
              <Text className="text-2xl font-bold text-white capitalize">{user?.username || "Admin Owner"}</Text>
              <View className="flex-row items-center self-start px-3 py-1 mt-2 rounded-full bg-white/20">
                <Store size={14} color="white" />
                <Text className="ml-2 text-xs font-semibold text-white">Inventory System</Text>
              </View>
            </View>

            <TouchableOpacity onPress={handleLogout} className="p-2 bg-white/10 rounded-xl">
              <LogOut size={20} color="white" />
            </TouchableOpacity>
          </View>

          <View className="flex-1 px-4 pt-8 mx-4 bg-white shadow-sm rounded-t-3xl">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
              <Text className="mb-4 ml-2 text-xs font-bold tracking-widest text-gray-400 uppercase">Manajemen</Text>
              <View className="flex-row flex-wrap justify-between">
                <MenuItem title="Produk" icon={Box} onPress={() => router.push("/(admin)/product")} />
                <MenuItem title="Kategori" icon={Layers} onPress={() => router.push("/(admin)/home/category")} />
                <MenuItem title="Kasir" icon={UserCog} onPress={() => router.push("/(admin)/home/cashier")} />
                <MenuItem
                  title="Restock"
                  icon={PackagePlus}
                  color="bg-orange-50"
                  // onPress={() => router.push("/(admin)/restock")}
                />
              </View>

              <Text className="mt-2 mb-4 ml-2 text-xs font-bold tracking-widest text-gray-400 uppercase">Laporan & Analisa</Text>
              <View className="flex-row flex-wrap justify-start gap-x-2">
                <MenuItem title="Laporan Penjualan" icon={ClipboardList} color="bg-blue-50" onPress={() => router.push("/(admin)/history")} />
                <MenuItem
                  title="Tren Terlaris"
                  icon={TrendingUp}
                  color="bg-purple-50"
                  // onPress={() => router.push("/(admin)/trends")}
                />
                <MenuItem title="Analitik Bulanan" icon={BarChart3} color="bg-indigo-50" />
              </View>

              <Text className="mt-2 mb-4 ml-2 text-xs font-bold tracking-widest text-gray-400 uppercase">Pengaturan</Text>
              <View className="flex-row flex-wrap justify-start">
                <MenuItem title="Info Toko" icon={Store} />
                <MenuItem title="Settings" icon={Settings} />
              </View>
            </ScrollView>
          </View>
        </View>

        <NavigationBar />
      </SafeAreaView>
    </View>
  );
};

export default AdminHomePage;
