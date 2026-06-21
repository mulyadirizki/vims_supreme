import { useMutation } from "@tanstack/react-query";
import { submitInvoiceDocuments } from "../api/invoice-receipt.api";

export const useSubmitInvoiceDocuments = () => {
  return useMutation({
    mutationFn: submitInvoiceDocuments,
  });
};