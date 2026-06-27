import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const inputStyle = { width: '100%', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '9px 12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#fff', color: '#0f172a' };
const btnStyle = (color = '#2563eb') => ({ background: color, color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' });

export default function AdminSkills() {
    const [skills, setSkills] = useState([]);
    const [form, setForm] = useState({ category: '', name: '', icon: '' });
    const [editing, setEditing] = useState(null);

    useEffect(() => { fetchSkills(); }, []);

    function fetchSkills() { axios.get('/api/skills').then(r => setSkills(r.data)); }

    function save() {
        const req = editing ? axios.put(`/api/skills/${editing}`, form) : axios.post('/api/skills', form);
        req.then(() => { setEditing(null); setForm({ category: '', name: '', icon: '' }); fetchSkills(); });
    }

    function edit(s) { setEditing(s.id); setForm({ category: s.category, name: s.name, icon: s.icon || '' }); }
    function remove(id) { if (confirm('Delete this skill?')) axios.delete(`/api/skills/${id}`).then(fetchSkills); }

    const grouped = skills.reduce((acc, s) => { (acc[s.category] ??= []).push(s); return acc; }, {});

    return (
        <AdminLayout title="Manage Skills">
            <Head title="Admin - Skills" />

            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>{editing ? 'Edit Skill' : '+ Add New Skill'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <input style={inputStyle} placeholder="Category (e.g. Frontend)" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                    <input style={inputStyle} placeholder="Skill name (e.g. React)" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    <input style={inputStyle} placeholder="Icon emoji (e.g. 🎨)" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} />
                </div>
                <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                    <button onClick={save} style={btnStyle()}>{editing ? 'Update Skill' : 'Add Skill'}</button>
                    {editing && <button onClick={() => { setEditing(null); setForm({ category: '', name: '', icon: '' }); }} style={btnStyle('#94a3b8')}>Cancel</button>}
                </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                {Object.entries(grouped).map(([cat, items]) => (
                    <div key={cat} style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#2563eb', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{cat}</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {items.map(s => (
                                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8faff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 12px', fontSize: '13px' }}>
                                    <span>{s.icon}</span>
                                    <span style={{ fontWeight: '600', color: '#1e293b' }}>{s.name}</span>
                                    <button onClick={() => edit(s)} style={{ background: 'none', border: 'none', color: '#f59e0b', cursor: 'pointer', padding: '0 2px', fontSize: '12px' }}>Edit</button>
                                    <button onClick={() => remove(s.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0 2px', fontSize: '14px', lineHeight: 1 }}>×</button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                {skills.length === 0 && <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>No skills yet. Add your first skill above.</div>}
            </div>
        </AdminLayout>
    );
}
