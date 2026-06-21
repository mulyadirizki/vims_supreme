<?php

namespace App\Repositories\Invoice;

use App\Models\InvoiceReceipt\InvoiceReceiptModel;
use App\Constants\InvoiceReceiptStatus;
use App\DTOs\Invoice\ReadyToPayFilterDto;

class ReadyToPayRepository
{
    protected InvoiceReceiptModel $model;

    public function __construct()
    {
        $this->model = new InvoiceReceiptModel();
    }

    public function paginate(ReadyToPayFilterDto $filter): array
    {
        $builder = $this->model
            ->where('status', InvoiceReceiptStatus::APPROVED)
            ->where('payment_date', null);

        if (!empty($filter->supplierCode)) {
            $builder->where('supplier_code', $filter->supplierCode);
        }
        if (!empty($filter->grNo)) {
            $builder->like('goods_receive_no', $filter->grNo);
        }
        if (!empty($filter->poNo)) {
            $builder->like('purchase_order_no', $filter->poNo);
        }
        if (!empty($filter->invoiceReceiptNo)) {
            $builder->like('invoice_receipt_no', $filter->invoiceReceiptNo);
        }

        $total = $builder->countAllResults(false);

        $rows = $builder->orderBy('confirm_date', 'ASC')->paginate($filter->perPage, 'default', $filter->page);

        return [
            'rows' => $rows,
            'total' => $total,
            'page' => $filter->page,
            'per_page' => $filter->perPage,
            'last_page' => (int) ceil($total / max($filter->perPage, 1)),
        ];
    }
}