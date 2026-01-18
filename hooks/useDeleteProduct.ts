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
      // Invalidate cache agar list produk terupdate otomatis
      queryClient.invalidateQueries({ queryKey: ["product"] });
      Toast.show({
        type: "success",
        text1: "Dihapus",
        text2: "Produk telah dihapus dari inventaris",
      });
      // Jika menghapus dari halaman detail/edit, balik ke halaman sebelumnya
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
