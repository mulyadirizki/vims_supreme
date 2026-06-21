import type { InvoiceStatus } from "../types/invoice.types";
import { INVOICE_STATUS_VARIANT } from "../constants/invoice-status";

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
}

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  default: "bg-blue-50 text-blue-600",
  secondary: "bg-gray-100 text-gray-600",
  destructive: "bg-red-50 text-red-600",
  outline: "bg-amber-50 text-amber-600",
};

const DOT_STYLES: Record<BadgeVariant, string> = {
  default: "bg-blue-500",
  secondary: "bg-gray-400",
  destructive: "bg-red-500",
  outline: "bg-amber-500",
};

export const InvoiceStatusBadge = ({ status }: InvoiceStatusBadgeProps) => {
  const variant = (INVOICE_STATUS_VARIANT[status.code] ?? "secondary") as BadgeVariant;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap ${VARIANT_STYLES[variant]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${DOT_STYLES[variant]}`} />
      {status.label}
    </span>
  );
};