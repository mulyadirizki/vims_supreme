<?php

namespace App\Services\GoodsReceive;

use App\Repositories\GoodsReceive\GoodsReceiveRepository;

class GoodsReceiveService
{
    protected GoodsReceiveRepository $repository;

    public function __construct()
    {
        $this->repository = new GoodsReceiveRepository();
    }

    public function getOverview(string $grNo): array
    {
        $gr = $this->repository->findByGrNo($grNo);

        if (!$gr) {
            throw new \Exception('Goods Receive tidak ditemukan', 404);
        }

        return [
            'grNo' => $gr['goods_receive_no'],
            'poNo' => $gr['purchase_order_no'],
            'supplier' => [
                'code' => $gr['supplier_code'],
                'name' => $gr['supplier_name'],
            ],
            'companyCode' => $gr['company_code'],
            'store' => [
                'code' => $gr['store_code'],
                'name' => $gr['store_name'],
            ],
            'department' => [
                'code' => $gr['departement_code'],
                'desc' => $gr['departement_desc'],
            ],
            'documentDate' => $gr['document_date'],
            'purchaseOrderDate' => $gr['purchase_order_date'],
            'totals' => [
                'quantity' => (float) $gr['total_quantity'],
                'amount' => (float) $gr['total_amount'],
                'vatAmount' => (float) $gr['vat_amount'],
                'grandTotal' => (float) $gr['grand_total'],
            ],
        ];
    }
}