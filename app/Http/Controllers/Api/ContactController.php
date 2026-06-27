<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
class ContactController extends Controller
{
    public function index() { return response()->json(Contact::latest()->get()); }
    public function store(Request $request)
    {
        $data = $request->validate(['name' => 'required', 'email' => 'required|email', 'subject' => 'nullable', 'message' => 'required']);
        return response()->json(Contact::create($data), 201);
    }
    public function destroy(Contact $contact) { $contact->delete(); return response()->json(null, 204); }
    public function markRead(Contact $contact) { $contact->update(['is_read' => true]); return response()->json($contact); }
}
