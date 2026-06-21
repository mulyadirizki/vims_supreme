import { useState } from "react";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProcessPayment } from "../hooks/use-process-payment";

interface ProcessPaymentDialogProps {
  invoiceReceiptNo: string | null;
  open: boolean;
  onClose: () => void;
}

export function ProcessPaymentDialog({ invoiceReceiptNo, open, onClose }: ProcessPaymentDialogProps) {
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [remark, setRemark] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending } = useProcessPayment();

  const reset = () => {
    setPaymentDate(new Date().toISOString().slice(0, 10));
    setRemark("");
    setFile(null);
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    if (!invoiceReceiptNo) return;
    if (!file) {
      setError("Bukti bayar wajib diupload");
      return;
    }

    setError(null);
    mutate(
      { invoiceReceiptNo, paymentDate, remark: remark || undefined, paymentProof: file },
      {
        onSuccess: () => {
          handleClose();
          toast.success("Pembayaran berhasil diproses", {
            description: `No. Pengajuan: ${invoiceReceiptNo}`,
          });
        },
        onError: (err) => {
          toast.error("Gagal memproses pembayaran", {
            description: err instanceof Error ? err.message : "Terjadi kesalahan",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[14px] font-bold text-gray-800">Proses Pembayaran</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label className="text-[11px] text-gray-500">No. Pengajuan</Label>
            <Input value={invoiceReceiptNo ?? ""} disabled className="h-8 text-[12px] bg-gray-50" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] text-gray-500">Tanggal Bayar</Label>
            <Input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="h-8 text-[12px]"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] text-gray-500">Catatan (opsional)</Label>
            <Textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="text-[12px] resize-none"
              rows={2}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] text-gray-500">Bukti Bayar</Label>
            {file ? (
              <div className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-[12px]">
                <span className="truncate text-gray-700">{file.name}</span>
                <button onClick={() => setFile(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-gray-200 py-4 text-[12px] text-gray-400 hover:border-blue-500 hover:text-blue-600">
                <Upload className="h-3.5 w-3.5" />
                Upload bukti bayar
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    setFile(e.target.files?.[0] ?? null);
                    setError(null);
                  }}
                />
              </label>
            )}
          </div>

          {error && <p className="text-[11px] text-red-500">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-[12px] border-gray-200"
            onClick={handleClose}
            disabled={isPending}
          >
            Batal
          </Button>
          <Button
            size="sm"
            className="h-8 text-[12px] bg-blue-600 hover:bg-blue-700"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending && (
              <div className="mr-2 w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            )}
            Proses
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}