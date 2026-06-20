<?php

namespace App\Traits;

trait ApiResponseTrait
{
    protected function success(
        mixed $data = [],
        string $message = 'Success'
    ) {
        return response()->setJSON([
            'success' => true,
            'message' => $message,
            'data' => $data
        ]);
    }

    protected function error(
        string $message = 'Error',
        int $code = 400
    ) {
        return response()
            ->setStatusCode($code)
            ->setJSON([
                'success' => false,
                'message' => $message
            ]);
    }
}