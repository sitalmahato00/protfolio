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
}
