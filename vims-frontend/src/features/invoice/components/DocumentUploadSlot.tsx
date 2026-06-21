import { useEffect, useRef, useState } from "react";
import { FileText, Upload, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { InvoiceDocumentSlot, UploadedInvoiceDocument } from "../types/invoice.types";

interface DocumentUploadSlotProps {
  slot: InvoiceDocumentSlot;
  uploaded?: UploadedInvoiceDocument;
  onUpload: (file: File) => void;
  onRemove: () => void;
  error?: string;
}

const formatSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const DocumentUploadSlot = ({
  slot,
  uploaded,
  onUpload,
  onRemove,
  error,
}: DocumentUploadSlotProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isImage = uploaded?.file.type.startsWith("image/");
  const isPdf = uploaded?.file.type === "application/pdf";

  useEffect(() => {
    if (uploaded?.file && isImage) {
      const url = URL.createObjectURL(uploaded.file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [uploaded?.file, isImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    e.target.value = "";
  };

  const handleOpenFile = () => {
    if (!uploaded) return;
    const url = previewUrl ?? URL.createObjectURL(uploaded.file);
    window.open(url, "_blank");
  };

  return (
    <div
      className={`rounded-lg border p-3 transition-colors ${
        error
          ? "border-red-200 bg-red-50/30"
          : uploaded
          ? "border-green-200 bg-green-50/30"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Preview thumbnail */}
        <button
          type="button"
          onClick={uploaded ? handleOpenFile : () => inputRef.current?.click()}
          className="w-14 h-14 rounded-md border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 hover:border-blue-200 transition-colors"
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={uploaded?.file.name}
              className="w-full h-full object-cover"
            />
          ) : isPdf ? (
            <div className="flex flex-col items-center justify-center text-red-400">
              <FileText className="w-5 h-5" />
              <span className="text-[8px] font-bold mt-0.5">PDF</span>
            </div>
          ) : (
            <Upload className="w-4.5 h-4.5 text-gray-300" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-semibold text-gray-800 flex items-center gap-1.5">
            {slot.label}
            {slot.required && (
              <span className="text-[10px] font-medium text-red-500">*</span>
            )}
            {uploaded && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
          </p>
          <p className="text-[10.5px] text-gray-400 mt-0.5">{slot.description}</p>

          {uploaded && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[11px] text-gray-600 truncate max-w-[160px]">
                {uploaded.file.name}
              </span>
              <span className="text-[10px] text-gray-400">
                ({formatSize(uploaded.file.size)})
              </span>
            </div>
          )}

          {error && <p className="text-[10.5px] text-red-500 mt-1">{error}</p>}
        </div>

        <div className="shrink-0">
          <input
            ref={inputRef}
            type="file"
            accept={slot.accept}
            className="hidden"
            onChange={handleFileChange}
          />
          {uploaded ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50"
              onClick={onRemove}
              title="Hapus file"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2.5 text-[11px] border-gray-200 gap-1"
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="w-3 h-3" />
              Upload
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};