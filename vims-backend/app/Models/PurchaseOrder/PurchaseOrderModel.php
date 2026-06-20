<?php

namespace App\Models\PurchaseOrder;

use CodeIgniter\Model;

class PurchaseOrderModel extends Model
{
    protected $table = 'purchase_order';
    protected $primaryKey = 'id';

    protected $returnType = 'array';

    protected $allowedFields = [
        'purchase_order_no',
        'company_code',
        'store_code',
        'supplier_code',
        'document_date',
        'delivery_date',
        'status_po',
        'supplier_name',
        'grand_total',
    ];
}