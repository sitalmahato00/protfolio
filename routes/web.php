<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Portfolio');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return redirect()->route('admin.dashboard');
    })->name('dashboard');

    Route::get('/admin/dashboard', function () { return Inertia::render('Admin/Dashboard'); })->name('admin.dashboard');
    Route::get('/admin/projects', function () { return Inertia::render('Admin/Projects'); })->name('admin.projects');
    Route::get('/admin/skills', function () { return Inertia::render('Admin/Skills'); })->name('admin.skills');
    Route::get('/admin/services', function () { return Inertia::render('Admin/Services'); })->name('admin.services');
    Route::get('/admin/experiences', function () { return Inertia::render('Admin/Experiences'); })->name('admin.experiences');
    Route::get('/admin/messages', function () { return Inertia::render('Admin/Messages'); })->name('admin.messages');
    Route::get('/admin/profile', function () { return Inertia::render('Admin/ProfileSettings'); })->name('admin.profile');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
