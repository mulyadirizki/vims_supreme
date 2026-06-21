<?php

namespace App\Services\Invoice;

use App\Repositories\Invoice\InvoiceOnProcessRepository;
use App\Repositories\Invoice\InvoiceReceiptAttachmentRepository;
use App\Transformers\Invoice\InvoiceOnProcessTransformer;
use App\Transformers\Invoice\InvoiceReceiptAttachmentTransformer;
use App\DTOs\Invoice\InvoiceOnProcessFilterDto;
use App\DTOs\Invoice\InvoiceUpdateDto;
use App\DTOs\Invoice\InvoiceRejectDto;
use App\Constants\UserGroup;
use App\Constants\InvoiceReceiptStatus;
use App\Services\AuthService;

class InvoiceOnProcessService
{
    const SUPPLIER_GROUP_ID = 10;
    public function __construct(
        protected AuthService $authService = new AuthService()
    ) {}

    public function list(array $filter): array
    {
        $filter['supplier_code'] = $this->resolveSupplierCode();

        $repo = new InvoiceOnProcessRepository();
        $dto = new InvoiceOnProcessFilterDto($filter);
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

    public function detail(string $invoiceReceiptNo): array
    {
        $repo = new InvoiceOnProcessRepository();
        $attachmentRepo = new InvoiceReceiptAttachmentRepository();

        $invoice = $repo->findByInvoiceReceiptNo($invoiceReceiptNo);

        if (!$invoice) {
            throw new \Exception('Invoice receipt tidak ditemukan', 404);
        }

        $attachments = $attachmentRepo->findByInvoiceReceiptNo($invoiceReceiptNo);

        return [
            'invoice' => InvoiceOnProcessTransformer::transform($invoice),
            'attachments' => array_map(
                fn ($row) => InvoiceReceiptAttachmentTransformer::transform($row),
                $attachments
            ),
        ];
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

    public function update(string $invoiceReceiptNo, array $request): array
    {
        $supplierCode = $this->resolveSupplierCode();

        if (empty($supplierCode)) {
            throw new \Exception('Hanya supplier yang dapat mengedit invoice ini', 403);
        }

        $repo = new InvoiceOnProcessRepository();
        $dto = new InvoiceUpdateDto($request);

        $repo->updateBySupplier($invoiceReceiptNo, $supplierCode, $dto);

        return $this->detail($invoiceReceiptNo);
    }

    public function approve(string $invoiceReceiptNo): array
    {
        $this->assertCanApprove();

        $repo = new InvoiceOnProcessRepository();
        $repo->updateStatus($invoiceReceiptNo, InvoiceReceiptStatus::APPROVED, $this->currentUsername());

        return $this->detail($invoiceReceiptNo);
    }

    public function reject(string $invoiceReceiptNo, array $request): array
    {
        $this->assertCanApprove();

        $dto = new InvoiceRejectDto($request);

        if (empty($dto->rejectReason)) {
            throw new \Exception('Alasan penolakan wajib diisi', 422);
        }

        $repo = new InvoiceOnProcessRepository();
        $repo->updateStatus($invoiceReceiptNo, InvoiceReceiptStatus::REJECTED, $this->currentUsername(), $dto->rejectReason);

        return $this->detail($invoiceReceiptNo);
    }

    private function assertCanApprove(): void
    {
        $payload = $this->decodedToken();
        $groupId = (int) ($payload['group_id'] ?? 0);

        if (!in_array($groupId, UserGroup::APPROVER_GROUPS, true)) {
            throw new \Exception('Anda tidak memiliki akses untuk approve/reject invoice ini', 403);
        }
    }

    private function currentUsername(): string
    {
        $payload = $this->decodedToken();
        return $payload['username'] ?? 'system';
    }

    private function decodedToken(): array
    {
        $token = service('request')->getCookie('auth_token');

        if (empty($token)) {
            throw new \Exception('Token tidak ditemukan', 401);
        }

        return (array) $this->authService->verifyToken($token);
    }
}