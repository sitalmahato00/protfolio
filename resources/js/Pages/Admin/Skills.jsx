import AdminLayout, { useTheme } from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import { useCachedData } from '@/hooks/useCachedData';

const MODULE_COLOR = '#3B82F6';

function catColor(cat) {
    const c = (cat || '').toLowerCase();
    if (c.includes('front')) return '#3B82F6';
    if (c.includes('back')) return '#7C3AED';
    if (c.includes('data') || c.includes('db') || c.includes('base')) return '#10B981';
    if (c.includes('design') || c.includes('ui') || c.includes('ux')) return '#EC4899';
    if (c.includes('tool') || c.includes('dev') || c.includes('ops')) return '#F59E0B';
    if (c.includes('mobile')) return '#06B6D4';
    return '#64748B';
}

function SkillCard({ skill, onEdit, onRemove, t, dark }) {
    const color = catColor(skill.category);
    const level = skill.level || 75;
    const cardBg = dark ? '#1E293B' : '#FFFFFF';
    const cardShadow = dark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.04)';
    return (
        <div style={{
            background: cardBg,
            borderRadius: '10px',
            padding: '14px 16px',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : '#E8ECF2'}`,
            borderLeft: `4px solid ${color}`,
            boxShadow: cardShadow,
            transition: 'border-color .15s',
            cursor: 'default',
        }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = `0 8px 28px rgba(0,0,0,0.12), 0 0 0 1px ${color}25`;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = cardShadow;
            }}>
            {/* Top row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                    {skill.icon || '💡'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: dark ? '#F8FAFC' : '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{skill.name}</div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', background: `${color}15`, color: color, marginTop: '2px' }}>
                        {skill.category}
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                    <button onClick={() => onEdit(skill)} style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(245,158,11,0.12)', border: 'none', color: '#F59E0B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.22)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,158,11,0.12)'}>
                        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button onClick={() => onRemove(skill.id)} style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(239,68,68,0.12)', border: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.22)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}>
                        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
            </div>
            {/* Progress bar */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '10px', color: t.textMuted, fontWeight: '600' }}>Proficiency</span>
                    <span style={{ fontSize: '10px', fontWeight: '700', color }}>
                        {level >= 90 ? 'Expert' : level >= 70 ? 'Advanced' : level >= 50 ? 'Intermediate' : 'Learning'}
                    </span>
                </div>
                <div style={{ height: '5px', borderRadius: '3px', background: dark ? 'rgba(148,163,184,0.15)' : 'rgba(148,163,184,0.2)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${level}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)`, borderRadius: '3px', transition: 'width 0.8s ease', boxShadow: `0 0 6px ${color}50` }} />
                </div>
            </div>
        </div>
    );
}

function SkillModal({ form, setForm, editing, onSave, onCancel, t, dark }) {
    const cardBg = dark ? '#1E293B' : '#FFFFFF';
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: cardBg, border: `1px solid ${t.border}`, borderLeft: `5px solid ${MODULE_COLOR}`, borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '420px', boxShadow: '0 24px 80px rgba(0,0,0,0.55)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: dark ? '#F8FAFC' : '#111827' }}>{editing ? 'Edit Skill' : 'Add Skill'}</div>
                    <button onClick={onCancel} style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(100,116,139,0.12)', border: 'none', color: t.textMuted, cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                        <label className="adm-label">Skill Name *</label>
                        <input className="adm-input" placeholder="e.g. React.js" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="adm-label">Category</label>
                        <input className="adm-input" placeholder="e.g. Frontend, Backend, Database" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                    </div>
                    <div>
                        <label className="adm-label">Icon Emoji</label>
                        <input className="adm-input" placeholder="e.g. ⚛️  🐘  🎨" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px', justifyContent: 'flex-end' }}>
                        <button className="adm-btn-ghost" onClick={onCancel}>Cancel</button>
                        <button className="adm-btn-primary" onClick={onSave}>{editing ? 'Update' : 'Add Skill'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminSkills() {
    const { t, dark } = useTheme();
    const blank = { category: '', name: '', icon: '' };
    const { data: skills = [], refresh } = useCachedData('skills', () => axios.get('/api/skills').then(r => r.data));
    const [form, setForm] = useState(blank);
    const [editing, setEditing] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filterCat, setFilterCat] = useState('All');
    const [search, setSearch] = useState('');

    function openCreate() { setEditing(null); setForm(blank); setShowModal(true); }
    function openEdit(s) { setEditing(s.id); setForm({ category: s.category, name: s.name, icon: s.icon || '' }); setShowModal(true); }
    function closeModal() { setShowModal(false); setEditing(null); setForm(blank); }
    function save() {
        const req = editing ? axios.put(`/api/skills/${editing}`, form) : axios.post('/api/skills', form);
        req.then(() => { closeModal(); refresh(); });
    }
    function remove(id) { if (confirm('Delete this skill?')) axios.delete(`/api/skills/${id}`).then(refresh); }

    const categories = ['All', ...Array.from(new Set(skills.map(s => s.category).filter(Boolean)))];
    const filtered = skills.filter(s => {
        const matchCat = filterCat === 'All' || s.category === filterCat;
        const matchSearch = s.name?.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });
    const grouped = filtered.reduce((acc, s) => { (acc[s.category] ??= []).push(s); return acc; }, {});

    return (
        <>
            <Head title="Admin – Skills" />
            {showModal && <SkillModal form={form} setForm={setForm} editing={editing} onSave={save} onCancel={closeModal} t={t} dark={dark} />}

            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', minWidth: '220px' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: t.textDim, lineHeight: 0 }}>
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    </span>
                    <input className="adm-input" style={{ paddingLeft: '34px', borderRadius: '50px', fontSize: '13px' }} placeholder="Search skills…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', flex: 1 }}>
                    {categories.map(c => {
                        const active = filterCat === c;
                        const color = c === 'All' ? MODULE_COLOR : catColor(c);
                        return (
                            <button key={c} onClick={() => setFilterCat(c)}
                                style={{ padding: '6px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', border: `1px solid ${active ? color : dark ? 'rgba(51,65,85,0.6)' : 'rgba(229,231,235,0.8)'}`, background: active ? `${color}15` : 'transparent', color: active ? color : t.textMuted, transition: 'all 0.2s' }}>
                                {c}
                            </button>
                        );
                    })}
                </div>
                <button className="adm-btn-primary" onClick={openCreate}>+ Add Skill</button>
            </div>

            {/* Grouped cards */}
            {Object.entries(grouped).map(([cat, items]) => {
                const color = catColor(cat);
                return (
                    <div key={cat} style={{ marginBottom: '28px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', paddingLeft: '2px' }}>
                            <div style={{ width: '4px', height: '18px', borderRadius: '2px', background: `linear-gradient(180deg, ${color}, ${color}80)` }} />
                            <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: dark ? '#F8FAFC' : '#111827' }}>{cat}</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: `${color}15`, color }}>{items.length}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                            {items.map(s => <SkillCard key={s.id} skill={s} onEdit={openEdit} onRemove={remove} t={t} dark={dark} />)}
                        </div>
                    </div>
                );
            })}

            {filtered.length === 0 && (
                <div style={{ background: dark ? '#1E293B' : '#FFFFFF', borderRadius: '14px', padding: '70px', textAlign: 'center', border: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : '#E5E7EB'}`, boxShadow: dark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>💡</div>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: dark ? '#F1F5F9' : '#111827', marginBottom: '6px' }}>No skills found</div>
                    <div style={{ color: dark ? '#CBD5E1' : '#475569', fontSize: '13px' }}>Add your first skill to showcase your expertise</div>
                </div>
            )}
        </>
    );
}

AdminSkills.layout = page => <AdminLayout title="Skills">{page}</AdminLayout>;
