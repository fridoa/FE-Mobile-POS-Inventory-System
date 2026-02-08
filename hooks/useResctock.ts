import productService from "@/services/product.service";
import { IProduct } from "@/types/Product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Linking } from "react-native";
import * as yup from "yup";

export const restockSchema = yup.object({
  addedStock: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
    .typeError("Harus angka")
    .required("Wajib diisi")
    .min(1, "Min. 1"),
});

export type RestockFormData = yup.InferType<typeof restockSchema>;

export const useRestock = () => {
  const queryClient = useQueryClient();

  const {
    data: products,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery<IProduct[]>({
    queryKey: ["products", "low-stock"],
    queryFn: async () => productService.getProduct({ stockStatus: "low", limit: 50 }),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60 * 6,
    placeholderData: (previousData) => previousData,
  });

  const mutation = useMutation({
    mutationFn: async ({ id, newStock }: { id: string; newStock: number }) => {
      return await productService.updateProduct(id, { stock: newStock });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", "low-stock"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["sales-summary"] });
    },
  });

  const shareToWhatsApp = (plannedOrders: Record<string, string>) => {
    const orderItems = products?.filter((p) => plannedOrders[p._id!] && parseInt(plannedOrders[p._id!]) > 0) || [];

    if (orderItems.length === 0) {
      Alert.alert("Isi jumlah rencana order dulu yaa");
      return;
    }

    const date = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" });
    const productList = orderItems.map((p, i) => `${i + 1}. *${p.name}* -> Jumlah Order: ${plannedOrders[p._id!]} pcs`).join("\n");

    const message = `*DAFTAR ORDER BARANG - TOKO INTAN*\nTanggal: ${date}\n\n${productList}\n\n_Mohon segera diproses, terima kasih._`;
    Linking.openURL(`whatsapp://send?text=${encodeURIComponent(message)}`);
  };

  return {
    products: products || [],
    isLoading: isLoading || isRefetching,
    updateStock: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    shareToWhatsApp,
    refresh: refetch,
  };
};
