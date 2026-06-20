import { useQuery } from "@tanstack/react-query";
import { getPOOnProcess } from "../api/po-on-process";
import type { POFilter } from "../types/po.types";

export const usePOOnProcess = (filter: Omit<POFilter, "tab">) => {
  return useQuery({
    queryKey: ["purchase-order", "on-process", filter],
    queryFn: () => getPOOnProcess(filter),
  });
};