<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index() { return response()->json(Project::orderBy('order')->get()); }
    public function show(Project $project) { return response()->json($project); }
    public function store(Request $request) { return response()->json(Project::create($request->all()), 201); }
    public function update(Request $request, Project $project) { $project->update($request->all()); return response()->json($project); }
    public function destroy(Project $project) { $project->delete(); return response()->json(null, 204); }

    public function uploadImages(Request $request, Project $project)
    {
        $request->validate(['images' => 'required|array', 'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:10240']);
        $dir = public_path('images');
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        $paths = $project->images ?? [];
        foreach ($request->file('images') as $file) {
            if (!$file->isValid()) {
                return response()->json(['error' => 'File upload failed: ' . $file->getErrorMessage()], 422);
            }
            $filename = uniqid('project_') . '.' . $file->getClientOriginalExtension();
            $file->move($dir, $filename);
            $paths[] = 'images/' . $filename;
        }
        $project->update(['images' => $paths, 'image' => $paths[0] ?? $project->image]);
        return response()->json(['images' => $paths]);
    }

    public function deleteImage(Request $request, Project $project)
    {
        $request->validate(['image' => 'required|string']);
        $paths = collect($project->images ?? [])->filter(fn($p) => $p !== $request->image)->values()->toArray();
        $project->update(['images' => $paths, 'image' => $paths[0] ?? $project->image]);
        return response()->json(['images' => $paths]);
    }
}
