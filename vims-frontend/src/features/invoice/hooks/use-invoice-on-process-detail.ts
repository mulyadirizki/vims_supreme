import { useQuery } from "@tanstack/react-query";
import { getInvoiceOnProcessDetail } from "../api/invoice-on-process.api";

export const useInvoiceOnProcessDetail = (invoiceReceiptNo: string) => {
  return useQuery({
    queryKey: ["invoice-on-process-detail", invoiceReceiptNo],
    queryFn: () => getInvoiceOnProcessDetail(invoiceReceiptNo),
    enabled: !!invoiceReceiptNo,
  });
};