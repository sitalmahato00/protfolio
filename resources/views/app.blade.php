<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        {{-- Theme colour (browser UI / mobile) --}}
        <meta name="theme-color" content="#2563eb">

        {{-- Default favicon — Inertia Head will override with the avatar on the portfolio page --}}
        @php $avatar = \App\Models\Profile::first()?->avatar; @endphp
        @if($avatar)
            <link rel="icon"            type="image/webp" href="/{{ $avatar }}">
            <link rel="apple-touch-icon"                  href="/{{ $avatar }}">
        @else
            <link rel="icon" type="image/x-icon" href="/favicon.ico">
        @endif

        {{-- Web App Manifest --}}
        <link rel="manifest" href="/site.webmanifest">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
