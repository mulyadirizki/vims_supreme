import { http } from "@/shared/api/http";
import type {
  ReadyToInvoiceFilter,
  ReadyToInvoiceListResponse,
} from "../types/invoice.types";

export const getReadyToInvoiceList = async (
  filter: ReadyToInvoiceFilter
): Promise<ReadyToInvoiceListResponse> => {
  const { data } = await http.post<ReadyToInvoiceListResponse>(
    "/invoices/ready-to-invoice/list",
    filter
  );
  return data;
};