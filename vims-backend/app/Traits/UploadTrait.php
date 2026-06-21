<?php

namespace App\Traits;

use CodeIgniter\HTTP\Files\UploadedFile;

trait UploadTrait
{
    /**
     * Upload a single file to writable/uploads/{folder}
     *
     * @param  UploadedFile  $file
     * @param  string        $folder   Sub-folder inside writable/uploads/
     * @param  string|null   $oldFile  Relative path of old file to delete (e.g. "family/old.jpg")
     * @return string        Relative path stored in DB, e.g. "family/filename.jpg"
     * @throws \RuntimeException on upload failure
     */
    protected function uploadFile(UploadedFile $file, string $folder = 'family', ?string $oldFile = null): string
    {
        if (!$file->isValid()) {
            throw new \RuntimeException('File tidak valid: ' . $file->getErrorString());
        }

        $uploadPath = WRITEPATH . 'uploads/' . $folder;

        if (!is_dir($uploadPath)) {
            mkdir($uploadPath, 0755, true);
        }

        // Hapus file lama jika ada
        if ($oldFile) {
            $this->deleteFile($oldFile);
        }

        $newName = $file->getRandomName();
        $file->move($uploadPath, $newName);

        return $folder . '/' . $newName;
    }

    /**
     * Delete file dari writable/uploads/
     *
     * @param  string $relativePath  e.g. "family/filename.jpg"
     */
    protected function deleteFile(string $relativePath): void
    {
        $fullPath = WRITEPATH . 'uploads/' . $relativePath;
        if (is_file($fullPath)) {
            unlink($fullPath);
        }
    }

    /**
     * Upload multiple files sekaligus
     *
     * @param  array<string, UploadedFile>  $files    ['field_name' => UploadedFile]
     * @param  string                        $folder
     * @param  array<string, string|null>    $oldFiles ['field_name' => 'old/path.jpg']
     * @return array<string, string>                   ['field_name' => 'folder/new.jpg']
     */
    protected function uploadFiles(array $files, string $folder = 'family', array $oldFiles = []): array
    {
        $result = [];
        foreach ($files as $field => $file) {
            if ($file instanceof UploadedFile && $file->isValid() && !$file->hasMoved()) {
                $result[$field] = $this->uploadFile($file, $folder, $oldFiles[$field] ?? null);
            }
        }
        return $result;
    }
}