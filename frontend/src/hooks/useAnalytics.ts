import { useQuery } from "@tanstack/react-query";
import { fetchAnalytics } from "../api/analytics.api";

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: fetchAnalytics,
    refetchInterval: 15000,
  });
}
