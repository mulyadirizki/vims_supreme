import { http } from "@/shared/api/http";
import type {
  InvoiceOnProcessFilter,
  InvoiceOnProcessListResponse,
  InvoiceOnProcessDetailResponse,
  InvoiceUpdatePayload,
  InvoiceRejectPayload,
} from "../types/invoice.types";

export const getInvoiceOnProcessList = async (
  filter: InvoiceOnProcessFilter
): Promise<InvoiceOnProcessListResponse> => {
  const { data } = await http.post<InvoiceOnProcessListResponse>(
    "/invoices/on-process/list",
    filter
  );
  return data;
};

export const getInvoiceOnProcessDetail = async (
  invoiceReceiptNo: string
): Promise<InvoiceOnProcessDetailResponse> => {
  const { data } = await http.get<InvoiceOnProcessDetailResponse>(
    `/invoices/on-process/detail/${invoiceReceiptNo}`
  );
  return data;
};

export const updateInvoiceOnProcess = async (
  invoiceReceiptNo: string,
  payload: InvoiceUpdatePayload
): Promise<InvoiceOnProcessDetailResponse> => {
  const { data } = await http.put<InvoiceOnProcessDetailResponse>(
    `/invoices/on-process/update/${invoiceReceiptNo}`,
    payload
  );
  return data;
};

export const approveInvoiceOnProcess = async (
  invoiceReceiptNo: string
): Promise<InvoiceOnProcessDetailResponse> => {
  const { data } = await http.post<InvoiceOnProcessDetailResponse>(
    `/invoices/on-process/approve/${invoiceReceiptNo}`
  );
  return data;
};

export const rejectInvoiceOnProcess = async (
  invoiceReceiptNo: string,
  payload: InvoiceRejectPayload
): Promise<InvoiceOnProcessDetailResponse> => {
  const { data } = await http.post<InvoiceOnProcessDetailResponse>(
    `/invoices/on-process/reject/${invoiceReceiptNo}`,
    payload
  );
  return data;
};