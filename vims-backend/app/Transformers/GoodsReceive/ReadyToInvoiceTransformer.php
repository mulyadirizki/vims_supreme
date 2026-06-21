<?php

namespace App\Transformers\GoodsReceive;

use App\Constants\GoodsReceiveInvoiceStatus;

class ReadyToInvoiceTransformer
{
    public static function transform(array $gr): array
    {
        return [
            'id' => $gr['id'],
            'grNo' => $gr['goods_receive_no'],
            'poNo' => $gr['purchase_order_no'],
            'companyCode' => $gr['company_code'],
            'store' => [
                'code' => $gr['store_code'],
                'name' => $gr['store_name'],
            ],
            'supplier' => [
                'code' => $gr['supplier_code'],
                'name' => $gr['supplier_name'],
            ],
            'documentDate' => $gr['document_date'],
            'purchaseOrderDate' => $gr['purchase_order_date'],
            'department' => [
                'code' => $gr['departement_code'],
                'desc' => $gr['departement_desc'],
            ],
            'totals' => [
                'quantity' => (float) $gr['total_quantity'],
                'amount' => (float) $gr['total_amount'],
                'vatAmount' => (float) $gr['vat_amount'],
                'grandTotal' => (float) $gr['grand_total'],
            ],
            'invoiceStatus' => [
                'code' => $gr['vims_invoice_status'],
                'label' => GoodsReceiveInvoiceStatus::label($gr['vims_invoice_status']),
            ],
            'isIntegrated' => (bool) $gr['isIntegrated'],
        ];
    }

    public static function collection(array $list): array
    {
        return array_map([self::class, 'transform'], $list);
    }

    public static function detail(array $row): array
    {
        return [
            'grNo' => $row['goods_receive_no'],
            'poNo' => $row['purchase_order_no'],
            'companyCode' => $row['company_code'],
            'storeCode' => $row['store_code'],
            'supplierCode' => $row['supplier_code'],
            'supplierName' => $row['supplier_name'],
            'department' => $row['department'],
            'documentDate' => $row['document_date'],
            'totalQuantity' => (float) $row['total_quantity'],
            'totalAmount' => (float) $row['total_amount'],
            'vatAmount' => (float) $row['vat_amount'],
            'grandTotal' => (float) $row['grand_total'],
        ];
    }
}