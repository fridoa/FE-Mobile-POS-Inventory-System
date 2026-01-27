import CustomAlert from "@/components/CustomAlert";
import ScreenWrapper from "@/components/ScreenWrapper";
import PageHeader from "@/components/ui/PageHeader";
import { useResetPasswordHook } from "@/hooks/useAuthActions";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Eye, EyeOff, Lock } from "lucide-react-native";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ResetPasswordScreen() {
  const router = useRouter();

  const { token } = useLocalSearchParams<{ token: string }>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [alert, setAlert] = useState({
    visible: false,
    title: "",
    message: "",
    type: "primary" as "primary" | "danger" | "success",
    onConfirm: () => {},
  });

  const { control, onSubmit, isLoading } = useResetPasswordHook(
    token || "",
    () => {
      setAlert({
        visible: true,
        type: "success",
        title: "Berhasil",
        message: "Kata sandi Anda telah diperbarui. Silakan login kembali.",
        onConfirm: () => router.replace("/(auth)"),
      });
    },
    (msg) => {
      setAlert({
        visible: true,
        type: "danger",
        title: "Gagal",
        message: msg,
        onConfirm: () => setAlert((prev) => ({ ...prev, visible: false })),
      });
    },
  );

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-white">
        {/* Header Halaman */}
        <PageHeader title="Reset Password" />
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: 20 }} className="p-6" showsVerticalScrollIndicator={false}>
          <View className="mt-8 mb-8">
            <Text className="text-3xl font-bold text-emerald-800">Atur Ulang</Text>
            <Text className="text-3xl font-bold text-emerald-800">Kata Sandi</Text>
            <Text className="mt-2 text-base text-gray-500">Buat kata sandi baru yang kuat untuk keamanan akun Toko Intan Anda.</Text>
          </View>

          {/* Input Password Baru */}
          <View className="mb-6">
            <Text className="mb-2 font-semibold text-gray-700">Kata Sandi Baru</Text>
            <Controller
              control={control}
              name="newPassword"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View>
                  <View className={`flex-row items-center border-2 rounded-2xl px-4 bg-gray-50 ${error ? "border-red-500" : "border-gray-100"}`}>
                    <Lock color="#10b981" size={20} />
                    <TextInput className="flex-1 px-3 py-4 text-gray-800" placeholder="Minimal 6 karakter" secureTextEntry={!showPassword} value={value} onChangeText={onChange} autoCapitalize="none" />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff color="#9ca3af" size={20} /> : <Eye color="#9ca3af" size={20} />}</TouchableOpacity>
                  </View>
                  {error && <Text className="mt-1 ml-2 text-xs text-red-500">{error.message}</Text>}
                </View>
              )}
            />
          </View>

          {/* Input Konfirmasi Password */}
          <View className="mb-10">
            <Text className="mb-2 font-semibold text-gray-700">Konfirmasi Kata Sandi</Text>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View>
                  <View className={`flex-row items-center border-2 rounded-2xl px-4 bg-gray-50 ${error ? "border-red-500" : "border-gray-100"}`}>
                    <Lock color="#10b981" size={20} />
                    <TextInput className="flex-1 px-3 py-4 text-gray-800" placeholder="Ulangi kata sandi" secureTextEntry={!showConfirmPassword} value={value} onChangeText={onChange} autoCapitalize="none" />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <EyeOff color="#9ca3af" size={20} /> : <Eye color="#9ca3af" size={20} />}</TouchableOpacity>
                  </View>
                  {error && <Text className="mt-1 ml-2 text-xs text-red-500">{error.message}</Text>}
                </View>
              )}
            />
          </View>

          {/* Tombol Simpan */}
          <TouchableOpacity onPress={onSubmit} disabled={isLoading} activeOpacity={0.8} className={`py-4 rounded-2xl items-center shadow-sm ${isLoading ? "bg-gray-300" : "bg-emerald-600"}`}>
            <Text className="text-lg font-bold text-white">{isLoading ? "Menyimpan..." : "Perbarui Kata Sandi"}</Text>
          </TouchableOpacity>

          {/* Notifikasi Custom */}
          <CustomAlert isVisible={alert.visible} type={alert.type} title={alert.title} message={alert.message} confirmText="Oke" onConfirm={alert.onConfirm} onCancel={() => setAlert({ ...alert, visible: false })} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
