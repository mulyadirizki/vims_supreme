<?php

namespace App\DTOs\GoodsReceive;

class ReadyToInvoiceFilterDto
{
    public ?string $grNo;
    public ?string $poNo;
    public ?string $dateFrom;
    public ?string $dateTo;
    public int $page;
    public int $perPage;
    public ?string $supplierCode;

    public function __construct(array $request)
    {
        $this->grNo         = $request['gr_no']        ?? null;
        $this->poNo          = $request['po_no']        ?? null;
        $this->dateFrom      = $request['date_from']    ?? null;
        $this->dateTo        = $request['date_to']      ?? null;
        $this->page          = (int) ($request['page']     ?? 1);
        $this->perPage       = (int) ($request['per_page'] ?? 10);
        $this->supplierCode  = $request['supplier_code'] ?? null;
    }
}