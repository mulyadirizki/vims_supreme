<?php

namespace App\Models\InvoiceReceipt;

use CodeIgniter\Model;

class InvoiceReceiptAttachmentModel extends Model
{
    protected $table = 'invoice_receipt_attachment';

    protected $allowedFields = [
        'invoice_receipt_no',
        'document_type',
        'file_name',
        'file_path',
        'file_size',
        'mime_type',
        'uploaded_by',
    ];

    protected $returnType = 'array';
}