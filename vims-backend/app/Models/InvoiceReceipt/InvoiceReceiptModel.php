<?php

namespace App\Models\InvoiceReceipt;

use CodeIgniter\Model;

class InvoiceReceiptModel extends Model
{
    protected $table            = 'invoice_receipt';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useTimestamps    = false;

    protected $allowedFields = [
        'purchase_order_no',
        'goods_receive_no',
        'proforma_invoice_no',
        'invoice_no',
        'invoice_receipt_no',
        'company_code',
        'store_code',
        'supplier_code',
        'document_date',
        'trade_type',
        'total_quantity',
        'total_amount',
        'vat_amount',
        'grand_total',
        'isIntegrated',
        'status_invr',
        'pembulatan_total',
        'pembulatan_tax',
        'no_invoice_supplier',
        'no_faktur_pajak',
        'tgl_faktur_pajak',
        'department',
        'supplier_name',
        'biaya_materai',
        'remark',
        'no_surat_jalan',
        'user_confirm',
        'confirm_date',
        'rs_no_sap',
        'integrasi_date',
        'dnnum_sap',
        'park_date',
        'payment_term_cd',
        'reject_date',
        'reject_reason',
        'payment_date',
        'park_msg',
        'delivery_no_sap',
        'status',
    ];
}