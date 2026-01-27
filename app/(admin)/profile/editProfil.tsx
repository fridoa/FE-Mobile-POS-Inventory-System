import CustomAlert from "@/components/CustomAlert";
import ScreenWrapper from "@/components/ScreenWrapper";
import PageHeader from "@/components/ui/PageHeader";
import { useUpdateProfileHook } from "@/hooks/useUpdateProfile";
import { useRouter } from "expo-router";
import { AtSign, Mail, User } from "lucide-react-native";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function EditProfileScreen() {
  const router = useRouter();
  const [alert, setAlert] = useState({
    visible: false,
    title: "",
    message: "",
    type: "success" as "success" | "danger",
    onConfirm: () => {},
  });

  const { control, onSubmit, isLoading } = useUpdateProfileHook(
    () =>
      setAlert({
        visible: true,
        title: "Berhasil",
        message: "Profil Anda telah diperbarui.",
        type: "success",
        onConfirm: () => {
          setAlert((prev) => ({ ...prev, visible: false }));
          router.back();
        },
      }),
    (msg) =>
      setAlert({
        visible: true,
        title: "Gagal",
        message: msg,
        type: "danger",
        onConfirm: () => setAlert((prev) => ({ ...prev, visible: false })),
      }),
  );

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <PageHeader title="Edit Profile" />

        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: 20 }} className="p-6" showsVerticalScrollIndicator={false}>
          <View className="mt-8 mb-8">
            <Text className="text-3xl font-bold text-emerald-800">Ubah Data Diri</Text>
            <Text className="mt-2 text-base text-gray-500">Perbarui informasi akun Admin Toko Intan Anda.</Text>
          </View>

          <View className="mb-6">
            <Text className="mb-2 font-semibold text-gray-700">Nama Lengkap</Text>

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View>
                  <View className={`flex-row items-center border-2 rounded-2xl px-4 bg-gray-50 ${error ? "border-red-500" : "border-gray-100"}`}>
                    <User color="#10b981" size={20} />

                    <TextInput className="flex-1 px-3 py-4 font-medium text-gray-800" placeholder="Masukkan nama lengkap" value={value} onChangeText={onChange} />
                  </View>

                  {error && <Text className="mt-1 ml-2 text-xs text-red-500">{error.message}</Text>}
                </View>
              )}
            />
          </View>

          <View className="mb-6">
            <Text className="mb-2 font-semibold text-gray-700">Username</Text>

            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View>
                  <View className={`flex-row items-center border-2 rounded-2xl px-4 bg-gray-50 ${error ? "border-red-500" : "border-gray-100"}`}>
                    <AtSign color="#10b981" size={20} />

                    <TextInput className="flex-1 px-3 py-4 font-medium text-gray-800" placeholder="username_admin" autoCapitalize="none" value={value} onChangeText={onChange} />
                  </View>

                  {error && <Text className="mt-1 ml-2 text-xs text-red-500">{error.message}</Text>}
                </View>
              )}
            />
          </View>

          <View className="mb-10">
            <Text className="mb-2 font-semibold text-gray-700">Email</Text>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View>
                  <View className={`flex-row items-center border-2 rounded-2xl px-4 bg-gray-50 ${error ? "border-red-500" : "border-gray-100"}`}>
                    <Mail color="#10b981" size={20} />

                    <TextInput className="flex-1 px-3 py-4 font-medium text-gray-800" placeholder="admin@tokointan.com" keyboardType="email-address" autoCapitalize="none" value={value} onChangeText={onChange} />
                  </View>

                  {error && <Text className="mt-1 ml-2 text-xs text-red-500">{error.message}</Text>}
                </View>
              )}
            />
          </View>

          <TouchableOpacity onPress={onSubmit} disabled={isLoading} activeOpacity={0.8} className={`py-4 rounded-2xl items-center shadow-sm ${isLoading ? "bg-gray-300" : "bg-emerald-600"}`}>
            <Text className="text-lg font-bold text-white">{isLoading ? "Menyimpan..." : "Simpan Perubahan"}</Text>
          </TouchableOpacity>

          <CustomAlert isVisible={alert.visible} type={alert.type} title={alert.title} message={alert.message} confirmText="Oke" onConfirm={alert.onConfirm} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
