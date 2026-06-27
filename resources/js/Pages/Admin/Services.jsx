import AdminLayout, { useTheme } from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import { useCachedData } from '@/hooks/useCachedData';

function ServiceModal({ form, setForm, editing, onSave, onCancel, t }) {
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: t.cardSolid, border: `1px solid ${t.border}`, borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: t.text }}>{editing ? 'Edit Service' : 'New Service'}</div>
                    <button onClick={onCancel} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', fontSize: '20px' }}>×</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '10px' }}>
                        <div>
                            <label className="adm-label">Service Title *</label>
                            <input className="adm-input" placeholder="e.g. Web Development" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                        </div>
                        <div>
                            <label className="adm-label">Icon</label>
                            <input className="adm-input" placeholder="🖥️" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} style={{ textAlign: 'center', fontSize: '20px' }} />
                        </div>
                    </div>
                    <div>
                        <label className="adm-label">Description</label>
                        <textarea className="adm-input" rows={3} style={{ resize: 'vertical' }} placeholder="Short description of this service..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    </div>
                    <div>
                        <label className="adm-label">Features (one per line)</label>
                        <textarea className="adm-input" rows={5} style={{ resize: 'vertical', fontFamily: 'inherit' }} placeholder={"Responsive design\nSEO optimization\nFast delivery"} value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} />
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px 14px', borderRadius: '10px', background: t.navHover, border: `1px solid ${t.border}` }}>
                        <input type="checkbox" checked={form.is_popular} onChange={e => setForm({ ...form, is_popular: e.target.checked })} style={{ accentColor: '#6366F1', width: '16px', height: '16px' }} />
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: t.text }}>Mark as Popular</div>
                            <div style={{ fontSize: '11px', color: t.textMuted }}>Shows a Popular badge on the portfolio</div>
                        </div>
                    </label>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button className="adm-btn-ghost" onClick={onCancel}>Cancel</button>
                        <button className="adm-btn-primary" onClick={onSave}>{editing ? 'Update' : 'Create Service'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminServices() {
    const { t } = useTheme();
    const blank = { title: '', description: '', icon: '', features: '', is_popular: false };
    const { data: services = [], refresh } = useCachedData('services', () => axios.get('/api/services').then(r => r.data));
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(blank);
    const [showModal, setShowModal] = useState(false);
    function openCreate() { setEditing(null); setForm(blank); setShowModal(true); }
    function openEdit(s) { setEditing(s.id); setForm({ ...s, features: s.features?.join('\n') || '' }); setShowModal(true); }
    function closeModal() { setShowModal(false); setEditing(null); setForm(blank); }
    function save() {
        const data = { ...form, features: form.features.split('\n').map(f => f.trim()).filter(Boolean) };
        const req = editing ? axios.put(`/api/services/${editing}`, data) : axios.post('/api/services', data);
        req.then(() => { closeModal(); refresh(); });
    }
    function remove(id) { if (confirm('Delete this service?')) axios.delete(`/api/services/${id}`).then(refresh); }

    return (
        <AdminLayout title="Services">
            <Head title="Admin – Services" />
            {showModal && <ServiceModal form={form} setForm={setForm} editing={editing} onSave={save} onCancel={closeModal} t={t} />}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                    <span style={{ fontSize: '13px', color: t.textMuted }}>{services.length} services configured</span>
                </div>
                <button className="adm-btn-primary" onClick={openCreate}>+ New Service</button>
            </div>

            {services.length === 0 && (
                <div className="adm-card" style={{ padding: '60px', textAlign: 'center' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>🛠️</div>
                    <div style={{ color: t.textMuted, marginBottom: '16px' }}>No services yet. Add what you offer.</div>
                    <button className="adm-btn-primary" onClick={openCreate}>Add First Service</button>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {services.map(s => (
                    <div key={s.id} className="adm-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                        {s.is_popular && (
                            <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                                <span className="adm-badge adm-badge-orange">⭐ Popular</span>
                            </div>
                        )}
                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '14px' }}>
                            {s.icon || '🛠️'}
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: t.text, marginBottom: '6px' }}>{s.title}</div>
                        <div style={{ fontSize: '13px', color: t.textMuted, marginBottom: '14px', lineHeight: 1.5 }}>{s.description}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '18px' }}>
                            {(s.features || []).slice(0, 4).map((f, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: t.textMuted }}>
                                    <span style={{ color: '#10B981', fontWeight: '700' }}>✓</span> {f}
                                </div>
                            ))}
                            {(s.features || []).length > 4 && (
                                <div style={{ fontSize: '11px', color: t.accent }}>+{s.features.length - 4} more features</div>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', paddingTop: '14px', borderTop: `1px solid ${t.border}` }}>
                            <button onClick={() => openEdit(s)} className="adm-btn-ghost" style={{ flex: 1, padding: '8px', fontSize: '12px' }}>Edit</button>
                            <button onClick={() => remove(s.id)} style={{ padding: '8px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
