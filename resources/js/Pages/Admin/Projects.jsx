import AdminLayout, { useTheme } from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useCachedData } from '@/hooks/useCachedData';

const MODULE_COLOR = '#7C3AED';

function useIsMobile(bp = 640) {
    const [mobile, setMobile] = useState(window.innerWidth <= bp);
    useEffect(() => {
        const fn = () => setMobile(window.innerWidth <= bp);
        window.addEventListener('resize', fn);
        return () => window.removeEventListener('resize', fn);
    }, [bp]);
    return mobile;
}

function tagColor(tag) {
    const t = (tag || '').toLowerCase();
    if (t.includes('laravel') || t.includes('php')) return { bg: 'rgba(239,68,68,0.12)', color: '#EF4444' };
    if (t.includes('react') || t.includes('next')) return { bg: 'rgba(59,130,246,0.12)', color: '#3B82F6' };
    if (t.includes('vue') || t.includes('nuxt')) return { bg: 'rgba(16,185,129,0.12)', color: '#10B981' };
    if (t.includes('node') || t.includes('express')) return { bg: 'rgba(16,185,129,0.14)', color: '#059669' };
    if (t.includes('mysql') || t.includes('postgres') || t.includes('sql')) return { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' };
    if (t.includes('redis') || t.includes('mongo')) return { bg: 'rgba(124,58,237,0.12)', color: '#7C3AED' };
    if (t.includes('tailwind') || t.includes('css')) return { bg: 'rgba(6,182,212,0.12)', color: '#06B6D4' };
    if (t.includes('typescript') || t.includes('ts')) return { bg: 'rgba(59,130,246,0.14)', color: '#2563EB' };
    if (t.includes('python') || t.includes('django')) return { bg: 'rgba(16,185,129,0.12)', color: '#059669' };
    return { bg: 'rgba(100,116,139,0.12)', color: '#64748B' };
}

function ProjectModal({ form, setForm, editing, setEditing, onSave, onCancel, t, dark }) {
    const imgUrl = s => s ? (s.startsWith('http') ? s : '/' + s) : null;
    const cardBg = dark ? '#1E293B' : '#FFFFFF';
    const [uploading, setUploading] = useState(false);
    const [uploadErr, setUploadErr] = useState('');
    const imgRef = useRef(null);

    async function handleImagesUpload(e) {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        setUploading(true);
        setUploadErr('');
        let projectId = editing;
        if (!projectId) {
            try {
                const data = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
                const res = await axios.post('/api/projects', data);
                projectId = res.data.id;
                setEditing(projectId);
                setForm(f => ({ ...f, images: res.data.images || [], image: res.data.image || f.image }));
            } catch (err) {
                const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to create project';
                setUploadErr(msg);
                setUploading(false);
                return;
            }
        }
        const fd = new FormData();
        files.forEach(f => fd.append('images[]', f));
        try {
            const res = await axios.post(`/api/projects/${projectId}/images`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            setForm(f => ({ ...f, images: res.data.images, image: res.data.images[0] || f.image }));
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Upload failed';
            setUploadErr(msg);
        }
        finally { setUploading(false); if (imgRef.current) imgRef.current.value = ''; }
    }

    function removeImage(img) {
        if (!confirm('Remove this image?')) return;
        const updated = (form.images || []).filter(x => x !== img);
        setForm(f => ({ ...f, images: updated, image: updated[0] || f.image || '' }));
    }

    const allImages = form.images?.length ? form.images : (form.image ? [form.image] : []);

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', zIndex: 500, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0' }}>
            <div style={{ background: cardBg, border: `1px solid ${t.border}`, borderLeft: `5px solid ${MODULE_COLOR}`, borderRadius: '20px 20px 0 0', padding: '24px 22px', width: '100%', maxWidth: '640px', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 -12px 60px rgba(0,0,0,0.4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div>
                        <div style={{ fontSize: '17px', fontWeight: '800', color: dark ? '#F8FAFC' : '#111827' }}>{editing ? 'Edit Project' : 'New Project'}</div>
                        <div style={{ fontSize: '12px', color: t.textMuted, marginTop: '2px' }}>{editing ? 'Update project details' : 'Add a new portfolio project'}</div>
                    </div>
                    <button onClick={onCancel} style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(100,116,139,0.12)', border: 'none', color: t.textMuted, cursor: 'pointer', fontSize: '18px', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                        <label className="adm-label">Project Title *</label>
                        <input className="adm-input" placeholder="e.g. E-Commerce Platform" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    </div>
                    <div>
                        <label className="adm-label">Description</label>
                        <textarea className="adm-input" rows={3} placeholder="Describe what this project does..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    </div>
                    <div>
                        <label className="adm-label">Cover Image</label>
                        <input className="adm-input" placeholder="images/project.png or https://..." value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
                    </div>
                    <div>
                        <label className="adm-label">Gallery Images</label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                            <input className="adm-input" style={{ flex: 1 }} placeholder="images/photo1.png, images/photo2.png" value={(form.images || []).join(', ')} onChange={e => setForm({ ...form, images: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
                                <>
                                    <input ref={imgRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleImagesUpload} />
                                    <button onClick={() => imgRef.current?.click()} disabled={uploading} style={{ padding: '9px 14px', borderRadius: '10px', border: `1px solid ${t.border}`, background: dark ? 'rgba(255,255,255,0.06)' : '#F8FAFB', color: t.text, cursor: 'pointer', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {uploading ? '⏳' : '📁'} Upload
                                    </button>
                                </>
                        </div>
                        {uploadErr && (
                            <div style={{ fontSize: '12px', color: '#EF4444', marginBottom: '6px', padding: '6px 10px', background: 'rgba(239,68,68,0.1)', borderRadius: '6px' }}>{uploadErr}</div>
                        )}
                        {allImages.length > 0 && (
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {allImages.map((img, i) => (
                                    <div key={i} style={{ position: 'relative' }}>
                                        <img src={imgUrl(img)} alt="" style={{ height: '70px', borderRadius: '10px', objectFit: 'cover', border: i === 0 ? `2px solid ${MODULE_COLOR}` : `1px solid ${t.border}` }} />
                                        <button onClick={() => removeImage(img)} style={{ position: 'absolute', top: '-6px', right: '-6px', width: '20px', height: '20px', borderRadius: '50%', background: '#EF4444', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                                        {i === 0 && <span style={{ position: 'absolute', bottom: '2px', left: '2px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '9px', padding: '1px 5px', borderRadius: '4px' }}>Cover</span>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="adm-label">Tags (comma separated)</label>
                        <input className="adm-input" placeholder="React, Laravel, Node.js, TailwindCSS" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label className="adm-label">Live URL</label>
                            <input className="adm-input" placeholder="https://example.com" value={form.live_url} onChange={e => setForm({ ...form, live_url: e.target.value })} />
                        </div>
                        <div>
                            <label className="adm-label">GitHub URL</label>
                            <input className="adm-input" placeholder="https://github.com/..." value={form.github_url} onChange={e => setForm({ ...form, github_url: e.target.value })} />
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                    <button className="adm-btn-ghost" onClick={onCancel}>Cancel</button>
                    <button className="adm-btn-primary" onClick={onSave}>{editing ? 'Update Project' : 'Create Project'}</button>
                </div>
            </div>
        </div>
    );
}

/* ── Mobile project card ── */
function ProjectCard({ p, selected, onToggle, onEdit, onRemove, imgUrl, dark, t }) {
    const cardBg = dark ? '#1E293B' : '#FFFFFF';
    const cardBorder = dark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #E8ECF2';
    return (
        <div style={{ background: cardBg, border: selected ? `1px solid ${MODULE_COLOR}` : cardBorder, borderLeft: `4px solid ${MODULE_COLOR}`, borderRadius: '14px', overflow: 'hidden', boxShadow: dark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.06)', transition: 'all .2s', display: 'flex', flexDirection: 'column' }}>
            {/* Image */}
            {imgUrl(p.image)
                ? <img src={imgUrl(p.image)} alt={p.title} style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block', flexShrink: 0 }} />
                : <div style={{ width: '100%', height: '80px', flexShrink: 0, background: 'rgba(124,58,237,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>📁</div>
            }
            <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                {/* Title */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                    <input type="checkbox" checked={selected} onChange={onToggle} style={{ accentColor: MODULE_COLOR, width: '15px', height: '15px', marginTop: '3px', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: dark ? '#F8FAFC' : '#111827', lineHeight: 1.3 }}>{p.title}</div>
                        <div style={{ fontSize: '12px', color: t.textMuted, marginTop: '3px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</div>
                    </div>
                </div>
                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px', marginTop: 'auto' }}>
                    {(p.tags || []).slice(0, 4).map(tag => {
                        const { bg, color } = tagColor(tag);
                        return <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', background: bg, color }}>{tag}</span>;
                    })}
                    {(p.tags || []).length > 4 && <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 7px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', background: dark ? 'rgba(51,65,85,0.5)' : 'rgba(148,163,184,0.15)', color: t.textMuted }}>+{p.tags.length - 4}</span>}
                </div>
                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    {p.live_url && p.live_url !== '#' && (
                        <a href={p.live_url} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '8px', borderRadius: '9px', background: 'rgba(6,182,212,0.12)', border: 'none', color: '#06B6D4', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', fontWeight: '600' }}>
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                            Live
                        </a>
                    )}
                    <button onClick={() => onEdit(p)} style={{ flex: 1, padding: '8px', borderRadius: '9px', background: 'rgba(245,158,11,0.12)', border: 'none', color: '#F59E0B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', fontWeight: '600' }}>
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Edit
                    </button>
                    <button onClick={() => onRemove(p.id)} style={{ flex: 1, padding: '8px', borderRadius: '9px', background: 'rgba(239,68,68,0.12)', border: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', fontWeight: '600' }}>
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AdminProjects() {
    const { t, dark } = useTheme();
    const isMobile = useIsMobile(640);
    const blank = { title: '', description: '', image: '', images: [], tags: '', live_url: '', github_url: '' };
    const { data: projects = [], refresh } = useCachedData('projects', () => axios.get('/api/projects').then(r => r.data));
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(blank);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState([]);

    function openCreate() { setEditing(null); setForm(blank); setShowModal(true); }
    function openEdit(p) { setEditing(p.id); setForm({ ...p, tags: p.tags?.join(', ') || '' }); setShowModal(true); }
    function closeModal() { setShowModal(false); setEditing(null); setForm(blank); }

    function save() {
        const data = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
        const req = editing ? axios.put(`/api/projects/${editing}`, data) : axios.post('/api/projects', data);
        req.then(() => { closeModal(); refresh(); });
    }
    function remove(id) {
        if (confirm('Delete this project?')) axios.delete(`/api/projects/${id}`).then(refresh);
    }
    function toggleSelect(id) {
        setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
    }
    function bulkDelete() {
        if (!selected.length || !confirm(`Delete ${selected.length} projects?`)) return;
        Promise.all(selected.map(id => axios.delete(`/api/projects/${id}`))).then(() => { setSelected([]); refresh(); });
    }

    const imgUrl = s => s ? (s.startsWith('http') ? s : '/' + s) : null;
    const filtered = projects.filter(p =>
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.tags?.join(' ').toLowerCase().includes(search.toLowerCase())
    );

    const cardBg = dark ? '#1E293B' : '#FFFFFF';
    const cardShadow = dark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.04)';
    const headerBg = dark ? 'rgba(255,255,255,0.04)' : '#F8F9FB';
    const zebraBg = dark ? 'rgba(255,255,255,0.02)' : '#FAFBFC';

    return (
        <>
            <Head title="Admin – Projects" />
            {showModal && <ProjectModal form={form} setForm={setForm} editing={editing} setEditing={setEditing} onSave={save} onCancel={closeModal} t={t} dark={dark} />}

            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '160px' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: t.textDim, lineHeight: 0 }}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    </span>
                    <input className="adm-input" style={{ paddingLeft: '36px', borderRadius: '50px', fontSize: '13px' }} placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                {selected.length > 0 && (
                    <button className="adm-btn-ghost" onClick={bulkDelete} style={{ borderColor: 'rgba(239,68,68,0.35)', color: '#EF4444', fontSize: '12px', padding: '8px 12px' }}>
                        🗑 Delete {selected.length}
                    </button>
                )}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: t.textMuted, fontWeight: '500', whiteSpace: 'nowrap' }}>{filtered.length} projects</span>
                    <button className="adm-btn-primary" onClick={openCreate} style={{ whiteSpace: 'nowrap' }}>+ New Project</button>
                </div>
            </div>

            {/* ── MOBILE: card grid ── */}
            {isMobile ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filtered.length === 0 && (
                        <div style={{ background: cardBg, borderRadius: '14px', padding: '60px 24px', textAlign: 'center', color: t.textMuted }}>
                            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📁</div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: dark ? '#F8FAFC' : '#111827', marginBottom: '6px' }}>No projects yet</div>
                            <div style={{ fontSize: '12px' }}>Add your first project to get started</div>
                        </div>
                    )}
                    {filtered.map(p => (
                        <ProjectCard
                            key={p.id}
                            p={p}
                            selected={selected.includes(p.id)}
                            onToggle={() => toggleSelect(p.id)}
                            onEdit={openEdit}
                            onRemove={remove}
                            imgUrl={imgUrl}
                            dark={dark}
                            t={t}
                        />
                    ))}
                </div>
            ) : (
                /* ── DESKTOP: table view ── */
                <div style={{
                    background: cardBg,
                    borderRadius: '10px',
                    border: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : '#E8ECF2'}`,
                    borderLeft: `4px solid ${MODULE_COLOR}`,
                    boxShadow: cardShadow,
                    overflow: 'hidden',
                }}>
                    {/* Sticky Header */}
                    <div style={{ display: 'grid', gridTemplateColumns: '36px 68px 1fr 180px 100px', gap: '14px', padding: '14px 22px', background: headerBg, borderBottom: `1px solid ${dark ? 'rgba(51,65,85,0.6)' : 'rgba(229,231,235,0.8)'}`, position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(12px)' }}>
                        <div><input type="checkbox" onChange={e => setSelected(e.target.checked ? filtered.map(p => p.id) : [])} checked={selected.length === filtered.length && filtered.length > 0} style={{ accentColor: MODULE_COLOR, width: '15px', height: '15px' }} /></div>
                        {['Image', 'Project', 'Tags', 'Actions'].map(h => (
                            <div key={h} style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: dark ? '#94A3B8' : '#64748B' }}>{h}</div>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div style={{ padding: '70px', textAlign: 'center', color: t.textMuted }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '28px' }}>📁</div>
                            <div style={{ fontSize: '15px', fontWeight: '600', color: dark ? '#F8FAFC' : '#111827', marginBottom: '6px' }}>No projects yet</div>
                            <div style={{ fontSize: '13px', color: t.textMuted }}>Add your first project to get started</div>
                        </div>
                    )}

                    {filtered.map((p, i) => (
                        <div key={p.id}
                            style={{ display: 'grid', gridTemplateColumns: '36px 68px 1fr 180px 100px', gap: '14px', padding: '0 22px', minHeight: '66px', alignItems: 'center', borderBottom: `1px solid ${dark ? 'rgba(51,65,85,0.4)' : 'rgba(229,231,235,0.6)'}`, background: selected.includes(p.id) ? `rgba(124,58,237,0.06)` : (i % 2 === 1 ? zebraBg : 'transparent'), transition: 'all 0.2s ease' }}
                            onMouseEnter={e => { if (!selected.includes(p.id)) e.currentTarget.style.background = dark ? 'rgba(124,58,237,0.08)' : 'rgba(124,58,237,0.04)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = selected.includes(p.id) ? 'rgba(124,58,237,0.06)' : (i % 2 === 1 ? zebraBg : 'transparent'); }}>
                            <div><input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} style={{ accentColor: MODULE_COLOR, width: '15px', height: '15px' }} /></div>
                            <div>
                                {imgUrl(p.image)
                                    ? <img src={imgUrl(p.image)} alt={p.title} style={{ width: '56px', height: '42px', objectFit: 'cover', borderRadius: '10px', border: `1px solid ${dark ? 'rgba(51,65,85,0.6)' : 'rgba(229,231,235,0.8)'}` }} />
                                    : <div style={{ width: '56px', height: '42px', background: 'rgba(124,58,237,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📁</div>}
                            </div>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: dark ? '#F8FAFC' : '#111827', lineHeight: 1.3 }}>{p.title}</div>
                                <div style={{ fontSize: '12px', color: t.textMuted, marginTop: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '260px', lineHeight: 1.4 }}>{p.description}</div>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                {(p.tags || []).slice(0, 3).map(tag => {
                                    const { bg, color } = tagColor(tag);
                                    return <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '700', background: bg, color }}>{tag}</span>;
                                })}
                                {(p.tags || []).length > 3 && <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 7px', borderRadius: '6px', fontSize: '10px', fontWeight: '600', background: dark ? 'rgba(51,65,85,0.5)' : 'rgba(148,163,184,0.15)', color: t.textMuted }}>+{p.tags.length - 3}</span>}
                            </div>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                {p.live_url && p.live_url !== '#' && (
                                    <a href={p.live_url} target="_blank" rel="noreferrer" title="Preview" style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(6,182,212,0.12)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06B6D4', textDecoration: 'none', transition: 'all 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(6,182,212,0.2)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(6,182,212,0.12)'}>
                                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                    </a>
                                )}
                                <button onClick={() => openEdit(p)} title="Edit" style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(245,158,11,0.12)', border: 'none', color: '#F59E0B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.22)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,158,11,0.12)'}>
                                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                </button>
                                <button onClick={() => remove(p.id)} title="Delete" style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(239,68,68,0.12)', border: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.22)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}>
                                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

AdminProjects.layout = page => <AdminLayout title="Projects">{page}</AdminLayout>;
