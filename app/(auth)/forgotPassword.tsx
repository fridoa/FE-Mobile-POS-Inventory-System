import CustomAlert from "@/components/CustomAlert";
import ScreenWrapper from "@/components/ScreenWrapper";
import PageHeader from "@/components/ui/PageHeader";
import { useForgotPasswordHook } from "@/hooks/useAuthActions";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ForgotPasswordScreen() {
  const [alert, setAlert] = useState({
    visible: false,
    title: "",
    message: "",
    type: "success" as "success" | "danger" | "primary",
  });

  const { control, onSubmit, isLoading } = useForgotPasswordHook(
    (serverMessage) =>
      setAlert({
        visible: true,
        title: "Berhasil",
        message: serverMessage,
        type: "success",
      }),
    (msg) =>
      setAlert({
        visible: true,
        title: "Gagal",
        message: msg,
        type: "danger",
      }),
  );

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-white">
        <PageHeader title="Lupa Password" />
        <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingTop: 20 }} showsVerticalScrollIndicator={false}>
          <View className="mt-8">
            <Text className="text-3xl font-bold text-emerald-800">Lupa Password?</Text>
            <Text className="mt-2 text-base text-gray-500">Masukkan email terdaftar untuk menerima tautan pemulihan kata sandi.</Text>
          </View>

          <View className="mt-10">
            <Text className="mb-2 font-semibold text-gray-700">Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View>
                  <TextInput
                    placeholder="example@tokointan.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    className={`border-2 p-4 rounded-2xl bg-gray-50 text-gray-800 ${error ? "border-red-500" : "border-gray-100"}`}
                    value={value}
                    onChangeText={onChange}
                  />
                  {error && <Text className="mt-1 ml-2 text-xs text-red-500">{error.message}</Text>}
                </View>
              )}
            />
          </View>

          <TouchableOpacity onPress={onSubmit} disabled={isLoading} activeOpacity={0.8} className={`mt-8 py-4 rounded-2xl items-center shadow-sm ${isLoading ? "bg-gray-300" : "bg-emerald-600"}`}>
            <Text className="text-lg font-bold text-white">{isLoading ? "Memproses..." : "Kirim"}</Text>
          </TouchableOpacity>

          {/* Notifikasi Custom */}
          <CustomAlert isVisible={alert.visible} type={alert.type} title={alert.title} message={alert.message} confirmText="Siap, Dimengerti" onConfirm={() => setAlert({ ...alert, visible: false })} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
