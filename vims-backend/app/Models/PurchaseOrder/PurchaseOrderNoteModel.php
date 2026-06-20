<?php

namespace App\Models\PurchaseOrder;

use CodeIgniter\Model;

class PurchaseOrderNoteModel extends Model
{
    protected $table = 'purchase_order_note';
    protected $primaryKey = 'id';

    protected $returnType = 'array';
}