<?php

namespace App\Repositories\Invoice;

use App\DTOs\Invoice\InvoiceHistoryFilterDto;

class InvoiceHistoryRepository
{
    public function paginate(InvoiceHistoryFilterDto $filter): array
    {
        $db = db_connect();
        $builder = $db->table('invoice_receipt');

        $builder->whereIn('status', ['APPROVED', 'PAID']);

        if ($filter->status) {
            $builder->where('status', $filter->status);
        }

        if ($filter->supplierCode) {
            $builder->where('supplier_code', $filter->supplierCode);
        }

        if ($filter->grNo) {
            $builder->like('goods_receive_no', $filter->grNo);
        }

        if ($filter->poNo) {
            $builder->like('purchase_order_no', $filter->poNo);
        }

        if ($filter->invoiceReceiptNo) {
            $builder->like('invoice_receipt_no', $filter->invoiceReceiptNo);
        }

        $total = $builder->countAllResults(false);

        $rows = $builder
            ->orderBy('confirm_date', 'DESC')
            ->limit($filter->perPage, ($filter->page - 1) * $filter->perPage)
            ->get()
            ->getResultArray();

        return [
            'data' => $rows,
            'total' => $total,
        ];
    }
}