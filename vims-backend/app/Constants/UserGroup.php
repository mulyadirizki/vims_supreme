<?php

namespace App\Constants;

class UserGroup
{
    public const SYS_ADMIN  = 1;
    public const FINANCE_A  = 3;
    public const FINANCE_B  = 8;
    public const MANAGEMENT = 9;
    public const SUPPLIER   = 10;

    public const APPROVER_GROUPS = [
        self::SYS_ADMIN,
        self::FINANCE_A,
        self::FINANCE_B,
        self::MANAGEMENT,
    ];
}