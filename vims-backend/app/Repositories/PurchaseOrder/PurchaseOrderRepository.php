<?php

namespace App\Repositories\PurchaseOrder;

use App\Models\PurchaseOrder\PurchaseOrderModel;
use App\DTOs\PurchaseOrder\PurchaseOrderFilterDto;

class PurchaseOrderRepository
{
    protected PurchaseOrderModel $model;

    public function __construct()
    {
        $this->model = new PurchaseOrderModel();
    }

    public function getPaginated(PurchaseOrderFilterDto $filter): array
    {
        $builder = $this->model;

        // ── Supplier filter ──────────────────────────────────────────
        if (!empty($filter->supplierCode)) {
            $builder->where('supplier_code', $filter->supplierCode);
        }
        // ─────────────────────────────────────────────────────────────

        if (!empty($filter->poNo)) {
            $builder->like('purchase_order_no', $filter->poNo);
        }

        if (!empty($filter->supplier)) {
            $builder->like('supplier_name', $filter->supplier);
        }

        if (!empty($filter->statusPo)) {
            $builder->where('status_po', $filter->statusPo);
        }

        if (!empty($filter->tab)) {
            $codes = match ($filter->tab) {
                'on_process' => [null, '', '11', '12'],
                'history'    => ['13', '14'],
                default      => [],
            };

            if (!empty($codes)) {
                $builder->groupStart();
                foreach ($codes as $code) {
                    if ($code === null || $code === '') {
                        $builder->orWhere('status_po', null);
                    } else {
                        $builder->orWhere('status_po', $code);
                    }
                }
                $builder->groupEnd();
            }
        }

        if (!empty($filter->dateFrom)) {
            $builder->where('document_date >=', $filter->dateFrom);
        }

        if (!empty($filter->dateTo)) {
            $builder->where('document_date <=', $filter->dateTo);
        }

        $total = $builder->countAllResults(false);

        $data = $builder
            ->orderBy('document_date', 'ASC')
            ->findAll(
                $filter->perPage,
                ($filter->page - 1) * $filter->perPage
            );

        return [
            'data' => $data,
            'pagination' => [
                'page'      => $filter->page,
                'per_page'  => $filter->perPage,
                'total'     => $total,
                'last_page' => (int) ceil($total / $filter->perPage)
            ]
        ];
    }

    public function findDetail(string $poNo, ?string $supplierCode = null): ?array
    {
        $query = $this->model->where('purchase_order_no', $poNo);

        // ── Supplier hanya boleh lihat PO miliknya ───────────────────
        if (!empty($supplierCode)) {
            $query->where('supplier_code', $supplierCode);
        }
        // ─────────────────────────────────────────────────────────────

        $po = $query->first();

        if (!$po) {
            return null;
        }

        $items = (new \App\Models\PurchaseOrder\PurchaseOrderItemModel())
            ->where('purchase_order_no', $poNo)
            ->orderBy('line_item', 'ASC')
            ->findAll();

        return [
            'header' => $po,
            'items'  => $items,
        ];
    }
}