import type { InvoiceDocumentSlot } from "../types/invoice.types";

export const INVOICE_DOCUMENT_SLOTS: InvoiceDocumentSlot[] = [
  {
    type: "invoice",
    label: "Invoice Asli",
    description: "Dokumen invoice asli dari vendor, format PDF/JPG",
    required: true,
    accept: ".pdf,.jpg,.jpeg,.png",
    maxSizeMb: 5,
  },
  {
    type: "tax_invoice",
    label: "Faktur Pajak",
    description: "Faktur pajak elektronik (e-Faktur)",
    required: true,
    accept: ".pdf,.jpg,.jpeg,.png",
    maxSizeMb: 5,
  },
  {
    type: "delivery_order",
    label: "Surat Jalan / GR",
    description: "Bukti penerimaan barang/jasa",
    required: true,
    accept: ".pdf,.jpg,.jpeg,.png",
    maxSizeMb: 5,
  },
  {
    type: "other",
    label: "Dokumen Pendukung Lainnya",
    description: "Opsional, misal PO/kontrak tambahan",
    required: false,
    accept: ".pdf,.jpg,.jpeg,.png",
    maxSizeMb: 5,
  },
];