import { http } from "@/shared/api/http";
import type {
  ReadyToPayFilter,
  ReadyToPayListResponse,
  ProcessPaymentPayload,
  ProcessPaymentResponse,
} from "../types/invoice.types";

export const getReadyToPayList = async (
  filter: ReadyToPayFilter
): Promise<ReadyToPayListResponse> => {
  const { data } = await http.post<ReadyToPayListResponse>("/invoices/ready-to-pay/list", filter);
  return data;
};

export const processPayment = async (
  payload: ProcessPaymentPayload
): Promise<ProcessPaymentResponse> => {
  const formData = new FormData();
  formData.append("invoice_receipt_no", payload.invoiceReceiptNo);
  formData.append("payment_date", payload.paymentDate);
  if (payload.remark) formData.append("remark", payload.remark);
  formData.append("payment_proof", payload.paymentProof);

  const { data } = await http.post<ProcessPaymentResponse>(
    "/invoices/ready-to-pay/process",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return data;
};