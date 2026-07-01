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

export default function ProjectShow({ project, profile }) {
    const [lightbox, setLightbox] = useState(null);
    const [selectedIdx, setSelectedIdx] = useState(0);

    const allImages = project?.images?.length ? project.images : (project?.image ? [project.image] : []);
    const tags = project?.tags || [];
    const currentImg = allImages[selectedIdx] || allImages[0];

    return (
        <>
        <Head title={(project?.title || 'Project') + ' — ' + (profile?.name || 'Sital Mahato')} />
        <style>{`
            :root{--primary:#2563eb;--primary-dark:#1d4ed8;--accent:#c2410c;--accent2:#10b981;--bg:#f8faff;--white:#ffffff;--dark:#0f172a;--text:#1e293b;--muted:#64748b;--border:#e2e8f0;--card:#ffffff;}
            *{margin:0;padding:0;box-sizing:border-box;}
            body{font-family:'Plus Jakarta Sans','Inter',sans-serif;background:var(--bg);color:var(--text);line-height:1.6;}
            a{color:inherit;text-decoration:none;}
            .nav-pill{position:fixed;top:16px;left:50%;transform:translateX(-50%);width:calc(100% - 48px);max-width:1100px;background:rgba(255,255,255,0.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(0,0,0,0.08);border-radius:16px;z-index:1000;padding:0 24px;height:60px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 4px 24px rgba(0,0,0,0.06);}
            .nav-logo{font-size:.95rem;font-weight:800;color:var(--dark);display:flex;align-items:center;gap:10px;}
            .badge{width:32px;height:32px;border-radius:10px;background:var(--gradient,linear-gradient(135deg,#1e3a8a,#2563eb,#7c3aed));color:#fff;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:800;}
            .nav-links{list-style:none;display:flex;gap:6px;align-items:center;}
            .nav-links a{padding:6px 14px;border-radius:10px;font-size:.82rem;font-weight:600;color:var(--muted);transition:all .2s;}
            .nav-links a:hover{background:rgba(37,99,235,0.08);color:var(--primary);}
            .section-inner{max-width:1100px;margin:0 auto;}
            .lightbox-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:2000;display:flex;align-items:center;justify-content:center;cursor:pointer;}
            @media(max-width:640px){.nav-links{display:none;}}
        `}</style>

        {/* NAV */}
        <nav className="nav-pill">
            <Link href="/" className="nav-logo">
                <div className="badge">SM</div>
                {profile?.name || 'Sital Mahato'}
            </Link>
            <ul className="nav-links">
                <li><Link href="/">← Back</Link></li>
            </ul>
        </nav>

        <main style={{padding:'100px 24px 60px'}}>
            <div className="section-inner">
                {/* Back link */}
                <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:'6px',color:'var(--muted)',fontSize:'.85rem',fontWeight:'600',marginBottom:'24px'}}>← Back to Portfolio</Link>

                {/* Image Gallery */}
                {allImages.length > 0 && (
                    <div style={{borderRadius:'20px',overflow:'hidden',boxShadow:'0 4px 30px rgba(0,0,0,0.08)',marginBottom:'32px',background:'#fff'}}>
                        <img src={imgUrl(currentImg)} alt={project?.title} style={{width:'100%',maxHeight:'500px',objectFit:'cover',display:'block',cursor:'pointer'}} onClick={() => setLightbox(currentImg)} />
                        {allImages.length > 1 && (
                            <div style={{display:'flex',gap:'8px',padding:'12px',overflowX:'auto'}}>
                                {allImages.map((img, i) => (
                                    <img key={i} src={imgUrl(img)} alt="" style={{height:'70px',borderRadius:'10px',objectFit:'cover',cursor:'pointer',border: i === selectedIdx ? '2px solid var(--primary)' : '1px solid var(--border)',opacity: i === selectedIdx ? 1 : 0.6,transition:'all .2s'}}
                                        onClick={() => { setSelectedIdx(i); setLightbox(img); }}
                                        onMouseEnter={e => e.currentTarget.style.opacity='1'}
                                        onMouseLeave={e => {if (i !== selectedIdx) e.currentTarget.style.opacity='0.6'}} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Project Info */}
                <div style={{maxWidth:'800px'}}>
                    <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'14px'}}>
                        {tags.map(t => (
                            <span key={t} style={{background:'rgba(37,99,235,0.08)',color:'var(--primary)',borderRadius:'6px',padding:'4px 12px',fontSize:'.8rem',fontWeight:'700'}}>{t}</span>
                        ))}
                    </div>
                    <h1 style={{fontSize:'2rem',fontWeight:'800',color:'var(--dark)',marginBottom:'16px',lineHeight:1.2}}>{project?.title}</h1>
                    <p style={{fontSize:'1.05rem',color:'var(--muted)',lineHeight:'1.7',marginBottom:'28px'}}>{project?.description}</p>
                    <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
                        {project?.live_url && project.live_url !== '#' && (
                            <a href={project.live_url} target="_blank" rel="noreferrer" style={{background:'var(--primary)',color:'#fff',padding:'12px 28px',borderRadius:'50px',fontWeight:'700',fontSize:'.95rem',display:'inline-flex',alignItems:'center',gap:'8px'}}>
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                Live Demo
                            </a>
                        )}
                        {project?.github_url && project.github_url !== '#' && (
                            <a href={project.github_url} target="_blank" rel="noreferrer" style={{background:'var(--dark)',color:'#fff',padding:'12px 28px',borderRadius:'50px',fontWeight:'700',fontSize:'.95rem',display:'inline-flex',alignItems:'center',gap:'8px'}}>
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                                View Source
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </main>

        {/* Lightbox */}
        {lightbox && (
            <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
                <img src={imgUrl(lightbox)} alt="" style={{maxWidth:'90vw',maxHeight:'90vh',borderRadius:'12px',objectFit:'contain'}} />
            </div>
        )}

        {/* FOOTER */}
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