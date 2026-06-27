<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
class ProjectController extends Controller
{
    public function index() { return response()->json(Project::orderBy('order')->get()); }
    public function store(Request $request) { return response()->json(Project::create($request->all()), 201); }
    public function update(Request $request, Project $project) { $project->update($request->all()); return response()->json($project); }
    public function destroy(Project $project) { $project->delete(); return response()->json(null, 204); }
}
