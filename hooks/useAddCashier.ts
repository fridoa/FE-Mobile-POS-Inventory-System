import userService from "@/services/user.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import * as yup from "yup";

const cashierSchema = yup.object().shape({
  name: yup.string().required("Nama Lengkap wajib diisi").min(3, "Nama minimal 3 karakter"),
  username: yup.string().required("Username wajib diisi").min(3, "Username minimal 3 karakter"),
  password: yup.string().required("Password wajib diisi").min(6, "Password minimal 6 karakter"),
});

type AddCashierFormValues = yup.InferType<typeof cashierSchema>;

export const useAddCashier = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },

  } = useForm<AddCashierFormValues>({
    resolver: yupResolver(cashierSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (payload: AddCashierFormValues) => {
      const response = await userService.createCashier(payload);
      return response.data;
    },

    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Berhasil menambahkan kasir",
      });

      queryClient.invalidateQueries({ queryKey: ["cashiers"] });

      reset();

      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },

    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.response?.data?.meta?.message || "Terjadi kesalahan saat menambahkan kasir";

      setError("root", {
        message: errorMessage,
      });

      Toast.show({
        type: "error",
        text1: "Gagal menambahkan kasir",
        text2: errorMessage,
      });
    },
  });

  const handleAddCashier = (data: AddCashierFormValues) => mutation.mutate(data);

  return {
    control,
    handleSubmit,
    errors,
    handleAddCashier,
    reset,
    formState: { isDirty },
    isPending: mutation.isPending,
  };
};
