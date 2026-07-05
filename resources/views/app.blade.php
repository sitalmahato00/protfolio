<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        @php
            $profile  = \App\Models\Profile::first();
            $name     = $profile?->name     ?? 'Sital Mahato';
            $title    = $profile?->title    ?? 'Full Stack Developer';
            $defaultBio = $name . ' is a Full Stack Developer based in Nepal, specialising in Laravel, React, PHP, and modern web technologies. Available for freelance projects worldwide.';
            $bio      = $profile?->bio      ?? $defaultBio;
            $email    = $profile?->email    ?? 'sitalmahato077@gmail.com';
            $phone    = $profile?->phone    ?? '+977 9704191610';
            $location = $profile?->location ?? 'Golbazar, Siraha, Nepal';
            $github   = $profile?->github   ?? 'https://github.com/sitalmahato00';
            $linkedin = $profile?->linkedin ?? 'https://linkedin.com/in/sitalmahato';
            $avatar   = $profile?->avatar;
            $siteUrl  = 'https://sital.info.np';
            $avatarUrl = $avatar ? $siteUrl . '/' . $avatar : $siteUrl . '/images/image.webp';
            $ogImage   = $avatarUrl;
            $seoTitle = $name . ' | ' . $title . ' in Nepal — Laravel, React & PHP Expert';
            $seoDesc  = mb_substr(strip_tags($bio), 0, 158);
            $keywords = $name . ', Full Stack Developer Nepal, Laravel Developer Nepal, React Developer Nepal, PHP Developer, Web Developer Nepal, Freelance Developer Nepal, ' . $name . ' portfolio';
        @endphp

        {{-- Primary SEO --}}
        <title inertia>{{ $seoTitle }}</title>
        <meta name="description"           content="{{ $seoDesc }}">
        <meta name="keywords"              content="{{ $keywords }}">
        <meta name="author"                content="{{ $name }}">
        <meta name="robots"                content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
        <meta name="revisit-after"         content="7 days">
        <meta name="language"              content="English">
        <meta name="rating"                content="general">
        <link  rel="canonical"             href="{{ $siteUrl }}">

        {{-- Geographic / Local SEO --}}
        <meta name="geo.region"            content="NP-P2">
        <meta name="geo.placename"         content="{{ $location }}">
        <meta name="geo.position"          content="26.8467;87.2718">
        <meta name="ICBM"                  content="26.8467, 87.2718">
        <meta name="DC.title"              content="{{ $seoTitle }}">
        <meta name="DC.creator"            content="{{ $name }}">
        <meta name="DC.subject"            content="Full Stack Web Development, Nepal">

        {{-- Open Graph --}}
        <meta property="og:type"           content="website">
        <meta property="og:url"            content="{{ $siteUrl }}">
        <meta property="og:site_name"      content="{{ $name }}">
        <meta property="og:title"          content="{{ $seoTitle }}">
        <meta property="og:description"    content="{{ $seoDesc }}">
        <meta property="og:image"          content="{{ $ogImage }}">
        <meta property="og:image:secure_url" content="{{ $ogImage }}">
        <meta property="og:image:width"    content="1200">
        <meta property="og:image:height"   content="630">
        <meta property="og:image:alt"      content="{{ $name }} — {{ $title }}">
        <meta property="og:image:type"     content="image/webp">
        <meta property="og:locale"         content="en_US">
        <meta property="og:email"          content="{{ $email }}">
        <meta property="og:phone_number"   content="{{ $phone }}">

        {{-- Twitter Card --}}
        <meta name="twitter:card"          content="summary_large_image">
        <meta name="twitter:site"          content="@sitalmahato">
        <meta name="twitter:creator"       content="@sitalmahato">
        <meta name="twitter:title"         content="{{ $seoTitle }}">
        <meta name="twitter:description"   content="{{ $seoDesc }}">
        <meta name="twitter:image"         content="{{ $ogImage }}">
        <meta name="twitter:image:alt"     content="{{ $name }} — {{ $title }}">

        {{-- Theme / PWA --}}
        <meta name="theme-color"           content="#7c3aed">
        <meta name="mobile-web-app-capable"          content="yes">
        <meta name="apple-mobile-web-app-capable"    content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="apple-mobile-web-app-title"      content="{{ $name }}">
        <meta name="msapplication-TileColor"         content="#7c3aed">

        {{-- Favicon / Icons --}}
        @if($avatar)
            <link rel="icon"             type="image/webp" sizes="32x32" href="/{{ $avatar }}">
            <link rel="icon"             type="image/webp" sizes="16x16" href="/{{ $avatar }}">
            <link rel="apple-touch-icon" sizes="180x180"  href="/{{ $avatar }}">
            <link rel="preload" as="image" href="/{{ $avatar }}" fetchpriority="high">
        @else
            <link rel="icon" type="image/x-icon" href="/favicon.ico">
        @endif
        <link rel="manifest" href="/site.webmanifest">

        {{-- JSON-LD Structured Data --}}
        <script type="application/ld+json">
        [
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": "{{ $siteUrl }}/#person",
            "name": "{{ $name }}",
            "url": "{{ $siteUrl }}",
            "image": [
              {
                "@type": "ImageObject",
                "url": "{{ $ogImage }}",
                "width": 1200,
                "height": 630
              },
              {
                "@type": "ImageObject",
                "url": "{{ $avatarUrl }}",
                "width": 400,
                "height": 400
              }
            ],
            "jobTitle": "{{ $title }}",
            "description": "{{ $seoDesc }}",
            "email": "{{ $email }}",
            "telephone": "{{ $phone }}",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "{{ $location }}",
              "addressCountry": "NP"
            },
            "knowsAbout": ["Laravel","React","PHP","UI/UX Design","JavaScript","MySQL","Node.js","TailwindCSS"],
            "sameAs": [
              "{{ $github }}",
              "{{ $linkedin }}"
            ],
            "nationality": {
              "@type": "Country",
              "name": "Nepal"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": "{{ $siteUrl }}/#website",
            "url": "{{ $siteUrl }}",
            "name": "{{ $name }}",
            "alternateName": "{{ $name }} — Portfolio",
            "description": "{{ $seoDesc }}",
            "author": { "@id": "{{ $siteUrl }}/#person" },
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "{{ $siteUrl }}/projects?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": "{{ $siteUrl }}/#webpage",
            "url": "{{ $siteUrl }}",
            "name": "{{ $seoTitle }}",
            "description": "{{ $seoDesc }}",
            "isPartOf": { "@id": "{{ $siteUrl }}/#website" },
            "about": { "@id": "{{ $siteUrl }}/#person" },
            "primaryImageOfPage": {
              "@type": "ImageObject",
              "url": "{{ $ogImage }}",
              "width": 1200,
              "height": 630
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "{{ $name }} — Web Development Services",
            "url": "{{ $siteUrl }}",
            "telephone": "{{ $phone }}",
            "email": "{{ $email }}",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "{{ $location }}",
              "addressCountry": "NP"
            },
            "priceRange": "$$",
            "areaServed": "Worldwide",
            "serviceType": ["Full Stack Development","Laravel Development","React Development","UI/UX Design","API Integration"]
          }
        ]
        </script>

        {{-- DNS prefetch for performance --}}
        <link rel="dns-prefetch"  href="//cdn.simpleicons.org">
        <link rel="dns-prefetch"  href="//fonts.googleapis.com">
        <link rel="preconnect"    href="https://cdn.simpleicons.org" crossorigin>
        <link rel="preconnect"    href="https://fonts.googleapis.com" crossorigin>

        {{-- Fonts --}}
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap&font-display=swap" rel="stylesheet" media="print" onload="this.media='all'">
        <noscript><link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet"></noscript>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/".($page['component']).".jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
