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
        $request->validate(['avatar' => 'required|image|mimes:jpeg,png,jpg,webp|max:10240']);
        $profile = Profile::firstOrCreate([]);
        $file = $request->file('avatar');
        $dir = public_path('images');
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        if (!$file->isValid()) {
            return response()->json(['error' => 'File upload failed: ' . $file->getErrorMessage()], 422);
        }
        $filename = uniqid('avatar_') . '.' . $file->getClientOriginalExtension();
        $file->move($dir, $filename);
        $profile->update(['avatar' => 'images/' . $filename]);
        return response()->json(['avatar' => 'images/' . $filename]);
    }

    public function storeResume(Request $request)
    {
        $request->validate(['resume' => 'required|file|mimes:pdf|max:5120']);
        $profile = Profile::firstOrCreate([]);
        $file = $request->file('resume');
        $dir = public_path('images');
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        if (!$file->isValid()) {
            return response()->json(['error' => 'File upload failed: ' . $file->getErrorMessage()], 422);
        }
        $filename = uniqid('resume_') . '.pdf';
        $file->move($dir, $filename);
        $profile->update(['resume' => 'images/' . $filename]);
        return response()->json(['resume' => 'images/' . $filename]);
    }
}
