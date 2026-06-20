<?php

namespace App\Transformers;

class AuthTransform
{
    public static function login(array $user)
    {
        return [
            'user' => [
                'id' => $user['tb_user_id'],
                'username' => $user['username'],
                'fullname' => $user['fullname'],
                'email' => $user['email'],
                'group' => $user['user_group_nm'],
                'user_type' => $user['user_type']
            ]
        ];
    }
}