<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Certificate;
use Illuminate\Http\Request;

class CertificateController extends Controller
{
    public function index() { return response()->json(Certificate::where('is_active', true)->orderBy('order')->get()); }
    public function show(Certificate $certificate) { return response()->json($certificate); }
    public function store(Request $request) {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'issuer' => 'required|string|max:255',
            'issue_date' => 'nullable|date',
            'expiry_date' => 'nullable|date',
            'image' => 'nullable|string',
            'credential_url' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'order' => 'integer',
            'is_active' => 'boolean'
        ]);
        return response()->json(Certificate::create($validated), 201);
    }
    public function update(Request $request, Certificate $certificate) {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'issuer' => 'required|string|max:255',
            'issue_date' => 'nullable|date',
            'expiry_date' => 'nullable|date',
            'image' => 'nullable|string',
            'credential_url' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'order' => 'integer',
            'is_active' => 'boolean'
        ]);
        $certificate->update($validated);
        return response()->json($certificate);
    }
    public function destroy(Certificate $certificate) { $certificate->delete(); return response()->json(null, 204); }

    public function uploadImage(Request $request, Certificate $certificate)
    {
        $request->validate(['image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:10240']);
        $dir = public_path('images');
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        $file = $request->file('image');
        if (!$file->isValid()) {
            return response()->json(['error' => 'File upload failed: ' . $file->getErrorMessage()], 422);
        }
        $filename = uniqid('certificate_') . '.' . $file->getClientOriginalExtension();
        $file->move($dir, $filename);
        $path = 'images/' . $filename;
        $certificate->update(['image' => $path]);
        return response()->json(['image' => $path]);
    }
}
