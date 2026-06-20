<?php

namespace App\Constants;

class PurchaseOrderStatus
{
    public static function label(?string $status): string
    {
        return match ($status) {
            null, '' => 'New',
            '11' => 'On Process',
            '12' => 'Confirmed', // TODO: confirm arti sebenarnya
            '13' => 'Cancelled',
            '14' => 'History / Paid',
            default => 'Unknown',
        };
    }

    public static function group(?string $status): string
    {
        return match ($status) {
            null, '', '11', '12' => 'on_process',
            '13', '14' => 'history',
            default => 'unknown',
        };
    }

    public static function codesForGroup(string $group): array
    {
        return match ($group) {
            'on_process' => [null, '', '11', '12'],
            'history' => ['13', '14'],
            default => [],
        };
    }
}