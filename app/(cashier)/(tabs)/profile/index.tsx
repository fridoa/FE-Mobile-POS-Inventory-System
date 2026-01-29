import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "expo-router";
import { ChevronRight, Lock, LogOut, User } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CashierProfileScreen() {
  const { user, logoutAction } = useAuthStore();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ paddingTop: insets.top + 20 }} className="items-center px-6 pb-8">
          <View className="items-center justify-center w-24 h-24 overflow-hidden border-2 rounded-full bg-emerald-50 border-emerald-100">
            <User size={50} color="#059669" />
          </View>
          <Text className="mt-4 text-xl font-bold text-gray-900 capitalize">{user?.name || "Nama Kasir"}</Text>
          <Text className="text-sm text-gray-500">@{user?.username || "kasirintan"}</Text>
          <TouchableOpacity onPress={() => router.push("/(cashier)/profile/editProfil")} className="mt-4 px-8 py-2.5 bg-gray-900 rounded-xl">
            <Text className="text-sm font-bold text-white">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View className="px-6 mt-4">
          <Text className="text-gray-400 text-[11px] font-black tracking-widest uppercase mb-4 ml-1">Pengaturan Akun</Text>
          <View className="space-y-1">
            <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-50" onPress={() => router.push("/(cashier)/profile/changePassword")}>
              <View className="flex-row items-center">
                <View className="p-2 mr-4 rounded-lg bg-emerald-50">
                  <Lock size={20} color="#059669" />
                </View>
                <Text className="font-semibold text-gray-700">Change Password</Text>
              </View>
              <ChevronRight size={20} color="#D1D5DB" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => logoutAction()} className="flex-row items-center justify-between py-4">
              <View className="flex-row items-center">
                <View className="p-2 mr-4 rounded-lg bg-red-50">
                  <LogOut size={20} color="#EF4444" />
                </View>
                <Text className="font-semibold text-red-500">Log out</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
