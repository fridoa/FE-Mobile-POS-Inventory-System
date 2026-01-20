import { RestockFormData, restockSchema } from "@/hooks/useResctock";
import { IProduct } from "@/types/Product";
import { yupResolver } from "@hookform/resolvers/yup";
import { CheckCircle2, Package, ShoppingCart } from "lucide-react-native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import CustomAlert from "./CustomAlert"; // <-- import CustomAlert

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
          <Text className="text-base font-bold text-gray-800" numberOfLines={1}>
            {product.name}
          </Text>
          <Text className="text-red-500 text-[10px] font-bold">
            STOK: {product.stock} (MIN: {product.minStock})
          </Text>
        </View>
      </View>

      <View className="p-3 mb-4 border bg-emerald-50/50 border-emerald-100 rounded-2xl">
        <View className="flex-row items-center mb-2">
          <ShoppingCart size={12} color="#059669" />
          <Text className="ml-1 text-[10px] font-bold text-emerald-700 uppercase">Rencana Order (WA)</Text>
        </View>
        <TextInput placeholder="Ketik jumlah pesanan..." keyboardType="numeric" value={orderValue} onChangeText={onOrderChange} className="p-1 text-sm font-bold text-emerald-900" />
      </View>

      <View className="flex-row items-center gap-2 pt-3 border-t border-gray-50">
        <View className="flex-1">
          <View className={`bg-gray-50 rounded-xl px-3 flex-row items-center h-10 border ${errors.addedStock ? "border-red-500" : "border-gray-100"}`}>
            <Controller
              control={control}
              name="addedStock"
              render={({ field: { onChange, value } }) => <TextInput placeholder="Barang datang..." keyboardType="numeric" onChangeText={onChange} value={value?.toString()} className="flex-1 text-xs font-bold text-gray-600" />}
            />
          </View>
        </View>
        <TouchableOpacity onPress={handleSubmit(onFinalUpdate)} disabled={isUpdating} className="items-center justify-center h-10 px-4 bg-gray-800 rounded-xl">
          {isUpdating ? <ActivityIndicator size="small" color="white" /> : <CheckCircle2 size={18} color="white" />}
        </TouchableOpacity>
      </View>

      <CustomAlert
        isVisible={showAlert}
        type="primary"
        title="Konfirmasi Restock"
        message={`Yakin ingin menambah stok menjadi ${pendingStock} pcs?`}
        confirmText="Ya, Lanjutkan"
        cancelText="Batal"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </View>
  );
};
