<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;
class SkillController extends Controller
{
    public function index() { return response()->json(Skill::orderBy('order')->get()); }
    public function store(Request $request) { return response()->json(Skill::create($request->all()), 201); }
    public function update(Request $request, Skill $skill) { $skill->update($request->all()); return response()->json($skill); }
    public function destroy(Skill $skill) { $skill->delete(); return response()->json(null, 204); }
    public function categories()
    {
        $skills = Skill::orderBy('order')->get()->groupBy('category');
        return response()->json($skills);
    }

    public function uploadIcon(Request $request, Skill $skill)
    {
        $request->validate(['icon' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120']);
        $dir = public_path('images');
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        $file = $request->file('icon');
        if (!$file->isValid()) {
            return response()->json(['error' => 'File upload failed: ' . $file->getErrorMessage()], 422);
        }
        $filename = uniqid('skill_icon_') . '.' . $file->getClientOriginalExtension();
        $file->move($dir, $filename);
        $path = 'images/' . $filename;
        $skill->update(['icon' => $path]);
        return response()->json(['icon' => $path]);
    }
}
