import ScreenWrapper from "@/components/ScreenWrapper";
import PageHeader from "@/components/ui/PageHeader";
import transactionService, { ICreateTransactionPayload } from "@/services/transaction.service";
import { useAuthStore } from "@/stores/auth.store";
import { CartItem, useCartStore } from "@/stores/cart.store";
import formatRupiah from "@/utils/formatRupiah";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { CheckCircle2 } from "lucide-react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

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
    const safeTotal = Math.ceil(totalPrice);
    const raw = [safeTotal, Math.ceil(safeTotal / 5000) * 5000, Math.ceil(safeTotal / 10000) * 10000, Math.ceil(safeTotal / 50000) * 50000, 100000];
    return [...new Set(raw)]
      .filter((amt) => amt >= safeTotal)
      .sort((a, b) => a - b)
      .slice(0, 4);
  }, [totalPrice]);

  const handleProcessPayment = useCallback(async () => {
    if (!isValid) return;

    // Validasi cart sebelum mengirim
    const invalidItems = cart.filter((item) => !item._id);
    if (invalidItems.length > 0) {
      Alert.alert("Error", "Terdapat produk yang tidak valid dalam keranjang. Silakan coba tambahkan ulang produk.");
      return;
    }

    if (cart.length === 0) {
      Alert.alert("Error", "Keranjang kosong. Silakan tambahkan produk terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);

    const payload: ICreateTransactionPayload = {
      items: cart.map((item: CartItem) => ({
        productId: item._id!,
        quantity: item.qty,
      })),
      payAmount: receivedAmount,
    };

    try {
      const response = await transactionService.create(payload);
      const serverTransaction = response.data;

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["sales-summary"] }),
        queryClient.invalidateQueries({ queryKey: ["sales-reports"] }),
        queryClient.invalidateQueries({ queryKey: ["transactions"] }),
        queryClient.invalidateQueries({ queryKey: ["products"] }),
        queryClient.invalidateQueries({ queryKey: ["products", "low-stock"] }),
        queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] }),
      ]);

      setShowSuccessAnim(true);
      animation.current?.play();

      const successData = {
        invoiceNumber: serverTransaction?.transactionNumber || "INV-PROCESSING",
        transaction_date: serverTransaction?.createdAt || new Date().toISOString(),
        total_price: serverTransaction?.totalAmount || totalPrice,
        money_receive: serverTransaction?.payAmount || receivedAmount,
        money_return: serverTransaction?.changeAmount || returnAmount,
        cashier_name: serverTransaction?.cashierId?.name || user?.username || "Kasir",
        items: serverTransaction?.items
          ? serverTransaction.items.map((item: any) => ({
              name: item.name,
              quantity: item.quantity,
              basePrice: item.basePrice || item.price,
              price: item.price,
              discountAmount: item.discount || 0,
              subtotal: item.subtotal,
            }))
          : cart.map((item) => ({
              name: item.name,
              quantity: item.qty,
              basePrice: item.price || 0,
              price: item.price || 0,
              discountAmount: 0,
              subtotal: (item.price ?? 0) * item.qty,
            })),
      };

      setTimeout(() => {
        setShowSuccessAnim(false);
        clearCart();

        router.replace({
          pathname: "/(cashier)/home/pos/success",
          params: { data: JSON.stringify(successData) },
        } as any);
      }, 2000);
    } catch (error: any) {
      console.log("Transaction Error:", JSON.stringify(error?.response?.data, null, 2));

      const status = error?.response?.status;
      const errorMsg = error?.response?.data?.meta?.message || error?.message || "Terjadi kesalahan server";

      if (status === 401) {
        Alert.alert("Sesi Berakhir", "Silakan login ulang dan coba lagi.");
      } else if (status === 400) {
        Alert.alert("Data Tidak Valid", errorMsg);
      } else if (status === 404) {
        Alert.alert("Produk Tidak Ditemukan", "Beberapa produk mungkin sudah tidak tersedia. Silakan refresh keranjang.");
      } else if (error?.code === "ECONNABORTED" || error?.message?.includes("timeout")) {
        Alert.alert("Koneksi Timeout", "Server terlalu lama merespons. Silakan coba lagi.");
      } else if (!error?.response) {
        Alert.alert("Koneksi Bermasalah", "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
      } else {
        Alert.alert("Transaksi Gagal", errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [isValid, cart, receivedAmount, totalPrice, returnAmount, queryClient, clearCart, router]);

  return (
    <ScreenWrapper bg="#F9FAFB">
      {/* HEADER */}
      <PageHeader title="Pembayaran Tunai" />

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
