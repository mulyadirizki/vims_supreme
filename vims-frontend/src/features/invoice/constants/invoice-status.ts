import type { InvoiceStatus } from "../types/invoice.types";

export const INVOICE_STATUS_VARIANT: Record<InvoiceStatus["code"], string> = {
  not_processed: "secondary",
  processed: "default",
};