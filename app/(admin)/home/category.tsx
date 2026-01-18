import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { Layers } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import { ActivityIndicator, RefreshControl, StatusBar, Text, View } from "react-native";

import CategoryCard from "@/components/CategoryCard";
import CustomAlert, { CustomAlertProps } from "@/components/CustomAlert";
import ScreenWrapper from "@/components/ScreenWrapper";
import ActionModal from "@/components/ui/ActionModal";
import FloatingAddButton from "@/components/ui/FloatingAddButton";
import FormInput from "@/components/ui/FormInput";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import { useCategoryForm } from "@/hooks/useCategoryForm";
import { useDebounce } from "@/hooks/useDebounce";
import categoryService from "@/services/category.service";
import { ICategory } from "@/types/Category";

const CategoryPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const [alertConfig, setAlertConfig] = useState<CustomAlertProps>({
    isVisible: false,
    type: "primary",
    title: "",
    message: "",
    confirmText: "Lanjutkan",
    onConfirm: () => {},
    onCancel: () => {},
  });

  const { control, handleSubmit, createCategory, updateCategory, deleteCategory, isPending, errors, reset, formState } = useCategoryForm(!!editingCategory, () => {
    setModalVisible(false);
    setEditingCategory(null);
    reset();
  });

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await categoryService.getCategory();
      return response.data?.data || [];
    },
    staleTime: 1000 * 60 * 30,
  });

  const filteredData = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    if (list.length === 0) return [];

    const sorted = [...list].sort((a, b) => {
      const nameA = (a.name || "").trim();
      const nameB = (b.name || "").trim();

      return nameA.localeCompare(nameB, undefined, {
        sensitivity: "base",
        numeric: true,
      });
    });

    if (!debouncedSearch) return sorted;

    return sorted.filter((cat: ICategory) => cat.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
  }, [data, debouncedSearch]);

  const handleEdit = (category: ICategory) => {
    setEditingCategory(category);
    setModalVisible(true);
    reset({ name: category.name });
  };

  const handleDelete = (id: string, closeSwipe: () => void) => {
    setAlertConfig((prev) => ({
      ...prev,
      isVisible: true,
      type: "danger",
      title: "Hapus Kategori",
      message: "Data kategori ini akan dihapus permanen. Lanjutkan?",
      onConfirm: () => {
        deleteCategory(id);
        setAlertConfig((p) => ({ ...p, isVisible: false }));
      },
      onCancel: () => {
        setAlertConfig((p) => ({ ...p, isVisible: false }));
        closeSwipe();
      },
    }));
  };

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
      setEditingCategory(null);
    }
  };

  const onPreSubmit = (formData: any) => {
    const isEdit = !!editingCategory;
    setAlertConfig((prev) => ({
      ...prev,
      isVisible: true,
      type: "primary",
      title: isEdit ? "Update Kategori" : "Simpan Kategori",
      message: isEdit ? "Apakah perubahan data kategori sudah benar?" : "Apakah data kategori baru yang dimasukkan sudah benar?",
      onConfirm: () => {
        setAlertConfig((p) => ({ ...p, isVisible: false }));
        if (isEdit && editingCategory?._id) {
          const payload = { ...formData };
          if (!payload.password) delete payload.password;
          updateCategory({ id: editingCategory._id, data: payload });
        } else {
          createCategory(formData);
        }
      },
    }));
  };

  return (
    <ScreenWrapper>
      <View className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <PageHeader title="Manajemen Kategori" />
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Cari kategori..." />

        <View className="flex-1 px-6">
          {isLoading ? (
            <View className="items-center justify-center flex-1">
              <ActivityIndicator size="large" color="#3b82f6" />
            </View>
          ) : (
            <FlashList
              data={filteredData}
              renderItem={({ item }) => <CategoryCard item={item} onEdit={handleEdit} onDelete={handleDelete} />}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
              refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={["#3b82f6"]} />}
              ListEmptyComponent={() => (
                <View className="items-center justify-center py-20 opacity-50">
                  <Layers size={64} color="#D1D5DB" />
                  <Text className="mt-4 text-gray-400">{debouncedSearch ? "Pencarian tidak ditemukan" : "Belum ada kategori"}</Text>
                </View>
              )}
            />
          )}
        </View>

        <ActionModal visible={modalVisible} onClose={handleRequestClose} onSubmit={handleSubmit(onPreSubmit)} title={editingCategory ? "Edit Kategori" : "Kategori Baru"} loading={isPending}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => <FormInput label="Nama Kategori" placeholder="Contoh: Makanan, Minuman" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.name?.message} />}
          />
        </ActionModal>

        <CustomAlert {...alertConfig} />

        <FloatingAddButton
          label="Tambah"
          onPress={() => {
            setEditingCategory(null);
            reset({ name: "" });
            setModalVisible(true);
          }}
        />
      </View>
    </ScreenWrapper>
  );
};

export default CategoryPage;
