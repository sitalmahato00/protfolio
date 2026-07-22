<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Traits\HasSeoAttributes;

class Service extends Model
{
    use HasSeoAttributes;

    protected $fillable = [
        'title', 'slug', 'description', 'icon', 'features',
        'seo_keywords', 'is_popular', 'order',
    ];

    protected $casts = [
        'features'    => 'array',
        'is_popular'  => 'boolean',
    ];

    // ─── Route model binding by slug (fallback to id) ──────────────────────
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function resolveRouteBinding($value, $field = null): ?self
    {
        return static::where('slug', $value)->first()
            ?? static::where('id', $value)->first();
    }

    // ─── Auto slug + keywords on save ─────────────────────────────────────
    protected static function booted(): void
    {
        static::creating(function (self $service) {
            if (empty($service->slug)) {
                $service->slug = static::generateUniqueSlug($service->title);
            }
            if (empty($service->seo_keywords)) {
                $service->seo_keywords = $service->getSeoKeywordsString();
            }
        });

        static::updating(function (self $service) {
            if ($service->isDirty('title') && !$service->isDirty('slug')) {
                $service->slug = static::generateUniqueSlug($service->title, $service->id);
            }
            if ($service->isDirty(['title', 'description', 'features'])) {
                $service->seo_keywords = $service->getSeoKeywordsString();
            }
        });
    }

    // ─── Helpers ───────────────────────────────────────────────────────────

    public function getUrlAttribute(): string
    {
        return 'https://sital.info.np/services/' . ($this->slug ?? $this->id);
    }
}
