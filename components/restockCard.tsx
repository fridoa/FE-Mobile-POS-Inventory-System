import { RestockFormData, restockSchema } from "@/hooks/useResctock";
import { IProduct } from "@/types/Product";
import { yupResolver } from "@hookform/resolvers/yup";
import { AlertCircle, CheckCircle2, Package, ShoppingCart } from "lucide-react-native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import CustomAlert from "./CustomAlert";

interface RestockCardProps {
  product: IProduct;
  onUpdate: (newStock: number) => Promise<void>;
  isUpdating: boolean;
  orderValue: string;
  onOrderChange: (val: string) => void;
}

export const RestockCard = ({ product, onUpdate, isUpdating, orderValue, onOrderChange }: RestockCardProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RestockFormData>({
    resolver: yupResolver(restockSchema),
    defaultValues: { addedStock: undefined },
  });

  const [showAlert, setShowAlert] = useState(false);
  const [pendingStock, setPendingStock] = useState<number | null>(null);

  const getStockStatus = () => {
    const gap = product.minStock - product.stock;

    if (product.stock <= 0) {
      return {
        label: "KOSONG",
        color: "bg-red-100 text-red-700",
        subText: `Kurang ${gap} pcs`,
        severity: "kritis",
      };
    }
    if (product.stock <= 5) {
      return {
        label: "KRITIS",
        color: "bg-orange-100 text-orange-700",
        subText: `Segera Restock`,
        severity: "sedang",
      };
    }
    return {
      label: "STOK TIPIS",
      color: "bg-amber-100 text-amber-700",
      subText: `${gap} pcs di bawah min.`,
      severity: "rendah",
    };
  };

  const status = getStockStatus();

  const onFinalUpdate = (data: RestockFormData) => {
    const finalStock = product.stock + data.addedStock;
    setPendingStock(finalStock);
    setShowAlert(true);
  };

  const handleConfirm = async () => {
    if (pendingStock !== null) {
      await onUpdate(pendingStock);
      reset();
      setPendingStock(null);
      setShowAlert(false);
    }
  };

  const handleCancel = () => {
    setShowAlert(false);
    setPendingStock(null);
  };

  return (
    <View className="p-4 mb-4 bg-white border border-gray-100 shadow-sm rounded-3xl">
      <View className="flex-row gap-4 mb-4">
        <View className="items-center justify-center w-16 h-16 overflow-hidden border border-gray-100 bg-gray-50 rounded-2xl">
          {product.imageUrl ? <Image source={{ uri: product.imageUrl }} className="w-full h-full" /> : <Package size={24} color="#D1D5DB" />}
        </View>
        <View className="justify-center flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="flex-1 mr-2 text-base font-bold text-gray-800" numberOfLines={1}>
              {product.name}
            </Text>
            <View className={`px-2 py-0.5 rounded-md ${status.color}`}>
              <Text className="text-[9px] font-black uppercase">{status.label}</Text>
            </View>
          </View>

          <View className="flex-row items-center mt-1">
            <Text className={`text-[10px] font-bold ${status.severity === "kritis" ? "text-red-500" : "text-amber-600"}`}>
              STOK: {product.stock} (MIN: {product.minStock})
            </Text>
            <View className="w-1 h-1 mx-2 bg-gray-300 rounded-full" />
            <Text className="text-gray-400 text-[10px] font-medium italic">{status.subText}</Text>
          </View>
        </View>
      </View>

      <View className="p-3 mb-4 border bg-emerald-50/50 border-emerald-100 rounded-2xl">
        <View className="flex-row items-center mb-2">
          <ShoppingCart size={12} color="#059669" />
          <Text className="ml-1 text-[10px] font-bold text-emerald-700 uppercase tracking-tight">Rencana Order (Kirim ke Supplier)</Text>
        </View>
        <TextInput placeholder="Masukkan jumlah pesanan..." keyboardType="numeric" value={orderValue} onChangeText={onOrderChange} className="p-1 text-sm font-bold text-emerald-900" />
      </View>

      {/* SEKSI 2: BARANG DATANG (Input untuk update stok database) */}
      <View className="flex-row items-center gap-2 pt-3 border-t border-gray-50">
        <View className="flex-1">
          <View className={`bg-gray-50 rounded-xl px-3 flex-row items-center h-10 border ${errors.addedStock ? "border-red-500" : "border-gray-100"}`}>
            <AlertCircle size={14} color="#94A3B8" />
            <Controller
              control={control}
              name="addedStock"
              render={({ field: { onChange, value } }) => <TextInput placeholder="Jumlah barang datang..." keyboardType="numeric" onChangeText={onChange} value={value?.toString()} className="flex-1 ml-2 text-xs font-bold text-gray-600" />}
            />
          </View>
        </View>
        <TouchableOpacity onPress={handleSubmit(onFinalUpdate)} disabled={isUpdating} activeOpacity={0.8} className={`items-center justify-center h-10 px-4 rounded-xl ${isUpdating ? "bg-gray-400" : "bg-gray-800"}`}>
          {isUpdating ? <ActivityIndicator size="small" color="white" /> : <CheckCircle2 size={18} color="white" />}
        </TouchableOpacity>
      </View>

      {/* MODAL KONFIRMASI */}
      <CustomAlert
        isVisible={showAlert}
        type="primary"
        title="Konfirmasi Restock"
        message={`Yakin ingin menambah stok ${product.name} menjadi ${pendingStock} pcs?`}
        confirmText="Ya, Update Stok"
        cancelText="Batal"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </View>
  );
};
