<?php

namespace App\Models\GoodsReceive;

use CodeIgniter\Model;

class GoodsReceiveModel extends Model
{
    protected $table            = 'goods_receive';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useTimestamps    = false;

    protected $allowedFields = [
        'purchase_order_no',
        'goods_receive_no',
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
        'status_grn',
        'revision_seq',
        'department',
        'supplier_name',
        'cancel_status',
        'cancel_status_date',
        'purchase_order_date',
        'departement_code',
        'departement_desc',
        'cancel_by',
        'discount_faktur',
        'discount_pct',
        'store_name',
        'est_delivery_date',
        'po_expired_date',
        'vims_invoice_status',
        'invoice_receipt_no',
    ];
}