<?php

namespace App\Transformers\PurchaseOrder;

use App\Constants\PurchaseOrderStatus;

class PurchaseOrderTransformer
{
    public static function transform(array $po): array
    {
        return [
            'id' => $po['id'],
            'poNo' => $po['purchase_order_no'],
            'companyCode' => $po['company_code'],
            'store' => [
                'code' => $po['store_code'],
                'name' => $po['store_name'],
            ],
            'supplier' => [
                'code' => $po['supplier_code'],
                'name' => $po['supplier_name'],
            ],
            'documentDate' => $po['document_date'],
            'deliveryDate' => $po['delivery_date'],
            'expiredDate' => $po['expired_date_po'],
            'department' => [
                'code' => $po['departement_code'],
                'desc' => $po['departement_desc'],
            ],
            'orderType' => $po['order_type'],
            'totals' => [
                'quantity' => (float) $po['total_quantity'],
                'amount' => (float) $po['total_amount'],
                'vatAmount' => (float) $po['total_vat_amount'],
                'grandTotal' => (float) $po['grand_total'],
            ],
            'status' => [
                'code' => $po['status_po'],
                'label' => PurchaseOrderStatus::label($po['status_po']),
                'group' => PurchaseOrderStatus::group($po['status_po']),
            ],
            'isIntegrated' => (bool) $po['isIntegrated'],
            'confirmDate' => $po['confirm_date'],
            'cancelInfo' => $po['status_cancel'] ? [
                'cancelledAt' => $po['status_cancel_date'],
                'cancelledBy' => $po['cancel_by'],
            ] : null,
            'isOverdue' => $po['expired_date_po']
                && strtotime($po['expired_date_po']) < time()
                && PurchaseOrderStatus::group($po['status_po']) === 'on_process',
        ];
    }

    public static function collection(array $list): array
    {
        return array_map([self::class, 'transform'], $list);
    }

    /**
     * Untuk detail: header + line items
     */
    public static function transformDetail(array $po, array $items): array
    {
        $header = self::transform($po);
        $header['items'] = array_map([self::class, 'transformItem'], $items);
        $header['headerText'] = $po['header_text'];
        $header['reqCancel'] = $po['req_cancel_date'] ? [
            'requestedAt' => $po['req_cancel_date'],
            'confirmedAt' => $po['confirm_req_cancel_date'],
        ] : null;

        return $header;
    }

    public static function transformItem(array $item): array
    {
        return [
            'id' => $item['id'],
            'lineItem' => $item['line_item'],
            'productCode' => $item['product_code'],
            'barcode' => $item['barcode'],
            'description' => $item['description'],
            'unit' => $item['unit'],
            'quantity' => (float) $item['quantity'],
            'unitPrice' => (float) $item['unit_price'],
            'amount' => (float) $item['amount'],
            'taxPct' => (float) $item['tax_pct'],
            'vatAmount' => (float) $item['vat_amount'],
            'amountAfterTax' => (float) $item['amount_after_tax'],
            'discount' => [
                'amount' => (float) $item['discount_amount'],
                'pct' => (float) $item['discount_pct'],
            ],
            'department' => [
                'code' => $item['departement_code_item'],
                'desc' => $item['departement_desc_item'],
            ],
            'store' => [
                'code' => $item['store_code_item'],
                'desc' => $item['store_desc_item'],
            ],
            'deliveryDate' => $item['delivery_date_item'],
            'expiredDate' => $item['expired_po_item'],
        ];
    }
}