import instance from "@/lib/axios/instance";
import { IProduct } from "@/types/Product";
import endpoint from "./endpoint.constant";

type ProductPayload = Omit<IProduct, "_id" | "createdAt" | "updatedAt">;

const productService = {
  getProduct: async (query?: string): Promise<IProduct[]> => {
    const params = query ? { search: query, limit: 50 } : {};

    try {
      const response = await instance.get(endpoint.PRODUCT, { params });

      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },

  getProductBySKU: async (sku: string): Promise<IProduct | null> => {
    try {
      const response = await instance.get(`${endpoint.PRODUCT}/sku/${sku}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching product by SKU:", error);
      return null;
    }
  },

  getProductById: async (id: string): Promise<IProduct | null> => {
    try {
      const response = await instance.get(`${endpoint.PRODUCT}/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      return null;
    }
  },

  createProduct: async (payload: ProductPayload) => {
    const response = await instance.post(endpoint.PRODUCT, payload);

    return response.data.data;
  },

  updateProduct: async (_id: string, payload: Partial<ProductPayload>) => {
    const response = await instance.put(`${endpoint.PRODUCT}/${_id}`, payload);

    return response.data.data;
  },

  deleteProduct: async (_id: string) => {
    const response = await instance.delete(`${endpoint.PRODUCT}/${_id}`);

    return response.data.data;
  },
};

export default productService;
