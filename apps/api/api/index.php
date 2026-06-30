<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

require __DIR__ . '/../vendor/autoload.php';

$tmpStorage = '/tmp/storage';
$dirs = [
    $tmpStorage,
    $tmpStorage . '/framework/cache/data',
    $tmpStorage . '/framework/sessions',
    $tmpStorage . '/framework/views',
    $tmpStorage . '/logs',
];

foreach ($dirs as $dir) {
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
}

putenv('VIEW_COMPILED_PATH=' . $tmpStorage . '/framework/views');
putenv('SESSION_DRIVER=array');
putenv('CACHE_STORE=array');
putenv('LOG_CHANNEL=stderr');

$app = require_once __DIR__ . '/../bootstrap/app.php';

$app->useStoragePath($tmpStorage);

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle($request = Request::capture());
$response->send();
$kernel->terminate($request, $response);
