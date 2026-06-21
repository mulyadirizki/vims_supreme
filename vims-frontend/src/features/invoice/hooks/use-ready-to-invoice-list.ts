import { useQuery } from "@tanstack/react-query";
import { getReadyToInvoiceList } from "../api/ready-to-invoice.api";
import type { ReadyToInvoiceFilter } from "../types/invoice.types";

export const useReadyToInvoiceList = (filter: ReadyToInvoiceFilter) => {
  return useQuery({
    queryKey: ["invoice", "ready-to-invoice", filter],
    queryFn: () => getReadyToInvoiceList(filter),
  });
};