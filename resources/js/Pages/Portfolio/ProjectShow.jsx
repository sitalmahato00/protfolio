import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import '../../../css/portfolio.css';

const SITE     = 'https://sital.info.np';
const SITE_NAME = 'Sital Mahato';

// ─── Image helpers ────────────────────────────────────────────────────────────
const imgModules = import.meta.glob('./assets/images/*.{webp,png}', { eager: true });
const assetImgMap = {};
for (const [p, m] of Object.entries(imgModules)) {
    assetImgMap[p.split('/').pop()] = m.default || m;
}
const imgUrl = s => {
    if (!s) return null;
    if (s.startsWith('http')) return s;
    const webp = s.replace(/^images\//, '').replace(/\.(png|jpg|jpeg)$/i, '.webp');
    return assetImgMap[webp] || '/' + s;
};
const ogImgUrl = s => {
    if (!s) return SITE + '/images/image.webp';
    if (s.startsWith('http')) return s;
    return SITE + '/' + s.replace(/^\//, '');
};

// ─── Auto SEO helpers ─────────────────────────────────────────────────────────
const slugify = t => t?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ?? '';

const buildTitle = (project, profileName) => {
    const name  = profileName || SITE_NAME;
    const title = project?.title || 'Project';
    const tags  = project?.tags || [];
    const mainTag = tags[0] ? `${tags[0]} Project` : 'Web Project';
    const full  = `${title} | ${mainTag} | ${name}`;
    return full.length <= 70 ? full : `${title} | ${name}`;
};

const buildDescription = project => {
    const title = project?.title || 'Project';
    const desc  = (project?.description || '').replace(/\s+/g, ' ').trim();
    const tags  = (project?.tags || []).slice(0, 3).join(', ');
    const base  = `${title} — a web project by Sital Mahato, Full Stack Developer Nepal. ${desc}`;
    return base.length > 157 ? base.slice(0, 154) + '...' : base;
};

const GLOBAL_KEYWORDS = [
    // Core Identity
    'Sital Mahato', 'sital.info.np', 'Sital Mahato Portfolio', 'Sital Mahato Developer',
    // Full Stack
    'Full Stack Developer Nepal', 'Best Full Stack Developer Nepal', 'Hire Full Stack Developer Nepal',
    'Professional Full Stack Developer Nepal', 'Full Stack Web Development Nepal',
    // Software Developer
    'Software Developer Nepal', 'Best Software Developer Nepal', 'Software Engineer Nepal',
    'Freelance Software Developer Nepal', 'Custom Software Developer Nepal',
    'Best Software Developer in Nepal', 'Software Development Company Nepal',
    // Website Developer
    'Website Developer Nepal', 'Best Website Developer Nepal', 'Best Website Developer in Nepal',
    'Professional Website Developer Nepal', 'Freelance Website Developer Nepal',
    'Business Website Developer Nepal', 'Corporate Website Developer Nepal',
    'Responsive Website Developer Nepal', 'SEO Website Developer Nepal',
    'Affordable Website Development in Nepal', 'Web Development Services in Nepal',
    // Web / Frontend / Backend
    'Web Developer Nepal', 'Frontend Developer Nepal', 'Backend Developer Nepal',
    'UI UX Designer Nepal', 'Website Development Nepal',
    // Laravel
    'Laravel Developer Nepal', 'Best Laravel Developer Nepal', 'Hire Laravel Developer Nepal',
    'Senior Laravel Developer', 'Best Laravel Developer in Nepal', 'Hire Laravel Developer in Nepal',
    // React / Next / Node
    'React Developer Nepal', 'Next.js Developer Nepal', 'NestJS Developer Nepal',
    'Node.js Developer Nepal', 'Best React Developer in Nepal', 'Hire React Developer Nepal',
    // PHP / JS / TS
    'PHP Developer Nepal', 'JavaScript Developer Nepal', 'TypeScript Developer Nepal',
    // Mobile
    'Flutter Developer Nepal', 'Android App Developer Nepal', 'Mobile App Developer Nepal',
    'Cross Platform App Developer Nepal', 'Mobile App Development Company Nepal',
    // Database / Cloud / API
    'Supabase Developer', 'Firebase Developer', 'PostgreSQL Developer', 'MySQL Developer',
    'MongoDB Developer', 'REST API Developer', 'GraphQL Developer',
    'API Development Services Nepal', 'API Integration Expert',
    // IT Services
    'IT Consultant Nepal', 'Digital Solutions Nepal', 'SEO Expert Nepal',
    'AI Developer Nepal', 'Machine Learning Developer Nepal', 'Digital Transformation Nepal',
    // Management Systems
    'School Management System Nepal', 'College Management System Nepal',
    'Library Management System Nepal', 'Hospital Management System Nepal',
    'Inventory Management System Nepal', 'POS System Nepal',
    'CRM Development Nepal', 'ERP Development Nepal', 'Custom ERP Development Nepal',
    // Location: Siraha
    'Software Developer in Siraha', 'Website Developer in Siraha', 'Laravel Developer in Siraha',
    'React Developer in Siraha', 'Hire Software Developer in Siraha',
    // Location: Koshi Province
    'Software Developer in Koshi Province', 'Website Developer in Koshi Province',
    'Laravel Developer in Koshi Province', 'React Developer in Koshi Province',
    // Location: Madhesh Province
    'Software Developer in Madhesh Province', 'Website Developer in Madhesh Province',
    // Location: Kathmandu
    'Software Developer in Kathmandu', 'Website Developer in Kathmandu',
    // Location: Biratnagar / Dharan / Itahari
    'Software Developer in Biratnagar', 'Software Developer in Dharan', 'Software Developer in Itahari',
    // Hire long-tail
    'Hire Website Developer Nepal', 'Hire Software Developer Nepal',
    'Hire Next.js Developer Nepal', 'Hire NestJS Developer Nepal',
    'Hire Mobile App Developer', 'Hire PHP Developer',
    // Long-tail high-converting
    'Best Laravel Developer in Koshi Province', 'E-commerce Website Developer in Nepal',
    'React and Laravel Developer Nepal', 'Full Stack Development Services',
    'Custom Software Development in Nepal', 'Software Development Company in Nepal',
];

const buildKeywords = project => {
    const global = GLOBAL_KEYWORDS;
    const fromTags = (project?.tags || []).flatMap(t => [t, `${t} Developer`, `${t} Development`]);
    const fromTitle = (project?.title || '').split(' ').filter(w => w.length > 3);
    const fromCat   = project?.category ? [project.category, `${project.category} Nepal`] : [];
    const specific  = project?.seo_keywords ? project.seo_keywords.split(', ') : [];
    return [...new Set([...global, ...fromTags, ...fromTitle, ...fromCat, ...specific])].slice(0, 20).join(', ');
};

const buildJsonLd = (project, profileName, url, ogImage) => {
    const name = profileName || SITE_NAME;
    const tags = project?.tags || [];
    return [
        {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            '@id': url + '#softwareapp',
            'name': project?.title,
            'description': buildDescription(project),
            'url': url,
            'author': { '@type': 'Person', 'name': name, 'url': SITE },
            'creator': { '@type': 'Person', 'name': name, 'url': SITE },
            'applicationCategory': project?.category || 'WebApplication',
            'operatingSystem': 'Web',
            'programmingLanguage': tags,
            'keywords': tags.slice(0, 10).join(', '),
            'image': ogImage,
            'datePublished': project?.created_at,
            'dateModified': project?.updated_at,
            'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD',
                'availability': 'https://schema.org/InStock' },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
                { '@type': 'ListItem', 'position': 1, 'name': 'Home',     'item': SITE },
                { '@type': 'ListItem', 'position': 2, 'name': 'Projects', 'item': SITE + '/projects' },
                { '@type': 'ListItem', 'position': 3, 'name': project?.title },
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': url,
            'url': url,
            'name': buildTitle(project, name),
            'description': buildDescription(project),
            'isPartOf': { '@id': SITE + '/#website' },
            'author': { '@id': SITE + '/#person' },
            'image': ogImage ? { '@type': 'ImageObject', 'url': ogImage } : undefined,
        },
    ];
};

// ─── Component ────────────────────────────────────────────────────────────────
const LOCAL_CSS = `
  .thumb{height:72px;border-radius:10px;object-fit:cover;cursor:pointer;border:2px solid transparent;transition:all .2s;opacity:.6;}
  .thumb:hover{opacity:1;}
  .thumb.active{border-color:#7c3aed;opacity:1;box-shadow:0 0 16px rgba(124,58,237,.4);}
  .lightbox{position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:9000;display:flex;align-items:center;justify-content:center;cursor:pointer;backdrop-filter:blur(8px);}
  .fade-up{animation:fadeUp .6s ease both;}
  .related-card{border-radius:14px;overflow:hidden;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);transition:all .2s;}
  .related-card:hover{border-color:rgba(124,58,237,.3);transform:translateY(-3px);}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
`;

export default function ProjectShow({ project, profile, relatedProjects = [] }) {
    const [selectedIdx, setSelectedIdx] = useState(0);
    const [lightbox, setLightbox]       = useState(false);

    const allImages  = project?.images?.length ? project.images : (project?.image ? [project.image] : []);
    const tags       = project?.tags || [];
    const currentImg = allImages[selectedIdx];
    const slug       = project?.slug || slugify(project?.title || '');
    const pageUrl    = `${SITE}/projects/${slug}`;
    const ogImage    = ogImgUrl(project?.image || allImages[0]);
    const seoTitle   = buildTitle(project, profile?.name);
    const seoDesc    = buildDescription(project);
    const keywords   = buildKeywords(project);
    const jsonLd     = buildJsonLd(project, profile?.name, pageUrl, ogImage);

    return (
        <>
        <Head title={seoTitle}>
            <link rel="canonical" href={pageUrl} />
            <meta name="description"   content={seoDesc} />
            <meta name="keywords"      content={keywords} />
            <meta name="author"        content={profile?.name || SITE_NAME} />
            <meta name="robots"        content="index, follow, max-snippet:-1, max-image-preview:large" />

            {/* Open Graph */}
            <meta property="og:type"        content="article" />
            <meta property="og:url"         content={pageUrl} />
            <meta property="og:site_name"   content={SITE_NAME} />
            <meta property="og:title"       content={seoTitle} />
            <meta property="og:description" content={seoDesc} />
            <meta property="og:image"       content={ogImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt"   content={project?.title + ' — ' + (profile?.name || SITE_NAME)} />
            <meta property="article:author" content={profile?.name || SITE_NAME} />
            {tags.slice(0, 5).map(t => (
                <meta key={t} property="article:tag" content={t} />
            ))}

            {/* Twitter Card */}
            <meta name="twitter:card"        content="summary_large_image" />
            <meta name="twitter:site"        content="@sitalmahato" />
            <meta name="twitter:creator"     content="@sitalmahato" />
            <meta name="twitter:title"       content={seoTitle} />
            <meta name="twitter:description" content={seoDesc} />
            <meta name="twitter:image"       content={ogImage} />
            <meta name="twitter:image:alt"   content={project?.title + ' — ' + (profile?.name || SITE_NAME)} />

            {/* Structured Data */}
            <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        </Head>
        <style dangerouslySetInnerHTML={{__html: LOCAL_CSS}} />

        <div className="aurora">
            <div className="aurora-blob" style={{width:'700px',height:'700px',background:'#7c3aed',top:'-200px',left:'-200px'}}/>
            <div className="aurora-blob" style={{width:'500px',height:'500px',background:'#4f46e5',top:'30%',right:'-100px',animationDelay:'-7s'}}/>
            <div className="aurora-blob" style={{width:'400px',height:'400px',background:'#3b82f6',bottom:'0',left:'30%',animationDelay:'-14s'}}/>
        </div>

        {/* ─── Nav ─── */}
        <nav className="nav-root">
            <Link href="/" style={{display:'flex',alignItems:'center',gap:10,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:'1rem',color:'#fff'}}>
                <div style={{width:34,height:34,borderRadius:9,background:'linear-gradient(135deg,#7c3aed,#4f46e5)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.8rem',fontWeight:900,boxShadow:'0 0 20px rgba(124,58,237,.4)'}}>SM</div>
                {profile?.name || 'Sital Mahato'}
            </Link>
            <Link href="/projects" style={{display:'inline-flex',alignItems:'center',gap:6,padding:'8px 18px',borderRadius:10,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',color:'rgba(226,232,240,.7)',fontSize:'.84rem',fontWeight:600}}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                Back
            </Link>
        </nav>

        <main style={{position:'relative',zIndex:2,padding:'100px 24px 80px',minHeight:'100vh'}}>
            <div style={{maxWidth:960,margin:'0 auto'}}>

                {/* ─── Breadcrumb (visible) ─── */}
                <nav aria-label="Breadcrumb" className="fade-up" style={{marginBottom:28,display:'flex',alignItems:'center',gap:8}}>
                    <Link href="/" style={{color:'rgba(148,163,184,.5)',fontSize:'.82rem',fontWeight:500,display:'inline-flex',alignItems:'center',gap:5}}>
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                        Home
                    </Link>
                    <span style={{color:'rgba(255,255,255,.15)'}}>›</span>
                    <Link href="/projects" style={{color:'rgba(148,163,184,.5)',fontSize:'.82rem',fontWeight:500}}>Projects</Link>
                    <span style={{color:'rgba(255,255,255,.15)'}}>›</span>
                    <span style={{color:'rgba(167,139,250,.8)',fontSize:'.82rem',fontWeight:600}}>{project?.title}</span>
                </nav>

                {/* ─── Image gallery ─── */}
                {allImages.length > 0 && (
                    <div className="fade-up" style={{animationDelay:'.1s',marginBottom:36,borderRadius:20,overflow:'hidden',background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)'}}>
                        <div style={{position:'relative',overflow:'hidden',maxHeight:260,background:'rgba(5,8,22,.8)'}}>
                            <img
                                src={imgUrl(currentImg)}
                                alt={`${project?.title} — screenshot`}
                                title={project?.title}
                                loading="eager"
                                width="800" height="450"
                                style={{width:'100%',maxHeight:260,objectFit:'cover',display:'block',cursor:'zoom-in'}}
                                onClick={() => setLightbox(true)}
                            />
                            <div style={{position:'absolute',bottom:14,right:14,background:'rgba(0,0,0,.5)',backdropFilter:'blur(8px)',borderRadius:8,padding:'5px 10px',fontSize:'.72rem',color:'rgba(255,255,255,.6)',display:'flex',alignItems:'center',gap:4,pointerEvents:'none'}}>
                                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                                Click to zoom
                            </div>
                        </div>
                        {allImages.length > 1 && (
                            <div style={{display:'flex',gap:8,padding:'12px 14px',overflowX:'auto',background:'rgba(0,0,0,.2)'}}>
                                {allImages.map((img, i) => (
                                    <img key={i}
                                        src={imgUrl(img)}
                                        alt={`${project?.title} screenshot ${i + 1}`}
                                        title={`${project?.title} — image ${i + 1}`}
                                        loading="lazy" width="120" height="72"
                                        className={`thumb${i === selectedIdx ? ' active' : ''}`}
                                        style={{height:72,borderRadius:10,objectFit:'cover',cursor:'pointer',border:i===selectedIdx?'2px solid #7c3aed':'2px solid transparent',opacity:i===selectedIdx?1:.55,transition:'all .2s'}}
                                        onClick={() => setSelectedIdx(i)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ─── Content + sidebar ─── */}
                <div className="fade-up" style={{animationDelay:'.2s',display:'grid',gridTemplateColumns:'1fr auto',gap:40,alignItems:'start'}}>
                    <div>
                        <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:16}}>
                            {tags.map(t => <span key={t} className="tag-pill">{t}</span>)}
                        </div>

                        <h1 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'clamp(24px,4vw,40px)',fontWeight:800,letterSpacing:'-.02em',lineHeight:1.15,marginBottom:20}}>
                            {project?.title}
                        </h1>

                        <div className="grad-border" style={{padding:24,marginBottom:28}}>
                            <p style={{color:'rgba(148,163,184,.8)',fontSize:'1rem',lineHeight:1.8,whiteSpace:'pre-wrap'}}>{project?.description}</p>
                        </div>

                        <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                            {project?.live_url && project.live_url !== '#' && (
                                <a href={project.live_url} target="_blank" rel="noreferrer noopener"
                                    style={{display:'inline-flex',alignItems:'center',gap:8,padding:'12px 28px',borderRadius:12,background:'linear-gradient(135deg,#7c3aed,#4f46e5)',border:'1px solid rgba(124,58,237,.4)',color:'#fff',fontWeight:700,fontSize:'.92rem',boxShadow:'0 0 24px rgba(124,58,237,.3)'}}>
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                    Live Demo
                                </a>
                            )}
                            {project?.github_url && project.github_url !== '#' && (
                                <a href={project.github_url} target="_blank" rel="noreferrer noopener"
                                    style={{display:'inline-flex',alignItems:'center',gap:8,padding:'12px 28px',borderRadius:12,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.12)',color:'rgba(226,232,240,.85)',fontWeight:700,fontSize:'.92rem'}}>
                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                                    View Source
                                </a>
                            )}
                        </div>
                    </div>

                    {/* ─── Tech sidebar ─── */}
                    <aside style={{minWidth:180}} aria-label="Tech Stack">
                        <div className="grad-border" style={{padding:20}}>
                            <h2 style={{fontSize:'.7rem',fontFamily:"'JetBrains Mono',monospace",color:'rgba(148,163,184,.4)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:14}}>
                                Tech Stack
                            </h2>
                            <div style={{display:'flex',flexDirection:'column',gap:8}}>
                                {tags.map(t => (
                                    <div key={t} style={{display:'flex',alignItems:'center',gap:8,color:'rgba(226,232,240,.75)',fontSize:'.84rem',fontWeight:500}}>
                                        <span style={{width:6,height:6,borderRadius:'50%',background:'linear-gradient(135deg,#7c3aed,#3b82f6)',flexShrink:0}}/>
                                        {t}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>

                {/* ─── Related projects (internal linking) ─── */}
                {relatedProjects.length > 0 && (
                    <section className="fade-up" style={{animationDelay:'.4s',marginTop:64}} aria-label="Related Projects">
                        <h2 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'1.3rem',fontWeight:700,marginBottom:20,color:'rgba(226,232,240,.9)'}}>
                            Related <span className="grad-text">Projects</span>
                        </h2>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:16}}>
                            {relatedProjects.map(p => {
                                const relSlug = p.slug || slugify(p.title);
                                const relImg  = p.images?.[0] || p.image;
                                return (
                                    <Link key={p.id} href={`/projects/${relSlug}`}>
                                        <article className="related-card">
                                            {relImg && (
                                                <img
                                                    src={imgUrl(relImg)}
                                                    alt={`${p.title} — related project`}
                                                    title={p.title}
                                                    loading="lazy"
                                                    width="320" height="180"
                                                    style={{width:'100%',height:140,objectFit:'cover',display:'block'}}
                                                />
                                            )}
                                            <div style={{padding:'14px 16px'}}>
                                                <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:6}}>
                                                    {(p.tags||[]).slice(0,3).map(t=><span key={t} className="tag-pill">{t}</span>)}
                                                </div>
                                                <div style={{fontWeight:700,fontSize:'.9rem',color:'rgba(226,232,240,.9)'}}>{p.title}</div>
                                                <div style={{fontSize:'.78rem',color:'rgba(148,163,184,.6)',marginTop:4,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{p.description}</div>
                                            </div>
                                        </article>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}

            </div>
        </main>

        {/* ─── Lightbox ─── */}
        {lightbox && (
            <div className="lightbox" onClick={() => setLightbox(false)} role="dialog" aria-modal="true" aria-label="Image lightbox">
                <img src={imgUrl(currentImg)} alt={`${project?.title} — fullscreen`}
                    style={{maxWidth:'95vw',maxHeight:'95vh',borderRadius:16,objectFit:'contain',boxShadow:'0 40px 120px rgba(0,0,0,.8)',width:'auto',height:'auto'}} />
                <button aria-label="Close" style={{position:'absolute',top:20,right:20,width:40,height:40,borderRadius:'50%',background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.2)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                    <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
        )}

        {/* ─── Footer ─── */}
        <footer style={{position:'relative',zIndex:2,background:'rgba(0,0,0,.4)',backdropFilter:'blur(20px)',borderTop:'1px solid rgba(255,255,255,.06)',padding:'48px 24px',textAlign:'center'}}>
            <div style={{maxWidth:700,margin:'0 auto'}}>
                <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'1.4rem',fontWeight:800,color:'#fff',marginBottom:10}}>
                    <span style={{color:'rgba(167,139,250,.8)'}}>{(profile?.name||'Sital Mahato').split(' ')[0]}</span>{' '}
                    {(profile?.name||'Sital Mahato').split(' ').slice(1).join(' ')}
                </div>
                <p style={{color:'rgba(148,163,184,.5)',fontSize:'.85rem',marginBottom:20}}>Crafting digital experiences. Building the future.</p>
                <nav aria-label="Footer navigation" style={{display:'flex',justifyContent:'center',gap:6,flexWrap:'wrap',marginBottom:24}}>
                    {['about','skills','projects','services','experience','contact'].map(s=>(
                        <Link key={s} href={`/#${s}`} style={{padding:'5px 14px',borderRadius:8,color:'rgba(148,163,184,.5)',fontSize:'.82rem',fontWeight:500,transition:'color .2s'}}
                            onMouseEnter={e=>e.target.style.color='#a78bfa'} onMouseLeave={e=>e.target.style.color='rgba(148,163,184,.5)'}>
                            {s.charAt(0).toUpperCase()+s.slice(1)}
                        </Link>
                    ))}
                </nav>
                <div style={{fontSize:'.78rem',color:'rgba(148,163,184,.3)',borderTop:'1px solid rgba(255,255,255,.05)',paddingTop:20}}>
                    © {new Date().getFullYear()} {profile?.name||'Sital Mahato'}. Crafted with ♥ in Nepal.
                </div>
            </div>
        </footer>
        </>
    );
}
