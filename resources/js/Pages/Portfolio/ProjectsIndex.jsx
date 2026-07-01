import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

const imgModules = import.meta.glob('./assets/images/*.{webp,png}', { eager: true });
const assetImgMap = {};
for (const [p, m] of Object.entries(imgModules)) {
    const name = p.split('/').pop();
    assetImgMap[name] = m.default || m;
}

const imgUrl = s => {
    if (!s) return null;
    if (s.startsWith('http')) return s;
    const webpName = s.replace(/^images\//, '').replace(/\.(png|jpg|jpeg)$/i, '.webp');
    return assetImgMap[webpName] || '/' + s;
};

const allProjectImgs = p => (p.images?.length ? p.images : (p.image ? [p.image] : []));

export default function ProjectsIndex({ projects, profile }) {
    const [filter, setFilter] = useState('');

    const allTags = [...new Set(projects.flatMap(p => p.tags || []))];
    const filtered = filter
        ? projects.filter(p => (p.tags || []).some(t => t.toLowerCase().includes(filter.toLowerCase())))
        : projects;

    return (
        <>
        <Head title={'Projects — ' + (profile?.name || 'Sital Mahato')} />
        <style>{`
            :root{--primary:#2563eb;--primary-dark:#1d4ed8;--accent:#c2410c;--accent2:#10b981;--bg:#f8faff;--white:#ffffff;--dark:#0f172a;--text:#1e293b;--muted:#64748b;--border:#e2e8f0;--card:#ffffff;}
            *{margin:0;padding:0;box-sizing:border-box;}
            body{font-family:'Plus Jakarta Sans','Inter',sans-serif;background:var(--bg);color:var(--text);line-height:1.6;}
            a{color:inherit;text-decoration:none;}
            .nav-pill{position:fixed;top:16px;left:50%;transform:translateX(-50%);width:calc(100% - 48px);max-width:1100px;background:rgba(255,255,255,0.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(0,0,0,0.08);border-radius:16px;z-index:1000;padding:0 24px;height:60px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 4px 24px rgba(0,0,0,0.06);}
            .nav-logo{font-size:.95rem;font-weight:800;color:var(--dark);display:flex;align-items:center;gap:10px;}
            .badge{width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,#1e3a8a,#2563eb,#7c3aed);color:#fff;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:800;}
            .nav-links{list-style:none;display:flex;gap:6px;align-items:center;}
            .nav-links a{padding:6px 14px;border-radius:10px;font-size:.82rem;font-weight:600;color:var(--muted);transition:all .2s;}
            .nav-links a:hover{background:rgba(37,99,235,0.08);color:var(--primary);}
            .section-inner{max-width:1100px;margin:0 auto;}
            @media(max-width:640px){.nav-links{display:none;}}
        `}</style>

        <nav className="nav-pill">
            <Link href="/" className="nav-logo">
                <div className="badge">SM</div>
                {profile?.name || 'Sital Mahato'}
            </Link>
            <ul className="nav-links">
                <li><Link href="/">Home</Link></li>
            </ul>
        </nav>

        <main style={{padding:'100px 24px 60px'}}>
            <div className="section-inner">
                <div style={{marginBottom:'40px'}}>
                    <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:'6px',color:'var(--muted)',fontSize:'.85rem',fontWeight:'600',marginBottom:'16px'}}>← Back to Portfolio</Link>
                    <h1 style={{fontSize:'2.2rem',fontWeight:'800',color:'var(--dark)',marginBottom:'8px'}}>All Projects</h1>
                    <p style={{color:'var(--muted)',fontSize:'1rem'}}>Explore my complete collection of work — {projects.length} projects and counting.</p>
                </div>

                {allTags.length > 0 && (
                    <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'32px'}}>
                        <button onClick={() => setFilter('')} style={{padding:'6px 16px',borderRadius:'50px',border:'1px solid var(--border)',background: !filter ? 'var(--primary)' : '#fff',color: !filter ? '#fff' : 'var(--text)',fontSize:'.82rem',fontWeight:'600',cursor:'pointer',transition:'all .2s'}}>All</button>
                        {allTags.slice(0, 12).map(t => (
                            <button key={t} onClick={() => setFilter(t)} style={{padding:'6px 16px',borderRadius:'50px',border:'1px solid var(--border)',background: filter === t ? 'var(--primary)' : '#fff',color: filter === t ? '#fff' : 'var(--text)',fontSize:'.82rem',fontWeight:'600',cursor:'pointer',transition:'all .2s'}}>{t}</button>
                        ))}
                    </div>
                )}

                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:'24px'}}>
                    {filtered.map(p => (
                        <Link key={p.id} href={`/project/${p.id}`} style={{textDecoration:'none',color:'inherit',display:'block'}}>
                            <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'20px',overflow:'hidden',boxShadow:'0 2px 12px rgba(0,0,0,.04)',transition:'all .25s',cursor:'pointer'}}
                                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 8px 30px rgba(0,0,0,.1)';}}
                                onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='';}}>
                                {allProjectImgs(p).length > 0 && <div style={{height:'180px',overflow:'hidden'}}><img src={imgUrl(allProjectImgs(p)[0])} alt={p.title} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/></div>}
                                <div style={{padding:'20px'}}>
                                    <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'10px'}}>
                                        {(p.tags||[]).map(t=><span key={t} style={{background:'var(--bg)',color:'var(--primary)',borderRadius:'6px',padding:'3px 10px',fontSize:'.74rem',fontWeight:'700',border:'1px solid rgba(37,99,235,.15)'}}>{t}</span>)}
                                    </div>
                                    <div style={{fontSize:'1.05rem',fontWeight:'800',color:'var(--dark)',marginBottom:'6px'}}>{p.title}</div>
                                    <div style={{fontSize:'.85rem',color:'var(--muted)',marginBottom:'14px',lineHeight:'1.5'}}>{p.description}</div>
                                    <div style={{display:'flex',gap:'8px'}}>
                                        {p.live_url && p.live_url !== '#' && <span onClick={e => { e.stopPropagation(); e.preventDefault(); window.open(p.live_url, '_blank', 'noreferrer'); }} style={{background:'var(--primary)',color:'#fff',borderRadius:'8px',padding:'6px 16px',fontSize:'.8rem',fontWeight:'700',cursor:'pointer'}}>Live Demo</span>}
                                        {p.github_url && p.github_url !== '#' && <span onClick={e => { e.stopPropagation(); e.preventDefault(); window.open(p.github_url, '_blank', 'noreferrer'); }} style={{background:'var(--bg)',color:'var(--text)',borderRadius:'8px',padding:'6px 16px',fontSize:'.8rem',fontWeight:'700',border:'1px solid var(--border)',cursor:'pointer'}}>GitHub</span>}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div style={{textAlign:'center',padding:'80px 24px',color:'var(--muted)'}}>
                        <div style={{fontSize:'48px',marginBottom:'16px'}}>🔍</div>
                        <div style={{fontSize:'18px',fontWeight:'600',color:'var(--dark)',marginBottom:'6px'}}>No projects found</div>
                        <p style={{fontSize:'14px'}}>Try a different filter or <Link href="/projects" style={{color:'var(--primary)',fontWeight:'600'}}>view all</Link></p>
                    </div>
                )}
            </div>
        </main>

        <footer style={{background:'var(--dark)',color:'#94a3b8',padding:'40px 24px',textAlign:'center'}}>
            <div style={{maxWidth:'700px',margin:'0 auto'}}>
                <div style={{fontSize:'1.5rem',fontWeight:'800',color:'#fff',marginBottom:'12px'}}>[ <span style={{color:'var(--accent)'}}>{(profile?.name||'Sital Mahato').split(' ')[0]}</span> {(profile?.name||'Sital Mahato').split(' ').slice(1).join(' ')} ]</div>
                <p style={{fontSize:'.88rem',marginBottom:'20px'}}>Crafting digital experiences. Building the future. 🇳🇵</p>
                <div style={{display:'flex',justifyContent:'center',gap:'20px',flexWrap:'wrap',marginBottom:'20px'}}>
                    {['about','skills','projects','services','journey','contact'].map(s => (
                        <Link key={s} href="/" style={{color:'#94a3b8',fontSize:'.85rem'}}>{s.charAt(0).toUpperCase() + s.slice(1)}</Link>
                    ))}
                </div>
                <div style={{fontSize:'.8rem',borderTop:'1px solid #1e293b',paddingTop:'20px'}}>© {new Date().getFullYear()} {profile?.name||'Sital Mahato'}. Crafted with ♥ &amp; ☕ in Nepal.</div>
            </div>
        </footer>
        </>
    );
}