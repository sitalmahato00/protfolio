import AdminLayout, { useTheme } from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import { useCachedData } from '@/hooks/useCachedData';

// ─── Skill Card ───────────────────────────────────────────────────────────────
function SkillCard({ skill, onEdit, onRemove, t }) {
    return (
        <div className="adm-card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'default' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                {skill.icon || '💡'}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: t.text }}>{skill.name}</div>
                <div style={{ fontSize: '11px', color: t.textMuted, marginTop: '1px' }}>{skill.category}</div>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
                <button onClick={() => onEdit(skill)} style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(245,158,11,0.12)', border: 'none', color: '#F59E0B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button onClick={() => onRemove(skill.id)} style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(239,68,68,0.12)', border: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
        </div>
    );
}

// ─── Skill Modal ──────────────────────────────────────────────────────────────
function SkillModal({ form, setForm, editing, onSave, onCancel, t }) {
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: t.cardSolid, border: `1px solid ${t.border}`, borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '420px', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: t.text }}>{editing ? 'Edit Skill' : 'Add Skill'}</div>
                    <button onClick={onCancel} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', fontSize: '20px' }}>×</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                        <label className="adm-label">Skill Name *</label>
                        <input className="adm-input" placeholder="e.g. React.js" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="adm-label">Category</label>
                        <input className="adm-input" placeholder="e.g. Frontend, Backend, DevOps" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
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

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminSkills() {
    const { t } = useTheme();
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
        <AdminLayout title="Skills">
            <Head title="Admin – Skills" />
            {showModal && <SkillModal form={form} setForm={setForm} editing={editing} onSave={save} onCancel={closeModal} t={t} />}

            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', minWidth: '200px' }}>
                    <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: t.textDim }}>
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    </div>
                    <input className="adm-input" style={{ paddingLeft: '34px', borderRadius: '50px' }} placeholder="Search skills…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {categories.map(c => (
                        <button key={c} onClick={() => setFilterCat(c)}
                            style={{ padding: '7px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', border: `1px solid ${filterCat === c ? t.accent : t.border}`, background: filterCat === c ? `${t.accent}20` : 'transparent', color: filterCat === c ? t.accent : t.textMuted, transition: 'all 0.15s' }}>
                            {c}
                        </button>
                    ))}
                </div>
                <div style={{ marginLeft: 'auto' }}>
                    <button className="adm-btn-primary" onClick={openCreate}>+ Add Skill</button>
                </div>
            </div>

            {/* Grouped cards */}
            {Object.entries(grouped).map(([cat, items]) => (
                <div key={cat} style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: t.accent }}>{cat}</span>
                        <span className="adm-badge adm-badge-blue">{items.length}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                        {items.map(s => <SkillCard key={s.id} skill={s} onEdit={openEdit} onRemove={remove} t={t} />)}
                    </div>
                </div>
            ))}

            {filtered.length === 0 && (
                <div className="adm-card" style={{ padding: '60px', textAlign: 'center' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>💡</div>
                    <div style={{ color: t.textMuted }}>No skills found. Add your first skill.</div>
                </div>
            )}
        </AdminLayout>
    );
}
