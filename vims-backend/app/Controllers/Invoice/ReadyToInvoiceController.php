<?php

namespace App\Controllers\Invoice;

use App\Controllers\BaseController;
use App\Services\GoodsReceive\ReadyToInvoiceService;

class ReadyToInvoiceController extends BaseController
{
    protected ReadyToInvoiceService $service;

    public function __construct()
    {
        $this->service = new ReadyToInvoiceService();
    }

    public function index()
    {
        try {
            $payload = $this->request->getJSON(true) ?? [];

            $result = $this->service->getPaginated($payload);

            return $this->response->setJSON($result);

        } catch (\Exception $e) {
            $code = in_array($e->getCode(), [401, 403, 404]) ? $e->getCode() : 500;
            return $this->response->setStatusCode($code)->setJSON([
                'status'  => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    public function detail(string $grNo)
    {
        try {

            return $this->response->setJSON([
                'status' => true,
                'data' => $this->service->getDetail($grNo),
            ]);

        } catch (\Exception $e) {

            return $this->response
                ->setStatusCode($e->getCode() ?: 500)
                ->setJSON([
                    'status' => false,
                    'message' => $e->getMessage(),
                ]);
        }
    }
}