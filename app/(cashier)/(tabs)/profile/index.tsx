import { useAuthStore } from "@/stores/auth.store";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { Edit2, Lock, LogOut, ShieldCheck, User } from "lucide-react-native";
import React from "react";
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

const { width } = Dimensions.get("window");

export default function CashierProfileScreen() {
  const { user, logoutAction } = useAuthStore();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const version = Constants.expoConfig?.version || "1.0.0";

  return (
    <View className="flex-1 bg-white">
      {/* 1. Gelombang Atas */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height={200} width={width} viewBox="0 0 1440 320" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="gradTop" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#059669" stopOpacity="1" />
              <Stop offset="1" stopColor="#10B981" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Path
            fill="url(#gradTop)"
            d="M0,160L60,149.3C120,139,240,117,360,112C480,107,600,117,720,138.7C840,160,960,192,1080,181.3C1200,171,1320,117,1380,90.7L1440,64L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          />
        </Svg>
      </View>

      {/* 2. Gelombang Kanan Bawah (Ditinggikan) */}
      <View className="absolute bottom-0 right-0" style={{ zIndex: -1 }}>
        <Svg height={220} width={200} viewBox="0 0 200 220">
          <Path
            fill="#10B981"
            fillOpacity="0.08" 
            // Lekukan dibuat lebih tinggi ke atas (titik L200,40)
            d="M200,220 L200,40 C140,60 80,140 0,220 Z"
          />
        </Svg>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }} bounces={false}>
        {/* Konten Utama */}
        <View style={{ paddingTop: insets.top + 25 }} className="items-center px-6">
          <View className="relative">
            <View className="w-28 h-28 rounded-full bg-white items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                <View className="w-full h-full bg-emerald-50 items-center justify-center">
                    <User size={60} color="#059669" />
                </View>
            </View>
            <View className="absolute bottom-1 right-1 w-8 h-8 bg-emerald-500 rounded-full border-2 border-white items-center justify-center">
                <ShieldCheck size={14} color="white" />
            </View>
          </View>

          <View className="mt-4 items-center">
            <Text className="text-2xl font-bold text-gray-900 capitalize">{user?.name || "Kasir Intan"}</Text>
            <Text className="text-gray-500 font-medium mt-1">@{user?.username || "kasir01"}</Text>
          </View>
        </View>

        {/* Action Buttons Row */}
        <View className="flex-row justify-center mt-8 space-x-10 gap-x-8">
            <TouchableOpacity onPress={() => router.push("/(cashier)/profile/editProfil")} className="items-center space-y-2">
                <View className="w-14 h-14 bg-blue-50 rounded-full items-center justify-center shadow-sm">
                    <Edit2 size={24} color="#3B82F6" />
                </View>
                <Text className="text-xs font-semibold text-gray-600">Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/(cashier)/profile/changePassword")} className="items-center space-y-2">
                <View className="w-14 h-14 bg-orange-50 rounded-full items-center justify-center shadow-sm">
                    <Lock size={24} color="#F97316" />
                </View>
                <Text className="text-xs font-semibold text-gray-600">Password</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => logoutAction()} className="items-center space-y-2">
                <View className="w-14 h-14 bg-red-50 rounded-full items-center justify-center shadow-sm">
                    <LogOut size={24} color="#EF4444" />
                </View>
                <Text className="text-xs font-semibold text-gray-600">Logout</Text>
            </TouchableOpacity>
        </View>

        {/* Section About */}
        <View className="mt-10 px-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">Tentang Aplikasi</Text>
            <View className="bg-white/80 p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <View className="flex-row justify-between items-center pb-4 border-b border-gray-50">
                    <Text className="text-gray-500">Aplikasi</Text>
                    <Text className="font-semibold text-gray-900">Toko Intan POS</Text>
                </View>
                <View className="flex-row justify-between items-center pb-4 border-b border-gray-50">
                    <Text className="text-gray-500">Versi</Text>
                    <Text className="font-semibold text-gray-900">{version}</Text>
                </View>
                <View className="flex-row justify-between items-center">
                    <Text className="text-gray-500">Status</Text>
                    <View className="bg-emerald-100 px-3 py-1 rounded-full">
                        <Text className="text-[10px] font-bold text-emerald-700">AKTIF</Text>
                    </View>
                </View>
            </View>
        </View>

        {/* Footer */}
        <View className="items-center mt-12 mb-8">
            <Text className="text-[10px] text-gray-400 text-center leading-4">
                Toko Intan App{'\n'}
                © 2026 All Rights Reserved
            </Text>
        </View>
      </ScrollView>
    </View>
  );
}