import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { IconGH, IconArrow, IconExternal } from '../../Components/PortfolioIcons';
import '../../../css/portfolio.css';

const imgMod = import.meta.glob('./assets/images/*.{webp,png}', { eager: true });
const aMap = {};
for (const [p, m] of Object.entries(imgMod)) { aMap[p.split('/').pop()] = m.default || m; }

const imgUrl = s => { if (!s) return null; if (s.startsWith('http')) return s; return aMap[s.replace(/^images\//,'')] || '/'+s; };

export default function CertificatesIndex({ certificates = [], profile = null }) {
  const [search, setSearch] = useState('');
  const [filterIssuer, setFilterIssuer] = useState('all');

  const issuers = [...new Set(certificates.map(c => c.issuer))];
  const filtered = certificates.filter(c => {
    const matchesSearch = c.title?.toLowerCase().includes(search.toLowerCase()) || 
                         c.issuer?.toLowerCase().includes(search.toLowerCase()) ||
                         c.description?.toLowerCase().includes(search.toLowerCase());
    const matchesIssuer = filterIssuer === 'all' || c.issuer === filterIssuer;
    return matchesSearch && matchesIssuer;
  });

  const siteUrl = 'https://sital.info.np';
  const seoName = profile?.name || 'Sital Mahato';
  const seoTitle = `${seoName} | Certifications & Achievements`;
  const seoDesc = `View ${seoName}'s professional certifications, achievements, and credentials in web development, Laravel, React, and modern technologies.`;
  const avatarUrl = profile?.avatar ? (profile.avatar.startsWith('http') ? profile.avatar : '/' + profile.avatar) : null;

  return (
    <>
      <Head title={seoTitle}>
        <link rel="canonical" href={`${siteUrl}/certificates`} />
        <meta name="description" content={seoDesc} />
        <meta name="author" content={seoName} />
        <meta name="robots" content="index,follow" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/certificates`} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        {avatarUrl && <meta property="og:image" content={avatarUrl.startsWith('http') ? avatarUrl : siteUrl + '/' + profile.avatar} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        {avatarUrl && <meta name="twitter:image" content={avatarUrl.startsWith('http') ? avatarUrl : siteUrl + '/' + profile.avatar} />}
      </Head>

      <div style={{ minHeight: '100vh', background: '#050816', position: 'relative' }}>
        {/* Aurora background */}
        <div className="aurora">
          <div className="aurora-blob" style={{width:'800px',height:'800px',background:'#7c3aed',top:'-200px',left:'-200px',animationDelay:'0s'}}/>
          <div className="aurora-blob" style={{width:'600px',height:'600px',background:'#4f46e5',top:'20%',right:'-100px',animationDelay:'-7s'}}/>
          <div className="aurora-blob" style={{width:'500px',height:'500px',background:'#3b82f6',bottom:'0',left:'30%',animationDelay:'-14s'}}/>
        </div>

        {/* Header */}
        <header style={{ position: 'relative', zIndex: 10, padding: '120px 40px 60px', textAlign: 'center' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(167,139,250,0.8)', fontSize: '0.9rem', marginBottom: 24, textDecoration: 'none' }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/><path d="M18 6 6 18"/></svg>
              Back to Portfolio
            </Link>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(42px,6vw,64px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 20, letterSpacing: '-0.02em', color: '#fff' }}>
              Certifications & <span className="grad-text">Achievements</span>
            </h1>
            <p style={{ color: 'rgba(148,163,184,0.75)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.75 }}>
              Professional certifications and credentials earned through continuous learning and expertise development in modern web technologies.
            </p>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
              <div style={{ position: 'relative', minWidth: '280px' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(148,163,184,0.5)', lineHeight: 0 }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                </span>
                <input 
                  placeholder="Search certificates..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ 
                    width: '100%', 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '50px', 
                    padding: '12px 20px 12px 44px', 
                    fontSize: '14px', 
                    color: '#fff', 
                    outline: 'none',
                    fontFamily: 'inherit'
                  }} 
                />
              </div>
              <select 
                value={filterIssuer}
                onChange={e => setFilterIssuer(e.target.value)}
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '50px', 
                  padding: '12px 20px', 
                  fontSize: '14px', 
                  color: '#fff', 
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                <option value="all">All Issuers</option>
                {issuers.map(issuer => (
                  <option key={issuer} value={issuer}>{issuer}</option>
                ))}
              </select>
            </div>

            <div style={{ fontSize: '14px', color: 'rgba(148,163,184,0.6)' }}>
              Showing {filtered.length} of {certificates.length} certificates
            </div>
          </div>
        </header>

        {/* Certificates Grid */}
        <main style={{ position: 'relative', zIndex: 10, padding: '0 40px 80px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', color: 'rgba(148,163,184,0.6)' }}>
                <div style={{ fontSize: '48px', marginBottom: 16 }}>🎓</div>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: 8 }}>No certificates found</div>
                <div>Try adjusting your search or filters</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 24 }}>
                {filtered.map((cert, i) => (
                  <div key={cert.id} style={{ 
                    background: 'rgba(5,8,22,0.8)', 
                    border: '1px solid rgba(255,255,255,0.08)', 
                    borderRadius: '20px', 
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    animation: `fadeIn 0.5s ease ${i * 0.05}s both`
                  }}>
                    {cert.image && (
                      <div style={{ height: 200, overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
                        <img 
                          src={imgUrl(cert.image)} 
                          alt={cert.title} 
                          loading="lazy"
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover', 
                            display: 'block',
                            transition: 'transform 0.3s ease'
                          }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        />
                      </div>
                    )}
                    <div style={{ padding: 24 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <div style={{ width: 52, height: 52, borderRadius: '12px', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>
                          🎓
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: '1.1rem', color: '#fff', margin: 0, lineHeight: 1.3 }}>{cert.title}</h3>
                          <div style={{ fontSize: '0.9rem', color: '#a78bfa', fontWeight: 600, marginTop: 4 }}>{cert.issuer}</div>
                        </div>
                      </div>
                      
                      {cert.description && (
                        <p style={{ color: 'rgba(148,163,184,0.75)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 16, margin: '0 0 16px 0' }}>
                          {cert.description}
                        </p>
                      )}
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ fontSize: '0.8rem', color: 'rgba(148,163,184,0.5)', fontFamily: "'JetBrains Mono'" }}>
                          {cert.issue_date && new Date(cert.issue_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          {cert.expiry_date && ` — Expires: ${new Date(cert.expiry_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                        </span>
                        {cert.credential_url && (
                          <a 
                            href={cert.credential_url} 
                            target="_blank" 
                            rel="noreferrer" 
                            style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: 6, 
                              color: '#a78bfa', 
                              fontSize: '0.85rem', 
                              fontWeight: 600, 
                              textDecoration: 'none',
                              padding: '8px 16px',
                              borderRadius: '10px',
                              background: 'rgba(167,139,250,0.1)',
                              border: '1px solid rgba(167,139,250,0.2)',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(167,139,250,0.2)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(167,139,250,0.1)'; }}
                          >
                            View Credential <IconExternal />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </>
  );
}
