import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const inputStyle = { width: '100%', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '9px 12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#fff', color: '#0f172a' };
const btnStyle = (color = '#2563eb') => ({ background: color, color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' });

export default function AdminExperiences() {
    const [experiences, setExperiences] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ type: 'work', title: '', subtitle: '', date_range: '', description: '', tags: '' });

    useEffect(() => { fetchExperiences(); }, []);

    function fetchExperiences() { axios.get('/api/experiences').then(r => setExperiences(r.data)); }

    function save() {
        const data = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
        const req = editing ? axios.put(`/api/experiences/${editing}`, data) : axios.post('/api/experiences', data);
        req.then(() => { setEditing(null); setForm({ type: 'work', title: '', subtitle: '', date_range: '', description: '', tags: '' }); fetchExperiences(); });
    }

    function edit(e) { setEditing(e.id); setForm({ ...e, tags: e.tags?.join(', ') || '' }); }
    function remove(id) { if (confirm('Delete?')) axios.delete(`/api/experiences/${id}`).then(fetchExperiences); }

    const work = experiences.filter(e => e.type === 'work');
    const education = experiences.filter(e => e.type === 'education');

    return (
        <AdminLayout title="My Journey">
            <Head title="Admin - Experiences" />

            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>{editing ? 'Edit Entry' : '+ Add Entry'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <select style={inputStyle} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                        <option value="work">💼 Work Experience</option>
                        <option value="education">🎓 Education</option>
                    </select>
                    <input style={inputStyle} placeholder="Title (e.g. Web Developer)" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    <input style={inputStyle} placeholder="Subtitle (e.g. Freelancer)" value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} />
                    <input style={inputStyle} placeholder="Date range (e.g. Aug 2023 — Present)" value={form.date_range} onChange={e => setForm({ ...form, date_range: e.target.value })} />
                    <textarea style={{ ...inputStyle, gridColumn: '1/-1', resize: 'vertical' }} rows={3} placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    <input style={{ ...inputStyle, gridColumn: '1/-1' }} placeholder="Tags (comma separated): React, Node.js" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
                </div>
                <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                    <button onClick={save} style={btnStyle()}>{editing ? 'Update' : 'Add Entry'}</button>
                    {editing && <button onClick={() => { setEditing(null); setForm({ type: 'work', title: '', subtitle: '', date_range: '', description: '', tags: '' }); }} style={btnStyle('#94a3b8')}>Cancel</button>}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {[{ label: '💼 Work', items: work, color: '#2563eb' }, { label: '🎓 Education', items: education, color: '#7c3aed' }].map(col => (
                    <div key={col.label} style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: col.color, marginBottom: '16px' }}>{col.label}</h3>
                        {col.items.length === 0 && <div style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '20px' }}>None yet.</div>}
                        {col.items.map(e => (
                            <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 0', borderBottom: '1px solid #f1f5f9', gap: '8px' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '13px' }}>{e.title}</div>
                                    <div style={{ color: '#f97316', fontSize: '11px', marginTop: '2px' }}>{e.date_range}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                                    <button onClick={() => edit(e)} style={{ background: 'none', border: '1px solid #f59e0b', color: '#f59e0b', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
                                    <button onClick={() => remove(e.id)} style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer' }}>×</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
