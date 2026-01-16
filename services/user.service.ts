import instance from "@/lib/axios/instance";
import { IUser } from "@/types/User";
import endpoint from "./endpoint.constant";

type CreateCashierPayload = Omit<IUser, "_id" | "role" | "isActive" | "createdAt" | "updatedAt">;

type UpdateCashierPayload = Partial<CreateCashierPayload>;

const userService = {
  getCashiers: (params?: string) => instance.get(params ? `${endpoint.USER}?${params}` : endpoint.USER),

  createCashier: (payload: CreateCashierPayload) => instance.post(endpoint.USER, payload),

  updateCashier: (id: string, payload: UpdateCashierPayload) => instance.put(`${endpoint.USER}/${id}`, payload),

  deleteCashier: (id: string) => instance.delete(`${endpoint.USER}/${id}`),
};

export default userService;
