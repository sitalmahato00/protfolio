<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Experience;
use Illuminate\Http\Request;
class ExperienceController extends Controller
{
    public function index() { return response()->json(Experience::orderBy('order')->get()); }
    public function store(Request $request) { return response()->json(Experience::create($request->all()), 201); }
    public function update(Request $request, Experience $experience) { $experience->update($request->all()); return response()->json($experience); }
    public function destroy(Experience $experience) { $experience->delete(); return response()->json(null, 204); }
}
