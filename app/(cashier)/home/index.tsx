import NavigationBar from "@/components/NavigationBar";
import StatBadge from "@/components/StatBadge";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "expo-router";
import { Banknote, ChevronRight, History, LogOut, PackageSearch, Receipt, ShoppingCart, Ticket } from "lucide-react-native";
import React from "react";
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CashierHomePage = () => {
  const { user, logoutAction } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logoutAction();
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#059669" />

      <View className="bg-[#059669] h-[35vh] w-full absolute top-0 rounded-b-[40px] z-0">
        <View className="absolute top-0 right-0 w-40 h-40 -mr-10 rounded-full bg-white/5" />
        <View className="absolute w-24 h-24 rounded-full top-20 -left-5 bg-white/5" />
      </View>

      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <View className="flex-row items-start justify-between px-6 pt-2 pb-6">
          <View>
            <Text className="mb-1 text-sm font-medium text-emerald-100">Shift Pagi</Text>
            <Text className="text-2xl font-bold text-white capitalize">{user?.username || "Kasir"}</Text>
            <View className="flex-row items-center mt-2">
              <View className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              <Text className="ml-2 text-xs text-emerald-100">Toko Buka • Online</Text>
            </View>
          </View>

          <TouchableOpacity onPress={handleLogout} className="p-2 border bg-white/10 rounded-xl border-white/10">
            <LogOut size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View className="mb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5" contentContainerStyle={{ paddingRight: 20 }}>
            <StatBadge label="Total Omzet" value="Rp 1.250.000" icon={Banknote} />
            <StatBadge label="Transaksi" value="24 Order" icon={Ticket} />
          </ScrollView>
        </View>

        <View className="flex-1 mx-4 overflow-hidden bg-white shadow-sm rounded-t-3xl">
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
            <TouchableOpacity activeOpacity={0.9} className="w-full bg-[#059669] h-32 rounded-3xl p-5 flex-row items-center justify-between shadow-lg shadow-emerald-200 mb-6 relative overflow-hidden">
              <View className="z-10 flex-1 pr-2">
                <View className="items-center justify-center w-12 h-12 mb-3 rounded-full bg-white/20">
                  <ShoppingCart size={24} color="white" fill="white" />
                </View>
                <Text className="text-xl font-bold text-white" numberOfLines={1} adjustsFontSizeToFit>
                  Buat Pesanan
                </Text>
                <Text className="mt-1 text-xs text-emerald-100">Layani pelanggan sekarang</Text>
              </View>

              <View className="z-10 p-2 rounded-full bg-white/20">
                <ChevronRight size={24} color="white" />
              </View>
            </TouchableOpacity>

            <Text className="mb-4 ml-1 text-xs font-bold tracking-widest text-gray-400 uppercase">Menu Lainnya</Text>

            <View className="flex-row flex-wrap justify-between gap-y-4">
              <TouchableOpacity className="w-[48%] bg-gray-50 p-4 rounded-2xl border border-gray-100" onPress={() => router.push("/(cashier)/history")}>
                <View className="items-center justify-center w-10 h-10 mb-3 bg-blue-100 rounded-full">
                  <History size={20} color="#3b82f6" />
                </View>
                <Text className="mb-1 font-bold text-gray-800">Riwayat</Text>
                <Text className="text-xs text-gray-400">Cek transaksi hari ini</Text>
              </TouchableOpacity>

              <TouchableOpacity className="w-[48%] bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <View className="items-center justify-center w-10 h-10 mb-3 bg-orange-100 rounded-full">
                  <PackageSearch size={20} color="#f97316" />
                </View>
                <Text className="mb-1 font-bold text-gray-800">Cek Stok</Text>
                <Text className="text-xs text-gray-400">Cari barang cepat</Text>
              </TouchableOpacity>

              <TouchableOpacity className="w-[48%] bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <View className="items-center justify-center w-10 h-10 mb-3 bg-purple-100 rounded-full">
                  <Receipt size={20} color="#a855f7" />
                </View>
                <Text className="mb-1 font-bold text-gray-800">Laporan</Text>
                <Text className="text-xs text-gray-400">Rekap akhir shift</Text>
              </TouchableOpacity>

              <View className="w-[48%]" />
            </View>
          </ScrollView>
        </View>

        <NavigationBar />
      </SafeAreaView>
    </View>
  );
};

export default CashierHomePage;
