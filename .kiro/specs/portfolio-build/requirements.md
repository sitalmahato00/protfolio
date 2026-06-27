# Requirements: Portfolio Website with Dynamic Admin Panel

## Requirement 1: Portfolio Page — Exact Visual Match

**User Story**: As a visitor, I want to see a visually stunning portfolio page that matches the original HTML design exactly, with all data loaded dynamically from the database.

### Acceptance Criteria

1.1 The portfolio page at `/` renders all 12 sections: Nav, Hero, Promo Banner, Stats Bar, About, Skills, Projects, Services, Journey, Contact, Footer.

1.2 The Hero section displays a dark gradient background (`linear-gradient(145deg, #0a0f1e, #0f1f3d, #1a1040)`), a floating profile photo with spinning conic-gradient ring, orbit dots, typewriter animation with `>_` prefix and blinking orange cursor, green "Available for Work" pulse badge, and 3 action buttons (Hire Me, Download CV, WhatsApp).

1.3 The Nav is a fixed floating pill: transparent on load, becomes frosted glass (`rgba(255,255,255,0.45)` + blur) after 40px scroll. Has logo badge "SM", nav links, "Hire Me" CTA button, and hamburger for mobile.

1.4 All section data (profile, skills, projects, services, experiences, stats) is fetched from the existing `/api/*` endpoints on page load using `Promise.all`.

1.5 The portfolio page uses an inline `<style>` block with CSS custom properties — no Tailwind classes inside `Portfolio.jsx`.

1.6 The page is fully responsive: mobile hamburger menu opens a slide-in panel, hero stacks vertically, grids collapse to single column.

1.7 The contact section includes a working form (Name, Email, Subject, Message) that POSTs to `/api/contact` with success/error feedback.

---

## Requirement 2: Auth Pages — Custom Dark Theme

**User Story**: As an admin, I want stylish dark-themed auth pages that match the portfolio's aesthetic when I log in or reset my password.

### Acceptance Criteria

2.1 A new `AuthLayout.jsx` replaces `GuestLayout.jsx` for all auth pages. It has a full-screen dark hero background and a centered frosted-glass card (`max-width: 440px`, `background: rgba(255,255,255,0.05)`, `backdrop-filter: blur(20px)`, `border-radius: 20px`).

2.2 The card shows the "SM" gradient badge at the top, a title, and optional subtitle.

2.3 All form inputs are styled with dark backgrounds, white/light borders, and white text to be readable on the dark card.

2.4 `Login.jsx` uses `AuthLayout` with email + password fields, remember me checkbox, "Forgot password?" link, and a gradient submit button.

2.5 `ForgotPassword.jsx` uses `AuthLayout` with email field and submit button.

2.6 `ResetPassword.jsx` uses `AuthLayout` with email, new password, confirm password fields.

2.7 `Register.jsx` uses `AuthLayout` with name, email, password, confirm password fields.

2.8 All auth functionality (form submission, validation, error display) continues to work correctly via Inertia/Breeze.

---

## Requirement 3: Admin Panel — Sidebar Layout and Enhanced UI

**User Story**: As an admin, I want a professional sidebar-based admin panel where I can manage all portfolio content dynamically.

### Acceptance Criteria

3.1 A new `AdminLayout.jsx` replaces `AuthenticatedLayout` for all admin pages. It has a fixed dark sidebar (260px, `#0f172a` background) with logo, nav links with SVG icons, and user info + logout at the bottom. Main content area has a white/light background.

3.2 The Admin Dashboard shows 4 styled stat cards (with colors and icons for Projects, Skills, Services, Messages) and 6 quick-action navigation cards linking to each admin section.

3.3 All existing admin CRUD pages (Projects, Skills, Services, Experiences, Messages) use `AdminLayout` and retain full create/edit/delete functionality.

3.4 `ProfileSettings.jsx` uses `AdminLayout` and adds file upload inputs: one for avatar (image: jpeg/png/webp, max 2MB) and one for resume (PDF, max 5MB), with preview and upload feedback.

3.5 The active sidebar nav link is visually highlighted.

3.6 The admin panel is accessible only to authenticated users (existing `auth` + `verified` middleware is in place).

---

## Requirement 4: Contact Form Backend

**User Story**: As a visitor, I want to send a message through the contact form on the portfolio page.

### Acceptance Criteria

4.1 The contact form in the Contact section of `Portfolio.jsx` submits to `POST /api/contact` with fields: `name`, `email`, `subject`, `message`.

4.2 Client-side validation rejects empty `name`, invalid `email`, or `message` shorter than 10 characters before making any API call.

4.3 On success (201 response), the form clears and shows a green success message.

4.4 On API error, a red error message is shown and form values are retained.

4.5 The existing `ContactController` and `Contact` model already handle storage — no backend changes needed for basic form submission.

---

## Requirement 5: File Upload Support (Avatar & Resume)

**User Story**: As an admin, I want to upload my profile photo and resume PDF directly from the Profile Settings page.

### Acceptance Criteria

5.1 `POST /api/profile/avatar` accepts a multipart/form-data request with an `avatar` field (image file).

5.2 The uploaded avatar is validated (mime: jpeg/png/jpg/webp, max: 2048KB), stored in `public/images/` with a unique filename, and the `profiles.avatar` column is updated.

5.3 `POST /api/profile/resume` accepts a multipart/form-data request with a `resume` field (PDF file).

5.4 The uploaded resume is validated (mime: pdf, max: 5120KB), stored in `public/images/` with a unique filename, and the `profiles.resume` column is updated.

5.5 Both endpoints return a JSON response with the new file path: `{ "avatar": "images/filename.ext" }` or `{ "resume": "images/filename.pdf" }`.

5.6 Both upload routes are added to `routes/api.php`.

---

## Requirement 6: Dynamic Stats

**User Story**: As a visitor, I want the stats bar on the portfolio to show real counts from the database.

### Acceptance Criteria

6.1 `GET /api/stats` returns `projects_delivered` as the count of records in the `projects` table.

6.2 `GET /api/stats` returns `tech_stack` as the count of distinct skill categories.

6.3 `GET /api/stats` returns `years_exp`, `client_satisfaction`, and `support` as configurable values (hardcoded defaults acceptable: `3`, `"100%"`, `"24/7"`).

6.4 The Stats Bar section on the portfolio page and the Admin Dashboard both consume this endpoint.
