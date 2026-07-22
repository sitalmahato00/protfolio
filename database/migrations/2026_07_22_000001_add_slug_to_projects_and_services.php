<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use App\Models\Project;
use App\Models\Service;

return new class extends Migration
{
    public function up(): void
    {
        // Add slug to projects
        Schema::table('projects', function (Blueprint $table) {
            $table->string('slug')->nullable()->unique()->after('title');
            $table->string('category')->nullable()->after('tags');
            $table->string('type')->nullable()->after('category'); // e.g. "Web Application"
            $table->text('seo_keywords')->nullable()->after('type');
        });

        // Add slug to services
        Schema::table('services', function (Blueprint $table) {
            $table->string('slug')->nullable()->unique()->after('title');
            $table->text('seo_keywords')->nullable()->after('features');
        });

        // Backfill slugs for existing projects
        foreach (Project::all() as $project) {
            $base = Str::slug($project->title);
            $slug = $base;
            $i = 1;
            while (Project::where('slug', $slug)->where('id', '!=', $project->id)->exists()) {
                $slug = $base . '-' . $i++;
            }
            $project->updateQuietly(['slug' => $slug]);
        }

        // Backfill slugs for existing services
        foreach (Service::all() as $service) {
            $base = Str::slug($service->title);
            $slug = $base;
            $i = 1;
            while (Service::where('slug', $slug)->where('id', '!=', $service->id)->exists()) {
                $slug = $base . '-' . $i++;
            }
            $service->updateQuietly(['slug' => $slug]);
        }
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['slug', 'category', 'type', 'seo_keywords']);
        });
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn(['slug', 'seo_keywords']);
        });
    }
};
