<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Project extends Model
{
    protected $fillable = ['title', 'description', 'image', 'images', 'tags', 'live_url', 'github_url', 'order'];
    protected $casts = ['tags' => 'array', 'images' => 'array'];
}
