<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function index()
    {
        $profile = Profile::first();
        if (!$profile) return response()->json(['message' => 'No profile found'], 404);
        return response()->json($profile);
    }

    public function update(Request $request)
    {
        $profile = Profile::firstOrCreate([]);
        $data = $request->all();
        if (isset($data['typewriter_words']) && is_string($data['typewriter_words'])) {
            $data['typewriter_words'] = array_filter(array_map('trim', explode("\n", $data['typewriter_words'])));
        }
        $profile->update($data);
        return response()->json($profile);
    }

    public function storeAvatar(Request $request)
    {
        $request->validate(['avatar' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048']);
        $profile = Profile::firstOrCreate([]);
        $file = $request->file('avatar');
        $filename = uniqid('avatar_') . '.' . $file->getClientOriginalExtension();
        $file->move(public_path('images'), $filename);
        $profile->update(['avatar' => 'images/' . $filename]);
        return response()->json(['avatar' => 'images/' . $filename]);
    }

    public function storeResume(Request $request)
    {
        $request->validate(['resume' => 'required|file|mimes:pdf|max:5120']);
        $profile = Profile::firstOrCreate([]);
        $file = $request->file('resume');
        $filename = uniqid('resume_') . '.pdf';
        $file->move(public_path('images'), $filename);
        $profile->update(['resume' => 'images/' . $filename]);
        return response()->json(['resume' => 'images/' . $filename]);
    }
}
