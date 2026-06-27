import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const inputStyle = { width: '100%', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '9px 12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#fff', color: '#0f172a' };
const btnStyle = (color = '#2563eb') => ({ background: color, color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' });

export default function AdminServices() {
    const [services, setServices] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ title: '', description: '', icon: '', features: '', is_popular: false });

    useEffect(() => { fetchServices(); }, []);

    function fetchServices() { axios.get('/api/services').then(r => setServices(r.data)); }

    function save() {
        const data = { ...form, features: form.features.split('\n').map(f => f.trim()).filter(Boolean) };
        const req = editing ? axios.put(`/api/services/${editing}`, data) : axios.post('/api/services', data);
        req.then(() => { setEditing(null); setForm({ title: '', description: '', icon: '', features: '', is_popular: false }); fetchServices(); });
    }

    function edit(s) { setEditing(s.id); setForm({ ...s, features: s.features?.join('\n') || '' }); }
    function remove(id) { if (confirm('Delete this service?')) axios.delete(`/api/services/${id}`).then(fetchServices); }

    return (
        <AdminLayout title="Manage Services">
            <Head title="Admin - Services" />

            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>{editing ? 'Edit Service' : '+ Add New Service'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <input style={inputStyle} placeholder="Service title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    <input style={inputStyle} placeholder="Icon emoji (e.g. 🖥️)" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} />
                    <textarea style={{ ...inputStyle, gridColumn: '1/-1', resize: 'vertical' }} rows={2} placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    <textarea style={{ ...inputStyle, gridColumn: '1/-1', resize: 'vertical' }} rows={4} placeholder="Features (one per line)" value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#475569', cursor: 'pointer' }}>
                        <input type="checkbox" checked={form.is_popular} onChange={e => setForm({ ...form, is_popular: e.target.checked })} style={{ accentColor: '#2563eb', width: '16px', height: '16px' }} />
                        Mark as Popular (shows badge)
                    </label>
                </div>
                <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                    <button onClick={save} style={btnStyle()}>{editing ? 'Update Service' : 'Create Service'}</button>
                    {editing && <button onClick={() => { setEditing(null); setForm({ title: '', description: '', icon: '', features: '', is_popular: false }); }} style={btnStyle('#94a3b8')}>Cancel</button>}
                </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>All Services ({services.length})</div>
                {services.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No services yet.</div>}
                {services.map(s => (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #f8fafc', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                                <span>{s.icon}</span>
                                <span style={{ fontWeight: '600', color: '#0f172a', fontSize: '14px' }}>{s.title}</span>
                                {s.is_popular && <span style={{ background: '#f97316', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '50px' }}>Popular</span>}
                            </div>
                            <div style={{ color: '#94a3b8', fontSize: '12px' }}>{s.features?.length} features</div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                            <button onClick={() => edit(s)} style={{ ...btnStyle('#f59e0b'), padding: '6px 14px', fontSize: '13px' }}>Edit</button>
                            <button onClick={() => remove(s.id)} style={{ ...btnStyle('#ef4444'), padding: '6px 14px', fontSize: '13px' }}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
