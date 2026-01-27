import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { ArrowLeft, CheckCircle2 } from "lucide-react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

import ScreenWrapper from "@/components/ScreenWrapper";
import transactionService, { ICreateTransactionPayload } from "@/services/transaction.service";
import { useAuthStore } from "@/stores/auth.store";
import { CartItem, useCartStore } from "@/stores/cart.store";
import formatRupiah from "@/utils/formatRupiah";

export default function PaymentScreen() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useAuthStore();
  const { cart, getTotalPrice, clearCart } = useCartStore();
  const totalPrice = getTotalPrice();
  const animation = useRef<LottieView>(null);

  const [moneyReceived, setMoneyReceived] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);

  const receivedAmount = useMemo(() => parseInt(moneyReceived.replace(/\D/g, "") || "0", 10), [moneyReceived]);

  const returnAmount = receivedAmount - totalPrice;
  const isValid = receivedAmount >= totalPrice;

  const suggestions = useMemo(() => {
    const raw = [totalPrice, Math.ceil(totalPrice / 5000) * 5000, Math.ceil(totalPrice / 10000) * 10000, Math.ceil(totalPrice / 50000) * 50000, 100000];
    return [...new Set(raw)]
      .filter((amt) => amt >= totalPrice)
      .sort((a, b) => a - b)
      .slice(0, 4);
  }, [totalPrice]);

  const handleProcessPayment = useCallback(async () => {
    if (!isValid) return;

    setIsSubmitting(true);

    const payload: ICreateTransactionPayload = {
      items: cart.map((item: CartItem) => ({
        productId: item._id || "",
        quantity: item.qty,
      })),
      payAmount: receivedAmount,
    };

    const transactionDetails = {
      transaction_date: new Date().toISOString(),
      cashier_name: user?.name || user?.username || "Kasir Toko Intan",
      total_price: totalPrice,
      money_receive: receivedAmount,
      money_return: returnAmount,
      items: cart.map((item: CartItem) => {
        const sellingPrice = Number(item.price) || 0;
        const basePrice = Number(item.basePrice) || sellingPrice;

        return {
          name: item.name,
          quantity: item.qty,
          basePrice: basePrice,
          price: sellingPrice,
          discountAmount: basePrice - sellingPrice,
          subtotal: sellingPrice * item.qty,
        };
      }),
    };

    try {
      await transactionService.create(payload);
      queryClient.invalidateQueries({ queryKey: ["sales-summary"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setShowSuccessAnim(true);

      setTimeout(() => {
        setShowSuccessAnim(false);
        clearCart();
        router.replace({
          pathname: "/(cashier)/home/pos/success",
          params: { data: JSON.stringify(transactionDetails) },
        });
      }, 2000);
    } catch (error) {
      Alert.alert("Gagal", "Terjadi kesalahan saat menyimpan transaksi.");
    } finally {
      setIsSubmitting(false);
    }
  }, [isValid, cart, receivedAmount, totalPrice, returnAmount, user, clearCart, router]);

  return (
    <ScreenWrapper bg="#F9FAFB">
      {/* HEADER */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">Pembayaran Tunai</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="items-center py-8">
          <Text className="text-sm font-bold tracking-widest text-gray-400 uppercase">Total Tagihan</Text>
          <Text className="mt-1 text-4xl font-black text-emerald-700">{formatRupiah(totalPrice)}</Text>
        </View>

        {/* INPUT UANG TERIMA */}
        <View className="p-6 bg-white border border-gray-100 shadow-sm rounded-3xl">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-bold text-gray-700">Jumlah Uang Diterima</Text>
            {receivedAmount === totalPrice && receivedAmount > 0 && (
              <View className="px-3 py-1 rounded-full bg-emerald-100">
                <Text className="text-emerald-700 text-[10px] font-bold">UANG PAS</Text>
              </View>
            )}
          </View>

          <View className="flex-row items-center px-4 py-4 border border-gray-200 bg-gray-50 rounded-2xl">
            <Text className="mr-2 text-xl font-bold text-gray-400">Rp</Text>
            <TextInput
              className="flex-1 text-2xl font-black text-gray-800"
              keyboardType="number-pad"
              value={moneyReceived ? formatRupiah(receivedAmount).replace("Rp ", "") : ""}
              onChangeText={(val) => setMoneyReceived(val.replace(/\D/g, ""))}
              placeholder="0"
              autoFocus
              editable={!isSubmitting}
            />
          </View>

          <View className="flex-row items-center justify-between pt-6 mt-6 border-t border-gray-50">
            <Text className="font-medium text-gray-500">Kembalian</Text>
            <Text className={`text-2xl font-black ${returnAmount >= 0 ? "text-orange-500" : "text-gray-200"}`}>{formatRupiah(Math.max(0, returnAmount))}</Text>
          </View>
        </View>

        {/* REKOMENDASI PECAHAN */}
        <Text className="mt-8 mb-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Pecahan Cepat</Text>
        <View className="flex-row flex-wrap justify-between">
          {suggestions.map((amount, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setMoneyReceived(amount.toString())}
              className={`w-[48%] p-4 mb-3 rounded-2xl items-center border ${receivedAmount === amount ? "bg-emerald-600 border-emerald-600" : "bg-white border-gray-100"}`}
            >
              <Text className={`font-bold ${receivedAmount === amount ? "text-white" : "text-gray-700"}`}>{formatRupiah(amount)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* TOMBOL PROSES */}
      <View className="p-6 bg-white border-t border-gray-100">
        <TouchableOpacity
          onPress={handleProcessPayment}
          disabled={!isValid || isSubmitting}
          className={`h-16 rounded-2xl flex-row items-center justify-center shadow-lg ${isValid && !isSubmitting ? "bg-emerald-700 shadow-emerald-200" : "bg-gray-200"}`}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <CheckCircle2 size={22} color="white" />
              <Text className="ml-3 text-lg font-black text-white">Selesaikan Pembayaran</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* MODAL ANIMASI SUKSES */}
      <Modal visible={showSuccessAnim} transparent={false} animationType="fade">
        <View className="items-center justify-center flex-1 p-10 bg-white">
          <LottieView ref={animation} source={require("@/assets/animations/SuccessPayment.json")} autoPlay loop={false} style={{ width: 250, height: 250 }} />
          <Text className="mt-4 text-2xl font-black text-gray-800">Transaksi Berhasil!</Text>
          <Text className="text-gray-400">Mohon tunggu sebentar...</Text>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}
