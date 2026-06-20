export interface POFilter {
  po_no?: string;
  supplier?: string;
  status_po?: string;
  tab?: "on_process" | "history";
  date_from?: string;
  date_to?: string;
  page: number;
  per_page: number;
}

export interface POStatus {
  code: string | null;
  label: string;
  group: "on_process" | "history" | "unknown";
}

export interface POListItem {
  id: string;
  poNo: string;
  companyCode: string;
  store: { code: string; name: string | null };
  supplier: { code: string; name: string };
  documentDate: string;
  deliveryDate: string;
  expiredDate: string;
  department: { code: string; desc: string };
  orderType: string;
  totals: { quantity: number; amount: number; vatAmount: number; grandTotal: number };
  status: POStatus;
  isIntegrated: boolean;
  confirmDate: string | null;
  cancelInfo: { cancelledAt: string; cancelledBy: string } | null;
  isOverdue: boolean;
}

export interface POPagination {
  page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface POListResponse {
  data: POListItem[];
  pagination: POPagination;
}

export interface POItem {
  id: string;
  lineItem: string;
  productCode: string;
  barcode: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  taxPct: number;
  vatAmount: number;
  amountAfterTax: number;
  discount: { amount: number; pct: number };
  department: { code: string; desc: string };
  store: { code: string; desc: string };
  deliveryDate: string;
  expiredDate: string;
}

export interface PODetail extends POListItem {
  headerText: string;
  reqCancel: { requestedAt: string; confirmedAt: string } | null;
  items: POItem[];
}