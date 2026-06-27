import { Link, usePage } from '@inertiajs/react';
import { useState, createContext, useContext, useRef, useEffect } from 'react';

// ─── Design tokens ────────────────────────────────────────────────────────────
const tokens = {
    dark: {
        bg: '#0D1117', card: '#161B27', cardSolid: '#161B27',
        border: 'rgba(255,255,255,0.09)', borderHover: 'rgba(99,102,241,0.55)',
        text: '#E2E8F0', textMuted: '#94A3B8', textDim: '#64748B',
        accent: '#6366F1', accentEnd: '#8B5CF6', accentRgb: '99,102,241',
        sidebar: '#0A0F1A', sidebarBorder: 'rgba(255,255,255,0.07)',
        sidebarText: '#CBD5E1', sidebarGroupLabel: '#475569',
        topbar: 'rgba(13,17,23,0.97)',
        input: '#1C2333', inputBorder: 'rgba(255,255,255,0.12)',
        navHover: 'rgba(99,102,241,0.1)',
        cardShadow: '0 1px 4px rgba(0,0,0,0.45)',
        rowHover: 'rgba(99,102,241,0.06)',
        success: '#10B981', warning: '#F59E0B', danger: '#EF4444', info: '#06B6D4',
    },
    light: {
        bg: '#EEF2F7', card: '#FFFFFF', cardSolid: '#FFFFFF',
        border: '#C8D3E0', borderHover: 'rgba(79,70,229,0.45)',
        text: '#0F172A', textMuted: '#4B5563', textDim: '#9CA3AF',
        accent: '#4F46E5', accentEnd: '#7C3AED', accentRgb: '79,70,229',
        sidebar: '#0F172A', sidebarBorder: 'rgba(255,255,255,0.07)',
        sidebarText: '#CBD5E1', sidebarGroupLabel: '#475569',
        topbar: 'rgba(238,242,247,0.98)',
        input: '#FFFFFF', inputBorder: '#B8C4D0',
        navHover: 'rgba(79,70,229,0.07)',
        cardShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.07)',
        rowHover: 'rgba(79,70,229,0.04)',
        success: '#059669', warning: '#D97706', danger: '#DC2626', info: '#0891B2',
    },
};

// ─── Theme Context ─────────────────────────────────────────────────────────────
export const ThemeContext = createContext({ dark: true, toggle: () => {}, t: tokens.dark });
export const useTheme = () => useContext(ThemeContext);

// ─── Nav items ─────────────────────────────────────────────────────────────────
const NAV = [
    { group: 'Dashboard', items: [
        { label: 'Overview',  routeName: 'admin.dashboard',   href: '/admin/dashboard',
          icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg> },
    ]},
    { group: 'Content', items: [
        { label: 'Projects',  routeName: 'admin.projects',    href: '/admin/projects',
          icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> },
        { label: 'Skills',    routeName: 'admin.skills',      href: '/admin/skills',
          icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> },
        { label: 'Services',  routeName: 'admin.services',    href: '/admin/services',
          icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg> },
        { label: 'Journey',   routeName: 'admin.experiences', href: '/admin/experiences',
          icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
    ]},
    { group: 'Communication', items: [
        { label: 'Messages',  routeName: 'admin.messages',    href: '/admin/messages',
          icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
    ]},
    { group: 'Settings', items: [
        { label: 'Profile',   routeName: 'admin.profile',     href: '/admin/profile',
          icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    ]},
];

// ─── Global Styles ─────────────────────────────────────────────────────────────
function GlobalStyles({ t, dark }) {
    return (
        <style id="adm-styles">{`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
            html,body{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;-webkit-font-smoothing:antialiased;}
            body{background:${t.bg}!important;color:${t.text}!important;}
            ::-webkit-scrollbar{width:5px;height:5px;}
            ::-webkit-scrollbar-track{background:transparent;}
            ::-webkit-scrollbar-thumb{background:${dark?'#2D3748':'#B8C4D0'};border-radius:4px;}

            .adm-card{
                background:${t.card}!important;
                border:1.5px solid ${t.border}!important;
                border-radius:14px;
                box-shadow:${t.cardShadow};
                transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease;
            }
            .adm-card:hover{
                border-color:${t.borderHover}!important;
                box-shadow:0 8px 28px rgba(${t.accentRgb},.1);
            }

            .adm-btn-primary{
                background:linear-gradient(135deg,${t.accent} 0%,${t.accentEnd} 100%)!important;
                color:#fff!important;border:none;border-radius:9px;
                padding:9px 20px;font-size:13px;font-weight:600;
                cursor:pointer;transition:all .18s;
                box-shadow:0 3px 10px rgba(${t.accentRgb},.28);
                font-family:inherit;display:inline-flex;align-items:center;justify-content:center;
            }
            .adm-btn-primary:hover{transform:translateY(-1px);box-shadow:0 5px 16px rgba(${t.accentRgb},.42);}

            .adm-btn-ghost{
                background:transparent!important;color:${t.textMuted}!important;
                border:1.5px solid ${t.border}!important;border-radius:9px;
                padding:9px 20px;font-size:13px;font-weight:600;
                cursor:pointer;transition:all .18s;font-family:inherit;
                display:inline-flex;align-items:center;justify-content:center;
            }
            .adm-btn-ghost:hover{background:${t.navHover}!important;color:${t.text}!important;border-color:${t.borderHover}!important;}

            .adm-input{
                width:100%;background:${t.input}!important;color:${t.text}!important;
                border:1.5px solid ${t.inputBorder}!important;border-radius:9px;
                padding:9px 13px;font-size:13px;outline:none;
                font-family:inherit;transition:border-color .18s,box-shadow .18s;box-sizing:border-box;
            }
            .adm-input:focus{border-color:${t.accent}!important;box-shadow:0 0 0 3px rgba(${t.accentRgb},.14)!important;}
            .adm-input::placeholder{color:${t.textDim}!important;}
            textarea.adm-input{resize:vertical;line-height:1.6;}
            select.adm-input{cursor:pointer;}
            select.adm-input option{background:${t.card};color:${t.text};}

            .adm-label{display:block;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:${t.textMuted};margin-bottom:5px;}

            .adm-badge{display:inline-flex;align-items:center;gap:4px;border-radius:5px;padding:2px 8px;font-size:11px;font-weight:700;white-space:nowrap;}
            .adm-badge-green {background:rgba(16,185,129,.14);color:${dark?'#34D399':'#059669'};}
            .adm-badge-blue  {background:rgba(${t.accentRgb},.14);color:${t.accent};}
            .adm-badge-orange{background:rgba(245,158,11,.14);color:${dark?'#FCD34D':'#D97706'};}
            .adm-badge-red   {background:rgba(239,68,68,.14);color:${dark?'#FCA5A5':'#DC2626'};}
            .adm-badge-cyan  {background:rgba(6,182,212,.14);color:${dark?'#67E8F9':'#0891B2'};}

            .adm-sidebar-link{text-decoration:none!important;display:block;}
            .adm-nav-item{transition:all .14s ease;}
            .adm-sidebar-link:hover .adm-nav-item:not(.adm-nav-active){background:rgba(99,102,241,.1)!important;color:#CBD5E1!important;}
            .adm-nav-active{background:linear-gradient(135deg,${t.accent} 0%,${t.accentEnd} 100%)!important;color:#fff!important;box-shadow:0 3px 10px rgba(${t.accentRgb},.3)!important;}

            .adm-section-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${t.sidebarGroupLabel};padding:10px 10px 4px;}
            .adm-divider{height:1px;background:${dark?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.07)'};margin:6px 4px;}

            .adm-table-header{background:${dark?'rgba(255,255,255,0.03)':'rgba(0,0,0,0.03)'}!important;}
            .adm-table-row:hover{background:${t.rowHover}!important;}

            @keyframes adm-fade-in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
            .adm-page{animation:adm-fade-in .22s ease;}
        `}</style>
    );
}



// ─── Sidebar ────────────────────────────────────────────────────────────────────
function Sidebar({ collapsed, setCollapsed, unreadCount, t }) {
    const { url } = usePage();
    return (
        <aside style={{ width: collapsed ? '60px' : '210px', minHeight: '100vh', background: t.sidebar, position: 'fixed', left: 0, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', borderRight: `1px solid ${t.sidebarBorder}`, zIndex: 200, transition: 'width .22s ease', overflow: 'hidden' }}>
            <div style={{ padding: '16px 12px', borderBottom: `1px solid ${t.sidebarBorder}`, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                    <div style={{ width: '34px', height: '34px', flexShrink: 0, background: `linear-gradient(135deg,${t.accent},${t.accentEnd})`, borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '13px' }}>SM</div>
                    {!collapsed && <>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <div style={{ color: '#F1F5F9', fontWeight: '700', fontSize: '13px', whiteSpace: 'nowrap' }}>Portfolio CMS</div>
                            <div style={{ color: t.sidebarGroupLabel, fontSize: '10px', marginTop: '1px', whiteSpace: 'nowrap' }}>Admin Dashboard</div>
                        </div>
                        <button onClick={() => setCollapsed(true)} style={{ background: 'none', border: 'none', color: t.sidebarGroupLabel, cursor: 'pointer', padding: '3px', lineHeight: 0, flexShrink: 0 }}><svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg></button>
                    </>}
                </div>
                {collapsed && <button onClick={() => setCollapsed(false)} style={{ marginTop: '10px', background: 'none', border: 'none', color: t.sidebarGroupLabel, cursor: 'pointer', width: '100%', display: 'flex', justifyContent: 'center', lineHeight: 0 }}><svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button>}
            </div>
            <nav style={{ flex: 1, padding: '8px 6px', overflowY: 'auto', overflowX: 'hidden' }}>
                {NAV.map(group => <div key={group.group} style={{ marginBottom: '4px' }}>
                    {!collapsed && <div style={{ padding: '8px 10px 3px', fontSize: '10px', fontWeight: '700', letterSpacing: '.1em', color: t.sidebarGroupLabel }}>{group.group}</div>}
                    {group.items.map(item => {
                        const active = url.startsWith(item.href);
                        return <Link key={item.routeName} href={route(item.routeName)} className="adm-sidebar-link" title={collapsed ? item.label : undefined}>
                            <div className={active ? '' : 'adm-nav-item'} style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '9px 0' : '8px 10px', borderRadius: '9px', marginBottom: '1px', color: active ? '#fff' : t.sidebarText, fontWeight: active ? '600' : '400', fontSize: '13px', background: active ? `linear-gradient(135deg,${t.accent},${t.accentEnd})` : 'transparent', boxShadow: active ? `0 3px 10px rgba(${t.accentRgb},.28)` : 'none', transition: 'all .14s ease', position: 'relative' }}>
                                <span style={{ flexShrink: 0, opacity: active ? 1 : 0.6, lineHeight: 0 }}>{item.icon}</span>
                                {!collapsed && <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>}
                                {!collapsed && item.routeName === 'admin.messages' && unreadCount > 0 && <span style={{ background: '#EF4444', color: '#fff', borderRadius: '10px', padding: '1px 6px', fontSize: '10px', fontWeight: '700', lineHeight: 1.4 }}>{unreadCount}</span>}
                            </div>
                        </Link>;
                    })}
                </div>)}
            </nav>
            <div style={{ padding: '8px 6px', borderTop: `1px solid ${t.sidebarBorder}`, flexShrink: 0 }}>
                <Link href={route('home')} style={{ textDecoration: 'none', display: 'block' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: '7px', padding: '7px 10px', borderRadius: '8px', color: t.textDim, fontSize: '12px', fontWeight: '500', marginBottom: '4px', cursor: 'pointer', transition: 'all .14s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#CBD5E1'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = t.textDim; }}>
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        {!collapsed && 'View Portfolio'}
                    </div>
                </Link>
                <Link href={route('logout')} method="post" as="button" style={{ width: '100%', background: 'none', border: 'none', padding: 0, display: 'block', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: '7px', padding: '7px 10px', borderRadius: '8px', color: '#EF4444', fontSize: '12px', fontWeight: '600', cursor: 'pointer', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.1)', transition: 'all .14s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.14)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.07)'}>
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        {!collapsed && 'Sign Out'}
                    </div>
                </Link>
            </div>
        </aside>
    );
}

const NAV_FLAT = NAV.flatMap(g => g.items);

function TopBar({ title, sidebarWidth, profile, unreadCount, t }) {
    const { auth } = usePage().props;
    const { dark: isDark, toggle: toggleTheme } = useTheme();
    const [search, setSearch] = useState('');
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        function handleClick(e) { if (searchRef.current && !searchRef.current.contains(e.target)) setShowResults(false); }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const results = search.trim()
        ? NAV_FLAT.filter(item => item.label.toLowerCase().includes(search.toLowerCase()))
        : [];

    const avatarUrl = profile?.avatar ? (profile.avatar.startsWith('http') ? profile.avatar : '/' + profile.avatar) : null;

    return (
        <div style={{ position: 'fixed', top: 0, left: sidebarWidth, right: 0, zIndex: 150, height: '60px', background: t.topbar, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: `1px solid ${t.sidebarBorder}`, display: 'flex', alignItems: 'center', padding: '0 22px', gap: '14px', transition: 'left .22s ease' }}>
            <div style={{ flexShrink: 0 }}>
                <div style={{ fontSize: '16px', fontWeight: '700', color: t.text, lineHeight: 1.2 }}>{title}</div>
                <div style={{ fontSize: '11px', color: t.textMuted, marginTop: '1px' }}>Home <span style={{ opacity: .4, margin: '0 3px' }}>›</span><span style={{ color: t.accent }}>{title}</span></div>
            </div>
            <div ref={searchRef} style={{ flex: 1, maxWidth: '320px', margin: '0 auto', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: t.textDim, lineHeight: 0 }}>
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                </span>
                <input placeholder="Search pages…" value={search} onChange={e => { setSearch(e.target.value); setShowResults(true); }} onFocus={() => setShowResults(true)} style={{ width: '100%', background: t.input, border: `1.5px solid ${t.inputBorder}`, borderRadius: '50px', padding: '7px 40px 7px 30px', fontSize: '12px', color: t.text, outline: 'none', fontFamily: 'inherit' }} />
                {showResults && search.trim() && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px', background: t.cardSolid, border: `1px solid ${t.border}`, borderRadius: '12px', boxShadow: '0 12px 40px rgba(0,0,0,0.3)', padding: '6px', zIndex: 300 }}>
                        {results.length === 0 && <div style={{ padding: '12px 14px', fontSize: '12px', color: t.textMuted, textAlign: 'center' }}>No pages found</div>}
                        {results.map(item => (
                            <Link key={item.routeName} href={route(item.routeName)} onClick={() => { setSearch(''); setShowResults(false); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', color: t.text, textDecoration: 'none', fontSize: '13px', fontWeight: '500', transition: 'background 0.12s' }}
                                onMouseEnter={e => e.currentTarget.style.background = t.navHover}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                <span style={{ opacity: 0.5, lineHeight: 0, flexShrink: 0 }}>{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
                <button onClick={toggleTheme} title={isDark ? 'Switch to Light' : 'Switch to Dark'} style={{ width: '32px', height: '32px', borderRadius: '9px', background: t.input, border: `1.5px solid ${t.inputBorder}`, color: t.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0 }}>
                    {isDark ? <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> : <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>}
                </button>
                <div style={{ position: 'relative' }}>
                    <Link href={route('admin.messages')} style={{ width: '32px', height: '32px', borderRadius: '9px', background: t.input, border: `1.5px solid ${t.inputBorder}`, color: t.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0, textDecoration: 'none' }}>
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                    </Link>
                    {unreadCount > 0 && <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#EF4444', color: '#fff', borderRadius: '10px', padding: '0 5px', fontSize: '9px', fontWeight: '700', lineHeight: '16px', border: `2px solid ${t.topbar}` }}>{unreadCount}</span>}
                </div>
                <Link href={route('admin.profile')} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px 4px 4px', borderRadius: '50px', background: t.input, border: `1.5px solid ${t.inputBorder}`, cursor: 'pointer' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: `2px solid rgba(${t.accentRgb},.4)` }}>
                        {avatarUrl ? <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg,${t.accent},${t.accentEnd})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: '700' }}>{auth?.user?.name?.[0]?.toUpperCase() || 'A'}</div>}
                    </div>
                    {auth?.user && <div style={{ lineHeight: 1.2 }}><div style={{ fontSize: '12px', fontWeight: '600', color: t.text, whiteSpace: 'nowrap' }}>{auth.user.name}</div><div style={{ fontSize: '10px', color: t.accent }}>Admin</div></div>}
                </Link>
            </div>
        </div>
    );
}

// ─── Root Layout ────────────────────────────────────────────────────────────────
export default function AdminLayout({ children, title = 'Dashboard' }) {
    const [collapsed, setCollapsed] = useState(false);
    const sw = collapsed ? '60px' : '210px';
    const { auth, profile, unreadCount } = usePage().props;
    const [dark, setDark] = useState(() => localStorage.getItem('admin-theme') !== 'light');
    const t = dark ? tokens.dark : tokens.light;

    useEffect(() => {
        localStorage.setItem('admin-theme', dark ? 'dark' : 'light');
    }, [dark]);

    function toggleTheme() { setDark(d => !d); }

    return (
        <ThemeContext.Provider value={{ dark, toggle: toggleTheme, t }}>
            <GlobalStyles t={t} dark={dark} />
            <div style={{ display: 'flex', minHeight: '100vh', background: t.bg }}>
                <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} unreadCount={unreadCount || 0} t={t} />
                <div style={{ marginLeft: sw, flex: 1, display: 'flex', flexDirection: 'column', transition: 'margin-left .22s ease', minWidth: 0 }}>
                    <TopBar title={title} sidebarWidth={sw} profile={profile} unreadCount={unreadCount || 0} t={t} />
                    <main style={{ marginTop: '60px', flex: 1, padding: '22px 26px', background: t.bg }}>
                        <div className="adm-page">{children}</div>
                    </main>
                </div>
            </div>
        </ThemeContext.Provider>
    );
}
