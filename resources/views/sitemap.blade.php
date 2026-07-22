<?php echo '<' . '?xml version="1.0" encoding="UTF-8"?>' . "\n"; ?>
<urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

    {{-- Static pages --}}
    <url>
        <loc>https://sital.info.np</loc>
        <lastmod>{{ $today }}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://sital.info.np/projects</loc>
        <lastmod>{{ $today }}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://sital.info.np/services</loc>
        <lastmod>{{ $today }}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://sital.info.np/certificates</loc>
        <lastmod>{{ $today }}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>https://sital.info.np/#about</loc>
        <lastmod>{{ $today }}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>https://sital.info.np/#contact</loc>
        <lastmod>{{ $today }}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    <url>
        <loc>https://sital.info.np/privacy</loc>
        <lastmod>{{ $today }}</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.3</priority>
    </url>

    {{-- Projects --}}
    @foreach($projects as $project)
    <url>
        <loc>https://sital.info.np/projects/{{ $project->slug ?? $project->id }}</loc>
        <lastmod>{{ $project->updated_at->toDateString() }}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    @endforeach

    {{-- Services --}}
    @foreach($services as $service)
    <url>
        <loc>https://sital.info.np/services/{{ $service->slug ?? $service->id }}</loc>
        <lastmod>{{ $service->updated_at->toDateString() }}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    @endforeach

    {{-- Certificates --}}
    @foreach($certificates as $certificate)
    <url>
        <loc>https://sital.info.np/certificate/{{ $certificate->id }}</loc>
        <lastmod>{{ $certificate->updated_at->toDateString() }}</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.5</priority>
    </url>
    @endforeach

</urlset>
