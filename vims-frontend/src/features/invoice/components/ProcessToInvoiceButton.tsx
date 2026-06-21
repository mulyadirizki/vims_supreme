import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProcessToInvoiceButtonProps {
  grNo: string;
  poNo: string;
}

export const ProcessToInvoiceButton = ({ grNo, poNo }: ProcessToInvoiceButtonProps) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate(`/portal/invoice/proses/${grNo}`);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          className="h-7 px-3 text-[11px] bg-blue-600 hover:bg-blue-700 text-white gap-1"
        >
          Proses
          <ArrowRight className="w-3 h-3" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[15px]">
            Proses GR menjadi Invoice?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[12px] text-gray-500 leading-relaxed">
            GR <span className="font-semibold text-gray-700">{grNo}</span> untuk PO{" "}
            <span className="font-semibold text-gray-700">{poNo}</span> akan diproses
            menjadi pengajuan invoice. Anda akan diarahkan ke halaman upload
            kelengkapan dokumen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-8 text-[12px] border-gray-200">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="h-8 text-[12px] bg-blue-600 hover:bg-blue-700 gap-1.5"
          >
            Ya, Proses
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};