<?php

namespace App\DTOs\PurchaseOrder;

class PurchaseOrderFilterDto
{
    public ?string $poNo;
    public ?string $supplier;
    public ?string $tab;
    public ?string $statusPo;
    public ?string $dateFrom;
    public ?string $dateTo;
    public int $page;
    public int $perPage;
    public ?string $supplierCode; // ← tambah ini

    public function __construct(array $request)
    {
        $this->poNo         = $request['po_no']        ?? null;
        $this->supplier     = $request['supplier']     ?? null;
        $this->tab          = $request['tab']          ?? null;
        $this->statusPo     = $request['status_po']    ?? null;
        $this->dateFrom     = $request['date_from']    ?? null;
        $this->dateTo       = $request['date_to']      ?? null;
        $this->page         = (int)($request['page']     ?? 1);
        $this->perPage      = (int)($request['per_page'] ?? 10);
        $this->supplierCode = $request['supplier_code'] ?? null; // ← tambah ini
    }
}