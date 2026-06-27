import { Link, usePage } from '@inertiajs/react';

const navItems = [
    {
        label: 'Dashboard', routeName: 'admin.dashboard', href: '/admin/dashboard',
        icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
    },
    {
        label: 'Projects', routeName: 'admin.projects', href: '/admin/projects',
        icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
    },
    {
        label: 'Skills', routeName: 'admin.skills', href: '/admin/skills',
        icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
    },
    {
        label: 'Services', routeName: 'admin.services', href: '/admin/services',
        icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
    },
    {
        label: 'Experiences', routeName: 'admin.experiences', href: '/admin/experiences',
        icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    },
    {
        label: 'Messages', routeName: 'admin.messages', href: '/admin/messages',
        icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
    },
    {
        label: 'Profile Settings', routeName: 'admin.profile', href: '/admin/profile',
        icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    },
];

export default function AdminLayout({ children, title = 'Admin' }) {
    const { url } = usePage();
    const { auth } = usePage().props;

    const isActive = (href) => url.startsWith(href);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', -apple-system, sans-serif" }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                minHeight: '100vh',
                background: '#0f172a',
                position: 'fixed',
                left: 0, top: 0, bottom: 0,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 100,
            }}>
                {/* Logo */}
                <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '42px', height: '42px',
                            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #7c3aed 100%)',
                            borderRadius: '10px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontWeight: '800', fontSize: '16px', flexShrink: 0,
                        }}>SM</div>
                        <div>
                            <div style={{ color: '#fff', fontWeight: '700', fontSize: '14px', lineHeight: 1.2 }}>Portfolio Admin</div>
                            <div style={{ color: '#475569', fontSize: '11px', marginTop: '2px' }}>Management Panel</div>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '12px 10px' }}>
                    {navItems.map(item => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.routeName}
                                href={route(item.routeName)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '10px 14px',
                                    borderRadius: active ? '0 8px 8px 0' : '8px',
                                    marginBottom: '2px',
                                    marginLeft: active ? '-10px' : 0,
                                    paddingLeft: active ? '24px' : '14px',
                                    color: active ? '#60a5fa' : '#64748b',
                                    fontWeight: active ? '600' : '500',
                                    fontSize: '14px',
                                    textDecoration: 'none',
                                    background: active ? 'rgba(37,99,235,0.15)' : 'transparent',
                                    borderLeft: active ? '3px solid #2563eb' : '3px solid transparent',
                                    transition: 'all 0.15s',
                                }}
                            >
                                <span style={{ opacity: active ? 1 : 0.6 }}>{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div style={{ padding: '16px 14px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    {auth?.user && (
                        <div style={{ marginBottom: '12px', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}>
                            <div style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: '600', marginBottom: '2px' }}>{auth.user.name}</div>
                            <div style={{ color: '#475569', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{auth.user.email}</div>
                        </div>
                    )}
                    <Link
                        href={route('home')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '13px', textDecoration: 'none', padding: '8px 12px', borderRadius: '8px', marginBottom: '6px', transition: 'all 0.15s' }}
                    >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        View Portfolio
                    </Link>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        style={{
                            width: '100%', textAlign: 'left',
                            background: 'rgba(239,68,68,0.08)',
                            color: '#ef4444',
                            border: '1px solid rgba(239,68,68,0.15)',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.15s',
                        }}
                    >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main */}
            <main style={{ marginLeft: '260px', flex: 1, background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                {/* Top bar */}
                <div style={{
                    background: '#fff',
                    borderBottom: '1px solid #e2e8f0',
                    padding: '18px 32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky', top: 0, zIndex: 50,
                }}>
                    <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>{title}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: '700' }}>
                            {auth?.user?.name?.[0]?.toUpperCase() || 'A'}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: '32px', flex: 1 }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
