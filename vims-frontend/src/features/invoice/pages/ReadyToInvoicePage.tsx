import { useState } from "react";
import { Search } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReadyToInvoiceList } from "../hooks/use-ready-to-invoice-list";
import { InvoiceStatusBadge } from "../components/InvoiceStatusBadge";
import { ProcessToInvoiceButton } from "../components/ProcessToInvoiceButton";
import type { ReadyToInvoiceFilter } from "../types/invoice.types";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

const formatDate = (value: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const PER_PAGE_OPTIONS = [10, 25, 50];
const TABLE_HEADS = [
  "No. GR",
  "No. PO",
  "Tanggal GR",
  "Departemen",
  "Qty",
  "Grand Total",
  "Status",
  "Aksi",
];

export const ReadyToInvoicePage = () => {
  const [grSearchInput, setGrSearchInput] = useState("");
  const [poSearchInput, setPoSearchInput] = useState("");
  const [filter, setFilter] = useState<ReadyToInvoiceFilter>({
    page: 1,
    per_page: 10,
  });

  const { data, isLoading, isError } = useReadyToInvoiceList(filter);

  const list = data?.data ?? [];
  const pagination = data?.pagination;
  const total = pagination?.total ?? 0;
  const totalPages = pagination?.last_page ?? 1;
  const page = filter.page;
  const perPage = filter.per_page;
  const fromRow = total === 0 ? 0 : (page - 1) * perPage + 1;
  const toRow = Math.min(page * perPage, total);

  const handleSearch = () => {
    setFilter((prev) => ({
      ...prev,
      gr_no: grSearchInput || undefined,
      po_no: poSearchInput || undefined,
      page: 1,
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handlePerPageChange = (val: string) => {
    setFilter((prev) => ({ ...prev, per_page: Number(val), page: 1 }));
  };

  const goToPage = (newPage: number) => {
    setFilter((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div>
        <h1 className="text-[15px] font-bold text-gray-800">Ready To Invoice</h1>
        <p className="text-[11px] text-gray-400 mt-0.5">
          Daftar GR yang siap diproses menjadi invoice
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
          <Input
            placeholder="Cari No. GR..."
            value={grSearchInput}
            onChange={(e) => setGrSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-8 h-8 w-44 text-[12px] bg-white border-gray-200 placeholder:text-gray-300"
          />
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
          <Input
            placeholder="Cari No. PO..."
            value={poSearchInput}
            onChange={(e) => setPoSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-8 h-8 w-44 text-[12px] bg-white border-gray-200 placeholder:text-gray-300"
          />
        </div>

        <Button
          onClick={handleSearch}
          className="h-8 px-3 text-[12px] bg-blue-600 hover:bg-blue-700 text-white"
        >
          Cari
        </Button>

        <span className="text-[11px] text-gray-400 ml-auto">{total} data</span>
      </div>

      <div
        className="rounded-lg border border-gray-100 bg-white flex flex-col overflow-hidden"
        style={{ minHeight: 0 }}
      >
        <div className="overflow-auto flex-1">
          <Table className="min-w-[900px] w-full">
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50 sticky top-0 z-10">
                {TABLE_HEADS.map((h, i) => (
                  <TableHead
                    key={h}
                    className={`text-[10px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap py-2.5 bg-gray-50 ${
                      i === 4 || i === 5 ? "text-right" : ""
                    } ${i === TABLE_HEADS.length - 1 ? "text-right" : ""}`}
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-16">
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-[12px]">
                      <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                      Memuat data...
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {isError && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-16 text-red-400 text-[12px]">
                    Gagal memuat data. Silakan refresh halaman.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !isError && list.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-16 text-gray-400 text-[12px]">
                    Tidak ada GR yang siap diinvoice.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading &&
                !isError &&
                list.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-blue-50/30 transition-colors border-b border-gray-50"
                  >
                    <TableCell className="text-[11px] font-semibold text-blue-600 whitespace-nowrap py-2.5">
                      {item.grNo}
                    </TableCell>
                    <TableCell className="text-[11px] text-gray-600 whitespace-nowrap py-2.5">
                      {item.poNo}
                    </TableCell>
                    <TableCell className="text-[11px] text-gray-500 whitespace-nowrap py-2.5">
                      {formatDate(item.documentDate)}
                    </TableCell>
                    <TableCell className="py-2.5 whitespace-nowrap max-w-[180px]">
                      <p className="text-[11px] text-gray-700 truncate">
                        {item.department.desc}
                      </p>
                    </TableCell>
                    <TableCell className="text-[11px] text-gray-700 whitespace-nowrap py-2.5 text-right">
                      {item.totals.quantity}
                    </TableCell>
                    <TableCell className="text-[11px] font-semibold text-gray-800 whitespace-nowrap py-2.5 text-right">
                      {formatCurrency(item.totals.grandTotal)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap py-2.5">
                      <InvoiceStatusBadge status={item.invoiceStatus} />
                    </TableCell>
                    <TableCell className="py-2.5 text-right">
                      <ProcessToInvoiceButton grNo={item.grNo} poNo={item.poNo} />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 bg-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-400 hidden sm:block">
              Baris per halaman
            </span>
            <Select value={String(perPage)} onValueChange={handlePerPageChange}>
              <SelectTrigger className="h-7 w-16 text-[11px] border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PER_PAGE_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)} className="text-[11px]">
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-gray-400">
              {fromRow}–{toRow} dari {total}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 border-gray-200"
                onClick={() => goToPage(Math.max(1, page - 1))}
                disabled={page <= 1 || isLoading}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              <span className="text-[11px] text-gray-500 min-w-[60px] text-center">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 border-gray-200"
                onClick={() => goToPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages || isLoading}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadyToInvoicePage;