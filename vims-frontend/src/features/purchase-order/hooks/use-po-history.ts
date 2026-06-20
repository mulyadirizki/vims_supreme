import { useQuery } from "@tanstack/react-query";
import { getPOHistory } from "../api/po-history";
import type { POFilter } from "../types/po.types";

export const usePOHistory = (filter: Omit<POFilter, "tab">) => {
  return useQuery({
    queryKey: ["purchase-order", "history", filter],
    queryFn: () => getPOHistory(filter),
  });
};