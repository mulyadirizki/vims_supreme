<?php

namespace App\Controllers\Invoice;

use App\Controllers\BaseController;
use App\Services\Invoice\InvoiceOnProcessService;

class InvoiceOnProcessController extends BaseController
{
    protected InvoiceOnProcessService $service;

    public function __construct()
    {
        $this->service = new InvoiceOnProcessService();
    }

    public function index()
    {
        try {
            $payload = $this->request->getJSON(true) ?? [];

            return $this->response->setJSON(
                $this->service->list($payload)
            );
        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode($e->getCode() ?: 500)
                ->setJSON(['status' => false, 'message' => $e->getMessage()]);
        }
    }
    

    public function detail(string $invoiceReceiptNo)
    {
        try {
            return $this->response->setJSON([
                'status' => true,
                'data' => $this->service->detail($invoiceReceiptNo),
            ]);
        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode($e->getCode() ?: 500)
                ->setJSON(['status' => false, 'message' => $e->getMessage()]);
        }
    }

    public function update(string $invoiceReceiptNo)
    {
        try {
            $payload = $this->request->getJSON(true) ?? [];

            return $this->response->setJSON([
                'status' => true,
                'data' => $this->service->update($invoiceReceiptNo, $payload),
            ]);
        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode($e->getCode() ?: 500)
                ->setJSON(['status' => false, 'message' => $e->getMessage()]);
        }
    }

    public function approve(string $invoiceReceiptNo)
    {
        try {
            return $this->response->setJSON([
                'status' => true,
                'data' => $this->service->approve($invoiceReceiptNo),
            ]);
        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode($e->getCode() ?: 500)
                ->setJSON(['status' => false, 'message' => $e->getMessage()]);
        }
    }

    public function reject(string $invoiceReceiptNo)
    {
        try {
            $payload = $this->request->getJSON(true) ?? [];

            return $this->response->setJSON([
                'status' => true,
                'data' => $this->service->reject($invoiceReceiptNo, $payload),
            ]);
        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode($e->getCode() ?: 500)
                ->setJSON(['status' => false, 'message' => $e->getMessage()]);
        }
    }
}