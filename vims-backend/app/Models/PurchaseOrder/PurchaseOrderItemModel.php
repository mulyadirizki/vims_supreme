<?php

namespace App\Models\PurchaseOrder;

use CodeIgniter\Model;

class PurchaseOrderItemModel extends Model
{
    protected $table = 'purchase_order_item';
    protected $primaryKey = 'id';

    protected $returnType = 'array';
}