<?php

namespace App\Transformers\Invoice;

class InvoiceReceiptTransformer
{
    public static function transform(array $row): array
    {
        return [
            'invoiceReceiptNo' => $row['invoice_receipt_no'],
            'goodsReceiveNo' => $row['goods_receive_no'],
            'supplierCode' => $row['supplier_code'],
            'supplierName' => $row['supplier_name'],
            'grandTotal' => (float)$row['grand_total'],
        ];
    }
}