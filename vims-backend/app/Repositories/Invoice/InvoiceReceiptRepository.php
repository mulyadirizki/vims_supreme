<?php

namespace App\Repositories\Invoice;

use App\Models\InvoiceReceipt\InvoiceReceiptModel;

class InvoiceReceiptRepository
{
    protected InvoiceReceiptModel $model;

    public function __construct()
    {
        $this->model = new InvoiceReceiptModel();
    }

    // InvoiceReceiptRepository.php
    public function getNextSequence(string $prefix): int
    {
        $last = $this->model
            ->like('invoice_receipt_no', $prefix, 'after')
            ->orderBy('id', 'DESC')
            ->first();

        if (!$last) {
            return 1;
        }

        $lastSeq = (int) substr($last['invoice_receipt_no'], strlen($prefix));
        return $lastSeq + 1;
    }

    public function create(array $data): int
    {
        $this->model->insert($data);
        return (int) $this->model->getInsertID();
    }
}