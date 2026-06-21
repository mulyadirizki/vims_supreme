<?php

namespace App\Transformers\Invoice;

use App\Services\FileService;

class InvoiceReceiptAttachmentTransformer
{
    public static function transform(array $row): array
    {
        $fileService = new FileService();

        return [
            'id' => $row['id'],
            'documentType' => $row['document_type'],
            'fileName' => $row['file_name'],
            'filePath' => $fileService->getPreviewUrl($row['file_path']),
            'fileSize' => (int) $row['file_size'],
            'mimeType' => $row['mime_type'],
        ];
    }
}