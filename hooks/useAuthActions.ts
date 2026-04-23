import authService from "@/services/auth.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Format email tidak valid").required("Email wajib diisi"),
});

export const resetPasswordSchema = Yup.object().shape({
  token: Yup.string().required("Token reset tidak ditemukan atau tidak valid"),

  newPassword: Yup.string().required("Password baru wajib diisi").min(6, "Password minimal 6 karakter").max(100, "Password maksimal 100 karakter"),

  confirmPassword: Yup.string()
    .required("Konfirmasi password wajib diisi")
    .oneOf([Yup.ref("newPassword")], "Konfirmasi password tidak cocok"),
});

export type TForgotPassword = Yup.InferType<typeof forgotPasswordSchema>;
export type TResetPassword = Yup.InferType<typeof resetPasswordSchema>;

const extractErrorMessage = (err: any, fallback: string) => err?.response?.data?.message || err?.response?.data?.meta?.message || fallback;

export const useForgotPasswordHook = (onSuccess: (msg: string) => void, onError: (msg: string) => void) => {
  const form = useForm<TForgotPassword>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const mutation = useMutation({
    mutationFn: (payload: TForgotPassword) => authService.forgotPassword(payload),
    onSuccess: (res) => onSuccess(res?.meta?.message || "Permintaan berhasil diproses."),
    onError: (err: any) => onError(extractErrorMessage(err, "Terjadi kesalahan")),
  });

  const onSubmit = form.handleSubmit((data) => mutation.mutate(data));

  return { ...form, onSubmit, isLoading: mutation.isPending };
};

export const useResetPasswordHook = (token: string, onSuccess: () => void, onError: (msg: string) => void) => {
  const form = useForm<TResetPassword>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: { token, newPassword: "", confirmPassword: "" },
  });

  const mutation = useMutation({
    mutationFn: (payload: TResetPassword) => authService.resetPassword(payload),
    onSuccess: () => onSuccess(),
    onError: (err: any) => onError(extractErrorMessage(err, "Token kadaluarsa")),
  });

  const onSubmit = form.handleSubmit((data) => mutation.mutate(data));

  return { ...form, onSubmit, isLoading: mutation.isPending };
};
