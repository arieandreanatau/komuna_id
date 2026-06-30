<?php

use Illuminate\Http\Request;

require __DIR__ . '/../vendor/autoload.php';

$storagePaths = [
    storage_path('framework/cache/data'),
    storage_path('framework/sessions'),
    storage_path('framework/views'),
    storage_path('logs'),
];

foreach ($storagePaths as $path) {
    if (!is_dir($path)) {
        @mkdir($path, 0755, true);
    }
}

$app = require_once __DIR__ . '/../bootstrap/app.php';

$app->handleRequest(Request::capture());
