import AdminLayout, { useTheme } from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCachedData } from '@/hooks/useCachedData';

/* ── Mobile detection hook ── */
function useIsMobile(bp = 768) {
    const [mobile, setMobile] = useState(window.innerWidth <= bp);
    useEffect(() => {
        const fn = () => setMobile(window.innerWidth <= bp);
        window.addEventListener('resize', fn);
        return () => window.removeEventListener('resize', fn);
    }, [bp]);
    return mobile;
}

function ConversationItem({ msg, active, onClick, t, dark }) {
    const activeBg     = dark ? 'rgba(99,102,241,0.14)' : 'rgba(79,70,229,0.07)';
    const activeBorder = `1px solid ${dark ? 'rgba(99,102,241,0.4)' : 'rgba(79,70,229,0.3)'}`;
    return (
        <div onClick={onClick}
            style={{ padding: '12px 14px', cursor: 'pointer', borderRadius: '10px', background: active ? activeBg : 'transparent', border: active ? activeBorder : '1px solid transparent', marginBottom: '3px', transition: 'all .15s' }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: '700', flexShrink: 0 }}>
                    {msg.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: msg.is_read ? '500' : '700', color: dark ? '#F1F5F9' : '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.name}</span>
                        <span style={{ fontSize: '10px', color: t.textDim, whiteSpace: 'nowrap', flexShrink: 0 }}>{new Date(msg.created_at).toLocaleDateString()}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: t.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                        {msg.subject || (msg.message?.slice(0, 42) + '…')}
                    </div>
                </div>
                {!msg.is_read && (
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#6366F1', flexShrink: 0 }} />
                )}
            </div>
        </div>
    );
}

export default function AdminMessages() {
    const { t, dark } = useTheme();
    const isMobile = useIsMobile(768);
    const { data: messages = [], refresh } = useCachedData('messages', () => axios.get('/api/contact').then(r => r.data));
    const [active, setActive] = useState(null);
    const [search, setSearch] = useState('');
    const [showDetail, setShowDetail] = useState(false);   // mobile: toggle panel

    function remove(id) {
        if (confirm('Delete this message?')) axios.delete(`/api/contact/${id}`).then(() => { setActive(null); setShowDetail(false); refresh(); });
    }
    function markRead(id) { axios.patch(`/api/contact/${id}/read`).then(refresh); }
    function selectMsg(msg) {
        setActive(msg);
        if (!msg.is_read) markRead(msg.id);
        if (isMobile) setShowDetail(true);
    }
    function goBack() { setShowDetail(false); }

    const filtered = messages.filter(m =>
        m.name?.toLowerCase().includes(search.toLowerCase()) ||
        m.email?.toLowerCase().includes(search.toLowerCase()) ||
        m.message?.toLowerCase().includes(search.toLowerCase())
    );
    const unread = messages.filter(m => !m.is_read).length;

    const cardBg     = dark ? '#1E293B' : '#FFFFFF';
    const cardBorder = dark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #E8ECF2';
    const cardShadow = dark ? '0 2px 8px rgba(0,0,0,0.4)' : 'none';
    const divider    = dark ? 'rgba(255,255,255,0.07)' : '#EEF0F5';

    /* ── Shared panel styles ── */
    const panelStyle = {
        background: cardBg, border: cardBorder, borderRadius: '14px',
        boxShadow: cardShadow, display: 'flex', flexDirection: 'column', overflow: 'hidden',
    };

    /* ── Inbox panel ── */
    const InboxPanel = (
        <div style={{ ...panelStyle, padding: '16px', ...(isMobile ? { height: 'calc(100vh - 160px)' } : { height: 'calc(100vh - 140px)' }) }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: dark ? '#F1F5F9' : '#111827' }}>Inbox</span>
                {unread > 0 && (
                    <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 9px', borderRadius: '20px', background: dark ? 'rgba(99,102,241,0.18)' : 'rgba(79,70,229,0.1)', color: '#6366F1' }}>
                        {unread} new
                    </span>
                )}
            </div>
            <div style={{ position: 'relative', marginBottom: '10px' }}>
                <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: t.textDim, lineHeight: 0 }}>
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                </span>
                <input className="adm-input" style={{ paddingLeft: '30px', fontSize: '12px', borderRadius: '8px' }} placeholder="Search messages…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px 16px', color: t.textMuted }}>
                        <div style={{ fontSize: '28px', marginBottom: '8px' }}>💬</div>
                        <div style={{ fontSize: '13px' }}>No messages yet</div>
                    </div>
                )}
                {filtered.map(m => (
                    <ConversationItem key={m.id} msg={m} active={active?.id === m.id} onClick={() => selectMsg(m)} t={t} dark={dark} />
                ))}
            </div>
        </div>
    );

    /* ── Detail panel ── */
    const DetailPanel = (
        <div style={{ ...panelStyle, ...(isMobile ? { height: 'calc(100vh - 160px)' } : { height: 'calc(100vh - 140px)' }) }}>
            {!active ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: t.textMuted, padding: '40px' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: dark ? 'rgba(99,102,241,0.12)' : 'rgba(79,70,229,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '16px' }}>💌</div>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: dark ? '#F1F5F9' : '#111827', marginBottom: '6px' }}>Select a message</div>
                    <div style={{ fontSize: '13px', textAlign: 'center', maxWidth: '220px', lineHeight: 1.5 }}>Choose a conversation from the left panel to read it</div>
                </div>
            ) : (
                <>
                    {/* Detail header */}
                    <div style={{ padding: '14px 18px', borderBottom: `1px solid ${divider}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {isMobile && (
                                <button onClick={goBack} style={{ width: '32px', height: '32px', borderRadius: '8px', background: dark ? 'rgba(255,255,255,0.06)' : '#F3F4F6', border: 'none', color: t.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
                                </button>
                            )}
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '15px', fontWeight: '700', flexShrink: 0 }}>
                                {active.name?.[0]?.toUpperCase()}
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: '14px', fontWeight: '700', color: dark ? '#F1F5F9' : '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{active.name}</div>
                                <div style={{ fontSize: '11px', color: t.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{active.email}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                            <span style={{ fontSize: '10px', color: t.textMuted, display: isMobile ? 'none' : 'inline' }}>{new Date(active.created_at).toLocaleString()}</span>
                            <a href={`mailto:${active.email}`} className="adm-btn-ghost" style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                Reply
                            </a>
                            <button onClick={() => remove(active.id)} style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '9px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', cursor: 'pointer', fontWeight: '600' }}>Delete</button>
                        </div>
                    </div>

                    {/* Body */}
                    <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                        {active.subject && (
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em', color: t.textDim, marginBottom: '4px' }}>Subject</div>
                                <div style={{ fontSize: '16px', fontWeight: '700', color: dark ? '#F1F5F9' : '#111827' }}>{active.subject}</div>
                            </div>
                        )}
                        <div style={{ background: dark ? 'rgba(255,255,255,0.04)' : '#F9FAFB', border: `1px solid ${divider}`, borderRadius: '12px', padding: '16px 18px', lineHeight: 1.7, fontSize: '14px', color: dark ? '#CBD5E1' : '#374151' }}>
                            {active.message}
                        </div>
                        <div style={{ marginTop: '14px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 9px', borderRadius: '6px', background: dark ? 'rgba(6,182,212,0.15)' : 'rgba(8,145,178,0.08)', color: dark ? '#67E8F9' : '#0c4a6e' }}>
                                ✉ {active.email}
                            </span>
                            {active.is_read
                                ? <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 9px', borderRadius: '6px', background: dark ? 'rgba(16,185,129,0.15)' : 'rgba(5,150,105,0.08)', color: dark ? '#6EE7B7' : '#065f46' }}>✓ Read</span>
                                : <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 9px', borderRadius: '6px', background: dark ? 'rgba(245,158,11,0.15)' : 'rgba(217,119,6,0.08)', color: dark ? '#FCD34D' : '#92400e' }}>● Unread</span>
                            }
                            {isMobile && <span style={{ fontSize: '10px', color: t.textMuted, padding: '3px 0' }}>{new Date(active.created_at).toLocaleString()}</span>}
                        </div>
                    </div>
                </>
            )}
        </div>
    );

    return (
        <>
            <Head title="Admin – Messages" />

            {isMobile ? (
                /* ── MOBILE: single panel, toggled ── */
                <div>
                    {!showDetail ? InboxPanel : DetailPanel}
                </div>
            ) : (
                /* ── DESKTOP: side-by-side ── */
                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '14px', height: 'calc(100vh - 140px)' }}>
                    {InboxPanel}
                    {DetailPanel}
                </div>
            )}
        </>
    );
}

AdminMessages.layout = page => <AdminLayout title="Messages">{page}</AdminLayout>;
