import AdminLayout, { useTheme } from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useState, useRef } from 'react';
import axios from 'axios';
import { useCachedData } from '@/hooks/useCachedData';

function ServiceModal({ form, setForm, editing, setEditing, onSave, onCancel, t, dark }) {
    const bg = dark ? '#1E293B' : '#FFFFFF';
    const [uploading, setUploading] = useState(false);
    const [uploadErr, setUploadErr] = useState('');
    const imgRef = useRef(null);
    const imgUrl = s => s ? (s.startsWith('http') ? s : '/' + s) : null;

    async function handleIconUpload(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setUploadErr('');
        let serviceId = editing;
        if (!serviceId) {
            try {
                const data = { ...form };
                const res = await axios.post('/api/services', data);
                serviceId = res.data.id;
                setEditing(serviceId);
                setForm(f => ({ ...f, icon: res.data.icon || f.icon }));
            } catch (err) {
                const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to create service';
                setUploadErr(msg);
                setUploading(false);
                return;
            }
        }
        const fd = new FormData();
        fd.append('icon', file);
        try {
            const res = await axios.post(`/api/services/${serviceId}/icon`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            setForm(f => ({ ...f, icon: res.data.icon }));
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Upload failed';
            setUploadErr(msg);
        }
        finally { setUploading(false); if (imgRef.current) imgRef.current.value = ''; }
    }

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: bg, border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : '#E5E7EB'}`, borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ fontSize: '17px', fontWeight: '700', color: dark ? '#F1F5F9' : '#111827' }}>{editing ? 'Edit Service' : 'New Service'}</div>
                    <button onClick={onCancel} style={{ width: '30px', height: '30px', borderRadius: '8px', background: dark ? 'rgba(255,255,255,0.06)' : '#F3F4F6', border: 'none', color: t.textMuted, cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                        <label className="adm-label">Service Title *</label>
                        <input className="adm-input" placeholder="e.g. Web Development" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    </div>
                    <div>
                        <label className="adm-label">Service Icon</label>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                            {form.icon && (form.icon.startsWith('http') || form.icon.startsWith('/') || form.icon.startsWith('images/')) && (
                                <img src={imgUrl(form.icon)} alt="Icon" style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '10px', border: `1px solid ${t.border}` }} />
                            )}
                            {form.icon && !form.icon.startsWith('http') && !form.icon.startsWith('/') && !form.icon.startsWith('images/') && (
                                <div style={{ width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', borderRadius: '10px', border: `1px solid ${t.border}`, background: dark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)' }}>
                                    {form.icon}
                                </div>
                            )}
                            <input ref={imgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleIconUpload} />
                            <button onClick={() => imgRef.current?.click()} disabled={uploading} style={{ padding: '10px 16px', borderRadius: '10px', border: `1px solid ${t.border}`, background: dark ? 'rgba(255,255,255,0.06)' : '#F8FAFB', color: t.text, cursor: 'pointer', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {uploading ? '⏳ Uploading…' : '📁 Upload Icon'}
                            </button>
                        </div>
                        {uploadErr && (
                            <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '6px', padding: '6px 10px', background: 'rgba(239,68,68,0.1)', borderRadius: '6px' }}>{uploadErr}</div>
                        )}
                    </div>
                    <div>
                        <label className="adm-label">Description</label>
                        <textarea className="adm-input" rows={3} style={{ resize: 'vertical' }} placeholder="Short description of this service..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    </div>
                    <div>
                        <label className="adm-label">Features (one per line)</label>
                        <textarea className="adm-input" rows={5} style={{ resize: 'vertical', fontFamily: 'inherit' }} placeholder={"Responsive design\nSEO optimization\nFast delivery"} value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} />
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px 14px', borderRadius: '10px', background: dark ? 'rgba(255,255,255,0.04)' : '#F9FAFB', border: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : '#E5E7EB'}` }}>
                        <input type="checkbox" checked={form.is_popular} onChange={e => setForm({ ...form, is_popular: e.target.checked })} style={{ accentColor: '#6366F1', width: '16px', height: '16px' }} />
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: dark ? '#F1F5F9' : '#111827' }}>Mark as Popular</div>
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
    const { t, dark } = useTheme();
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

    const cardBg     = dark ? '#1E293B' : '#FFFFFF';
    const cardBorder = dark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #E8ECF0';
    const cardShadow = dark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.04)';
    const divider    = dark ? 'rgba(255,255,255,0.07)' : '#EEF0F5';

    return (
        <>
            <Head title="Admin – Services" />
            {showModal && <ServiceModal form={form} setForm={setForm} editing={editing} setEditing={setEditing} onSave={save} onCancel={closeModal} t={t} dark={dark} />}

            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ fontSize: '13px', color: t.textMuted, fontWeight: '500' }}>{services.length} service{services.length !== 1 ? 's' : ''} configured</span>
                <button className="adm-btn-primary" onClick={openCreate}>+ New Service</button>
            </div>

            {services.length === 0 && (
                <div style={{ background: cardBg, border: cardBorder, borderRadius: '14px', padding: '60px', textAlign: 'center', boxShadow: cardShadow }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>🛠️</div>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: dark ? '#F1F5F9' : '#111827', marginBottom: '8px' }}>No services yet</div>
                    <div style={{ color: t.textMuted, fontSize: '13px', marginBottom: '20px' }}>Add what you offer to showcase your expertise</div>
                    <button className="adm-btn-primary" onClick={openCreate}>Add First Service</button>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {services.map(s => (
                    <div key={s.id}
                        style={{ background: cardBg, border: cardBorder, borderRadius: '14px', padding: '24px', position: 'relative', overflow: 'hidden', boxShadow: cardShadow, transition: 'transform .18s ease, box-shadow .18s ease' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = dark ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = cardShadow; }}>

                        {s.is_popular && (
                            <div style={{ position: 'absolute', top: '14px', right: '14px' }}>
                                <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 9px', borderRadius: '20px', background: dark ? 'rgba(245,158,11,0.18)' : 'rgba(245,158,11,0.1)', color: '#D97706' }}>⭐ Popular</span>
                            </div>
                        )}

                        {/* Icon */}
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: dark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '14px', overflow: 'hidden' }}>
                            {s.icon ? (s.icon.startsWith('http') || s.icon.startsWith('/') || s.icon.startsWith('images/') 
                                ? <img src={s.icon.startsWith('http') ? s.icon : '/' + s.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : s.icon
                            ) : '🛠️'}
                        </div>

                        {/* Title & description */}
                        <div style={{ fontSize: '16px', fontWeight: '700', color: dark ? '#F1F5F9' : '#111827', marginBottom: '6px', lineHeight: 1.3 }}>{s.title}</div>
                        <div style={{ fontSize: '13px', color: dark ? '#CBD5E1' : '#475569', marginBottom: '14px', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{s.description}</div>

                        {/* Features */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '18px' }}>
                            {(s.features || []).slice(0, 4).map((f, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: dark ? '#CBD5E1' : '#475569' }}>
                                    <span style={{ color: '#10B981', fontWeight: '700', fontSize: '14px', lineHeight: 1 }}>✓</span>
                                    {f}
                                </div>
                            ))}
                            {(s.features || []).length > 4 && (
                                <div style={{ fontSize: '12px', color: t.accent, fontWeight: '500' }}>+{s.features.length - 4} more features</div>
                            )}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '8px', paddingTop: '14px', borderTop: `1px solid ${divider}` }}>
                            <button onClick={() => openEdit(s)} className="adm-btn-ghost" style={{ flex: 1, padding: '8px', fontSize: '13px' }}>Edit</button>
                            <button onClick={() => remove(s.id)} style={{ padding: '8px 16px', borderRadius: '9px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

AdminServices.layout = page => <AdminLayout title="Services">{page}</AdminLayout>;
