import authService from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

export const updateProfileSchema = Yup.object().shape({
  name: Yup.string().min(2, "Nama minimal 2 karakter").max(50, "Nama maksimal 50 karakter").required("Nama wajib diisi"),
  username: Yup.string().min(3, "Username minimal 3 karakter").matches(/^\S*$/, "Username tidak boleh mengandung spasi").required("Username wajib diisi"),
  email: Yup.string().email("Format email tidak valid").required("Email wajib diisi"),
});

export const useUpdateProfileHook = (onSuccess: () => void, onError: (msg: string) => void) => {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  const { control, handleSubmit, reset, ...formState } = useForm({
    resolver: yupResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
      });
    }
  }, [user, reset]);

  const mutation = useMutation({
    mutationFn: (payload: any) => authService.updateProfile(payload),
    onSuccess: (res) => {
      if (setUser) setUser(res.data);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      onSuccess();
    },
    onError: (err: any) => {
      onError(err?.response?.data?.message || "Gagal memperbarui profil");
    },
  });

  const onSubmit = handleSubmit((data) => mutation.mutate(data));

  return { control, onSubmit, ...formState, isLoading: mutation.isPending };
};
