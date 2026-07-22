<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Traits\HasSeoAttributes;

class Project extends Model
{
    use HasSeoAttributes;

    protected $fillable = [
        'title', 'slug', 'description', 'image', 'images',
        'tags', 'category', 'type', 'seo_keywords',
        'live_url', 'github_url', 'order',
    ];

    protected $casts = [
        'tags'   => 'array',
        'images' => 'array',
    ];

    // ─── Route model binding by slug (fallback to id) ──────────────────────
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Resolve route binding by slug first, then by id (backward compat).
     */
    public function resolveRouteBinding($value, $field = null): ?self
    {
        return static::where('slug', $value)->first()
            ?? static::where('id', $value)->first();
    }

    // ─── Auto slug + keywords on save ─────────────────────────────────────
    protected static function booted(): void
    {
        static::creating(function (self $project) {
            if (empty($project->slug)) {
                $project->slug = static::generateUniqueSlug($project->title);
            }
            if (empty($project->seo_keywords)) {
                $project->seo_keywords = $project->getSeoKeywordsString();
            }
        });

        static::updating(function (self $project) {
            // Re-slug only if title changed and slug was not manually set
            if ($project->isDirty('title') && !$project->isDirty('slug')) {
                $project->slug = static::generateUniqueSlug($project->title, $project->id);
            }
            // Regenerate keywords when relevant fields change
            if ($project->isDirty(['title', 'description', 'tags', 'category', 'type'])) {
                $project->seo_keywords = $project->getSeoKeywordsString();
            }
        });
    }

    // ─── Helpers ───────────────────────────────────────────────────────────

    public function getUrlAttribute(): string
    {
        return 'https://sital.info.np/projects/' . ($this->slug ?? $this->id);
    }

    public function getOgImageAttribute(): ?string
    {
        $img = $this->image ?? ($this->images[0] ?? null);
        if (!$img) return null;
        if (str_starts_with($img, 'http')) return $img;
        return 'https://sital.info.np/' . ltrim($img, '/');
    }
}
