import type { POStatus } from "../types/po.types";

interface Props {
  status: POStatus;
}

export function POStatusBadge({ status }: Props) {
  const baseClass = {
    on_process: "bg-blue-50 text-blue-600 border border-blue-200",
    history: "bg-green-50 text-green-600 border border-green-200",
    unknown: "bg-gray-50 text-gray-500 border border-gray-200",
  }[status.group];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${baseClass}`}>
      {status.label}
    </span>
  );
}