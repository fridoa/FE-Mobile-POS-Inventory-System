import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ArrowLeft, Search, UserCog } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import { ActivityIndicator, RefreshControl, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Internal Imports ---
import CashierCard from "@/components/CashierCard";
import CustomAlert from "@/components/CustomAlert";
import ActionModal from "@/components/ui/ActionModal";
import FloatingAddButton from "@/components/ui/FloatingAddButton";
import FormInput from "@/components/ui/FormInput";
import { useAddCashier } from "@/hooks/useAddCashier";
import { useDebounce } from "@/hooks/useDebounce";
import userService from "@/services/user.service";
import { IUser } from "@/types/User";

const CashierPage = () => {
  const router = useRouter();

  // --- UI States ---
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: "primary" as "primary" | "danger",
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // --- Data & Form Hooks ---
  const { control, handleSubmit, handleAddCashier, isPending, errors, reset, formState } = useAddCashier(() => {
    setModalVisible(false);
  });

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["cashiers"],
    queryFn: async () => {
      const response = await userService.getCashiers();
      return response.data?.data || [];
    },
  });

  // --- Performa: Memoized Filtering ---
  const filteredData = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    return list.filter((item: IUser) => {
      const isCashier = item.role === "kasir";
      if (!debouncedSearch) return isCashier;

      const searchMatch = item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || item.username.toLowerCase().includes(debouncedSearch.toLowerCase());

      return isCashier && searchMatch;
    });
  }, [data, debouncedSearch]);

  // --- Event Handlers ---

  // Proteksi UX: Mencegah data hilang jika modal tertutup tidak sengaja
  const handleRequestClose = () => {
    if (formState.isDirty) {
      setAlertConfig({
        visible: true,
        type: "danger",
        title: "Batalkan?",
        message: "Perubahan akan dihapus. Yakin ingin membatalkan?",
        onConfirm: () => {
          setAlertConfig((prev) => ({ ...prev, visible: false }));
          setModalVisible(false);
          reset();
        },
      });
    } else {
      setModalVisible(false);
    }
  };

  // Trigger alert konfirmasi sebelum eksekusi API
  const onPreSubmit = (formData: any) => {
    setAlertConfig({
      visible: true,
      type: "primary",
      title: "Simpan Kasir",
      message: "Apakah data kasir yang dimasukkan sudah benar?",
      onConfirm: () => {
        setAlertConfig((prev) => ({ ...prev, visible: false }));
        handleAddCashier(formData);
      },
    });
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        {/* Header Section */}
        <View className="flex-row items-center px-6 py-4 bg-white border-b border-gray-100">
          <TouchableOpacity onPress={() => router.back()} className="p-1 mr-4 rounded-full bg-gray-50">
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">Manajemen Kasir</Text>
        </View>

        {/* Search Bar */}
        <View className="px-6 py-4">
          <View className="flex-row items-center px-4 py-3 bg-white border border-gray-200 shadow-sm rounded-xl">
            <Search size={20} color="#9CA3AF" />
            <TextInput className="flex-1 ml-3 text-base text-gray-800" placeholder="Cari nama atau username..." value={searchQuery} onChangeText={setSearchQuery} autoCorrect={false} />
          </View>
        </View>

        {/* List Section (FlashList untuk Performa Tinggi) */}
        <View className="flex-1 px-6">
          {isLoading ? (
            <View className="items-center justify-center flex-1">
              <ActivityIndicator size="large" color="#059669" />
            </View>
          ) : (
            <FlashList
              data={filteredData}
              renderItem={({ item }) => <CashierCard item={item} />}
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

        {/* Modal: Form Tambah Kasir */}
        <ActionModal visible={modalVisible} onClose={handleRequestClose} onSubmit={handleSubmit(onPreSubmit)} title="Buat Kasir Baru" loading={isPending}>
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

        {/* Global Modal Alert (Confirm/Delete) */}
        <CustomAlert
          isVisible={alertConfig.visible}
          type={alertConfig.type}
          title={alertConfig.title}
          message={alertConfig.message}
          confirmText="Lanjutkan"
          onConfirm={alertConfig.onConfirm}
          onCancel={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
        />

        <FloatingAddButton label="Tambah Kasir Baru" onPress={() => setModalVisible(true)} />
      </SafeAreaView>
    </View>
  );
};

export default CashierPage;
