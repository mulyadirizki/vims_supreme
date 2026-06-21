<?php
namespace App\Transformers\Invoice;
use App\Constants\InvoiceReceiptStatus;

class InvoiceOnProcessTransformer
{
    public static function transform(array $row): array
    {
        return [
            'invoiceReceiptNo' => $row['invoice_receipt_no'],
            'grNo' => $row['goods_receive_no'],
            'poNo' => $row['purchase_order_no'],
            'supplier' => [
                'code' => $row['supplier_code'],
                'name' => $row['supplier_name'],
            ],
            'department' => $row['department'],
            'noInvoiceSupplier' => $row['no_invoice_supplier'],
            'noFakturPajak' => $row['no_faktur_pajak'],
            'tglFakturPajak' => $row['tgl_faktur_pajak'],
            'totals' => [
                'quantity' => (float) $row['total_quantity'],
                'amount' => (float) $row['total_amount'],
                'vatAmount' => (float) $row['vat_amount'],
                'grandTotal' => (float) $row['grand_total'],
            ],
            'status_invr' => $row['status_invr'] ?? null,
            'status' => [
                'code' => $row['status'],
                'label' => InvoiceReceiptStatus::LABELS[$row['status']] ?? $row['status'],
            ],
            'confirmDate' => $row['confirm_date'] ?? null,
            'noSuratJalan' => $row['no_surat_jalan'] ?? null,
            'remark' => $row['remark'] ?? null,
            'rejectReason' => $row['reject_reason'] ?? null,
            'rejectDate' => $row['reject_date'] ?? null,
            'userConfirm' => $row['user_confirm'] ?? null,
            'paymentDate' => $row['payment_date'] ?? null,
        ];
    }
}