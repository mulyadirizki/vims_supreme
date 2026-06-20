<?php

namespace App\Controllers;

use App\Traits\ApiResponseTrait;
use App\DTOs\LoginDto;
use App\Services\SidebarService;
use App\Services\AuthService;
use App\Transformers\AuthTransform;

class AuthController extends BaseController
{
    use ApiResponseTrait;

    protected AuthService $authService;
    protected SidebarService $sidebarService;

    public function __construct()
    {
        $this->authService = new AuthService();
        $this->sidebarService = new SidebarService();
    }

    public function login()
    {
        try {
            $dto = new LoginDto($this->request->getJSON(true));
            $result = $this->authService->login($dto);

            $token = $result['token'];

            setcookie('auth_token', $token, [
                'expires'  => time() + 60 * 60 * 24,
                'path'     => '/',
                'secure'   => false,
                'httponly' => true,
                'samesite' => 'Lax'
            ]);

            return $this->success(
                null,
                'Login berhasil'
            );

        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 401);
        }
    }

    public function me()
    {
        try {
            $token = $_COOKIE['auth_token'] ?? null;

            if (!$token) {
                return $this->error('Unauthorized', 401);
            }

            $payload = $this->authService->verifyToken($token);

            $userId = (int) $payload->sub;
            $groupId = (int) $payload->group_id;

            $user = $this->authService->getUserById($userId);

            if (!$user) {
                return $this->error('User not found', 404);
            }

            $sidebar = $this->sidebarService->getSidebar($groupId);

            return $this->success([
                'user' => AuthTransform::login($user)['user'],
                'sidebar' => $sidebar
            ], 'OK');

        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 401);
        }
    }

    public function logout()
    {
        $this->response->setCookie([
            'name'     => 'auth_token',
            'value'    => '',
            'expire'   => time() - 3600,
            'path'     => '/',
            'httponly' => true,
            'secure'   => false, // true jika production HTTPS
            'samesite' => 'Lax',
        ]);

        return $this->success(null, 'Logout berhasil');
    }
}