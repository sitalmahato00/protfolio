import { Head, Link } from '@inertiajs/react';

export default function Privacy() {
  return (<>
    <Head title="Privacy Policy — Sital Mahato">
      <meta name="description" content="Privacy policy for Sital Mahato's portfolio website. Information about data collection, cookies, and contact form handling." />
      <meta name="robots" content="index, follow" />
    </Head>

    <div style={{minHeight:'100vh',background:'#050816',color:'rgba(226,232,240,.87)',fontFamily:'Inter,sans-serif',padding:'80px 24px'}}>
      <div style={{maxWidth:800,margin:'0 auto'}}>
        <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:6,color:'rgba(167,139,250,.8)',fontWeight:600,fontSize:'.88rem',marginBottom:40}}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to Portfolio
        </Link>

        <h1 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'clamp(28px,4vw,44px)',fontWeight:800,letterSpacing:'-.02em',marginBottom:8}}>Privacy Policy</h1>
        <p style={{color:'rgba(148,163,184,.5)',fontSize:'.85rem',marginBottom:40}}>Last updated: {new Date().toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'})}</p>

        <section style={{marginBottom:32}}>
          <h2 style={{fontFamily:"'Space Grotesk'",fontSize:'1.2rem',fontWeight:700,marginBottom:12}}>1. Information We Collect</h2>
          <p style={{color:'rgba(148,163,184,.8)',fontSize:'.92rem',lineHeight:1.75,marginBottom:12}}>When you use the contact form on this website, we collect your name, email address, and the message you submit. This information is used solely to respond to your inquiry.</p>
          <p style={{color:'rgba(148,163,184,.8)',fontSize:'.92rem',lineHeight:1.75}}>We also collect standard server logs (IP address, browser user agent, pages visited) for analytics and security purposes. This data is anonymised where possible.</p>
        </section>

        <section style={{marginBottom:32}}>
          <h2 style={{fontFamily:"'Space Grotesk'",fontSize:'1.2rem',fontWeight:700,marginBottom:12}}>2. Cookies</h2>
          <p style={{color:'rgba(148,163,184,.8)',fontSize:'.92rem',lineHeight:1.75}}>This site uses Laravel session cookies for authentication and security. No third-party tracking cookies are used. You can control cookie preferences through your browser settings.</p>
        </section>

        <section style={{marginBottom:32}}>
          <h2 style={{fontFamily:"'Space Grotesk'",fontSize:'1.2rem',fontWeight:700,marginBottom:12}}>3. How We Use Your Data</h2>
          <p style={{color:'rgba(148,163,184,.8)',fontSize:'.92rem',lineHeight:1.75,marginBottom:8}}>Your data is used only to:</p>
          <ul style={{color:'rgba(148,163,184,.75)',fontSize:'.9rem',lineHeight:1.75,paddingLeft:20}}>
            <li>Respond to messages you submit via the contact form</li>
            <li>Improve website performance and user experience</li>
            <li>Maintain site security and prevent abuse</li>
          </ul>
        </section>

        <section style={{marginBottom:32}}>
          <h2 style={{fontFamily:"'Space Grotesk'",fontSize:'1.2rem',fontWeight:700,marginBottom:12}}>4. Data Sharing</h2>
          <p style={{color:'rgba(148,163,184,.8)',fontSize:'.92rem',lineHeight:1.75}}>We do not sell, trade, or share your personal data with third parties. Data may be disclosed if required by law or to protect the rights and safety of users.</p>
        </section>

        <section style={{marginBottom:32}}>
          <h2 style={{fontFamily:"'Space Grotesk'",fontSize:'1.2rem',fontWeight:700,marginBottom:12}}>5. Data Retention</h2>
          <p style={{color:'rgba(148,163,184,.8)',fontSize:'.92rem',lineHeight:1.75}}>Contact form submissions are retained for up to 12 months. Server logs are retained for up to 90 days. You may request deletion of your data by emailing sitalmahato077@gmail.com.</p>
        </section>

        <section style={{marginBottom:32}}>
          <h2 style={{fontFamily:"'Space Grotesk'",fontSize:'1.2rem',fontWeight:700,marginBottom:12}}>6. Contact</h2>
          <p style={{color:'rgba(148,163,184,.8)',fontSize:'.92rem',lineHeight:1.75}}>For questions about this privacy policy or to request data deletion, contact: <a href="mailto:sitalmahato077@gmail.com" style={{color:'#a78bfa'}}>sitalmahato077@gmail.com</a></p>
        </section>
      </div>
    </div>
  </>);
}