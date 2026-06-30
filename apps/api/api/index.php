<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

require __DIR__ . '/../vendor/autoload.php';

$tmpStorage = '/tmp/storage';
foreach ([$tmpStorage, $tmpStorage.'/framework/cache/data', $tmpStorage.'/framework/sessions', $tmpStorage.'/framework/views', $tmpStorage.'/logs'] as $dir) {
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
}

putenv("VIEW_COMPILED_PATH=$tmpStorage/framework/views");

$app = require_once __DIR__ . '/../bootstrap/app.php';

$app->useStoragePath($tmpStorage);

$app->handleRequest(Request::capture());
