import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { usePOOnProcess } from "../hooks/use-po-on-process";
import { POStatusBadge } from "../components/POStatusBadge";
import type { POFilter } from "../types/po.types";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", minimumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const STATUS_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "11", label: "On Process" },
  { value: "12", label: "Confirmed" },
];

const PER_PAGE_OPTIONS = [10, 25, 50];
const TABLE_HEADS = ["PO No", "Store", "Department", "Supplier", "Doc Date", "Est. Delivery", "Amount", "Vat", "Total", "Status", "Action"];

export default function POOnProcessPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusPo, setStatusPo] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const filter: Omit<POFilter, "tab"> = {
    po_no: search || undefined,
    supplier: search || undefined,
    status_po: statusPo === "all" ? undefined : statusPo,
    page,
    per_page: perPage,
  };

  const { data, isLoading, isError } = usePOOnProcess(filter);

  const list = data?.data ?? [];
  const pagination = data?.pagination;
  const total = pagination?.total ?? 0;
  const totalPages = pagination?.last_page ?? 1;
  const fromRow = total === 0 ? 0 : (page - 1) * perPage + 1;
  const toRow = Math.min(page * perPage, total);

  const handleSearch = () => { setSearch(searchInput); setPage(1); };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };
  const handleStatusChange = (val: string) => { setStatusPo(val); setPage(1); };
  const handlePerPageChange = (val: string) => { setPerPage(Number(val)); setPage(1); };
  const handleViewDetail = (poNo: string) => navigate(`/portal/400401/${poNo}`);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div>
        <h1 className="text-[15px] font-bold text-gray-800">PO On Process</h1>
        <p className="text-[11px] text-gray-400 mt-0.5">Daftar purchase order yang sedang diproses</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
          <Input
            placeholder="Cari PO No / Supplier..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-8 h-8 w-56 text-[12px] bg-white border-gray-200 placeholder:text-gray-300"
          />
        </div>

        <Button onClick={handleSearch} className="h-8 px-3 text-[12px] bg-blue-600 hover:bg-blue-700 text-white">
          Cari
        </Button>

        <Select value={statusPo} onValueChange={handleStatusChange}>
          <SelectTrigger className="h-8 w-36 text-[12px] border-gray-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value} className="text-[12px]">{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-[11px] text-gray-400 ml-auto">{total} data</span>
      </div>

      <div className="rounded-lg border border-gray-100 bg-white flex flex-col overflow-hidden" style={{ minHeight: 0 }}>
        <div className="overflow-auto flex-1">
          <Table className="min-w-[900px] w-full">
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50 sticky top-0 z-10">
                {TABLE_HEADS.map((h) => (
                  <TableHead key={h} className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap py-2.5 bg-gray-50">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-16">
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-[12px]">
                      <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                      Memuat data...
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {isError && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-16 text-red-400 text-[12px]">
                    Gagal memuat data. Silakan refresh halaman.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !isError && list.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-16 text-gray-400 text-[12px]">
                    Tidak ada data ditemukan.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !isError && list.map((po) => (
                <TableRow
                  key={po.id}
                  className="hover:bg-blue-50/30 transition-colors border-b border-gray-50 cursor-pointer"
                  onClick={() => handleViewDetail(po.poNo)}
                >
                  <TableCell className="text-[11px] font-semibold text-blue-600 whitespace-nowrap py-2.5">
                    {po.poNo}
                  </TableCell>
                  <TableCell className="text-[11px] text-gray-600 whitespace-nowrap py-2.5">
                    {po.store.code}
                  </TableCell>
                  <TableCell className="py-2.5 whitespace-nowrap">
                    <p className="text-[11px] text-gray-700 font-medium">{po.department.code}</p>
                    <p className="text-[10px] text-gray-400">{po.department.desc}</p>
                  </TableCell>
                  <TableCell className="py-2.5 whitespace-nowrap max-w-[180px]">
                    <p className="text-[11px] text-gray-700 truncate">{po.supplier.name}</p>
                    <p className="text-[10px] text-gray-400">{po.supplier.code}</p>
                  </TableCell>
                  <TableCell className="text-[11px] text-gray-500 whitespace-nowrap py-2.5">
                    {formatDate(po.documentDate)}
                  </TableCell>
                  <TableCell className="text-[11px] text-gray-500 whitespace-nowrap py-2.5">
                    {formatDate(po.deliveryDate)}
                  </TableCell>
                  <TableCell className="text-[11px] font-semibold text-gray-800 whitespace-nowrap py-2.5">
                    {formatCurrency(po.totals.amount)}
                  </TableCell>
                  <TableCell className="text-[11px] font-semibold text-gray-800 whitespace-nowrap py-2.5">
                    {formatCurrency(po.totals.vatAmount)}
                  </TableCell>
                  <TableCell className="text-[11px] font-semibold text-gray-800 whitespace-nowrap py-2.5">
                    {formatCurrency(po.totals.grandTotal)}
                  </TableCell>
                  {/* <TableCell className="py-2.5 whitespace-nowrap text-right">
                    <p className="text-[11px] font-semibold text-gray-800">{formatCurrency(po.totals.grandTotal)}</p>
                    <p className="text-[10px] text-gray-400">VAT {formatCurrency(po.totals.vatAmount)}</p>
                  </TableCell> */}
                  <TableCell className="whitespace-nowrap py-2.5">
                    <POStatusBadge status={po.status} />
                  </TableCell>
                  <TableCell className="py-2.5">
                    <Button
                      variant="ghost" size="icon"
                      className="h-7 w-7 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                      title="Lihat Detail"
                      onClick={(e) => { e.stopPropagation(); handleViewDetail(po.poNo); }}
                    >
                      <Search className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 bg-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-400 hidden sm:block">Baris per halaman</span>
            <Select value={String(perPage)} onValueChange={handlePerPageChange}>
              <SelectTrigger className="h-7 w-16 text-[11px] border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PER_PAGE_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)} className="text-[11px]">{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-gray-400">{fromRow}–{toRow} dari {total}</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-7 w-7 border-gray-200" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1 || isLoading}>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              <span className="text-[11px] text-gray-500 min-w-[60px] text-center">{page} / {totalPages}</span>
              <Button variant="outline" size="icon" className="h-7 w-7 border-gray-200" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages || isLoading}>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}