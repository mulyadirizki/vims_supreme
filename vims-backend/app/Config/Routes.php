<?php

use CodeIgniter\Router\RouteCollection;

use App\Controllers\AuthController;
use App\Controllers\FileController;
use App\Controllers\PurchaseOrder\PurchaseOrderController;
use App\Controllers\GoodsReceive\GoodsReceiveController;
use App\Controllers\Invoice\ReadyToInvoiceController;
use App\Controllers\Invoice\InvoiceReceiptController;
use App\Controllers\Invoice\InvoiceOnProcessController;
use App\Controllers\Invoice\ReadyToPayController;
use App\Controllers\Invoice\InvoiceHistoryController;

/** @var RouteCollection $routes */
$routes->get('/', 'Home::index');

$routes->addPlaceholder('filepath', '.+');
$routes->group('api', function ($routes) {

    $routes->group('auth', function ($routes) {

        $routes->post('login', [AuthController::class, 'login']);
        $routes->get('me', [AuthController::class, 'me']);
        $routes->post('logout', [AuthController::class, 'logout']);
    });

    
    $routes->group('', ['filter' => 'auth'], function($routes) {
    
        $routes->get('file/preview/(:filepath)', [FileController::class, 'previewByPath/$1']);
    });

    $routes->group('purchase-orders', ['filter' => 'auth'], function ($routes) {

        $routes->post('list', [PurchaseOrderController::class, 'index']);
        $routes->get('detail/(:segment)', [PurchaseOrderController::class, 'show']);
    });

    $routes->group('invoices', ['filter' => 'auth'], function ($routes) {
        $routes->post('ready-to-invoice/list', [ReadyToInvoiceController::class, 'index']);
        $routes->get('ready-to-invoice/detail/(:segment)', [ReadyToInvoiceController::class, 'detail/$1']);
        $routes->post('ready-to-invoice/submit', [InvoiceReceiptController::class, 'submit']);
        

        $routes->post('on-process/list', [InvoiceOnProcessController::class, 'index']);
        $routes->get('on-process/detail/(:segment)', [InvoiceOnProcessController::class, 'detail/$1']);
        $routes->put('on-process/update/(:segment)', [InvoiceOnProcessController::class, 'update/$1']);
        $routes->post('on-process/approve/(:segment)', [InvoiceOnProcessController::class, 'approve/$1']);
        $routes->post('on-process/reject/(:segment)', [InvoiceOnProcessController::class, 'reject/$1']);

        $routes->post('ready-to-pay/list', [ReadyToPayController::class, 'index']);
        $routes->post('ready-to-pay/process', [ReadyToPayController::class, 'processPayment']);

        $routes->post('history/list', [InvoiceHistoryController::class, 'index']);
    });

    $routes->group('goods-receive', ['filter' => 'auth'], function ($routes) {

        $routes->get('overview/(:segment)', [GoodsReceiveController::class, 'overview/$1']);
    });
});