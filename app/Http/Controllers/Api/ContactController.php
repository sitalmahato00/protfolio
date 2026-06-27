<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Mail\ContactMessageMail;
use App\Models\Contact;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function index() { return response()->json(Contact::latest()->get()); }

    public function store(Request $request)
    {
        $data = $request->validate(['name' => 'required', 'email' => 'required|email', 'subject' => 'nullable', 'message' => 'required']);
        $contact = Contact::create($data);

        $profile = Profile::first();
        if ($profile && $profile->email) {
            Mail::to($profile->email)->send(new ContactMessageMail($contact));
        }

        return response()->json($contact, 201);
    }

    public function destroy(Contact $contact) { $contact->delete(); return response()->json(null, 204); }

    public function markRead(Contact $contact) { $contact->update(['is_read' => true]); return response()->json($contact); }
}
