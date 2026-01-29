import CustomAlert from "@/components/CustomAlert";
import ScreenWrapper from "@/components/ScreenWrapper";
import PageHeader from "@/components/ui/PageHeader";
import { useChangePasswordHook } from "@/hooks/useChangePassword";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "expo-router";
import { Eye, EyeOff, Lock } from "lucide-react-native";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function CashierChangePasswordScreen() {
  const { logoutAction } = useAuthStore();
  const router = useRouter();
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [alert, setAlert] = useState({
    visible: false,
    title: "",
    message: "",
    type: "success" as "success" | "danger",
    onConfirm: () => {},
  });

  const { control, onSubmit, isLoading } = useChangePasswordHook(
    () =>
      setAlert({
        visible: true,
        title: "Berhasil",
        message: "Kata sandi Kasir diperbarui. Silakan login kembali.",
        type: "success",
        onConfirm: async () => {
          await logoutAction();
          router.replace("/(auth)");
        },
      }),
    (msg) =>
      setAlert({
        visible: true,
        title: "Gagal",
        message: msg,
        type: "danger",
        onConfirm: () => setAlert((p) => ({ ...p, visible: false })),
      }),
  );

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-white">
        <PageHeader title="Ganti Password Kasir" />
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: 20 }} className="p-6">
          <View className="mt-8 mb-8">
            <Text className="text-3xl font-bold text-emerald-800">Keamanan Kasir</Text>
            <Text className="mt-2 text-gray-500">Ganti kata sandi secara berkala untuk menjaga keamanan akses kasir.</Text>
          </View>

          {/* Password Lama */}
          <View className="mb-5">
            <Text className="mb-2 font-semibold text-gray-700">Kata Sandi Lama</Text>
            <Controller
              control={control}
              name="oldPassword"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View>
                  <View className={`flex-row items-center border-2 rounded-2xl px-4 bg-gray-50 ${error ? "border-red-500" : "border-gray-100"}`}>
                    <Lock color="#10b981" size={20} />
                    <TextInput className="flex-1 px-3 py-4 text-gray-800" secureTextEntry={!showOld} value={value} onChangeText={onChange} placeholder="Masukkan sandi saat ini" />
                    <TouchableOpacity onPress={() => setShowOld(!showOld)}>{showOld ? <EyeOff color="#9ca3af" size={20} /> : <Eye color="#9ca3af" size={20} />}</TouchableOpacity>
                  </View>
                  {error && <Text className="mt-1 ml-2 text-xs text-red-500">{error.message}</Text>}
                </View>
              )}
            />
          </View>

          {/* Password Baru */}
          <View className="mb-5">
            <Text className="mb-2 font-semibold text-gray-700">Kata Sandi Baru</Text>
            <Controller
              control={control}
              name="newPassword"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View>
                  <View className={`flex-row items-center border-2 rounded-2xl px-4 bg-gray-50 ${error ? "border-red-500" : "border-gray-100"}`}>
                    <Lock color="#10b981" size={20} />
                    <TextInput className="flex-1 px-3 py-4 text-gray-800" secureTextEntry={!showNew} value={value} onChangeText={onChange} placeholder="Minimal 6 karakter" />
                    <TouchableOpacity onPress={() => setShowNew(!showNew)}>{showNew ? <EyeOff color="#9ca3af" size={20} /> : <Eye color="#9ca3af" size={20} />}</TouchableOpacity>
                  </View>
                  {error && <Text className="mt-1 ml-2 text-xs text-red-500">{error.message}</Text>}
                </View>
              )}
            />
          </View>

          {/* Konfirmasi Password */}
          <View className="mb-10">
            <Text className="mb-2 font-semibold text-gray-700">Ulangi Sandi Baru</Text>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View>
                  <View className={`flex-row items-center border-2 rounded-2xl px-4 bg-gray-50 ${error ? "border-red-500" : "border-gray-100"}`}>
                    <Lock color="#10b981" size={20} />
                    <TextInput className="flex-1 px-3 py-4 text-gray-800" secureTextEntry={!showConfirm} value={value} onChangeText={onChange} placeholder="Konfirmasi sandi baru" />
                    <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>{showConfirm ? <EyeOff color="#9ca3af" size={20} /> : <Eye color="#9ca3af" size={20} />}</TouchableOpacity>
                  </View>
                  {error && <Text className="mt-1 ml-2 text-xs text-red-500">{error.message}</Text>}
                </View>
              )}
            />
          </View>

          <TouchableOpacity onPress={onSubmit} disabled={isLoading} className={`py-4 rounded-2xl items-center ${isLoading ? "bg-gray-300" : "bg-emerald-600"}`}>
            <Text className="text-lg font-bold text-white">{isLoading ? "Memperbarui..." : "Ganti Kata Sandi"}</Text>
          </TouchableOpacity>

          <CustomAlert isVisible={alert.visible} type={alert.type} title={alert.title} message={alert.message} confirmText="Oke" onConfirm={alert.onConfirm} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
