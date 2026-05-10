/**
 * ═══════════════════════════════════════════════════════════════
 * SITAL MAHATO — ANIME CYBERPUNK PORTFOLIO
 * script.js
 *
 * Sections:
 * 1.  Loading Screen
 * 2.  Custom Cursor
 * 3.  Scroll Progress
 * 4.  Navbar
 * 5.  Hero Canvas (Particle System)
 * 6.  Hero Floating Particles
 * 7.  Typing Animation
 * 8.  GSAP Hero Entrance
 * 9.  AOS Init
 * 10. Magnetic Buttons
 * 11. Skill Bars
 * 12. Stats Counter
 * 13. Project Filter
 * 14. Timeline Tabs
 * 15. Contact Form
 * 16. Theme Toggle
 * 17. Music Toggle
 * 18. Back To Top
 * 19. Mouse Glow
 * 20. Mobile Menu
 * ═══════════════════════════════════════════════════════════════
 */

/* ─── 1. LOADING SCREEN ──────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  const bar    = document.querySelector('.loader__bar');
  const pct    = document.querySelector('.loader__percent');
  const canvas = document.getElementById('loaderCanvas');
  const ctx    = canvas.getContext('2d');

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  // Mini particle system for loader
  const dots = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.5,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    alpha: Math.random()
  }));

  let rafId;

  function drawLoader() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach(d => {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0) d.x = canvas.width;
      if (d.x > canvas.width) d.x = 0;
      if (d.y < 0) d.y = canvas.height;
      if (d.y > canvas.height) d.y = 0;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,240,255,${d.alpha * 0.5})`;
      ctx.fill();
    });
    rafId = requestAnimationFrame(drawLoader);
  }

  drawLoader();

  document.body.classList.add('loading');

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 12;
    if (progress > 100) progress = 100;
    const p = Math.round(progress);
    bar.style.width = p + '%';
    pct.textContent  = p + '%';

    if (p >= 100) {
      clearInterval(interval);
      cancelAnimationFrame(rafId);

      setTimeout(() => {
        loader.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        loader.style.opacity    = '0';
        loader.style.transform  = 'translateY(-100%)';
        document.body.classList.remove('loading');

        setTimeout(() => {
          loader.style.display = 'none';
          // Kick off hero entrance after loader
          heroEntrance();
        }, 800);
      }, 300);
    }
  }, 60);
})();


/* ─── 2. CUSTOM CURSOR ──────────────────────────────────────── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursor-trail');
  if (!cursor || !trail) return;

  let mx = 0, my = 0;
  let tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // Smooth trailing
  function followTrail() {
    tx += (mx - tx) * 0.1;
    ty += (my - ty) * 0.1;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(followTrail);
  }
  followTrail();

  // Cursor scale on interactive elements
  const hoverEls = 'a, button, .skill-card, .project-card, .service-card, .social-icon, .tech-icon, input, textarea';

  document.querySelectorAll(hoverEls).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width   = '20px';
      cursor.style.height  = '20px';
      cursor.style.background = 'rgba(0,240,255,0.4)';
      trail.style.width    = '60px';
      trail.style.height   = '60px';
      trail.style.borderColor = 'rgba(0,240,255,0.6)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width   = '';
      cursor.style.height  = '';
      cursor.style.background = '';
      trail.style.width    = '';
      trail.style.height   = '';
      trail.style.borderColor = '';
    });
  });
})();


/* ─── 3. SCROLL PROGRESS ────────────────────────────────────── */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');

  window.addEventListener('scroll', () => {
    const scrollTop    = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (scrollTop / scrollHeight * 100) + '%';
  }, { passive: true });
})();


/* ─── 4. NAVBAR ─────────────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Active link highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();


/* ─── 5. HERO CANVAS PARTICLE SYSTEM ───────────────────────── */
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles, connections;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', () => { resize(); init(); }, { passive: true });

  class Particle {
    constructor() { this.reset(true); }

    reset(init = false) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 10;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -Math.random() * 0.5 - 0.1;
      this.r  = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.6 ? '0,240,255' : Math.random() > 0.5 ? '160,32,240' : '255,45,143';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10 || this.x < -10 || this.x > W + 10) this.reset();
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  function init() {
    const count = Math.min(Math.floor(W * H / 8000), 120);
    particles = Array.from({ length: count }, () => new Particle());
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,240,255,${0.08 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  init();

  let animId;
  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    animId = requestAnimationFrame(animate);
  }

  animate();
})();


/* ─── 6. HERO FLOATING PARTICLES ───────────────────────────── */
(function initFloatParticles() {
  const wrap = document.getElementById('floatParticles');
  if (!wrap) return;

  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.className = 'fp';
    const angle = (i / 12) * Math.PI * 2;
    const radius = 140 + Math.random() * 20;
    p.style.cssText = `
      left: ${50 + Math.cos(angle) * 45}%;
      top:  ${50 + Math.sin(angle) * 45}%;
      width: ${2 + Math.random() * 4}px;
      height: ${2 + Math.random() * 4}px;
      animation-delay: ${Math.random() * 4}s;
      animation-duration: ${3 + Math.random() * 3}s;
      background: ${Math.random() > 0.5 ? '#00f0ff' : Math.random() > 0.5 ? '#a020f0' : '#ff2d8f'};
    `;
    wrap.appendChild(p);
  }
})();


/* ─── 7. TYPING ANIMATION ───────────────────────────────────── */
(function initTyping() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const roles = [
    'Full Stack Developer',
    'UI/UX Designer',
    'React Specialist',
    'Creative Technologist',
    'Cyberpunk Architect'
  ];

  let roleIndex  = 0;
  let charIndex  = 0;
  let isDeleting = false;
  let delay      = 150;

  function type() {
    const current = roles[roleIndex];

    if (isDeleting) {
      el.textContent = current.slice(0, charIndex--);
      delay = 75;
    } else {
      el.textContent = current.slice(0, charIndex++);
      delay = 120;
    }

    if (!isDeleting && charIndex === current.length + 1) {
      delay = 1800; isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  // Start after loader
  setTimeout(type, 2500);
})();


/* ─── 8. GSAP HERO ENTRANCE ─────────────────────────────────── */
function heroEntrance() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('#heroContent .hero__status', { y: 30, opacity: 0, duration: 0.6 })
    .from('#heroContent .hero__greeting',  { y: 20, opacity: 0, duration: 0.5 }, '-=0.3')
    .from('#heroContent .hero__name-first', { x: -50, opacity: 0, duration: 0.7 }, '-=0.2')
    .from('#heroContent .hero__name-last',  { x: -50, opacity: 0, duration: 0.7 }, '-=0.4')
    .from('#heroContent .hero__role',       { y: 20, opacity: 0, duration: 0.5 }, '-=0.3')
    .from('#heroContent .hero__bio',        { y: 20, opacity: 0, duration: 0.5 }, '-=0.3')
    .from('#heroContent .hero__cta .btn',   { y: 20, opacity: 0, stagger: 0.1, duration: 0.5 }, '-=0.2')
    .from('#heroContent .social-icon',      { y: 15, opacity: 0, stagger: 0.08, duration: 0.4 }, '-=0.2')
    .from('#heroPhoto',                     { x: 60, opacity: 0, duration: 0.9, ease: 'back.out(1.2)' }, '-=1.2');

  // Parallax on scroll
  gsap.to('.hero__orb--1', {
    scrollTrigger: { trigger: '.hero', scrub: 1 },
    y: -120, x: -40
  });
  gsap.to('.hero__orb--2', {
    scrollTrigger: { trigger: '.hero', scrub: 1 },
    y: -80, x: 40
  });

  // Section title reveal
  document.querySelectorAll('.section__title').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      y: 40, opacity: 0, duration: 0.8, ease: 'power3.out'
    });
  });

  // Service cards stagger
  gsap.from('.service-card', {
    scrollTrigger: { trigger: '.services__grid', start: 'top 80%' },
    y: 60, opacity: 0, stagger: 0.15, duration: 0.7, ease: 'power3.out'
  });
}


/* ─── 9. AOS INIT ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing:   'ease-out-cubic',
      once:     true,
      offset:   80
    });
  }
});


/* ─── 10. MAGNETIC BUTTONS ──────────────────────────────────── */
(function initMagnetic() {
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', function(e) {
      const rect   = this.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) * 0.35;
      const dy     = (e.clientY - cy) * 0.35;
      this.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    el.addEventListener('mouseleave', function() {
      this.style.transition = 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)';
      this.style.transform  = 'translate(0,0)';
      setTimeout(() => { this.style.transition = ''; }, 400);
    });
  });
})();


/* ─── 11. SKILL BARS ────────────────────────────────────────── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');

  // Build DOM for each bar
  bars.forEach(bar => {
    const skill = bar.dataset.skill;
    const level = bar.dataset.level;

    bar.innerHTML = `
      <div class="skill-bar-label">
        <span>${skill}</span>
        <span>${level}%</span>
      </div>
      <div class="skill-bar-track">
        <div class="skill-bar-fill" data-width="${level}"></div>
      </div>
    `;
  });

  // Animate on intersection
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-bar-fill').forEach(fill => {
          setTimeout(() => {
            fill.style.width = fill.dataset.width + '%';
          }, 200);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-card').forEach(card => observer.observe(card));
})();


/* ─── 12. STATS COUNTER ─────────────────────────────────────── */
(function initCounters() {
  const nums = document.querySelectorAll('.about__stat-num');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +el.dataset.count;
      let   current = 0;
      const step    = Math.ceil(target / 40);
      const timer   = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current + '+';
      }, 40);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  nums.forEach(n => observer.observe(n));
})();


/* ─── 13. PROJECT FILTER ─────────────────────────────────────── */
(function initProjectFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  btns.forEach(btn => {
    btn.addEventListener('click', function() {
      btns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.dataset.filter;

      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.transition = 'opacity 0.3s, transform 0.3s';

        if (show) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            card.style.opacity   = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity   = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => card.classList.add('hidden'), 300);
        }
      });
    });
  });
})();


/* ─── 14. TIMELINE TABS ─────────────────────────────────────── */
(function initTabs() {
  const btns = document.querySelectorAll('.tab-btn');

  btns.forEach(btn => {
    btn.addEventListener('click', function() {
      btns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const tabId = this.dataset.tab;

      document.querySelectorAll('.timeline').forEach(t => t.classList.add('hidden'));
      const target = document.getElementById(tabId + 'Tab');
      if (target) {
        target.classList.remove('hidden');
        // Refresh AOS
        if (typeof AOS !== 'undefined') AOS.refresh();
      }
    });
  });
})();


/* ─── 15. CONTACT FORM ──────────────────────────────────────── */
(function initContactForm() {
  const form   = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      status.className = 'form-status error';
      status.textContent = '⚠ Please fill in all required fields.';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.className = 'form-status error';
      status.textContent = '⚠ Please enter a valid email address.';
      return;
    }

    // Simulate send
    const btn = form.querySelector('button[type=submit]');
    btn.querySelector('.btn__text').textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      status.className = 'form-status success';
      status.textContent = '✓ Message sent! I\'ll reply within 24 hours.';
      form.reset();
      btn.querySelector('.btn__text').textContent = 'Send Message';
      btn.disabled = false;

      setTimeout(() => { status.textContent = ''; status.className = 'form-status'; }, 5000);
    }, 1800);
  });
})();


/* ─── 16. THEME TOGGLE ──────────────────────────────────────── */
(function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const body = document.getElementById('body');

  // Load saved preference
  if (localStorage.getItem('theme') === 'light') {
    body.classList.replace('dark-mode', 'light-mode');
    icon.className = 'fas fa-sun';
  }

  btn && btn.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
      body.classList.replace('dark-mode', 'light-mode');
      icon.className = 'fas fa-sun';
      localStorage.setItem('theme', 'light');
    } else {
      body.classList.replace('light-mode', 'dark-mode');
      icon.className = 'fas fa-moon';
      localStorage.setItem('theme', 'dark');
    }
  });
})();



/* ─── 18. BACK TO TOP ───────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ─── 19. MOUSE GLOW ────────────────────────────────────────── */
(function initMouseGlow() {
  const glow = document.createElement('div');
  glow.className = 'mouse-glow';
  document.body.appendChild(glow);

  let mx = 0, my = 0;
  let tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
  }, { passive: true });

  function animateGlow() {
    tx += (mx - tx) * 0.06;
    ty += (my - ty) * 0.06;
    glow.style.left = tx + 'px';
    glow.style.top  = ty + 'px';
    requestAnimationFrame(animateGlow);
  }

  animateGlow();
})();


/* ─── 20. MOBILE MENU ───────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger && hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

function closeMobileMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on outside click
mobileMenu && mobileMenu.addEventListener('click', e => {
  if (e.target === mobileMenu) closeMobileMenu();
});


/* ─── BONUS: CARD TILT EFFECT ───────────────────────────────── */
(function initTilt() {
  const cards = document.querySelectorAll('.skill-card, .service-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      this.style.transform = `
        perspective(800px)
        rotateX(${-y * 8}deg)
        rotateY(${x * 8}deg)
        translateY(-8px)
      `;
    });

    card.addEventListener('mouseleave', function() {
      this.style.transition = 'transform 0.5s ease';
      this.style.transform  = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
      setTimeout(() => { this.style.transition = ''; }, 500);
    });
  });
})();


/* ─── SMOOTH SCROLL FOR ALL ANCHOR LINKS ────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 70; // navbar height
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ─── GLITCH NAV LINKS ON HOVER ─────────────────────────────── */
document.querySelectorAll('.nav__link').forEach(link => {
  const original = link.textContent;

  link.addEventListener('mouseenter', function() {
    const chars = 'アイウエオカキクケコSITAL0123456789!@#$';
    let iterations = 0;
    const max = original.length * 2;

    const interval = setInterval(() => {
      this.textContent = original.split('').map((c, i) => {
        if (i < iterations / 2) return original[i];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');

      if (iterations >= max) {
        this.textContent = original;
        clearInterval(interval);
      }
      iterations++;
    }, 35);
  });
});


/* ─── INTERSECTION OBSERVER: LAZY SECTION FADE ──────────────── */
(function initFadeIn() {
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.05 });

  sections.forEach(s => {
    s.style.opacity   = '0';
    s.style.transform = 'translateY(30px)';
    s.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    observer.observe(s);
  });
})();
