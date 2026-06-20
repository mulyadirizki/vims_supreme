<?php

namespace App\Services\PurchaseOrder;

use App\Repositories\PurchaseOrder\PurchaseOrderRepository;
use App\DTOs\PurchaseOrder\PurchaseOrderFilterDto;
use App\Transformers\PurchaseOrder\PurchaseOrderTransformer;
use App\Services\AuthService;

class PurchaseOrderService
{
    const SUPPLIER_GROUP_ID = 10;

    public function __construct(
        protected PurchaseOrderRepository $repository = new PurchaseOrderRepository(),
        protected AuthService $authService = new AuthService()
    ) {}

    public function getPaginated(array $request): array
    {
        $request['supplier_code'] = $this->resolveSupplierCode();

        $filter = new PurchaseOrderFilterDto($request);
        $result = $this->repository->getPaginated($filter);

        $result['data'] = PurchaseOrderTransformer::collection($result['data']);

        return $result;
    }

    public function getDetail(string $poNo): ?array
    {
        $supplierCode = $this->resolveSupplierCode();

        $result = $this->repository->findDetail($poNo, $supplierCode);

        if (!$result) {
            return null;
        }

        return PurchaseOrderTransformer::transformDetail(
            $result['header'],
            $result['items']
        );
    }

    private function resolveSupplierCode(): ?string
    {
        $token = service('request')->getCookie('auth_token');

        if (empty($token)) {
            throw new \Exception('Token tidak ditemukan', 401);
        }
        $payload = $this->authService->verifyToken($token);
        $payload = (array) $payload;

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