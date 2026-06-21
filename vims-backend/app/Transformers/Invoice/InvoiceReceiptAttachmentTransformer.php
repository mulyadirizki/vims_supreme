<?php
// app/Transformers/Invoice/InvoiceReceiptAttachmentTransformer.php
namespace App\Transformers\Invoice;

class InvoiceReceiptAttachmentTransformer
{
    public static function transform(array $row): array
    {
        return [
            'id' => $row['id'],
            'documentType' => $row['document_type'],
            'fileName' => $row['file_name'],
            'filePath' => $row['file_path'],
            'fileSize' => (int) $row['file_size'],
            'mimeType' => $row['mime_type'],
        ];
    }
}