import instance from "@/lib/axios/instance";
import endpoint from "./endpoint.constant";

export interface ITransactionItem {
  productId: string;
  name: string;
  basePrice: number;
  costPrice: number;
  price: number;
  quantity: number;
  subtotal: number;
  discount: number;
}

export interface ICreateTransactionPayload {
  items: {
    productId: string;
    quantity: number;
  }[];
  payAmount: number;
}

export interface ITransactionHistoryItem {
  _id: string;
  transactionNumber: string;
  totalAmount: number;
  totalProfit: number;
  payAmount: number;
  changeAmount: number;
  cashierId: {
    _id: string;
    name: string;
    username: string;
    role: string;
  };
  items: {
    productId: string;
    name: string;
    basePrice: number;
    price: number;
    costPrice: number;
    quantity: number;
    subtotal: number;
    discount: number;
    _id: string;
  }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ITransactionHistoryResponse {
  meta: {
    status: number;
    message: string;
  };
  data: ITransactionHistoryItem[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
  };
}

const transactionService = {
  create: async (payload: ICreateTransactionPayload) => {
    const response = await instance.post(endpoint.TRANSACTION, payload);
    return response.data;
  },

  getAll: async (params?: { page?: number; limit?: number; startDate?: string; endDate?: string; cashierId?: string }) => {
    const response = await instance.get(endpoint.TRANSACTION, { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await instance.get(`${endpoint.TRANSACTION}/${id}`);
    return response.data;
  },
};

export default transactionService;
