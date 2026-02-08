import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import mediaService from "@/services/media.service";
import productService from "@/services/product.service";
import { IProduct } from "@/types/Product";
import Toast from "react-native-toast-message";

const productSchema = yup.object().shape({
  name: yup.string().required("Nama produk wajib diisi"),
  category: yup.string().required("Kategori wajib dipilih"),
  basePrice: yup.number().typeError("Harga jual harus angka").required("Wajib diisi").min(0),
  costPrice: yup.number().typeError("Harga modal harus angka").required("Wajib diisi").min(0),
  sku: yup.string().optional().nullable().default(""),
  stock: yup.number().typeError("Stok harus angka").required("Stok wajib diisi").min(0),
  minStock: yup.number().typeError("Min. stok harus angka").required("Batas stok menipis wajib diisi").default(5),
  expiryDate: yup.date().optional().nullable().default(null),
  discount: yup.number().typeError("Diskon harus angka").min(0).max(100).default(0),
});

type ProductFormData = yup.InferType<typeof productSchema>;

export const useProductForm = (initialData?: IProduct) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = !!initialData;

  const [showScanner, setShowScanner] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(initialData?.imageUrl || null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      category: typeof initialData?.category === "object" ? initialData.category._id : initialData?.category || "",
      basePrice: initialData?.basePrice || 0,
      costPrice: initialData?.costPrice || 0,
      sku: initialData?.sku || "",
      stock: initialData?.stock || 0,
      minStock: initialData?.minStock || 5,
      expiryDate: initialData?.expiryDate ? new Date(initialData.expiryDate as any) : null,
      discount: initialData?.discount || 0,
    },
  });

  const mutation = useMutation({
    mutationFn: (payload: any) => {
      if (isEdit && initialData?._id) {
        return productService.updateProduct(initialData._id, payload);
      }
      return productService.createProduct(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      Toast.show({ type: "success", text1: "Berhasil", text2: `Produk diperbarui` });
      router.back();
    },
    onError: (error: any) => {
      console.log("FULL ERROR SERVER:", error.response?.data);
      const serverMessage = error?.response?.data?.message || "Terjadi kesalahan server";
      Toast.show({ type: "error", text1: "Error", text2: serverMessage });
    },
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      const manipResult = await ImageManipulator.manipulateAsync(result.assets[0].uri, [{ resize: { width: 600 } }], {
        compress: 0.6,
        format: ImageManipulator.SaveFormat.JPEG,
      });
      setSelectedImage(manipResult.uri);
    }
  };

  const handleScan = (sku: string) => {
    setValue("sku", sku, { shouldDirty: true, shouldValidate: true });
    setShowScanner(false);
  };

  const onSubmit = async (data: ProductFormData) => {
    let finalImageData = {
      imageUrl: initialData?.imageUrl || "",
      imageFileId: initialData?.imageFileId || "",
    };

    if (selectedImage && selectedImage.startsWith("file://")) {
      setIsUploading(true);
      try {
        const uploadResult = await mediaService.uploadImage(selectedImage);
        finalImageData.imageUrl = uploadResult.url;
        finalImageData.imageFileId = uploadResult.fileId;
      } catch (error) {
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    const payload = {
      ...data,
      ...finalImageData,
      basePrice: Number(data.basePrice),
      costPrice: Number(data.costPrice),
      stock: Number(data.stock),
      minStock: Number(data.minStock),
      discount: Number(data.discount),
      expiryDate: data.expiryDate instanceof Date ? data.expiryDate.toISOString() : null,
    };

    mutation.mutate(payload);
  };

  return {
    control,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    pickImage,
    selectedImage,
    isSubmitting: mutation.isPending || isUploading,
    showScanner,
    setShowScanner,
    handleScan,
    isEdit,
    isDirty,
  };
};
