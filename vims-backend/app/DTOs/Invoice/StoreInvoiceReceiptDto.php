<?php

namespace App\DTOs\Invoice;

class StoreInvoiceReceiptDto
{
    public string $grNo;
    public ?string $invoiceSupplierNo;
    public ?string $fakturPajakNo;
    public ?string $tglFakturPajak;
    public ?string $suratJalanNo;
    public ?string $remark;

    public function __construct(array $payload)
    {
        $this->grNo = $payload['gr_no'] ?? '';
        $this->invoiceSupplierNo = $payload['invoice_supplier_no'] ?? null;
        $this->fakturPajakNo = $payload['faktur_pajak_no'] ?? null;
        $this->tglFakturPajak = $payload['tgl_faktur_pajak'] ?? null;
        $this->suratJalanNo = $payload['surat_jalan_no'] ?? null;
        $this->remark = $payload['remark'] ?? null;
    }
}