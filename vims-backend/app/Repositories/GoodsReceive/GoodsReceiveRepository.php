<?php

namespace App\Repositories\GoodsReceive;

use App\Models\GoodsReceive\GoodsReceiveModel;

class GoodsReceiveRepository
{
    protected GoodsReceiveModel $model;

    public function __construct()
    {
        $this->model = new GoodsReceiveModel();
    }

    public function findByGrNo(string $grNo): ?array
    {
        return $this->model
            ->where('goods_receive_no', $grNo)
            ->first();
    }
}