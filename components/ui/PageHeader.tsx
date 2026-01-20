import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface PageHeaderProps {
  title: string;

  showBackButton?: boolean;

  onBack?: () => void;
  rightElement?: React.ReactNode;
}

const PageHeader = ({ title, showBackButton = true, onBack, rightElement }: PageHeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-50">
      <View className="flex-row items-center flex-1">
        {showBackButton && (
          <TouchableOpacity onPress={handleBack} className="p-1 mr-4">
            <ChevronLeft size={24} color="#1f2937" />
          </TouchableOpacity>
        )}
        <Text className="text-xl font-bold text-gray-800" numberOfLines={1}>
          {title}
        </Text>
      </View>

      {rightElement && <View>{rightElement}</View>}
    </View>
  );
};

export default PageHeader;
