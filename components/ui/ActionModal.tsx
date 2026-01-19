import React from "react";
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface ActionModalProps {
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  children: React.ReactNode;
  loading?: boolean;
  submitLabel?: string;
}

const ActionModal: React.FC<ActionModalProps> = ({  onClose, onSubmit, title, children, loading = false, submitLabel = "Simpan" }) => {
  return (
    <Modal visible={true} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <Pressable className="justify-end flex-1 bg-black/50" onPress={loading ? undefined : onClose}>
          <Pressable className="bg-white rounded-t-[32px] max-h-[90%] w-full">
            <View className="items-center py-4">
              <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
            </View>

            <View className="px-6 pb-4">
              <Text className="text-xl font-bold text-gray-900">{title}</Text>
            </View>

            <ScrollView className="px-6" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {children}
              <View className="h-6" />
            </ScrollView>

            <View className="flex-row px-6 py-6 border-t border-gray-100 gap-x-4">
              <TouchableOpacity onPress={onClose} disabled={loading} className={`flex-1 py-4 bg-gray-100 rounded-2xl items-center ${loading ? "opacity-50" : ""}`}>
                <Text className="font-bold text-gray-600">Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={onSubmit} disabled={loading} className={`flex-[2] py-4 bg-[#059669] rounded-2xl items-center flex-row justify-center ${loading ? "opacity-70" : ""}`}>
                {loading ? <ActivityIndicator color="white" size="small" /> : <Text className="text-base font-bold text-white">{submitLabel}</Text>}
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ActionModal;
