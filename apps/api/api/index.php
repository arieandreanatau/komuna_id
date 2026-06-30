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

$app = require_once __DIR__ . '/../bootstrap/app.php';

$app->useStoragePath($tmpStorage);

$app->booted(function ($app) use ($tmpStorage) {
    $config = $app['config'];
    $config->set('view.compiled', $tmpStorage . '/framework/views');
    $config->set('session.path', $tmpStorage . '/framework/sessions');
    $config->set('cache.stores.file.path', $tmpStorage . '/framework/cache/data');
    $config->set('logging.channels.single.path', $tmpStorage . '/logs/laravel.log');
});

$app->handleRequest(Request::capture());
