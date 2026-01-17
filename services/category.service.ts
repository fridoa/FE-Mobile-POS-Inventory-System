import instance from "@/lib/axios/instance";
import { ICategory } from "@/types/Category";
import endpoint from "./endpoint.constant";

type CategoryPayload = Omit<ICategory, "_id" | "createdAt" | "updatedAt">;

const categoryService = {
  getCategory: (params?: string) => instance.get(params ? `${endpoint.CATEGORY}?${params}` : endpoint.CATEGORY),

  createCategory: (payload: CategoryPayload) => instance.post(endpoint.CATEGORY, payload),

  updateCategory: (id: string, payload: Partial<CategoryPayload>) => instance.put(`${endpoint.CATEGORY}/${id}`, payload),

  deleteCategory: (id: string) => instance.delete(`${endpoint.CATEGORY}/${id}`),
};

export default categoryService;
