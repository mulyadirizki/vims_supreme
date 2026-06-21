<?php

namespace App\Services\Invoice;

use App\Traits\UploadTrait;
use App\Constants\InvoiceReceiptStatus;
use App\Models\InvoiceReceipt\InvoiceReceiptAttachmentModel;
use App\Repositories\Invoice\InvoiceReceiptRepository;
use App\Repositories\GoodsReceive\ReadyToInvoiceRepository;
use App\DTOs\Invoice\StoreInvoiceReceiptDto;
use App\DTOs\Invoice\ProcessPaymentDto;

class InvoiceReceiptService
{
    use UploadTrait;

    protected string $uploadFolder = 'invoice-receipt';

    public function submit(
        StoreInvoiceReceiptDto $dto,
        array $documentFiles, // associative: ['INVOICE' => UploadedFile, 'FAKTUR_PAJAK' => UploadedFile, ...]
        string $username
    ): array {

        $db = db_connect();
        $db->transBegin();

        try {
            $grRepo = new ReadyToInvoiceRepository();
            $invoiceRepo = new InvoiceReceiptRepository();
            $attachmentModel = new InvoiceReceiptAttachmentModel();

            $gr = $grRepo->findByGrNo($dto->grNo);
            if (!$gr) {
                throw new \Exception('Goods Receive tidak ditemukan', 404);
            }

            $prefix = 'INV-' . date('Y') . '-';
            $sequence = $invoiceRepo->getNextSequence($prefix);
            $invoiceReceiptNo = $prefix . str_pad((string) $sequence, 4, '0', STR_PAD_LEFT);

            $invoiceRepo->create([
                'purchase_order_no' => $gr['purchase_order_no'],
                'goods_receive_no' => $gr['goods_receive_no'],
                'invoice_receipt_no' => $invoiceReceiptNo,
                'company_code' => $gr['company_code'],
                'store_code' => $gr['store_code'],
                'supplier_code' => $gr['supplier_code'],
                'supplier_name' => $gr['supplier_name'],
                'department' => $gr['department'],
                'total_quantity' => $gr['total_quantity'],
                'total_amount' => $gr['total_amount'],
                'vat_amount' => $gr['vat_amount'],
                'grand_total' => $gr['grand_total'],

                'no_invoice_supplier' => $dto->invoiceSupplierNo,
                'no_faktur_pajak' => $dto->fakturPajakNo,
                'tgl_faktur_pajak' => $dto->tglFakturPajak,
                'no_surat_jalan' => $dto->suratJalanNo,
                'remark' => $dto->remark,

                'status' => InvoiceReceiptStatus::ON_PROCESS,
                'user_confirm' => $username,
                'confirm_date' => date('Y-m-d H:i:s'),
            ]);

            foreach ($documentFiles as $type => $file) {
                if (!$file || !$file->isValid()) {
                    continue;
                }

                // ambil metadata SEBELUM move(), karena setelah dipindah,
                // getMimeType() gagal baca file dari lokasi temp asli
                $originalName = $file->getClientName();
                $mimeType = $file->getMimeType();
                $size = $file->getSize();

                $path = $this->uploadFile($file, $this->uploadFolder); // ini yang move()

                $attachmentModel->insert([
                    'invoice_receipt_no' => $invoiceReceiptNo,
                    'document_type' => $type,
                    'file_name' => $originalName,
                    'file_path' => $path,
                    'file_size' => $size,
                    'mime_type' => $mimeType,
                    'uploaded_by' => $username,
                ]);
            }

            $grRepo->markAsProcessed(
                $gr['goods_receive_no'],
                $invoiceReceiptNo,
                $gr['supplier_code']
            );

            $db->transCommit();

            return ['invoiceReceiptNo' => $invoiceReceiptNo];

        } catch (\Throwable $e) {
            $db->transRollback();
            throw $e;
        }
    }

}