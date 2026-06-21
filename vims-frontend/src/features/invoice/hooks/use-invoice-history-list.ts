import { useQuery } from "@tanstack/react-query";
import { getInvoiceHistoryList } from "../api/invoice-history.api";
import type { InvoiceHistoryFilter } from "../types/invoice.types";

export const useInvoiceHistoryList = (filter: InvoiceHistoryFilter) => {
  return useQuery({
    queryKey: ["invoice-history", filter],
    queryFn: () => getInvoiceHistoryList(filter),
  });
};