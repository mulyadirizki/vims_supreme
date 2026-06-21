<?php

namespace App\Constants;

class InvoiceReceiptStatus
{
    public const ON_PROCESS = 'ON_PROCESS';
    public const VERIFIED   = 'VERIFIED';
    public const APPROVED   = 'APPROVED';
    public const REJECTED   = 'REJECTED';
    public const PAID       = 'PAID';

    public const LABELS = [
        self::ON_PROCESS => 'On Process',
        self::VERIFIED   => 'Terverifikasi',
        self::APPROVED   => 'Disetujui',
        self::REJECTED   => 'Ditolak',
        self::PAID       => 'Paid',
    ];
}