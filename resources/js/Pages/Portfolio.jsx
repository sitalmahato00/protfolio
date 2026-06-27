import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';

export default function Portfolio() {
    const [profile, setProfile] = useState(null);
    const [skills, setSkills] = useState({});
    const [projects, setProjects] = useState([]);
    const [services, setServices] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [stats, setStats] = useState({});
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [typedText, setTypedText] = useState('');
    const [wordIndex, setWordIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [contactStatus, setContactStatus] = useState('idle');
    const [contactErrors, setContactErrors] = useState({});

    const defaultWords = ['Full Stack Developer','UI/UX Designer','Laravel & PHP Expert','React Developer','Problem Solver','Freelancer · Nepal 🇳🇵'];
    const typewriterWords = profile?.typewriter_words?.length ? profile.typewriter_words : defaultWords;

    useEffect(() => {
        Promise.all([
            axios.get('/api/profile'),
            axios.get('/api/skills/categories'),
            axios.get('/api/projects'),
            axios.get('/api/services'),
            axios.get('/api/experiences'),
            axios.get('/api/stats'),
        ]).then(([p, sk, pr, sv, ex, st]) => {
            setProfile(p.data); setSkills(sk.data); setProjects(pr.data);
            setServices(sv.data); setExperiences(ex.data); setStats(st.data);
        }).catch(err => console.error('Fetch error', err));
    }, []);

    useEffect(() => { window.addEventListener('scroll', () => setScrolled(window.scrollY > 40)); }, []);

    useEffect(() => {
        if (!typewriterWords.length) return;
        const word = typewriterWords[wordIndex] || '';
        const t = setTimeout(() => {
            if (!isDeleting) {
                if (charIndex < word.length) { setTypedText(word.slice(0, charIndex + 1)); setCharIndex(c => c + 1); }
                else { setTimeout(() => setIsDeleting(true), 1800); }
            } else {
                if (charIndex > 0) { setTypedText(word.slice(0, charIndex - 1)); setCharIndex(c => c - 1); }
                else { setIsDeleting(false); setWordIndex(i => (i + 1) % typewriterWords.length); setTimeout(() => {}, 350); }
            }
        }, isDeleting ? 38 : 70);
        return () => clearTimeout(t);
    }, [charIndex, isDeleting, wordIndex, typewriterWords]);

    const imgUrl = s => s ? (s.startsWith('http') ? s : '/' + s) : null;
    const avatarUrl = imgUrl(profile?.avatar);
    const resumeUrl = imgUrl(profile?.resume);
    const navClick = (e, id) => { e.preventDefault(); setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };

    function submitContact(e) {
        e.preventDefault();
        const errs = {};
        if (!contactForm.name.trim()) errs.name = 'Name required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) errs.email = 'Valid email required';
        if (contactForm.message.trim().length < 10) errs.message = 'Message must be at least 10 characters';
        if (Object.keys(errs).length) { setContactErrors(errs); return; }
        setContactErrors({}); setContactStatus('sending');
        axios.post('/api/contact', contactForm)
            .then(() => { setContactStatus('success'); setContactForm({ name: '', email: '', subject: '', message: '' }); })
            .catch(() => setContactStatus('error'));
    }

    const workExp = experiences.filter(e => e.type === 'work');
    const eduExp = experiences.filter(e => e.type === 'education');

    const GH = <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>;
    const LI = <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
    const EM = <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>;
    const PH = <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>;

    return (
        <>
        <Head title={(profile?.name || 'Sital Mahato') + ' — Portfolio'} />
        <style>{`
            :root{--primary:#2563eb;--primary-dark:#1d4ed8;--accent:#f97316;--accent2:#10b981;--bg:#f8faff;--white:#ffffff;--dark:#0f172a;--text:#1e293b;--muted:#64748b;--border:#e2e8f0;--card:#ffffff;--gradient:linear-gradient(135deg,#1e3a8a 0%,#2563eb 50%,#7c3aed 100%);--gradient2:linear-gradient(135deg,#f97316 0%,#ef4444 100%);}
            *{margin:0;padding:0;box-sizing:border-box;}
            html{scroll-behavior:smooth;}
            body{font-family:'Plus Jakarta Sans','Inter',sans-serif;background:var(--bg);color:var(--text);line-height:1.6;}
            a{color:inherit;text-decoration:none;}
            @keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.5;transform:scale(1.3);}}
            @keyframes spin-ring{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
            @keyframes spin-ring-rev{from{transform:rotate(0deg);}to{transform:rotate(-360deg);}}
            @keyframes orbit{from{transform:rotate(0deg) translateX(148px) rotate(0deg);}to{transform:rotate(360deg) translateX(148px) rotate(-360deg);}}
            @keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
            @keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
            .nav-pill{position:fixed;top:16px;left:50%;transform:translateX(-50%);width:calc(100% - 48px);max-width:1100px;background:rgba(255,255,255,0.06);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.12);border-radius:16px;z-index:1000;padding:0 24px;height:64px;display:flex;align-items:center;justify-content:space-between;transition:all .35s ease;}
            .nav-pill.scrolled{background:rgba(255,255,255,0.45);backdrop-filter:blur(20px);border-color:rgba(255,255,255,0.3);box-shadow:0 4px 24px rgba(0,0,0,.10),0 1px 4px rgba(0,0,0,.06);}
            .nav-logo{display:flex;align-items:center;gap:10px;font-weight:800;font-size:1.1rem;color:#fff;text-decoration:none;transition:color .35s;}
            .nav-pill.scrolled .nav-logo{color:var(--dark);}
            .nav-logo .badge{width:38px;height:38px;background:var(--gradient);border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:1rem;}
            .nav-links{display:flex;gap:2px;list-style:none;}
            .nav-links a{color:rgba(255,255,255,.85);font-weight:600;font-size:.88rem;padding:7px 14px;border-radius:8px;transition:all .2s;}
            .nav-links a:hover{background:rgba(255,255,255,.15);color:#fff;}
            .nav-pill.scrolled .nav-links a{color:var(--muted);}
            .nav-pill.scrolled .nav-links a:hover{background:var(--bg);color:var(--dark);}
            .nav-cta{background:var(--gradient2);color:#fff;border:none;padding:10px 24px;border-radius:50px;font-weight:700;font-size:.88rem;cursor:pointer;text-decoration:none;white-space:nowrap;box-shadow:0 2px 14px rgba(249,115,22,.35);}
            .nav-cta:hover{opacity:.9;transform:translateY(-1px);}
            .hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;background:none;border:none;padding:4px;}
            .hamburger span{width:24px;height:2px;background:#fff;border-radius:2px;display:block;transition:all .3s;}
            .nav-pill.scrolled .hamburger span{background:var(--text);}
            .hamburger.open span:nth-child(1){transform:translateY(7px) rotate(45deg);}
            .hamburger.open span:nth-child(2){opacity:0;transform:scaleX(0);}
            .hamburger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}
            .mob-menu{display:none;position:fixed;top:96px;left:24px;right:24px;background:#fff;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,.12);z-index:999;padding:16px 24px 20px;flex-direction:column;gap:4px;}
            .mob-menu.open{display:flex;}
            .mob-menu a{color:var(--text);font-weight:600;font-size:.95rem;padding:12px 16px;border-radius:10px;transition:all .2s;}
            .mob-menu a:hover{background:var(--bg);color:var(--primary);}
            .mob-cta{background:var(--gradient2)!important;color:#fff!important;text-align:center;border-radius:50px!important;margin-top:8px!important;padding:13px!important;}
            .section-inner{max-width:1100px;margin:0 auto;}
            .section-tag{font-size:.75rem;font-weight:700;letter-spacing:.12em;color:var(--accent);text-transform:uppercase;margin-bottom:8px;display:block;}
            .section-title{font-size:clamp(1.8rem,3vw,2.4rem);font-weight:800;color:var(--dark);margin-bottom:16px;line-height:1.2;}
            .section-desc{color:var(--muted);max-width:560px;font-size:1rem;margin-bottom:48px;}
            .status-pill{background:#dcfce7;color:#15803d;border-radius:50px;padding:2px 10px;font-size:.75rem;font-weight:700;}
            .pf-input{width:100%;background:#fff;border:1px solid var(--border);border-radius:10px;padding:11px 14px;font-size:.9rem;outline:none;box-sizing:border-box;font-family:inherit;transition:border-color .2s;}
            .pf-input:focus{border-color:var(--primary);}
            .pf-err{color:#ef4444;font-size:.78rem;margin-top:3px;}
            @media(max-width:768px){
                .nav-pill{width:calc(100% - 32px);padding:0 16px;top:12px;}
                .nav-links{display:none!important;}
                .nav-cta{display:none;}
                .hamburger{display:flex;}
                .hero-inner{grid-template-columns:1fr!important;text-align:center;gap:32px!important;}
                .hero-visual{order:-1;}
                .hero-btns{justify-content:center!important;}
                .hero-socials{justify-content:center!important;}
                .about-grid,.journey-grid,.contact-grid{grid-template-columns:1fr!important;}
                .stats-bar{grid-template-columns:repeat(2,1fr)!important;}
            }
        `}</style>

        {/* NAV */}
        <nav className={`nav-pill${scrolled ? ' scrolled' : ''}`} id="mainNav">
            <a href="#hero" className="nav-logo" onClick={e => navClick(e,'hero')}>
                <div className="badge">SM</div>
                {profile?.name || 'Sital Mahato'}
            </a>
            <ul className="nav-links">
                {['about','skills','projects','services','journey','contact'].map(s => (
                    <li key={s}><a href={`#${s}`} onClick={e => navClick(e,s)}>{s.charAt(0).toUpperCase()+s.slice(1)}</a></li>
                ))}
            </ul>
            <a href={`mailto:${profile?.email||'sitalmahato077@gmail.com'}`} className="nav-cta">Hire Me</a>
            <button className={`hamburger${menuOpen?' open':''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
                <span/><span/><span/>
            </button>
        </nav>

        {/* MOBILE MENU */}
        <div className={`mob-menu${menuOpen?' open':''}`}>
            {['about','skills','projects','services','journey','contact'].map(s => (
                <a key={s} href={`#${s}`} onClick={e => navClick(e,s)}>{s.charAt(0).toUpperCase()+s.slice(1)}</a>
            ))}
            <a href={`mailto:${profile?.email||'sitalmahato077@gmail.com'}`} className="mob-cta">Hire Me</a>
        </div>

        {/* HERO */}
        <section id="hero" style={{minHeight:'100vh',padding:'124px 24px 60px',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(145deg,#0a0f1e 0%,#0f1f3d 40%,#1a1040 70%,#0a0f1e 100%)',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 700px 500px at 75% 30%,rgba(37,99,235,.25) 0%,transparent 65%),radial-gradient(ellipse 500px 400px at 15% 75%,rgba(249,115,22,.15) 0%,transparent 65%)',pointerEvents:'none'}}/>
            <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(rgba(255,255,255,.04) 1px,transparent 1px)',backgroundSize:'40px 40px',pointerEvents:'none'}}/>
            <div className="hero-inner" style={{maxWidth:'1100px',width:'100%',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'60px',alignItems:'center',position:'relative'}}>
                <div>
                    <div style={{display:'inline-flex',alignItems:'center',gap:'8px',background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.2)',padding:'6px 16px',borderRadius:'50px',fontSize:'.8rem',fontWeight:'600',color:'#4ade80',marginBottom:'20px',backdropFilter:'blur(8px)'}}>
                        <span style={{width:'8px',height:'8px',background:'#4ade80',borderRadius:'50%',animation:'pulse 1.5s infinite',display:'inline-block'}}/>
                        {profile?.availability || 'Available for Work'}
                    </div>
                    <div style={{fontFamily:"'Fira Code',monospace",fontSize:'1rem',color:'#fb923c',marginBottom:'20px',fontWeight:'500',minHeight:'1.6em',display:'flex',alignItems:'center',gap:'2px'}}>
                        <span style={{color:'rgba(255,255,255,.4)',marginRight:'4px'}}>&gt;_</span>
                        <span style={{color:'#fb923c'}}>{typedText}</span>
                        <span style={{display:'inline-block',width:'2px',height:'1.1em',background:'#fb923c',marginLeft:'2px',animation:'blink .75s step-end infinite',verticalAlign:'middle'}}/>
                    </div>
                    <h1 style={{fontSize:'clamp(2.2rem,4vw,3.2rem)',fontWeight:'800',lineHeight:'1.15',marginBottom:'8px',color:'#fff'}}>
                        Hello, I'm<br/><span style={{color:'#60a5fa'}}>{profile?.name || 'Sital Mahato'}</span>
                    </h1>
                    <p style={{color:'rgba(255,255,255,.65)',fontSize:'1rem',maxWidth:'480px',marginBottom:'32px'}}>
                        Crafting high-performance, secure, and creative digital solutions. I specialize in building interfaces you can feel and systems that actually work.
                    </p>
                    <div className="hero-btns" style={{display:'flex',gap:'12px',flexWrap:'wrap',marginBottom:'36px'}}>
                        <a href={`mailto:${profile?.email||'sitalmahato077@gmail.com'}`} style={{background:'var(--gradient2)',color:'#fff',padding:'12px 28px',borderRadius:'50px',fontWeight:'700',fontSize:'.95rem',boxShadow:'0 4px 20px rgba(249,115,22,.3)'}}>Hire Me</a>
                        {resumeUrl && <a href={resumeUrl} target="_blank" rel="noreferrer" style={{background:'#fff',color:'var(--primary)',padding:'12px 28px',borderRadius:'50px',fontWeight:'700',fontSize:'.95rem',border:'2px solid var(--primary)'}}>Download CV</a>}
                        <a href={`https://wa.me/${(profile?.phone||'+9779704191610').replace(/\D/g,'')}`} target="_blank" rel="noreferrer" style={{background:'#25d366',color:'#fff',padding:'12px 28px',borderRadius:'50px',fontWeight:'700',fontSize:'.95rem'}}>💬 WhatsApp</a>
                    </div>
                    <div className="hero-socials" style={{display:'flex',gap:'12px'}}>
                        {[{url:profile?.github||'https://github.com/sitalmahato00',icon:GH,title:'GitHub'},{url:profile?.linkedin||'https://linkedin.com/in/sitalmahato',icon:LI,title:'LinkedIn'},{url:`mailto:${profile?.email||'sitalmahato077@gmail.com'}`,icon:EM,title:'Email'},{url:`tel:${(profile?.phone||'+9779704191610').replace(/\s/g,'')}`,icon:PH,title:'Phone'}].map(s=>(
                            <a key={s.title} href={s.url} target={s.url.startsWith('http')?'_blank':undefined} rel="noreferrer" title={s.title} style={{width:'40px',height:'40px',background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.2)',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,.7)',transition:'all .2s',backdropFilter:'blur(8px)'}}>
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>
                <div className="hero-visual" style={{display:'flex',flexDirection:'column',gap:'20px',alignItems:'center'}}>
                    <div style={{position:'relative',width:'280px',height:'280px',display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <div style={{position:'absolute',inset:'-16px',borderRadius:'50%',background:'conic-gradient(from 0deg,#2563eb 0%,#7c3aed 25%,#f97316 50%,#10b981 75%,#2563eb 100%)',animation:'spin-ring 4s linear infinite',WebkitMask:'radial-gradient(farthest-side,transparent calc(100% - 3px),#000 calc(100% - 3px))',mask:'radial-gradient(farthest-side,transparent calc(100% - 3px),#000 calc(100% - 3px))'}}/>
                        <div style={{position:'absolute',inset:'-4px',borderRadius:'50%',border:'2px dashed rgba(255,255,255,.25)',animation:'spin-ring-rev 8s linear infinite'}}/>
                        {[{c:'#60a5fa',d:'0s'},{c:'#f97316',d:'-1s'},{c:'#a78bfa',d:'-2s'},{c:'#34d399',d:'-3s'}].map((o,i)=>(
                            <div key={i} style={{position:'absolute',width:'12px',height:'12px',borderRadius:'50%',background:o.c,zIndex:3,animation:`orbit 4s linear infinite`,animationDelay:o.d,boxShadow:`0 0 8px ${o.c}`}}/>
                        ))}
                        {avatarUrl
                            ? <img src={avatarUrl} alt={profile?.name||'Profile'} style={{width:'250px',height:'250px',borderRadius:'50%',objectFit:'cover',border:'4px solid rgba(255,255,255,.9)',boxShadow:'0 0 0 1px rgba(255,255,255,.1),0 20px 60px rgba(37,99,235,.4)',position:'relative',zIndex:2,animation:'float 6s ease-in-out infinite'}}/>
                            : <div style={{width:'250px',height:'250px',borderRadius:'50%',background:'var(--gradient)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'5rem',color:'#fff',fontWeight:'800',border:'4px solid rgba(255,255,255,.9)',position:'relative',zIndex:2,animation:'float 6s ease-in-out infinite'}}>SM</div>
                        }
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',width:'100%',maxWidth:'300px'}}>
                        {[{n:`${stats.projects_delivered||50}+`,l:'Projects'},{n:`${stats.tech_stack||8}+`,l:'Tech Stack'},{n:`${stats.years_exp||3}+`,l:'Yrs Exp.'}].map(s=>(
                            <div key={s.l} style={{background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.15)',borderRadius:'14px',padding:'14px 10px',textAlign:'center',backdropFilter:'blur(12px)'}}>
                                <div style={{fontSize:'1.4rem',fontWeight:'800',color:'#60a5fa'}}>{s.n}</div>
                                <div style={{fontSize:'.7rem',color:'rgba(255,255,255,.5)',marginTop:'2px'}}>{s.l}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* PROMO BANNER */}
        <div style={{background:'var(--gradient)',padding:'16px 24px',textAlign:'center',color:'#fff'}}>
            <p style={{fontSize:'.95rem'}}>🚀 <strong>Available for Freelance Projects</strong> — Building websites, apps &amp; software for businesses. <strong>Contact: {profile?.email||'sitalmahato077@gmail.com'}</strong></p>
        </div>

        {/* STATS BAR */}
        <section style={{padding:'48px 24px',background:'#fff'}}>
            <div className="section-inner">
                <div className="stats-bar" style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'20px',padding:'32px 40px',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'24px',textAlign:'center',boxShadow:'0 4px 24px rgba(0,0,0,.05)'}}>
                    {[{n:`${stats.projects_delivered||50}+`,l:'Projects Delivered'},{n:`${stats.tech_stack||8}+`,l:'Expert Tech Stack'},{n:stats.client_satisfaction||'100%',l:'Client Satisfaction'},{n:stats.support||'24/7',l:'Support'}].map(s=>(
                        <div key={s.l}>
                            <div style={{fontSize:'2rem',fontWeight:'800',color:'var(--primary)'}}>{s.n}</div>
                            <div style={{fontSize:'.85rem',color:'var(--muted)',marginTop:'4px'}}>{s.l}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ABOUT */}
        <section id="about" style={{padding:'80px 24px'}}>
            <div className="section-inner">
                <div className="about-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'48px',alignItems:'start'}}>
                    <div>
                        <span className="section-tag">// 02. WHO AM I</span>
                        <h2 className="section-title">About Me</h2>
                        {avatarUrl && <div style={{marginBottom:'20px'}}><img src={avatarUrl} alt={profile?.name} style={{width:'80px',height:'80px',borderRadius:'50%',objectFit:'cover',border:'3px solid var(--primary)',boxShadow:'0 4px 16px rgba(37,99,235,.2)'}}/></div>}
                        <p style={{color:'var(--muted)',fontSize:'.95rem',marginBottom:'20px'}}>{profile?.bio || "I'm Sital Mahato, a motivated IT student from Golbazar, Siraha, deeply passionate about building efficient, robust, and user-friendly software solutions."}</p>
                        <div style={{display:'flex',flexDirection:'column',gap:'10px',marginTop:'20px'}}>
                            {[['Name', profile?.name||'Sital Mahato'],['Email', profile?.email||'sitalmahato077@gmail.com'],['Phone', profile?.phone||'+977 9704191610'],['Location', profile?.location||'Golbazar, Siraha, Nepal 🇳🇵']].map(([k,v])=>(
                                <div key={k} style={{display:'flex',gap:'12px',alignItems:'center',background:'#f8faff',borderRadius:'10px',padding:'10px 14px'}}>
                                    <span style={{fontWeight:'700',fontSize:'.85rem',color:'var(--dark)',minWidth:'70px'}}>{k}</span>
                                    <span style={{fontSize:'.85rem',color:'var(--muted)'}}>{v}</span>
                                </div>
                            ))}
                            <div style={{display:'flex',gap:'12px',alignItems:'center',background:'#f8faff',borderRadius:'10px',padding:'10px 14px'}}>
                                <span style={{fontWeight:'700',fontSize:'.85rem',color:'var(--dark)',minWidth:'70px'}}>Status</span>
                                <span className="status-pill">{profile?.availability||'Available'}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
                            {[{icon:'📍',val:'Nepal',desc:'Biratnagar HQ'},{icon:'👥',val:`${stats.tech_stack||8}+`,desc:'Skills Mastered'},{icon:'🏆',val:`${stats.projects_delivered||50}+`,desc:'Projects Done'},{icon:'🎧',val:'24/7',desc:'Always Ready'}].map(c=>(
                                <div key={c.desc} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'16px',padding:'20px',textAlign:'center',boxShadow:'0 2px 12px rgba(0,0,0,.04)'}}>
                                    <div style={{fontSize:'1.8rem',marginBottom:'8px'}}>{c.icon}</div>
                                    <div style={{fontSize:'1.3rem',fontWeight:'800',color:'var(--primary)'}}>{c.val}</div>
                                    <div style={{fontSize:'.78rem',color:'var(--muted)'}}>{c.desc}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{marginTop:'20px',background:'#f0f4ff',borderRadius:'16px',padding:'20px'}}>
                            <div style={{fontWeight:'700',color:'var(--dark)',marginBottom:'10px'}}>Quick Features</div>
                            {['Websites from NPR 7,999','Delivery in 3–5 Days','Free Consultation','Founded 2082 BS · Nepal-based & Global'].map(f=>(
                                <div key={f} style={{display:'flex',gap:'8px',alignItems:'center',fontSize:'.88rem',color:'var(--muted)',marginBottom:'6px'}}>
                                    <span style={{color:'var(--accent2)',fontWeight:'700'}}>✓</span> {f}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* SKILLS */}
        <section id="skills" style={{padding:'80px 24px',background:'#fff'}}>
            <div className="section-inner">
                <span className="section-tag">// 03. ARSENAL</span>
                <h2 className="section-title">My Skills</h2>
                <p className="section-desc">A curated set of technologies I use to build powerful, scalable digital products.</p>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'20px'}}>
                    {Object.entries(skills).map(([cat, items])=>(
                        <div key={cat} style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'16px',padding:'20px'}}>
                            <div style={{fontSize:'.75rem',fontWeight:'700',textTransform:'uppercase',letterSpacing:'.1em',color:'var(--accent)',marginBottom:'12px'}}>
                                {items[0]?.icon} {cat}
                            </div>
                            <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                                {items.map(s=>(
                                    <span key={s.id} style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'8px',padding:'5px 12px',fontSize:'.82rem',fontWeight:'600',color:'var(--text)'}}>{s.name}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" style={{padding:'80px 24px'}}>
            <div className="section-inner">
                <span className="section-tag">// 04. CREATIONS</span>
                <h2 className="section-title">Featured Projects</h2>
                <p className="section-desc">Real-world solutions built with precision and passion.</p>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:'24px'}}>
                    {projects.map(p=>(
                        <div key={p.id} style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'20px',overflow:'hidden',boxShadow:'0 2px 12px rgba(0,0,0,.04)'}}>
                            {imgUrl(p.image) && <div style={{height:'180px',overflow:'hidden'}}><img src={imgUrl(p.image)} alt={p.title} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/></div>}
                            <div style={{padding:'20px'}}>
                                <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'10px'}}>
                                    {(p.tags||[]).map(t=><span key={t} style={{background:'var(--bg)',color:'var(--primary)',borderRadius:'6px',padding:'3px 10px',fontSize:'.74rem',fontWeight:'700',border:'1px solid rgba(37,99,235,.15)'}}>{t}</span>)}
                                </div>
                                <div style={{fontSize:'1.05rem',fontWeight:'800',color:'var(--dark)',marginBottom:'6px'}}>{p.title}</div>
                                <div style={{fontSize:'.85rem',color:'var(--muted)',marginBottom:'14px',lineHeight:'1.5'}}>{p.description}</div>
                                <div style={{display:'flex',gap:'8px'}}>
                                    {p.live_url && p.live_url !== '#' && <a href={p.live_url} target="_blank" rel="noreferrer" style={{background:'var(--primary)',color:'#fff',borderRadius:'8px',padding:'6px 16px',fontSize:'.8rem',fontWeight:'700'}}>Live Demo</a>}
                                    {p.github_url && p.github_url !== '#' && <a href={p.github_url} target="_blank" rel="noreferrer" style={{background:'var(--bg)',color:'var(--text)',borderRadius:'8px',padding:'6px 16px',fontSize:'.8rem',fontWeight:'700',border:'1px solid var(--border)'}}>GitHub</a>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* SERVICES */}
        <section id="services" style={{padding:'80px 24px',background:'#fff'}}>
            <div className="section-inner">
                <span className="section-tag">// 06. WHAT I DO</span>
                <h2 className="section-title">My Services</h2>
                <p className="section-desc">Professional digital solutions tailored for your business needs.</p>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'20px'}}>
                    {services.map(s=>(
                        <div key={s.id} style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'18px',padding:'24px',position:'relative'}}>
                            {s.is_popular && <span style={{position:'absolute',top:'16px',right:'16px',background:'var(--gradient2)',color:'#fff',padding:'3px 10px',borderRadius:'50px',fontSize:'.7rem',fontWeight:'700'}}>Popular</span>}
                            <div style={{fontSize:'2rem',marginBottom:'12px'}}>{s.icon}</div>
                            <div style={{fontSize:'1rem',fontWeight:'800',color:'var(--dark)',marginBottom:'6px'}}>{s.title}</div>
                            <div style={{fontSize:'.85rem',color:'var(--muted)',marginBottom:'14px'}}>{s.description}</div>
                            <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'5px',marginBottom:'16px'}}>
                                {(s.features||[]).map((f,i)=><li key={i} style={{fontSize:'.82rem',color:'var(--text)',display:'flex',alignItems:'center',gap:'8px'}}><span style={{color:'var(--accent2)',fontWeight:'700'}}>✓</span>{f}</li>)}
                            </ul>
                            <a href={`mailto:${profile?.email||'sitalmahato077@gmail.com'}`} style={{color:'var(--primary)',fontWeight:'700',fontSize:'.85rem'}}>Get Quote →</a>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* JOURNEY */}
        <section id="journey" style={{padding:'80px 24px'}}>
            <div className="section-inner">
                <span className="section-tag">// 05. STORY ARC</span>
                <h2 className="section-title">My Journey</h2>
                <p className="section-desc">Experience and education that shaped who I am as a developer.</p>
                <div className="journey-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'32px'}}>
                    {[{label:'💼 Experience',items:workExp},{label:'🎓 Education',items:eduExp}].map(col=>(
                        <div key={col.label}>
                            <div style={{fontSize:'1rem',fontWeight:'800',color:'var(--primary)',marginBottom:'20px',display:'flex',alignItems:'center',gap:'8px'}}>{col.label}</div>
                            <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                                {col.items.map(e=>(
                                    <div key={e.id} style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'16px',padding:'18px 20px',borderLeft:'3px solid var(--primary)'}}>
                                        <div style={{fontSize:'.75rem',fontWeight:'700',color:'var(--accent)',marginBottom:'4px'}}>{e.date_range}</div>
                                        <div style={{fontSize:'.95rem',fontWeight:'800',color:'var(--dark)'}}>{e.title}</div>
                                        <div style={{fontSize:'.82rem',color:'var(--primary)',marginBottom:'6px'}}>{e.subtitle}</div>
                                        <div style={{fontSize:'.82rem',color:'var(--muted)'}}>{e.description}</div>
                                        {e.tags?.length > 0 && (
                                            <div style={{display:'flex',flexWrap:'wrap',gap:'5px',marginTop:'8px'}}>
                                                {e.tags.map(t=><span key={t} style={{background:'var(--bg)',color:'var(--muted)',borderRadius:'5px',padding:'2px 8px',fontSize:'.72rem',fontWeight:'600'}}>{t}</span>)}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{padding:'80px 24px',background:'linear-gradient(160deg,#f0f4ff 0%,#fef3ec 100%)'}}>
            <div className="section-inner">
                <span className="section-tag">// 07. TRANSMISSION</span>
                <h2 className="section-title">Get In Touch</h2>
                <p className="section-desc">Let's build something extraordinary together. Have a project in mind? My inbox is always open.</p>
                <div className="contact-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'48px',alignItems:'start'}}>
                    <div>
                        <div style={{display:'flex',flexDirection:'column',gap:'14px',marginBottom:'24px'}}>
                            {[{icon:'📧',lbl:'Email',val:profile?.email||'sitalmahato077@gmail.com',href:`mailto:${profile?.email||'sitalmahato077@gmail.com'}`},{icon:'📞',lbl:'Phone',val:profile?.phone||'+977 9704191610',href:`tel:${(profile?.phone||'+9779704191610').replace(/\s/g,'')}`},{icon:'📍',lbl:'Location',val:profile?.location||'Golbazar, Siraha, Nepal | Remote worldwide'},{icon:'🕐',lbl:'Availability',val:'Mon–Sat, 9AM–6PM NPT'}].map(item=>(
                                <div key={item.lbl} style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'14px',padding:'16px 18px',display:'flex',alignItems:'center',gap:'14px'}}>
                                    <div style={{fontSize:'1.4rem'}}>{item.icon}</div>
                                    <div>
                                        <div style={{fontSize:'.75rem',color:'var(--muted)'}}>{item.lbl}</div>
                                        <div style={{fontSize:'.9rem',fontWeight:'700',color:'var(--dark)'}}>
                                            {item.href ? <a href={item.href} style={{color:'var(--dark)'}}>{item.val}</a> : item.val}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                            {[{href:`mailto:${profile?.email||'sitalmahato077@gmail.com'}`,label:'📧 Send Email',bg:'var(--gradient)'},{href:`tel:${(profile?.phone||'+9779704191610').replace(/\s/g,'')}`,label:`📞 ${profile?.phone||'+977 9704191610'}`,bg:'#fff',color:'var(--text)',border:'2px solid var(--border)'},{href:profile?.github||'https://github.com/sitalmahato00',label:'View GitHub',bg:'#0f172a'},{href:profile?.linkedin||'https://linkedin.com/in/sitalmahato',label:'LinkedIn Profile',bg:'#0077b5'}].map(btn=>(
                                <a key={btn.label} href={btn.href} target={btn.href.startsWith('http')?'_blank':undefined} rel="noreferrer" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',padding:'14px',borderRadius:'14px',fontWeight:'700',fontSize:'.95rem',color:btn.color||'#fff',background:btn.bg,border:btn.border||'none'}}>{btn.label}</a>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'16px',padding:'20px',marginBottom:'20px'}}>
                            <div style={{fontWeight:'700',fontSize:'.9rem',color:'var(--dark)',marginBottom:'12px'}}>Ready to connect?</div>
                            {[['Response time','Within 24 hours'],['Project type','Web, App, Design'],['Work mode','Remote / Hybrid'],['Status','✅ Available']].map(([k,v])=>(
                                <div key={k} style={{display:'flex',justifyContent:'space-between',fontSize:'.85rem',color:'var(--muted)',padding:'6px 0',borderBottom:'1px solid var(--border)'}}>
                                    <span>{k}</span><span style={{color:'var(--text)',fontWeight:'600'}}>{v}</span>
                                </div>
                            ))}
                        </div>
                        {/* CONTACT FORM */}
                        <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'16px',padding:'24px'}}>
                            <div style={{fontWeight:'700',fontSize:'.95rem',color:'var(--dark)',marginBottom:'16px'}}>Send a Message</div>
                            {contactStatus==='success' && <div style={{padding:'12px',background:'#dcfce7',border:'1px solid #bbf7d0',borderRadius:'10px',color:'#15803d',fontSize:'14px',marginBottom:'14px',fontWeight:'600'}}>✓ Message sent! I'll get back to you soon.</div>}
                            {contactStatus==='error' && <div style={{padding:'12px',background:'#fee2e2',border:'1px solid #fecaca',borderRadius:'10px',color:'#dc2626',fontSize:'14px',marginBottom:'14px'}}>Something went wrong. Please try again.</div>}
                            <form onSubmit={submitContact}>
                                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'12px'}}>
                                    <div>
                                        <input className="pf-input" placeholder="Your Name *" value={contactForm.name} onChange={e=>setContactForm({...contactForm,name:e.target.value})}/>
                                        {contactErrors.name && <div className="pf-err">{contactErrors.name}</div>}
                                    </div>
                                    <div>
                                        <input className="pf-input" type="email" placeholder="Email *" value={contactForm.email} onChange={e=>setContactForm({...contactForm,email:e.target.value})}/>
                                        {contactErrors.email && <div className="pf-err">{contactErrors.email}</div>}
                                    </div>
                                </div>
                                <input className="pf-input" style={{marginBottom:'12px'}} placeholder="Subject" value={contactForm.subject} onChange={e=>setContactForm({...contactForm,subject:e.target.value})}/>
                                <div style={{marginBottom:'14px'}}>
                                    <textarea className="pf-input" rows={4} style={{resize:'vertical'}} placeholder="Your message *" value={contactForm.message} onChange={e=>setContactForm({...contactForm,message:e.target.value})}/>
                                    {contactErrors.message && <div className="pf-err">{contactErrors.message}</div>}
                                </div>
                                <button type="submit" disabled={contactStatus==='sending'} style={{width:'100%',padding:'12px',background:'var(--gradient)',color:'#fff',border:'none',borderRadius:'10px',fontWeight:'700',fontSize:'15px',cursor:'pointer'}}>
                                    {contactStatus==='sending' ? 'Sending…' : 'Send Message →'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* FOOTER */}
        <footer style={{background:'var(--dark)',color:'#94a3b8',padding:'40px 24px',textAlign:'center'}}>
            <div style={{maxWidth:'700px',margin:'0 auto'}}>
                <div style={{fontSize:'1.5rem',fontWeight:'800',color:'#fff',marginBottom:'12px'}}>[ <span style={{color:'var(--accent)'}}>{(profile?.name||'Sital Mahato').split(' ')[0]}</span> {(profile?.name||'Sital Mahato').split(' ').slice(1).join(' ')} ]</div>
                <p style={{fontSize:'.88rem',marginBottom:'20px'}}>Crafting digital experiences. Building the future. 🇳🇵</p>
                <div style={{display:'flex',justifyContent:'center',gap:'20px',flexWrap:'wrap',marginBottom:'20px'}}>
                    {['about','skills','projects','services','journey','contact'].map(s=>(
                        <a key={s} href={`#${s}`} onClick={e=>navClick(e,s)} style={{color:'#94a3b8',fontSize:'.85rem'}}>{s.charAt(0).toUpperCase()+s.slice(1)}</a>
                    ))}
                </div>
                <div style={{fontSize:'.8rem',borderTop:'1px solid #1e293b',paddingTop:'20px'}}>© {new Date().getFullYear()} {profile?.name||'Sital Mahato'}. Crafted with ♥ &amp; ☕ in Nepal.</div>
            </div>
        </footer>
        </>
    );
}
