<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasSeoAttributes;

class Certificate extends Model
{
    use HasSeoAttributes;

    protected $fillable = [
        'title',
        'issuer',
        'issue_date',
        'expiry_date',
        'image',
        'credential_url',
        'description',
        'order',
        'is_active',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'expiry_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function getUrlAttribute(): string
    {
        return 'https://sital.info.np/certificates/' . $this->id;
    }

    public function getOgImageAttribute(): ?string
    {
        if (!$this->image) return null;
        if (str_starts_with($this->image, 'http')) return $this->image;
        return 'https://sital.info.np/' . ltrim($this->image, '/');
    }
}
