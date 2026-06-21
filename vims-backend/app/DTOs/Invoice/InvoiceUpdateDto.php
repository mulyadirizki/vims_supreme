<?php

namespace App\DTOs\Invoice;

class InvoiceUpdateDto
{
    public ?string $noInvoiceSupplier;
    public ?string $noFakturPajak;
    public ?string $tglFakturPajak;
    public ?string $noSuratJalan;
    public ?string $remark;

    public function __construct(array $request)
    {
        $this->noInvoiceSupplier = $request['no_invoice_supplier'] ?? null;
        $this->noFakturPajak     = $request['no_faktur_pajak']     ?? null;
        $this->tglFakturPajak    = $request['tgl_faktur_pajak']    ?? null;
        $this->noSuratJalan      = $request['no_surat_jalan']      ?? null;
        $this->remark            = $request['remark']              ?? null;
    }
}