<?php

namespace App\Http\Middleware;

use App\Models\Contact;
use App\Models\Profile;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'profile' => fn () => Profile::first(),
            'unreadCount' => fn () => Contact::where('is_read', false)->count(),
        ];
    }
}
