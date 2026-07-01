<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Profile;
use App\Models\Skill;
use App\Models\Project;
use App\Models\Service;
use App\Models\Experience;

Route::get('/', function () {
    $profile = Profile::first();
    return Inertia::render('Portfolio', [
        'profile'          => $profile,
        'skills'           => Skill::orderBy('order')->get()->groupBy('category'),
        'projects'         => Project::orderBy('order')->get(),
        'services'         => Service::orderBy('order')->get(),
        'experiences'      => Experience::orderBy('order')->get(),
        'stats'            => [
            'projects_delivered' => Project::count() ?: 50,
            'tech_stack'         => Skill::distinct('name')->count() ?: 8,
            'years_exp'          => 3,
            'client_satisfaction'=> '100%',
            'support'            => '24/7',
        ],
    ]);
})->name('home');

Route::get('/project/{project}', function (Project $project) {
    $profile = Profile::first();
    return Inertia::render('Portfolio/ProjectShow', [
        'project' => $project,
        'profile' => $profile,
    ]);
})->name('project.show');

Route::get('/projects', function () {
    $profile = Profile::first();
    return Inertia::render('Portfolio/ProjectsIndex', [
        'projects' => Project::orderBy('order')->get(),
        'profile'  => $profile,
    ]);
})->name('projects.index');

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
