import { useState, useEffect, lazy, Suspense } from 'react';
import { Head } from '@inertiajs/react';
import '../../css/portfolio.css';
import {
  PortfolioNavbar, PortfolioHero, PortfolioMarquee,
} from '../Components/PortfolioSections';

const PortfolioAbout = lazy(() => import('../Components/PortfolioSections').then(m => ({ default: m.PortfolioAbout })));
const PortfolioSkills = lazy(() => import('../Components/PortfolioSections').then(m => ({ default: m.PortfolioSkills })));
const PortfolioProjects = lazy(() => import('../Components/PortfolioSections').then(m => ({ default: m.PortfolioProjects })));
const PortfolioServices = lazy(() => import('../Components/PortfolioSections').then(m => ({ default: m.PortfolioServices })));
const PortfolioExperience = lazy(() => import('../Components/PortfolioSections').then(m => ({ default: m.PortfolioExperience })));
const PortfolioCertificates = lazy(() => import('../Components/PortfolioSections').then(m => ({ default: m.PortfolioCertificates })));
const PortfolioContact = lazy(() => import('../Components/PortfolioSections').then(m => ({ default: m.PortfolioContact })));
const PortfolioFAQ = lazy(() => import('../Components/PortfolioSections').then(m => ({ default: m.PortfolioFAQ })));
const PortfolioFooter = lazy(() => import('../Components/PortfolioSections').then(m => ({ default: m.PortfolioFooter })));

const imgMod = import.meta.glob('./assets/images/*.{webp,png}', { eager: true });
const aMap = {};
for (const [p, m] of Object.entries(imgMod)) { aMap[p.split('/').pop()] = m.default || m; }

const imgUrl = s => { if (!s) return null; if (s.startsWith('http')) return s; return aMap[s.replace(/^images\//,'')] || '/'+s; };

export default function Portfolio({ profile=null, skills={}, projects=[], services=[], experiences=[], certificates=[], stats={} }) {
  const [stuck, setStuck] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [typedText, setTypedText] = useState('');
  const [wIdx, setWIdx] = useState(0);
  const [cIdx, setCIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [contactForm, setContactForm] = useState({ name:'', email:'', subject:'', message:'' });
  const [cStatus, setCStatus] = useState('idle');
  const [cErrors, setCErrors] = useState({});
  const [skillTab, setSkillTab] = useState(null);
  const [projFilter, setProjFilter] = useState('all');
  const [mouse, setMouse] = useState({ x:0, y:0 });
  const [hoveredProj, setHoveredProj] = useState(null);

  /* throttled mouse tracker */
  useEffect(() => {
    let raf = null;
    const fn = e => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setMouse({ x:e.clientX, y:e.clientY });
        raf = null;
      });
    };
    window.addEventListener('mousemove', fn, { passive:true });
    return () => { window.removeEventListener('mousemove', fn); if (raf) cancelAnimationFrame(raf); };
  }, []);

  const words = profile?.typewriter_words?.length
    ? profile.typewriter_words
    : ['Full Stack Developer','Laravel & PHP Expert','UI/UX Designer','React Developer','Problem Solver','Freelancer · Nepal'];

  /* scroll listener */
  useEffect(() => {
    const fn = () => setStuck(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive:true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* typewriter — starts after initial render */
  useEffect(() => {
    const word = words[wIdx] || '';
    const delay = wIdx === 0 && cIdx === 0 ? 600 : (deleting ? 45 : 90);
    const t = setTimeout(() => {
      if (!deleting) {
        if (cIdx < word.length) { setTypedText(word.slice(0, cIdx+1)); setCIdx(c=>c+1); }
        else { setTimeout(()=>setDeleting(true), 1800); }
      } else {
        if (cIdx > 0) { setTypedText(word.slice(0, cIdx-1)); setCIdx(c=>c-1); }
        else { setDeleting(false); setWIdx(i=>(i+1)%words.length); }
      }
    }, delay);
    return () => clearTimeout(t);
  }, [cIdx, deleting, wIdx, words]);

  /* skill tab init */
  useEffect(() => {
    const keys = Object.keys(skills);
    if (keys.length && !skillTab) setSkillTab(keys[0]);
  }, [skills]);

  const avatarUrl = imgUrl(profile?.avatar);
  const resumeUrl = profile?.resume ? imgUrl(profile.resume) : '/images/sitalmahato.pdf';
  const allImgs = p => {
    const raw = p.images?.length ? p.images : (p.image ? [p.image] : []);
    return raw.map(s => imgUrl(s) || s);
  };
  const navTo = (e, id) => { e.preventDefault(); setMenuOpen(false); setActiveNav(id); document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); };
  const allTags = [...new Set(projects.flatMap(p => p.tags||[]))].slice(0,6);
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

  const workExp = experiences.filter(e=>e.type==='work');
  const eduExp = experiences.filter(e=>e.type==='education');

  const siteUrl = 'https://sital.info.np';
  const seoName = profile?.name || 'Sital Mahato';
  const seoTitle = `${seoName} | Full Stack Developer Nepal — Laravel & React Expert`;
  const seoDesc = `${seoName} — Full Stack Developer in Nepal specializing in Laravel, React & PHP. Explore the portfolio or hire for your next project.`;
  const ogImage = avatarUrl ? (avatarUrl.startsWith('http') ? avatarUrl : siteUrl+'/'+profile.avatar) : siteUrl+'/images/avatar_6a3fbd303e6af.webp';
  const favHref = avatarUrl ? (avatarUrl.startsWith('http') ? avatarUrl : '/'+profile.avatar) : '/images/avatar_6a3fbd303e6af.webp';
  const favCB = profile?.updated_at ? '?v='+new Date(profile.updated_at).getTime() : '';
  const faqSchema = {'@context':'https://schema.org','@type':'FAQPage','mainEntity':[
    {'@type':'Question','name':'What technologies does Sital Mahato specialise in?','acceptedAnswer':{'@type':'Answer','text':'Sital specialises in Laravel, React, PHP, TypeScript, MySQL, and modern web technologies. He builds full-stack enterprise applications with a focus on clean architecture and performance.'}},
    {'@type':'Question','name':'Is Sital Mahato available for hire?','acceptedAnswer':{'@type':'Answer','text':'Yes, Sital is currently available for freelance projects, remote contract work, and full-time opportunities. You can reach him via the contact form, email, or WhatsApp.'}},
    {'@type':'Question','name':'Where is Sital Mahato based?','acceptedAnswer':{'@type':'Answer','text':'Sital is based in Golbazar, Siraha, Nepal. He works with clients worldwide and is comfortable across time zones.'}},
    {'@type':'Question','name':'What kind of projects has Sital built?','acceptedAnswer':{'@type':'Answer','text':'Sital has built enterprise-grade college management platforms, ID card generation systems, digital form management systems, academic result portals, and mobile applications.'}},
    {'@type':'Question','name':'How can I contact Sital Mahato?','acceptedAnswer':{'@type':'Answer','text':'You can use the contact form on this page, email sitalmahato077@gmail.com, or reach out via WhatsApp at +977 9704191610.'}},
    {'@type':'Question','name':'What is Sital experience level?','acceptedAnswer':{'@type':'Answer','text':'Sital has 3+ years of professional experience working with Laravel, React, and PHP. He has delivered 6+ production applications currently in active use.'}},
  ]};
  const jsonLd = JSON.stringify([
    {'@context':'https://schema.org','@type':'Person','@id':siteUrl+'/#person',name:seoName,url:siteUrl,image:{url:ogImage},jobTitle:'Full Stack Developer',email:profile?.email||'sitalmahato077@gmail.com',telephone:profile?.phone||'+977 9704191610',address:{'@type':'PostalAddress',addressLocality:'Golbazar, Siraha',addressCountry:'NP'},knowsAbout:['Laravel','React','PHP','UI/UX','JavaScript','MySQL'],sameAs:[profile?.github||'https://github.com/sitalmahato00',profile?.linkedin||'https://linkedin.com/in/sitalmahato']},
    {'@context':'https://schema.org','@type':'WebSite','@id':siteUrl+'/#website',url:siteUrl,name:seoName+' — Portfolio',author:{'@id':siteUrl+'/#person'}},
    {'@context':'https://schema.org','@type':'Organization','@id':siteUrl+'/#organization','url':siteUrl,'name':seoName,'description':seoDesc,'foundingDate':'2021','email':profile?.email||'sitalmahato077@gmail.com','telephone':profile?.phone||'+977 9704191610','address':{'@type':'PostalAddress','addressLocality':'Golbazar, Siraha','addressCountry':'NP'}},
    faqSchema,
  ]);

  const navLinks = ['home','about','skills','projects','services','experience','certificates','contact'];

  const techStack = [
    { label:'React', src:'https://cdn.simpleicons.org/react/61dafb', color:'#61dafb' },
    { label:'Laravel', src:'https://cdn.simpleicons.org/laravel/ff2d20', color:'#ff2d20' },
    { label:'PHP', src:'https://cdn.simpleicons.org/php/777bb4', color:'#777bb4' },
    { label:'MySQL', src:'https://cdn.simpleicons.org/mysql/4479a1', color:'#4479a1' },
    { label:'JavaScript', src:'https://cdn.simpleicons.org/javascript/f7df1e', color:'#f7df1e' },
    { label:'TypeScript', src:'https://cdn.simpleicons.org/typescript/3178c6', color:'#3178c6' },
    { label:'Node.js', src:'https://cdn.simpleicons.org/nodedotjs/417e38', color:'#417e38' },
    { label:'TailwindCSS', src:'https://cdn.simpleicons.org/tailwindcss/38bdf8', color:'#38bdf8' },
    { label:'Git', src:'https://cdn.simpleicons.org/git/f05032', color:'#f05032' },
    { label:'Docker', src:'https://cdn.simpleicons.org/docker/2496ed', color:'#2496ed' },
    { label:'Redis', src:'https://cdn.simpleicons.org/redis/dc382d', color:'#dc382d' },
    { label:'Next.js', src:'https://cdn.simpleicons.org/nextdotjs/ffffff', color:'#fff' },
    { label:'Vue.js', src:'https://cdn.simpleicons.org/vuedotjs/4fc08d', color:'#4fc08d' },
    { label:'AWS', src:'https://cdn.simpleicons.org/amazonaws/ff9900', color:'#ff9900' },
    { label:'Figma', src:'https://cdn.simpleicons.org/figma/f24e1e', color:'#f24e1e' },
    { label:'Linux', src:'https://cdn.simpleicons.org/linux/fcc624', color:'#fcc624' },
  ];

  return (<>
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

    <div className="aurora">
      <div className="aurora-blob" style={{width:'800px',height:'800px',background:'#7c3aed',top:'-200px',left:'-200px',animationDelay:'0s'}}/>
      <div className="aurora-blob" style={{width:'600px',height:'600px',background:'#4f46e5',top:'20%',right:'-100px',animationDelay:'-7s'}}/>
      <div className="aurora-blob" style={{width:'500px',height:'500px',background:'#3b82f6',bottom:'0',left:'30%',animationDelay:'-14s'}}/>
      <div className="aurora-blob" style={{width:'400px',height:'400px',background:'#06b6d4',bottom:'20%',right:'10%',animationDelay:'-4s'}}/>
    </div>

    <div style={{
      position:'fixed', zIndex:1, pointerEvents:'none', borderRadius:'50%',
      width:400, height:400,
      background:'radial-gradient(circle, rgba(124,58,237,.06) 0%, transparent 70%)',
      transform:`translate(${mouse.x-200}px,${mouse.y-200}px)`,
      transition:'transform 0.1s linear',
      willChange:'transform',
    }}/>

    <PortfolioNavbar profile={profile} stuck={stuck} menuOpen={menuOpen} setMenuOpen={setMenuOpen} activeNav={activeNav} navTo={navTo} navLinks={navLinks} />

    <main style={{position:'relative',zIndex:2}}>
      <PortfolioHero profile={profile} stats={stats} skills={skills} words={words} typedText={typedText}
        mouse={mouse} avatarUrl={avatarUrl} resumeUrl={resumeUrl} seoName={seoName}
        navTo={navTo} techStack={techStack} />

      <PortfolioMarquee techStack={techStack} />

      <Suspense fallback={null}><PortfolioAbout profile={profile} stats={stats} avatarUrl={avatarUrl} seoName={seoName} resumeUrl={resumeUrl} /></Suspense>

      <Suspense fallback={null}><PortfolioSkills skills={skills} skillTab={skillTab} setSkillTab={setSkillTab} /></Suspense>

      <Suspense fallback={null}><PortfolioProjects projects={projects} allTags={allTags} projFilter={projFilter}
        setProjFilter={setProjFilter} filteredProjects={filteredProjects}
        allImgs={allImgs} hoveredProj={hoveredProj} setHoveredProj={setHoveredProj} /></Suspense>

      <Suspense fallback={null}><PortfolioServices services={services} profile={profile} /></Suspense>

      <Suspense fallback={null}><PortfolioExperience experiences={experiences} profile={profile} workExp={workExp} eduExp={eduExp} /></Suspense>

      <Suspense fallback={null}><PortfolioCertificates certificates={certificates} /></Suspense>

      <Suspense fallback={null}><PortfolioContact profile={profile} contactForm={contactForm} setContactForm={setContactForm}
        cStatus={cStatus} setCStatus={setCStatus} cErrors={cErrors} setCErrors={setCErrors}
        submitContact={submitContact} /></Suspense>

      <Suspense fallback={null}><PortfolioFAQ profile={profile} /></Suspense>

      <Suspense fallback={null}><PortfolioFooter profile={profile} navLinks={navLinks} navTo={navTo} /></Suspense>
    </main>
  </>);
}
