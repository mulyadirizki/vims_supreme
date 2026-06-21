<?php

namespace App\Services\Invoice;

use App\Traits\UploadTrait;
use App\Repositories\Invoice\ReadyToPayRepository;
use App\Transformers\Invoice\InvoiceOnProcessTransformer;
use App\DTOs\Invoice\ReadyToPayFilterDto;
use App\Services\AuthService;
use App\Repositories\Invoice\InvoiceReceiptRepository;
use App\DTOs\Invoice\ProcessPaymentDto;
use App\Constants\InvoiceReceiptStatus;
use App\Models\InvoiceReceipt\InvoiceReceiptAttachmentModel;

class ReadyToPayService
{
    const SUPPLIER_GROUP_ID = 10;

    use UploadTrait;

    protected string $uploadFolder = 'invoice-receipt';

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

    public function processPayment(
        ProcessPaymentDto $dto,
        ?\CodeIgniter\HTTP\Files\UploadedFile $proofFile,
        string $username
    ): array {
        $db = db_connect();
        $db->transBegin();

        try {
            $invoiceRepo = new InvoiceReceiptRepository();
            $attachmentModel = new InvoiceReceiptAttachmentModel();

            $invoice = $invoiceRepo->findByNoForUpdate($dto->invoiceReceiptNo); // FOR UPDATE
            if (!$invoice) {
                throw new \Exception('Invoice tidak ditemukan', 404);
            }

            if ($invoice['status'] !== InvoiceReceiptStatus::APPROVED) {
                throw new \Exception('Invoice belum berstatus APPROVED', 422);
            }

            if (!empty($invoice['payment_date'])) {
                throw new \Exception('Invoice sudah diproses pembayarannya', 422);
            }

            if (!$proofFile || !$proofFile->isValid()) {
                throw new \Exception('Bukti bayar wajib diupload', 422);
            }

            $originalName = $proofFile->getClientName();
            $mimeType = $proofFile->getMimeType();
            $size = $proofFile->getSize();
            $path = $this->uploadFile($proofFile, $this->uploadFolder);

            $attachmentModel->insert([
                'invoice_receipt_no' => $dto->invoiceReceiptNo,
                'document_type' => 'PAYMENT_PROOF',
                'file_name' => $originalName,
                'file_path' => $path,
                'file_size' => $size,
                'mime_type' => $mimeType,
                'uploaded_by' => $username,
            ]);

            $invoiceRepo->updateStatus($dto->invoiceReceiptNo, [
                'status' => InvoiceReceiptStatus::PAID,
                'payment_date' => $dto->paymentDate,
                'paid_by' => $username,
                'remark' => $dto->remark,
            ]);

            $db->transCommit();
            return ['invoiceReceiptNo' => $dto->invoiceReceiptNo];

        } catch (\Throwable $e) {
            $db->transRollback();
            throw $e;
        }
    }
}