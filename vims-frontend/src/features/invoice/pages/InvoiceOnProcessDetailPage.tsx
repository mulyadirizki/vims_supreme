import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, Paperclip } from "lucide-react";
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
import { toast } from "sonner";

const SUPPLIER_GROUP_ID = 10;
const APPROVER_GROUP_IDS = [1, 3, 8, 9];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

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

  if (isLoading) return <div className="p-6 text-[12px] text-gray-400">Memuat data...</div>;
  if (isError || !invoice) return <div className="p-6 text-[12px] text-red-400">Invoice tidak ditemukan.</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-[15px] font-bold text-gray-800">{invoice.invoiceReceiptNo}</h1>
          <p className="text-[11px] text-gray-400 mt-0.5">{invoice.status.label}</p>
        </div>
      </div>

      {invoice.status.code === "REJECTED" && invoice.rejectReason && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-[12px] text-red-600">
          Alasan penolakan: {invoice.rejectReason}
        </div>
      )}

      <div className="rounded-lg border border-gray-100 bg-white p-4 grid grid-cols-2 gap-4 text-[12px]">
        <div>
          <p className="text-gray-400">No. GR</p>
          <p className="text-gray-700 font-medium">{invoice.grNo}</p>
        </div>
        <div>
          <p className="text-gray-400">No. PO</p>
          <p className="text-gray-700 font-medium">{invoice.poNo}</p>
        </div>
        <div>
          <p className="text-gray-400">Supplier</p>
          <p className="text-gray-700 font-medium">{invoice.supplier.name}</p>
        </div>
        <div>
          <p className="text-gray-400">Grand Total</p>
          <p className="text-gray-700 font-medium">{formatCurrency(invoice.totals.grandTotal)}</p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-100 bg-white p-4">
        <h2 className="text-[13px] font-semibold text-gray-700 mb-3">Detail Dokumen</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-gray-500">No. Invoice Supplier</label>
            <Input className="h-8 text-[12px]" value={form.no_invoice_supplier} disabled={!isSupplier || !isEditable}
              onChange={(e) => setForm((f) => ({ ...f, no_invoice_supplier: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-gray-500">No. Faktur Pajak</label>
            <Input className="h-8 text-[12px]" value={form.no_faktur_pajak} disabled={!isSupplier || !isEditable}
              onChange={(e) => setForm((f) => ({ ...f, no_faktur_pajak: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-gray-500">Tgl. Faktur Pajak</label>
            <Input type="date" className="h-8 text-[12px]" value={form.tgl_faktur_pajak} disabled={!isSupplier || !isEditable}
              onChange={(e) => setForm((f) => ({ ...f, tgl_faktur_pajak: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-gray-500">No. Surat Jalan</label>
            <Input className="h-8 text-[12px]" value={form.no_surat_jalan} disabled={!isSupplier || !isEditable}
              onChange={(e) => setForm((f) => ({ ...f, no_surat_jalan: e.target.value }))} />
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-[11px] text-gray-500">Catatan</label>
            <Textarea className="text-[12px]" value={form.remark} disabled={!isSupplier || !isEditable}
              onChange={(e) => setForm((f) => ({ ...f, remark: e.target.value }))} />
          </div>
        </div>

        {isSupplier && isEditable && (
          <div className="flex justify-end mt-4">
            <Button className="h-8 px-4 text-[12px] bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        )}
      </div>

      {attachments.length > 0 && (
        <div className="rounded-lg border border-gray-100 bg-white p-4">
          <h2 className="text-[13px] font-semibold text-gray-700 mb-3">Lampiran</h2>
          <div className="flex flex-col gap-2">
            {attachments.map((a) => (
              <a key={a.id} href={a.filePath} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 text-[12px] text-blue-600 hover:underline">
                <Paperclip className="w-3.5 h-3.5" />
                {a.fileName}
              </a>
            ))}
          </div>
        </div>
      )}

      {isApprover && isEditable && (
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" className="h-8 px-4 text-[12px] border-red-200 text-red-600 hover:bg-red-50 gap-1.5"
            onClick={() => setRejectOpen(true)}>
            <XCircle className="w-3.5 h-3.5" /> Tolak
          </Button>
          <Button className="h-8 px-4 text-[12px] bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
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
    </div>
  );
}