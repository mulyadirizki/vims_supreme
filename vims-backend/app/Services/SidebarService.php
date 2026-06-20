<?php

namespace App\Services;

use App\Repositories\MenuRepository;

class SidebarService
{
    public function __construct(
        protected MenuRepository $menuRepo = new MenuRepository()
    ) {}

    public function getSidebar(int $groupId): array
    {
        $rows = $this->menuRepo->getSidebarByGroup($groupId);

        $menu = [];

        foreach ($rows as $row) {
            $menuId = $row['ta_menu_id'];

            if (!isset($menu[$menuId])) {
                $menu[$menuId] = [
                    'id' => $row['ta_menu_id'],
                    'name' => $row['menu_nm'],
                    'logo' => $row['menu_logo'],
                    'submenus' => []
                ];
            }

            $menu[$menuId]['submenus'][] = [
                'id' => $row['ta_submenu_id'],
                'name' => $row['submenu_nm'],
                'logo' => $row['submenu_logo']
            ];
        }

        return array_values($menu);
    }
}