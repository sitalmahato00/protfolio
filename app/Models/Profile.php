<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Profile extends Model
{
    protected $fillable = ['name', 'title', 'bio', 'email', 'phone', 'location', 'avatar', 'resume', 'github', 'linkedin', 'availability', 'typewriter_words'];
    protected $casts = ['typewriter_words' => 'array'];
}
