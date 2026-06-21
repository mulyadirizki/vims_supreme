import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  FileText,
  Eye,
  Download,
  Hash,
  Building2,
  Wallet,
  CalendarClock,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/features/auth/store/auth.store"; // sesuaikan path
import { useInvoiceOnProcessDetail } from "../hooks/use-invoice-on-process-detail";
import {
  useUpdateInvoiceOnProcess,
  useApproveInvoiceOnProcess,
  useRejectInvoiceOnProcess,
} from "../hooks/use-invoice-on-process-actions";
import { InvoiceStatusBadge } from "../components/InvoiceStatusBadge"; // sesuaikan path
import type { InvoiceReceiptAttachment } from "../types/invoice.types";
import { toast } from "sonner";

const SUPPLIER_GROUP_ID = 10;
const APPROVER_GROUP_IDS = [1, 3, 8, 9];

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  invoice: "Invoice Asli",
  tax_invoice: "Faktur Pajak",
  delivery_order: "Surat Jalan / GR",
  other: "Dokumen Pendukung",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

const formatDate = (value: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
};

const formatFileSize = (bytes: number | null) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const isImage = (mime: string | null) => !!mime && mime.startsWith("image/");
const isPdf = (mime: string | null) => mime === "application/pdf";

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5 min-w-0">
      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-blue-500" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-[12.5px] text-gray-700 font-semibold truncate">{value}</p>
      </div>
    </div>
  );
}

export default function InvoiceOnProcessDetailPage() {
  const { invoiceReceiptNo = "" } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const { data, isLoading, isError } = useInvoiceOnProcessDetail(invoiceReceiptNo);
  const updateMutation = useUpdateInvoiceOnProcess(invoiceReceiptNo);
  const approveMutation = useApproveInvoiceOnProcess(invoiceReceiptNo);
  const rejectMutation = useRejectInvoiceOnProcess(invoiceReceiptNo);

  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [previewAttachment, setPreviewAttachment] = useState<InvoiceReceiptAttachment | null>(null);
  const [form, setForm] = useState({
    no_invoice_supplier: "",
    no_faktur_pajak: "",
    tgl_faktur_pajak: "",
    no_surat_jalan: "",
    remark: "",
  });

  const invoice = data?.data.invoice;
  const attachments = data?.data.attachments ?? [];

  useEffect(() => {
    if (!invoice) return;
    setForm({
      no_invoice_supplier: invoice.noInvoiceSupplier ?? "",
      no_faktur_pajak: invoice.noFakturPajak ?? "",
      tgl_faktur_pajak: invoice.tglFakturPajak ?? "",
      no_surat_jalan: invoice.noSuratJalan ?? "",
      remark: invoice.remark ?? "",
    });
  }, [invoice]);

  const isSupplier = user?.group_id === SUPPLIER_GROUP_ID;
  const isApprover = !!user?.group_id && APPROVER_GROUP_IDS.includes(user.group_id);
  const isEditable = invoice?.status.code === "ON_PROCESS";

  const handleSave = () => {
    updateMutation.mutate(form, {
      onSuccess: () => {
        toast.success("Perubahan berhasil disimpan", {
          description: `No. Pengajuan: ${invoice?.invoiceReceiptNo}`,
        });
      },
      onError: (error) => {
        toast.error("Gagal menyimpan perubahan", {
          description: error instanceof Error ? error.message : "Terjadi kesalahan",
        });
      },
    });
  };

  const handleApprove = () => {
    if (!window.confirm("Setujui invoice ini?")) return;

    approveMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Invoice berhasil disetujui", {
          description: `No. Pengajuan: ${invoice?.invoiceReceiptNo}`,
        });
      },
      onError: (error) => {
        toast.error("Gagal menyetujui invoice", {
          description: error instanceof Error ? error.message : "Terjadi kesalahan",
        });
      },
    });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;

    rejectMutation.mutate(
      { reject_reason: rejectReason },
      {
        onSuccess: () => {
          setRejectOpen(false);
          toast.success("Invoice berhasil ditolak", {
            description: `No. Pengajuan: ${invoice?.invoiceReceiptNo}`,
          });
        },
        onError: (error) => {
          toast.error("Gagal menolak invoice", {
            description: error instanceof Error ? error.message : "Terjadi kesalahan",
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 gap-2 text-gray-400 text-[12px]">
        <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        Memuat data...
      </div>
    );
  }

  if (isError || !invoice) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-2 text-gray-400">
        <Inbox className="w-8 h-8 text-gray-300" />
        <p className="text-[12px]">Invoice tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="h-9 w-9 border-gray-200 shrink-0" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-[16px] font-bold text-gray-800">{invoice.invoiceReceiptNo}</h1>
            <InvoiceStatusBadge status={invoice.status} />
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {invoice.confirmDate ? `Dikonfirmasi ${formatDate(invoice.confirmDate)}` : "Menunggu konfirmasi"}
          </p>
        </div>
      </div>

      {invoice.status.code === "REJECTED" && invoice.rejectReason && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
          <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-[12px] font-semibold text-red-700">Invoice ditolak</p>
            <p className="text-[11.5px] text-red-600 mt-0.5">{invoice.rejectReason}</p>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-100 bg-white p-5 grid grid-cols-2 sm:grid-cols-4 gap-5">
        <InfoItem icon={Hash} label="No. GR" value={invoice.grNo} />
        <InfoItem icon={Hash} label="No. PO" value={invoice.poNo} />
        <InfoItem icon={Building2} label="Supplier" value={invoice.supplier.name} />
        <InfoItem icon={Wallet} label="Grand Total" value={formatCurrency(invoice.totals.grandTotal)} />
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[13px] font-semibold text-gray-700">Detail Dokumen</h2>
          {isSupplier && isEditable && (
            <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Mode Edit
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-gray-500 font-medium">No. Invoice Supplier</label>
            <Input className="h-9 text-[12px]" value={form.no_invoice_supplier} disabled={!isSupplier || !isEditable}
              onChange={(e) => setForm((f) => ({ ...f, no_invoice_supplier: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-gray-500 font-medium">No. Faktur Pajak</label>
            <Input className="h-9 text-[12px]" value={form.no_faktur_pajak} disabled={!isSupplier || !isEditable}
              onChange={(e) => setForm((f) => ({ ...f, no_faktur_pajak: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-gray-500 font-medium">Tgl. Faktur Pajak</label>
            <Input type="date" className="h-9 text-[12px]" value={form.tgl_faktur_pajak} disabled={!isSupplier || !isEditable}
              onChange={(e) => setForm((f) => ({ ...f, tgl_faktur_pajak: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-gray-500 font-medium">No. Surat Jalan</label>
            <Input className="h-9 text-[12px]" value={form.no_surat_jalan} disabled={!isSupplier || !isEditable}
              onChange={(e) => setForm((f) => ({ ...f, no_surat_jalan: e.target.value }))} />
          </div>
          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label className="text-[11px] text-gray-500 font-medium">Catatan</label>
            <Textarea className="text-[12px] min-h-[72px]" value={form.remark} disabled={!isSupplier || !isEditable}
              onChange={(e) => setForm((f) => ({ ...f, remark: e.target.value }))} />
          </div>
        </div>

        {isSupplier && isEditable && (
          <div className="flex justify-end mt-4 pt-4 border-t border-gray-50">
            <Button className="h-9 px-4 text-[12px] bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-5">
        <h2 className="text-[13px] font-semibold text-gray-700 mb-4">
          Lampiran <span className="text-gray-400 font-normal">({attachments.length})</span>
        </h2>

        {attachments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-300">
            <Inbox className="w-8 h-8" />
            <p className="text-[11.5px] text-gray-400">Belum ada dokumen yang diunggah</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {attachments.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setPreviewAttachment(a)}
                className="group relative flex flex-col rounded-xl border border-gray-100 overflow-hidden hover:border-blue-200 hover:shadow-sm transition-all text-left"
              >
                <div className="aspect-[4/3] w-full bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100">
                  {isImage(a.mimeType) ? (
                    <img
                      src={a.filePath}
                      alt={a.fileName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : isPdf(a.mimeType) ? (
                    <div className="flex flex-col items-center gap-1">
                      <FileText className="w-8 h-8 text-red-400" strokeWidth={1.5} />
                      <span className="text-[8px] font-bold text-red-500 tracking-widest">PDF</span>
                    </div>
                  ) : (
                    <FileText className="w-8 h-8 text-gray-300" />
                  )}
                </div>
                <div className="p-2.5">
                  <p className="text-[9.5px] font-semibold text-blue-600 uppercase tracking-wide">
                    {DOCUMENT_TYPE_LABELS[a.documentType] ?? a.documentType}
                  </p>
                  <p className="text-[11px] text-gray-700 truncate mt-0.5">{a.fileName}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{formatFileSize(a.fileSize)}</p>
                </div>
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                  <Eye className="w-3.5 h-3.5 text-gray-600" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {isApprover && isEditable && (
        <div className="flex items-center justify-end gap-2 sticky bottom-4 bg-white/80 backdrop-blur rounded-xl border border-gray-100 p-3 shadow-sm">
          <Button variant="outline" className="h-9 px-4 text-[12px] border-red-200 text-red-600 hover:bg-red-50 gap-1.5"
            onClick={() => setRejectOpen(true)}>
            <XCircle className="w-3.5 h-3.5" /> Tolak
          </Button>
          <Button className="h-9 px-4 text-[12px] bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
            onClick={handleApprove} disabled={approveMutation.isPending}>
            <CheckCircle2 className="w-3.5 h-3.5" /> {approveMutation.isPending ? "Memproses..." : "Setujui"}
          </Button>
        </div>
      )}

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[14px]">Tolak Invoice</DialogTitle>
          </DialogHeader>
          <Textarea placeholder="Alasan penolakan..." className="text-[12px]" value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" className="h-8 text-[12px]" onClick={() => setRejectOpen(false)}>Batal</Button>
            <Button className="h-8 text-[12px] bg-red-600 hover:bg-red-700 text-white"
              onClick={handleReject} disabled={!rejectReason.trim() || rejectMutation.isPending}>
              {rejectMutation.isPending ? "Memproses..." : "Tolak Invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewAttachment} onOpenChange={(open) => !open && setPreviewAttachment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[14px] truncate pr-6">{previewAttachment?.fileName}</DialogTitle>
          </DialogHeader>
          <div className="rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center min-h-[300px]">
            {previewAttachment && isImage(previewAttachment.mimeType) && (
              <img src={previewAttachment.filePath} alt={previewAttachment.fileName} className="max-h-[60vh] w-full object-contain" />
            )}
            {previewAttachment && isPdf(previewAttachment.mimeType) && (
              <iframe src={previewAttachment.filePath} title={previewAttachment.fileName} className="w-full h-[60vh]" />
            )}
            {previewAttachment && !isImage(previewAttachment.mimeType) && !isPdf(previewAttachment.mimeType) && (
              <div className="py-12 flex flex-col items-center gap-2 text-gray-400">
                <FileText className="w-10 h-10" />
                <p className="text-[12px]">Preview tidak tersedia untuk tipe file ini</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <a href={previewAttachment?.filePath} target="_blank" rel="noreferrer">
              <Button variant="outline" className="h-8 text-[12px] gap-1.5">
                <Download className="w-3.5 h-3.5" /> Buka di Tab Baru
              </Button>
            </a>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}