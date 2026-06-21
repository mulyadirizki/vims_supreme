<?php

namespace App\DTOs\Invoice;

class InvoiceHistoryFilterDto
{
    public ?string $grNo;
    public ?string $poNo;
    public ?string $invoiceReceiptNo;
    public ?string $status; // 'APPROVED' | 'PAID' | null (semua)
    public ?string $supplierCode;
    public int $page;
    public int $perPage;

    public function __construct(array $data)
    {
        $this->grNo = $data['gr_no'] ?? null;
        $this->poNo = $data['po_no'] ?? null;
        $this->invoiceReceiptNo = $data['invoice_receipt_no'] ?? null;
        $this->status = $data['status'] ?? null;
        $this->supplierCode = $data['supplier_code'] ?? null;
        $this->page = (int) ($data['page'] ?? 1);
        $this->perPage = (int) ($data['per_page'] ?? 10);
    }
}