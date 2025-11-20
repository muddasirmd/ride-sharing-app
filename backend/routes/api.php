<?php

use App\Http\Controllers\LoginController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Models\Driver;
use App\Models\Trip;

Route::post('/login', [LoginController::class, 'submit']);
Route::post('login/verify', [LoginController::class, 'verify']);
