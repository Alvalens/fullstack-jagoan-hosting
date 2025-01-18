<?php

use App\Http\Controllers\AssignPenghuni;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PenghuniController;
use App\Http\Controllers\RumahController;
use App\Http\Controllers\PembayaranController;
use App\Http\Controllers\SearchController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('penghunis', PenghuniController::class);
    Route::apiResource('rumahs', RumahController::class);
    Route::get('/assign-penghuni/{id}', [AssignPenghuni::class, 'index']);
    Route::post('/assign-penghuni', [AssignPenghuni::class, 'store']);
    Route::get('/search-penghuni', [SearchController::class, 'searchPenghuni']);
    Route::apiResource('history-penghunis', SearchController::class);
    Route::apiResource('pembayarans', PembayaranController::class);
});

Route::post('/login', [AuthController::class, 'login']);
