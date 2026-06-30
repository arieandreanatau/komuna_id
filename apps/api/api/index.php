<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

require __DIR__ . '/../vendor/autoload.php';

$storagePaths = [
    __DIR__ . '/../storage/framework/cache/data',
    __DIR__ . '/../storage/framework/sessions',
    __DIR__ . '/../storage/framework/views',
    __DIR__ . '/../storage/logs',
];

foreach ($storagePaths as $path) {
    if (!is_dir($path)) {
        @mkdir($path, 0755, true);
    }
}

$app = require_once __DIR__ . '/../bootstrap/app.php';

$app->handleRequest(Request::capture());
