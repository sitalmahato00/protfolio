import AdminLayout, { useTheme } from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import { useCachedData } from '@/hooks/useCachedData';

function ConversationItem({ msg, active, onClick, t }) {
    return (
        <div onClick={onClick} style={{
            padding: '14px 16px', cursor: 'pointer', borderRadius: '12px',
            background: active ? `rgba(99,102,241,0.12)` : 'transparent',
            border: `1px solid ${active ? t.accent + '40' : 'transparent'}`,
            marginBottom: '4px', transition: 'all 0.15s',
        }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = t.navHover; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: `linear-gradient(135deg,#6366F1,#8B5CF6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: '700', flexShrink: 0 }}>
                    {msg.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '13px', fontWeight: msg.is_read ? '500' : '700', color: t.text }}>{msg.name}</span>
                        <span style={{ fontSize: '10px', color: t.textMuted }}>{new Date(msg.created_at).toLocaleDateString()}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: t.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                        {msg.subject || msg.message?.slice(0, 40) + '…'}
                    </div>
                </div>
                {!msg.is_read && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366F1', flexShrink: 0 }} />}
            </div>
        </div>
    );
}

export default function AdminMessages() {
    const { t } = useTheme();
    const { data: messages = [], refresh } = useCachedData('messages', () => axios.get('/api/contact').then(r => r.data));
    const [active, setActive] = useState(null);
    const [search, setSearch] = useState('');

    function remove(id) {
        if (confirm('Delete this message?')) axios.delete(`/api/contact/${id}`).then(() => { setActive(null); refresh(); });
    }

    function markRead(id) { axios.patch(`/api/contact/${id}/read`).then(refresh); }

    function selectMsg(msg) {
        setActive(msg);
        if (!msg.is_read) markRead(msg.id);
    }

    const filtered = messages.filter(m =>
        m.name?.toLowerCase().includes(search.toLowerCase()) ||
        m.email?.toLowerCase().includes(search.toLowerCase()) ||
        m.message?.toLowerCase().includes(search.toLowerCase())
    );

    const unread = messages.filter(m => !m.is_read).length;

    return (
        <AdminLayout title="Messages">
            <Head title="Admin – Messages" />

            <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '16px', height: 'calc(100vh - 140px)' }}>
                {/* Left: conversation list */}
                <div className="adm-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: t.text }}>Inbox</div>
                        {unread > 0 && <span className="adm-badge adm-badge-blue">{unread} new</span>}
                    </div>
                    <div style={{ position: 'relative', marginBottom: '12px' }}>
                        <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: t.textDim }}>
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                        </div>
                        <input className="adm-input" style={{ paddingLeft: '30px', fontSize: '12px' }} placeholder="Search messages…" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {filtered.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '40px 20px', color: t.textMuted }}>
                                <div style={{ fontSize: '32px', marginBottom: '8px' }}>💬</div>
                                <div style={{ fontSize: '13px' }}>No messages yet</div>
                            </div>
                        )}
                        {filtered.map(m => (
                            <ConversationItem key={m.id} msg={m} active={active?.id === m.id} onClick={() => selectMsg(m)} t={t} />
                        ))}
                    </div>
                </div>

                {/* Right: message detail */}
                <div className="adm-card" style={{ padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {!active ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: t.textMuted }}>
                            <div style={{ fontSize: '52px', marginBottom: '16px' }}>💌</div>
                            <div style={{ fontSize: '15px', fontWeight: '600', color: t.text, marginBottom: '6px' }}>Select a message</div>
                            <div style={{ fontSize: '13px' }}>Choose a conversation from the left panel</div>
                        </div>
                    ) : (
                        <>
                            {/* Detail header */}
                            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `linear-gradient(135deg,#6366F1,#8B5CF6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', fontWeight: '700' }}>
                                        {active.name?.[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '15px', fontWeight: '700', color: t.text }}>{active.name}</div>
                                        <div style={{ fontSize: '12px', color: t.textMuted }}>{active.email}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '12px', color: t.textMuted }}>{new Date(active.created_at).toLocaleString()}</span>
                                    <a href={`mailto:${active.email}`} className="adm-btn-ghost" style={{ padding: '7px 14px', fontSize: '12px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                        Reply
                                    </a>
                                    <button onClick={() => remove(active.id)} style={{ padding: '7px 14px', fontSize: '12px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', cursor: 'pointer', fontWeight: '600' }}>Delete</button>
                                </div>
                            </div>
                            {/* Message body */}
                            <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
                                {active.subject && (
                                    <div style={{ marginBottom: '20px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: t.textMuted }}>Subject</span>
                                        <div style={{ fontSize: '16px', fontWeight: '700', color: t.text, marginTop: '4px' }}>{active.subject}</div>
                                    </div>
                                )}
                                <div className="adm-card" style={{ padding: '24px', lineHeight: 1.7, fontSize: '14px', color: t.text, borderRadius: '14px' }}>
                                    {active.message}
                                </div>
                                <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <span className="adm-badge adm-badge-cyan">📱 {active.email}</span>
                                    {active.is_read
                                        ? <span className="adm-badge adm-badge-green">✓ Read</span>
                                        : <span className="adm-badge adm-badge-orange">● Unread</span>
                                    }
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
