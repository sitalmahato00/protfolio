<?php echo '<' . '?xml version="1.0" encoding="UTF-8"?>' . "\n"; ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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
        <priority>0.8</priority>
    </url>
@foreach($projects as $project)
    <url>
        <loc>https://sital.info.np/project/{{ $project->id }}</loc>
        <lastmod>{{ $project->updated_at->toDateString() }}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
@endforeach
</urlset>