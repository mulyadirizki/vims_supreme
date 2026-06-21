<?php

namespace App\Controllers\GoodsReceive;

use App\Controllers\BaseController;
use App\Services\GoodsReceive\GoodsReceiveService;

class GoodsReceiveController extends BaseController
{
    protected GoodsReceiveService $service;

    public function __construct()
    {
        $this->service = new GoodsReceiveService();
    }

    public function overview(string $grNo)
    {
        try {
            $result = $this->service->getOverview($grNo);

            return $this->response->setJSON([
                'status' => true,
                'message' => 'Success',
                'data' => $result
            ]);

        } catch (\Exception $e) {

            $code = in_array($e->getCode(), [404, 403]) ? $e->getCode() : 500;

            return $this->response
                ->setStatusCode($code)
                ->setJSON([
                    'status' => false,
                    'message' => $e->getMessage()
                ]);
        }
    }
}