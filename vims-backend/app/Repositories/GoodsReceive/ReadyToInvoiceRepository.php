<?php

namespace App\Repositories\GoodsReceive;

use App\Models\GoodsReceive\GoodsReceiveModel;
use App\DTOs\GoodsReceive\ReadyToInvoiceFilterDto;
use App\Constants\GoodsReceiveInvoiceStatus;

class ReadyToInvoiceRepository
{
    protected GoodsReceiveModel $model;

    public function __construct()
    {
        $this->model = new GoodsReceiveModel();
    }

    public function getPaginated(ReadyToInvoiceFilterDto $filter): array
    {
        $builder = $this->model
            ->where('vims_invoice_status', GoodsReceiveInvoiceStatus::NOT_PROCESSED)
            ->where('cancel_status', null);

        if (!empty($filter->supplierCode)) {
            $builder->where('supplier_code', $filter->supplierCode);
        }

        if (!empty($filter->grNo)) {
            $builder->like('goods_receive_no', $filter->grNo);
        }

        if (!empty($filter->poNo)) {
            $builder->like('purchase_order_no', $filter->poNo);
        }

        if (!empty($filter->dateFrom)) {
            $builder->where('document_date >=', $filter->dateFrom);
        }

        if (!empty($filter->dateTo)) {
            $builder->where('document_date <=', $filter->dateTo);
        }

        $total = $builder->countAllResults(false);

        $data = $builder
            ->orderBy('document_date', 'ASC')
            ->findAll(
                $filter->perPage,
                ($filter->page - 1) * $filter->perPage
            );

        return [
            'data' => $data,
            'pagination' => [
                'page'      => $filter->page,
                'per_page'  => $filter->perPage,
                'total'     => $total,
                'last_page' => (int) ceil($total / $filter->perPage),
            ],
        ];
    }

    public function findByGrNo(string $grNo, ?string $supplierCode = null): ?array
    {
        $query = $this->model->where('goods_receive_no', $grNo);

        if (!empty($supplierCode)) {
            $query->where('supplier_code', $supplierCode);
        }

        return $query->first();
    }

    /**
     * Tandai GR sebagai sudah diproses jadi invoice_receipt.
     * Pakai transaction + lock untuk cegah double-submit (race condition
     * saat vendor klik "Proses" dua kali secara bersamaan).
     *
     * @throws \Exception jika GR tidak ditemukan atau sudah pernah diproses
     */
    public function markAsProcessed(string $grNo, string $invoiceReceiptNo, ?string $supplierCode = null): array
    {
        $db = \Config\Database::connect();

        // FOR UPDATE mengunci baris ini sampai transaction selesai,
        // sehingga request kedua yang datang bersamaan (misal vendor
        // klik "Proses" dua kali) harus menunggu transaction pertama
        // selesai dan akan melihat status yang sudah ter-update.
        $sql = 'SELECT * FROM goods_receive WHERE goods_receive_no = ?'
            . (!empty($supplierCode) ? ' AND supplier_code = ?' : '')
            . ' FOR UPDATE';

        $bindings = !empty($supplierCode) ? [$grNo, $supplierCode] : [$grNo];

        $gr = $db->query($sql, $bindings)->getRowArray();

        if (!$gr) {
            $db->transRollback();
            throw new \Exception('Goods receive tidak ditemukan', 404);
        }

        if ($gr['vims_invoice_status'] === GoodsReceiveInvoiceStatus::PROCESSED) {
            $db->transRollback();
            throw new \Exception('Goods receive ini sudah pernah diproses menjadi invoice', 409);
        }

        $db->table('goods_receive')
            ->where('id', $gr['id'])
            ->update([
                'vims_invoice_status' => GoodsReceiveInvoiceStatus::PROCESSED,
                'invoice_receipt_no'  => $invoiceReceiptNo,
            ]);

        if ($db->transStatus() === false) {
            throw new \Exception('Gagal memproses goods receive', 500);
        }

        return array_merge($gr, [
            'vims_invoice_status' => GoodsReceiveInvoiceStatus::PROCESSED,
            'invoice_receipt_no'  => $invoiceReceiptNo,
        ]);
    }
}