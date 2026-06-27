import AdminLayout, { useTheme } from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import { useCachedData } from '@/hooks/useCachedData';

function ExperienceModal({ form, setForm, editing, onSave, onCancel, t, dark }) {
    const bg = dark ? '#1E293B' : '#FFFFFF';
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: bg, border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : '#E5E7EB'}`, borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ fontSize: '17px', fontWeight: '700', color: dark ? '#F1F5F9' : '#111827' }}>{editing ? 'Edit Entry' : 'New Entry'}</div>
                    <button onClick={onCancel} style={{ width: '30px', height: '30px', borderRadius: '8px', background: dark ? 'rgba(255,255,255,0.06)' : '#F3F4F6', border: 'none', color: t.textMuted, cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                        <label className="adm-label">Type</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            {[{ v: 'work', label: '💼 Work Experience' }, { v: 'education', label: '🎓 Education' }].map(opt => (
                                <button key={opt.v} onClick={() => setForm({ ...form, type: opt.v })}
                                    style={{ padding: '10px', borderRadius: '10px', border: `1px solid ${form.type === opt.v ? t.accent : (dark ? 'rgba(255,255,255,0.1)' : '#E5E7EB')}`, background: form.type === opt.v ? `${t.accent}18` : 'transparent', color: form.type === opt.v ? t.accent : t.textMuted, fontWeight: '600', fontSize: '13px', cursor: 'pointer', transition: 'all .15s' }}>
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

// ─── Timeline Item ─────────────────────────────────────────────────────────────
function TimelineItem({ entry, onEdit, onRemove, color, t, dark }) {
    const cardBg     = dark ? '#1E293B' : '#FFFFFF';
    const cardBorder = dark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #E8ECF0';
    const cardShadow = dark ? '0 2px 8px rgba(0,0,0,0.35)' : '0 2px 8px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.04)';
    return (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            {/* Timeline spine */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `${color}20`, border: `2px solid ${color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', zIndex: 1, flexShrink: 0 }}>
                    {entry.type === 'work' ? '💼' : '🎓'}
                </div>
                <div style={{ width: '2px', flex: 1, background: `${color}25`, marginTop: '4px' }} />
            </div>

            {/* Card */}
            <div style={{ flex: 1, background: cardBg, border: cardBorder, borderRadius: '12px', padding: '18px 20px', boxShadow: cardShadow, transition: 'transform .18s ease', marginBottom: '4px' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: dark ? '#F1F5F9' : '#111827', lineHeight: 1.3 }}>{entry.title}</div>
                        {entry.subtitle && (
                            <div style={{ fontSize: '13px', color: color, fontWeight: '600', marginTop: '3px' }}>{entry.subtitle}</div>
                        )}
                        {entry.date_range && (
                            <div style={{ fontSize: '11px', color: t.textMuted, marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                {entry.date_range}
                            </div>
                        )}
                        {entry.description && (
                            <div style={{ fontSize: '13px', color: dark ? '#CBD5E1' : '#475569', marginTop: '8px', lineHeight: 1.6 }}>{entry.description}</div>
                        )}
                        {(entry.tags || []).length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '10px' }}>
                                {entry.tags.map(tag => (
                                    <span key={tag} style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '5px', background: `${color}15`, color: color }}>{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                        <button onClick={() => onEdit(entry)} style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(245,158,11,0.12)', border: 'none', color: '#F59E0B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.22)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,158,11,0.12)'}>
                            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button onClick={() => onRemove(entry.id)} style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(239,68,68,0.12)', border: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.22)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}>
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
    const { t, dark } = useTheme();
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
        const data = { ...form, tags: form.tags.split(',').map(s => s.trim()).filter(Boolean) };
        const req = editing ? axios.put(`/api/experiences/${editing}`, data) : axios.post('/api/experiences', data);
        req.then(() => { closeModal(); refresh(); });
    }
    function remove(id) { if (confirm('Delete?')) axios.delete(`/api/experiences/${id}`).then(refresh); }

    const work      = experiences.filter(e => e.type === 'work');
    const education = experiences.filter(e => e.type === 'education');
    const shown     = tab === 'work' ? work : education;
    const color     = tab === 'work' ? '#6366F1' : '#8B5CF6';

    const tabActive = {
        background: `${t.accent}15`,
        border: `1px solid ${t.accent}`,
        color: t.accent,
    };
    const tabInactive = {
        background: 'transparent',
        border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : '#E5E7EB'}`,
        color: t.textMuted,
    };

    return (
        <>
            <Head title="Admin – Journey" />
            {showModal && <ExperienceModal form={form} setForm={setForm} editing={editing} onSave={save} onCancel={closeModal} t={t} dark={dark} />}

            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {[{ v: 'work', label: '💼 Work', count: work.length }, { v: 'education', label: '🎓 Education', count: education.length }].map(opt => (
                        <button key={opt.v} onClick={() => setTab(opt.v)}
                            style={{ padding: '8px 16px', borderRadius: '9px', fontWeight: '600', fontSize: '13px', cursor: 'pointer', transition: 'all .15s', display: 'flex', alignItems: 'center', gap: '6px', ...(tab === opt.v ? tabActive : tabInactive) }}>
                            {opt.label}
                            <span style={{ fontSize: '11px', fontWeight: '700', padding: '1px 7px', borderRadius: '20px', background: tab === opt.v ? `${t.accent}25` : (dark ? 'rgba(255,255,255,0.08)' : '#F1F5F9'), color: tab === opt.v ? t.accent : t.textMuted }}>
                                {opt.count}
                            </span>
                        </button>
                    ))}
                </div>
                <button className="adm-btn-primary" onClick={openCreate}>+ Add Entry</button>
            </div>

            {/* Empty state */}
            {shown.length === 0 && (
                <div style={{ background: dark ? '#1E293B' : '#FFFFFF', border: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : '#E5E7EB'}`, borderRadius: '14px', padding: '60px', textAlign: 'center', boxShadow: dark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>{tab === 'work' ? '💼' : '🎓'}</div>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: dark ? '#F1F5F9' : '#111827', marginBottom: '8px' }}>No {tab} entries yet</div>
                    <div style={{ color: t.textMuted, fontSize: '13px', marginBottom: '20px' }}>Add your {tab === 'work' ? 'work experience' : 'education'} to build your timeline</div>
                    <button className="adm-btn-primary" onClick={openCreate}>Add Entry</button>
                </div>
            )}

            {/* Timeline */}
            <div style={{ maxWidth: '760px' }}>
                {shown.map(entry => (
                    <TimelineItem key={entry.id} entry={entry} onEdit={openEdit} onRemove={remove} color={color} t={t} dark={dark} />
                ))}
            </div>
        </>
    );
}

AdminExperiences.layout = page => <AdminLayout title="Journey">{page}</AdminLayout>;
