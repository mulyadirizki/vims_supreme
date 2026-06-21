<?php

namespace App\Controllers\Invoice;

use App\Controllers\BaseController;
use App\Services\Invoice\ReadyToPayService;

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
}