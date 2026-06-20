<?php

namespace App\Repositories;

use Config\Database;

class MenuRepository
{
    protected $db;

    public function __construct()
    {
        $this->db = Database::connect();
    }

    public function getSidebarByGroup(int $groupId)
    {
        return $this->db->query("
            SELECT
                m.ta_menu_id,
                m.menu_nm,
                m.menu_logo,
                m.menu_seq,

                sm.ta_submenu_id,
                sm.submenu_nm,
                sm.submenu_logo,
                sm.submenu_seq

            FROM tb_autho_group ag

            JOIN ta_submenu sm
                ON sm.ta_submenu_id = ag.ta_submenu_id

            JOIN ta_menu m
                ON m.ta_menu_id = sm.ta_menu_id

            WHERE ag.tb_user_group_id = ?
            AND ag.view_access = '1'
            AND ag.status_aktif = '0'

            ORDER BY m.menu_seq, sm.submenu_seq
        ", [$groupId])->getResultArray();
    }
}