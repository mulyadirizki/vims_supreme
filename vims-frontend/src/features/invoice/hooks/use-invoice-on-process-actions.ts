import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateInvoiceOnProcess,
  approveInvoiceOnProcess,
  rejectInvoiceOnProcess,
} from "../api/invoice-on-process.api";
import type { InvoiceUpdatePayload, InvoiceRejectPayload } from "../types/invoice.types";

export const useUpdateInvoiceOnProcess = (invoiceReceiptNo: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: InvoiceUpdatePayload) =>
      updateInvoiceOnProcess(invoiceReceiptNo, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice-on-process-detail", invoiceReceiptNo] });
      queryClient.invalidateQueries({ queryKey: ["invoice-on-process"] });
    },
  });
};

export const useApproveInvoiceOnProcess = (invoiceReceiptNo: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => approveInvoiceOnProcess(invoiceReceiptNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice-on-process-detail", invoiceReceiptNo] });
      queryClient.invalidateQueries({ queryKey: ["invoice-on-process"] });
    },
  });
};

export const useRejectInvoiceOnProcess = (invoiceReceiptNo: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: InvoiceRejectPayload) =>
      rejectInvoiceOnProcess(invoiceReceiptNo, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice-on-process-detail", invoiceReceiptNo] });
      queryClient.invalidateQueries({ queryKey: ["invoice-on-process"] });
    },
  });
};