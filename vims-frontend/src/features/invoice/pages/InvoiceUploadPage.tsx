import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  FileCheck,
  FileText,
  Package,
  Building2,
  Layers,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DocumentUploadSlot } from "../components/DocumentUploadSlot";
import { INVOICE_DOCUMENT_SLOTS } from "../constants/invoice-document-slots";
import { useGoodsReceiveOverview } from "../hooks/use-invoice-receipt-overview";
import { useSubmitInvoiceDocuments } from "../hooks/use-submit-invoice-documents";
import type {
  InvoiceDocumentType,
  InvoiceUploadFormValues,
  UploadedInvoiceDocument,
} from "../types/invoice.types";
import { toast } from "sonner";

const MAX_SIZE_MB = 5;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

export default function InvoiceUploadPage() {
  const { invoiceReceiptNo = "" } = useParams<{ invoiceReceiptNo: string }>();
  const navigate = useNavigate();

  const { grNo = "" } = useParams<{ grNo: string }>();
  console.log("grNo dari params:", grNo);
  const { data: detail, isLoading: isLoadingDetail } = useGoodsReceiveOverview(grNo);
  const { mutate, isPending } = useSubmitInvoiceDocuments();

  const [form, setForm] = useState<InvoiceUploadFormValues>({
    noInvoiceSupplier: "",
    noFakturPajak: "",
    tglFakturPajak: "",
    noSuratJalan: "",
    remark: "",
  });
  const [uploads, setUploads] = useState<Record<string, UploadedInvoiceDocument>>({});
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});

  const handleFormChange = (key: keyof InvoiceUploadFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpload = (type: InvoiceDocumentType, file: File) => {
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setFileErrors((prev) => ({ ...prev, [type]: `Ukuran file maksimal ${MAX_SIZE_MB} MB` }));
      return;
    }
    setFileErrors((prev) => ({ ...prev, [type]: "" }));
    setUploads((prev) => ({ ...prev, [type]: { type, file } }));
  };

  const handleRemove = (type: InvoiceDocumentType) => {
    setUploads((prev) => {
      const next = { ...prev };
      delete next[type];
      return next;
    });
  };

  const requiredSlots = INVOICE_DOCUMENT_SLOTS.filter((s) => s.required);
  const missingDocuments = requiredSlots.filter((s) => !uploads[s.type]);

  const missingFields = [
    !form.noInvoiceSupplier && "No. Invoice Vendor",
    !form.noFakturPajak && "No. Faktur Pajak",
    !form.tglFakturPajak && "Tanggal Faktur Pajak",
  ].filter(Boolean) as string[];

  const isComplete = missingDocuments.length === 0 && missingFields.length === 0;

    const handleSubmit = () => {
      if (!isComplete) return;

       mutate(
      {
        grNo,
        noInvoiceSupplier: form.noInvoiceSupplier,
        noFakturPajak: form.noFakturPajak,
        tglFakturPajak: form.tglFakturPajak,
        noSuratJalan: form.noSuratJalan || undefined,
        remark: form.remark || undefined,
        documents: Object.values(uploads).map(({ type, file }) => ({ type, file })),
      },
      {
        onSuccess: (response) => {
          toast.success("Pengajuan invoice berhasil dikirim", {
            description: `No. Pengajuan: ${response.data.invoiceReceiptNo}`,
          });
          navigate("/portal/400408");
        },
        onError: (error) => {
          toast.error("Gagal mengirim pengajuan", {
            description: error instanceof Error ? error.message : "Terjadi kesalahan",
          });
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-4 max-w-5xl mx-auto pb-24">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-gray-600"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-[15px] font-bold text-gray-800">
            Upload Kelengkapan Invoice
          </h1>
          <p className="text-[11px] text-gray-400 mt-0.5">
            No. Pengajuan:{" "}
            <span className="font-semibold text-gray-600">{invoiceReceiptNo}</span>
          </p>
        </div>
      </div>

      {/* Ringkasan PO/GR — full width, menonjol */}
      {!isLoadingDetail && detail && (
        <div className="rounded-lg border border-gray-100 bg-white p-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">No. PO</p>
                <p className="text-[12.5px] font-semibold text-gray-700">
                  {detail.poNo ?? "—"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-md bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">No. GR</p>
                <p className="text-[12.5px] font-semibold text-gray-700">
                  {detail.grNo ?? "—"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Supplier</p>
                <p className="text-[12.5px] font-semibold text-gray-700 truncate">
                  {detail.supplier.name ?? "—"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-md bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                  Departemen
                </p>
                <p className="text-[12.5px] font-semibold text-gray-700">
                  {detail.department.desc ?? "—"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 col-span-2 sm:col-span-1">
              <div className="w-8 h-8 rounded-md bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                  Grand Total
                </p>
                <p className="text-[13px] font-bold text-blue-600">
                  {formatCurrency(detail.totals.grandTotal)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoadingDetail && (
        <div className="rounded-lg border border-gray-100 bg-white p-4 flex items-center justify-center gap-2 text-gray-400 text-[12px]">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Memuat detail invoice...
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* KIRI — form data invoice */}
        <div className="rounded-lg border border-gray-100 bg-white p-3.5 flex flex-col gap-4 h-full">
          <div className="rounded-lg border border-blue-100 bg-blue-50/40 px-3.5 py-2.5">
            <p className="text-[11px] text-blue-700 leading-relaxed">
              Lengkapi data invoice dan dokumen yang wajib (
              <span className="font-semibold">bertanda *</span>) sebelum mengirim
              pengajuan.
            </p>
          </div>

          <p className="text-[12px] font-semibold text-gray-700 -mb-1.5">Data Invoice</p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-gray-500 block mb-1">
                No. Invoice Vendor <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.noInvoiceSupplier}
                onChange={(e) => handleFormChange("noInvoiceSupplier", e.target.value)}
                placeholder="cth: INV/2026/001"
                className="h-8 text-[12px] border-gray-200"
              />
            </div>
            <div>
              <label className="text-[11px] text-gray-500 block mb-1">
                No. Surat Jalan
              </label>
              <Input
                value={form.noSuratJalan}
                onChange={(e) => handleFormChange("noSuratJalan", e.target.value)}
                placeholder="cth: SJ/2026/001"
                className="h-8 text-[12px] border-gray-200"
              />
            </div>
            <div>
              <label className="text-[11px] text-gray-500 block mb-1">
                No. Faktur Pajak <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.noFakturPajak}
                onChange={(e) => handleFormChange("noFakturPajak", e.target.value)}
                placeholder="cth: 010.000-26.00000001"
                className="h-8 text-[12px] border-gray-200"
              />
            </div>
            <div>
              <label className="text-[11px] text-gray-500 block mb-1">
                Tanggal Faktur Pajak <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={form.tglFakturPajak}
                onChange={(e) => handleFormChange("tglFakturPajak", e.target.value)}
                className="h-8 text-[12px] border-gray-200"
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <label className="text-[11px] text-gray-500 block mb-1">
              Catatan (opsional)
            </label>
            <Textarea
              placeholder="Tambahkan catatan untuk tim AP jika diperlukan..."
              value={form.remark}
              onChange={(e) => handleFormChange("remark", e.target.value)}
              className="text-[12px] flex-1 min-h-[64px] resize-none border-gray-200"
            />
          </div>
        </div>

        {/* KANAN — daftar upload dokumen */}
        <div className="rounded-lg border border-gray-100 bg-white p-3.5 flex flex-col gap-2.5 h-full">
          <p className="text-[12px] font-semibold text-gray-700">Dokumen Pendukung</p>

          <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto pr-1">
            {INVOICE_DOCUMENT_SLOTS.map((slot) => (
              <DocumentUploadSlot
                key={slot.type}
                slot={slot}
                uploaded={uploads[slot.type]}
                onUpload={(file) => handleUpload(slot.type, file)}
                onRemove={() => handleRemove(slot.type)}
                error={fileErrors[slot.type]}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Submit bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 sm:static sm:border-0 sm:bg-transparent sm:p-0">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <p className="text-[11px] text-gray-400">
            {!isComplete ? (
              <span className="text-red-500 font-medium">
                Lengkapi{" "}
                {[...missingFields, ...missingDocuments.map((s) => s.label)].join(", ")}
              </span>
            ) : (
              "Semua data sudah lengkap"
            )}
          </p>
          <Button
            onClick={handleSubmit}
            disabled={!isComplete || isPending}
            className="h-9 px-4 text-[12px] bg-blue-600 hover:bg-blue-700 gap-1.5 shrink-0"
          >
            {isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileCheck className="w-3.5 h-3.5" />
            )}
            {isPending ? "Mengirim..." : "Kirim Pengajuan"}
          </Button>
        </div>
      </div>
    </div>
  );
}