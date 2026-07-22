import { Head, Link } from '@inertiajs/react';
import '../../../css/portfolio.css';

const SITE      = 'https://sital.info.np';
const SITE_NAME = 'Sital Mahato';

const slugify = t => t?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ?? '';

const buildTitle = (service, profileName) => {
    const name  = profileName || SITE_NAME;
    const title = service?.title || 'Service';
    const full  = `${title} | Services | ${name}`;
    return full.length <= 70 ? full : `${title} | ${name}`;
};

const buildDescription = service => {
    const title = service?.title || 'Service';
    const desc  = (service?.description || '').replace(/\s+/g, ' ').trim();
    const base  = `${title} by Sital Mahato, Full Stack Developer Nepal. ${desc}`;
    return base.length > 157 ? base.slice(0, 154) + '...' : base;
};

const buildKeywords = service => {
    const global = [
        'Sital Mahato', 'sital.info.np', 'Full Stack Developer Nepal', 'Best Full Stack Developer Nepal',
        'Software Engineer Nepal', 'Website Developer Nepal', 'Best Website Developer Nepal',
        'Laravel Developer Nepal', 'Best Laravel Developer Nepal', 'React Developer Nepal',
        'Best React Developer Nepal', 'PHP Developer', 'Portfolio', 'Freelancer Nepal',
        'Web Development Nepal', 'Software Development Nepal', 'Hire Laravel Developer Nepal',
        'Hire React Developer Nepal', 'Hire Full Stack Developer Nepal',
        'Software Development Company Nepal', 'Web Development Services Nepal',
        'Custom Software Nepal', 'Website Developer in Siraha', 'Software Developer in Koshi Province',
    ];
    const features = (service?.features || []).map(f => (typeof f === 'string' ? f : f?.title || ''));
    const fromDesc  = (service?.seo_keywords || '').split(', ').filter(Boolean);
    return [...new Set([...global, service?.title, ...features, ...fromDesc])].filter(Boolean).slice(0, 20).join(', ');
};

const buildJsonLd = (service, profileName, url) => {
    const name     = profileName || SITE_NAME;
    const features = (service?.features || []).map((f, i) => ({
        '@type': 'Offer', 'position': i + 1,
        'name': typeof f === 'string' ? f : (f?.title || ''),
    }));

    return [
        {
            '@context': 'https://schema.org',
            '@type': 'Service',
            '@id': url + '#service',
            'name': service?.title,
            'description': buildDescription(service),
            'url': url,
            'provider': { '@type': 'Person', 'name': name, 'url': SITE },
            'areaServed': 'Worldwide',
            'hasOfferCatalog': {
                '@type': 'OfferCatalog',
                'name': service?.title + ' Features',
                'itemListElement': features,
            },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
                { '@type': 'ListItem', 'position': 1, 'name': 'Home',     'item': SITE },
                { '@type': 'ListItem', 'position': 2, 'name': 'Services', 'item': SITE + '/services' },
                { '@type': 'ListItem', 'position': 3, 'name': service?.title },
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': url,
            'url': url,
            'name': buildTitle(service, name),
            'description': buildDescription(service),
            'isPartOf': { '@id': SITE + '/#website' },
            'author': { '@id': SITE + '/#person' },
        },
    ];
};

export default function ServiceShow({ service, profile, relatedServices = [] }) {
    const slug        = service?.slug || slugify(service?.title || '');
    const pageUrl     = `${SITE}/services/${slug}`;
    const seoTitle    = buildTitle(service, profile?.name);
    const seoDesc     = buildDescription(service);
    const keywords    = buildKeywords(service);
    const jsonLd      = buildJsonLd(service, profile?.name, pageUrl);
    const features    = service?.features || [];
    const profileName = profile?.name || SITE_NAME;

    return (
        <>
        <Head title={seoTitle}>
            <link rel="canonical" href={pageUrl} />
            <meta name="description"   content={seoDesc} />
            <meta name="keywords"      content={keywords} />
            <meta name="author"        content={profileName} />
            <meta name="robots"        content="index, follow, max-snippet:-1, max-image-preview:large" />

            <meta property="og:type"        content="website" />
            <meta property="og:url"         content={pageUrl} />
            <meta property="og:site_name"   content={SITE_NAME} />
            <meta property="og:title"       content={seoTitle} />
            <meta property="og:description" content={seoDesc} />
            <meta property="og:image"       content={`${SITE}/images/image.webp`} />
            <meta property="og:image:alt"   content={service?.title + ' — ' + profileName} />

            <meta name="twitter:card"        content="summary_large_image" />
            <meta name="twitter:site"        content="@sitalmahato" />
            <meta name="twitter:creator"     content="@sitalmahato" />
            <meta name="twitter:title"       content={seoTitle} />
            <meta name="twitter:description" content={seoDesc} />
            <meta name="twitter:image"       content={`${SITE}/images/image.webp`} />

            <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        </Head>

        <div className="aurora">
            <div className="aurora-blob" style={{width:'600px',height:'600px',background:'#7c3aed',top:'-150px',left:'-150px'}}/>
            <div className="aurora-blob" style={{width:'400px',height:'400px',background:'#4f46e5',top:'40%',right:'-80px',animationDelay:'-6s'}}/>
        </div>

        {/* Nav */}
        <nav className="nav-root">
            <Link href="/" style={{display:'flex',alignItems:'center',gap:10,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:'1rem',color:'#fff'}}>
                <div style={{width:34,height:34,borderRadius:9,background:'linear-gradient(135deg,#7c3aed,#4f46e5)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.8rem',fontWeight:900,boxShadow:'0 0 20px rgba(124,58,237,.4)'}}>SM</div>
                {profileName}
            </Link>
            <Link href="/services" style={{display:'inline-flex',alignItems:'center',gap:6,padding:'8px 18px',borderRadius:10,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',color:'rgba(226,232,240,.7)',fontSize:'.84rem',fontWeight:600}}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                Back
            </Link>
        </nav>

        <main style={{position:'relative',zIndex:2,padding:'100px 24px 80px',minHeight:'100vh'}}>
            <div style={{maxWidth:900,margin:'0 auto'}}>

                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" style={{marginBottom:28,display:'flex',alignItems:'center',gap:8}}>
                    <Link href="/" style={{color:'rgba(148,163,184,.5)',fontSize:'.82rem',fontWeight:500}}>Home</Link>
                    <span style={{color:'rgba(255,255,255,.15)'}}>›</span>
                    <Link href="/services" style={{color:'rgba(148,163,184,.5)',fontSize:'.82rem',fontWeight:500}}>Services</Link>
                    <span style={{color:'rgba(255,255,255,.15)'}}>›</span>
                    <span style={{color:'rgba(167,139,250,.8)',fontSize:'.82rem',fontWeight:600}}>{service?.title}</span>
                </nav>

                {/* Header */}
                <div style={{marginBottom:40}}>
                    <div className="section-label" style={{marginBottom:12}}>Service</div>
                    <h1 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'clamp(28px,4vw,48px)',fontWeight:800,letterSpacing:'-.02em',marginBottom:16}}>
                        {service?.title}
                    </h1>
                    <p style={{color:'rgba(148,163,184,.85)',fontSize:'1.05rem',lineHeight:1.8,maxWidth:680}}>
                        {service?.description}
                    </p>
                </div>

                {/* Features */}
                {features.length > 0 && (
                    <section aria-label="Service features" style={{marginBottom:48}}>
                        <h2 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'1.2rem',fontWeight:700,marginBottom:20,color:'rgba(226,232,240,.9)'}}>
                            What's <span className="grad-text">Included</span>
                        </h2>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:14}}>
                            {features.map((f, i) => (
                                <div key={i} className="grad-border" style={{padding:'16px 20px',display:'flex',alignItems:'flex-start',gap:12}}>
                                    <span style={{width:8,height:8,borderRadius:'50%',background:'linear-gradient(135deg,#7c3aed,#3b82f6)',flexShrink:0,marginTop:6}}/>
                                    <span style={{color:'rgba(226,232,240,.8)',fontSize:'.9rem',fontWeight:500}}>
                                        {typeof f === 'string' ? f : (f?.title || f?.name || JSON.stringify(f))}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* CTA */}
                <div style={{marginBottom:64}}>
                    <Link href="/#contact" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'14px 32px',borderRadius:12,background:'linear-gradient(135deg,#7c3aed,#4f46e5)',color:'#fff',fontWeight:700,fontSize:'1rem',boxShadow:'0 0 28px rgba(124,58,237,.35)'}}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z"/><polyline points="22,6 12,12 2,6"/></svg>
                        Hire Me for This Service
                    </Link>
                </div>

                {/* Related services */}
                {relatedServices.length > 0 && (
                    <section aria-label="Related services" style={{marginTop:16}}>
                        <h2 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'1.2rem',fontWeight:700,marginBottom:20,color:'rgba(226,232,240,.9)'}}>
                            Other <span className="grad-text">Services</span>
                        </h2>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:14}}>
                            {relatedServices.map(s => {
                                const rSlug = s.slug || slugify(s.title);
                                return (
                                    <Link key={s.id} href={`/services/${rSlug}`}>
                                        <article className="grad-border" style={{padding:'18px 20px',borderRadius:14,background:'rgba(255,255,255,.02)',cursor:'pointer',transition:'all .2s',display:'block'}}>
                                            <div style={{fontWeight:700,fontSize:'.95rem',color:'rgba(226,232,240,.9)',marginBottom:6}}>{s.title}</div>
                                            <div style={{fontSize:'.8rem',color:'rgba(148,163,184,.6)',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{s.description}</div>
                                        </article>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}

            </div>
        </main>

        {/* Footer */}
        <footer style={{position:'relative',zIndex:2,background:'rgba(0,0,0,.4)',backdropFilter:'blur(20px)',borderTop:'1px solid rgba(255,255,255,.06)',padding:'48px 24px',textAlign:'center'}}>
            <div style={{maxWidth:700,margin:'0 auto'}}>
                <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'1.4rem',fontWeight:800,color:'#fff',marginBottom:10}}>
                    <span style={{color:'rgba(167,139,250,.8)'}}>{profileName.split(' ')[0]}</span>{' '}
                    {profileName.split(' ').slice(1).join(' ')}
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
                    © {new Date().getFullYear()} {profileName}. Crafted with ♥ in Nepal.
                </div>
            </div>
        </footer>
        </>
    );
}
