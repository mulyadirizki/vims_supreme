<?php

namespace App\Validators;

class AuthValidator
{
    public static function login()
    {
        return [
            'username' => 'required',
            'password' => 'required'
        ];
    }
}