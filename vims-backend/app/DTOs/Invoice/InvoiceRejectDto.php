<?php

namespace App\DTOs\Invoice;

class InvoiceRejectDto
{
    public string $rejectReason;

    public function __construct(array $request)
    {
        $this->rejectReason = trim((string) ($request['reject_reason'] ?? ''));
    }
}