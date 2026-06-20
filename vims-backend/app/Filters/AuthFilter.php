<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use App\Services\AuthService;

class AuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $token = $_COOKIE['auth_token'] ?? null;

        if (!$token) {
            return service('response')->setJSON(['message' => 'Unauthorized'])->setStatusCode(401);
        }

        try {
            $authService = new AuthService();
            $payload = $authService->verifyToken($token);
            $user = $authService->getUserById((int) $payload->sub);

            if (!$user) {
                return service('response')->setJSON(['message' => 'User not found'])->setStatusCode(401);
            }

            // Simpan ke request supaya bisa diakses controller
            $request->currentUser = $user;

        } catch (\Throwable $e) {
            return service('response')->setJSON(['message' => 'Unauthorized'])->setStatusCode(401);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null) {}
}