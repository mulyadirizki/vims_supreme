<?php

namespace App\Controllers\Invoice;

use App\Controllers\BaseController;
use App\Services\Invoice\ReadyToPayService;
use App\DTOs\Invoice\ProcessPaymentDto;

class ReadyToPayController extends BaseController
{
    protected ReadyToPayService $service;

    public function __construct()
    {
        $this->service = new ReadyToPayService();
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

    public function processPayment()
    {
        try {
            $dto = new ProcessPaymentDto($this->request->getPost());
            $proofFile = $this->request->getFile('payment_proof');
            $username = 'SYSTEM'; // TODO: ganti session user

            $result = $this->service->processPayment($dto, $proofFile, $username);

            return $this->response->setJSON([
                'status' => true,
                'message' => 'Pembayaran berhasil diproses',
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode($e->getCode() ?: 500)
                ->setJSON(['status' => false, 'message' => $e->getMessage()]);
        }
    }
}