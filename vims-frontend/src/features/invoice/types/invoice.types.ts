// ===== Ready to Invoice (list GR siap diinvoice) =====

export interface ReadyToInvoiceFilter {
  gr_no?: string;
  po_no?: string;
  date_from?: string;
  date_to?: string;
  page: number;
  per_page: number;
}

export interface InvoiceStatus {
  code: "not_processed" | "processed";
  label: string;
}

export interface ReadyToInvoiceItem {
  id: string;
  grNo: string;
  poNo: string;
  companyCode: string;
  store: { code: string; name: string | null };
  supplier: { code: string; name: string };
  documentDate: string;
  purchaseOrderDate: string;
  department: { code: string; desc: string };
  totals: { quantity: number; amount: number; vatAmount: number; grandTotal: number };
  invoiceStatus: InvoiceStatus;
  isIntegrated: boolean;
}

export interface ReadyToInvoicePagination {
  page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface ReadyToInvoiceListResponse {
  data: ReadyToInvoiceItem[];
  pagination: ReadyToInvoicePagination;
}

// ===== Goods Receive detail (dipakai di halaman upload, sebelum invoice receipt dibuat) =====

export interface GoodsReceiveDetail {
  grNo: string;
  poNo: string;
  supplier: { code: string; name: string };
  companyCode: string;
  store: { code: string; name: string | null };
  department: { code: string | null; desc: string | null };
  documentDate: string;
  purchaseOrderDate: string;
  totals: { quantity: number; amount: number; vatAmount: number; grandTotal: number };
}

export interface GoodsReceiveDetailResponse {
  status: boolean;
  message: string;
  data: GoodsReceiveDetail;
}

// ===== Upload dokumen invoice =====

export type InvoiceDocumentType = "invoice" | "tax_invoice" | "delivery_order" | "other";

export interface InvoiceDocumentSlot {
  type: InvoiceDocumentType;
  label: string;
  description: string;
  required: boolean;
  accept: string;
  maxSizeMb: number;
}

export interface UploadedInvoiceDocument {
  type: InvoiceDocumentType;
  file: File;
}

export interface InvoiceUploadFormValues {
  noInvoiceSupplier: string;
  noFakturPajak: string;
  tglFakturPajak: string;
  noSuratJalan: string;
  remark: string;
}

export interface SubmitInvoiceDocumentsPayload {
  grNo: string; // sebelumnya invoiceReceiptNo — belum ada receipt di titik submit
  noInvoiceSupplier: string;
  noFakturPajak: string;
  tglFakturPajak: string;
  noSuratJalan?: string;
  remark?: string;
  documents: { type: InvoiceDocumentType; file: File }[];
}

export interface SubmitInvoiceDocumentsResponse {
  data: {
    invoiceReceiptNo: string;
    statusInvr: string;
  };
}

// ===== Invoice Receipt detail (setelah submit, untuk halaman riwayat/detail) =====

export interface InvoiceReceiptDetail {
  invoiceReceiptNo: string;
  purchaseOrderNo: string | null;
  goodsReceiveNo: string | null;
  supplierCode: string | null;
  supplierName: string | null;
  department: string | null;
  documentDate: string | null;
  totalQuantity: number;
  totalAmount: number;
  vatAmount: number;
  grandTotal: number;
  statusInvr: string;
  noInvoiceSupplier: string | null;
  noFakturPajak: string | null;
  tglFakturPajak: string | null;
  noSuratJalan: string | null;
  remark: string | null;
}

export interface InvoiceReceiptDetailResponse {
  data: InvoiceReceiptDetail;
}

export interface InvoiceOnProcessFilter {
  gr_no?: string;
  po_no?: string;
  invoice_receipt_no?: string;
  page: number;
  per_page: number;
}

export interface InvoiceStatusInfo {
  code: string;
  label: string;
}

export interface InvoiceOnProcessItem {
  invoiceReceiptNo: string;
  grNo: string;
  poNo: string;
  supplier: { code: string; name: string };
  department: string | null;
  noInvoiceSupplier: string | null;
  noFakturPajak: string | null;
  tglFakturPajak: string | null;
  totals: { quantity: number; amount: number; vatAmount: number; grandTotal: number };
  status: InvoiceStatusInfo; // ← diganti dari `string | null`
  confirmDate: string | null;
}

export interface InvoiceOnProcessPagination {
  page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface InvoiceOnProcessListResponse {
  status: boolean;
  data: InvoiceOnProcessItem[];
  pagination: InvoiceOnProcessPagination;
}

export interface InvoiceOnProcessDetail extends InvoiceOnProcessItem {
  noSuratJalan: string | null;
  remark: string | null;
  rejectReason: string | null;
  rejectDate: string | null;
  userConfirm: string | null;
}

export interface InvoiceReceiptAttachment {
  id: number;
  documentType: string;
  fileName: string;
  filePath: string;
  fileSize: number | null;
  mimeType: string | null;
  uploadedBy: string | null;
  uploadedAt: string | null;
}

export interface InvoiceOnProcessDetailResponse {
  status: boolean;
  data: {
    invoice: InvoiceOnProcessDetail;
    attachments: InvoiceReceiptAttachment[];
  };
}

export interface InvoiceUpdatePayload {
  no_invoice_supplier?: string;
  no_faktur_pajak?: string;
  tgl_faktur_pajak?: string;
  no_surat_jalan?: string;
  remark?: string;
}

export interface InvoiceRejectPayload {
  reject_reason: string;
}

export interface ReadyToPayFilter {
  gr_no?: string;
  po_no?: string;
  invoice_receipt_no?: string;
  page: number;
  per_page: number;
}

export interface ReadyToPayItem extends InvoiceOnProcessItem {
  paymentDate: string | null;
}

export interface ReadyToPayListResponse {
  status: boolean;
  data: ReadyToPayItem[];
  pagination: InvoiceOnProcessPagination;
}

export interface ProcessPaymentPayload {
  invoiceReceiptNo: string;
  paymentDate: string; // yyyy-mm-dd
  remark?: string;
  paymentProof: File;
}

export interface ProcessPaymentResponse {
  status: boolean;
  message: string;
  data: {
    invoiceReceiptNo: string;
  };
}

export interface InvoiceHistoryFilter {
  gr_no?: string;
  po_no?: string;
  invoice_receipt_no?: string;
  status?: "APPROVED" | "PAID";
  page: number;
  per_page: number;
}

export interface InvoiceHistoryItem extends InvoiceOnProcessItem {
  paymentDate: string | null;
}

export interface InvoiceHistoryListResponse {
  status: boolean;
  data: InvoiceHistoryItem[];
  pagination: InvoiceOnProcessPagination;
}