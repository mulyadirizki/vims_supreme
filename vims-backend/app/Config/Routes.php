<?php

use CodeIgniter\Router\RouteCollection;

use App\Controllers\AuthController;
use App\Controllers\PurchaseOrder\PurchaseOrderController;

/** @var RouteCollection $routes */
$routes->get('/', 'Home::index');

$routes->group('api', function ($routes) {
    $routes->post('auth/login', [AuthController::class, 'login']);

    $routes->group('auth', function ($routes) {

        // login
        $routes->post('login', [AuthController::class, 'login']);
        $routes->get('me', [AuthController::class, 'me']);
        $routes->post('logout', [AuthController::class, 'logout']);
    });

    $routes->group('purchase-orders', ['filter' => 'auth'], function ($routes) {
        $routes->post('list', [PurchaseOrderController::class, 'index']);
        $routes->get('detail/(:segment)', [PurchaseOrderController::class, 'show']);
    });
});

