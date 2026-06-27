# Tasks: Portfolio Website with Dynamic Admin Panel

## Task 1: Update StatsController and ProfileController upload endpoints

- [ ] 1.1 Update `app/Http/Controllers/Api/StatsController.php` to return real counts: `projects_delivered` from `Project::count()`, `tech_stack` from `Skill::distinct('category')->count('category')`, plus hardcoded `years_exp: 3`, `client_satisfaction: "100%"`, `support: "24/7"`
- [ ] 1.2 Add `storeAvatar` method to `app/Http/Controllers/Api/ProfileController.php`: validate (image, mimes:jpeg,png,jpg,webp, max:2048), store in `public/images/` with `uniqid()` prefix, update `Profile::first()->avatar`, return `{avatar: path}`
- [ ] 1.3 Add `storeResume` method to `app/Http/Controllers/Api/ProfileController.php`: validate (file, mimes:pdf, max:5120), store in `public/images/` with `uniqid()` prefix, update `Profile::first()->resume`, return `{resume: path}`
- [ ] 1.4 Add routes to `routes/api.php`: `Route::post('/profile/avatar', ...)` and `Route::post('/profile/resume', ...)`

## Task 2: Create AuthLayout and redesign all auth pages

- [ ] 2.1 Create `resources/js/Layouts/AuthLayout.jsx`: full-screen dark background (`linear-gradient(145deg, #0a0f1e, #0f1f3d, #1a1040)`) with dot-grid overlay, centered card (max-width 440px, `rgba(255,255,255,0.05)` bg, backdrop-filter blur, rounded-2xl, border `rgba(255,255,255,0.1)`), "SM" gradient badge at top, accepts `title`, `subtitle`, `children` props. All styles via inline `<style>` block.
- [ ] 2.2 Rewrite `resources/js/Pages/Auth/Login.jsx` to use `AuthLayout` with title "Welcome Back" and subtitle "Sign in to your admin panel". Style inputs dark (bg `rgba(255,255,255,0.08)`, border `rgba(255,255,255,0.15)`, text white). Submit button uses gradient `linear-gradient(135deg, #f97316, #ef4444)`. Keep all Inertia `useForm` logic intact.
- [ ] 2.3 Rewrite `resources/js/Pages/Auth/ForgotPassword.jsx` to use `AuthLayout` with title "Reset Password" and subtitle "Enter your email to receive a reset link". Same dark input and gradient button styling.
- [ ] 2.4 Rewrite `resources/js/Pages/Auth/ResetPassword.jsx` to use `AuthLayout` with title "New Password". Three fields: email, password, confirm password. Keep Inertia logic.
- [ ] 2.5 Rewrite `resources/js/Pages/Auth/Register.jsx` to use `AuthLayout` with title "Create Account". Four fields: name, email, password, confirm. Keep Inertia logic.

## Task 3: Create AdminLayout and update all admin pages

- [ ] 3.1 Create `resources/js/Layouts/AdminLayout.jsx`: fixed dark sidebar (260px wide, `#0f172a` bg, full viewport height). Sidebar contains: SM logo badge + "Portfolio Admin" text at top; nav links (Dashboard, Projects, Skills, Services, Experiences, Messages, Profile Settings) each with inline SVG icon, active state highlighted (`#1e293b` bg + `#2563eb` left border + white text); user name/email + logout button at bottom. Main area: `margin-left: 260px`, `background: #f8fafc`, `min-height: 100vh`. Accepts `children` and `title` props. Uses Inertia `usePage` for auth user and `Link` for nav, `router.post(route('logout'))` for logout.
- [ ] 3.2 Rewrite `resources/js/Pages/Admin/Dashboard.jsx` to use `AdminLayout`. Show 4 stat cards (colored icons: blue for projects, purple for skills, green for services, orange for messages) pulling from `/api/stats` and `/api/contact` (count unread). Show 6 quick-action cards in a grid.
- [ ] 3.3 Update `resources/js/Pages/Admin/Projects.jsx` to use `AdminLayout` instead of `AuthenticatedLayout`. Keep all CRUD logic.
- [ ] 3.4 Update `resources/js/Pages/Admin/Skills.jsx` to use `AdminLayout` instead of `AuthenticatedLayout`. Keep all CRUD logic.
- [ ] 3.5 Update `resources/js/Pages/Admin/Services.jsx` to use `AdminLayout` instead of `AuthenticatedLayout`. Keep all CRUD logic.
- [ ] 3.6 Update `resources/js/Pages/Admin/Experiences.jsx` to use `AdminLayout` instead of `AuthenticatedLayout`. Keep all CRUD logic.
- [ ] 3.7 Update `resources/js/Pages/Admin/Messages.jsx` to use `AdminLayout` instead of `AuthenticatedLayout`. Keep all CRUD logic.
- [ ] 3.8 Rewrite `resources/js/Pages/Admin/ProfileSettings.jsx` to use `AdminLayout`. Add avatar file upload (image input + preview + POST to `/api/profile/avatar`) and resume file upload (PDF input + POST to `/api/profile/resume`). Show current avatar as preview image. Keep all existing text field editing and save logic.

## Task 4: Build the complete Portfolio.jsx

- [ ] 4.1 Write the full inline `<style>` block at the top of `Portfolio.jsx` with all CSS custom properties and rules matching the original HTML design (nav, hero, promo banner, stats bar, about, skills, projects, services, journey, contact, footer sections — exact visual match).
- [ ] 4.2 Implement the Nav: floating pill, transparent → frosted on scroll (40px threshold), SM badge, nav links, "Hire Me" CTA, hamburger button, scroll-spy active link via `IntersectionObserver` or section offset check.
- [ ] 4.3 Implement the mobile menu: slides in (or dropdown), closes on link click, overlay closes it.
- [ ] 4.4 Implement the Hero section: left column with availability badge + typewriter (`>_` prefix, blinking cursor, cycles through `profile.typewriter_words`), h1 with name in blue, description, 3 buttons, social icons row; right column with photo in spinning ring + orbit dots + floating animation, hero stats row (3 items from `stats`).
- [ ] 4.5 Implement the Promo Banner: full-width gradient strip with freelance availability text and email.
- [ ] 4.6 Implement the Stats Bar: 4-column white card with stats from `/api/stats`.
- [ ] 4.7 Implement the About section: 2-col grid. Left: 80px profile photo, bio paragraphs, info rows (Name, Email, Phone, Location, Status pill). Right: 2×2 about-cards + Quick Features box.
- [ ] 4.8 Implement the Skills section: white background, grid of skill cards grouped by category (from `/api/skills/categories`), each card shows emoji icon + category name + skill tags.
- [ ] 4.9 Implement the Projects section: grid of project cards, each with 180px image top, tag pills, title, description, live/github link buttons (only render button if URL exists and isn't `#`).
- [ ] 4.10 Implement the Services section: white background, grid of service cards with popular badge, emoji icon, title, description, ✓ feature list, "Get Quote →" mailto link.
- [ ] 4.11 Implement the Journey section: 2-col grid (💼 Work | 🎓 Education), timeline items with left blue border, date, title, subtitle, description, tag pills. Data filtered from `experiences` by `type`.
- [ ] 4.12 Implement the Contact section: gradient background, 2-col grid. Left: 4 contact info items (Email, Phone, Location, Availability). Right: availability card + 4 contact buttons (Email, Phone, GitHub, LinkedIn) + inline contact form (Name, Email, Subject, Message, Submit button) with success/error state display.
- [ ] 4.13 Implement the Footer: dark background, logo `[ Sital Mahato ]`, tagline, nav links row, copyright.
- [ ] 4.14 Implement contact form logic: client-side validation (name non-empty, valid email, message ≥ 10 chars), POST to `/api/contact`, success clears form + shows green message, error shows red message.

## Task 5: Wire up and verify

- [ ] 5.1 Run `php artisan migrate:fresh --seed` to ensure DB has all data.
- [ ] 5.2 Run `npm run build` (or dev) to verify no JS compilation errors.
- [ ] 5.3 Verify the portfolio page loads at `/` with all sections populated from DB.
- [ ] 5.4 Verify login at `/login` uses the new dark AuthLayout design.
- [ ] 5.5 Verify admin dashboard at `/admin/dashboard` uses the new sidebar AdminLayout.
- [ ] 5.6 Verify file upload inputs appear in Profile Settings and the upload routes respond correctly.
