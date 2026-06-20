import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, Calendar, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { usePODetail } from "../hooks/use-po-detail";
import { POStatusBadge } from "../components/POStatusBadge";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", minimumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export default function PODetailPage() {
  const { poNo } = useParams<{ poNo: string }>();
  const navigate = useNavigate();
  const { data: po, isLoading, isError } = usePODetail(poNo);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-[12px] gap-2">
        <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        Memuat detail PO...
      </div>
    );
  }

  if (isError || !po) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-[12px] text-gray-400">PO tidak ditemukan.</p>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-[15px] font-bold text-gray-800">{po.poNo}</h1>
            <POStatusBadge status={po.status} />
            {po.isOverdue && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-orange-50 text-orange-600 border border-orange-200">
                Overdue
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">{po.headerText || "Tidak ada catatan"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-lg border border-gray-100 bg-white p-3.5">
          <div className="flex items-center gap-1.5 text-gray-400 mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Supplier</span>
          </div>
          <p className="text-[12px] font-semibold text-gray-800">{po.supplier.name}</p>
          <p className="text-[11px] text-gray-400">{po.supplier.code}</p>
        </div>

        <div className="rounded-lg border border-gray-100 bg-white p-3.5">
          <div className="flex items-center gap-1.5 text-gray-400 mb-2">
            <Package className="w-3.5 h-3.5" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Store / Department</span>
          </div>
          <p className="text-[12px] font-semibold text-gray-800">{po.store.name ?? po.store.code}</p>
          <p className="text-[11px] text-gray-400">{po.department.desc}</p>
        </div>

        <div className="rounded-lg border border-gray-100 bg-white p-3.5">
          <div className="flex items-center gap-1.5 text-gray-400 mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Tanggal</span>
          </div>
          <p className="text-[11px] text-gray-700">Dokumen: {formatDate(po.documentDate)}</p>
          <p className="text-[11px] text-gray-700">Delivery: {formatDate(po.deliveryDate)}</p>
          <p className="text-[11px] text-gray-700">Expired: {formatDate(po.expiredDate)}</p>
        </div>
      </div>

      {po.cancelInfo && (
        <div className="rounded-lg border border-red-100 bg-red-50/50 p-3.5">
          <p className="text-[11px] text-red-600 font-medium">
            Dibatalkan oleh {po.cancelInfo.cancelledBy} pada {formatDate(po.cancelInfo.cancelledAt)}
          </p>
        </div>
      )}

      <div className="rounded-lg border border-gray-100 bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-[13px] font-bold text-gray-800">Item Purchase Order</h2>
        </div>
        <div className="overflow-auto">
          <Table className="min-w-[900px] w-full">
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                {["No", "Produk", "Qty", "Unit Price", "Disc", "Tax %", "VAT", "Total"].map((h) => (
                  <TableHead key={h} className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap py-2.5 bg-gray-50">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {po.items.map((item) => (
                <TableRow key={item.id} className="border-b border-gray-50">
                  <TableCell className="text-[11px] text-gray-500 py-2.5">{item.lineItem}</TableCell>
                  <TableCell className="py-2.5 max-w-[260px]">
                    <p className="text-[11px] text-gray-700 font-medium truncate">{item.description}</p>
                    <p className="text-[10px] text-gray-400">{item.productCode} · {item.barcode}</p>
                  </TableCell>
                  <TableCell className="text-[11px] text-gray-600 py-2.5">{item.quantity} {item.unit}</TableCell>
                  <TableCell className="text-[11px] text-gray-600 text-right py-2.5">{formatCurrency(item.unitPrice)}</TableCell>
                  <TableCell className="text-[11px] text-gray-500 text-right py-2.5">{item.discount.pct}%</TableCell>
                  <TableCell className="text-[11px] text-gray-500 text-right py-2.5">{item.taxPct}%</TableCell>
                  <TableCell className="text-[11px] text-gray-500 text-right py-2.5">{formatCurrency(item.vatAmount)}</TableCell>
                  <TableCell className="text-[11px] font-semibold text-gray-800 text-right py-2.5">{formatCurrency(item.amountAfterTax)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end px-4 py-3 border-t border-gray-100 bg-gray-50/50">
          <div className="text-right space-y-1">
            <p className="text-[11px] text-gray-500">Subtotal: {formatCurrency(po.totals.amount)}</p>
            <p className="text-[11px] text-gray-500">VAT: {formatCurrency(po.totals.vatAmount)}</p>
            <p className="text-[13px] font-bold text-gray-800">Grand Total: {formatCurrency(po.totals.grandTotal)}</p>
          </div>
        </div>
      </div>

      {/* {po.status.group === "on_process" && (
        <div className="flex justify-end gap-2 mb-5">
          <Button variant="outline" size="sm" className="text-[12px]">Tolak Price & Tax</Button>
          <Button size="sm" className="text-[12px] bg-blue-600 hover:bg-blue-700">Konfirmasi Price & Tax OK</Button>
        </div>
      )} */}
    </div>
  );
}