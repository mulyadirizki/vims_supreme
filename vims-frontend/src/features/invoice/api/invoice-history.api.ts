import { http } from "@/shared/api/http";
import type { InvoiceHistoryFilter, InvoiceHistoryListResponse } from "../types/invoice.types";

export const getInvoiceHistoryList = async (
  filter: InvoiceHistoryFilter
): Promise<InvoiceHistoryListResponse> => {
  const { data } = await http.post<InvoiceHistoryListResponse>("/invoices/history/list", filter);
  return data;
};