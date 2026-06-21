<?php

namespace App\Controllers\Invoice;

use App\Controllers\BaseController;
use App\Services\Invoice\InvoiceHistoryService;

class InvoiceHistoryController extends BaseController
{
    protected InvoiceHistoryService $service;

    public function __construct()
    {
        $this->service = new InvoiceHistoryService();
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