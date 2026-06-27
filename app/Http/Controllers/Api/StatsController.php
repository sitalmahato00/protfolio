<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Skill;

class StatsController extends Controller
{
    public function index()
    {
        return response()->json([
            'projects_delivered' => Project::count() ?: 50,
            'tech_stack'         => Skill::distinct('name')->count() ?: 8,
            'years_exp'          => 3,
            'client_satisfaction'=> '100%',
            'support'            => '24/7',
        ]);
    }
}
