<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        <meta name="theme-color" content="#7c3aed">

        {{-- DNS prefetch for external resources --}}
        <link rel="dns-prefetch" href="//cdn.simpleicons.org">
        <link rel="dns-prefetch" href="//fonts.bunny.net">
        <link rel="preconnect" href="https://cdn.simpleicons.org" crossorigin>

        {{-- LCP image preload (profile avatar) --}}
        @php $avatar = \App\Models\Profile::first()?->avatar; @endphp
        @if($avatar)
            <link rel="preload" as="image" href="/{{ $avatar }}" fetchpriority="high">
            <link rel="icon" type="image/webp" href="/{{ $avatar }}">
            <link rel="apple-touch-icon" href="/{{ $avatar }}">
        @else
            <link rel="icon" type="image/x-icon" href="/favicon.ico">
        @endif

        {{-- Web App Manifest --}}
        <link rel="manifest" href="/site.webmanifest">

        {{-- Fonts with font-display:swap to prevent render blocking --}}
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap&font-display=swap" rel="stylesheet" media="print" onload="this.media='all'">
        <noscript><link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet"></noscript>

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
