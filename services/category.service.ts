import instance from "@/lib/axios/instance";
import { ICategory } from "@/types/Category";
import endpoint from "./endpoint.constant";

type CategoryPayload = Omit<ICategory, "_id" | "createdAt" | "updatedAt">;

const categoryService = {
  getCategory: (params?: string) => {
    const query = params ? `search=${params}&limit=100` : "limit=100";
    return instance.get(`${endpoint.CATEGORY}?${query}`);
  },

  createCategory: (payload: CategoryPayload) => instance.post(endpoint.CATEGORY, payload),

  updateCategory: (id: string, payload: Partial<CategoryPayload>) => instance.put(`${endpoint.CATEGORY}/${id}`, payload),

  deleteCategory: (id: string) => instance.delete(`${endpoint.CATEGORY}/${id}`),
};

export default categoryService;
