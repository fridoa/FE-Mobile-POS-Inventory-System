import { useLogin } from "@/hooks/useLogin";
import { Eye, EyeOff, Lock, User } from "lucide-react-native";
import React from "react";
import { Controller } from "react-hook-form";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const { control, handleSubmit, handleLogin, isPending, errors, isVisible, toggleVisibility } = useLogin();

  return (
    <View className="flex-1 bg-[#059669]">
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false} showsVerticalScrollIndicator={false}>
            {/* Header Section */}
            <View className="h-[25vh] justify-center px-6">
              <View className="absolute w-48 h-48 bg-white rounded-full opacity-20 -top-10 -right-10" />
              <View className="absolute w-32 h-32 bg-white rounded-full opacity-10 top-20 -left-10" />

              <Text className="mb-2 text-4xl font-bold text-white">Hello!</Text>
              <Text className="text-lg text-emerald-100">Securely log in to manage your inventory.</Text>
            </View>

            {/* Form Section */}
            <View className="flex-1 bg-white rounded-t-[40px] px-8 pt-10 pb-8 shadow-2xl">
              <Text className="mb-8 text-2xl font-bold text-center text-gray-800">Sign In</Text>

              <View className="gap-5">
                {/* Username Input */}
                <View className="gap-2">
                  <Controller
                    control={control}
                    name="username"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View className={`flex-row items-center bg-gray-50 border rounded-2xl h-14 px-4 ${errors.username ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-emerald-500 focus:bg-emerald-50"}`}>
                        <User size={20} color={errors.username ? "#ef4444" : "#9ca3af"} />
                        <TextInput className="flex-1 ml-3 text-base text-gray-800" placeholder="Username" placeholderTextColor="#9ca3af" onBlur={onBlur} onChangeText={onChange} value={value} autoCapitalize="none" />
                      </View>
                    )}
                  />
                  {errors.username && <Text className="ml-1 text-xs text-red-500">{errors.username.message}</Text>}
                </View>

                {/* Password Input */}
                <View className="gap-2">
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View className={`flex-row items-center bg-gray-50 border rounded-2xl h-14 px-4 ${errors.password ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-emerald-500 focus:bg-emerald-50"}`}>
                        <Lock size={20} color={errors.password ? "#ef4444" : "#9ca3af"} />
                        <TextInput className="flex-1 ml-3 text-base text-gray-800" placeholder="Password" placeholderTextColor="#9ca3af" secureTextEntry={!isVisible} onBlur={onBlur} onChangeText={onChange} value={value} />
                        <TouchableOpacity onPress={toggleVisibility}>{isVisible ? <EyeOff size={20} color="#9ca3af" /> : <Eye size={20} color="#9ca3af" />}</TouchableOpacity>
                      </View>
                    )}
                  />
                  {errors.password && <Text className="ml-1 text-xs text-red-500">{errors.password.message}</Text>}
                </View>

                {/* Forgot Password & Options */}
                <View className="flex-row items-center justify-end mt-1">
                  <TouchableOpacity>
                    <Text className="text-sm font-semibold text-emerald-600">Forgot Password?</Text>
                  </TouchableOpacity>
                </View>

                

                {/* Login Button */}
                <TouchableOpacity
                  onPress={handleSubmit(handleLogin)}
                  disabled={isPending}
                  className={`h-14 rounded-2xl flex-row justify-center items-center mt-4 shadow-lg shadow-emerald-200 ${isPending ? "bg-emerald-400" : "bg-[#059669]"}`}
                >
                  {isPending ? <ActivityIndicator color="white" /> : <Text className="text-lg font-bold text-white">Login</Text>}
                </TouchableOpacity>

                
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
