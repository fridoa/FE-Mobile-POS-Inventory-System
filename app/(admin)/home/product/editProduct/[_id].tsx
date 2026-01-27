import ScreenWrapper from "@/components/ScreenWrapper";
import ProductFormUI from "@/components/ui/ProductFormUI";
import productService from "@/services/product.service";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function EditProductScreen() {
  const { _id } = useLocalSearchParams<{ _id: string }>();

  const { data: product, isLoading } = useQuery({
    queryKey: ["products", _id],
    queryFn: () => productService.getProductById(_id!),
    enabled: !!_id,
  });

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="large" color="#059669" />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ProductFormUI initialData={product ?? undefined} />
    </ScreenWrapper>
  );
}
