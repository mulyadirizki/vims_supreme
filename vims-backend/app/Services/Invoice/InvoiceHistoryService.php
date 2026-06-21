<?php

namespace App\Services\Invoice;

use App\DTOs\Invoice\InvoiceHistoryFilterDto;
use App\Repositories\Invoice\InvoiceHistoryRepository;
use App\Transformers\Invoice\InvoiceOnProcessTransformer;

class InvoiceHistoryService
{
    public function list(array $payload): array
    {
        // resolveSupplierCode() — reuse logic yang sama persis dengan
        // InvoiceOnProcessService (decode JWT cookie auth_token, baca group_id)
        $payload['supplier_code'] = $this->resolveSupplierCode();

        $filter = new InvoiceHistoryFilterDto($payload);

        $repo = new InvoiceHistoryRepository();
        $result = $repo->paginate($filter);

        $transformer = new InvoiceOnProcessTransformer();
        $data = array_map(fn ($row) => $transformer->transform($row), $result['data']);

        return [
            'status' => true,
            'data' => $data,
            'pagination' => [
                'page' => $filter->page,
                'per_page' => $filter->perPage,
                'total' => $result['total'],
                'last_page' => (int) ceil($result['total'] / max($filter->perPage, 1)),
            ],
        ];
    }

    private function resolveSupplierCode(): ?string
    {
        // TODO: ganti dengan implementasi yang sama persis seperti
        // resolveSupplierCode() di InvoiceOnProcessService kamu.
        // Idealnya ditarik jadi satu trait/shared service biar nggak duplikat,
        // misal: App\Traits\ResolvesSupplierCodeFromToken
        return null;
    }
}