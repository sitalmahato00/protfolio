import { useState, useEffect, useRef, useCallback } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';

/* ─── asset map ─────────────────────────────────────────── */
const imgMod = import.meta.glob('./assets/images/*.{webp,png}', { eager: true });
const aMap = {};
for (const [p, m] of Object.entries(imgMod)) { aMap[p.split('/').pop()] = m.default || m; }

/* ─── tiny helpers ───────────────────────────────────────── */
const imgUrl = s => { if (!s) return null; if (s.startsWith('http')) return s; return aMap[s.replace(/^images\//,'')] || '/'+s; };

const FadeUp = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}>
      {children}
    </motion.div>
  );
};

const FadeIn = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8, delay }}>
      {children}
    </motion.div>
  );
};

const GlowBtn = ({ href, children, variant = 'primary', onClick, style = {} }) => {
  const Tag = href ? 'a' : 'button';
  return (
    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{ display: 'inline-block' }}>
      <Tag href={href} onClick={onClick}
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noreferrer' : undefined}
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
          ...style,
        }}>
        {children}
      </Tag>
    </motion.div>
  );
};

/* ─── SVG icon components ────────────────────────────────── */
const IconGH = () => <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>;
const IconLI = () => <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const IconTW = () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const IconIG = () => <svg width="17" height="17" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>;
const IconMail = () => <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/></svg>;
const IconArrow = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
const IconExternal = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
const IconWA = () => <svg width="17" height="17" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;
const IconStar = () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;

/* ─── GLOBAL CSS (injected once) ────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior: smooth; }

  body {
    font-family: 'Inter', sans-serif;
    background: #050816;
    color: #e2e8f0;
    overflow-x: hidden;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  ::selection { background: rgba(124,58,237,.4); color:#fff; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: #050816; }
  ::-webkit-scrollbar-thumb { background: linear-gradient(#7c3aed,#3b82f6); border-radius:3px; }

  a { color: inherit; text-decoration: none; }

  /* ── noise overlay ── */
  body::before {
    content:''; position:fixed; inset:0; z-index:0; pointer-events:none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    opacity: 0.4;
  }

  /* ── animated aurora bg ── */
  .aurora {
    position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden;
  }
  .aurora-blob {
    position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.12;
    animation: aurora-move 20s ease-in-out infinite alternate;
  }
  @keyframes aurora-move {
    0%   { transform: translate(0,0) scale(1); }
    33%  { transform: translate(60px,-40px) scale(1.1); }
    66%  { transform: translate(-40px,60px) scale(0.95); }
    100% { transform: translate(30px,30px) scale(1.05); }
  }
  @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0;} }
  @keyframes spin-slow { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
  @keyframes spin-rev  { from{transform:rotate(0deg);} to{transform:rotate(-360deg);} }
  @keyframes float     { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-12px);} }
  @keyframes pulse-glow { 0%,100%{box-shadow:0 0 20px rgba(124,58,237,.3);} 50%{box-shadow:0 0 50px rgba(124,58,237,.7);} }
  @keyframes marquee   { from{transform:translateX(0);} to{transform:translateX(-50%);} }
  @keyframes grid-pulse { 0%,100%{opacity:.03;} 50%{opacity:.07;} }
  @keyframes counter-up { from{opacity:0;transform:translateY(12px);} to{opacity:1;transform:translateY(0);} }

  /* ── animated grid ── */
  .hero-grid-bg {
    position:absolute; inset:0; z-index:0; pointer-events:none;
    background-image:
      linear-gradient(rgba(124,58,237,.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124,58,237,.05) 1px, transparent 1px);
    background-size: 80px 80px;
    animation: grid-pulse 4s ease-in-out infinite;
  }

  /* ── glass card ── */
  .glass {
    background: rgba(255,255,255,.03);
    border: 1px solid rgba(255,255,255,.07);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  /* ── gradient border card ── */
  .grad-border {
    position: relative;
    background: rgba(5,8,22,.8);
    border-radius: 20px;
  }
  .grad-border::before {
    content:''; position:absolute; inset:0; border-radius:20px; padding:1px;
    background: linear-gradient(135deg, rgba(124,58,237,.5), rgba(59,130,246,.3), transparent 60%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor; mask-composite: exclude;
    pointer-events: none;
  }

  /* ── tag pill ── */
  .tag-pill {
    display:inline-flex; align-items:center; gap:4px;
    padding: 4px 12px; border-radius: 999px;
    background: rgba(124,58,237,.12); border: 1px solid rgba(124,58,237,.25);
    color: #a78bfa; font-size: .75rem; font-weight: 600; white-space: nowrap;
  }

  /* ── section label ── */
  .section-label {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: .72rem; font-weight: 500; letter-spacing: .15em;
    color: #7c3aed; text-transform: uppercase;
  }
  .section-label::before {
    content:''; width:24px; height:1px; background:linear-gradient(90deg,#7c3aed,transparent);
  }

  /* ── heading gradient ── */
  .grad-text {
    background: linear-gradient(135deg, #fff 0%, #a78bfa 50%, #60a5fa 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .grad-text-purple {
    background: linear-gradient(135deg, #c4b5fd, #7c3aed);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }

  /* ── nav ── */
  .nav-root {
    position: fixed; top:0; left:0; right:0; z-index:1000;
    height: 68px; display:flex; align-items:center; justify-content:space-between;
    padding: 0 40px; transition: all .4s;
  }
  .nav-root.stuck {
    background: rgba(5,8,22,.75); backdrop-filter: blur(24px);
    border-bottom: 1px solid rgba(255,255,255,.06);
    box-shadow: 0 8px 40px rgba(0,0,0,.4);
  }
  .nav-link {
    font-size: .84rem; font-weight: 500; color: rgba(226,232,240,.6);
    padding: 6px 14px; border-radius: 8px; transition: all .2s;
  }
  .nav-link:hover, .nav-link.active { color: #fff; background: rgba(255,255,255,.06); }

  /* ── terminal window ── */
  .terminal {
    background: rgba(0,0,0,.7); border: 1px solid rgba(255,255,255,.08);
    border-radius: 14px; overflow: hidden; backdrop-filter: blur(20px);
  }
  .terminal-bar { background: rgba(255,255,255,.05); padding: 10px 16px; display:flex; align-items:center; gap:6px; }
  .terminal-dot { width:10px; height:10px; border-radius:50%; }
  .terminal-body { padding: 16px 18px; font-family:'JetBrains Mono',monospace; font-size:.78rem; line-height:1.8; color:#94a3b8; }
  .terminal-body .kw { color:#c4b5fd; }
  .terminal-body .str { color:#86efac; }
  .terminal-body .fn { color:#60a5fa; }
  .terminal-body .cm { color:#475569; }

  /* ── stat card ── */
  .stat-card {
    text-align:center; padding:24px 16px;
    background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.06);
    border-radius:16px; transition: all .3s;
  }
  .stat-card:hover { background:rgba(124,58,237,.08); border-color:rgba(124,58,237,.3); transform:translateY(-4px); }

  /* ── project card ── */
  .project-card { border-radius:20px; overflow:hidden; position:relative; cursor:pointer; transition:transform .3s; }
  .project-card:hover { transform:translateY(-6px); }
  .project-card .overlay { position:absolute; inset:0; background:linear-gradient(to top, rgba(5,8,22,.95) 0%, rgba(5,8,22,.4) 60%, transparent 100%); transition:opacity .3s; }

  /* ── marquee ── */
  .marquee-track { display:flex; gap:32px; animation: marquee 30s linear infinite; width: max-content; }

  /* ── timeline ── */
  .tl-line { position:absolute; left:19px; top:44px; bottom:0; width:1px; background:linear-gradient(to bottom, rgba(124,58,237,.5), transparent); }

  /* ── contact form ── */
  .form-input {
    width:100%; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.09);
    border-radius:12px; padding:14px 16px; font-size:.9rem; color:#e2e8f0;
    font-family:inherit; outline:none; transition:all .25s;
  }
  .form-input:focus { border-color:rgba(124,58,237,.6); background:rgba(124,58,237,.06); box-shadow:0 0 0 3px rgba(124,58,237,.1); }
  .form-input::placeholder { color:#475569; }

  /* ── mobile ── */
  @media(max-width:768px){
    .nav-root { padding:0 20px; }
    .hero-cols { grid-template-columns:1fr !important; }
    .hero-right { display:none !important; }
    .about-cols { grid-template-columns:1fr !important; }
    .proj-bento { grid-template-columns:1fr !important; }
    .contact-cols { grid-template-columns:1fr !important; }
    .hide-mob { display:none !important; }
    .stat-row { grid-template-columns:repeat(2,1fr) !important; }
    .nav-links-row { display:none !important; }
    .mob-menu-show { display:flex !important; }
    .services-grid { grid-template-columns:1fr !important; }
    .exp-cols { grid-template-columns:1fr !important; }
  }
`;

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function Portfolio({ profile=null, skills={}, projects=[], services=[], experiences=[], stats={} }) {

  /* state */
  const [stuck,       setStuck]       = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [activeNav,   setActiveNav]   = useState('home');
  const [typedText,   setTypedText]   = useState('');
  const [wIdx,        setWIdx]        = useState(0);
  const [cIdx,        setCIdx]        = useState(0);
  const [deleting,    setDeleting]    = useState(false);
  const [contactForm, setContactForm] = useState({ name:'', email:'', subject:'', message:'' });
  const [cStatus,     setCStatus]     = useState('idle');
  const [cErrors,     setCErrors]     = useState({});
  const [skillTab,    setSkillTab]    = useState(null);
  const [projFilter,  setProjFilter]  = useState('all');
  const [mouse,       setMouse]       = useState({ x:0, y:0 });
  const [hoveredProj, setHoveredProj] = useState(null);

  /* parallax */
  const { scrollY } = useScroll();
  const heroY  = useTransform(scrollY, [0, 600], [0, -80]);
  const heroO  = useTransform(scrollY, [0, 500], [1, 0]);

  /* smooth spring for mouse */
  const mx = useSpring(0, { stiffness: 80, damping: 20 });
  const my = useSpring(0, { stiffness: 80, damping: 20 });

  /* typewriter words */
  const words = profile?.typewriter_words?.length
    ? profile.typewriter_words
    : ['Full Stack Developer','Laravel & PHP Expert','UI/UX Designer','React Developer','Problem Solver','Freelancer · Nepal 🇳🇵'];

  /* scroll listener */
  useEffect(() => {
    const fn = () => setStuck(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive:true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* mouse tracker */
  useEffect(() => {
    const fn = e => { mx.set(e.clientX); my.set(e.clientY); setMouse({ x:e.clientX, y:e.clientY }); };
    window.addEventListener('mousemove', fn, { passive:true });
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  /* typewriter */
  useEffect(() => {
    const word = words[wIdx] || '';
    const t = setTimeout(() => {
      if (!deleting) {
        if (cIdx < word.length) { setTypedText(word.slice(0, cIdx+1)); setCIdx(c=>c+1); }
        else { setTimeout(()=>setDeleting(true), 1800); }
      } else {
        if (cIdx > 0) { setTypedText(word.slice(0, cIdx-1)); setCIdx(c=>c-1); }
        else { setDeleting(false); setWIdx(i=>(i+1)%words.length); }
      }
    }, deleting ? 35 : 75);
    return () => clearTimeout(t);
  }, [cIdx, deleting, wIdx, words]);

  /* skill tab init */
  useEffect(() => {
    const keys = Object.keys(skills);
    if (keys.length && !skillTab) setSkillTab(keys[0]);
  }, [skills]);

  /* helpers */
  const avatarUrl = imgUrl(profile?.avatar);
  const resumeUrl = profile?.resume ? imgUrl(profile.resume) : '/images/sitalmahato.pdf';
  const allImgs   = p => {
    const raw = p.images?.length ? p.images : (p.image ? [p.image] : []);
    return raw.map(s => imgUrl(s) || s);
  };
  const navTo     = (e, id) => { e.preventDefault(); setMenuOpen(false); setActiveNav(id); document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); };
  const allTags   = [...new Set(projects.flatMap(p => p.tags||[]))].slice(0,6);
  const filteredProjects = projFilter==='all' ? projects : projects.filter(p=>(p.tags||[]).includes(projFilter));

  function submitContact(e) {
    e.preventDefault();
    const errs = {};
    if (!contactForm.name.trim()) errs.name = 'Required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) errs.email = 'Invalid email';
    if (contactForm.message.trim().length < 10) errs.message = 'Min 10 chars';
    if (Object.keys(errs).length) { setCErrors(errs); return; }
    setCErrors({}); setCStatus('sending');
    axios.post('/api/contact', contactForm)
      .then(()=>{ setCStatus('success'); setContactForm({name:'',email:'',subject:'',message:''}); })
      .catch(()=>setCStatus('error'));
  }

  /* work / edu */
  const workExp = experiences.filter(e=>e.type==='work');
  const eduExp  = experiences.filter(e=>e.type==='education');

  /* SEO */
  const siteUrl  = 'https://sital.info.np';
  const seoName  = profile?.name || 'Sital Mahato';
  const seoTitle = `${seoName} | Best Full Stack Developer in Nepal — Laravel, React & PHP Expert`;
  const seoDesc  = profile?.bio?.slice(0,158) || `${seoName} is widely recognised as one of the best web developers in Nepal, with expertise in Laravel, React, PHP, UI/UX design, and custom software. Available worldwide.`;
  const ogImage  = avatarUrl ? (avatarUrl.startsWith('http') ? avatarUrl : siteUrl+'/'+profile.avatar) : siteUrl+'/images/avatar_6a3fbd303e6af.webp';
  const favHref  = avatarUrl ? (avatarUrl.startsWith('http') ? avatarUrl : '/'+profile.avatar) : '/images/avatar_6a3fbd303e6af.webp';
  const favCB    = profile?.updated_at ? '?v='+new Date(profile.updated_at).getTime() : '';
  const jsonLd   = JSON.stringify([
    {'@context':'https://schema.org','@type':'Person','@id':siteUrl+'/#person',name:seoName,url:siteUrl,image:{url:ogImage},jobTitle:'Full Stack Developer',email:profile?.email||'sitalmahato077@gmail.com',telephone:profile?.phone||'+977 9704191610',address:{'@type':'PostalAddress',addressLocality:'Golbazar, Siraha',addressCountry:'NP'},knowsAbout:['Laravel','React','PHP','UI/UX','JavaScript','MySQL'],sameAs:[profile?.github||'https://github.com/sitalmahato00',profile?.linkedin||'https://linkedin.com/in/sitalmahato']},
    {'@context':'https://schema.org','@type':'WebSite','@id':siteUrl+'/#website',url:siteUrl,name:seoName+' — Portfolio',author:{'@id':siteUrl+'/#person'}},
  ]);

  const navLinks = ['home','about','skills','projects','services','experience','contact'];

  const techStack = [
    'React','Laravel','PHP','MySQL','JavaScript','TypeScript','Node.js','TailwindCSS',
    'Git','Docker','Redis','REST API','Next.js','Vue.js','AWS','Figma',
  ];


  return (<>
    <style dangerouslySetInnerHTML={{__html: GLOBAL_CSS}} />

    <Head title={seoTitle}>
      <link rel="canonical" href={siteUrl} />
      <meta name="description" content={seoDesc} />
      <meta name="author" content={seoName} />
      <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large" />
      <meta name="theme-color" content="#7c3aed" />
      <meta name="geo.region" content="NP" />
      <link rel="icon" type="image/webp" sizes="32x32" href={favHref+favCB} />
      <link rel="apple-touch-icon" href={favHref+favCB} />
      <link rel="manifest" href="/site.webmanifest" />
      {avatarUrl && <link rel="preload" as="image" href={avatarUrl} fetchpriority="high" />}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDesc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:image" content={ogImage} />
      <script type="application/ld+json">{jsonLd}</script>
    </Head>

    {/* ── AURORA BACKGROUND ─────────────────────────────────── */}
    <div className="aurora">
      <div className="aurora-blob" style={{width:'800px',height:'800px',background:'#7c3aed',top:'-200px',left:'-200px',animationDelay:'0s'}}/>
      <div className="aurora-blob" style={{width:'600px',height:'600px',background:'#4f46e5',top:'20%',right:'-100px',animationDelay:'-7s'}}/>
      <div className="aurora-blob" style={{width:'500px',height:'500px',background:'#3b82f6',bottom:'0',left:'30%',animationDelay:'-14s'}}/>
      <div className="aurora-blob" style={{width:'400px',height:'400px',background:'#06b6d4',bottom:'20%',right:'10%',animationDelay:'-4s'}}/>
    </div>

    {/* ── CURSOR SPOTLIGHT ──────────────────────────────────── */}
    <motion.div style={{
      position:'fixed', zIndex:1, pointerEvents:'none', borderRadius:'50%',
      width:400, height:400,
      background:'radial-gradient(circle, rgba(124,58,237,.06) 0%, transparent 70%)',
      x: useTransform(mx, v=>v-200), y: useTransform(my, v=>v-200),
    }}/>

    {/* ═══ NAVBAR ════════════════════════════════════════════ */}
    <nav className={`nav-root${stuck?' stuck':''}`} style={{zIndex:1000}}>
      <a href="#home" onClick={e=>navTo(e,'home')} style={{display:'flex',alignItems:'center',gap:10,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:'1.05rem',color:'#fff'}}>
        <div style={{width:34,height:34,borderRadius:9,background:'linear-gradient(135deg,#7c3aed,#4f46e5)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.8rem',fontWeight:900,boxShadow:'0 0 20px rgba(124,58,237,.4)'}}>SM</div>
        <span className="hide-mob">{profile?.name||'Sital Mahato'}</span>
      </a>

      <div className="nav-links-row" style={{display:'flex',gap:2}}>
        {navLinks.map(l=>(
          <a key={l} href={`#${l}`} onClick={e=>navTo(e,l)} className={`nav-link${activeNav===l?' active':''}`}>
            {l.charAt(0).toUpperCase()+l.slice(1)}
          </a>
        ))}
      </div>

      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <GlowBtn href={`mailto:${profile?.email||'sitalmahato077@gmail.com'}`} className="hide-mob">
          Hire Me <IconArrow />
        </GlowBtn>
        <button onClick={()=>setMenuOpen(!menuOpen)} style={{display:'none',background:'none',border:'none',cursor:'pointer',color:'#fff',padding:4}} className="mob-menu-show" aria-label="Menu">
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
          </svg>
        </button>
      </div>
    </nav>

    <AnimatePresence>
      {menuOpen && (
        <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
          style={{position:'fixed',top:68,left:0,right:0,zIndex:999,background:'rgba(5,8,22,.97)',backdropFilter:'blur(24px)',borderBottom:'1px solid rgba(255,255,255,.06)',padding:'12px 20px 20px',display:'flex',flexDirection:'column',gap:4}}>
          {navLinks.map(l=>(
            <a key={l} href={`#${l}`} onClick={e=>navTo(e,l)} style={{color:'rgba(226,232,240,.7)',fontWeight:500,padding:'12px 16px',borderRadius:10,fontSize:'.95rem'}}>
              {l.charAt(0).toUpperCase()+l.slice(1)}
            </a>
          ))}
          <a href={`mailto:${profile?.email||'sitalmahato077@gmail.com'}`} style={{marginTop:8,textAlign:'center',background:'linear-gradient(135deg,#7c3aed,#4f46e5)',color:'#fff',padding:'12px',borderRadius:10,fontWeight:700}}>
            Hire Me
          </a>
        </motion.div>
      )}
    </AnimatePresence>

    <main style={{position:'relative',zIndex:2}}>

    {/* ═══ HERO ═══════════════════════════════════════════════ */}
    <section id="home" style={{minHeight:'100vh',display:'flex',alignItems:'center',position:'relative',overflow:'hidden',padding:'0 40px'}}>
      <div className="hero-grid-bg"/>
      {/* radial glow center */}
      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'900px',height:'900px',background:'radial-gradient(circle,rgba(124,58,237,.08) 0%,transparent 65%)',pointerEvents:'none'}}/>

      <div style={{maxWidth:1200,width:'100%',margin:'0 auto',paddingTop:100,paddingBottom:60}}>
        <motion.div className="hero-cols" style={{display:'grid',gridTemplateColumns:'1fr 480px',gap:60,alignItems:'center'}} style2={{}} >
          {/* LEFT */}
          <motion.div style={{y:heroY,opacity:heroO}}>
            {/* available badge */}
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.1}}
              style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(16,185,129,.08)',border:'1px solid rgba(16,185,129,.2)',padding:'6px 14px',borderRadius:999,fontSize:'.78rem',fontWeight:600,color:'#34d399',marginBottom:28}}>
              <span style={{width:7,height:7,borderRadius:'50%',background:'#34d399',animation:'pulse-glow 2s infinite',display:'inline-block'}}/>
              {profile?.availability||'Available for Work'}
              <span style={{color:'rgba(52,211,153,.5)',margin:'0 4px'}}>·</span>
              <span style={{color:'rgba(52,211,153,.6)',fontSize:'.72rem'}}>{stats.years_exp||3}+ yrs exp</span>
            </motion.div>

            {/* typewriter role */}
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.2}}
              style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'1rem',color:'#7c3aed',marginBottom:16,display:'flex',alignItems:'center',gap:4,minHeight:'1.6em'}}>
              <span style={{color:'rgba(124,58,237,.4)'}}>&#47;&#47; </span>
              <span style={{color:'#a78bfa'}}>{typedText}</span>
              <span style={{width:2,height:'1.1em',background:'#7c3aed',animation:'blink .75s step-end infinite',display:'inline-block',verticalAlign:'middle',marginLeft:2}}/>
            </motion.div>

            {/* main headline */}
            <motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:.25,duration:.8}}
              style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'clamp(52px,6vw,88px)',fontWeight:800,lineHeight:1.05,marginBottom:24,letterSpacing:'-0.03em'}}>
              <span style={{display:'block',color:'rgba(226,232,240,.7)',fontSize:'clamp(36px,4vw,52px)',fontWeight:300,letterSpacing:'-.01em',marginBottom:4}}>Hello, I'm</span>
              <span className="grad-text">{profile?.name||'Sital Mahato'}</span>
            </motion.h1>

            <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.4}}
              style={{color:'rgba(148,163,184,.75)',fontSize:'1.05rem',maxWidth:460,lineHeight:1.75,marginBottom:40}}>
              {profile?.bio?.slice(0,140) || 'I build scalable web applications and digital experiences that help businesses grow and succeed in the digital world.'}
            </motion.p>

            {/* CTAs */}
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.5}}
              style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:48,alignItems:'center'}}>
              <GlowBtn href={`mailto:${profile?.email||'sitalmahato077@gmail.com'}`}>
                Let's Work Together <IconArrow />
              </GlowBtn>
              {resumeUrl && <GlowBtn href={resumeUrl} variant="outline">
                Download CV
              </GlowBtn>}
              <GlowBtn href={`https://wa.me/${(profile?.phone||'9779704191610').replace(/\D/g,'')}`} variant="outline"
                style={{borderColor:'rgba(34,197,94,.25)',color:'#4ade80'}}>
                <IconWA /> WhatsApp
              </GlowBtn>
            </motion.div>

            {/* socials */}
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.6}}
              style={{display:'flex',gap:10,alignItems:'center'}}>
              {[
                {href:profile?.github||'https://github.com/sitalmahato00', Icon:IconGH, label:'GitHub'},
                {href:profile?.linkedin||'https://linkedin.com/in/sitalmahato', Icon:IconLI, label:'LinkedIn'},
                {href:'#', Icon:IconTW, label:'X'},
                {href:'#', Icon:IconIG, label:'Instagram'},
                {href:`mailto:${profile?.email||'sitalmahato077@gmail.com'}`, Icon:IconMail, label:'Email'},
              ].map(s=>(
                <motion.a key={s.label} href={s.href} title={s.label}
                  target={s.href.startsWith('http')?'_blank':undefined} rel="noreferrer"
                  whileHover={{scale:1.15,y:-3}} whileTap={{scale:.95}}
                  style={{width:40,height:40,borderRadius:10,background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(148,163,184,.7)',transition:'color .2s'}}
                  onMouseEnter={e=>e.currentTarget.style.color='#fff'}
                  onMouseLeave={e=>e.currentTarget.style.color='rgba(148,163,184,.7)'}>
                  <s.Icon />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT — avatar + orbit badges + terminal */}
          <motion.div className="hero-right" initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} transition={{delay:.3,duration:.8}}
            style={{display:'flex',flexDirection:'column',alignItems:'center',gap:28}}>

            {/* ── ORBIT SYSTEM ─────────────────────────────────────
                Strategy: one big absolutely-positioned container (500×500)
                centered over the 300×300 photo area.
                The orbit wrapper (500×500) spins — carrying the badge positions.
                Each badge counter-spins so text stays upright.
                The photo sits in a separate stacking layer — NEVER rotates.
            ──────────────────────────────────────────────────────── */}
            <div style={{
              position:'relative',
              width:500, height:500,
              display:'flex', alignItems:'center', justifyContent:'center',
              flexShrink:0,
            }}>

              {/* ── BACKGROUND GLOW ── */}
              <div style={{
                position:'absolute', inset:0, borderRadius:'50%',
                background:'radial-gradient(circle, rgba(124,58,237,.18) 0%, transparent 65%)',
                pointerEvents:'none',
              }}/>

              {/* ── RING 1 — outermost, 420px, spins CW 25s ── */}
              <div style={{
                position:'absolute',
                width:420, height:420,
                borderRadius:'50%',
                background:'conic-gradient(from 0deg, #7c3aed, #4f46e5, #3b82f6, #06b6d4, #7c3aed)',
                animation:'spin-slow 25s linear infinite',
                WebkitMask:'radial-gradient(farthest-side,transparent calc(100% - 2px),#000 calc(100% - 2px))',
                mask:'radial-gradient(farthest-side,transparent calc(100% - 2px),#000 calc(100% - 2px))',
                opacity:.85, filter:'blur(.5px)',
              }}/>

              {/* ── RING 2 — 380px, spins CCW 18s ── */}
              <div style={{
                position:'absolute',
                width:380, height:380,
                borderRadius:'50%',
                border:'1.5px dashed rgba(167,139,250,.35)',
                animation:'spin-rev 18s linear infinite',
              }}/>

              {/* ── RING 3 — 350px, pulse only, no rotation ── */}
              <div style={{
                position:'absolute',
                width:350, height:350,
                borderRadius:'50%',
                border:'1px solid rgba(59,130,246,.2)',
                animation:'pulse-glow 4s ease-in-out infinite',
                boxShadow:'inset 0 0 30px rgba(124,58,237,.08)',
              }}/>

              {/* ── ORBIT SPINNER — invisible 500×500 div that rotates ──
                  Badges sit at computed (x,y) positions on the orbit path.
                  Each badge counter-rotates to stay upright.
              ── */}
              <motion.div
                style={{
                  position:'absolute', inset:0,
                  width:500, height:500,
                  pointerEvents:'none', zIndex:6,
                }}
                animate={{rotate:360}}
                transition={{duration:30, repeat:Infinity, ease:'linear'}}>

                {[
                  {label:'React',      color:'#06b6d4', bg:'rgba(6,182,212,.12)',   border:'rgba(6,182,212,.4)',   delay:0   },
                  {label:'Laravel',    color:'#ef4444', bg:'rgba(239,68,68,.12)',   border:'rgba(239,68,68,.4)',   delay:0.5 },
                  {label:'PHP',        color:'#a78bfa', bg:'rgba(167,139,250,.12)', border:'rgba(167,139,250,.4)', delay:1.0 },
                  {label:'MySQL',      color:'#f97316', bg:'rgba(249,115,22,.12)',  border:'rgba(249,115,22,.4)',  delay:1.5 },
                  {label:'JavaScript', color:'#fbbf24', bg:'rgba(251,191,36,.12)',  border:'rgba(251,191,36,.4)',  delay:2.0 },
                  {label:'Tailwind',   color:'#34d399', bg:'rgba(52,211,153,.12)',  border:'rgba(52,211,153,.4)',  delay:2.5 },
                ].map((item, i, arr) => {
                  // evenly space badges on a 230px radius circle
                  const r    = 230;           // orbit radius from center (250,250)
                  const cx   = 250;
                  const cy   = 250;
                  const deg  = (360 / arr.length) * i - 90; // start from top
                  const rad  = (deg * Math.PI) / 180;
                  const x    = cx + r * Math.cos(rad);
                  const y    = cy + r * Math.sin(rad);
                  return (
                    <motion.div
                      key={item.label}
                      style={{
                        position:'absolute',
                        left: x, top: y,
                        // anchor to center of badge
                        translateX:'-50%', translateY:'-50%',
                        background: item.bg,
                        border:`1px solid ${item.border}`,
                        borderRadius:999,
                        padding:'8px 16px',
                        fontSize:'.75rem',
                        fontWeight:700,
                        fontFamily:"'JetBrains Mono',monospace",
                        color: item.color,
                        backdropFilter:'blur(18px)',
                        WebkitBackdropFilter:'blur(18px)',
                        whiteSpace:'nowrap',
                        boxShadow:`0 0 16px ${item.color}40, inset 0 1px 0 rgba(255,255,255,.08)`,
                        zIndex:7,
                      }}
                      // counter-spin — exactly cancels parent rotation so text stays upright
                      animate={{rotate:-360}}
                      transition={{duration:30, repeat:Infinity, ease:'linear'}}
                    >
                      {item.label}
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* ── STATIC PROFILE IMAGE — separate layer, NEVER rotates ── */}
              <div style={{
                position:'absolute',
                width:280, height:280,
                borderRadius:'50%',
                zIndex:5,
                boxShadow:'0 0 60px rgba(124,58,237,.35), 0 0 120px rgba(124,58,237,.15)',
              }}>
                {avatarUrl
                  ? <img
                      fetchpriority="high"
                      src={avatarUrl}
                      alt={seoName}
                      style={{
                        width:'100%', height:'100%',
                        borderRadius:'50%',
                        objectFit:'cover',
                        objectPosition:'top center',
                        border:'2.5px solid rgba(124,58,237,.5)',
                        display:'block',
                      }}
                    />
                  : <div style={{width:'100%',height:'100%',borderRadius:'50%',background:'linear-gradient(135deg,#7c3aed,#4f46e5)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'4.5rem',fontWeight:900,color:'#fff'}}>SM</div>
                }
              </div>
            </div>

          </motion.div>
        </motion.div>

        {/* STATS ROW */}
        <FadeUp delay={.7}>
          <div className="stat-row" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginTop:60,paddingTop:60,borderTop:'1px solid rgba(255,255,255,.05)'}}>
            {[
              {n:`${stats.projects_delivered||18}+`,l:'Projects Delivered',icon:'🏗️'},
              {n:`${stats.years_exp||3}+`,l:'Years Experience',icon:'⚡'},
              {n:stats.client_satisfaction||'100%',l:'Client Satisfaction',icon:'⭐'},
              {n:stats.support||'24/7',l:'Support Available',icon:'🌍'},
            ].map(s=>(
              <div key={s.l} className="stat-card">
                <div style={{fontSize:'1.8rem',marginBottom:6}}>{s.icon}</div>
                <div style={{fontSize:'2rem',fontWeight:800,background:'linear-gradient(135deg,#fff,#a78bfa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',fontFamily:"'Space Grotesk'"}}>{s.n}</div>
                <div style={{fontSize:'.78rem',color:'rgba(148,163,184,.6)',marginTop:4}}>{s.l}</div>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>

    {/* ═══ MARQUEE TECH STACK ════════════════════════════════ */}
    <div style={{padding:'32px 0',borderTop:'1px solid rgba(255,255,255,.04)',borderBottom:'1px solid rgba(255,255,255,.04)',overflow:'hidden',background:'rgba(0,0,0,.2)',backdropFilter:'blur(10px)'}}>
      <div style={{overflow:'hidden'}}>
        <div className="marquee-track">
          {[...techStack,...techStack].map((t,i)=>(
            <span key={i} style={{display:'inline-flex',alignItems:'center',gap:8,padding:'8px 20px',borderRadius:999,background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.07)',color:'rgba(226,232,240,.5)',fontSize:'.82rem',fontWeight:500,whiteSpace:'nowrap'}}>
              <span style={{width:6,height:6,borderRadius:'50%',background:'#7c3aed',display:'inline-block'}}/>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* ═══ ABOUT ══════════════════════════════════════════════ */}
    <section id="about" style={{padding:'140px 40px',position:'relative'}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <div className="about-cols" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'start'}}>
          {/* LEFT */}
          <div>
            <FadeUp>
              <div className="section-label" style={{marginBottom:20}}>About Me</div>
              <h2 style={{fontFamily:"'Space Grotesk'",fontSize:'clamp(36px,4vw,52px)',fontWeight:800,lineHeight:1.1,marginBottom:28,letterSpacing:'-.02em'}}>
                Building solutions with{' '}
                <span className="grad-text-purple">code</span>
                {' '}& creativity.
              </h2>
              <p style={{color:'rgba(148,163,184,.8)',fontSize:'1rem',lineHeight:1.85,marginBottom:32}}>
                {profile?.bio||`I'm ${seoName}, a passionate Full Stack Developer with experience building modern web applications. I specialise in creating efficient, scalable, and user-friendly solutions using clean code and best practices.`}
              </p>
            </FadeUp>

            {/* info rows */}
            <FadeUp delay={.15}>
              <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:36}}>
                {[
                  {k:'Name',v:profile?.name||'Sital Mahato'},
                  {k:'Email',v:profile?.email||'sitalmahato077@gmail.com'},
                  {k:'Phone',v:profile?.phone||'+977 9704191610'},
                  {k:'Location',v:profile?.location||'Nepal 🇳🇵'},
                ].map(r=>(
                  <div key={r.k} style={{display:'flex',gap:16,padding:'12px 16px',borderRadius:12,background:'rgba(255,255,255,.02)',border:'1px solid rgba(255,255,255,.05)',alignItems:'center'}}>
                    <span style={{fontSize:'.75rem',fontWeight:700,color:'rgba(148,163,184,.4)',minWidth:70,fontFamily:"'JetBrains Mono'",textTransform:'uppercase'}}>{r.k}</span>
                    <span style={{fontSize:'.88rem',color:'rgba(226,232,240,.8)'}}>{r.v}</span>
                  </div>
                ))}
                <div style={{display:'flex',gap:16,padding:'12px 16px',borderRadius:12,background:'rgba(16,185,129,.05)',border:'1px solid rgba(16,185,129,.15)',alignItems:'center'}}>
                  <span style={{fontSize:'.75rem',fontWeight:700,color:'rgba(148,163,184,.4)',minWidth:70,fontFamily:"'JetBrains Mono'",textTransform:'uppercase'}}>Status</span>
                  <span style={{display:'inline-flex',alignItems:'center',gap:6,color:'#34d399',fontSize:'.82rem',fontWeight:700}}>
                    <span style={{width:6,height:6,borderRadius:'50%',background:'#34d399',animation:'pulse-glow 2s infinite',display:'inline-block'}}/>
                    {profile?.availability||'Available for Work'}
                  </span>
                </div>
              </div>
            </FadeUp>

            {/* mini stats */}
            <FadeUp delay={.2}>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginTop:4}}>
                {[
                  {n:`${stats.projects_delivered||18}+`,l:'Projects'},
                  {n:`${stats.tech_stack||16}+`,l:'Technologies'},
                  {n:`${stats.years_exp||3}+`,l:'Years'},
                ].map(s=>(
                  <div key={s.l} style={{textAlign:'center',padding:'16px 10px',borderRadius:14,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)'}}>
                    <div style={{fontSize:'1.5rem',fontWeight:800,fontFamily:"'Space Grotesk'",background:'linear-gradient(135deg,#fff,#a78bfa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{s.n}</div>
                    <div style={{fontSize:'.7rem',color:'rgba(148,163,184,.5)',marginTop:3}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </FadeUp>

            {/* download cv — after stats */}
            {resumeUrl && (
              <FadeUp delay={.3}>
                <GlowBtn href={resumeUrl}>Download CV <IconArrow /></GlowBtn>
              </FadeUp>
            )}
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:20}}>
            {/* photo — full image at top */}
            {avatarUrl && (
              <FadeIn delay={.1}>
                <div style={{position:'relative',borderRadius:24,overflow:'hidden'}} className="grad-border">
                  <img src={avatarUrl} alt={seoName} style={{width:'100%',height:'auto',display:'block',objectFit:'contain',borderRadius:24}}/>
                  <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(5,8,22,.75) 0%,transparent 55%)'}}/>
                  <div style={{position:'absolute',bottom:18,left:20}}>
                    <div style={{fontFamily:"'Space Grotesk'",fontWeight:700,color:'#fff',fontSize:'1rem'}}>{profile?.name||'Sital Mahato'}</div>
                    <div style={{color:'rgba(167,139,250,.8)',fontSize:'.8rem',marginTop:2}}>Full Stack Developer · Nepal</div>
                  </div>
                </div>
              </FadeIn>
            )}

            {/* terminal card — moved from hero */}
            <FadeIn delay={.2}>
              <motion.div className="terminal"
                animate={{y:[0,-8,0]}}
                transition={{duration:6,repeat:Infinity,ease:'easeInOut'}}>
                <div className="terminal-bar">
                  <div className="terminal-dot" style={{background:'#ff5f57'}}/>
                  <div className="terminal-dot" style={{background:'#febc2e'}}/>
                  <div className="terminal-dot" style={{background:'#28c840'}}/>
                  <span style={{marginLeft:8,fontSize:'.72rem',color:'rgba(148,163,184,.5)',fontFamily:"'JetBrains Mono'"}}>{profile?.name||'sital-mahato'} ~ portfolio</span>
                </div>
                <div className="terminal-body">
                  <div><span className="kw">const</span> <span className="fn">dev</span> = {'{'}</div>
                  <div>&nbsp;&nbsp;name: <span className="str">"{profile?.name||'Sital Mahato'}"</span>,</div>
                  <div>&nbsp;&nbsp;role: <span className="str">"Full Stack Dev"</span>,</div>
                  <div>&nbsp;&nbsp;exp:  <span className="str">"{stats.years_exp||3}+ years"</span>,</div>
                  <div>&nbsp;&nbsp;projects: <span className="str">{stats.projects_delivered||18}+</span>,</div>
                  <div>&nbsp;&nbsp;location: <span className="str">"Nepal 🇳🇵"</span>,</div>
                  <div>&nbsp;&nbsp;status: <span className="str">"open to work ✓"</span>,</div>
                  <div>{'}'}</div>
                  <div style={{marginTop:8}}><span className="cm">// currently building something cool</span></div>
                </div>
              </motion.div>
            </FadeIn>

          </div>
        </div>
      </div>
    </section>

    {/* ═══ SKILLS ═════════════════════════════════════════════ */}
    <section id="skills" style={{padding:'140px 40px',background:'rgba(0,0,0,.25)',backdropFilter:'blur(4px)',position:'relative'}}>
      {/* diagonal separator top */}
      <div style={{position:'absolute',top:-1,left:0,right:0,height:80,background:'linear-gradient(to bottom right,#050816 49.9%,transparent 50%)',zIndex:1}}/>
      <div style={{maxWidth:1200,margin:'0 auto',position:'relative',zIndex:2}}>
        <FadeUp>
          <div style={{textAlign:'center',marginBottom:64}}>
            <div className="section-label" style={{justifyContent:'center',marginBottom:16}}>My Skills</div>
            <h2 style={{fontFamily:"'Space Grotesk'",fontSize:'clamp(32px,4vw,48px)',fontWeight:800,letterSpacing:'-.02em'}}>
              Technologies I <span className="grad-text">Master</span>
            </h2>
          </div>
        </FadeUp>

        {/* pill cloud */}
        <FadeUp delay={.1}>
          <div style={{display:'flex',flexWrap:'wrap',gap:10,justifyContent:'center',marginBottom:60}}>
            {Object.entries(skills).flatMap(([,items])=>items).map((s,i)=>(
              <motion.div key={s.id||i}
                whileHover={{scale:1.08,background:'rgba(124,58,237,.2)',borderColor:'rgba(124,58,237,.5)'}}
                style={{display:'inline-flex',alignItems:'center',gap:6,padding:'8px 18px',borderRadius:999,background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',color:'rgba(226,232,240,.7)',fontSize:'.84rem',fontWeight:500,cursor:'default',transition:'all .2s'}}>
                {s.icon && <span style={{fontSize:'1rem'}}>{s.icon}</span>}
                {s.name}
              </motion.div>
            ))}
          </div>
        </FadeUp>

        {/* category tabs + bars */}
        {Object.keys(skills).length > 0 && (
          <FadeUp delay={.2}>
            <div className="grad-border" style={{padding:36}}>
              <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:28}}>
                {Object.keys(skills).map(cat=>(
                  <motion.button key={cat} onClick={()=>setSkillTab(cat)} whileHover={{scale:1.03}} whileTap={{scale:.97}}
                    style={{padding:'8px 20px',borderRadius:999,fontSize:'.82rem',fontWeight:600,border:'1px solid',cursor:'pointer',transition:'all .25s',
                      background:skillTab===cat?'linear-gradient(135deg,#7c3aed,#4f46e5)':'rgba(255,255,255,.04)',
                      borderColor:skillTab===cat?'transparent':'rgba(255,255,255,.08)',
                      color:skillTab===cat?'#fff':'rgba(148,163,184,.6)',
                      boxShadow:skillTab===cat?'0 0 20px rgba(124,58,237,.3)':'none'}}>
                    {cat}
                  </motion.button>
                ))}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'10px 32px'}}>
                {(skills[skillTab]||[]).map((s,i)=>(
                  <motion.div key={s.id||i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*.05}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                      <span style={{fontSize:'.85rem',fontWeight:600,color:'rgba(226,232,240,.85)'}}>{s.icon} {s.name}</span>
                      <span style={{fontSize:'.75rem',color:'rgba(124,58,237,.8)',fontFamily:"'JetBrains Mono'"}}>{s.level||80}%</span>
                    </div>
                    <div style={{height:4,borderRadius:4,background:'rgba(255,255,255,.05)',overflow:'hidden'}}>
                      <motion.div initial={{width:0}} whileInView={{width:`${s.level||80}%`}} viewport={{once:true}} transition={{duration:1.2,ease:'easeOut',delay:.1+i*.04}}
                        style={{height:'100%',borderRadius:4,background:'linear-gradient(90deg,#7c3aed,#3b82f6)'}}/>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeUp>
        )}
      </div>
    </section>

    {/* ═══ PROJECTS ═══════════════════════════════════════════ */}
    <section id="projects" style={{padding:'140px 40px',position:'relative'}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <FadeUp>
          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',flexWrap:'wrap',gap:16,marginBottom:48}}>
            <div>
              <div className="section-label" style={{marginBottom:14}}>My Work</div>
              <h2 style={{fontFamily:"'Space Grotesk'",fontSize:'clamp(32px,4vw,52px)',fontWeight:800,lineHeight:1.1,letterSpacing:'-.02em'}}>
                Featured <span className="grad-text">Projects</span>
              </h2>
            </div>
            <Link href="/projects" style={{display:'inline-flex',alignItems:'center',gap:6,color:'rgba(167,139,250,.8)',fontWeight:600,fontSize:'.88rem',border:'1px solid rgba(124,58,237,.25)',padding:'8px 18px',borderRadius:10,transition:'all .2s'}}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(124,58,237,.1)';e.currentTarget.style.color='#c4b5fd';}}
              onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='rgba(167,139,250,.8)';}}>
              View All <IconArrow />
            </Link>
          </div>
        </FadeUp>

        {/* filter tabs */}
        <FadeUp delay={.1}>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:36}}>
            {['all',...allTags].map(t=>(
              <motion.button key={t} onClick={()=>setProjFilter(t)} whileTap={{scale:.95}}
                style={{padding:'6px 16px',borderRadius:999,fontSize:'.8rem',fontWeight:600,border:'1px solid',cursor:'pointer',transition:'all .2s',
                  background:projFilter===t?'rgba(124,58,237,.2)':'transparent',
                  borderColor:projFilter===t?'rgba(124,58,237,.5)':'rgba(255,255,255,.08)',
                  color:projFilter===t?'#c4b5fd':'rgba(148,163,184,.6)'}}>
                {t.charAt(0).toUpperCase()+t.slice(1)}
              </motion.button>
            ))}
          </div>
        </FadeUp>

        {/* SINGLE ROW — 4 columns */}
        <div className="proj-bento" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:20}}>
          <AnimatePresence>
          {filteredProjects.slice(0,8).map((p,i)=>{
            const imgs = allImgs(p);
            return (
              <motion.div key={p.id} layout
                initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:20}}
                transition={{delay:i*.06}}
                style={{minWidth:0}}>
                <Link href={`/project/${p.id}`} style={{display:'block',textDecoration:'none'}}>
                  <motion.div className="grad-border"
                    style={{borderRadius:16,overflow:'hidden',background:'rgba(5,8,22,.8)',display:'flex',flexDirection:'column',height:'100%'}}
                    whileHover={{y:-5,boxShadow:'0 20px 50px rgba(124,58,237,.2)'}}
                    onMouseEnter={()=>setHoveredProj(p.id)}
                    onMouseLeave={()=>setHoveredProj(null)}>
                    {/* image */}
                    <div style={{height:160,overflow:'hidden',flexShrink:0,background:'rgba(255,255,255,.03)',position:'relative'}}>
                      {imgs.length>0
                        ? <motion.img src={imgs[0]} alt={p.title}
                            style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top',display:'block'}}
                            animate={{scale:hoveredProj===p.id?1.06:1}} transition={{duration:.4}}/>
                        : <div style={{width:'100%',height:'100%',background:'linear-gradient(135deg,rgba(124,58,237,.15),rgba(59,130,246,.15))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2.5rem'}}>🚀</div>
                      }
                      <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 60%,rgba(5,8,22,.5) 100%)',pointerEvents:'none'}}/>
                      <div style={{position:'absolute',top:10,right:10,width:28,height:28,borderRadius:7,background:'rgba(0,0,0,.5)',backdropFilter:'blur(8px)',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,.7)'}}>
                        <IconExternal />
                      </div>
                    </div>
                    {/* content */}
                    <div style={{padding:'14px 16px',flex:1,display:'flex',flexDirection:'column',gap:7}}>
                      <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                        {(p.tags||[]).slice(0,2).map(t=><span key={t} className="tag-pill" style={{fontSize:'.68rem',padding:'2px 9px'}}>{t}</span>)}
                      </div>
                      <h3 style={{fontFamily:"'Space Grotesk'",fontWeight:700,fontSize:'.92rem',color:'#fff',lineHeight:1.3,margin:0}}>{p.title}</h3>
                      <p style={{color:'rgba(148,163,184,.6)',fontSize:'.78rem',lineHeight:1.55,margin:0,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden',flex:1}}>{p.description}</p>
                      <div style={{display:'flex',gap:6,marginTop:2}}>
                        {p.live_url && p.live_url!=='#' && (
                          <span onClick={e=>{e.preventDefault();e.stopPropagation();window.open(p.live_url,'_blank');}}
                            style={{display:'inline-flex',alignItems:'center',gap:4,background:'rgba(124,58,237,.2)',border:'1px solid rgba(124,58,237,.4)',color:'#c4b5fd',borderRadius:7,padding:'4px 10px',fontSize:'.72rem',fontWeight:700,cursor:'pointer'}}>
                            Live <IconExternal />
                          </span>
                        )}
                        {p.github_url && (
                          <span onClick={e=>{e.preventDefault();e.stopPropagation();window.open(p.github_url,'_blank');}}
                            style={{display:'inline-flex',alignItems:'center',gap:4,background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.09)',color:'rgba(226,232,240,.6)',borderRadius:7,padding:'4px 10px',fontSize:'.72rem',fontWeight:600,cursor:'pointer'}}>
                            <IconGH /> Code
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
          </AnimatePresence>
        </div>
      </div>
    </section>

    {/* ═══ SERVICES ══════════════════════════════════════════ */}
    <section id="services" style={{padding:'140px 40px',background:'rgba(0,0,0,.2)',position:'relative'}}>
      <div style={{position:'absolute',top:-1,left:0,right:0,height:80,background:'linear-gradient(to bottom left,#050816 49.9%,transparent 50%)',zIndex:1}}/>
      <div style={{maxWidth:1200,margin:'0 auto',position:'relative',zIndex:2}}>
        <FadeUp>
          <div style={{textAlign:'center',marginBottom:72}}>
            <div className="section-label" style={{justifyContent:'center',marginBottom:16}}>Services</div>
            <h2 style={{fontFamily:"'Space Grotesk'",fontSize:'clamp(32px,4vw,52px)',fontWeight:800,letterSpacing:'-.02em'}}>
              What I <span className="grad-text">Offer</span>
            </h2>
          </div>
        </FadeUp>
        <div className="services-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
          {services.map((s,i)=>(
            <FadeUp key={s.id} delay={i*.08}>
              <motion.div className="grad-border" whileHover={{y:-6,boxShadow:'0 20px 60px rgba(124,58,237,.2)'}}
                style={{padding:32,height:'100%',cursor:'default',transition:'box-shadow .3s'}}>
                <div style={{width:52,height:52,borderRadius:14,background:'linear-gradient(135deg,rgba(124,58,237,.25),rgba(79,70,229,.25))',border:'1px solid rgba(124,58,237,.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem',marginBottom:20}}>
                  {s.icon||['🌐','⚙️','🗄️','🎨','🔌','🔧'][i%6]}
                </div>
                <h3 style={{fontFamily:"'Space Grotesk'",fontWeight:700,fontSize:'1.05rem',color:'#fff',marginBottom:10}}>{s.title}</h3>
                <p style={{color:'rgba(148,163,184,.65)',fontSize:'.85rem',lineHeight:1.75,marginBottom:16}}>{s.description}</p>
                {(s.features||[]).slice(0,4).map((f,fi)=>(
                  <div key={fi} style={{display:'flex',alignItems:'center',gap:8,fontSize:'.8rem',color:'rgba(148,163,184,.6)',marginBottom:6}}>
                    <span style={{color:'#7c3aed',fontSize:'.6rem'}}>✦</span>{f}
                  </div>
                ))}
                {s.price && <div style={{marginTop:14,fontSize:'.82rem',fontWeight:700,color:'#a78bfa'}}>{s.price}</div>}
                <motion.a href={`mailto:${profile?.email||'sitalmahato077@gmail.com'}`}
                  whileHover={{x:4}} style={{display:'inline-flex',alignItems:'center',gap:6,marginTop:20,color:'rgba(167,139,250,.7)',fontSize:'.82rem',fontWeight:600}}>
                  Get Started <IconArrow />
                </motion.a>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>

    {/* ═══ EXPERIENCE ════════════════════════════════════════ */}
    <section id="experience" style={{padding:'140px 40px',position:'relative'}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <FadeUp>
          <div style={{textAlign:'center',marginBottom:72}}>
            <div className="section-label" style={{justifyContent:'center',marginBottom:16}}>Journey</div>
            <h2 style={{fontFamily:"'Space Grotesk'",fontSize:'clamp(32px,4vw,52px)',fontWeight:800,letterSpacing:'-.02em'}}>
              Experience &amp; <span className="grad-text">Journey</span>
            </h2>
          </div>
        </FadeUp>

        <div className="exp-cols" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:60,alignItems:'start'}}>
          {/* Work timeline */}
          <FadeUp delay={.1}>
            <div style={{marginBottom:24}}>
              <div style={{fontSize:'.75rem',fontWeight:700,color:'rgba(124,58,237,.7)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:20,fontFamily:"'JetBrains Mono'"}}>Work Experience</div>
              <div style={{position:'relative'}}>
                {(workExp.length>0?workExp:[
                  {title:'Full Stack Developer',subtitle:'Freelance / Remote',period:'2023–Present',description:'Building modern web applications for clients worldwide using Laravel, React, and cloud technologies.',tags:['Laravel','React','AWS']},
                  {title:'Backend Developer',subtitle:'Various Startups',period:'2021–2023',description:'Developed scalable APIs and backend systems. Led database optimisation initiatives.',tags:['PHP','MySQL','REST API']},
                  {title:'Junior Developer',subtitle:'NabTech Nepal',period:'2019–2021',description:'Worked on frontend and backend web business systems for local enterprises.',tags:['JavaScript','PHP','jQuery']},
                ]).map((exp,i,arr)=>(
                  <motion.div key={exp.id||i} initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*.1}}
                    style={{display:'flex',gap:20,paddingBottom:28,position:'relative'}}>
                    {i<arr.length-1 && <div className="tl-line"/>}
                    <div style={{width:40,height:40,borderRadius:'50%',background:'linear-gradient(135deg,#7c3aed,#4f46e5)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.9rem',flexShrink:0,zIndex:1,boxShadow:'0 0 20px rgba(124,58,237,.4)'}}>💼</div>
                    <div className="grad-border" style={{padding:18,flex:1}}>
                      <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:6,marginBottom:6}}>
                        <div style={{fontFamily:"'Space Grotesk'",fontWeight:700,fontSize:'.95rem',color:'#fff'}}>{exp.title}</div>
                        <span className="tag-pill">{exp.period||exp.date||''}</span>
                      </div>
                      <div style={{fontSize:'.82rem',color:'#a78bfa',fontWeight:600,marginBottom:8}}>{exp.subtitle||exp.company||''}</div>
                      <div style={{fontSize:'.83rem',color:'rgba(148,163,184,.65)',lineHeight:1.65}}>{exp.description}</div>
                      {(exp.tags||[]).length>0 && <div style={{display:'flex',flexWrap:'wrap',gap:5,marginTop:10}}>{(exp.tags||[]).map(t=><span key={t} className="tag-pill">{t}</span>)}</div>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Education + Why work with me */}
          <FadeUp delay={.2}>
            <div>
              <div style={{fontSize:'.75rem',fontWeight:700,color:'rgba(59,130,246,.7)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:20,fontFamily:"'JetBrains Mono'"}}>Education</div>
              <div style={{position:'relative',marginBottom:40}}>
                {(eduExp.length>0?eduExp:[
                  {title:'Bachelor of Computer Engineering',subtitle:'Tribhuvan University',period:'2019–2023',description:'Graduated with distinction. Focus on software engineering, algorithms, and web technologies.'},
                ]).map((exp,i)=>(
                  <motion.div key={exp.id||i} initial={{opacity:0,x:20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*.1}}
                    style={{display:'flex',gap:20,paddingBottom:24}}>
                    <div style={{width:40,height:40,borderRadius:'50%',background:'linear-gradient(135deg,#3b82f6,#06b6d4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.9rem',flexShrink:0,boxShadow:'0 0 20px rgba(59,130,246,.3)'}}>🎓</div>
                    <div className="grad-border" style={{padding:18,flex:1}}>
                      <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:6,marginBottom:6}}>
                        <div style={{fontFamily:"'Space Grotesk'",fontWeight:700,fontSize:'.9rem',color:'#fff'}}>{exp.title}</div>
                        <span className="tag-pill" style={{borderColor:'rgba(59,130,246,.3)',color:'#93c5fd',background:'rgba(59,130,246,.1)'}}>{exp.period||exp.date||''}</span>
                      </div>
                      <div style={{fontSize:'.82rem',color:'#60a5fa',fontWeight:600,marginBottom:6}}>{exp.subtitle||exp.company||''}</div>
                      <div style={{fontSize:'.82rem',color:'rgba(148,163,184,.65)',lineHeight:1.65}}>{exp.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Why work with me */}
              <div className="grad-border" style={{padding:28}}>
                <div style={{fontFamily:"'Space Grotesk'",fontWeight:700,color:'#fff',marginBottom:18,fontSize:'1rem'}}>Why Work With Me?</div>
                {['Clean & efficient code','On-time delivery, always','Clear communication throughout','Client satisfaction first'].map((r,i)=>(
                  <motion.div key={r} initial={{opacity:0,x:10}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*.07}}
                    style={{display:'flex',alignItems:'center',gap:10,marginBottom:12,color:'rgba(148,163,184,.75)',fontSize:'.87rem'}}>
                    <span style={{width:20,height:20,borderRadius:'50%',background:'rgba(16,185,129,.12)',border:'1px solid rgba(16,185,129,.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.55rem',color:'#34d399',flexShrink:0}}>✓</span>
                    {r}
                  </motion.div>
                ))}
                <GlowBtn href={`mailto:${profile?.email||'sitalmahato077@gmail.com'}`} style={{marginTop:8,width:'100%',justifyContent:'center'}}>
                  Let's Work Together <IconArrow />
                </GlowBtn>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>

    {/* ═══ CONTACT ════════════════════════════════════════════ */}
    <section id="contact" style={{padding:'100px 40px 80px',background:'rgba(0,0,0,.25)',position:'relative'}}>
      <div style={{position:'absolute',top:-1,left:0,right:0,height:80,background:'linear-gradient(to bottom right,#050816 49.9%,transparent 50%)',zIndex:1}}/>
      <div style={{maxWidth:1200,margin:'0 auto',position:'relative',zIndex:2}}>
        <FadeUp>
          <div style={{textAlign:'center',marginBottom:72}}>
            <div className="section-label" style={{justifyContent:'center',marginBottom:16}}>Get In Touch</div>
            <h2 style={{fontFamily:"'Space Grotesk'",fontSize:'clamp(32px,4vw,56px)',fontWeight:800,letterSpacing:'-.02em',marginBottom:16}}>
              Let's Build Something <span className="grad-text">Great</span>
            </h2>
            <p style={{color:'rgba(148,163,184,.6)',fontSize:'1rem',maxWidth:480,margin:'0 auto'}}>
              Have a project in mind? Let's discuss how we can bring your ideas to life.
            </p>
          </div>
        </FadeUp>

        <div className="contact-cols" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:48,alignItems:'stretch'}}>
          {/* LEFT — contact info */}
          <FadeUp delay={.1}>
            <div style={{display:'flex',flexDirection:'column',gap:16,height:'100%'}}>
              {[
                {icon:'✉',label:'Email',val:profile?.email||'sitalmahato077@gmail.com',href:`mailto:${profile?.email||'sitalmahato077@gmail.com'}`},
                {icon:'📞',label:'Phone',val:profile?.phone||'+977 9704191610',href:`tel:${(profile?.phone||'+9779704191610').replace(/\s/g,'')}`},
                {icon:'📍',label:'Location',val:profile?.location||'Nepal 🇳🇵'},
                {icon:'🕐',label:'Working Hours',val:'24/7 Available'},
              ].map((c,i)=>(
                <motion.div key={c.label} whileHover={{x:4,background:'rgba(124,58,237,.06)'}} className="grad-border"
                  style={{padding:'18px 22px',display:'flex',alignItems:'center',gap:16,cursor:'default',transition:'background .2s'}}>
                  <div style={{width:44,height:44,borderRadius:12,background:'rgba(124,58,237,.1)',border:'1px solid rgba(124,58,237,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem',flexShrink:0}}>
                    {c.icon}
                  </div>
                  <div>
                    <div style={{fontSize:'.72rem',color:'rgba(148,163,184,.4)',fontFamily:"'JetBrains Mono'",textTransform:'uppercase',marginBottom:3}}>{c.label}</div>
                    {c.href
                      ? <a href={c.href} style={{fontSize:'.9rem',color:'rgba(226,232,240,.85)',fontWeight:600}}>{c.val}</a>
                      : <div style={{fontSize:'.9rem',color:'rgba(226,232,240,.85)',fontWeight:600}}>{c.val}</div>
                    }
                  </div>
                </motion.div>
              ))}

              <div className="grad-border" style={{padding:24,flex:1}}>
                <div style={{fontFamily:"'Space Grotesk'",fontWeight:700,color:'#fff',marginBottom:14,fontSize:'.9rem'}}>Let's Connect</div>
                <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:18}}>
                  {[{href:profile?.github||'https://github.com/sitalmahato00',Icon:IconGH},{href:profile?.linkedin||'https://linkedin.com/in/sitalmahato',Icon:IconLI},{href:'#',Icon:IconTW},{href:'#',Icon:IconIG}].map((s,i)=>(
                    <motion.a key={i} href={s.href} target={s.href.startsWith('http')?'_blank':undefined} rel="noreferrer"
                      whileHover={{scale:1.15,y:-3}} style={{width:40,height:40,borderRadius:10,background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(148,163,184,.7)'}}>
                      <s.Icon />
                    </motion.a>
                  ))}
                </div>
                <div style={{background:'rgba(16,185,129,.06)',border:'1px solid rgba(16,185,129,.15)',borderRadius:10,padding:'12px 14px',marginBottom:16}}>
                  <div style={{fontSize:'.75rem',color:'#34d399',fontWeight:700,marginBottom:2}}>● Available for new projects</div>
                  <div style={{fontSize:'.78rem',color:'rgba(148,163,184,.5)'}}>Open to freelance work worldwide</div>
                </div>
                <GlowBtn href={`https://wa.me/${(profile?.phone||'9779704191610').replace(/\D/g,'')}`}
                  style={{width:'100%',justifyContent:'center',background:'linear-gradient(135deg,#16a34a,#15803d)',boxShadow:'0 0 20px rgba(22,163,74,.2)'}}>
                  <IconWA /> Hire Me Now
                </GlowBtn>
              </div>
            </div>
          </FadeUp>

          {/* RIGHT — form, same height as left column */}
          <FadeUp delay={.2}>
            <div className="grad-border" style={{padding:36,height:'100%',display:'flex',flexDirection:'column'}}>
              <form onSubmit={submitContact} style={{display:'flex',flexDirection:'column',gap:16,flex:1}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                  <div>
                    <input className="form-input" value={contactForm.name} onChange={e=>setContactForm({...contactForm,name:e.target.value})} placeholder="Your Name"/>
                    {cErrors.name && <div style={{color:'#f87171',fontSize:'.75rem',marginTop:4}}>{cErrors.name}</div>}
                  </div>
                  <div>
                    <input className="form-input" type="email" value={contactForm.email} onChange={e=>setContactForm({...contactForm,email:e.target.value})} placeholder="Your Email"/>
                    {cErrors.email && <div style={{color:'#f87171',fontSize:'.75rem',marginTop:4}}>{cErrors.email}</div>}
                  </div>
                </div>
                <input className="form-input" value={contactForm.subject} onChange={e=>setContactForm({...contactForm,subject:e.target.value})} placeholder="Subject"/>
                <div style={{flex:1,display:'flex',flexDirection:'column'}}>
                  <textarea className="form-input" value={contactForm.message} onChange={e=>setContactForm({...contactForm,message:e.target.value})} placeholder="Your Message" style={{resize:'none',flex:1,minHeight:120}}/>
                  {cErrors.message && <div style={{color:'#f87171',fontSize:'.75rem',marginTop:4}}>{cErrors.message}</div>}
                </div>
                <button type="submit" style={{
                  display:'inline-flex',alignItems:'center',justifyContent:'center',gap:8,
                  width:'100%',padding:'13px 28px',borderRadius:12,
                  background:'linear-gradient(135deg,#7c3aed,#4f46e5)',
                  border:'1px solid rgba(124,58,237,.4)',color:'#fff',fontWeight:600,
                  fontSize:'0.92rem',cursor:'pointer',
                  boxShadow:'0 0 30px rgba(124,58,237,.35),inset 0 1px 0 rgba(255,255,255,.1)',
                  opacity:cStatus==='sending'?.7:1,fontFamily:'inherit',
                }}>
                  {cStatus==='sending' ? '⏳ Sending…' : '✉ Send Message'}
                </button>
                <AnimatePresence>
                  {cStatus==='success' && (
                    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                      style={{color:'#34d399',fontSize:'.85rem',textAlign:'center',padding:'10px',borderRadius:10,background:'rgba(16,185,129,.08)',border:'1px solid rgba(16,185,129,.2)'}}>
                      ✓ Message sent successfully!
                    </motion.div>
                  )}
                  {cStatus==='error' && (
                    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                      style={{color:'#f87171',fontSize:'.85rem',textAlign:'center',padding:'10px',borderRadius:10,background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.2)'}}>
                      ✗ Something went wrong. Please try again.
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>

    {/* ═══ FOOTER ══════════════════════════════════════════════ */}
    <footer style={{background:'#030711',borderTop:'1px solid rgba(255,255,255,.06)',position:'relative',zIndex:2,overflow:'hidden'}}>
      {/* top glow */}
      <div style={{position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',width:600,height:2,background:'linear-gradient(90deg,transparent,#7c3aed,#4f46e5,transparent)',pointerEvents:'none'}}/>

      {/* CTA BAND */}
      <div style={{borderBottom:'1px solid rgba(255,255,255,.05)',padding:'64px 40px'}}>
        <div style={{maxWidth:1200,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:32}}>
          <div>
            <div style={{fontFamily:"'Space Grotesk'",fontSize:'clamp(24px,3vw,36px)',fontWeight:800,color:'#fff',lineHeight:1.2,marginBottom:10}}>
              Ready to build something <span className="grad-text-purple">amazing</span>?
            </div>
            <p style={{color:'rgba(148,163,184,.55)',fontSize:'.95rem',maxWidth:440}}>
              Let's turn your ideas into reality. Available for freelance projects worldwide.
            </p>
          </div>
          <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            <GlowBtn href={`mailto:${profile?.email||'sitalmahato077@gmail.com'}`}>
              Start a Project <IconArrow />
            </GlowBtn>
            <GlowBtn href={`https://wa.me/${(profile?.phone||'9779704191610').replace(/\D/g,'')}`} variant="outline"
              style={{borderColor:'rgba(34,197,94,.25)',color:'#4ade80'}}>
              <IconWA /> WhatsApp
            </GlowBtn>
          </div>
        </div>
      </div>

      {/* MAIN FOOTER GRID */}
      <div style={{padding:'56px 40px 32px'}}>
        <div style={{maxWidth:1200,margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'1.6fr 1fr 1fr 1fr',gap:48,marginBottom:48,flexWrap:'wrap'}}>

            {/* Brand col */}
            <div>
              <div style={{display:'inline-flex',alignItems:'center',gap:10,fontFamily:"'Space Grotesk'",fontWeight:700,fontSize:'1.1rem',color:'#fff',marginBottom:16}}>
                <div style={{width:36,height:36,borderRadius:9,background:'linear-gradient(135deg,#7c3aed,#4f46e5)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.85rem',fontWeight:900,boxShadow:'0 0 16px rgba(124,58,237,.4)'}}>SM</div>
                {profile?.name||'Sital Mahato'}
              </div>
              <p style={{color:'rgba(148,163,184,.45)',fontSize:'.83rem',lineHeight:1.75,marginBottom:20,maxWidth:240}}>
                Full Stack Developer & UI/UX Designer based in Nepal. Building digital experiences that matter.
              </p>
              {/* contact quick links */}
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                <a href={`mailto:${profile?.email||'sitalmahato077@gmail.com'}`}
                  style={{display:'flex',alignItems:'center',gap:8,color:'rgba(148,163,184,.5)',fontSize:'.8rem',transition:'color .2s'}}
                  onMouseEnter={e=>e.currentTarget.style.color='#c4b5fd'}
                  onMouseLeave={e=>e.currentTarget.style.color='rgba(148,163,184,.5)'}>
                  <IconMail /> {profile?.email||'sitalmahato077@gmail.com'}
                </a>
                <a href={`tel:${(profile?.phone||'+9779704191610').replace(/\s/g,'')}`}
                  style={{display:'flex',alignItems:'center',gap:8,color:'rgba(148,163,184,.5)',fontSize:'.8rem',transition:'color .2s'}}
                  onMouseEnter={e=>e.currentTarget.style.color='#c4b5fd'}
                  onMouseLeave={e=>e.currentTarget.style.color='rgba(148,163,184,.5)'}>
                  📞 {profile?.phone||'+977 9704191610'}
                </a>
                <span style={{display:'flex',alignItems:'center',gap:8,color:'rgba(148,163,184,.5)',fontSize:'.8rem'}}>
                  📍 {profile?.location||'Golbazar, Siraha, Nepal'}
                </span>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <div style={{fontSize:'.7rem',fontWeight:700,color:'rgba(148,163,184,.35)',marginBottom:16,letterSpacing:'.12em',textTransform:'uppercase',fontFamily:"'JetBrains Mono'"}}>Navigation</div>
              {navLinks.map(l=>(
                <a key={l} href={`#${l}`} onClick={e=>navTo(e,l)}
                  style={{display:'block',fontSize:'.85rem',color:'rgba(148,163,184,.5)',marginBottom:10,transition:'color .2s'}}
                  onMouseEnter={e=>e.target.style.color='#c4b5fd'}
                  onMouseLeave={e=>e.target.style.color='rgba(148,163,184,.5)'}>
                  {l.charAt(0).toUpperCase()+l.slice(1)}
                </a>
              ))}
            </div>

            {/* Services */}
            <div>
              <div style={{fontSize:'.7rem',fontWeight:700,color:'rgba(148,163,184,.35)',marginBottom:16,letterSpacing:'.12em',textTransform:'uppercase',fontFamily:"'JetBrains Mono'"}}>Services</div>
              {['Web Development','Backend Development','UI/UX Design','API Integration','Database Design','Performance Tuning'].map(s=>(
                <div key={s} style={{fontSize:'.83rem',color:'rgba(148,163,184,.45)',marginBottom:10,cursor:'default'}}>{s}</div>
              ))}
            </div>

            {/* Connect */}
            <div>
              <div style={{fontSize:'.7rem',fontWeight:700,color:'rgba(148,163,184,.35)',marginBottom:16,letterSpacing:'.12em',textTransform:'uppercase',fontFamily:"'JetBrains Mono'"}}>Connect</div>
              <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:24}}>
                {[
                  {label:'GitHub',Icon:IconGH,href:profile?.github||'https://github.com/sitalmahato00'},
                  {label:'LinkedIn',Icon:IconLI,href:profile?.linkedin||'https://linkedin.com/in/sitalmahato'},
                  {label:'Twitter / X',Icon:IconTW,href:'#'},
                  {label:'Instagram',Icon:IconIG,href:'#'},
                ].map(s=>(
                  <a key={s.label} href={s.href} target={s.href.startsWith('http')?'_blank':undefined} rel="noreferrer"
                    style={{display:'flex',alignItems:'center',gap:8,fontSize:'.83rem',color:'rgba(148,163,184,.5)',transition:'color .2s'}}
                    onMouseEnter={e=>e.currentTarget.style.color='#c4b5fd'}
                    onMouseLeave={e=>e.currentTarget.style.color='rgba(148,163,184,.5)'}>
                    <s.Icon /> {s.label}
                  </a>
                ))}
              </div>
              {/* availability badge */}
              <div style={{background:'rgba(16,185,129,.07)',border:'1px solid rgba(16,185,129,.2)',borderRadius:10,padding:'10px 14px'}}>
                <div style={{display:'flex',alignItems:'center',gap:6,color:'#34d399',fontSize:'.75rem',fontWeight:700,marginBottom:3}}>
                  <span style={{width:6,height:6,borderRadius:'50%',background:'#34d399',display:'inline-block'}}/>
                  Available for work
                </div>
                <div style={{fontSize:'.72rem',color:'rgba(148,163,184,.4)'}}>Open to freelance · remote · fulltime</div>
              </div>
            </div>
          </div>

          {/* bottom bar */}
          <div style={{borderTop:'1px solid rgba(255,255,255,.05)',paddingTop:24,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12}}>
            <div style={{fontSize:'.78rem',color:'rgba(148,163,184,.3)'}}>
              &copy; {new Date().getFullYear()} {profile?.name||'Sital Mahato'}. All rights reserved.
            </div>
            <div style={{display:'flex',gap:20,flexWrap:'wrap'}}>
              {['Laravel','React','PHP','MySQL','TailwindCSS'].map(t=>(
                <span key={t} style={{fontSize:'.72rem',color:'rgba(148,163,184,.25)',fontFamily:"'JetBrains Mono'"}}>{t}</span>
              ))}
            </div>
            <div style={{fontSize:'.78rem',color:'rgba(148,163,184,.3)'}}>
              Made with <span style={{color:'#7c3aed'}}>♥</span> in Nepal
            </div>
          </div>
        </div>
      </div>
    </footer>

    </main>
  </>);
}
