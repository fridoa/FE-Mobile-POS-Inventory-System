import ScreenWrapper from "@/components/ScreenWrapper";
import PageHeader from "@/components/ui/PageHeader";
import React from "react";
import { Text, View } from "react-native";

const restockScreen = () => {
  return (
    <ScreenWrapper>
      <PageHeader title="Restock Produk" />
      <View className="items-center justify-center flex-1">
        <Text>restockScreen</Text>
      </View>
    </ScreenWrapper>
  );
};

export default restockScreen;
