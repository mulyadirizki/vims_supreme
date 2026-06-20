<?php

namespace App\Services;

use App\Repositories\UserRepository;
use App\DTOs\LoginDto;
use App\Libraries\JwtLibrary;

class AuthService
{
    public function __construct(
        protected UserRepository $userRepo = new UserRepository()
    ) {}

    public function login(LoginDto $dto)
    {
        $user = $this->userRepo->findByUsername($dto->username);

        if (!$user) {
            throw new \Exception('User tidak ditemukan');
        }

        $inputHash = md5(trim($dto->password));

        if ($user['password'] !== $inputHash) {
            throw new \Exception('Password salah');
        }

        $token = JwtLibrary::generate($user);

        return [
            'user' => $user,
            'token' => $token
        ];
    }

    public function verifyToken(string $token)
    {
        return JwtLibrary::decode($token);
    }

    public function getUserById(int $id)
    {
        return $this->userRepo->findById($id);
    }
}