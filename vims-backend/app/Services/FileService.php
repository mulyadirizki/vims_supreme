<?php

namespace App\Services;

class FileService
{
    protected string $basePath;

    public function __construct()
    {
        $this->basePath = WRITEPATH . 'uploads/';
    }

    public function getPreviewUrl(?string $relativePath): ?string
    {
        if (empty($relativePath)) {
            return null;
        }

        return base_url('api/file/preview/' . $relativePath);
    }

    public function getAbsolutePath(?string $relativePath): ?string
    {
        if (empty($relativePath)) {
            return null;
        }

        return $this->basePath . $relativePath;
    }

    public function exists(?string $relativePath): bool
    {
        if (empty($relativePath)) {
            return false;
        }

        return file_exists($this->getAbsolutePath($relativePath));
    }
}