import reportService from "@/services/report.service";
import { useQuery } from "@tanstack/react-query";

export const useSalesReport = (filters: { startDate?: string; endDate?: string }) => {
  const summaryQuery = useQuery({
    queryKey: ["sales-reports", "summary", filters],
    queryFn: () => reportService.getSalesSummary(filters),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60 * 4,
  });

  const topProductsQuery = useQuery({
    queryKey: ["sales-reports", "top-products", filters],
    queryFn: () => reportService.getTopProducts({ ...filters, limit: 10 }),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60 * 4,
  });

  return {
    summary: summaryQuery.data?.data,
    topProducts: topProductsQuery.data?.data || [],
    isLoading: summaryQuery.isLoading || topProductsQuery.isLoading,
    isRefetching: summaryQuery.isRefetching || topProductsQuery.isRefetching,
    refetch: () => {
      summaryQuery.refetch();
      topProductsQuery.refetch();
    },
  };
};
