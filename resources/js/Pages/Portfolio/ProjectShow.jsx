import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

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

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  body{font-family:'Inter',sans-serif;background:#050816;color:#e2e8f0;overflow-x:hidden;line-height:1.6;-webkit-font-smoothing:antialiased;}
  ::selection{background:rgba(124,58,237,.4);color:#fff;}
  ::-webkit-scrollbar{width:3px;}
  ::-webkit-scrollbar-track{background:#050816;}
  ::-webkit-scrollbar-thumb{background:linear-gradient(#7c3aed,#3b82f6);border-radius:3px;}
  a{color:inherit;text-decoration:none;}
  body::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    opacity:.4;}
  .aurora{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;}
  .aurora-blob{position:absolute;border-radius:50%;filter:blur(120px);opacity:.1;animation:aurora-move 20s ease-in-out infinite alternate;}
  @keyframes aurora-move{0%{transform:translate(0,0) scale(1);}50%{transform:translate(40px,-30px) scale(1.08);}100%{transform:translate(-20px,20px) scale(.96);}}
  .nav-root{position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:1000;width:calc(100% - 48px);max-width:1100px;height:56px;display:flex;align-items:center;justify-content:space-between;padding:0 20px;background:rgba(255,255,255,.06);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,.12);border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,.15),inset 0 1px 0 rgba(255,255,255,.1);}
  .grad-border{position:relative;background:rgba(5,8,22,.8);border-radius:16px;}
  .grad-border::before{content:'';position:absolute;inset:0;border-radius:16px;padding:1px;background:linear-gradient(135deg,rgba(124,58,237,.5),rgba(59,130,246,.3),transparent 60%);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;}
  .tag-pill{display:inline-flex;align-items:center;padding:4px 12px;border-radius:999px;background:rgba(124,58,237,.12);border:1px solid rgba(124,58,237,.25);color:#a78bfa;font-size:.73rem;font-weight:600;white-space:nowrap;}
  .section-label{display:inline-flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:.72rem;font-weight:500;letter-spacing:.15em;color:#7c3aed;text-transform:uppercase;}
  .section-label::before{content:'';width:24px;height:1px;background:linear-gradient(90deg,#7c3aed,transparent);}
  .grad-text{background:linear-gradient(135deg,#fff 0%,#a78bfa 50%,#60a5fa 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .thumb{height:72px;border-radius:10px;object-fit:cover;cursor:pointer;border:2px solid transparent;transition:all .2s;opacity:.6;}
  .thumb:hover{opacity:1;}
  .thumb.active{border-color:#7c3aed;opacity:1;box-shadow:0 0 16px rgba(124,58,237,.4);}
  .lightbox{position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:9000;display:flex;align-items:center;justify-content:center;cursor:pointer;backdrop-filter:blur(8px);}
  @media(max-width:640px){.nav-root{width:calc(100% - 24px);padding:0 14px;top:10px;}}
`;

export default function ProjectShow({ project, profile }) {
    const [selectedIdx, setSelectedIdx] = useState(0);
    const [lightbox, setLightbox] = useState(false);

    const allImages = project?.images?.length ? project.images : (project?.image ? [project.image] : []);
    const tags = project?.tags || [];
    const currentImg = allImages[selectedIdx];

    return (
        <>
        <Head title={(project?.title || 'Project') + ' — ' + (profile?.name || 'Sital Mahato')} />
        <style dangerouslySetInnerHTML={{__html: GLOBAL_CSS}} />

        {/* Aurora */}
        <div className="aurora">
            <div className="aurora-blob" style={{width:'700px',height:'700px',background:'#7c3aed',top:'-200px',left:'-200px'}}/>
            <div className="aurora-blob" style={{width:'500px',height:'500px',background:'#4f46e5',top:'30%',right:'-100px',animationDelay:'-7s'}}/>
            <div className="aurora-blob" style={{width:'400px',height:'400px',background:'#3b82f6',bottom:'0',left:'30%',animationDelay:'-14s'}}/>
        </div>

        {/* Nav */}
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

                {/* Breadcrumb */}
                <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} style={{marginBottom:28,display:'flex',alignItems:'center',gap:8}}>
                    <Link href="/" style={{color:'rgba(148,163,184,.5)',fontSize:'.82rem',fontWeight:500,display:'inline-flex',alignItems:'center',gap:5}}>
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                        Portfolio
                    </Link>
                    <span style={{color:'rgba(255,255,255,.15)'}}>›</span>
                    <Link href="/projects" style={{color:'rgba(148,163,184,.5)',fontSize:'.82rem',fontWeight:500}}>Projects</Link>
                    <span style={{color:'rgba(255,255,255,.15)'}}>›</span>
                    <span style={{color:'rgba(167,139,250,.8)',fontSize:'.82rem',fontWeight:600}}>{project?.title}</span>
                </motion.div>

                {/* Image Gallery */}
                {allImages.length > 0 && (
                    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.1}}
                        style={{marginBottom:36,borderRadius:20,overflow:'hidden',background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)'}}>
                        {/* Main image */}
                        <div style={{position:'relative',overflow:'hidden',maxHeight:520,background:'rgba(5,8,22,.8)'}}>
                            <img src={imgUrl(currentImg)} alt={project?.title}
                                style={{width:'100%',maxHeight:520,objectFit:'cover',display:'block',cursor:'zoom-in'}}
                                onClick={() => setLightbox(true)} />
                            {/* zoom hint */}
                            <div style={{position:'absolute',bottom:14,right:14,background:'rgba(0,0,0,.5)',backdropFilter:'blur(8px)',borderRadius:8,padding:'5px 10px',fontSize:'.72rem',color:'rgba(255,255,255,.6)',display:'flex',alignItems:'center',gap:4,pointerEvents:'none'}}>
                                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                                Click to zoom
                            </div>
                        </div>
                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div style={{display:'flex',gap:8,padding:'12px 14px',overflowX:'auto',background:'rgba(0,0,0,.2)'}}>
                                {allImages.map((img, i) => (
                                    <img key={i} src={imgUrl(img)} alt=""
                                        className={`thumb${i === selectedIdx ? ' active' : ''}`}
                                        style={{height:72,borderRadius:10,objectFit:'cover',cursor:'pointer',border:i===selectedIdx?'2px solid #7c3aed':'2px solid transparent',opacity:i===selectedIdx?1:.55,transition:'all .2s'}}
                                        onClick={() => setSelectedIdx(i)} />
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Project Info */}
                <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.2}}
                    style={{display:'grid',gridTemplateColumns:'1fr auto',gap:40,alignItems:'start'}}>
                    <div>
                        {/* Tags */}
                        <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:16}}>
                            {tags.map(t => <span key={t} className="tag-pill">{t}</span>)}
                        </div>

                        {/* Title */}
                        <h1 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'clamp(24px,4vw,40px)',fontWeight:800,letterSpacing:'-.02em',lineHeight:1.15,marginBottom:20}}>
                            {project?.title}
                        </h1>

                        {/* Description */}
                        <div className="grad-border" style={{padding:24,marginBottom:28}}>
                            <p style={{color:'rgba(148,163,184,.8)',fontSize:'1rem',lineHeight:1.8,whiteSpace:'pre-wrap'}}>{project?.description}</p>
                        </div>

                        {/* CTA buttons */}
                        <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                            {project?.live_url && project.live_url !== '#' && (
                                <a href={project.live_url} target="_blank" rel="noreferrer"
                                    style={{display:'inline-flex',alignItems:'center',gap:8,padding:'12px 28px',borderRadius:12,background:'linear-gradient(135deg,#7c3aed,#4f46e5)',border:'1px solid rgba(124,58,237,.4)',color:'#fff',fontWeight:700,fontSize:'.92rem',boxShadow:'0 0 24px rgba(124,58,237,.3)'}}>
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                    Live Demo
                                </a>
                            )}
                            {project?.github_url && project.github_url !== '#' && (
                                <a href={project.github_url} target="_blank" rel="noreferrer"
                                    style={{display:'inline-flex',alignItems:'center',gap:8,padding:'12px 28px',borderRadius:12,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.12)',color:'rgba(226,232,240,.85)',fontWeight:700,fontSize:'.92rem'}}>
                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                                    View Source
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Sidebar meta */}
                    <div style={{minWidth:180}}>
                        <div className="grad-border" style={{padding:20}}>
                            <div style={{fontSize:'.7rem',fontFamily:"'JetBrains Mono',monospace",color:'rgba(148,163,184,.4)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:14}}>Tech Stack</div>
                            <div style={{display:'flex',flexDirection:'column',gap:8}}>
                                {tags.map(t=>(
                                    <div key={t} style={{display:'flex',alignItems:'center',gap:8,color:'rgba(226,232,240,.75)',fontSize:'.84rem',fontWeight:500}}>
                                        <span style={{width:6,height:6,borderRadius:'50%',background:'linear-gradient(135deg,#7c3aed,#3b82f6)',flexShrink:0}}/>
                                        {t}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </main>

        {/* Lightbox */}
        <AnimatePresence>
        {lightbox && (
            <motion.div className="lightbox" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                onClick={() => setLightbox(false)}>
                <motion.img src={imgUrl(currentImg)} alt="" initial={{scale:.9}} animate={{scale:1}} exit={{scale:.9}}
                    style={{maxWidth:'90vw',maxHeight:'90vh',borderRadius:16,objectFit:'contain',boxShadow:'0 40px 120px rgba(0,0,0,.8)'}} />
                <div style={{position:'absolute',top:20,right:20,width:40,height:40,borderRadius:'50%',background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.2)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                    <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </div>
            </motion.div>
        )}
        </AnimatePresence>

        {/* Footer */}
        <footer style={{position:'relative',zIndex:2,background:'rgba(0,0,0,.4)',backdropFilter:'blur(20px)',borderTop:'1px solid rgba(255,255,255,.06)',padding:'48px 24px',textAlign:'center'}}>
            <div style={{maxWidth:700,margin:'0 auto'}}>
                <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'1.4rem',fontWeight:800,color:'#fff',marginBottom:10}}>
                    <span style={{color:'rgba(167,139,250,.8)'}}>{(profile?.name||'Sital Mahato').split(' ')[0]}</span>{' '}
                    {(profile?.name||'Sital Mahato').split(' ').slice(1).join(' ')}
                </div>
                <p style={{color:'rgba(148,163,184,.5)',fontSize:'.85rem',marginBottom:20}}>Crafting digital experiences. Building the future. 🇳🇵</p>
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
