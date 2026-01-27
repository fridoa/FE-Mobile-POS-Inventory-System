import instance from "@/lib/axios/instance";
import endpoint from "./endpoint.constant";

export interface IDailyStat {
  _id: string;
  revenue: number;
  count: number;
}

export interface ISalesSummary {
  totalRevenue: number;
  totalTransactions: number;
  totalCost: number;
  netProfit: number;
  margin: number;
  revenueTrend: number;
  dailyStats: IDailyStat[];
}

export interface ITopProduct {
  _id: string;
  name: string;
  totalQty: number;
  totalRevenue: number;
  margin: number;
  totalCost: number;
}

export interface IReportResponse<T> {
  meta: {
    status: number;
    message: string;
  };
  data: T;
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
  };
}

const reportService = {
  getSalesSummary: async (params?: { startDate?: string; endDate?: string; cashierId?: string }): Promise<IReportResponse<ISalesSummary>> => {
    const response = await instance.get(`${endpoint.REPORT}/sales-summary`, { params });
    return response.data;
  },

  getTopProducts: async (params?: { limit?: number; startDate?: string; endDate?: string; search?: string; sortBy?: string; order?: string; page?: number }): Promise<IReportResponse<ITopProduct[]>> => {
    const response = await instance.get(`${endpoint.REPORT}/top-products`, { params });
    return response.data;
  },
};

export default reportService;
