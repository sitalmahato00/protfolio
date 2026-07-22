import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import '../../../css/portfolio.css';

const SITE      = 'https://sital.info.np';
const SITE_NAME = 'Sital Mahato';

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
const allProjectImgs = p => (p.images?.length ? p.images : (p.image ? [p.image] : []));
const slugify = t => t?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ?? '';

const LOCAL_CSS = `
  .project-card{position:relative;border-radius:20px;overflow:hidden;cursor:pointer;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);transition:transform .3s,border-color .3s,box-shadow .3s;height:100%;display:flex;flex-direction:column;}
  .project-card:hover{transform:translateY(-6px);border-color:rgba(124,58,237,.3);box-shadow:0 20px 60px rgba(124,58,237,.15);}
  .filter-btn{padding:6px 18px;border-radius:999px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);color:rgba(148,163,184,.7);font-size:.8rem;font-weight:600;cursor:pointer;transition:all .2s;font-family:'Inter',sans-serif;}
  .filter-btn.active,.filter-btn:hover{background:linear-gradient(135deg,#7c3aed,#4f46e5);border-color:transparent;color:#fff;}
  .fade-up{animation:fadeUp .6s ease both;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
`;

export default function ProjectsIndex({ projects, profile }) {
    const [filter, setFilter] = useState('');
    const allTags = [...new Set(projects.flatMap(p => p.tags || []))];
    const filtered = filter ? projects.filter(p => (p.tags || []).includes(filter)) : projects;

    const profileName = profile?.name || SITE_NAME;
    const seoTitle   = `Projects | ${profileName} — Full Stack Developer Portfolio Nepal`;
    const seoDesc    = `Browse all ${projects.length} projects by ${profileName}, Full Stack Developer in Nepal. Laravel, React, PHP enterprise applications and web projects.`;
    const keywords   = [
        'Sital Mahato', 'sital.info.np', 'Full Stack Developer Nepal', 'Best Full Stack Developer Nepal',
        'Software Developer Nepal', 'Best Software Developer Nepal', 'Laravel Developer Nepal',
        'Best Laravel Developer Nepal', 'React Developer Nepal', 'Best React Developer Nepal',
        'PHP Developer Nepal', 'Portfolio Nepal', 'Web Development Projects Nepal',
        'Software Engineer Nepal', 'Freelancer Nepal', 'JavaScript Developer Nepal',
        'TypeScript', 'Mobile App Development Nepal', 'Best Website Developer Nepal',
        'Hire Laravel Developer Nepal', 'Hire React Developer Nepal', 'Website Developer in Siraha',
        'Software Developer in Koshi Province', 'Custom Software Development Nepal',
        'Software Development Company Nepal', 'E-commerce Website Developer in Nepal',
    ].join(', ');

    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            '@id': SITE + '/projects',
            'url': SITE + '/projects',
            'name': seoTitle,
            'description': seoDesc,
            'isPartOf': { '@id': SITE + '/#website' },
            'author': { '@id': SITE + '/#person' },
            'numberOfItems': projects.length,
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
                { '@type': 'ListItem', 'position': 1, 'name': 'Home',     'item': SITE },
                { '@type': 'ListItem', 'position': 2, 'name': 'Projects', 'item': SITE + '/projects' },
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            'name': 'Portfolio Projects',
            'itemListElement': projects.map((p, i) => ({
                '@type': 'ListItem',
                'position': i + 1,
                'name': p.title,
                'url': SITE + '/projects/' + (p.slug || slugify(p.title)),
            })),
        },
    ];

    return (
        <>
        <Head title={seoTitle}>
          <link rel="canonical" href={`${SITE}/projects`} />
          <meta name="description"   content={seoDesc} />
          <meta name="keywords"      content={keywords} />
          <meta name="author"        content={profileName} />
          <meta name="robots"        content="index, follow, max-snippet:-1, max-image-preview:large" />

          <meta property="og:type"        content="website" />
          <meta property="og:url"         content={`${SITE}/projects`} />
          <meta property="og:site_name"   content={SITE_NAME} />
          <meta property="og:title"       content={seoTitle} />
          <meta property="og:description" content={seoDesc} />
          <meta property="og:image"       content={`${SITE}/images/image.webp`} />

          <meta name="twitter:card"        content="summary_large_image" />
          <meta name="twitter:site"        content="@sitalmahato" />
          <meta name="twitter:title"       content={seoTitle} />
          <meta name="twitter:description" content={seoDesc} />
          <meta name="twitter:image"       content={`${SITE}/images/image.webp`} />

          <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        </Head>
        <style dangerouslySetInnerHTML={{__html: LOCAL_CSS}} />

        <div className="aurora">
            <div className="aurora-blob" style={{width:'700px',height:'700px',background:'#7c3aed',top:'-200px',left:'-200px'}}/>
            <div className="aurora-blob" style={{width:'500px',height:'500px',background:'#4f46e5',top:'30%',right:'-100px',animationDelay:'-7s'}}/>
            <div className="aurora-blob" style={{width:'400px',height:'400px',background:'#3b82f6',bottom:'0',left:'30%',animationDelay:'-14s'}}/>
        </div>

        <nav className="nav-root">
            <Link href="/" style={{display:'flex',alignItems:'center',gap:10,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:'1rem',color:'#fff'}}>
                <div style={{width:34,height:34,borderRadius:9,background:'linear-gradient(135deg,#7c3aed,#4f46e5)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.8rem',fontWeight:900,boxShadow:'0 0 20px rgba(124,58,237,.4)'}}>SM</div>
                {profile?.name || 'Sital Mahato'}
            </Link>
            <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:6,padding:'8px 18px',borderRadius:10,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',color:'rgba(226,232,240,.7)',fontSize:'.84rem',fontWeight:600}}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                Home
            </Link>
        </nav>

        <main style={{position:'relative',zIndex:2,padding:'100px 24px 80px',minHeight:'100vh'}}>
            <div style={{maxWidth:1200,margin:'0 auto'}}>

                <div className="fade-up" style={{marginBottom:52}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,fontSize:'.82rem',fontWeight:500,marginBottom:20,color:'rgba(148,163,184,.5)'}}>
                        <Link href="/" style={{color:'rgba(148,163,184,.5)'}}>Portfolio</Link>
                        <span style={{color:'rgba(255,255,255,.15)'}}>&#8250;</span>
                        <span style={{color:'rgba(167,139,250,.8)',fontWeight:600}}>Projects</span>
                    </div>
                    <div className="section-label" style={{marginBottom:12}}>Portfolio</div>
                    <h1 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'clamp(32px,5vw,56px)',fontWeight:800,letterSpacing:'-.02em',marginBottom:12}}>
                        All <span className="grad-text">Projects</span>
                    </h1>
                    <p style={{color:'rgba(148,163,184,.78)',fontSize:'1rem'}}>
                        Explore my complete collection — <span style={{color:'#a78bfa',fontWeight:600}}>{projects.length} projects</span> and counting.
                    </p>
                    <p style={{color:'rgba(148,163,184,.7)',fontSize:'.92rem',lineHeight:1.7,marginTop:16,maxWidth:640}}>
                        A curated portfolio of <strong style={{color:'rgba(226,232,240,.85)'}}>Laravel</strong>, <strong style={{color:'rgba(226,232,240,.85)'}}>React</strong>, and <strong style={{color:'rgba(226,232,240,.85)'}}>PHP</strong> applications built by Sital Mahato, a Full Stack Developer based in Nepal. Each project represents real-world problem-solving — from enterprise management platforms to mobile apps.
                    </p>
                </div>

                {allTags.length > 0 && (
                    <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:40}}>
                        <button className={`filter-btn${!filter?' active':''}`} onClick={() => setFilter('')}>All</button>
                        {allTags.slice(0,14).map(t => (
                            <button key={t} className={`filter-btn${filter===t?' active':''}`} onClick={() => setFilter(t)}>{t}</button>
                        ))}
                    </div>
                )}

                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))',gap:24}}>
                    {filtered.map((p, i) => {
                        const imgs = allProjectImgs(p);
                        const pSlug = p.slug || slugify(p.title);
                        return (
                            <div key={p.id} className="fade-up" style={{animationDelay:`${i*.06}s`}}>
                                <Link href={`/projects/${pSlug}`} style={{display:'block',height:'100%'}}>
                                    <article className="project-card">
                                        <div style={{height:200,overflow:'hidden',flexShrink:0,background:'rgba(124,58,237,.08)'}}>
                                            {imgs.length > 0
                                                ? <img src={imgUrl(imgs[0])} alt={`${p.title} — project screenshot`} title={p.title} loading="lazy" width="400" height="225" style={{width:'100%',height:'100%',objectFit:'cover',display:'block',transition:'transform .4s'}}
                                                    onMouseEnter={e=>e.target.style.transform='scale(1.05)'}
                                                    onMouseLeave={e=>e.target.style.transform='scale(1)'}/>
                                                : <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="rgba(124,58,237,.4)" strokeWidth="1.5" width="48" height="48"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 21V9"/></svg>
                                                  </div>
                                            }
                                            <div style={{position:'absolute',bottom:0,left:0,right:0,height:'50%',background:'linear-gradient(to top,rgba(5,8,22,.9),transparent)',pointerEvents:'none'}}/>
                                        </div>

                                        <div style={{padding:'20px 22px 22px',flex:1,display:'flex',flexDirection:'column'}}>
                                            <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:10}}>
                                                {(p.tags||[]).slice(0,4).map(t=><span key={t} className="tag-pill">{t}</span>)}
                                            </div>
                                            <div style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:'1.05rem',color:'#fff',marginBottom:8}}>{p.title}</div>
                                            <div style={{fontSize:'.84rem',color:'rgba(148,163,184,.78)',lineHeight:1.65,flex:1,display:'-webkit-box',WebkitLineClamp:3,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{p.description}</div>
                                            <div style={{display:'flex',gap:8,marginTop:16,flexWrap:'wrap'}}>
                                                {p.live_url && p.live_url !== '#' && (
                                                    <span onClick={e=>{e.stopPropagation();e.preventDefault();window.open(p.live_url,'_blank','noreferrer');}}
                                                        style={{display:'inline-flex',alignItems:'center',gap:5,padding:'6px 14px',borderRadius:8,background:'linear-gradient(135deg,#7c3aed,#4f46e5)',color:'#fff',fontSize:'.78rem',fontWeight:700,cursor:'pointer'}}>
                                                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                                        Live Demo
                                                    </span>
                                                )}
                                                {p.github_url && p.github_url !== '#' && (
                                                    <span onClick={e=>{e.stopPropagation();e.preventDefault();window.open(p.github_url,'_blank','noreferrer');}}
                                                        style={{display:'inline-flex',alignItems:'center',gap:5,padding:'6px 14px',borderRadius:8,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',color:'rgba(226,232,240,.7)',fontSize:'.78rem',fontWeight:700,cursor:'pointer'}}>
                                                        <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                                                        GitHub
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            </div>
                        );
                    })}
                </div>

                {filtered.length === 0 && (
                    <div style={{textAlign:'center',padding:'80px 24px',color:'rgba(148,163,184,.5)'}}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="rgba(124,58,237,.4)" strokeWidth="1.5" width="56" height="56" style={{margin:'0 auto 16px',display:'block'}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <div style={{fontSize:'1.1rem',fontWeight:700,color:'rgba(226,232,240,.6)',marginBottom:6}}>No projects found</div>
                        <button className="filter-btn active" onClick={()=>setFilter('')} style={{marginTop:12}}>Clear filter</button>
                    </div>
                )}
            </div>
        </main>

        <footer style={{position:'relative',zIndex:2,background:'rgba(0,0,0,.4)',backdropFilter:'blur(20px)',borderTop:'1px solid rgba(255,255,255,.06)',padding:'48px 24px',textAlign:'center'}}>
            <div style={{maxWidth:700,margin:'0 auto'}}>
                <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'1.4rem',fontWeight:800,color:'#fff',marginBottom:10}}>
                    <span style={{color:'rgba(167,139,250,.8)'}}>{(profile?.name||'Sital Mahato').split(' ')[0]}</span>{' '}
                    {(profile?.name||'Sital Mahato').split(' ').slice(1).join(' ')}
                </div>
                <p style={{color:'rgba(148,163,184,.5)',fontSize:'.85rem',marginBottom:20}}>Crafting digital experiences. Building the future.</p>
                <div style={{display:'flex',justifyContent:'center',gap:6,flexWrap:'wrap',marginBottom:24}}>
                    {['about','skills','projects','services','experience','contact'].map(s=>(
                        <Link key={s} href={`/#${s}`} style={{padding:'5px 14px',borderRadius:8,color:'rgba(148,163,184,.5)',fontSize:'.82rem',fontWeight:500,transition:'color .2s'}}
                            onMouseEnter={e=>e.target.style.color='#a78bfa'} onMouseLeave={e=>e.target.style.color='rgba(148,163,184,.5)'}>
                            {s.charAt(0).toUpperCase()+s.slice(1)}
                        </Link>
                    ))}
                </div>
                <div style={{fontSize:'.78rem',color:'rgba(148,163,184,.3)',borderTop:'1px solid rgba(255,255,255,.05)',paddingTop:20}}>
                    © {new Date().getFullYear()} {profile?.name||'Sital Mahato'}. Crafted with ♥ in Nepal.
                </div>
            </div>
        </footer>
        </>
    );
}
