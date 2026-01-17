import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
}

const PageHeader = ({ title, onBack }: PageHeaderProps) => {
  const router = useRouter();

  return (
    <View className="flex-row items-center px-6 py-4 bg-white border-b border-gray-100">
      <TouchableOpacity onPress={onBack || (() => router.back())} className="p-1 mr-4 rounded-full bg-gray-50">
        <ArrowLeft size={24} color="#374151" />
      </TouchableOpacity>
      <Text className="text-xl font-bold text-gray-800">{title}</Text>
    </View>
  );
};

export default PageHeader;
 