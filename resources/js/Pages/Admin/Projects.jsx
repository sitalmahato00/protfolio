import AdminLayout from '@/Layouts/AdminLayout';
import { useTheme } from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

// ─── Status chip ──────────────────────────────────────────────────────────────
const statusMap = {
    published: { label: 'Published', cls: 'adm-badge-green' },
    draft:     { label: 'Draft',     cls: 'adm-badge-orange' },
    archived:  { label: 'Archived',  cls: 'adm-badge-red' },
};

function StatusChip({ status = 'published' }) {
    const s = statusMap[status] || statusMap.published;
    return <span className={`adm-badge ${s.cls}`}><span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />{s.label}</span>;
}

// ─── Project Form Modal ───────────────────────────────────────────────────────
function ProjectModal({ form, setForm, editing, onSave, onCancel, t }) {
    const imgUrl = s => s ? (s.startsWith('http') ? s : '/' + s) : null;

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: t.cardSolid, border: `1px solid ${t.border}`, borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div>
                        <div style={{ fontSize: '16px', fontWeight: '800', color: t.text }}>{editing ? 'Edit Project' : 'New Project'}</div>
                        <div style={{ fontSize: '12px', color: t.textMuted, marginTop: '2px' }}>{editing ? 'Update project details' : 'Add a new portfolio project'}</div>
                    </div>
                    <button onClick={onCancel} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}>×</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div style={{ gridColumn: '1/-1' }}>
                        <label className="adm-label">Project Title *</label>
                        <input className="adm-input" placeholder="e.g. E-Commerce Platform" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    </div>
                    <div style={{ gridColumn: '1/-1' }}>
                        <label className="adm-label">Description</label>
                        <textarea className="adm-input" rows={3} style={{ resize: 'vertical' }} placeholder="Describe what this project does..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    </div>
                    <div style={{ gridColumn: '1/-1' }}>
                        <label className="adm-label">Image Path</label>
                        <input className="adm-input" placeholder="images/project.png or https://..." value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
                        {imgUrl(form.image) && <img src={imgUrl(form.image)} alt="preview" style={{ marginTop: '8px', height: '80px', borderRadius: '8px', objectFit: 'cover', border: `1px solid ${t.border}` }} />}
                    </div>
                    <div style={{ gridColumn: '1/-1' }}>
                        <label className="adm-label">Tags (comma separated)</label>
                        <input className="adm-input" placeholder="React, Laravel, Node.js, TailwindCSS" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
                    </div>
                    <div>
                        <label className="adm-label">Live URL</label>
                        <input className="adm-input" placeholder="https://example.com" value={form.live_url} onChange={e => setForm({ ...form, live_url: e.target.value })} />
                    </div>
                    <div>
                        <label className="adm-label">GitHub URL</label>
                        <input className="adm-input" placeholder="https://github.com/..." value={form.github_url} onChange={e => setForm({ ...form, github_url: e.target.value })} />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'flex-end' }}>
                    <button className="adm-btn-ghost" onClick={onCancel}>Cancel</button>
                    <button className="adm-btn-primary" onClick={onSave}>{editing ? 'Update Project' : 'Create Project'}</button>
                </div>
            </div>
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminProjects() {
    const { t } = useTheme();
    const blank = { title: '', description: '', image: '', tags: '', live_url: '', github_url: '' };
    const [projects, setProjects] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(blank);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState([]);

    useEffect(() => { fetch(); }, []);
    function fetch() { axios.get('/api/projects').then(r => setProjects(r.data)); }

    function openCreate() { setEditing(null); setForm(blank); setShowModal(true); }
    function openEdit(p) { setEditing(p.id); setForm({ ...p, tags: p.tags?.join(', ') || '' }); setShowModal(true); }
    function closeModal() { setShowModal(false); setEditing(null); setForm(blank); }

    function save() {
        const data = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
        const req = editing ? axios.put(`/api/projects/${editing}`, data) : axios.post('/api/projects', data);
        req.then(() => { closeModal(); fetch(); });
    }

    function remove(id) {
        if (confirm('Delete this project?')) axios.delete(`/api/projects/${id}`).then(fetch);
    }

    function duplicate(p) {
        const data = { ...p, title: p.title + ' (Copy)', tags: p.tags || [] };
        axios.post('/api/projects', data).then(fetch);
    }

    function toggleSelect(id) {
        setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
    }

    function bulkDelete() {
        if (!selected.length || !confirm(`Delete ${selected.length} projects?`)) return;
        Promise.all(selected.map(id => axios.delete(`/api/projects/${id}`))).then(() => { setSelected([]); fetch(); });
    }

    const imgUrl = s => s ? (s.startsWith('http') ? s : '/' + s) : null;
    const filtered = projects.filter(p =>
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.tags?.join(' ').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout title="Projects">
            <Head title="Admin – Projects" />
            {showModal && <ProjectModal form={form} setForm={setForm} editing={editing} onSave={save} onCancel={closeModal} t={t} />}

            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '320px' }}>
                    <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: t.textDim }}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    </div>
                    <input className="adm-input" style={{ paddingLeft: '36px', borderRadius: '50px' }} placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                {selected.length > 0 && (
                    <button className="adm-btn-ghost" onClick={bulkDelete} style={{ borderColor: '#EF444440', color: '#EF4444' }}>
                        🗑 Delete {selected.length} selected
                    </button>
                )}
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: t.textMuted }}>{filtered.length} projects</span>
                    <button className="adm-btn-primary" onClick={openCreate}>+ New Project</button>
                </div>
            </div>

            {/* Table */}
            <div className="adm-card" style={{ overflow: 'hidden', padding: 0 }}>
                {/* Table Header */}
                <div style={{ display: 'grid', gridTemplateColumns: '36px 60px 1fr 160px 100px 90px', gap: '12px', padding: '12px 20px', borderBottom: `1px solid ${t.border}`, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: t.textMuted }}>
                    <div><input type="checkbox" onChange={e => setSelected(e.target.checked ? filtered.map(p => p.id) : [])} checked={selected.length === filtered.length && filtered.length > 0} style={{ accentColor: '#6366F1', width: '14px', height: '14px' }} /></div>
                    <div>Image</div>
                    <div>Project</div>
                    <div>Tags</div>
                    <div>Status</div>
                    <div>Actions</div>
                </div>

                {filtered.length === 0 && (
                    <div style={{ padding: '60px', textAlign: 'center', color: t.textMuted }}>
                        <div style={{ fontSize: '40px', marginBottom: '12px' }}>📁</div>
                        <div style={{ fontSize: '14px' }}>No projects found. Add your first project above.</div>
                    </div>
                )}

                {filtered.map((p, i) => (
                    <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '36px 60px 1fr 160px 100px 90px', gap: '12px', padding: '12px 20px', borderBottom: `1px solid ${t.border}`, alignItems: 'center', background: selected.includes(p.id) ? `rgba(99,102,241,0.05)` : 'transparent', transition: 'background 0.15s' }}
                        onMouseEnter={e => { if (!selected.includes(p.id)) e.currentTarget.style.background = `${t.navHover}`; }}
                        onMouseLeave={e => { e.currentTarget.style.background = selected.includes(p.id) ? 'rgba(99,102,241,0.05)' : 'transparent'; }}>
                        <div><input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} style={{ accentColor: '#6366F1', width: '14px', height: '14px' }} /></div>
                        <div>
                            {imgUrl(p.image)
                                ? <img src={imgUrl(p.image)} alt={p.title} style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: '8px', border: `1px solid ${t.border}` }} />
                                : <div style={{ width: '48px', height: '36px', background: `rgba(99,102,241,0.15)`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📁</div>
                            }
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: t.text }}>{p.title}</div>
                            <div style={{ fontSize: '12px', color: t.textMuted, marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '280px' }}>{p.description}</div>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {(p.tags || []).slice(0, 3).map(tag => (
                                <span key={tag} className="adm-badge adm-badge-blue" style={{ fontSize: '10px' }}>{tag}</span>
                            ))}
                            {(p.tags || []).length > 3 && <span className="adm-badge" style={{ fontSize: '10px', background: t.navHover, color: t.textMuted }}>+{p.tags.length - 3}</span>}
                        </div>
                        <div><StatusChip status="published" /></div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {p.live_url && p.live_url !== '#' && (
                                <a href={p.live_url} target="_blank" rel="noreferrer" title="Preview" style={{ width: '28px', height: '28px', borderRadius: '7px', background: t.navHover, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.textMuted, textDecoration: 'none' }}>
                                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                </a>
                            )}
                            <button onClick={() => openEdit(p)} title="Edit" style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(245,158,11,0.12)', border: 'none', color: '#F59E0B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </button>
                            <button onClick={() => remove(p.id)} title="Delete" style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(239,68,68,0.12)', border: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
