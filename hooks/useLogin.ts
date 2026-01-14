import authService from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { ILoginRequest } from "@/types/Auth";
import { setTokens } from "@/utils/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import * as yup from "yup";

const loginSchema = yup.object().shape({
  username: yup.string().required("Username wajib diisi").min(3, "Username minimal 3 karakter"),
  password: yup.string().required("Password wajib diisi").min(6, "Password minimal 6 karakter"),
});

export const useLogin = () => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const loginAction = useAuthStore((state) => state.loginAction);

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: async (payload: ILoginRequest) => {
      const loginResponse = await authService.login(payload);
      const { accessToken, refreshToken } = loginResponse.data;

      await setTokens(accessToken, refreshToken);

      const profileResponse = await authService.getProfile();

      return {
        user: profileResponse.data,
        accessToken,
        refreshToken,
      };
    },

    onSuccess: async (data) => {
      await loginAction(data.user, data.accessToken, data.refreshToken);

      Toast.show({
        type: "success",
        text1: "Login Successfull",
        text2: "Welcome back!👋",
      });

      reset();
    },

    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.response?.data?.meta?.message || "Terjadi kesalahan saat login";

      setError("root", {
        message: errorMessage,
      });

      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: errorMessage,
      });
    },
  });

  const handleLogin = (data: ILoginRequest) => mutation.mutate(data);

  return {
    control,
    handleSubmit,
    handleLogin,
    isPending: mutation.isPending,
    errors,
    isVisible,
    toggleVisibility,
  };
};
