import authService from "@/services/auth.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

export const changePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Kata sandi lama wajib diisi"),
  newPassword: Yup.string().required("Kata sandi baru wajib diisi").min(6, "Kata sandi baru minimal 6 karakter").max(100, "Kata sandi baru maksimal 100 karakter"),
  confirmPassword: Yup.string()
    .required("Konfirmasi kata sandi wajib diisi")
    .oneOf([Yup.ref("newPassword")], "Konfirmasi kata sandi tidak cocok"),
});

type TChangePassword = Yup.InferType<typeof changePasswordSchema>;

export const useChangePasswordHook = (onSuccess: () => void, onError: (msg: string) => void) => {
  const form = useForm<TChangePassword>({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (payload: TChangePassword) => authService.changePassword(payload),
    onSuccess: async () => {
      onSuccess();

      form.reset();
    },
    onError: (err: any) => {
      onError(err?.response?.data?.message || "Gagal mengganti kata sandi");
    },
  });

  const onSubmit = form.handleSubmit((data) => mutation.mutate(data));

  return { ...form, onSubmit, isLoading: mutation.isPending };
};
