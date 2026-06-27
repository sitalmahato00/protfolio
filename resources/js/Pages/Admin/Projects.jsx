import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const inputStyle = { width: '100%', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '9px 12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#fff', color: '#0f172a' };
const btnStyle = (color = '#2563eb') => ({ background: color, color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' });

export default function AdminProjects() {
    const [projects, setProjects] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ title: '', description: '', image: '', tags: '', live_url: '', github_url: '' });

    useEffect(() => { fetchProjects(); }, []);

    function fetchProjects() { axios.get('/api/projects').then(r => setProjects(r.data)); }

    function save() {
        const data = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
        const req = editing ? axios.put(`/api/projects/${editing}`, data) : axios.post('/api/projects', data);
        req.then(() => { setEditing(null); setForm({ title: '', description: '', image: '', tags: '', live_url: '', github_url: '' }); fetchProjects(); });
    }

    function edit(p) { setEditing(p.id); setForm({ ...p, tags: p.tags?.join(', ') || '' }); }
    function remove(id) { if (confirm('Delete this project?')) axios.delete(`/api/projects/${id}`).then(fetchProjects); }

    return (
        <AdminLayout title="Manage Projects">
            <Head title="Admin - Projects" />

            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>{editing ? 'Edit Project' : '+ Add New Project'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <input style={inputStyle} placeholder="Project title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    <input style={inputStyle} placeholder="Image path (e.g. images/project.png)" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
                    <textarea style={{ ...inputStyle, gridColumn: '1/-1', resize: 'vertical' }} rows={3} placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    <input style={inputStyle} placeholder="Tags (comma separated): React, Node.js, Laravel" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
                    <input style={inputStyle} placeholder="Live URL (or # if none)" value={form.live_url} onChange={e => setForm({ ...form, live_url: e.target.value })} />
                    <input style={{ ...inputStyle, gridColumn: '1/-1' }} placeholder="GitHub URL (or # if none)" value={form.github_url} onChange={e => setForm({ ...form, github_url: e.target.value })} />
                </div>
                <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                    <button onClick={save} style={btnStyle()}>{editing ? 'Update Project' : 'Create Project'}</button>
                    {editing && <button onClick={() => { setEditing(null); setForm({ title: '', description: '', image: '', tags: '', live_url: '', github_url: '' }); }} style={btnStyle('#94a3b8')}>Cancel</button>}
                </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                    All Projects ({projects.length})
                </div>
                {projects.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No projects yet. Add your first project above.</div>}
                {projects.map(p => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #f8fafc', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '14px' }}>{p.title}</div>
                            <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>{p.tags?.join(', ')}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                            <button onClick={() => edit(p)} style={{ ...btnStyle('#f59e0b'), padding: '6px 14px', fontSize: '13px' }}>Edit</button>
                            <button onClick={() => remove(p.id)} style={{ ...btnStyle('#ef4444'), padding: '6px 14px', fontSize: '13px' }}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
