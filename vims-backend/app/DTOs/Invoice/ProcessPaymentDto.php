<?php

namespace App\DTOs\Invoice;

class ProcessPaymentDto
{
    public string $invoiceReceiptNo;
    public string $paymentDate;
    public ?string $remark;

    public function __construct(array $data)
    {
        $this->invoiceReceiptNo = $data['invoice_receipt_no'] ?? '';
        $this->paymentDate = $data['payment_date'] ?? date('Y-m-d');
        $this->remark = $data['remark'] ?? null;
    }
}