<?php

namespace App\Traits;

use Illuminate\Support\Str;

/**
 * Automatic SEO generation trait.
 * Attach to any Eloquent model that has: title, description, tags (JSON), category, type.
 */
trait HasSeoAttributes
{
    // ─── Global site constants ──────────────────────────────────────────────
    private const SITE_NAME   = 'Sital Mahato';
    private const SITE_URL    = 'https://sital.info.np';
    private const AUTHOR      = 'Sital Mahato';
    private const PROFESSION  = 'Full Stack Developer';
    private const LOCATION    = 'Nepal';
    private const TWITTER     = '@sitalmahato';

    private const GLOBAL_KEYWORDS = [
        // ─── Core Identity ──────────────────────────────────────────────────
        'Sital Mahato', 'sital.info.np', 'Sital Mahato Portfolio', 'Sital Mahato Developer',

        // ─── Full Stack Developer ────────────────────────────────────────────
        'Full Stack Developer Nepal', 'Best Full Stack Developer Nepal',
        'Hire Full Stack Developer Nepal', 'Professional Full Stack Developer Nepal',
        'Full Stack Web Development Nepal', 'Full Stack Development Services',
        'React and Laravel Developer Nepal',

        // ─── Software Developer / Engineer ──────────────────────────────────
        'Software Developer Nepal', 'Best Software Developer Nepal', 'Software Engineer Nepal',
        'Freelance Software Developer Nepal', 'Custom Software Developer Nepal',
        'Enterprise Software Developer Nepal', 'Best Software Developer in Nepal',
        'Software Development Company Nepal', 'Custom Software Development Nepal',
        'Best Software Company Nepal',

        // ─── Website Developer ───────────────────────────────────────────────
        'Website Developer Nepal', 'Best Website Developer Nepal',
        'Professional Website Developer Nepal', 'Freelance Website Developer Nepal',
        'Business Website Developer Nepal', 'Corporate Website Developer Nepal',
        'Responsive Website Developer Nepal', 'SEO Website Developer Nepal',
        'Best Website Developer in Nepal', 'Affordable Website Development in Nepal',
        'Professional Website Designer in Nepal', 'Web Development Company Nepal',
        'Best Web Development Company Nepal', 'Web Development Services in Nepal',

        // ─── Web Developer (General) ─────────────────────────────────────────
        'Web Developer Nepal', 'Frontend Developer Nepal', 'Backend Developer Nepal',
        'UI UX Designer Nepal', 'Modern Web Development', 'Website Design Nepal',
        'Website Development Nepal',

        // ─── Laravel ─────────────────────────────────────────────────────────
        'Laravel Developer Nepal', 'Best Laravel Developer Nepal', 'Hire Laravel Developer Nepal',
        'Senior Laravel Developer', 'Laravel API Developer', 'Laravel SaaS Developer',
        'Laravel CRM Developer', 'Laravel ERP Developer', 'Laravel POS Developer',
        'Laravel Ecommerce Developer', 'Best Laravel Developer in Nepal',
        'Hire Laravel Developer', 'Best Laravel Developer in Koshi Province',

        // ─── React / Next.js / Frontend ──────────────────────────────────────
        'React Developer Nepal', 'Next.js Developer Nepal', 'NestJS Developer Nepal',
        'Node.js Developer Nepal', 'Express.js Developer Nepal', 'Vue.js Developer Nepal',
        'Angular Developer Nepal', 'Best React Developer in Nepal',
        'Hire React Developer Nepal', 'Hire React Developer', 'Hire Next.js Developer',
        'Hire NestJS Developer',

        // ─── PHP / JavaScript / TypeScript ───────────────────────────────────
        'PHP Developer Nepal', 'JavaScript Developer Nepal', 'TypeScript Developer Nepal',
        'Hire PHP Developer',

        // ─── Mobile / Flutter / Android ──────────────────────────────────────
        'Flutter Developer Nepal', 'Android App Developer Nepal', 'Mobile App Developer Nepal',
        'Cross Platform App Developer Nepal', 'Hire Mobile App Developer',
        'Mobile App Development Company Nepal', 'App Developer in Nepal',

        // ─── Database / Cloud / API ───────────────────────────────────────────
        'Supabase Developer', 'Firebase Developer', 'PostgreSQL Developer',
        'MySQL Developer', 'MongoDB Developer', 'REST API Developer', 'GraphQL Developer',
        'API Development Services Nepal', 'API Integration Expert',
        'Payment Gateway Integration Nepal', 'Cloud Application Developer Nepal',

        // ─── IT / Consulting / Services ───────────────────────────────────────
        'IT Consultant Nepal', 'Digital Solutions Nepal', 'Technical Consultant Nepal',
        'Best IT Company Nepal', 'SEO Expert Nepal', 'Open Source Developer Nepal',
        'AI Developer Nepal', 'Machine Learning Developer Nepal', 'Automation Developer Nepal',
        'Digital Transformation Nepal',

        // ─── Website Services ─────────────────────────────────────────────────
        'E-commerce Website Development Nepal', 'E-commerce Website Developer in Nepal',
        'Portfolio Website Development Nepal', 'School Website Development Nepal',
        'College Website Development Nepal', 'Hospital Website Development Nepal',
        'Business Website Developer in Nepal',

        // ─── Management Systems ───────────────────────────────────────────────
        'School Management System Nepal', 'School Management Software Developer Nepal',
        'College Management System Nepal', 'Library Management System Nepal',
        'Hospital Management System Nepal', 'Hospital Management Software Developer Nepal',
        'Inventory Management System Nepal', 'Inventory Management Software Nepal',
        'POS System Nepal', 'Attendance Management System Nepal',
        'HR Management System Nepal', 'Payroll System Nepal',
        'CRM Development Nepal', 'CRM Software Development Nepal',
        'ERP Development Nepal', 'Custom ERP Development Nepal',

        // ─── Kathmandu ────────────────────────────────────────────────────────
        'Software Developer in Kathmandu', 'Website Developer in Kathmandu',
        'Laravel Developer in Kathmandu', 'React Developer in Kathmandu',

        // ─── Biratnagar ───────────────────────────────────────────────────────
        'Software Developer in Biratnagar', 'Website Developer in Biratnagar',
        'Laravel Developer in Biratnagar',

        // ─── Itahari ──────────────────────────────────────────────────────────
        'Software Developer in Itahari', 'Website Developer in Itahari',

        // ─── Dharan ───────────────────────────────────────────────────────────
        'Software Developer in Dharan', 'Website Developer in Dharan',

        // ─── Janakpur ────────────────────────────────────────────────────────
        'Software Developer in Janakpur', 'Website Developer in Janakpur',

        // ─── Siraha ───────────────────────────────────────────────────────────
        'Software Developer in Siraha', 'Website Developer in Siraha',
        'Laravel Developer in Siraha', 'React Developer in Siraha',
        'NestJS Developer in Siraha', 'Android Developer in Siraha',
        'Flutter Developer in Siraha', 'Hire Software Developer in Siraha',
        'Hire Website Developer in Siraha',

        // ─── Lahan ────────────────────────────────────────────────────────────
        'Software Developer in Lahan', 'Website Developer in Lahan',

        // ─── Rajbiraj ─────────────────────────────────────────────────────────
        'Software Developer in Rajbiraj', 'Website Developer in Rajbiraj',

        // ─── Koshi Province ───────────────────────────────────────────────────
        'Software Developer in Koshi Province', 'Website Developer in Koshi Province',
        'Laravel Developer in Koshi Province', 'React Developer in Koshi Province',
        'NestJS Developer in Koshi Province', 'Hire Software Developer in Koshi Province',
        'Best Laravel Developer in Koshi Province',

        // ─── Madhesh Province ─────────────────────────────────────────────────
        'Software Developer in Madhesh Province', 'Website Developer in Madhesh Province',
        'Laravel Developer in Madhesh Province',

        // ─── Hire (Long-tail) ─────────────────────────────────────────────────
        'Hire Website Developer', 'Hire Software Engineer',
        'Hire Laravel Developer in Nepal', 'Hire React Developer in Nepal',
        'Hire Next.js Developer in Nepal', 'Hire NestJS Developer in Nepal',
        'Hire Software Developer in Nepal',

        // ─── Long-tail High-converting ────────────────────────────────────────
        'Best Laravel Developer in Nepal', 'Best Website Developer in Nepal',
        'Affordable Website Development Nepal',
        'Custom Software Development Company in Nepal',
        'Web Development Services in Nepal',
        'Software Development Company in Nepal',
        'Mobile App Development Company Nepal',
    ];

    // ─── Slug auto-generation ───────────────────────────────────────────────

    /**
     * Generate and ensure a unique slug for a model instance.
     * Call from store/update logic.
     */
    public static function generateUniqueSlug(string $title, ?int $excludeId = null): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $i    = 1;

        while (
            static::where('slug', $slug)
                ->when($excludeId, fn($q) => $q->where('id', '!=', $excludeId))
                ->exists()
        ) {
            $slug = $base . '-' . $i++;
        }

        return $slug;
    }

    // ─── Keyword generation ─────────────────────────────────────────────────

    /**
     * Build a deduplicated keyword array from all available model fields.
     */
    public function buildKeywords(): array
    {
        $keywords = self::GLOBAL_KEYWORDS;

        // From title words
        if (!empty($this->title)) {
            $keywords = array_merge($keywords, $this->extractWords($this->title));
            $keywords[] = $this->title;
        }

        // From description
        if (!empty($this->description)) {
            $keywords = array_merge($keywords, $this->extractSignificantWords($this->description));
        }

        // From tags (JSON array)
        if (!empty($this->tags)) {
            $tags = is_array($this->tags) ? $this->tags : json_decode($this->tags, true) ?? [];
            foreach ($tags as $tag) {
                $keywords[] = $tag;
                $keywords[] = $tag . ' Developer';
                $keywords[] = $tag . ' Development';
            }
        }

        // From category
        if (!empty($this->category)) {
            $keywords[] = $this->category;
            $keywords[] = $this->category . ' Development';
            $keywords[] = $this->category . ' Nepal';
        }

        // From type
        if (!empty($this->type)) {
            $keywords[] = $this->type;
        }

        // From features (services)
        if (!empty($this->features)) {
            $features = is_array($this->features) ? $this->features : json_decode($this->features, true) ?? [];
            foreach ($features as $feature) {
                if (is_string($feature)) {
                    $keywords[] = $feature;
                }
            }
        }

        // Contextual append based on common tech keywords in title/tags
        $allText = strtolower(($this->title ?? '') . ' ' . ($this->description ?? '') . ' ' . implode(' ', is_array($this->tags ?? []) ? $this->tags : []));
        $contextMap = [
            'laravel'    => ['Laravel Development', 'Laravel PHP', 'Laravel Framework'],
            'react'      => ['React Development', 'React.js', 'React App'],
            'next'       => ['Next.js Development', 'Next.js App', 'SSR Development'],
            'flutter'    => ['Flutter App', 'Flutter Development', 'Cross-Platform App'],
            'android'    => ['Android Development', 'Android App', 'Mobile App'],
            'inventory'  => ['Inventory Management System', 'Stock Management', 'Warehouse Management'],
            'hospital'   => ['Hospital Management System', 'HMS', 'Healthcare Software'],
            'school'     => ['School Management System', 'Education Software', 'Student Management'],
            'library'    => ['Library Management System', 'Book Management'],
            'pos'        => ['POS System', 'Point of Sale', 'Billing System'],
            'ecommerce'  => ['E-commerce Development', 'Online Store', 'Shopping Cart'],
            'crm'        => ['CRM Development', 'Customer Relationship Management'],
            'erp'        => ['ERP System', 'Enterprise Resource Planning'],
            'attendance' => ['Attendance System', 'Attendance Management'],
            'auth'       => ['Authentication System', 'Login System', 'User Management'],
            'api'        => ['API Development', 'REST API', 'API Integration'],
            'dashboard'  => ['Dashboard Development', 'Admin Panel', 'Analytics Dashboard'],
        ];

        foreach ($contextMap as $trigger => $extras) {
            if (str_contains($allText, $trigger)) {
                $keywords = array_merge($keywords, $extras);
            }
        }

        return array_values(array_unique(array_filter($keywords)));
    }

    /**
     * Return a comma-separated keywords string (max 20 terms for meta tag).
     */
    public function getSeoKeywordsString(int $limit = 20): string
    {
        return implode(', ', array_slice($this->buildKeywords(), 0, $limit));
    }

    // ─── Description generation ─────────────────────────────────────────────

    /**
     * Auto-generate a meta description under 160 characters.
     */
    public function buildMetaDescription(string $context = 'project'): string
    {
        $name = self::AUTHOR;
        $desc = strip_tags($this->description ?? '');
        $title = $this->title ?? '';

        if ($context === 'project') {
            $base = "{$title} — a project by {$name}, Full Stack Developer in Nepal. " . Str::words($desc, 12, '');
        } elseif ($context === 'service') {
            $base = "{$title} service by {$name} — Full Stack Developer Nepal. " . Str::words($desc, 12, '');
        } elseif ($context === 'certificate') {
            $issuer = $this->issuer ?? 'Online Platform';
            $base   = "{$title} certificate by {$issuer}. Earned by {$name}, Full Stack Developer Nepal.";
        } else {
            $base = Str::words($desc, 20, '');
        }

        return Str::limit(trim($base), 157, '...');
    }

    // ─── Title generation ───────────────────────────────────────────────────

    /**
     * Build a page <title> under ~60 characters where possible.
     * Falls back to truncation with site name appended.
     */
    public function buildSeoTitle(string $suffix = ''): string
    {
        $title = $this->title ?? 'Portfolio';
        $site  = self::SITE_NAME;
        $sep   = ' | ';

        $withSuffix = $suffix ? "{$title}{$sep}{$suffix}{$sep}{$site}" : "{$title}{$sep}{$site}";

        if (strlen($withSuffix) <= 70) {
            return $withSuffix;
        }

        // Trim title to fit
        $reserved   = strlen($sep . $site);
        $maxTitle   = 70 - $reserved - ($suffix ? strlen($sep . $suffix) : 0);
        $trimmed    = Str::limit($title, $maxTitle, '');

        return $suffix
            ? "{$trimmed}{$sep}{$suffix}{$sep}{$site}"
            : "{$trimmed}{$sep}{$site}";
    }

    // ─── JSON-LD structured data ─────────────────────────────────────────────

    /**
     * Generate SoftwareApplication / WebPage JSON-LD for a project.
     */
    public function buildProjectJsonLd(string $url, ?string $imageUrl = null): array
    {
        $tags = is_array($this->tags ?? []) ? ($this->tags ?? []) : (json_decode($this->tags ?? '[]', true) ?? []);

        return [
            [
                '@context'    => 'https://schema.org',
                '@type'       => 'SoftwareApplication',
                '@id'         => $url . '#softwareapp',
                'name'        => $this->title,
                'description' => $this->buildMetaDescription('project'),
                'url'         => $url,
                'author'      => [
                    '@type' => 'Person',
                    'name'  => self::AUTHOR,
                    'url'   => self::SITE_URL,
                ],
                'creator'     => [
                    '@type' => 'Person',
                    'name'  => self::AUTHOR,
                    'url'   => self::SITE_URL,
                ],
                'applicationCategory' => $this->category ?? 'WebApplication',
                'operatingSystem'     => 'Web',
                'programmingLanguage' => $tags,
                'keywords'            => implode(', ', array_slice($tags, 0, 10)),
                'image'               => $imageUrl,
                'datePublished'       => $this->created_at?->toDateString(),
                'dateModified'        => $this->updated_at?->toDateString(),
                'offers'              => [
                    '@type'       => 'Offer',
                    'price'       => '0',
                    'priceCurrency' => 'USD',
                    'availability'  => 'https://schema.org/InStock',
                ],
            ],
            [
                '@context' => 'https://schema.org',
                '@type'    => 'BreadcrumbList',
                'itemListElement' => [
                    ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home',     'item' => self::SITE_URL],
                    ['@type' => 'ListItem', 'position' => 2, 'name' => 'Projects', 'item' => self::SITE_URL . '/projects'],
                    ['@type' => 'ListItem', 'position' => 3, 'name' => $this->title],
                ],
            ],
            [
                '@context'    => 'https://schema.org',
                '@type'       => 'WebPage',
                '@id'         => $url,
                'url'         => $url,
                'name'        => $this->buildSeoTitle(),
                'description' => $this->buildMetaDescription('project'),
                'isPartOf'    => ['@id' => self::SITE_URL . '/#website'],
                'author'      => ['@id' => self::SITE_URL . '/#person'],
                'datePublished' => $this->created_at?->toDateString(),
                'dateModified'  => $this->updated_at?->toDateString(),
                'image'         => $imageUrl ? ['@type' => 'ImageObject', 'url' => $imageUrl] : null,
            ],
        ];
    }

    /**
     * Generate Service JSON-LD schema.
     */
    public function buildServiceJsonLd(string $url): array
    {
        $features = is_array($this->features ?? []) ? ($this->features ?? []) : (json_decode($this->features ?? '[]', true) ?? []);

        return [
            [
                '@context'    => 'https://schema.org',
                '@type'       => 'Service',
                '@id'         => $url . '#service',
                'name'        => $this->title,
                'description' => $this->buildMetaDescription('service'),
                'url'         => $url,
                'provider'    => [
                    '@type' => 'Person',
                    'name'  => self::AUTHOR,
                    'url'   => self::SITE_URL,
                ],
                'areaServed'  => 'Worldwide',
                'hasOfferCatalog' => [
                    '@type'       => 'OfferCatalog',
                    'name'        => $this->title,
                    'itemListElement' => array_map(fn($f, $i) => [
                        '@type'    => 'Offer',
                        'position' => $i + 1,
                        'name'     => is_string($f) ? $f : ($f['title'] ?? ''),
                    ], $features, array_keys($features)),
                ],
            ],
            [
                '@context' => 'https://schema.org',
                '@type'    => 'BreadcrumbList',
                'itemListElement' => [
                    ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home',     'item' => self::SITE_URL],
                    ['@type' => 'ListItem', 'position' => 2, 'name' => 'Services', 'item' => self::SITE_URL . '/services'],
                    ['@type' => 'ListItem', 'position' => 3, 'name' => $this->title],
                ],
            ],
        ];
    }

    // ─── Helpers ────────────────────────────────────────────────────────────

    private function extractWords(string $text): array
    {
        return array_filter(
            explode(' ', preg_replace('/[^a-zA-Z0-9 ]/', ' ', $text)),
            fn($w) => strlen($w) > 3
        );
    }

    private function extractSignificantWords(string $text, int $minLen = 5): array
    {
        $words  = str_word_count(strip_tags($text), 1);
        $stopwords = ['about', 'above', 'after', 'again', 'against', 'also', 'another',
            'because', 'been', 'before', 'being', 'between', 'both', 'built',
            'came', 'come', 'could', 'does', 'done', 'each', 'even',
            'every', 'from', 'have', 'here', 'into', 'just', 'like',
            'made', 'make', 'many', 'more', 'most', 'much', 'need',
            'only', 'other', 'over', 'same', 'such', 'than', 'that',
            'their', 'them', 'then', 'there', 'these', 'they', 'this',
            'those', 'through', 'time', 'under', 'uses', 'using', 'very',
            'want', 'were', 'what', 'when', 'where', 'which', 'while',
            'will', 'with', 'would', 'your'];

        return array_values(array_unique(array_filter(
            array_map('strtolower', $words),
            fn($w) => strlen($w) >= $minLen && !in_array($w, $stopwords)
        )));
    }
}
