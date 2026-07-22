import AdminLayout, { useTheme } from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const MODULE_COLOR = '#7C3AED';

function useIsMobile(bp = 640) {
    const [mobile, setMobile] = useState(() => window.innerWidth <= bp);
    useEffect(() => {
        const fn = () => setMobile(window.innerWidth <= bp);
        window.addEventListener('resize', fn);
        return () => window.removeEventListener('resize', fn);
    }, [bp]);
    return mobile;
}

function CertificateModal({ form, setForm, editing, setEditing, onSave, onCancel, t, dark }) {
    const imgUrl = s => s ? (s.startsWith('http') ? s : '/' + s) : null;
    const cardBg = dark ? '#1E293B' : '#FFFFFF';
    const [uploading, setUploading] = useState(false);
    const [uploadErr, setUploadErr] = useState('');
    const imgRef = useRef(null);

    async function handleImageUpload(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setUploadErr('');
        let certificateId = editing;
        if (!certificateId) {
            try {
                const data = { ...form };
                const res = await axios.post('/api/certificates', data);
                certificateId = res.data.id;
                setEditing(certificateId);
                setForm(f => ({ ...f, image: res.data.image || f.image }));
            } catch (err) {
                const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to create certificate';
                setUploadErr(msg);
                setUploading(false);
                return;
            }
        }
        const fd = new FormData();
        fd.append('image', file);
        try {
            const res = await axios.post(`/api/certificates/${certificateId}/image`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            setForm(f => ({ ...f, image: res.data.image }));
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Upload failed';
            setUploadErr(msg);
        }
        finally { setUploading(false); if (imgRef.current) imgRef.current.value = ''; }
    }

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', zIndex: 500, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0' }}>
            <div style={{ background: cardBg, border: `1px solid ${t.border}`, borderLeft: `5px solid ${MODULE_COLOR}`, borderRadius: '20px 20px 0 0', padding: '24px 22px', width: '100%', maxWidth: '640px', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 -12px 60px rgba(0,0,0,0.4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div>
                        <div style={{ fontSize: '17px', fontWeight: '800', color: dark ? '#F8FAFC' : '#111827' }}>{editing ? 'Edit Certificate' : 'New Certificate'}</div>
                        <div style={{ fontSize: '12px', color: t.textMuted, marginTop: '2px' }}>{editing ? 'Update certificate details' : 'Add a new certification'}</div>
                    </div>
                    <button onClick={onCancel} style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(100,116,139,0.12)', border: 'none', color: t.textMuted, cursor: 'pointer', fontSize: '18px', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                        <label className="adm-label">Certificate Title *</label>
                        <input className="adm-input" placeholder="e.g. Full Stack Web Development" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    </div>
                    <div>
                        <label className="adm-label">Issuer *</label>
                        <input className="adm-input" placeholder="e.g. Coursera, Meta, Google" value={form.issuer} onChange={e => setForm({ ...form, issuer: e.target.value })} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label className="adm-label">Issue Date</label>
                            <input className="adm-input" type="date" value={form.issue_date || ''} onChange={e => setForm({ ...form, issue_date: e.target.value })} />
                        </div>
                        <div>
                            <label className="adm-label">Expiry Date</label>
                            <input className="adm-input" type="date" value={form.expiry_date || ''} onChange={e => setForm({ ...form, expiry_date: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="adm-label">Description</label>
                        <textarea className="adm-input" rows={3} placeholder="Describe what this certification covers..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    </div>
                    <div>
                        <label className="adm-label">Certificate Image</label>
                        <div style={{ marginBottom: '8px' }}>
                            <input ref={imgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                            <button onClick={() => imgRef.current?.click()} disabled={uploading} style={{ padding: '9px 14px', borderRadius: '10px', border: `1px solid ${t.border}`, background: dark ? 'rgba(255,255,255,0.06)' : '#F8FAFB', color: t.text, cursor: 'pointer', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {uploading ? '⏳ Uploading…' : '📁 Upload Image'}
                            </button>
                        </div>
                        {uploadErr && (
                            <div style={{ fontSize: '12px', color: '#EF4444', marginBottom: '6px', padding: '6px 10px', background: 'rgba(239,68,68,0.1)', borderRadius: '6px' }}>{uploadErr}</div>
                        )}
                        {form.image && (
                            <div style={{ marginTop: '8px' }}>
                                <img src={imgUrl(form.image)} alt="Certificate preview" style={{ height: '120px', borderRadius: '10px', objectFit: 'cover', border: `1px solid ${t.border}` }} />
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="adm-label">Credential URL</label>
                        <input className="adm-input" placeholder="https://coursera.org/verify/..." value={form.credential_url || ''} onChange={e => setForm({ ...form, credential_url: e.target.value })} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label className="adm-label">Order</label>
                            <input className="adm-input" type="number" value={form.order || 0} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
                        </div>
                        <div>
                            <label className="adm-label">Active</label>
                            <select className="adm-input" value={form.is_active !== undefined ? form.is_active : true} onChange={e => setForm({ ...form, is_active: e.target.value === 'true' })}>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                    <button className="adm-btn-ghost" onClick={onCancel}>Cancel</button>
                    <button className="adm-btn-primary" onClick={onSave}>{editing ? 'Update Certificate' : 'Create Certificate'}</button>
                </div>
            </div>
        </div>
    );
}

function CertificateCard({ c, selected, onToggle, onEdit, onRemove, imgUrl, dark, t }) {
    const cardBg = dark ? '#1E293B' : '#FFFFFF';
    const cardBorder = dark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #E8ECF2';
    return (
        <div style={{ background: cardBg, border: selected ? `1px solid ${MODULE_COLOR}` : cardBorder, borderLeft: `4px solid ${MODULE_COLOR}`, borderRadius: '14px', overflow: 'hidden', boxShadow: dark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.06)', transition: 'all .2s', display: 'flex', flexDirection: 'column' }}>
            {imgUrl(c.image)
                ? <img src={imgUrl(c.image)} alt={c.title} style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block', flexShrink: 0 }} />
                : <div style={{ width: '100%', height: '80px', flexShrink: 0, background: 'rgba(124,58,237,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>🎓</div>
            }
            <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                    <input type="checkbox" checked={selected} onChange={onToggle} style={{ accentColor: MODULE_COLOR, width: '15px', height: '15px', marginTop: '3px', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: dark ? '#F8FAFC' : '#111827', lineHeight: 1.3 }}>{c.title}</div>
                        <div style={{ fontSize: '12px', color: '#a78bfa', marginTop: '3px', fontWeight: '600' }}>{c.issuer}</div>
                    </div>
                </div>
                {c.issue_date && (
                    <div style={{ fontSize: '11px', color: t.textMuted, marginTop: 'auto', marginBottom: '12px', fontFamily: "'JetBrains Mono'" }}>
                        {new Date(c.issue_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </div>
                )}
                <div style={{ display: 'flex', gap: '8px' }}>
                    {c.credential_url && (
                        <a href={c.credential_url} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '8px', borderRadius: '9px', background: 'rgba(6,182,212,0.12)', border: 'none', color: '#06B6D4', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', fontWeight: '600' }}>
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                            View
                        </a>
                    )}
                    <button onClick={() => onEdit(c)} style={{ flex: 1, padding: '8px', borderRadius: '9px', background: 'rgba(245,158,11,0.12)', border: 'none', color: '#F59E0B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', fontWeight: '600' }}>
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Edit
                    </button>
                    <button onClick={() => onRemove(c.id)} style={{ flex: 1, padding: '8px', borderRadius: '9px', background: 'rgba(239,68,68,0.12)', border: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', fontWeight: '600' }}>
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AdminCertificates() {
    const { t, dark } = useTheme();
    const isMobile = useIsMobile(640);
    const blank = { title: '', issuer: '', issue_date: '', expiry_date: '', image: '', credential_url: '', description: '', order: 0, is_active: true };
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(blank);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        axios.get('/api/certificates').then(r => { setCertificates(r.data); setLoading(false); });
    }, []);

    function openCreate() { setEditing(null); setForm(blank); setShowModal(true); }
    function openEdit(c) { setEditing(c.id); setForm({ ...c }); setShowModal(true); }
    function closeModal() { setShowModal(false); setEditing(null); setForm(blank); }

    function save() {
        const data = { ...form };
        const req = editing ? axios.put(`/api/certificates/${editing}`, data) : axios.post('/api/certificates', data);
        req.then(() => { closeModal(); axios.get('/api/certificates').then(r => setCertificates(r.data)); });
    }
    function remove(id) {
        if (confirm('Delete this certificate?')) axios.delete(`/api/certificates/${id}`).then(() => axios.get('/api/certificates').then(r => setCertificates(r.data)));
    }
    function toggleSelect(id) {
        setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
    }
    function bulkDelete() {
        if (!selected.length || !confirm(`Delete ${selected.length} certificates?`)) return;
        Promise.all(selected.map(id => axios.delete(`/api/certificates/${id}`))).then(() => { setSelected([]); axios.get('/api/certificates').then(r => setCertificates(r.data)); });
    }

    const imgUrl = s => s ? (s.startsWith('http') ? s : '/' + s) : null;
    const filtered = certificates.filter(c =>
        c.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.issuer?.toLowerCase().includes(search.toLowerCase())
    );

    const cardBg = dark ? '#1E293B' : '#FFFFFF';
    const cardShadow = dark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.04)';
    const headerBg = dark ? 'rgba(255,255,255,0.04)' : '#F8F9FB';
    const zebraBg = dark ? 'rgba(255,255,255,0.02)' : '#FAFBFC';

    if (loading) {
        return (
            <>
                <Head title="Admin – Certificates" />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', color: t.textMuted }}>Loading...</div>
            </>
        );
    }

    return (
        <>
            <Head title="Admin – Certificates" />
            {showModal && <CertificateModal form={form} setForm={setForm} editing={editing} setEditing={setEditing} onSave={save} onCancel={closeModal} t={t} dark={dark} />}

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '160px' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: t.textDim, lineHeight: 0 }}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    </span>
                    <input className="adm-input" style={{ paddingLeft: '36px', borderRadius: '50px', fontSize: '13px' }} placeholder="Search certificates..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                {selected.length > 0 && (
                    <button className="adm-btn-ghost" onClick={bulkDelete} style={{ borderColor: 'rgba(239,68,68,0.35)', color: '#EF4444', fontSize: '12px', padding: '8px 12px' }}>
                        🗑 Delete {selected.length}
                    </button>
                )}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: t.textMuted, fontWeight: '500', whiteSpace: 'nowrap' }}>{filtered.length} certificates</span>
                    <button className="adm-btn-primary" onClick={openCreate} style={{ whiteSpace: 'nowrap' }}>+ New Certificate</button>
                </div>
            </div>

            {isMobile ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filtered.length === 0 && (
                        <div style={{ background: cardBg, borderRadius: '14px', padding: '60px 24px', textAlign: 'center', color: t.textMuted }}>
                            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎓</div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: dark ? '#F8FAFC' : '#111827', marginBottom: '6px' }}>No certificates yet</div>
                            <div style={{ fontSize: '12px' }}>Add your first certificate to get started</div>
                        </div>
                    )}
                    {filtered.map(c => (
                        <CertificateCard
                            key={c.id}
                            c={c}
                            selected={selected.includes(c.id)}
                            onToggle={() => toggleSelect(c.id)}
                            onEdit={openEdit}
                            onRemove={remove}
                            imgUrl={imgUrl}
                            dark={dark}
                            t={t}
                        />
                    ))}
                </div>
            ) : (
                <div style={{ background: cardBg, borderRadius: '10px', border: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : '#E8ECF2'}`, borderLeft: `4px solid ${MODULE_COLOR}`, boxShadow: cardShadow, overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '36px 68px 1fr 140px 100px', gap: '14px', padding: '14px 22px', background: headerBg, borderBottom: `1px solid ${dark ? 'rgba(51,65,85,0.6)' : 'rgba(229,231,235,0.8)'}`, position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(12px)' }}>
                        <div><input type="checkbox" onChange={e => setSelected(e.target.checked ? filtered.map(c => c.id) : [])} checked={selected.length === filtered.length && filtered.length > 0} style={{ accentColor: MODULE_COLOR, width: '15px', height: '15px' }} /></div>
                        {['Image', 'Certificate', 'Issuer', 'Date', 'Actions'].map(h => (
                            <div key={h} style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: dark ? '#94A3B8' : '#64748B' }}>{h}</div>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div style={{ padding: '70px', textAlign: 'center', color: t.textMuted }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '28px' }}>🎓</div>
                            <div style={{ fontSize: '15px', fontWeight: '600', color: dark ? '#F8FAFC' : '#111827', marginBottom: '6px' }}>No certificates yet</div>
                            <div style={{ fontSize: '13px', color: t.textMuted }}>Add your first certificate to get started</div>
                        </div>
                    )}

                    {filtered.map((c, i) => (
                        <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '36px 68px 1fr 140px 100px', gap: '14px', padding: '0 22px', minHeight: '66px', alignItems: 'center', borderBottom: `1px solid ${dark ? 'rgba(51,65,85,0.4)' : 'rgba(229,231,235,0.6)'}`, background: selected.includes(c.id) ? `rgba(124,58,237,0.06)` : (i % 2 === 1 ? zebraBg : 'transparent'), transition: 'all 0.2s ease' }} onMouseEnter={e => { if (!selected.includes(c.id)) e.currentTarget.style.background = dark ? 'rgba(124,58,237,0.08)' : 'rgba(124,58,237,0.04)'; }} onMouseLeave={e => { e.currentTarget.style.background = selected.includes(c.id) ? 'rgba(124,58,237,0.06)' : (i % 2 === 1 ? zebraBg : 'transparent'); }}>
                            <div><input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggleSelect(c.id)} style={{ accentColor: MODULE_COLOR, width: '15px', height: '15px' }} /></div>
                            <div>
                                {imgUrl(c.image)
                                    ? <img src={imgUrl(c.image)} alt={c.title} style={{ width: '56px', height: '42px', objectFit: 'cover', borderRadius: '10px', border: dark ? '1px solid rgba(51,65,85,0.6)' : '1px solid rgba(229,231,235,0.8)' }} />
                                    : <div style={{ width: '56px', height: '42px', background: 'rgba(124,58,237,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🎓</div>}
                            </div>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: dark ? '#F8FAFC' : '#111827', lineHeight: 1.3 }}>{c.title}</div>
                                <div style={{ fontSize: '12px', color: t.textMuted, marginTop: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '260px', lineHeight: 1.4 }}>{c.description}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: '#a78bfa' }}>{c.issuer}</div>
                                <div style={{ fontSize: '11px', color: t.textMuted, marginTop: '2px', fontFamily: "'JetBrains Mono'" }}>
                                    {c.issue_date && new Date(c.issue_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                {c.credential_url && (
                                    <a href={c.credential_url} target="_blank" rel="noreferrer" title="View Credential" style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(6,182,212,0.12)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06B6D4', textDecoration: 'none', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(6,182,212,0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(6,182,212,0.12)'}>
                                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                    </a>
                                )}
                                <button onClick={() => openEdit(c)} title="Edit" style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(245,158,11,0.12)', border: 'none', color: '#F59E0B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.22)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,158,11,0.12)'}>
                                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                </button>
                                <button onClick={() => remove(c.id)} title="Delete" style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(239,68,68,0.12)', border: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.22)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}>
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

AdminCertificates.layout = page => <AdminLayout title="Certificates">{page}</AdminLayout>;
