<?php
namespace Database\Seeders;
use App\Models\User;
use App\Models\Profile;
use App\Models\Skill;
use App\Models\Project;
use App\Models\Service;
use App\Models\Experience;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create(['name' => 'Sital Mahato', 'email' => 'admin@portfolio.com', 'password' => bcrypt('password')]);

        Profile::create([
            'name' => 'Sital Mahato',
            'title' => 'Full Stack Developer',
            'bio' => "I'm Sital Mahato, a motivated IT student from Golbazar, Siraha, deeply passionate about building efficient, robust, and user-friendly software solutions. Currently pursuing a Diploma in Information Technology at Manmohan Memorial Polytechnic. My expertise spans Java, C++, React, Laravel, and Node.js.",
            'email' => 'sitalmahato077@gmail.com',
            'phone' => '+977 9704191610',
            'location' => 'Golbazar, Siraha, Nepal',
            'avatar' => 'images/image.png',
            'resume' => 'images/sitalmahato.pdf',
            'github' => 'https://github.com/sitalmahato00',
            'linkedin' => 'https://linkedin.com/in/sitalmahato',
            'availability' => 'Available for Work',
            'typewriter_words' => ['Full Stack Developer', 'UI/UX Designer', 'Laravel & PHP Expert', 'React Developer', 'Problem Solver', 'Freelancer · Nepal 🇳🇵']
        ]);

        $skills = [
            ['category' => 'Frontend', 'icon' => '🎨', 'name' => 'HTML5', 'order' => 1],
            ['category' => 'Frontend', 'icon' => '🎨', 'name' => 'CSS3', 'order' => 2],
            ['category' => 'Frontend', 'icon' => '🎨', 'name' => 'JavaScript', 'order' => 3],
            ['category' => 'Frontend', 'icon' => '🎨', 'name' => 'React', 'order' => 4],
            ['category' => 'Backend', 'icon' => '⚙️', 'name' => 'Node.js', 'order' => 5],
            ['category' => 'Backend', 'icon' => '⚙️', 'name' => 'Laravel', 'order' => 6],
            ['category' => 'Backend', 'icon' => '⚙️', 'name' => 'Java', 'order' => 7],
            ['category' => 'Backend', 'icon' => '⚙️', 'name' => 'PHP', 'order' => 8],
            ['category' => 'Database', 'icon' => '🗃️', 'name' => 'MySQL', 'order' => 9],
            ['category' => 'Database', 'icon' => '🗃️', 'name' => 'MongoDB', 'order' => 10],
            ['category' => 'Database', 'icon' => '🗃️', 'name' => 'Redis', 'order' => 11],
            ['category' => 'Design', 'icon' => '🎭', 'name' => 'Figma', 'order' => 12],
            ['category' => 'Design', 'icon' => '🎭', 'name' => 'UI/UX', 'order' => 13],
            ['category' => 'Design', 'icon' => '🎭', 'name' => 'Responsive', 'order' => 14],
            ['category' => 'Tools', 'icon' => '🛠️', 'name' => 'Git', 'order' => 15],
            ['category' => 'Tools', 'icon' => '🛠️', 'name' => 'GitHub', 'order' => 16],
            ['category' => 'Tools', 'icon' => '🛠️', 'name' => 'Vercel', 'order' => 17],
            ['category' => 'Tools', 'icon' => '🛠️', 'name' => 'Netlify', 'order' => 18],
        ];
        foreach ($skills as $s) Skill::create($s);

        $projects = [
            ['title' => 'MMP Management Platform', 'description' => 'An enterprise-grade college platform featuring Redis caching and rate-limiting for unmatched stability and security.', 'image' => 'images/mmp.png', 'tags' => ['Laravel', 'Redis', 'Security'], 'live_url' => '#', 'github_url' => '#', 'order' => 1],
            ['title' => 'E-Commerce Solution', 'description' => 'A high-performance e-commerce platform featuring secure payment integration and seamless UX/UI design for modern retail.', 'image' => 'images/ecommerce.png', 'tags' => ['React', 'Node.js', 'Tailwind', 'Stripe'], 'live_url' => '#', 'github_url' => '#', 'order' => 2],
            ['title' => 'IT-DMS: Enterprise Suite', 'description' => 'A complex role-based management system for department operations, automating academic records and attendance tracking.', 'image' => 'images/dit.png', 'tags' => ['Laravel', 'MySQL', 'PHP', 'Security'], 'live_url' => null, 'github_url' => 'https://github.com/sitalmahato00/IT-DMS', 'order' => 3],
            ['title' => 'Smart Task Analytics', 'description' => 'A productivity powerhouse leveraging real-time updates and intuitive design to streamline project management workflows.', 'image' => 'images/task.png', 'tags' => ['React', 'Node.js', 'WebSockets'], 'live_url' => '#', 'github_url' => '#', 'order' => 4],
            ['title' => 'Dynamic Weather Hub', 'description' => 'Engineered for speed and accuracy, this app delivers real-time meteorological insights through advanced API integration.', 'image' => 'images/weather.png', 'tags' => ['JavaScript', 'APIs', 'Data Viz'], 'live_url' => '#', 'github_url' => '#', 'order' => 5],
            ['title' => 'Academic Result Portal', 'description' => 'A scalable, production-ready portal for student records, optimized for high traffic and instant data retrieval.', 'image' => 'images/resultit.png', 'tags' => ['React', 'Next.js', 'Serverless'], 'live_url' => 'https://sitalmahato00.github.io/DIT_result/', 'github_url' => '#', 'order' => 6],
        ];
        foreach ($projects as $p) Project::create($p);

        $services = [
            ['title' => 'Full Stack Development', 'description' => 'End-to-end web apps built with React, Node.js, and Laravel. Secure, scalable, production-ready.', 'icon' => '🖥️', 'features' => ['React / Next.js Frontend', 'Node.js / Laravel Backend', 'REST API Development', 'Role-based Access Systems'], 'is_popular' => true, 'order' => 1],
            ['title' => 'UI/UX Design', 'description' => 'Responsive, intuitive interfaces designed in Figma with premium modern aesthetics.', 'icon' => '🎨', 'features' => ['Figma Prototypes & Wireframes', 'Responsive Web Design', 'Design Systems & Branding', 'Pixel-perfect Implementation'], 'is_popular' => false, 'order' => 2],
            ['title' => 'Laravel & PHP Systems', 'description' => 'Robust backend systems with role-based management, Redis caching, and enterprise-grade security.', 'icon' => '⚙️', 'features' => ['Enterprise Management Platforms', 'MySQL / Redis Integration', 'Authentication & Security', 'Academic & ERP Systems'], 'is_popular' => false, 'order' => 3],
            ['title' => 'Database & API Integration', 'description' => 'Optimized database design and third-party API integration for real-time data and payments.', 'icon' => '🗄️', 'features' => ['MySQL & MongoDB Design', 'Payment Gateway Integration', 'Real-time Data (WebSockets)', 'Third-party API Integration'], 'is_popular' => false, 'order' => 4],
            ['title' => 'Mobile-First Web Design', 'description' => 'Pixel-perfect websites that look and perform flawlessly on every device.', 'icon' => '📱', 'features' => ['Responsive Layouts', 'Touch-Friendly Interactions', 'Cross-Browser Compatibility', 'Adaptive Typography & Grids'], 'is_popular' => false, 'order' => 5],
            ['title' => 'Deployment & DevOps', 'description' => 'End-to-end deployment using Git, GitHub, and hosting platforms from dev to production.', 'icon' => '🚀', 'features' => ['GitHub Pages / Vercel / Netlify', 'Git Workflow & CI Setup', 'Environment Configuration', 'Ongoing Maintenance Support'], 'is_popular' => false, 'order' => 6],
        ];
        foreach ($services as $s) Service::create($s);

        $experiences = [
            ['type' => 'work', 'title' => 'Web Developer', 'subtitle' => 'Freelancer', 'date_range' => 'Aug 2023 — Present', 'description' => 'Developing custom web applications, integrating APIs, and ensuring optimal performance and user experience across complex systems.', 'tags' => ['React', 'Node.js', 'Laravel', 'APIs'], 'order' => 1],
            ['type' => 'work', 'title' => 'Web Designer', 'subtitle' => 'Creative Agency', 'date_range' => 'May 2023 — Present', 'description' => 'Designing responsive, intuitive, and visually appealing user interfaces with a focus on premium modern aesthetics.', 'tags' => ['Figma', 'UI/UX', 'CSS'], 'order' => 2],
            ['type' => 'work', 'title' => 'Production Projects', 'subtitle' => 'Open Source & Freelance', 'date_range' => 'Present', 'description' => 'Building full-stack role-based systems including enterprise management platforms, academic portals, and real-time applications.', 'tags' => ['Full Stack', 'Laravel', 'React'], 'order' => 3],
            ['type' => 'education', 'title' => 'Diploma in Information Technology', 'subtitle' => 'Manmohan Memorial Polytechnic', 'date_range' => '2023 — 2026', 'description' => 'Pursuing Diploma in IT with focus on full-stack development, database management, system security, and software engineering principles.', 'tags' => ['IT Diploma', 'In Progress'], 'order' => 4],
            ['type' => 'education', 'title' => 'Full Stack Mastery', 'subtitle' => 'Self-directed Learning', 'date_range' => '2024', 'description' => 'Advanced Laravel, React, and API integration. Built production-grade full-stack role-based systems deployed for real users.', 'tags' => ['Laravel', 'React', 'APIs'], 'order' => 5],
        ];
        foreach ($experiences as $e) Experience::create($e);
    }
}
