import categoryService from "@/services/category.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import * as yup from "yup";

const categorySchema = yup.object().shape({
  name: yup.string().required("Nama Kategori wajib diisi").min(3, "Nama minimal 3 karakter"),
});

type CategoryFormValues = yup.InferType<typeof categorySchema>;

export const useCategoryForm = (isEdit: boolean, onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CategoryFormValues>({
    resolver: yupResolver(categorySchema) as any,
    context: { isEdit },
    defaultValues: { name: "" },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["categories"] });

  const createMutationCategory = useMutation({
    mutationFn: (data: CategoryFormValues) => categoryService.createCategory(data),
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Berhasil!", text2: "Kategori baru telah berhasil ditambahkan" });
      invalidate();
      onSuccessCallback?.();
    },
    onError: (err: any) => {
      console.error("Create Error:", err.response?.data); // Log detail error backend
      Toast.show({
        type: "error",
        text1: "Gagal",
        text2: err.response?.data?.message || "Terjadi kesalahan sistem",
      });
    },
  });

  const updateMutationCategory = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CategoryFormValues> }) => categoryService.updateCategory(id, data),
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Berhasil!", text2: "Data kategori berhasil diperbarui" });
      invalidate();
      onSuccessCallback?.();
    },
    onError: (err: any) => Toast.show({ type: "error", text1: "Gagal", text2: err.response?.data?.message }),
  });

  const deleteMutationCategory = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Terhapus", text2: "Kategori telah dihapus" });
      invalidate();
    },
    onError: () => Toast.show({ type: "error", text1: "Gagal menghapus kategori" }),
  });

  return {
    control,
    handleSubmit,
    errors,
    reset,
    formState: { isDirty },
    createCategory: createMutationCategory.mutate,
    updateCategory: updateMutationCategory.mutate,
    deleteCategory: deleteMutationCategory.mutate,
    isPending: createMutationCategory.isPending || updateMutationCategory.isPending || deleteMutationCategory.isPending,
  };
};
