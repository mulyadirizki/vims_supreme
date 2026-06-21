<?php

namespace App\DTOs\Invoice;

class ReadyToPayFilterDto
{
    public ?string $grNo;
    public ?string $poNo;
    public ?string $invoiceReceiptNo;
    public ?string $supplierCode;
    public int $page;
    public int $perPage;

    public function __construct(array $request)
    {
        $this->grNo             = $request['gr_no']             ?? null;
        $this->poNo              = $request['po_no']             ?? null;
        $this->invoiceReceiptNo = $request['invoice_receipt_no'] ?? null;
        $this->supplierCode     = $request['supplier_code']      ?? null;
        $this->page              = (int) ($request['page']       ?? 1);
        $this->perPage           = (int) ($request['per_page']   ?? 10);
    }
}