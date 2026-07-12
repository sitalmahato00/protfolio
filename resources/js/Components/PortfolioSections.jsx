import { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { IconGH, IconArrow, IconExternal, IconWA, IconMail, IconLI, IconTW, IconIG, IconStar } from './PortfolioIcons';

/* ─── IntersectionObserver hook ── */
function useVisible(margin = '-60px') {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: margin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [margin]);
  return [ref, visible];
}

const FadeUp = ({ children, delay = 0, className = '' }) => {
  const [ref, visible] = useVisible('-60px');
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.65s ${delay}s ease, transform 0.65s ${delay}s cubic-bezier(.25,.46,.45,.94)`,
      willChange: 'opacity, transform',
    }}>
      {children}
    </div>
  );
};

const FadeIn = ({ children, delay = 0, className = '' }) => {
  const [ref, visible] = useVisible('-40px');
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transition: `opacity 0.75s ${delay}s ease`,
      willChange: 'opacity',
    }}>
      {children}
    </div>
  );
};

const GlowBtn = ({ href, children, variant = 'primary', onClick, style = {} }) => {
  const Tag = href ? 'a' : 'button';
  return (
    <Tag href={href} onClick={onClick}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noreferrer' : undefined}
      className="glow-btn"
      data-variant={variant}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: variant === 'primary' ? '13px 28px' : '12px 26px',
        borderRadius: 12,
        background: variant === 'primary'
          ? 'linear-gradient(135deg,#7c3aed,#4f46e5)'
          : 'transparent',
        border: variant === 'primary'
          ? '1px solid rgba(124,58,237,.4)'
          : '1px solid rgba(255,255,255,.12)',
        color: '#fff', fontWeight: 600, fontSize: '0.92rem', cursor: 'pointer',
        textDecoration: 'none', whiteSpace: 'nowrap',
        boxShadow: variant === 'primary' ? '0 0 30px rgba(124,58,237,.35),inset 0 1px 0 rgba(255,255,255,.1)' : 'none',
        backdropFilter: 'blur(12px)',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        willChange: 'transform',
        ...style,
      }}>
      {children}
    </Tag>
  );
};

export function PortfolioNavbar({ profile, stuck, menuOpen, setMenuOpen, activeNav, navTo, navLinks }) {
  return (
    <nav className={`nav-root${stuck ? ' stuck' : ''}`} style={{ zIndex: 1000 }}>
      <a href="#home" onClick={e => navTo(e, 'home')} style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.8rem', fontWeight: 900, boxShadow: '0 0 20px rgba(124,58,237,.4)' }}>SM</div>
        <span>{profile?.name || 'Sital Mahato'}</span>
      </a>

      <div className="nav-links-row" style={{ display: 'flex', gap: 2 }}>
        {navLinks.map(l => (
          <a key={l} href={`#${l}`} onClick={e => navTo(e, l)} className={`nav-link${activeNav === l ? ' active' : ''}`}>
            {l.charAt(0).toUpperCase() + l.slice(1)}
          </a>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <a href={`mailto:${profile?.email || 'sitalmahato077@gmail.com'}`}
          className="hide-mob"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 18px', borderRadius: 10,
            background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
            border: '1px solid rgba(124,58,237,.4)',
            color: '#fff', fontWeight: 600, fontSize: '.84rem',
            textDecoration: 'none', whiteSpace: 'nowrap',
            boxShadow: '0 0 20px rgba(124,58,237,.3)',
          }}>
          Hire Me <IconArrow />
        </a>
        <button onClick={() => setMenuOpen(!menuOpen)} className="mob-menu-show" style={{ display: 'none', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 9, cursor: 'pointer', color: '#fff', padding: '7px', lineHeight: 0 }} aria-label="Menu">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="mob-menu-panel" style={{
          position: 'fixed', top: 78, left: 12, right: 12, zIndex: 999,
          background: 'rgba(8,11,28,.97)', backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,.10)', borderRadius: 14,
          padding: '12px 20px 20px', display: 'flex', flexDirection: 'column', gap: 4,
          opacity: 1, transform: 'translateY(0)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
        }}>
          {navLinks.map(l => (
            <a key={l} href={`#${l}`} onClick={e => navTo(e, l)} style={{ color: 'rgba(226,232,240,.7)', fontWeight: 500, padding: '12px 16px', borderRadius: 10, fontSize: '.95rem' }}>
              {l.charAt(0).toUpperCase() + l.slice(1)}
            </a>
          ))}
          <a href={`mailto:${profile?.email || 'sitalmahato077@gmail.com'}`} style={{ marginTop: 8, textAlign: 'center', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', padding: '12px', borderRadius: 10, fontWeight: 700 }}>
            Hire Me
          </a>
        </div>
      )}
    </nav>
  );
}

export function PortfolioHero({
  profile, stats, skills, words, typedText, mouse, avatarUrl, resumeUrl, seoName, navTo, techStack
}) {
  return (
    <section id="home" className="hero-section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', padding: '0 40px' }}>
      <div className="hero-grid-bg" />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '900px', height: '900px', background: 'radial-gradient(circle,rgba(124,58,237,.08) 0%,transparent 65%)', pointerEvents: 'none' }} />

      <div className="hero-inner" style={{ maxWidth: 1200, width: '100%', margin: '0 auto', paddingTop: 100, paddingBottom: 60 }}>
        <div className="hero-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 480px', gap: 60, alignItems: 'center' }}>
          <div className="hero-left-col" style={{ animation: 'counter-up .7s ease both' }}>
            <div className="hero-mob-stats" style={{ display: 'none', gap: 10, justifyContent: 'center', width: '100%', marginBottom: 24 }}>
              {[
                { n: `${stats.projects_delivered || 6}+`, l: 'Projects' },
                { n: `${techStack.length}+`, l: 'Tech Stack' },
                { n: `${stats.years_exp || 3}+`, l: 'Yrs Exp.' },
              ].map(s => (
                <div key={s.l} style={{ flex: 1, textAlign: 'center', padding: '14px 8px', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 14 }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(135deg,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: "'Space Grotesk'" }}>{s.n}</div>
                  <div style={{ fontSize: '.72rem', color: 'rgba(148,163,184,.6)', marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>

            <div className="hero-available" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,.08)', border: '1px solid rgba(16,185,129,.2)', padding: '6px 14px', borderRadius: 999, fontSize: '.78rem', fontWeight: 600, color: '#34d399', marginBottom: 20 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
              {profile?.availability || 'Available for Work'}
            </div>

            <div className="hero-typewriter" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '1rem', color: '#7c3aed', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 4, minHeight: '1.6em' }}>
              <span style={{ color: 'rgba(124,58,237,.6)' }}>&#62;_ </span>
              <span style={{ color: '#a78bfa' }}>{typedText}</span>
              <span style={{ width: 2, height: '1.1em', background: '#7c3aed', animation: 'blink .75s step-end infinite', display: 'inline-block', verticalAlign: 'middle', marginLeft: 2 }} />
            </div>

            <h1 className="hero-title" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(52px,6vw,88px)', fontWeight: 800, lineHeight: 1.05, marginBottom: 24, letterSpacing: '-0.03em' }}>
              <span style={{ display: 'block', color: 'rgba(226,232,240,.7)', fontSize: 'clamp(36px,4vw,52px)', fontWeight: 300, letterSpacing: '-.01em', marginBottom: 4 }}>Hello, I'm</span>
              <span className="grad-text">{profile?.name || 'Sital Mahato'}</span>
            </h1>

            <p style={{ color: 'rgba(148,163,184,.75)', fontSize: '1.05rem', maxWidth: 460, lineHeight: 1.75, marginBottom: 40 }}>
              {profile?.bio?.slice(0, 140) || 'I build scalable web applications and digital experiences that help businesses grow and succeed in the digital world.'}
            </p>

            <div className="hero-ctas" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48, alignItems: 'center', width: '100%' }}>
              <div className="hero-cta-row1" style={{ display: 'contents' }}>
                <GlowBtn href={`mailto:${profile?.email || 'sitalmahato077@gmail.com'}`}
                  style={{ flex: 1, justifyContent: 'center', background: 'linear-gradient(135deg,#e53e3e,#c53030)', borderColor: 'rgba(229,62,62,.4)', boxShadow: '0 0 24px rgba(229,62,62,.3)' }}>
                  Hire Me
                </GlowBtn>
                {resumeUrl && <GlowBtn href={resumeUrl} variant="outline" style={{ flex: 1, justifyContent: 'center' }}>
                  Download CV
                </GlowBtn>}
              </div>
              <div className="hero-cta-row2" style={{ display: 'contents' }}>
                <GlowBtn href={`https://wa.me/${(profile?.phone || '9779704191610').replace(/\D/g, '')}`}
                  style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)', borderColor: 'rgba(22,163,74,.4)', boxShadow: '0 0 24px rgba(22,163,74,.3)', justifyContent: 'center', width: '100%' }}>
                  <IconWA /> WhatsApp
                </GlowBtn>
              </div>
            </div>

            <div className="hero-socials" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {[
                { href: profile?.github || 'https://github.com/sitalmahato00', Icon: IconGH, label: 'GitHub' },
                { href: profile?.linkedin || 'https://linkedin.com/in/sitalmahato', Icon: IconLI, label: 'LinkedIn' },
                { href: `mailto:${profile?.email || 'sitalmahato077@gmail.com'}`, Icon: IconMail, label: 'Email' },
              ].map(s => (
                <a key={s.label} href={s.href} title={s.label}
                  target={s.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                  className="hero-social-link"
                  style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(148,163,184,.7)' }}>
                  <s.Icon />
                </a>
              ))}
            </div>
          </div>

          <div className="hero-avatar-mob" style={{ display: 'none', justifyContent: 'center', alignItems: 'center', marginTop: 8, marginBottom: 8 }}>
            <AvatarOrbit avatarUrl={avatarUrl} seoName={seoName} size={300} ringSizes={[260, 232, 210]} orbitR={138} badges={[
              { label: 'React', color: '#61dafb', src: 'https://cdn.simpleicons.org/react/61dafb' },
              { label: 'Laravel', color: '#ff2d20', src: 'https://cdn.simpleicons.org/laravel/ff2d20' },
              { label: 'PHP', color: '#777bb4', src: 'https://cdn.simpleicons.org/php/777bb4' },
              { label: 'MySQL', color: '#4479a1', src: 'https://cdn.simpleicons.org/mysql/4479a1' },
              { label: 'JS', color: '#f7df1e', src: 'https://cdn.simpleicons.org/javascript/f7df1e' },
              { label: 'Tailwind', color: '#38bdf8', src: 'https://cdn.simpleicons.org/tailwindcss/38bdf8' },
            ]} />
          </div>

          <div className="hero-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
            <AvatarOrbit avatarUrl={avatarUrl} seoName={seoName} size={500} ringSizes={[420, 380, 350]} orbitR={230} badges={[
              { label: 'React', color: '#61dafb', src: 'https://cdn.simpleicons.org/react/61dafb' },
              { label: 'Laravel', color: '#ff2d20', src: 'https://cdn.simpleicons.org/laravel/ff2d20' },
              { label: 'PHP', color: '#777bb4', src: 'https://cdn.simpleicons.org/php/777bb4' },
              { label: 'MySQL', color: '#4479a1', src: 'https://cdn.simpleicons.org/mysql/4479a1' },
              { label: 'JavaScript', color: '#f7df1e', src: 'https://cdn.simpleicons.org/javascript/f7df1e' },
              { label: 'Tailwind', color: '#38bdf8', src: 'https://cdn.simpleicons.org/tailwindcss/38bdf8' },
            ]} />
          </div>
        </div>

        <FadeUp delay={.7}>
          <div className="stat-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginTop: 60, paddingTop: 60, borderTop: '1px solid rgba(255,255,255,.05)' }}>
            {[
              { n: `${stats.projects_delivered || 18}+`, l: 'Projects Delivered', color: '#a78bfa' },
              { n: `${stats.years_exp || 3}+`, l: 'Years Experience', color: '#fbbf24' },
              { n: stats.client_satisfaction || '100%', l: 'Client Satisfaction', color: '#34d399' },
              { n: stats.support || '24/7', l: 'Support Available', color: '#60a5fa' },
            ].map(s => (
              <div key={s.l} className="stat-card">
                <div style={{ fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(135deg,#fff,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: "'Space Grotesk'" }}>{s.n}</div>
                <div style={{ fontSize: '.78rem', color: 'rgba(148,163,184,.6)', marginTop: 4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function AvatarOrbit({ avatarUrl, seoName, size, ringSizes, orbitR, badges }) {
  const cx = size / 2;
  const cy = size / 2;
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: ringSizes[0], height: ringSizes[0], borderRadius: '50%', background: 'conic-gradient(from 0deg, #7c3aed, #4f46e5, #3b82f6, #06b6d4, #7c3aed)', animation: 'spin-slow 25s linear infinite', WebkitMask: `radial-gradient(farthest-side,transparent calc(100% - 2px),#000 calc(100% - 2px))`, mask: `radial-gradient(farthest-side,transparent calc(100% - 2px),#000 calc(100% - 2px))`, opacity: .85, filter: 'blur(.5px)' }} />
      <div style={{ position: 'absolute', width: ringSizes[1], height: ringSizes[1], borderRadius: '50%', border: '1.5px dashed rgba(167,139,250,.35)', animation: 'spin-rev 18s linear infinite' }} />
      <div style={{ position: 'absolute', width: ringSizes[2], height: ringSizes[2], borderRadius: '50%', border: '1px solid rgba(59,130,246,.2)', animation: 'pulse-glow 4s ease-in-out infinite', boxShadow: 'inset 0 0 30px rgba(124,58,237,.08)' }} />
      <div className="orbit-container" style={{ position: 'absolute', inset: 0, width: size, height: size, pointerEvents: 'none', zIndex: 6, animation: 'spin-slow 30s linear infinite' }}>
        {badges.map((item, i, arr) => {
          const deg = (360 / arr.length) * i - 90;
          const rad = (deg * Math.PI) / 180;
          const x = cx + orbitR * Math.cos(rad);
          const y = cy + orbitR * Math.sin(rad);
          const bg = `rgba(${item.color === '#61dafb' ? '97,218,251' : item.color === '#ff2d20' ? '255,45,32' : item.color === '#777bb4' ? '119,123,180' : item.color === '#4479a1' ? '68,121,161' : item.color === '#f7df1e' ? '247,223,30' : '56,189,248'},.12)`;
          const border = `1.5px solid ${item.color}66`;
          return (
            <div key={item.label} className="orbit-badge" style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', zIndex: 7, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: size > 400 ? 5 : 3, animation: 'spin-rev 30s linear infinite' }}>
              <div style={{ width: size > 400 ? 46 : 34, height: size > 400 ? 46 : 34, borderRadius: '50%', background: bg, border: border, backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${item.color}55`, animation: 'spin-slow 8s linear infinite' }}>
                <img src={item.src} alt={item.label} width={size > 400 ? 26 : 18} height={size > 400 ? 26 : 18} style={{ display: 'block', objectFit: 'contain' }} onError={e => { e.target.style.display = 'none'; }} />
              </div>
              <span style={{ fontSize: size > 400 ? '.63rem' : '.56rem', fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", color: item.color, background: 'rgba(5,8,22,.9)', border: border, borderRadius: 6, padding: '2px 8px', whiteSpace: 'nowrap', backdropFilter: 'blur(10px)' }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: size > 400 ? 280 : 168, height: size > 400 ? 280 : 168, borderRadius: '50%', zIndex: 5, boxShadow: size > 400 ? '0 0 60px rgba(124,58,237,.35), 0 0 120px rgba(124,58,237,.15)' : '0 0 40px rgba(124,58,237,.4)' }}>
        {avatarUrl
          ? <img fetchpriority="high" src={avatarUrl} alt={seoName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top center', border: '2.5px solid rgba(124,58,237,.5)', display: 'block' }} />
          : <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size > 400 ? '4.5rem' : '3rem', fontWeight: 900, color: '#fff' }}>SM</div>
        }
      </div>
    </div>
  );
}

export function PortfolioMarquee({ techStack }) {
  return (
    <div style={{ padding: '32px 0', borderTop: '1px solid rgba(255,255,255,.04)', borderBottom: '1px solid rgba(255,255,255,.04)', overflow: 'hidden', background: 'rgba(0,0,0,.2)', backdropFilter: 'blur(10px)' }}>
      <div style={{ overflow: 'hidden' }}>
        <div className="marquee-track">
          {[...techStack, ...techStack].map((t, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 16px', borderRadius: 999, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', color: 'rgba(226,232,240,.55)', fontSize: '.82rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
              <img src={t.src} alt={t.label} width={16} height={16} style={{ display: 'block', objectFit: 'contain', flexShrink: 0 }} onError={e => e.target.style.display = 'none'} />
              {t.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PortfolioAbout({ profile, stats, avatarUrl, seoName, resumeUrl }) {
  return (
    <section id="about" style={{ padding: '140px 40px', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="about-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
          <div>
            <FadeUp>
              <div className="section-label" style={{ marginBottom: 20 }}>About Me</div>
              <h2 style={{ fontFamily: "'Space Grotesk'", fontSize: 'clamp(36px,4vw,52px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 28, letterSpacing: '-.02em' }}>
                Building solutions with <span className="grad-text-purple">code</span> & creativity.
              </h2>
              <p style={{ color: 'rgba(148,163,184,.8)', fontSize: '1rem', lineHeight: 1.85, marginBottom: 32 }}>
                {profile?.bio || `I'm ${seoName}, a passionate Full Stack Developer with experience building modern web applications. I specialise in creating efficient, scalable, and user-friendly solutions using clean code and best practices.`}
              </p>
            </FadeUp>
            <FadeUp delay={.15}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
                {[
                  { k: 'Name', v: profile?.name || 'Sital Mahato' },
                  { k: 'Email', v: profile?.email || 'sitalmahato077@gmail.com' },
                  { k: 'Phone', v: profile?.phone || '+977 9704191610' },
                  { k: 'Location', v: profile?.location || 'Nepal' },
                ].map(r => (
                  <div key={r.k} style={{ display: 'flex', gap: 16, padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.05)', alignItems: 'center' }}>
                    <span style={{ fontSize: '.75rem', fontWeight: 700, color: 'rgba(148,163,184,.4)', minWidth: 70, fontFamily: "'JetBrains Mono'", textTransform: 'uppercase' }}>{r.k}</span>
                    <span style={{ fontSize: '.88rem', color: 'rgba(226,232,240,.8)' }}>{r.v}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 16, padding: '12px 16px', borderRadius: 12, background: 'rgba(16,185,129,.05)', border: '1px solid rgba(16,185,129,.15)', alignItems: 'center' }}>
                  <span style={{ fontSize: '.75rem', fontWeight: 700, color: 'rgba(148,163,184,.4)', minWidth: 70, fontFamily: "'JetBrains Mono'", textTransform: 'uppercase' }}>Status</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#34d399', fontSize: '.82rem', fontWeight: 700 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
                    {profile?.availability || 'Available for Work'}
                  </span>
                </div>
              </div>
            </FadeUp>
            <FadeUp delay={.2}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 4 }}>
                {[
                  { n: `${stats.projects_delivered || 18}+`, l: 'Projects' },
                  { n: `${stats.tech_stack || 16}+`, l: 'Technologies' },
                  { n: `${stats.years_exp || 3}+`, l: 'Years' },
                ].map(s => (
                  <div key={s.l} style={{ textAlign: 'center', padding: '16px 10px', borderRadius: 14, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: "'Space Grotesk'", background: 'linear-gradient(135deg,#fff,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.n}</div>
                    <div style={{ fontSize: '.7rem', color: 'rgba(148,163,184,.5)', marginTop: 3 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </FadeUp>
            {resumeUrl && (
              <FadeUp delay={.3}>
                <GlowBtn href={resumeUrl} style={{ marginTop: 20 }}>Download CV <IconArrow /></GlowBtn>
              </FadeUp>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {avatarUrl && (
              <FadeIn delay={.1}>
                <div className="grad-border" style={{ borderRadius: 24, overflow: 'hidden' }}>
                  <img src={avatarUrl} alt={seoName} loading="lazy" width="400" height="400" style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain', borderRadius: 24 }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(5,8,22,.75) 0%,transparent 55%)', pointerEvents: 'none', borderRadius: 24 }} />
                  <div style={{ position: 'absolute', bottom: 18, left: 20 }}>
                    <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{profile?.name || 'Sital Mahato'}</div>
                    <div style={{ color: 'rgba(167,139,250,.8)', fontSize: '.8rem', marginTop: 2 }}>Full Stack Developer · Nepal</div>
                  </div>
                </div>
              </FadeIn>
            )}
            <FadeIn delay={.2}>
              <div className="terminal" style={{ animation: 'float 6s ease-in-out infinite' }}>
                <div className="terminal-bar">
                  <div className="terminal-dot" style={{ background: '#ff5f57' }} />
                  <div className="terminal-dot" style={{ background: '#febc2e' }} />
                  <div className="terminal-dot" style={{ background: '#28c840' }} />
                  <span style={{ marginLeft: 8, fontSize: '.72rem', color: 'rgba(148,163,184,.5)', fontFamily: "'JetBrains Mono'" }}>{profile?.name || 'sital-mahato'} ~ portfolio</span>
                </div>
                <div className="terminal-body">
                  <div><span className="kw">const</span> <span className="fn">dev</span> = {'{'}</div>
                  <div>&nbsp;&nbsp;name: <span className="str">"{profile?.name || 'Sital Mahato'}"</span>,</div>
                  <div>&nbsp;&nbsp;role: <span className="str">"Full Stack Dev"</span>,</div>
                  <div>&nbsp;&nbsp;exp: <span className="str">"{stats.years_exp || 3}+ years"</span>,</div>
                  <div>&nbsp;&nbsp;projects: <span className="str">{stats.projects_delivered || 18}+</span>,</div>
                  <div>&nbsp;&nbsp;location: <span className="str">"Nepal"</span>,</div>
                  <div>&nbsp;&nbsp;status: <span className="str">"open to work"</span>,</div>
                  <div>{'}'}</div>
                  <div style={{ marginTop: 8 }}><span className="cm">// currently building something cool</span></div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PortfolioSkills({ skills, skillTab, setSkillTab }) {
  return (
    <section id="skills" className="skills-section" style={{ padding: '140px 40px', background: 'rgba(0,0,0,.25)', backdropFilter: 'blur(4px)', position: 'relative' }}>
      <div style={{ position: 'absolute', top: -1, left: 0, right: 0, height: 80, background: 'linear-gradient(to bottom right,#050816 49.9%,transparent 50%)', zIndex: 1 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <FadeUp>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-label" style={{ justifyContent: 'center', marginBottom: 16 }}>My Skills</div>
            <h2 style={{ fontFamily: "'Space Grotesk'", fontSize: 'clamp(32px,4vw,48px)', fontWeight: 800, letterSpacing: '-.02em' }}>
              Technologies I <span className="grad-text">Master</span>
            </h2>
          </div>
        </FadeUp>
        <FadeUp delay={.1}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 60 }}>
            {Object.entries(skills).flatMap(([, items]) => items).map((s, i) => (
              <div key={s.id || i}
                className="skill-pill"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 999, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', color: 'rgba(226,232,240,.7)', fontSize: '.84rem', fontWeight: 500, cursor: 'default', transition: 'all .2s' }}>
                {s.icon && <span style={{ fontSize: '1rem' }}>{s.icon}</span>}
                {s.name}
              </div>
            ))}
          </div>
        </FadeUp>
        {Object.keys(skills).length > 0 && (
          <FadeUp delay={.2}>
            <div className="grad-border skills-card" style={{ padding: 36 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
                {Object.keys(skills).map(cat => (
                  <button key={cat} onClick={() => setSkillTab(cat)}
                    className="skill-tab"
                    style={{
                      padding: '8px 20px', borderRadius: 999, fontSize: '.82rem', fontWeight: 600, border: '1px solid', cursor: 'pointer', transition: 'all .25s',
                      background: skillTab === cat ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : 'rgba(255,255,255,.04)',
                      borderColor: skillTab === cat ? 'transparent' : 'rgba(255,255,255,.08)',
                      color: skillTab === cat ? '#fff' : 'rgba(148,163,184,.6)',
                      boxShadow: skillTab === cat ? '0 0 20px rgba(124,58,237,.3)' : 'none',
                    }}>
                    {cat}
                  </button>
                ))}
              </div>
              <div className="skills-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '10px 32px' }}>
                {(skills[skillTab] || []).map((s, i) => (
                  <div key={s.id || i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: '.85rem', fontWeight: 600, color: 'rgba(226,232,240,.85)' }}>{s.icon} {s.name}</span>
                      <span style={{ fontSize: '.75rem', color: 'rgba(124,58,237,.8)', fontFamily: "'JetBrains Mono'" }}>{s.level || 80}%</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 4, background: 'rgba(255,255,255,.05)', overflow: 'hidden' }}>
                      <div className="skill-bar-fill" style={{ width: `${s.level || 80}%`, height: '100%', borderRadius: 4, background: 'linear-gradient(90deg,#7c3aed,#3b82f6)', transition: 'width 1.2s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        )}
      </div>
    </section>
  );
}

export function PortfolioProjects({ projects, allTags, projFilter, setProjFilter, filteredProjects, allImgs, hoveredProj, setHoveredProj }) {
  return (
    <section id="projects" style={{ padding: '140px 40px', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <FadeUp>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 48 }}>
            <div>
              <div className="section-label" style={{ marginBottom: 14 }}>My Work</div>
              <h2 style={{ fontFamily: "'Space Grotesk'", fontSize: 'clamp(32px,4vw,52px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-.02em' }}>
                Featured <span className="grad-text">Projects</span>
              </h2>
            </div>
            <Link href="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(167,139,250,.8)', fontWeight: 600, fontSize: '.88rem', border: '1px solid rgba(124,58,237,.25)', padding: '8px 18px', borderRadius: 10, transition: 'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,.1)'; e.currentTarget.style.color = '#c4b5fd'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(167,139,250,.8)'; }}>
              View All <IconArrow />
            </Link>
          </div>
        </FadeUp>
        <FadeUp delay={.1}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}>
            {['all', ...allTags].map(t => (
              <button key={t} onClick={() => setProjFilter(t)}
                className="proj-filter-btn"
                style={{
                  padding: '6px 16px', borderRadius: 999, fontSize: '.8rem', fontWeight: 600, border: '1px solid', cursor: 'pointer', transition: 'all .2s',
                  background: projFilter === t ? 'rgba(124,58,237,.2)' : 'transparent',
                  borderColor: projFilter === t ? 'rgba(124,58,237,.5)' : 'rgba(255,255,255,.08)',
                  color: projFilter === t ? '#c4b5fd' : 'rgba(148,163,184,.6)',
                }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </FadeUp>
        <div className="proj-bento" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {filteredProjects.slice(0, 8).map((p, i) => {
            const imgs = allImgs(p);
            return (
              <div key={p.id} style={{ minWidth: 0 }}>
                <Link href={`/project/${p.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                  <div className="grad-border project-card-inner"
                    style={{ borderRadius: 16, overflow: 'hidden', background: 'rgba(5,8,22,.8)', display: 'flex', flexDirection: 'column', height: '100%', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
                    onMouseEnter={() => setHoveredProj(p.id)}
                    onMouseLeave={() => setHoveredProj(null)}>
                    <div style={{ height: 160, overflow: 'hidden', flexShrink: 0, background: 'rgba(255,255,255,.03)', position: 'relative' }}>
                      {imgs.length > 0
                        ? <img src={imgs[0]} alt={p.title} loading="lazy" width="400" height="225"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block', transition: 'transform 0.4s ease', transform: hoveredProj === p.id ? 'scale(1.06)' : 'scale(1)' }} />
                        : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,rgba(124,58,237,.15),rgba(59,130,246,.15))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>🚀</div>
}
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,transparent 60%,rgba(5,8,22,.5) 100%)', pointerEvents: 'none' }} />
                      <div style={{ position: 'absolute', top: 10, right: 10, width: 28, height: 28, borderRadius: 7, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.7)' }}>
                        <IconExternal />
                      </div>
                    </div>
                    <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {(p.tags || []).slice(0, 2).map(t => <span key={t} className="tag-pill" style={{ fontSize: '.68rem', padding: '2px 9px' }}>{t}</span>)}
                      </div>
                      <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: '.92rem', color: '#fff', lineHeight: 1.3, margin: 0 }}>{p.title}</h3>
                      <p style={{ color: 'rgba(148,163,184,.6)', fontSize: '.78rem', lineHeight: 1.55, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>{p.description}</p>
                      <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                        {p.live_url && p.live_url !== '#' && (
                          <span onClick={e => { e.preventDefault(); e.stopPropagation(); window.open(p.live_url, '_blank'); }}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(124,58,237,.2)', border: '1px solid rgba(124,58,237,.4)', color: '#c4b5fd', borderRadius: 7, padding: '4px 10px', fontSize: '.72rem', fontWeight: 700, cursor: 'pointer' }}>
                            Live <IconExternal />
                          </span>
                        )}
                        {p.github_url && (
                          <span onClick={e => { e.preventDefault(); e.stopPropagation(); window.open(p.github_url, '_blank'); }}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.09)', color: 'rgba(226,232,240,.6)', borderRadius: 7, padding: '4px 10px', fontSize: '.72rem', fontWeight: 600, cursor: 'pointer' }}>
                            <IconGH /> Code
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function PortfolioServices({ services, profile }) {
  return (
    <section id="services" style={{ padding: '140px 40px', background: 'rgba(0,0,0,.2)', position: 'relative' }}>
      <div style={{ position: 'absolute', top: -1, left: 0, right: 0, height: 80, background: 'linear-gradient(to bottom left,#050816 49.9%,transparent 50%)', zIndex: 1 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <FadeUp>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <div className="section-label" style={{ justifyContent: 'center', marginBottom: 16 }}>Services</div>
            <h2 style={{ fontFamily: "'Space Grotesk'", fontSize: 'clamp(32px,4vw,52px)', fontWeight: 800, letterSpacing: '-.02em' }}>
              What I <span className="grad-text">Offer</span>
            </h2>
          </div>
        </FadeUp>
        <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {(services.length > 0 ? services : [
            { id: 1, title: 'Full Stack Development', description: 'End-to-end web application development using Laravel, React, and modern tech stacks.', features: ['Custom web applications', 'RESTful API development', 'Database design & optimization', 'Third-party integrations'], price: 'From $500' },
            { id: 2, title: 'UI/UX Design', description: 'Beautiful, intuitive interfaces crafted with user experience best practices and modern design principles.', features: ['Responsive design', 'Wireframing & prototyping', 'Design systems', 'Figma to code'], price: 'From $300' },
            { id: 3, title: 'Backend Development', description: 'Robust server-side solutions with Laravel, PHP, and scalable database architecture.', features: ['Laravel development', 'API design & documentation', 'Performance optimization', 'Server management'], price: 'From $400' },
          ]).map((s, i) => {
            const iconMap = [
              { test: k => k.includes('full stack') || k.includes('frontend') || k.includes('react') || k.includes('next'), color: '#61dafb' },
              { test: k => k.includes('ui') || k.includes('ux') || k.includes('design') || k.includes('figma'), color: '#f472b6' },
              { test: k => k.includes('laravel') || k.includes('php') || k.includes('backend') || k.includes('api'), color: '#ff2d20' },
              { test: k => k.includes('mobile') || k.includes('app') || k.includes('pwa'), color: '#fb923c' },
              { test: k => k.includes('seo') || k.includes('optim') || k.includes('performance'), color: '#fbbf24' },
              { test: k => k.includes('ecommerce') || k.includes('shop') || k.includes('store'), color: '#a78bfa' },
            ];
            const match = iconMap.find(m => m.test((s.title || '').toLowerCase())) || { color: '#a78bfa' };
            return (
              <FadeUp key={s.id} delay={i * .08}>
                <div className="grad-border service-card" style={{ padding: 32, height: '100%', cursor: 'default', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
                  <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: '1.05rem', color: '#fff', marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ color: 'rgba(148,163,184,.78)', fontSize: '.85rem', lineHeight: 1.75, marginBottom: 16 }}>{s.description}</p>
                  {(s.features || []).slice(0, 4).map((f, fi) => (
                    <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.8rem', color: 'rgba(148,163,184,.6)', marginBottom: 6 }}>
                      <span style={{ color: '#7c3aed', fontSize: '.6rem' }}>✦</span>{f}
                    </div>
                  ))}
                  {s.price && <div style={{ marginTop: 14, fontSize: '.82rem', fontWeight: 700, color: '#a78bfa' }}>{s.price}</div>}
                  <a href={`mailto:${profile?.email || 'sitalmahato077@gmail.com'}`}
                    className="service-cta"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 20, color: 'rgba(167,139,250,.7)', fontSize: '.82rem', fontWeight: 600, transition: 'transform 0.2s ease' }}>
                    Get Started <IconArrow />
                  </a>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function PortfolioExperience({ experiences, profile, workExp, eduExp }) {
  return (
    <section id="experience" style={{ padding: '140px 40px', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <FadeUp>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <div className="section-label" style={{ justifyContent: 'center', marginBottom: 16 }}>Journey</div>
            <h2 style={{ fontFamily: "'Space Grotesk'", fontSize: 'clamp(32px,4vw,52px)', fontWeight: 800, letterSpacing: '-.02em' }}>
              Experience &amp; <span className="grad-text">Journey</span>
            </h2>
          </div>
        </FadeUp>
        <div className="exp-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }}>
          <FadeUp delay={.1}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: '.75rem', fontWeight: 700, color: 'rgba(124,58,237,.7)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 20, fontFamily: "'JetBrains Mono'" }}>Work Experience</div>
              <div style={{ position: 'relative' }}>
                {(workExp.length > 0 ? workExp : [
                  { title: 'Full Stack Developer', subtitle: 'Freelance / Remote', period: '2023–Present', description: 'Building modern web applications for clients worldwide using Laravel, React, and cloud technologies.', tags: ['Laravel', 'React', 'AWS'] },
                  { title: 'Backend Developer', subtitle: 'Various Startups', period: '2021–2023', description: 'Developed scalable APIs and backend systems. Led database optimisation initiatives.', tags: ['PHP', 'MySQL', 'REST API'] },
                  { title: 'Junior Developer', subtitle: 'NabTech Nepal', period: '2019–2021', description: 'Worked on frontend and backend web business systems for local enterprises.', tags: ['JavaScript', 'PHP', 'jQuery'] },
                ]).map((exp, i, arr) => (
                  <div key={exp.id || i} className="exp-item" style={{ display: 'flex', gap: 20, paddingBottom: 28, position: 'relative' }}>
                    {i < arr.length - 1 && <div className="tl-line" />}
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1, boxShadow: '0 0 20px rgba(124,58,237,.4)' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" width="18" height="18"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /><line x1="12" y1="12" x2="12" y2="12" /><path d="M12 12h.01" /></svg>
                    </div>
                    <div className="grad-border" style={{ padding: 18, flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                        <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: '.95rem', color: '#fff' }}>{exp.title}</div>
                        <span className="tag-pill">{exp.period || exp.date || ''}</span>
                      </div>
                      <div style={{ fontSize: '.82rem', color: '#a78bfa', fontWeight: 600, marginBottom: 8 }}>{exp.subtitle || exp.company || ''}</div>
                      <div style={{ fontSize: '.83rem', color: 'rgba(148,163,184,.78)', lineHeight: 1.65 }}>{exp.description}</div>
                      {(exp.tags || []).length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10 }}>{(exp.tags || []).map(t => <span key={t} className="tag-pill">{t}</span>)}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={.2}>
            <div>
              <div style={{ fontSize: '.75rem', fontWeight: 700, color: 'rgba(59,130,246,.7)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 20, fontFamily: "'JetBrains Mono'" }}>Education</div>
              <div style={{ position: 'relative', marginBottom: 40 }}>
                {(eduExp.length > 0 ? eduExp : [
                  { title: 'Bachelor of Computer Engineering', subtitle: 'Tribhuvan University', period: '2019–2023', description: 'Graduated with distinction. Focus on software engineering, algorithms, and web technologies.' },
                ]).map((exp, i) => (
                  <div key={exp.id || i} className="exp-item" style={{ display: 'flex', gap: 20, paddingBottom: 24 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 20px rgba(59,130,246,.3)' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" width="18" height="18"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                    </div>
                    <div className="grad-border" style={{ padding: 18, flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                        <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: '.9rem', color: '#fff' }}>{exp.title}</div>
                        <span className="tag-pill" style={{ borderColor: 'rgba(59,130,246,.3)', color: '#93c5fd', background: 'rgba(59,130,246,.1)' }}>{exp.period || exp.date || ''}</span>
                      </div>
                      <div style={{ fontSize: '.82rem', color: '#60a5fa', fontWeight: 600, marginBottom: 6 }}>{exp.subtitle || exp.company || ''}</div>
                      <div style={{ fontSize: '.82rem', color: 'rgba(148,163,184,.78)', lineHeight: 1.65 }}>{exp.description}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grad-border" style={{ padding: 28 }}>
                <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, color: '#fff', marginBottom: 18, fontSize: '1rem' }}>Why Work With Me?</div>
                {['Clean & efficient code', 'On-time delivery, always', 'Clear communication throughout', 'Client satisfaction first'].map((r, i) => (
                  <div key={r} className="why-item" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, color: 'rgba(148,163,184,.75)', fontSize: '.87rem' }}>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(16,185,129,.12)', border: '1px solid rgba(16,185,129,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.55rem', color: '#34d399', flexShrink: 0 }}>✓</span>
                    {r}
                  </div>
                ))}
                <GlowBtn href={`mailto:${profile?.email || 'sitalmahato077@gmail.com'}`} style={{ marginTop: 8, width: '100%', justifyContent: 'center' }}>
                  Let's Work Together <IconArrow />
                </GlowBtn>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

export function PortfolioContact({ profile, contactForm, setContactForm, cStatus, setCStatus, cErrors, setCErrors, submitContact }) {
  return (
    <section id="contact" style={{ padding: '100px 40px 80px', background: 'rgba(0,0,0,.25)', position: 'relative' }}>
      <div style={{ position: 'absolute', top: -1, left: 0, right: 0, height: 80, background: 'linear-gradient(to bottom right,#050816 49.9%,transparent 50%)', zIndex: 1 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <FadeUp>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <div className="section-label" style={{ justifyContent: 'center', marginBottom: 16 }}>Get In Touch</div>
            <h2 style={{ fontFamily: "'Space Grotesk'", fontSize: 'clamp(32px,4vw,56px)', fontWeight: 800, letterSpacing: '-.02em', marginBottom: 16 }}>
              Let's Build Something <span className="grad-text">Great</span>
            </h2>
            <p style={{ color: 'rgba(148,163,184,.6)', fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>
              Have a project in mind? Let's discuss how we can bring your ideas to life.
            </p>
          </div>
        </FadeUp>
        <div className="contact-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'stretch' }}>
          <FadeUp delay={.1}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
              {[
                { label: 'Email', val: profile?.email || 'sitalmahato077@gmail.com', href: `mailto:${profile?.email || 'sitalmahato077@gmail.com'}` },
                { label: 'Phone', val: profile?.phone || '+977 9704191610', href: `tel:${(profile?.phone || '+9779704191610').replace(/\s/g, '')}` },
                { label: 'Location', val: profile?.location || 'Golbazar, Siraha, Nepal' },
                { label: 'Working Hours', val: '24/7 Available' },
              ].map((c) => (
                <div key={c.label} className="grad-border contact-info-card" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'default', transition: 'transform 0.2s ease, background 0.2s ease' }}>
                  <div>
                    <div style={{ fontSize: '.72rem', color: 'rgba(148,163,184,.4)', fontFamily: "'JetBrains Mono'", textTransform: 'uppercase', marginBottom: 3 }}>{c.label}</div>
                    {c.href ? <a href={c.href} style={{ fontSize: '.9rem', color: 'rgba(226,232,240,.85)', fontWeight: 600 }}>{c.val}</a>
                      : <div style={{ fontSize: '.9rem', color: 'rgba(226,232,240,.85)', fontWeight: 600 }}>{c.val}</div>}
                  </div>
                </div>
              ))}
              <div className="grad-border" style={{ padding: 24, flex: 1 }}>
                <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, color: '#fff', marginBottom: 14, fontSize: '.9rem' }}>Let's Connect</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
                  {[
                    { href: profile?.github || 'https://github.com/sitalmahato00', Icon: IconGH, label: 'GitHub' },
                    { href: profile?.linkedin || 'https://linkedin.com/in/sitalmahato', Icon: IconLI, label: 'LinkedIn' },
                  ].map((s, i) => (
                    <a key={i} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" aria-label={s.label}
                      className="contact-social-link"
                      style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(148,163,184,.7)' }}>
                      <s.Icon />
                    </a>
                  ))}
                </div>
                <div style={{ background: 'rgba(16,185,129,.06)', border: '1px solid rgba(16,185,129,.15)', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
                  <div style={{ fontSize: '.75rem', color: '#34d399', fontWeight: 700, marginBottom: 2 }}>● Available for new projects</div>
                  <div style={{ fontSize: '.78rem', color: 'rgba(148,163,184,.5)' }}>Open to freelance work worldwide</div>
                </div>
                <GlowBtn href={`https://wa.me/${(profile?.phone || '9779704191610').replace(/\D/g, '')}`}
                  style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg,#16a34a,#15803d)', boxShadow: '0 0 20px rgba(22,163,74,.2)' }}>
                  <IconWA /> Hire Me Now
                </GlowBtn>
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={.2}>
            <div className="grad-border" style={{ padding: 36, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <form onSubmit={submitContact} style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <input className="form-input" value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} placeholder="Your Name" />
                    {cErrors.name && <div style={{ color: '#f87171', fontSize: '.75rem', marginTop: 4 }}>{cErrors.name}</div>}
                  </div>
                  <div>
                    <input className="form-input" type="email" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} placeholder="Your Email" />
                    {cErrors.email && <div style={{ color: '#f87171', fontSize: '.75rem', marginTop: 4 }}>{cErrors.email}</div>}
                  </div>
                </div>
                <input className="form-input" value={contactForm.subject} onChange={e => setContactForm({ ...contactForm, subject: e.target.value })} placeholder="Subject" />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <textarea className="form-input" value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} placeholder="Your Message" style={{ resize: 'none', flex: 1, minHeight: 120 }} />
                  {cErrors.message && <div style={{ color: '#f87171', fontSize: '.75rem', marginTop: 4 }}>{cErrors.message}</div>}
                </div>
                <button type="submit" style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  width: '100%', padding: '13px 28px', borderRadius: 12,
                  background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
                  border: '1px solid rgba(124,58,237,.4)', color: '#fff', fontWeight: 600,
                  fontSize: '0.92rem', cursor: 'pointer',
                  boxShadow: '0 0 30px rgba(124,58,237,.35),inset 0 1px 0 rgba(255,255,255,.1)',
                  opacity: cStatus === 'sending' ? .7 : 1, fontFamily: 'inherit',
                }}>
                  {cStatus === 'sending' ? '⏳ Sending…' : '✉ Send Message'}
                </button>
                {cStatus === 'success' && (
                  <div style={{ color: '#34d399', fontSize: '.85rem', textAlign: 'center', padding: '10px', borderRadius: 10, background: 'rgba(16,185,129,.08)', border: '1px solid rgba(16,185,129,.2)' }}>
                    ✓ Message sent successfully!
                  </div>
                )}
                {cStatus === 'error' && (
                  <div style={{ color: '#f87171', fontSize: '.85rem', textAlign: 'center', padding: '10px', borderRadius: 10, background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)' }}>
                    ✗ Something went wrong. Please try again.
                  </div>
                )}
              </form>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

export function PortfolioFooter({ profile, navLinks, navTo }) {
  return (
    <footer style={{ background: '#030711', borderTop: '1px solid rgba(255,255,255,.06)', position: 'relative', zIndex: 2, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 600, height: 2, background: 'linear-gradient(90deg,transparent,#7c3aed,#4f46e5,transparent)', pointerEvents: 'none' }} />
      <div style={{ borderBottom: '1px solid rgba(255,255,255,.05)', padding: '64px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
          <div>
            <div style={{ fontFamily: "'Space Grotesk'", fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 10 }}>
              Ready to build something <span className="grad-text-purple">amazing</span>?
            </div>
            <p style={{ color: 'rgba(148,163,184,.75)', fontSize: '.95rem', maxWidth: 440 }}>
              Let's turn your ideas into reality. Available for freelance projects worldwide.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <GlowBtn href={`mailto:${profile?.email || 'sitalmahato077@gmail.com'}`}>
              Start a Project <IconArrow />
            </GlowBtn>
            <GlowBtn href={`https://wa.me/${(profile?.phone || '9779704191610').replace(/\D/g, '')}`} variant="outline"
              style={{ borderColor: 'rgba(34,197,94,.25)', color: '#4ade80' }}>
              <IconWA /> WhatsApp
            </GlowBtn>
          </div>
        </div>
      </div>
      <div style={{ padding: '56px 40px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: '1.1rem', color: '#fff', marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem', fontWeight: 900, boxShadow: '0 0 16px rgba(124,58,237,.4)' }}>SM</div>
                {profile?.name || 'Sital Mahato'}
              </div>
              <p style={{ color: 'rgba(148,163,184,.75)', fontSize: '.83rem', lineHeight: 1.75, marginBottom: 20, maxWidth: 240 }}>
                Full Stack Developer & UI/UX Designer based in Nepal. Building digital experiences that matter.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a href={`mailto:${profile?.email || 'sitalmahato077@gmail.com'}`} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(148,163,184,.75)', fontSize: '.8rem' }}><IconMail /> {profile?.email || 'sitalmahato077@gmail.com'}</a>
                <a href={`tel:${(profile?.phone || '+9779704191610').replace(/\s/g, '')}`} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(148,163,184,.75)', fontSize: '.8rem' }}>📞 {profile?.phone || '+977 9704191610'}</a>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(148,163,184,.75)', fontSize: '.8rem' }}>📍 {profile?.location || 'Golbazar, Siraha, Nepal'}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '.7rem', fontWeight: 700, color: 'rgba(148,163,184,.78)', marginBottom: 16, letterSpacing: '.12em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono'" }}>Navigation</div>
              {navLinks.map(l => (
                <a key={l} href={`#${l}`} onClick={e => navTo(e, l)} style={{ display: 'block', fontSize: '.85rem', color: 'rgba(148,163,184,.75)', marginBottom: 10 }}>{l.charAt(0).toUpperCase() + l.slice(1)}</a>
              ))}
            </div>
            <div>
              <div style={{ fontSize: '.7rem', fontWeight: 700, color: 'rgba(148,163,184,.78)', marginBottom: 16, letterSpacing: '.12em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono'" }}>Services</div>
              {['Web Development', 'Backend Development', 'UI/UX Design', 'API Integration', 'Database Design', 'Performance Tuning'].map(s => (
                <div key={s} style={{ fontSize: '.83rem', color: 'rgba(148,163,184,.75)', marginBottom: 10 }}>{s}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: '.7rem', fontWeight: 700, color: 'rgba(148,163,184,.78)', marginBottom: 16, letterSpacing: '.12em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono'" }}>Connect</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {[
                  { label: 'GitHub', Icon: IconGH, href: profile?.github || 'https://github.com/sitalmahato00' },
                  { label: 'LinkedIn', Icon: IconLI, href: profile?.linkedin || 'https://linkedin.com/in/sitalmahato' },
                ].map(s => (
                  <a key={s.label} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" aria-label={s.label}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.83rem', color: 'rgba(148,163,184,.75)' }}>
                    <s.Icon /> {s.label}
                  </a>
                ))}
              </div>
              <div style={{ background: 'rgba(16,185,129,.07)', border: '1px solid rgba(16,185,129,.2)', borderRadius: 10, padding: '10px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#34d399', fontSize: '.75rem', fontWeight: 700, marginBottom: 3 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
                  Available for work
                </div>
                <div style={{ fontSize: '.72rem', color: 'rgba(148,163,184,.78)' }}>Open to freelance · remote · fulltime</div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,.05)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontSize: '.78rem', color: 'rgba(148,163,184,.78)' }}>&copy; {new Date().getFullYear()} {profile?.name || 'Sital Mahato'}. All rights reserved.</div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>{['Laravel', 'React', 'PHP', 'MySQL', 'TailwindCSS'].map(t => (
              <span key={t} style={{ fontSize: '.72rem', color: 'rgba(148,163,184,.78)', fontFamily: "'JetBrains Mono'" }}>{t}</span>
            ))}</div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link href="/privacy" style={{ fontSize: '.78rem', color: 'rgba(148,163,184,.78)' }}>Privacy Policy</Link>
              <span style={{ fontSize: '.78rem', color: 'rgba(148,163,184,.78)' }}>Made with <span style={{ color: '#7c3aed' }}>&#9829;</span> in Nepal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

const faqData = [
  { q: 'What technologies does Sital Mahato specialise in?', a: 'Sital specialises in Laravel, React, PHP, TypeScript, MySQL, and modern web technologies. He builds full-stack enterprise applications with a focus on clean architecture and performance.' },
  { q: 'Is Sital Mahato available for hire?', a: 'Yes, Sital is currently available for freelance projects, remote contract work, and full-time opportunities. You can reach him via the contact form, email, or WhatsApp.' },
  { q: 'Where is Sital Mahato based?', a: 'Sital is based in Golbazar, Siraha, Nepal. He works with clients worldwide and is comfortable across time zones.' },
  { q: 'What kind of projects has Sital built?', a: 'Sital has built enterprise-grade college management platforms, ID card generation systems, digital form management systems, academic result portals, and mobile applications \u2014 all for production use.' },
  { q: 'How can I contact Sital Mahato?', a: 'You can use the contact form on this page, email sitalmahato077@gmail.com, or reach out via WhatsApp at +977 9704191610. He typically responds within a few hours.' },
  { q: 'What is Sital\'s experience level?', a: 'Sital has 3+ years of professional experience working with Laravel, React, and PHP. He has delivered 6+ production applications currently in active use.' },
];

export function PortfolioFAQ({ profile }) {
  return (
    <section id="faq" style={{ padding: '100px 40px', position: 'relative' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <FadeUp>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-label" style={{ justifyContent: 'center', marginBottom: 16 }}>FAQ</div>
            <h2 style={{ fontFamily: "'Space Grotesk'", fontSize: 'clamp(32px,4vw,48px)', fontWeight: 800, letterSpacing: '-.02em' }}>
              Frequently Asked <span className="grad-text">Questions</span>
            </h2>
          </div>
        </FadeUp>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqData.map((item, i) => (
            <FadeUp key={i} delay={i * .04}>
              <details className="faq-item" style={{ borderRadius: 14, border: '1px solid rgba(255,255,255,.07)', background: 'rgba(255,255,255,.02)', overflow: 'hidden', transition: 'border-color .2s' }}>
                <summary style={{ padding: '18px 22px', cursor: 'pointer', fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: '.95rem', color: 'rgba(226,232,240,.85)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', listStyle: 'none' }}>
                  {item.q}
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, transition: 'transform .2s', color: 'rgba(148,163,184,.5)' }}><path d="M6 9l6 6 6-6"/></svg>
                </summary>
                <div style={{ padding: '0 22px 18px', color: 'rgba(148,163,184,.75)', fontSize: '.88rem', lineHeight: 1.75 }}>
                  {item.a}
                </div>
              </details>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
