<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

require __DIR__ . '/../vendor/autoload.php';

$tmpStorage = '/tmp/storage';
$storageDir = __DIR__ . '/../storage';

if (!is_dir($tmpStorage)) {
    @mkdir($tmpStorage, 0755, true);
    @mkdir($tmpStorage . '/framework/cache/data', 0755, true);
    @mkdir($tmpStorage . '/framework/sessions', 0755, true);
    @mkdir($tmpStorage . '/framework/views', 0755, true);
    @mkdir($tmpStorage . '/logs', 0755, true);
}

$app = require_once __DIR__ . '/../bootstrap/app.php';

$app->bind('path.storage', fn () => $tmpStorage);

$app->handleRequest(Request::capture());
