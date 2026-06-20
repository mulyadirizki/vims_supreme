<?php

namespace App\Libraries;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtLibrary
{
    public static function generate(array $user)
    {
        $now = time();

        $payload = [
            'sub'          => $user['tb_user_id'],
            'username'     => $user['username'],
            'fullname'     => $user['fullname'],
            'group_id'     => $user['tb_group_user_id'],   // ← penting
            'supplier_code'=> $user['supplier_code'] ?? null, // ← penting
            'iat'          => time(),
            'exp'          => time() + (60 * 60 * 8), // 8 jam
        ];
        
        $key = getenv('JWT_SECRET');
        // return JWT::encode($payload, self::$key, 'HS256');
        return JWT::encode($payload, $key, 'HS256');
    }

    public static function decode(string $token)
    {
        $key = getenv('JWT_SECRET');
        return JWT::decode($token, new Key($key, 'HS256'));
    }
}