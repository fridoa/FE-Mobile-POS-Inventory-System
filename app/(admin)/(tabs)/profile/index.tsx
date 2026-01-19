import { useAuthStore } from "@/stores/auth.store";
import { Bell, ChevronRight, LogOut, Mail, Settings, ShieldCheck, Store, User } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AdminProfileScreen() {
  const { user, logoutAction } = useAuthStore();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-gray-50">
      {/* --- HEADER SECTION --- */}
      <View style={{ paddingTop: insets.top + 20 }} className="bg-[#059669] pb-24 px-6 rounded-b-[50px] items-center">
        <View className="items-center justify-center w-24 h-24 mb-4 overflow-hidden border-4 rounded-full bg-white/20 border-white/30">
          <User size={48} color="white" />
        </View>
        <Text className="text-2xl font-bold text-white capitalize">{user?.username || "Admin Owner"}</Text>
        <View className="flex-row items-center px-3 py-1 mt-1 rounded-full bg-white/20">
          <ShieldCheck size={14} color="white" />
          <Text className="ml-2 text-xs font-medium text-white">Administrator</Text>
        </View>
      </View>

      <View className="flex-1 px-6 -mt-16">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          <View className="p-5 mb-6 bg-white shadow-sm rounded-3xl">
            <Text className="text-gray-400 text-[10px] font-black tracking-widest uppercase mb-4">Informasi Akun</Text>

            <View className="flex-row items-center justify-between py-3 border-b border-gray-50">
              <View className="flex-row items-center">
                <View className="items-center justify-center w-10 h-10 mr-4 bg-emerald-50 rounded-xl">
                  <Mail size={20} color="#059669" />
                </View>
                <View>
                  <Text className="text-gray-400 text-[10px]">Nama Lengkap</Text>
                  <Text className="font-semibold text-gray-800">{user?.name || "admin@tokointan.com"}</Text>
                </View>
              </View>
            </View>

            <View className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <View className="items-center justify-center w-10 h-10 mr-4 bg-emerald-50 rounded-xl">
                  <Store size={20} color="#059669" />
                </View>
                <View>
                  <Text className="text-gray-400 text-[10px]">Nama Toko</Text>
                  <Text className="font-semibold text-gray-800">Toko Intan</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Card: Pengaturan & Aplikasi */}
          <View className="p-5 mb-6 bg-white shadow-sm rounded-3xl">
            <Text className="text-gray-400 text-[10px] font-black tracking-widest uppercase mb-4">Aplikasi</Text>

            <TouchableOpacity className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <View className="items-center justify-center w-10 h-10 mr-4 bg-gray-50 rounded-xl">
                  <Bell size={20} color="#9CA3AF" />
                </View>
                <Text className="font-medium text-gray-700">Notifikasi Stok</Text>
              </View>
              <ChevronRight size={20} color="#D1D5DB" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <View className="items-center justify-center w-10 h-10 mr-4 bg-gray-50 rounded-xl">
                  <Settings size={20} color="#9CA3AF" />
                </View>
                <Text className="font-medium text-gray-700">Pengaturan Printer</Text>
              </View>
              <ChevronRight size={20} color="#D1D5DB" />
            </TouchableOpacity>
          </View>

          {/* Tombol Logout */}
          <TouchableOpacity onPress={() => logoutAction()} className="flex-row items-center justify-center py-4 border border-red-100 bg-red-50 rounded-2xl">
            <LogOut size={20} color="#EF4444" />
            <Text className="ml-3 font-bold text-red-500">Keluar dari Akun</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}
