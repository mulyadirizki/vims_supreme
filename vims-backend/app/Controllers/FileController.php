<?php

namespace App\Controllers;

use App\Controllers\BaseController;

class FileController extends BaseController
{
    public function previewByPath($path = null)
    {
        $uri    = uri_string();
        $prefix = 'api/file/preview/';
        $path   = urldecode(substr($uri, strlen($prefix)));

        $realBase = realpath(WRITEPATH . 'uploads');
        $fullPath  = realpath($realBase . DIRECTORY_SEPARATOR . $path);

        if (!$fullPath || !str_starts_with($fullPath, $realBase) || is_dir($fullPath)) {
            return $this->response
                ->setStatusCode(404)
                ->setHeader('Content-Type', 'text/html')
                ->setBody(view('errors/html/file_not_found', ['path' => $path]));
        }

        return $this->response
            ->setHeader('Content-Type', mime_content_type($fullPath))
            ->setHeader('Content-Disposition', 'inline; filename="' . basename($fullPath) . '"')
            ->setBody(file_get_contents($fullPath));
    }
}