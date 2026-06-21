<?php

namespace App\Repositories\Invoice;

use App\Models\InvoiceReceipt\InvoiceReceiptAttachmentModel;

class InvoiceReceiptAttachmentRepository
{
    protected InvoiceReceiptAttachmentModel $model;

    public function __construct()
    {
        $this->model = new InvoiceReceiptAttachmentModel();
    }

    public function findByInvoiceReceiptNo(string $invoiceReceiptNo): array
    {
        return $this->model->where('invoice_receipt_no', $invoiceReceiptNo)->findAll();
    }
}