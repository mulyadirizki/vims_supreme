<?php

namespace App\Controllers\PurchaseOrder;

use App\Controllers\BaseController;
use App\Services\PurchaseOrder\PurchaseOrderService;

class PurchaseOrderController extends BaseController
{
    protected PurchaseOrderService $service;

    public function __construct()
    {
        $this->service = new PurchaseOrderService();
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

    public function show(string $poNo)
    {
        try {
            $result = $this->service->getDetail($poNo);

            if (!$result) {
                return $this->response->setStatusCode(404)->setJSON([
                    'message' => 'Purchase order not found',
                ]);
            }

            return $this->response->setJSON(['data' => $result]);

        } catch (\Exception $e) {
            $code = in_array($e->getCode(), [401, 403, 404]) ? $e->getCode() : 500;
            return $this->response->setStatusCode($code)->setJSON([
                'status'  => false,
                'message' => $e->getMessage(),
            ]);
        }
    }
}