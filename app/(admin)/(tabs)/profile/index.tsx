import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "expo-router";
import { Bell, ChevronRight, Lock, LogOut, Settings, User } from "lucide-react-native";
import React, { useState } from "react";
import { Platform, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AdminProfileScreen() {
  const { user, logoutAction } = useAuthStore();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ paddingTop: insets.top + 20 }} className="items-center px-6 pb-8">
          <View className="relative">
            <View className="items-center justify-center w-24 h-24 overflow-hidden border-2 rounded-full bg-emerald-50 border-emerald-100">
              <User size={50} color="#059669" />
            </View>
          </View>

          <Text className="mt-4 text-xl font-bold text-gray-900 capitalize">{user?.name || "Admin Owner"}</Text>
          <Text className="text-sm text-gray-500">@{user?.username || "adminintan"}</Text>

          <TouchableOpacity onPress={() => router.push("/(admin)/profile/editProfil")} className="mt-4 px-8 py-2.5 bg-gray-900 rounded-xl">
            <Text className="text-sm font-bold text-white">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View className="px-6 mt-4">
          <Text className="text-gray-400 text-[11px] font-black tracking-widest uppercase mb-4 ml-1">Pengaturan Akun</Text>

          <View className="space-y-1">
            <View className="flex-row items-center justify-between py-4 border-b border-gray-50">
              <View className="flex-row items-center">
                <View className="p-2 mr-4 rounded-lg bg-emerald-50">
                  <Bell size={20} color="#059669" />
                </View>
                <Text className="font-semibold text-gray-700">Push Notifications</Text>
              </View>
              <Switch trackColor={{ false: "#D1D5DB", true: "#059669" }} thumbColor={Platform.OS === "ios" ? "#FFFFFF" : "#FFFFFF"} onValueChange={() => setIsNotificationsEnabled((prev) => !prev)} value={isNotificationsEnabled} />
            </View>

            <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-50" onPress={() => router.push("/(admin)/profile/changePassword")}>
              <View className="flex-row items-center">
                <View className="p-2 mr-4 rounded-lg bg-emerald-50">
                  <Lock size={20} color="#059669" />
                </View>
                <Text className="font-semibold text-gray-700">Change Password</Text>
              </View>
              <ChevronRight size={20} color="#D1D5DB" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-50">
              <View className="flex-row items-center">
                <View className="p-2 mr-4 rounded-lg bg-emerald-50">
                  <Settings size={20} color="#059669" />
                </View>
                <Text className="font-semibold text-gray-700">Printer Settings</Text>
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

        <View className="items-center mt-12">
          <Text className="text-gray-300 text-[10px] tracking-widest font-bold">TOKO INTAN POS v1.0.2</Text>
        </View>
      </ScrollView>
    </View>
  );
}
