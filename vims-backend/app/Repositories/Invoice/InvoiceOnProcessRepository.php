<?php

namespace App\Repositories\Invoice;

use App\Models\InvoiceReceipt\InvoiceReceiptModel;
use App\Constants\InvoiceReceiptStatus;
use App\DTOs\Invoice\InvoiceOnProcessFilterDto;
use App\DTOs\Invoice\InvoiceUpdateDto;

class InvoiceOnProcessRepository
{
    protected InvoiceReceiptModel $model;

    public function __construct()
    {
        $this->model = new InvoiceReceiptModel();
    }

    public function paginate(InvoiceOnProcessFilterDto $filter): array
    {
        $builder = $this->model->where('status', InvoiceReceiptStatus::ON_PROCESS);

        if (!empty($filter->supplierCode)) {
            $builder->where('supplier_code', $filter->supplierCode);
        }
        if (!empty($filter->grNo)) {
            $builder->like('goods_receive_no', $filter->grNo);
        }
        if (!empty($filter->poNo)) {
            $builder->like('purchase_order_no', $filter->poNo);
        }
        if (!empty($filter->invoiceReceiptNo)) {
            $builder->like('invoice_receipt_no', $filter->invoiceReceiptNo);
        }

        $total = $builder->countAllResults(false);

        $rows = $builder->orderBy('id', 'DESC')->paginate($filter->perPage, 'default', $filter->page);

        return [
            'rows' => $rows,
            'total' => $total,
            'page' => $filter->page,
            'per_page' => $filter->perPage,
            'last_page' => (int) ceil($total / max($filter->perPage, 1)),
        ];
    }

    public function findByInvoiceReceiptNo(string $invoiceReceiptNo): ?array
    {
        return $this->model->where('invoice_receipt_no', $invoiceReceiptNo)->first();
    }

    public function updateBySupplier(string $invoiceReceiptNo, string $supplierCode, InvoiceUpdateDto $dto): bool
    {
        $db = \Config\Database::connect();
        $db->transStart();

        $row = $db->query(
            'SELECT * FROM invoice_receipt WHERE invoice_receipt_no = ? AND supplier_code = ? FOR UPDATE',
            [$invoiceReceiptNo, $supplierCode]
        )->getRowArray();

        if (!$row) {
            $db->transComplete();
            throw new \Exception('Invoice receipt tidak ditemukan atau bukan milik supplier ini', 404);
        }

        if ($row['status'] !== InvoiceReceiptStatus::ON_PROCESS) {
            $db->transComplete();
            throw new \Exception('Invoice tidak bisa diedit karena status sudah ' . $row['status'], 422);
        }

        $updateData = array_filter([
            'no_invoice_supplier' => $dto->noInvoiceSupplier,
            'no_faktur_pajak'     => $dto->noFakturPajak,
            'tgl_faktur_pajak'    => $dto->tglFakturPajak,
            'no_surat_jalan'      => $dto->noSuratJalan,
            'remark'              => $dto->remark,
        ], fn ($v) => $v !== null);

        $this->model->where('invoice_receipt_no', $invoiceReceiptNo)->set($updateData)->update();

        $db->transComplete();

        return $db->transStatus();
    }

    public function updateStatus(string $invoiceReceiptNo, string $newStatus, string $userConfirm, ?string $rejectReason = null): bool
    {
        $db = \Config\Database::connect();
        $db->transStart();

        $row = $db->query(
            'SELECT * FROM invoice_receipt WHERE invoice_receipt_no = ? FOR UPDATE',
            [$invoiceReceiptNo]
        )->getRowArray();

        if (!$row) {
            $db->transComplete();
            throw new \Exception('Invoice receipt tidak ditemukan', 404);
        }

        if (!in_array($row['status'], [InvoiceReceiptStatus::ON_PROCESS, InvoiceReceiptStatus::VERIFIED], true)) {
            $db->transComplete();
            throw new \Exception('Invoice tidak bisa diproses karena status sudah ' . $row['status'], 422);
        }

        $updateData = [
            'status'       => $newStatus,
            'user_confirm' => $userConfirm,
            'confirm_date' => date('Y-m-d H:i:s'),
        ];

        if ($newStatus === InvoiceReceiptStatus::REJECTED) {
            $updateData['reject_reason'] = $rejectReason;
            $updateData['reject_date']   = date('Y-m-d H:i:s');
        }

        $this->model->where('invoice_receipt_no', $invoiceReceiptNo)->set($updateData)->update();

        $db->transComplete();

        return $db->transStatus();
    }
}