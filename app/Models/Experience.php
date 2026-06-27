<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Experience extends Model
{
    protected $fillable = ['type', 'title', 'subtitle', 'date_range', 'description', 'tags', 'order'];
    protected $casts = ['tags' => 'array'];
}
