<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Profile;
use App\Models\Skill;
use App\Models\Project;
use App\Models\Service;
use App\Models\Experience;
use App\Models\Certificate;

// Temporary: clear compiled views on server — remove after use
Route::get('/clear-views', function () {
    \Illuminate\Support\Facades\Artisan::call('view:clear');
    \Illuminate\Support\Facades\Artisan::call('cache:clear');
    return 'Views and cache cleared.';
});

// Dynamic web app manifest — uses current profile avatar so Google SERP favicon stays up-to-date
Route::get('/site.webmanifest', function () {
    $profile  = Profile::first();
    $avatar   = $profile?->avatar ? '/' . $profile->avatar : '/images/image.webp';
    $name     = $profile?->name   ?? 'Sital Mahato';
    $manifest = [
        'name'             => $name . ' — Full Stack Developer',
        'short_name'       => $name,
        'description'      => 'Full Stack Developer. Laravel, React, PHP. Based in Nepal.',
        'start_url'        => '/',
        'display'          => 'standalone',
        'background_color' => '#0f172a',
        'theme_color'      => '#2563eb',
        'icons'            => [
            ['src' => $avatar, 'sizes' => '192x192', 'type' => 'image/webp', 'purpose' => 'any maskable'],
            ['src' => $avatar, 'sizes' => '512x512', 'type' => 'image/webp', 'purpose' => 'any maskable'],
        ],
    ];
    return response()->json($manifest)
        ->header('Content-Type', 'application/manifest+json')
        ->header('Cache-Control', 'public, max-age=3600');
})->name('webmanifest');

Route::get('/', function () {
    $profile = Profile::first();
    return Inertia::render('Portfolio', [
        'profile'          => $profile,
        'skills'           => Skill::orderBy('order')->get()->groupBy('category'),
        'projects'         => Project::orderBy('order')->get(),
        'services'         => Service::orderBy('order')->get(),
        'experiences'      => Experience::orderBy('order')->get(),
        'certificates'     => Certificate::where('is_active', true)->orderBy('order')->get(),
        'stats'            => [
            'projects_delivered' => Project::count() ?: 50,
            'tech_stack'         => Skill::distinct('name')->count() ?: 8,
            'years_exp'          => 3,
            'client_satisfaction'=> '100%',
            'support'            => '24/7',
        ],
    ]);
})->name('home');

Route::get('/projects/{project:slug}', function (Project $project) {
    $profile = Profile::first();
    return Inertia::render('Portfolio/ProjectShow', [
        'project' => $project->load([]), // Eager load if needed
        'profile' => $profile,
        'relatedProjects' => Project::where('id', '!=', $project->id)
            ->when($project->category, fn($q, $cat) => $q->where('category', $cat))
            ->orderBy('order')
            ->limit(3)
            ->get(),
    ]);
})->name('project.show');

// Legacy redirect: support old /project/{id} URLs
Route::get('/project/{id}', function ($id) {
    $project = Project::findOrFail($id);
    return redirect()->route('project.show', ['project' => $project->slug], 301);
});

Route::get('/projects', function () {
    $profile = Profile::first();
    return Inertia::render('Portfolio/ProjectsIndex', [
        'projects' => Project::orderBy('order')->get(),
        'profile'  => $profile,
    ]);
})->name('projects.index');

Route::get('/certificates', function () {
    $profile = Profile::first();
    return Inertia::render('Portfolio/CertificatesIndex', [
        'certificates' => Certificate::where('is_active', true)->orderBy('order')->get(),
        'profile'      => $profile,
    ]);
})->name('certificates.index');

Route::get('/certificate/{certificate}', function (Certificate $certificate) {
    $profile = Profile::first();
    return Inertia::render('Portfolio/CertificateShow', [
        'certificate' => $certificate,
        'profile'     => $profile,
        'otherCertificates' => Certificate::where('is_active', true)
            ->where('id', '!=', $certificate->id)
            ->orderBy('order')
            ->limit(3)
            ->get(),
    ]);
})->name('certificate.show');

// ─── Services (slug-based) ─────────────────────────────────────────────────
Route::get('/services', function () {
    $profile = Profile::first();
    return Inertia::render('Portfolio/ServicesIndex', [
        'services' => Service::orderBy('order')->get(),
        'profile'  => $profile,
    ]);
})->name('services.index');

Route::get('/services/{service:slug}', function (Service $service) {
    $profile = Profile::first();
    return Inertia::render('Portfolio/ServiceShow', [
        'service'         => $service,
        'profile'         => $profile,
        'relatedServices' => Service::where('id', '!=', $service->id)
            ->orderBy('order')
            ->limit(3)
            ->get(),
    ]);
})->name('service.show');

Route::get('/sitemap.xml', function () {
    $projects     = Project::orderBy('order')->get();
    $services     = Service::orderBy('order')->get();
    $certificates = Certificate::where('is_active', true)->orderBy('order')->get();
    $today = now()->toDateString();
    return response()->view('sitemap', compact('projects', 'services', 'certificates', 'today'), 200)
        ->header('Content-Type', 'application/xml');
})->name('sitemap');

Route::get('/robots.txt', function () {
    return response(
        "User-agent: *\n" .
        "Allow: /\n" .
        "Disallow: /admin/\n" .
        "Disallow: /dashboard\n" .
        "Disallow: /profile\n" .
        "Disallow: /api/\n\n" .
        "Sitemap: https://sital.info.np/sitemap.xml\n",
        200
    )->header('Content-Type', 'text/plain');
})->name('robots');

Route::get('/privacy', function () {
    return Inertia::render('Privacy');
})->name('privacy');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return redirect()->route('admin.dashboard');
    })->name('dashboard');

    Route::get('/admin/dashboard', function () { return Inertia::render('Admin/Dashboard'); })->name('admin.dashboard');
    Route::get('/admin/projects', function () { return Inertia::render('Admin/Projects'); })->name('admin.projects');
    Route::get('/admin/skills', function () { return Inertia::render('Admin/Skills'); })->name('admin.skills');
    Route::get('/admin/services', function () { return Inertia::render('Admin/Services'); })->name('admin.services');
    Route::get('/admin/experiences', function () { return Inertia::render('Admin/Experiences'); })->name('admin.experiences');
    Route::get('/admin/certificates', function () { return Inertia::render('Admin/Certificates'); })->name('admin.certificates');
    Route::get('/admin/messages', function () { return Inertia::render('Admin/Messages'); })->name('admin.messages');
    Route::get('/admin/profile', function () { return Inertia::render('Admin/ProfileSettings'); })->name('admin.profile');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
