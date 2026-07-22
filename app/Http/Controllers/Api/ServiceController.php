<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index()
    {
        return response()->json(Service::orderBy('order')->get());
    }

    public function store(Request $request)
    {
        $data = $request->all();

        if (empty($data['slug']) && !empty($data['title'])) {
            $data['slug'] = Service::generateUniqueSlug($data['title']);
        }

        return response()->json(Service::create($data), 201);
    }

    public function update(Request $request, Service $service)
    {
        $data = $request->all();

        if (!empty($data['title']) && $data['title'] !== $service->title && empty($data['slug'])) {
            $data['slug'] = Service::generateUniqueSlug($data['title'], $service->id);
        }

        $service->update($data);
        return response()->json($service->fresh());
    }

    public function destroy(Service $service)
    {
        $service->delete();
        return response()->json(null, 204);
    }

    public function uploadIcon(Request $request, Service $service)
    {
        $request->validate(['icon' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120']);

        $dir = public_path('images');
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $file = $request->file('icon');
        if (!$file->isValid()) {
            return response()->json(['error' => 'File upload failed: ' . $file->getErrorMessage()], 422);
        }

        $filename = uniqid('service_icon_') . '.' . $file->getClientOriginalExtension();
        $file->move($dir, $filename);
        $path = 'images/' . $filename;
        $service->update(['icon' => $path]);

        return response()->json(['icon' => $path]);
    }
}
