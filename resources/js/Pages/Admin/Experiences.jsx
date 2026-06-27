import AdminLayout, { useTheme } from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import { useCachedData } from '@/hooks/useCachedData';

function ExperienceModal({ form, setForm, editing, onSave, onCancel, t }) {
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: t.cardSolid, border: `1px solid ${t.border}`, borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: t.text }}>{editing ? 'Edit Entry' : 'New Entry'}</div>
                    <button onClick={onCancel} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', fontSize: '20px' }}>×</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                        <label className="adm-label">Type</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            {[{ v: 'work', label: '💼 Work Experience' }, { v: 'education', label: '🎓 Education' }].map(opt => (
                                <button key={opt.v} onClick={() => setForm({ ...form, type: opt.v })}
                                    style={{ padding: '10px', borderRadius: '10px', border: `1px solid ${form.type === opt.v ? t.accent : t.border}`, background: form.type === opt.v ? `${t.accent}18` : 'transparent', color: form.type === opt.v ? t.accent : t.textMuted, fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={{ gridColumn: '1/-1' }}>
                            <label className="adm-label">Title *</label>
                            <input className="adm-input" placeholder="e.g. Full Stack Developer" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                        </div>
                        <div>
                            <label className="adm-label">Organization</label>
                            <input className="adm-input" placeholder="Company / College name" value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} />
                        </div>
                        <div>
                            <label className="adm-label">Date Range</label>
                            <input className="adm-input" placeholder="Aug 2023 — Present" value={form.date_range} onChange={e => setForm({ ...form, date_range: e.target.value })} />
                        </div>
                        <div style={{ gridColumn: '1/-1' }}>
                            <label className="adm-label">Description</label>
                            <textarea className="adm-input" rows={3} style={{ resize: 'vertical' }} placeholder="What you did / learned..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                        </div>
                        <div style={{ gridColumn: '1/-1' }}>
                            <label className="adm-label">Tags (comma separated)</label>
                            <input className="adm-input" placeholder="React, Laravel, PHP, MySQL" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button className="adm-btn-ghost" onClick={onCancel}>Cancel</button>
                        <button className="adm-btn-primary" onClick={onSave}>{editing ? 'Update' : 'Add Entry'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Timeline Item ────────────────────────────────────────────────────────────
function TimelineItem({ entry, onEdit, onRemove, color, t }) {
    return (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `${color}20`, border: `2px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', zIndex: 1 }}>
                    {entry.type === 'work' ? '💼' : '🎓'}
                </div>
                <div style={{ width: '2px', flex: 1, background: `${color}20`, marginTop: '4px' }} />
            </div>
            <div className="adm-card" style={{ flex: 1, padding: '18px 20px', marginBottom: '0' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: t.text }}>{entry.title}</div>
                        {entry.subtitle && <div style={{ fontSize: '12px', color: color, fontWeight: '600', marginTop: '2px' }}>{entry.subtitle}</div>}
                        {entry.date_range && (
                            <div style={{ fontSize: '11px', color: t.textMuted, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                {entry.date_range}
                            </div>
                        )}
                        {entry.description && <div style={{ fontSize: '13px', color: t.textMuted, marginTop: '8px', lineHeight: 1.5 }}>{entry.description}</div>}
                        {(entry.tags || []).length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '10px' }}>
                                {entry.tags.map(tag => (
                                    <span key={tag} className="adm-badge" style={{ fontSize: '10px', background: `${color}15`, color: color }}>{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                        <button onClick={() => onEdit(entry)} style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(245,158,11,0.12)', border: 'none', color: '#F59E0B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button onClick={() => onRemove(entry.id)} style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(239,68,68,0.12)', border: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminExperiences() {
    const { t } = useTheme();
    const blank = { type: 'work', title: '', subtitle: '', date_range: '', description: '', tags: '' };
    const { data: experiences = [], refresh } = useCachedData('experiences', () => axios.get('/api/experiences').then(r => r.data));
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(blank);
    const [showModal, setShowModal] = useState(false);
    const [tab, setTab] = useState('work');
    function openCreate() { setEditing(null); setForm({ ...blank, type: tab }); setShowModal(true); }
    function openEdit(e) { setEditing(e.id); setForm({ ...e, tags: e.tags?.join(', ') || '' }); setShowModal(true); }
    function closeModal() { setShowModal(false); setEditing(null); setForm(blank); }
    function save() {
        const data = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
        const req = editing ? axios.put(`/api/experiences/${editing}`, data) : axios.post('/api/experiences', data);
        req.then(() => { closeModal(); refresh(); });
    }
    function remove(id) { if (confirm('Delete?')) axios.delete(`/api/experiences/${id}`).then(refresh); }

    const work = experiences.filter(e => e.type === 'work');
    const education = experiences.filter(e => e.type === 'education');
    const shown = tab === 'work' ? work : education;
    const color = tab === 'work' ? '#6366F1' : '#8B5CF6';

    return (
        <AdminLayout title="Journey">
            <Head title="Admin – Journey" />
            {showModal && <ExperienceModal form={form} setForm={setForm} editing={editing} onSave={save} onCancel={closeModal} t={t} />}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {[{ v: 'work', label: '💼 Work', count: work.length }, { v: 'education', label: '🎓 Education', count: education.length }].map(opt => (
                        <button key={opt.v} onClick={() => setTab(opt.v)}
                            style={{ padding: '9px 18px', borderRadius: '10px', border: `1px solid ${tab === opt.v ? t.accent : t.border}`, background: tab === opt.v ? `${t.accent}18` : 'transparent', color: tab === opt.v ? t.accent : t.textMuted, fontWeight: '600', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {opt.label} <span className="adm-badge adm-badge-blue" style={{ fontSize: '10px' }}>{opt.count}</span>
                        </button>
                    ))}
                </div>
                <button className="adm-btn-primary" onClick={openCreate}>+ Add Entry</button>
            </div>

            {shown.length === 0 && (
                <div className="adm-card" style={{ padding: '60px', textAlign: 'center' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>{tab === 'work' ? '💼' : '🎓'}</div>
                    <div style={{ color: t.textMuted, marginBottom: '16px' }}>No {tab} entries yet.</div>
                    <button className="adm-btn-primary" onClick={openCreate}>Add Entry</button>
                </div>
            )}

            <div style={{ maxWidth: '760px' }}>
                {shown.map(entry => (
                    <TimelineItem key={entry.id} entry={entry} onEdit={openEdit} onRemove={remove} color={color} t={t} />
                ))}
            </div>
        </AdminLayout>
    );
}
