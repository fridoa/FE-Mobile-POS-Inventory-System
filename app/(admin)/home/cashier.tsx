import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { UserCog } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import { ActivityIndicator, RefreshControl, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CashierCard from "@/components/CashierCard";
import CustomAlert, { CustomAlertProps } from "@/components/CustomAlert";
import ActionModal from "@/components/ui/ActionModal";
import FloatingAddButton from "@/components/ui/FloatingAddButton";
import FormInput from "@/components/ui/FormInput";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import { useCashierForm } from "@/hooks/useCashierForm";
import { useDebounce } from "@/hooks/useDebounce";
import userService from "@/services/user.service";
import { IUser } from "@/types/User";

const CashierPage = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const [alertConfig, setAlertConfig] = useState<CustomAlertProps>({
    isVisible: false,
    type: "primary" as "primary" | "danger",
    title: "",
    message: "",
    confirmText: "Lanjutkan",
    onConfirm: () => {},
    onCancel: () => {},
  });

  const { control, handleSubmit, createCashier, updateCashier, deleteCashier, isPending, errors, reset, formState } = useCashierForm(!!editingUser, () => {
    setModalVisible(false);
    setEditingUser(null);
    reset();
  });

  const handleEdit = (user: IUser) => {
    setEditingUser(user);
    setModalVisible(true);
    reset({ name: user.name, username: user.username, password: "" });
  };

  const handleDelete = (_id: string, closeSwipe: () => void) => {
    setAlertConfig((prev) => ({
      ...prev,
      isVisible: true,
      type: "danger",
      title: "Hapus Kasir",
      message: "Data kasir ini akan dihapus permanen. Lanjutkan?",
      onConfirm: () => {
        deleteCashier(_id);
        setAlertConfig((p) => ({ ...p, isVisible: false }));
      },
      onCancel: () => {
        setAlertConfig((p) => ({ ...p, isVisible: false }));
        closeSwipe();
      },
    }));
  };

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["cashiers"],
    queryFn: async () => {
      const response = await userService.getCashiers();
      return response.data?.data || [];
    },
  });

  const filteredData = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    return list.filter((item: IUser) => {
      const isCashier = item.role === "kasir";
      if (!debouncedSearch) return isCashier;

      const searchMatch = item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || item.username.toLowerCase().includes(debouncedSearch.toLowerCase());

      return isCashier && searchMatch;
    });
  }, [data, debouncedSearch]);

  const handleRequestClose = () => {
    if (formState.isDirty) {
      setAlertConfig((prev) => ({
        ...prev,
        isVisible: true,
        type: "danger",
        title: "Batalkan?",
        message: "Perubahan akan dihapus. Yakin ingin membatalkan?",
        onConfirm: () => {
          setAlertConfig((p) => ({ ...p, isVisible: false }));
          setModalVisible(false);
          reset();
        },
        onCancel: () => setAlertConfig((p) => ({ ...p, isVisible: false })),
      }));
    } else {
      setModalVisible(false);
      setEditingUser(null);
    }
  };

  const onPreSubmit = (formData: any) => {
    const isEdit = !!editingUser;
    setAlertConfig((prev) => ({
      ...prev,
      isVisible: true,
      type: "primary",
      title: isEdit ? "Update Kasir" : "Simpan Kasir",
      message: isEdit ? "Apakah perubahan data kasir sudah benar?" : "Apakah data kasir baru yang dimasukkan sudah benar?",
      onConfirm: () => {
        setAlertConfig((p) => ({ ...p, isVisible: false }));
        if (isEdit && editingUser?._id) {
          const payload = { ...formData };
          if (!payload.password) delete payload.password;
          updateCashier({ id: editingUser._id, data: payload });
        } else {
          createCashier(formData);
        }
      },
    }));
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <PageHeader title="Manajemen Kasir" />

        <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Cari nama atau username..." />

        <View className="flex-1 px-6">
          {isLoading ? (
            <View className="items-center justify-center flex-1">
              <ActivityIndicator size="large" color="#059669" />
            </View>
          ) : (
            <FlashList
              data={filteredData}
              renderItem={({ item }) => <CashierCard item={item} onEdit={handleEdit} onDelete={handleDelete} />}
              keyExtractor={(item) => item._id || item.username}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
              refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={["#059669"]} />}
              ListEmptyComponent={() => (
                <View className="items-center justify-center py-20 opacity-50">
                  <UserCog size={64} color="#D1D5DB" />
                  <Text className="mt-4 text-gray-400">{debouncedSearch ? "Pencarian tidak ditemukan" : "Belum ada data kasir"}</Text>
                </View>
              )}
            />
          )}
        </View>

        <ActionModal visible={modalVisible} onClose={handleRequestClose} onSubmit={handleSubmit(onPreSubmit)} title={editingUser ? "Edit Data Kasir" : "Buat Kasir Baru"} loading={isPending}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => <FormInput label="Nama Lengkap" placeholder="Masukkan nama kasir" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.name?.message} />}
          />

          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput label="Username" placeholder="Masukkan username login" autoCapitalize="none" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.username?.message} />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => <FormInput label="Password" placeholder="Min. 6 karakter" secureTextEntry onBlur={onBlur} onChangeText={onChange} value={value} error={errors.password?.message} />}
          />
        </ActionModal>

        <CustomAlert isVisible={alertConfig.isVisible} type={alertConfig.type} title={alertConfig.title} message={alertConfig.message} confirmText="Lanjutkan" onConfirm={alertConfig.onConfirm} onCancel={alertConfig.onCancel} />

        <FloatingAddButton
          label="Tambah Kasir Baru"
          onPress={() => {
            setEditingUser(null);
            reset({ name: "", username: "", password: "" });
            setModalVisible(true);
          }}
        />
      </SafeAreaView>
    </View>
  );
};

export default CashierPage;
