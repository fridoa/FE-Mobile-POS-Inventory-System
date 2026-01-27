import transactionService from "@/services/transaction.service";
import { IProduct } from "@/types/Product";
import { useState } from "react";
import Toast from "react-native-toast-message";

interface CartItem extends IProduct {
  qty: number;
}

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addToCart = (product: IProduct) => {
    setCart((prev) => {
      const productId = product._id;
      const existingItem = prev.find((item) => item._id === productId);
      if (existingItem) {
        return prev.map((item) => (item._id === productId ? { ...item, qty: item.qty + 1 } : item));
      } else {
        return [...prev, { ...product, qty: 1 }];
      }
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item._id === productId) {
            return { ...item, qty: Math.max(0, item.qty + delta) };
          }
          return item;
        })
        .filter((item) => item.qty > 0),
    );
  };

  const clearCart = () => setCart([]);

  const checkout = async (payAmount: number) => {
    if (cart.length === 0) return;

    setIsSubmitting(true);
    try {
      const payload = {
        items: cart.map((item) => ({
          productId: item._id as string,
          quantity: item.qty,
        })),
        payAmount: payAmount,
      };

      const response = await transactionService.create(payload);

      if (response.success) {
        Toast.show({ type: "success", text1: "Transaksi Berhasil!", text2: "Stok otomatis terpotong." });
        clearCart();
        return response.data;
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.meta?.message || "Gagal memproses transaksi";
      Toast.show({ type: "error", text1: "Transaksi Gagal", text2: errorMsg });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = cart.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const discount = Number(item.discount) || 0;
    const finalPrice = price - (price * discount) / 100;
    return sum + finalPrice * item.qty;
  }, 0);

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  return {
    cart,
    addToCart,
    updateQty,
    clearCart,
    checkout,
    isSubmitting,
    totalPrice,
    totalQty,
  };
};
