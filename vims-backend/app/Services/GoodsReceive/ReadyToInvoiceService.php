<?php

namespace App\Services\GoodsReceive;

use App\Repositories\GoodsReceive\ReadyToInvoiceRepository;
use App\DTOs\GoodsReceive\ReadyToInvoiceFilterDto;
use App\Transformers\GoodsReceive\ReadyToInvoiceTransformer;
use App\Services\AuthService;
use App\Models\InvoiceReceipt\InvoiceReceiptModel;

class ReadyToInvoiceService
{
    const SUPPLIER_GROUP_ID = 10;

    public function __construct(
        protected ReadyToInvoiceRepository $repository = new ReadyToInvoiceRepository(),
        protected AuthService $authService = new AuthService()
    ) {}

    public function getPaginated(array $request): array
    {
        $request['supplier_code'] = $this->resolveSupplierCode();

        $filter = new ReadyToInvoiceFilterDto($request);
        $result = $this->repository->getPaginated($filter);

        $result['data'] = ReadyToInvoiceTransformer::collection($result['data']);

        return $result;
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

    public function getDetail(string $grNo): array
    {
        $supplierCode = $this->resolveSupplierCode();

        $gr = $this->repository->findByGrNo(
            $grNo,
            $supplierCode
        );

        if (!$gr) {
            throw new \Exception(
                'Goods receive tidak ditemukan',
                404
            );
        }

        return ReadyToInvoiceTransformer::detail($gr);
    }
}