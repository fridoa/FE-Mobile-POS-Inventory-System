import { AlertCircle, CheckCircle, HelpCircle, X } from "lucide-react-native";
import React from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

export interface CustomAlertProps {
  isVisible: boolean;
  type: "danger" | "primary" | "success";
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

const CustomAlert = ({ isVisible, type, title, message, confirmText, cancelText = "Cancel", onConfirm, onCancel }: CustomAlertProps) => {
  const isDanger = type === "danger";
  const isSuccess = type === "success";

  return (
    <Modal transparent visible={isVisible} animationType="fade" onRequestClose={onCancel}>
      <Pressable className="items-center justify-center flex-1 px-6 bg-black/40" onPress={onCancel}>
        <Pressable className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-xl overflow-hidden">
          {/* Tombol Close di pojok kanan atas */}
          <TouchableOpacity onPress={onCancel} className="absolute z-10 p-1 right-5 top-5">
            <X color="#9ca3af" size={20} />
          </TouchableOpacity>

          {/* Bagian Icon */}
          <View className="items-center mt-2 mb-4">
            <View className={`p-4 rounded-full ${isDanger ? "bg-red-50" : isSuccess ? "bg-emerald-50" : "bg-blue-50"}`}>
              {isDanger ? <AlertCircle color="#ef4444" size={32} strokeWidth={2.5} /> : isSuccess ? <CheckCircle color="#10b981" size={32} strokeWidth={2.5} /> : <HelpCircle color="#2563eb" size={32} strokeWidth={2.5} />}
            </View>
          </View>

          {/* Bagian Teks */}
          <View className="items-center mb-8">
            <Text className="mb-2 text-xl font-bold text-center text-gray-900">{title}</Text>
            <Text className="px-2 text-sm leading-5 text-center text-gray-500">{message}</Text>
          </View>

          {/* Bagian Tombol Aksi */}
          <View className="flex-row gap-x-3">
            <TouchableOpacity onPress={onCancel} className="flex-1 border border-gray-200 py-3.5 rounded-2xl items-center justify-center">
              <Text className="text-base font-bold text-gray-700">{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onConfirm} className={`flex-1 py-3.5 rounded-2xl items-center justify-center shadow-sm ${isDanger ? "bg-red-500" : isSuccess ? "bg-emerald-600" : "bg-blue-600"}`}>
              <Text className="text-base font-bold text-white">{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default CustomAlert;
