<?php

namespace App\Repositories;

use App\Models\UserModel;

class UserRepository
{
    public function __construct(
        protected UserModel $model = new UserModel()
    ) {}

    public function findByUsername(string $username)
    {
        return $this->model
            ->select("
                tb_user.*,
                tb_user_group.user_group_nm,
                tb_user_group.admin_fg,
                tb_user_type.user_type
            ")
            ->join(
                'tb_user_group',
                'tb_user_group.tb_user_group_id = tb_user.tb_group_user_id',
                'left'
            )
            ->join(
                'tb_user_type',
                'tb_user_type.id_tb_user_type = tb_user.tb_id_user_type',
                'left'
            )
            ->where('tb_user.username', $username)
            ->first();
    }

    public function findById(int $id)
    {
        return $this->model
            ->select("
                tb_user.*,
                tb_user_group.user_group_nm,
                tb_user_type.user_type
            ")
            ->join(
                'tb_user_group',
                'tb_user_group.tb_user_group_id = tb_user.tb_group_user_id',
                'left'
            )
            ->join(
                'tb_user_type',
                'tb_user_type.id_tb_user_type = tb_user.tb_id_user_type',
                'left'
            )
            ->where('tb_user.tb_user_id', $id)
            ->first();
    }
}