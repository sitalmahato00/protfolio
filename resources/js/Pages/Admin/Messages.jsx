import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminMessages() {
    const [messages, setMessages] = useState([]);

    useEffect(() => { fetchMessages(); }, []);

    function fetchMessages() { axios.get('/api/contact').then(r => setMessages(r.data)); }

    function remove(id) {
        if (confirm('Delete this message?'))
            axios.delete(`/api/contact/${id}`).then(fetchMessages);
    }

    function markRead(id) {
        axios.patch(`/api/contact/${id}/read`).then(fetchMessages);
    }

    return (
        <AdminLayout title="Messages">
            <Head title="Admin - Messages" />

            {messages.length === 0 ? (
                <div style={{ background: '#fff', borderRadius: '16px', padding: '60px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>💬</div>
                    <div style={{ color: '#64748b', fontSize: '15px' }}>No messages yet. Your contact form is ready.</div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {messages.map(m => (
                        <div key={m.id} style={{
                            background: '#fff',
                            borderRadius: '14px',
                            padding: '20px 24px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            borderLeft: !m.is_read ? '4px solid #2563eb' : '4px solid #e2e8f0',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
                                <div>
                                    <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '15px' }}>{m.name}</div>
                                    <div style={{ color: '#64748b', fontSize: '13px' }}>{m.email}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                    {!m.is_read && <span style={{ background: '#dbeafe', color: '#2563eb', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '50px' }}>New</span>}
                                    <span style={{ color: '#94a3b8', fontSize: '12px' }}>{new Date(m.created_at).toLocaleDateString()}</span>
                                    {!m.is_read && <button onClick={() => markRead(m.id)} style={{ background: 'none', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer' }}>Mark read</button>}
                                    <button onClick={() => remove(m.id)} style={{ background: '#fee2e2', border: 'none', color: '#ef4444', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer' }}>Delete</button>
                                </div>
                            </div>
                            {m.subject && <div style={{ color: '#475569', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Subject: {m.subject}</div>}
                            <div style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6' }}>{m.message}</div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
