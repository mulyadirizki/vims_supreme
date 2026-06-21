<?php

namespace App\Constants;

class GoodsReceiveInvoiceStatus
{
    const NOT_PROCESSED = 'not_processed';
    const PROCESSED     = 'processed';

    public static function label(string $status): string
    {
        return match ($status) {
            self::NOT_PROCESSED => 'Ready To Invoice',
            self::PROCESSED      => 'Sudah Diproses',
            default               => 'Unknown',
        };
    }
}