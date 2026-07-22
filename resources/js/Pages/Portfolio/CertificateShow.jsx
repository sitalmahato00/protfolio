import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import '../../../css/portfolio.css';

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

const LOCAL_CSS = `
  .lightbox{position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:9000;display:flex;align-items:center;justify-content:center;cursor:pointer;backdrop-filter:blur(8px);}
  .fade-up{animation:fadeUp .6s ease both;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
  .other-cert-card:hover{transform:translateY(-4px);border-color:rgba(124,58,237,.5);}
`;

export default function CertificateShow({ certificate, profile, otherCertificates }) {
    const [lightbox, setLightbox] = useState(false);

    const formatDate = (dateStr) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const issueDate = formatDate(certificate?.issue_date);
    const expiryDate = formatDate(certificate?.expiry_date);
    const hasExpiry = certificate?.expiry_date && new Date(certificate.expiry_date) > new Date();
    const isExpired = certificate?.expiry_date && new Date(certificate.expiry_date) < new Date();

    return (
        <>
        <Head title={(certificate?.title || 'Certificate') + ' — ' + (profile?.name || 'Sital Mahato') + ' Portfolio'}>
          <link rel="canonical" href={'https://sital.info.np/certificate/' + (certificate?.id || '')} />
          <meta name="description" content={(certificate?.description?.slice(0, 158) || (certificate?.title || 'This certification') + ' earned by ' + (profile?.name || 'Sital Mahato') + ' from ' + (certificate?.issuer || 'a professional organization') + '.')} />
          <meta property="og:title" content={(certificate?.title || 'Certificate') + ' — ' + (profile?.name || 'Sital Mahato') + ' Portfolio'} />
          <meta property="og:description" content={(certificate?.description?.slice(0, 158) || 'View ' + (certificate?.title || 'this certificate') + ' earned by ' + (profile?.name || 'Sital Mahato'))} />
          <meta property="og:url" content={'https://sital.info.np/certificate/' + (certificate?.id || '')} />
          {certificate?.image && <meta property="og:image" content={'https://sital.info.np/' + certificate.image} />}
          <meta name="twitter:title" content={(certificate?.title || 'Certificate') + ' — ' + (profile?.name || 'Sital Mahato') + ' Portfolio'} />
          <meta name="twitter:description" content={(certificate?.description?.slice(0, 158) || 'View ' + (certificate?.title || 'this certificate') + ' earned by ' + (profile?.name || 'Sital Mahato'))} />
          <script type="application/ld+json">{JSON.stringify([
            {'@context':'https://schema.org','@type':'BreadcrumbList','itemListElement':[
              {'@type':'ListItem','position':1,'name':'Portfolio','item':'https://sital.info.np/'},
              {'@type':'ListItem','position':2,'name':'Certificates','item':'https://sital.info.np/certificates'},
              {'@type':'ListItem','position':3,'name':certificate?.title || 'Certificate'}
            ]},
            {'@context':'https://schema.org','@type':'EducationalOccupationalCredential','name':certificate?.title || 'Certificate','description':certificate?.description || '','credentialCategory':'Certificate','issuedBy':{'@type':'Organization','name':certificate?.issuer || ''},'dateCreated':certificate?.issue_date || ''}
          ])}</script>
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
            <Link href="/certificates" style={{display:'inline-flex',alignItems:'center',gap:6,padding:'8px 18px',borderRadius:10,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',color:'rgba(226,232,240,.7)',fontSize:'.84rem',fontWeight:600}}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                Back
            </Link>
        </nav>

        <main style={{position:'relative',zIndex:2,padding:'100px 24px 80px',minHeight:'100vh'}}>
            <div style={{maxWidth:960,margin:'0 auto'}}>

                <div className="fade-up" style={{marginBottom:28,display:'flex',alignItems:'center',gap:8}}>
                    <Link href="/" style={{color:'rgba(148,163,184,.5)',fontSize:'.82rem',fontWeight:500,display:'inline-flex',alignItems:'center',gap:5}}>
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                        Portfolio
                    </Link>
                    <span style={{color:'rgba(255,255,255,.15)'}}>›</span>
                    <Link href="/certificates" style={{color:'rgba(148,163,184,.5)',fontSize:'.82rem',fontWeight:500}}>Certificates</Link>
                    <span style={{color:'rgba(255,255,255,.15)'}}>›</span>
                    <span style={{color:'rgba(167,139,250,.8)',fontSize:'.82rem',fontWeight:600}}>{certificate?.title}</span>
                </div>

                <div className="fade-up" style={{animationDelay:'.1s',display:'grid',gridTemplateColumns:'1fr',gap:32,alignItems:'start',marginBottom:40}}>
                    <div style={{display:'flex',alignItems:'flex-start',gap:20}}>
                        <div style={{width:80,height:80,borderRadius:16,background:'linear-gradient(135deg,#7c3aed,#4f46e5)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2.5rem',flexShrink:0,boxShadow:'0 0 40px rgba(124,58,237,.4)'}}>
                            🎓
                        </div>
                        <div style={{flex:1}}>
                            <h1 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'clamp(24px,4vw,40px)',fontWeight:800,letterSpacing:'-.02em',lineHeight:1.15,marginBottom:12}}>
                                {certificate?.title}
                            </h1>
                            <div style={{display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
                                <div style={{display:'flex',alignItems:'center',gap:8}}>
                                    <svg width="16" height="16" fill="none" stroke="rgba(167,139,250,.8)" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                    <span style={{color:'rgba(167,139,250,.9)',fontSize:'1rem',fontWeight:600}}>{certificate?.issuer}</span>
                                </div>
                                {issueDate && (
                                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                                        <svg width="16" height="16" fill="none" stroke="rgba(148,163,184,.6)" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                        <span style={{color:'rgba(148,163,184,.7)',fontSize:'.88rem',fontWeight:500}}>Issued {issueDate}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {certificate?.image && (
                    <div className="fade-up" style={{animationDelay:'.2s',marginBottom:36,borderRadius:20,overflow:'hidden',background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)'}}>
                        <div style={{position:'relative',overflow:'hidden',maxHeight:600,background:'rgba(5,8,22,.8)'}}>
                            <img src={imgUrl(certificate.image)} alt={certificate.title} loading="lazy" width="800" height="600"
                                style={{width:'100%',maxHeight:600,objectFit:'contain',display:'block',cursor:'zoom-in',padding:40}}
                                onClick={() => setLightbox(true)} />
                            <div style={{position:'absolute',bottom:14,right:14,background:'rgba(0,0,0,.5)',backdropFilter:'blur(8px)',borderRadius:8,padding:'5px 10px',fontSize:'.72rem',color:'rgba(255,255,255,.6)',display:'flex',alignItems:'center',gap:4,pointerEvents:'none'}}>
                                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                                Click to zoom
                            </div>
                        </div>
                    </div>
                )}

                <div className="fade-up" style={{animationDelay:'.3s',display:'grid',gridTemplateColumns:'2fr 1fr',gap:32,alignItems:'start'}}>
                    <div>
                        {certificate?.description && (
                            <div className="grad-border" style={{padding:28,marginBottom:28}}>
                                <h2 style={{fontSize:'.8rem',fontFamily:"'JetBrains Mono',monospace",color:'rgba(148,163,184,.4)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:16,margin:0,padding:0,fontWeight:'inherit'}}>About This Certification</h2>
                                <p style={{color:'rgba(148,163,184,.85)',fontSize:'1rem',lineHeight:1.8,whiteSpace:'pre-wrap',margin:0}}>{certificate.description}</p>
                            </div>
                        )}

                        {certificate?.credential_url && (
                            <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                                <a href={certificate.credential_url} target="_blank" rel="noreferrer"
                                    style={{display:'inline-flex',alignItems:'center',gap:8,padding:'12px 28px',borderRadius:12,background:'linear-gradient(135deg,#7c3aed,#4f46e5)',border:'1px solid rgba(124,58,237,.4)',color:'#fff',fontWeight:700,fontSize:'.92rem',boxShadow:'0 0 24px rgba(124,58,237,.3)'}}>
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                    View Credential
                                </a>
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="grad-border" style={{padding:20,marginBottom:20}}>
                            <h2 style={{fontSize:'.7rem',fontFamily:"'JetBrains Mono',monospace",color:'rgba(148,163,184,.4)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:16,margin:0,padding:0,fontWeight:'inherit'}}>Credential Details</h2>
                            <div style={{display:'flex',flexDirection:'column',gap:14}}>
                                <div>
                                    <div style={{fontSize:'.75rem',color:'rgba(148,163,184,.5)',marginBottom:4,fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase',letterSpacing:'.05em'}}>Issued By</div>
                                    <div style={{color:'rgba(226,232,240,.85)',fontSize:'.92rem',fontWeight:600}}>{certificate?.issuer}</div>
                                </div>
                                {issueDate && (
                                    <div>
                                        <div style={{fontSize:'.75rem',color:'rgba(148,163,184,.5)',marginBottom:4,fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase',letterSpacing:'.05em'}}>Issue Date</div>
                                        <div style={{color:'rgba(226,232,240,.85)',fontSize:'.92rem',fontWeight:600}}>{issueDate}</div>
                                    </div>
                                )}
                                {expiryDate && (
                                    <div>
                                        <div style={{fontSize:'.75rem',color:'rgba(148,163,184,.5)',marginBottom:4,fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase',letterSpacing:'.05em'}}>
                                            {isExpired ? 'Expired On' : 'Valid Until'}
                                        </div>
                                        <div style={{color:isExpired?'rgba(239,68,68,.85)':'rgba(34,197,94,.85)',fontSize:'.92rem',fontWeight:600}}>{expiryDate}</div>
                                    </div>
                                )}
                                {!expiryDate && !isExpired && (
                                    <div>
                                        <div style={{fontSize:'.75rem',color:'rgba(148,163,184,.5)',marginBottom:4,fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase',letterSpacing:'.05em'}}>Validity</div>
                                        <div style={{color:'rgba(34,197,94,.85)',fontSize:'.92rem',fontWeight:600,display:'flex',alignItems:'center',gap:6}}>
                                            <span style={{width:8,height:8,borderRadius:'50%',background:'#22c55e',display:'inline-block'}}/>
                                            No Expiration
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {hasExpiry && (
                            <div style={{padding:16,borderRadius:12,background:'rgba(34,197,94,.1)',border:'1px solid rgba(34,197,94,.2)'}}>
                                <div style={{display:'flex',alignItems:'center',gap:8,color:'rgba(34,197,94,.9)',fontSize:'.84rem',fontWeight:600}}>
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                    Currently Valid
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {otherCertificates && otherCertificates.length > 0 && (
                    <div className="fade-up" style={{animationDelay:'.4s',marginTop:80}}>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:32}}>
                            <h2 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'clamp(20px,3vw,28px)',fontWeight:800,letterSpacing:'-.02em'}}>
                                More <span className="grad-text">Certifications</span>
                            </h2>
                            <Link href="/certificates" style={{display:'inline-flex',alignItems:'center',gap:6,color:'rgba(167,139,250,.8)',fontWeight:600,fontSize:'.88rem',border:'1px solid rgba(124,58,237,.25)',padding:'8px 18px',borderRadius:10,transition:'all .2s'}}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,.1)'; e.currentTarget.style.color = '#c4b5fd'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(167,139,250,.8)'; }}>
                                View All
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </Link>
                        </div>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:20}}>
                            {otherCertificates.map((cert, i) => (
                                <Link key={cert.id} href={`/certificate/${cert.id}`} className="other-cert-card" style={{textDecoration:'none'}}>
                                    <div className="grad-border" style={{padding:20,borderRadius:14,background:'rgba(5,8,22,.8)',display:'flex',flexDirection:'column',gap:12,height:'100%',transition:'all 0.3s ease'}}>
                                        <div style={{display:'flex',alignItems:'center',gap:10}}>
                                            <div style={{width:40,height:40,borderRadius:10,background:'linear-gradient(135deg,#7c3aed,#4f46e5)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',flexShrink:0}}>
                                                🎓
                                            </div>
                                            <div style={{flex:1,minWidth:0}}>
                                                <h3 style={{fontFamily:"'Space Grotesk'",fontWeight:700,fontSize:'.92rem',color:'#fff',margin:0,lineHeight:1.3,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{cert.title}</h3>
                                                <div style={{fontSize:'.78rem',color:'#a78bfa',fontWeight:600,marginTop:2}}>{cert.issuer}</div>
                                            </div>
                                        </div>
                                        {cert.description && (
                                            <p style={{color:'rgba(148,163,184,.7)',fontSize:'.82rem',lineHeight:1.5,margin:0,overflow:'hidden',textOverflow:'ellipsis',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{cert.description}</p>
                                        )}
                                        {cert.issue_date && (
                                            <div style={{fontSize:'.75rem',color:'rgba(148,163,184,.5)',fontFamily:"'JetBrains Mono'",paddingTop:8,borderTop:'1px solid rgba(255,255,255,.06)'}}>
                                                {formatDate(cert.issue_date)}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </main>

        {lightbox && certificate?.image && (
            <div className="lightbox" onClick={() => setLightbox(false)}>
                <img src={imgUrl(certificate.image)} alt={certificate.title}
                    style={{maxWidth:'90vw',maxHeight:'90vh',borderRadius:16,objectFit:'contain',boxShadow:'0 40px 120px rgba(0,0,0,.8)'}} />
                <div style={{position:'absolute',top:20,right:20,width:40,height:40,borderRadius:'50%',background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.2)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                    <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </div>
            </div>
        )}

        <footer style={{position:'relative',zIndex:2,background:'rgba(0,0,0,.4)',backdropFilter:'blur(20px)',borderTop:'1px solid rgba(255,255,255,.06)',padding:'48px 24px',textAlign:'center'}}>
            <div style={{maxWidth:700,margin:'0 auto'}}>
                <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'1.4rem',fontWeight:800,color:'#fff',marginBottom:10}}>
                    <span style={{color:'rgba(167,139,250,.8)'}}>{(profile?.name||'Sital Mahato').split(' ')[0]}</span>{' '}
                    {(profile?.name||'Sital Mahato').split(' ').slice(1).join(' ')}
                </div>
                <p style={{color:'rgba(148,163,184,.5)',fontSize:'.85rem',marginBottom:20}}>Crafting digital experiences. Building the future.</p>
                <div style={{display:'flex',justifyContent:'center',gap:6,flexWrap:'wrap',marginBottom:24}}>
                    {['about','skills','projects','services','experience','certificates','contact'].map(s=>(
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
