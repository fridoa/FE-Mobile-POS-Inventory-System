import CustomAlert from "@/components/CustomAlert";
import { useDeleteProduct } from "@/hooks/useDeleteProduct";
import { useProductForm } from "@/hooks/useProductForm";
import { IProduct } from "@/types/Product";
import { useRouter } from "expo-router";
import { ImageIcon, ScanLine, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { ActivityIndicator, Image, Modal, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import BarcodeScanner from "../BarcodeScanner";
import CategoryPicker from "./CategoryPicker";
import PageHeader from "./PageHeader";

interface ProductFormUIProps {
  initialData?: IProduct;
}

const ProductFormUI = ({ initialData }: ProductFormUIProps) => {
  const router = useRouter();
  const isEdit = !!initialData;

  // State untuk Toggle UI (Bukan bagian dari schema DB)
  const [enableDetails, setEnableDetails] = useState(isEdit);
  const [enableStock, setEnableStock] = useState(isEdit);
  const [alertConfig, setAlertConfig] = useState({ isVisible: false, title: "", message: "", type: "primary" as "primary" | "danger", onConfirm: () => {} });

  const { control, handleSubmit, errors, pickImage, selectedImage, isSubmitting, showScanner, setShowScanner, handleScan, isDirty } = useProductForm(initialData);
  const { deleteProduct, isDeleting } = useDeleteProduct();

  const onBack = () => {
    if (isDirty) {
      setAlertConfig({
        isVisible: true,
        title: "Batalkan?",
        message: "Perubahan belum disimpan. Yakin ingin kembali?",
        type: "danger",
        onConfirm: () => router.back(),
      });
    } else {
      router.back();
    }
  };

  const confirmDelete = () => {
    setAlertConfig({
      isVisible: true,
      title: "Hapus Produk",
      message: `Apakah Anda yakin ingin menghapus ${initialData?.name}?`,
      type: "danger",
      onConfirm: () => deleteProduct(initialData?._id!),
    });
  };

  return (
    <View className="flex-1 bg-gray-50">
      <PageHeader title={isEdit ? "Edit Produk" : "Tambah Produk"} onBack={onBack} />

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Foto Produk */}
        <View className="items-center mb-6">
          <TouchableOpacity onPress={pickImage} className="items-center justify-center w-32 h-32 overflow-hidden bg-white border border-gray-200 border-dashed shadow-sm rounded-3xl">
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} className="w-full h-full" />
            ) : (
              <View className="items-center">
                <ImageIcon size={32} color="#9CA3AF" />
                <Text className="mt-1 text-[10px] text-gray-400 font-medium">Tambah Foto</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="p-4 mb-4 bg-white border border-gray-100 shadow-sm rounded-2xl">
          <Text className="mb-2 text-xs font-semibold text-gray-500">Nama Produk *</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput className={`p-3 rounded-xl bg-gray-50 border ${errors.name ? "border-red-500" : "border-gray-100"}`} placeholder="Masukkan nama produk" onBlur={onBlur} onChangeText={onChange} value={value} />
            )}
          />
          {!!errors.name && <Text className="mt-1 text-xs text-red-500">{errors.name.message as string}</Text>}

          <Text className="mt-4 mb-2 text-xs font-semibold text-gray-500">Kategori *</Text>
          <Controller control={control} name="category" render={({ field: { onChange, value } }) => <CategoryPicker value={value} onChange={onChange} error={errors.category?.message as string} />} />

          <Text className="mt-4 mb-2 text-xs font-semibold text-gray-500">Harga Jual *</Text>
          <View className="flex-row items-center p-1 border border-gray-100 rounded-xl bg-gray-50">
            <View className="px-3 py-2 bg-gray-200 rounded-lg">
              <Text className="font-bold text-gray-600">Rp</Text>
            </View>
            <Controller
              control={control}
              name="price"
              render={({ field: { onChange, value } }) => <TextInput className="flex-1 p-2 font-bold text-gray-800" keyboardType="numeric" onChangeText={onChange} value={value?.toString()} placeholder="0" />}
            />
          </View>
        </View>

        <View className="p-4 mb-4 bg-white border border-gray-100 shadow-sm rounded-2xl">
          <View className="flex-row items-center justify-between">
            <Text className="font-bold text-gray-800">Detail & Barcode</Text>
            <Switch value={enableDetails} onValueChange={setEnableDetails} trackColor={{ false: "#E5E7EB", true: "#059669" }} />
          </View>
          {enableDetails && (
            <View className="mt-4">
              <Text className="mb-2 text-xs font-semibold text-gray-500">Harga Modal (Opsional)</Text>
              <Controller
                control={control}
                name="costPrice"
                render={({ field: { onChange, value } }) => <TextInput className="p-3 mb-4 border border-gray-100 rounded-xl bg-gray-50" keyboardType="numeric" onChangeText={onChange} value={value?.toString()} placeholder="Rp 0" />}
              />
              <Text className="mb-2 text-xs font-semibold text-gray-500">SKU / Barcode *</Text>
              <View className="flex-row items-center border border-gray-100 rounded-xl bg-gray-50">
                <Controller control={control} name="sku" render={({ field: { onChange, value } }) => <TextInput className="flex-1 p-3" placeholder="Scan atau ketik" onChangeText={onChange} value={value} />} />
                <TouchableOpacity onPress={() => setShowScanner(true)} className="p-3">
                  <ScanLine size={22} color="#059669" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View className="p-4 mb-10 bg-white border border-gray-100 shadow-sm rounded-2xl">
          <View className="flex-row items-center justify-between">
            <Text className="font-bold text-gray-800">Manajemen Stok</Text>
            <Switch value={enableStock} onValueChange={setEnableStock} trackColor={{ false: "#E5E7EB", true: "#059669" }} />
          </View>
          {enableStock && (
            <View className="flex-row gap-4 mt-4">
              <View className="flex-1">
                <Text className="mb-2 text-xs font-semibold text-gray-500">Stok Saat Ini</Text>
                <Controller
                  control={control}
                  name="stock"
                  render={({ field: { onChange, value } }) => <TextInput className="p-3 font-bold text-center border border-gray-100 rounded-xl bg-gray-50" keyboardType="numeric" onChangeText={onChange} value={value?.toString()} />}
                />
              </View>
              <View className="flex-1">
                <Text className="mb-2 text-xs font-semibold text-gray-500">Min. Stok</Text>
                <Controller
                  control={control}
                  name="minStock"
                  render={({ field: { onChange, value } }) => <TextInput className="p-3 font-bold text-center border border-gray-100 rounded-xl bg-gray-50" keyboardType="numeric" onChangeText={onChange} value={value?.toString()} />}
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View className="flex-row gap-3 p-4 bg-white border-t border-gray-100">
        {isEdit && (
          <TouchableOpacity onPress={confirmDelete} disabled={isDeleting || isSubmitting} activeOpacity={0.7} className="items-center justify-center px-5 border border-red-100 bg-red-50 rounded-2xl">
            {isDeleting ? <ActivityIndicator size="small" color="#ef4444" /> : <Trash2 size={22} color="#ef4444" />}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitting || isDeleting}
          activeOpacity={0.8}
          className={`flex-1 py-4 rounded-2xl items-center shadow-lg ${isSubmitting || isDeleting ? "bg-gray-300" : "bg-emerald-600 shadow-emerald-200"}`}
        >
          {isSubmitting ? (
            <View className="flex-row items-center justify-center">
              <ActivityIndicator color="white" className="mr-2" />
              <Text className="text-base font-bold text-white">Memproses...</Text>
            </View>
          ) : (
            <Text className="text-base font-bold text-white">{isEdit ? "Simpan Perubahan" : "Tambah Produk"}</Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal visible={showScanner} animationType="slide">
        <BarcodeScanner onScanned={handleScan} onClose={() => setShowScanner(false)} />
      </Modal>

      <CustomAlert {...alertConfig} onCancel={() => setAlertConfig((p) => ({ ...p, isVisible: false }))} confirmText={alertConfig.type === "danger" ? "Ya, Lanjutkan" : "Oke"} />
    </View>
  );
};

export default ProductFormUI;
