export const PO_STATUS_MAP: Record<string, { label: string; className: string }> = {
  "11": { label: "On Process", className: "bg-blue-50 text-blue-600 border border-blue-200" },
  "12": { label: "Confirmed",  className: "bg-amber-50 text-amber-600 border border-amber-200" },
  "13": { label: "Cancelled",  className: "bg-red-50 text-red-500 border border-red-200" },
  "14": { label: "Paid",       className: "bg-green-50 text-green-600 border border-green-200" },
};

export function getPoStatusConfig(status: string | null) {
  if (!status) {
    return { label: "New", className: "bg-gray-50 text-gray-400 border border-gray-200" };
  }
  return PO_STATUS_MAP[status] ?? {
    label: `Status ${status}`,
    className: "bg-gray-50 text-gray-500 border border-gray-200",
  };
}