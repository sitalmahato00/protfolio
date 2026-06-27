<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Service extends Model
{
    protected $fillable = ['title', 'description', 'icon', 'features', 'is_popular', 'order'];
    protected $casts = ['features' => 'array', 'is_popular' => 'boolean'];
}
