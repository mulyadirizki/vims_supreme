import { http } from "@/shared/api/http";
import type {
  GoodsReceiveDetail,
  GoodsReceiveDetailResponse,
  SubmitInvoiceDocumentsPayload,
  SubmitInvoiceDocumentsResponse,
} from "../types/invoice.types";

export const getGoodsReceiveOverview = async (
  grNo: string
): Promise<GoodsReceiveDetail> => {
  const { data } = await http.get<GoodsReceiveDetailResponse>(
    `/goods-receive/overview/${grNo}`
  );
  return data.data;
};

export const submitInvoiceDocuments = async (
  payload: SubmitInvoiceDocumentsPayload
): Promise<SubmitInvoiceDocumentsResponse> => {
  const formData = new FormData();
  formData.append("gr_no", payload.grNo); // sebelumnya invoice_receipt_no — receipt belum ada di titik ini
  formData.append("invoice_supplier_no", payload.noInvoiceSupplier);
  formData.append("faktur_pajak_no", payload.noFakturPajak);
  formData.append("tgl_faktur_pajak", payload.tglFakturPajak);
  if (payload.noSuratJalan) formData.append("surat_jalan_no", payload.noSuratJalan);
  if (payload.remark) formData.append("remark", payload.remark);

  payload.documents.forEach((doc) => {
    formData.append(`documents[${doc.type}]`, doc.file);
  });

  const { data } = await http.post<SubmitInvoiceDocumentsResponse>(
    "/invoices/ready-to-invoice/submit", // sebelumnya salah path
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return data;
};