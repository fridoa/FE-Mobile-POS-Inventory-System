import productService from "@/services/product.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["sales-summary"] });
      Toast.show({
        type: "success",
        text1: "Dihapus",
        text2: "Produk telah dihapus dari inventaris",
      });

      if (router.canGoBack()) {
        router.back();
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.meta?.message || "Gagal menghapus produk";
      Toast.show({
        type: "error",
        text1: "Gagal",
        text2: message,
      });
    },
  });

  return {
    deleteProduct: mutation.mutate,
    isDeleting: mutation.isPending,
  };
};
