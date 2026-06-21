import { useQuery } from "@tanstack/react-query";
import { getInvoiceOnProcessList } from "../api/invoice-on-process.api";
import type { InvoiceOnProcessFilter } from "../types/invoice.types";

export const useInvoiceOnProcessList = (filter: InvoiceOnProcessFilter) => {
  return useQuery({
    queryKey: ["invoice-on-process", filter],
    queryFn: () => getInvoiceOnProcessList(filter),
  });
};