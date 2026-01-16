import userService from "@/services/user.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import * as yup from "yup";

interface CashierFormValues {
  name: string;
  username: string;
  password?: string;
}

const cashierSchema = yup.object().shape({
  name: yup.string().required("Nama Lengkap wajib diisi").min(3, "Nama minimal 3 karakter"),
  username: yup.string().required("Username wajib diisi").min(3, "Username minimal 3 karakter"),
  password: yup.string().when("$isEdit", {
    is: true,

    then: (schema) => schema.notRequired().transform((v) => (v === "" ? undefined : v)),
    otherwise: (schema) => schema.required("Password wajib diisi").min(6, "Password minimal 6 karakter"),
  }),
});

export const useCashierForm = (isEdit: boolean, onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CashierFormValues>({
    resolver: yupResolver(cashierSchema) as any,
    context: { isEdit },
    defaultValues: { name: "", username: "", password: "" },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["cashiers"] });

  const createMutation = useMutation({
    mutationFn: (data: CashierFormValues) => userService.createCashier(data),
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Berhasil!", text2: "Kasir baru telah ditambahkan" });
      invalidate();
      onSuccessCallback?.();
    },
    onError: (err: any) => Toast.show({ type: "error", text1: "Gagal", text2: err.response?.data?.message }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CashierFormValues> }) => userService.updateCashier(id, data),
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Berhasil!", text2: "Data kasir diperbarui" });
      invalidate();
      onSuccessCallback?.();
    },
    onError: (err: any) => Toast.show({ type: "error", text1: "Gagal", text2: err.response?.data?.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => userService.deleteCashier(id),
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Terhapus", text2: "Kasir telah dihapus" });
      invalidate();
    },
    onError: () => Toast.show({ type: "error", text1: "Gagal menghapus kasir" }),
  });

  return {
    control,
    handleSubmit,
    errors,
    reset,
    formState: { isDirty },
    createCashier: createMutation.mutate,
    updateCashier: updateMutation.mutate,
    deleteCashier: deleteMutation.mutate,
    isPending: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
};
