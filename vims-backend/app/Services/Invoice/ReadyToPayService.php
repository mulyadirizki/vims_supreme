<?php

namespace App\Services\Invoice;

use App\Repositories\Invoice\ReadyToPayRepository;
use App\Transformers\Invoice\InvoiceOnProcessTransformer;
use App\DTOs\Invoice\ReadyToPayFilterDto;
use App\Services\AuthService;

class ReadyToPayService
{
    const SUPPLIER_GROUP_ID = 10;

    public function __construct(
        protected AuthService $authService = new AuthService()
    ) {}

    public function list(array $filter): array
    {
        $filter['supplier_code'] = $this->resolveSupplierCode();

        $repo = new ReadyToPayRepository();
        $dto = new ReadyToPayFilterDto($filter);
        $result = $repo->paginate($dto);

        return [
            'status' => true,
            'data' => array_map(
                fn ($row) => InvoiceOnProcessTransformer::transform($row),
                $result['rows']
            ),
            'pagination' => [
                'page' => $result['page'],
                'per_page' => $result['per_page'],
                'total' => $result['total'],
                'last_page' => $result['last_page'],
            ],
        ];
    }

    private function resolveSupplierCode(): ?string
    {
        $token = service('request')->getCookie('auth_token');

        if (empty($token)) {
            throw new \Exception('Token tidak ditemukan', 401);
        }
        $payload = (array) $this->authService->verifyToken($token);

        $isSupplier = (int) ($payload['group_id'] ?? 0) === self::SUPPLIER_GROUP_ID;

        if (!$isSupplier) {
            return null;
        }

        $code = $payload['supplier_code'] ?? null;

        if (empty($code)) {
            throw new \Exception('Supplier code tidak ditemukan pada akun ini', 403);
        }

        return $code;
    }
}