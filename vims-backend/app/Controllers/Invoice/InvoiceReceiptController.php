<?php

namespace App\Controllers\Invoice;

use App\Controllers\BaseController;
use App\Services\Invoice\InvoiceReceiptService;
use App\DTOs\Invoice\StoreInvoiceReceiptDto;

class InvoiceReceiptController extends BaseController
{
    protected InvoiceReceiptService $service;

    public function __construct()
    {
        $this->service = new InvoiceReceiptService();
    }

    public function submit()
    {
        try {
            $dto = new StoreInvoiceReceiptDto($this->request->getPost());

            $files = $this->request->getFiles();
            $documentFiles = $files['documents'] ?? []; // associative by type, lihat catatan FE di bawah

            $username = 'SYSTEM'; // TODO: ganti session user kalau auth sudah jalan

            $result = $this->service->submit($dto, $documentFiles, $username);

            return $this->response->setJSON([
                'status' => true,
                'message' => 'Invoice berhasil disimpan',
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode($e->getCode() ?: 500)
                ->setJSON(['status' => false, 'message' => $e->getMessage()]);
        }
    }
}