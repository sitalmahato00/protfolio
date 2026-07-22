import { Head, Link } from '@inertiajs/react';
import '../../../css/portfolio.css';

const SITE      = 'https://sital.info.np';
const SITE_NAME = 'Sital Mahato';

const slugify = t => t?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ?? '';

export default function ServicesIndex({ services = [], profile }) {
    const profileName = profile?.name || SITE_NAME;
    const seoTitle    = `Services | ${profileName} — Full Stack Developer Nepal`;
    const seoDesc     = `Explore professional web development services by ${profileName}. Laravel, React, Flutter, Android, UI/UX Design, API Development and more. Hire a Full Stack Developer in Nepal.`;
    const keywords    = [
        'Sital Mahato', 'sital.info.np', 'Full Stack Developer Nepal', 'Best Full Stack Developer Nepal',
        'Hire Full Stack Developer Nepal', 'Laravel Developer Nepal', 'Best Laravel Developer Nepal',
        'Hire Laravel Developer Nepal', 'React Developer Nepal', 'Best React Developer Nepal',
        'Flutter Developer Nepal', 'Android Developer Nepal', 'PHP Developer Nepal',
        'UI UX Designer Nepal', 'Web Development Services Nepal', 'Mobile App Development Nepal',
        'API Development Nepal', 'Freelancer Nepal', 'Software Development Services Nepal',
        'Custom Software Nepal', 'Website Developer Nepal', 'Best Website Developer Nepal',
        'Software Development Company Nepal', 'Web Development Company Nepal',
        'Software Developer in Siraha', 'Website Developer in Koshi Province',
        'Hire React Developer Nepal', 'Hire Next.js Developer Nepal',
        'E-commerce Website Developer in Nepal', 'Custom Software Development Nepal',
        'Best Laravel Developer in Nepal', 'Professional Website Developer Nepal',
    ].join(', ');

    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            '@id': SITE + '/services',
            'url': SITE + '/services',
            'name': seoTitle,
            'description': seoDesc,
            'isPartOf': { '@id': SITE + '/#website' },
            'author': { '@id': SITE + '/#person' },
            'numberOfItems': services.length,
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
                { '@type': 'ListItem', 'position': 1, 'name': 'Home',     'item': SITE },
                { '@type': 'ListItem', 'position': 2, 'name': 'Services', 'item': SITE + '/services' },
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            'name': 'Services by Sital Mahato',
            'itemListElement': services.map((s, i) => ({
                '@type': 'ListItem',
                'position': i + 1,
                'name': s.title,
                'url': SITE + '/services/' + (s.slug || slugify(s.title)),
            })),
        },
    ];

    return (
        <>
        <Head title={seoTitle}>
            <link rel="canonical" href={`${SITE}/services`} />
            <meta name="description"   content={seoDesc} />
            <meta name="keywords"      content={keywords} />
            <meta name="author"        content={profileName} />
            <meta name="robots"        content="index, follow, max-snippet:-1, max-image-preview:large" />

            <meta property="og:type"        content="website" />
            <meta property="og:url"         content={`${SITE}/services`} />
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

        <div className="aurora">
            <div className="aurora-blob" style={{width:'700px',height:'700px',background:'#7c3aed',top:'-200px',left:'-200px'}}/>
            <div className="aurora-blob" style={{width:'500px',height:'500px',background:'#4f46e5',top:'30%',right:'-100px',animationDelay:'-7s'}}/>
        </div>

        <nav className="nav-root">
            <Link href="/" style={{display:'flex',alignItems:'center',gap:10,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:'1rem',color:'#fff'}}>
                <div style={{width:34,height:34,borderRadius:9,background:'linear-gradient(135deg,#7c3aed,#4f46e5)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.8rem',fontWeight:900,boxShadow:'0 0 20px rgba(124,58,237,.4)'}}>SM</div>
                {profileName}
            </Link>
            <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:6,padding:'8px 18px',borderRadius:10,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',color:'rgba(226,232,240,.7)',fontSize:'.84rem',fontWeight:600}}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                Home
            </Link>
        </nav>

        <main style={{position:'relative',zIndex:2,padding:'100px 24px 80px',minHeight:'100vh'}}>
            <div style={{maxWidth:1100,margin:'0 auto'}}>

                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" style={{marginBottom:28,display:'flex',alignItems:'center',gap:8}}>
                    <Link href="/" style={{color:'rgba(148,163,184,.5)',fontSize:'.82rem',fontWeight:500}}>Home</Link>
                    <span style={{color:'rgba(255,255,255,.15)'}}>›</span>
                    <span style={{color:'rgba(167,139,250,.8)',fontSize:'.82rem',fontWeight:600}}>Services</span>
                </nav>

                {/* Header */}
                <div style={{marginBottom:52}}>
                    <div className="section-label" style={{marginBottom:12}}>What I Offer</div>
                    <h1 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'clamp(32px,5vw,56px)',fontWeight:800,letterSpacing:'-.02em',marginBottom:12}}>
                        Professional <span className="grad-text">Services</span>
                    </h1>
                    <p style={{color:'rgba(148,163,184,.78)',fontSize:'1rem',maxWidth:600}}>
                        End-to-end development services — from web apps and mobile apps to UI/UX design and API integrations. All work done by <strong style={{color:'rgba(226,232,240,.85)'}}>Sital Mahato</strong>, a Full Stack Developer based in Nepal.
                    </p>
                </div>

                {/* Services grid */}
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:24,marginBottom:64}}>
                    {services.map((s, i) => {
                        const sSlug = s.slug || slugify(s.title);
                        const features = s.features || [];
                        return (
                            <Link key={s.id} href={`/services/${sSlug}`} style={{display:'block'}}>
                                <article style={{
                                    height:'100%',padding:'28px 26px',borderRadius:20,
                                    background:'rgba(255,255,255,.03)',
                                    border:`1px solid ${s.is_popular ? 'rgba(124,58,237,.4)' : 'rgba(255,255,255,.07)'}`,
                                    transition:'all .3s',cursor:'pointer',position:'relative',
                                    boxShadow: s.is_popular ? '0 0 40px rgba(124,58,237,.1)' : 'none',
                                }}
                                onMouseEnter={e=>e.currentTarget.style.transform='translateY(-5px)'}
                                onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
                                    {s.is_popular && (
                                        <div style={{position:'absolute',top:-1,right:20,background:'linear-gradient(135deg,#7c3aed,#4f46e5)',color:'#fff',fontSize:'.68rem',fontWeight:700,padding:'4px 12px',borderRadius:'0 0 8px 8px',letterSpacing:'.05em'}}>
                                            POPULAR
                                        </div>
                                    )}
                                    <div style={{marginBottom:18}}>
                                        <h2 style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:'1.1rem',color:'#fff',marginBottom:8}}>{s.title}</h2>
                                        <p style={{color:'rgba(148,163,184,.75)',fontSize:'.88rem',lineHeight:1.65,display:'-webkit-box',WebkitLineClamp:3,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{s.description}</p>
                                    </div>
                                    {features.length > 0 && (
                                        <ul style={{listStyle:'none',padding:0,margin:'0 0 18px',display:'flex',flexDirection:'column',gap:7}}>
                                            {features.slice(0, 4).map((f, fi) => (
                                                <li key={fi} style={{display:'flex',alignItems:'center',gap:8,color:'rgba(226,232,240,.7)',fontSize:'.82rem'}}>
                                                    <span style={{width:5,height:5,borderRadius:'50%',background:'#7c3aed',flexShrink:0}}/>
                                                    {typeof f === 'string' ? f : (f?.title || '')}
                                                </li>
                                            ))}
                                            {features.length > 4 && (
                                                <li style={{color:'rgba(124,58,237,.7)',fontSize:'.78rem',fontWeight:600}}>+{features.length - 4} more</li>
                                            )}
                                        </ul>
                                    )}
                                    <div style={{display:'flex',alignItems:'center',gap:6,color:'rgba(167,139,250,.8)',fontSize:'.82rem',fontWeight:600}}>
                                        Learn more
                                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                    </div>
                                </article>
                            </Link>
                        );
                    })}
                </div>

                {/* CTA */}
                <div style={{textAlign:'center',padding:'48px 24px',borderRadius:24,background:'rgba(124,58,237,.06)',border:'1px solid rgba(124,58,237,.15)'}}>
                    <h2 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'1.8rem',fontWeight:800,marginBottom:12}}>
                        Need a custom solution?
                    </h2>
                    <p style={{color:'rgba(148,163,184,.75)',marginBottom:24,maxWidth:480,margin:'0 auto 24px'}}>
                        Every project is unique. Let's discuss your requirements and build something great together.
                    </p>
                    <Link href="/#contact" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'14px 32px',borderRadius:12,background:'linear-gradient(135deg,#7c3aed,#4f46e5)',color:'#fff',fontWeight:700,fontSize:'1rem',boxShadow:'0 0 28px rgba(124,58,237,.35)'}}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z"/><polyline points="22,6 12,12 2,6"/></svg>
                        Get in Touch
                    </Link>
                </div>

            </div>
        </main>

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
