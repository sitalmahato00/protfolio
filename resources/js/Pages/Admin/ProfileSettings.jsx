import AdminLayout, { useTheme } from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const TABS = ['Personal', 'About & Typewriter', 'Media', 'Social Links'];

function TabBar({ active, setActive, t }) {
    return (
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: t.navHover, borderRadius: '12px', padding: '4px', width: 'fit-content' }}>
            {TABS.map(tab => (
                <button key={tab} onClick={() => setActive(tab)}
                    style={{ padding: '8px 18px', borderRadius: '9px', border: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', background: active === tab ? t.cardSolid : 'transparent', color: active === tab ? t.text : t.textMuted, boxShadow: active === tab ? `0 1px 6px rgba(0,0,0,0.1)` : 'none' }}>
                    {tab}
                </button>
            ))}
        </div>
    );
}

function Field({ label, children }) {
    return (
        <div>
            <label className="adm-label">{label}</label>
            {children}
        </div>
    );
}

export default function AdminProfileSettings() {
    const { t } = useTheme();
    const [tab, setTab] = useState('Personal');
    const [form, setForm] = useState({});
    const [saved, setSaved] = useState(false);
    const [msg, setMsg] = useState('');
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [resumeUploading, setResumeUploading] = useState(false);
    const avatarRef = useRef();
    const resumeRef = useRef();

    useEffect(() => {
        axios.get('/api/profile').then(r => {
            const d = { ...r.data };
            if (Array.isArray(d.typewriter_words)) d.typewriter_words = d.typewriter_words.join('\n');
            setForm(d);
        });
    }, []);

    function save() {
        axios.put('/api/profile', form).then(() => { setSaved(true); setMsg(''); setTimeout(() => setSaved(false), 3000); });
    }

    function setF(k, v) { setForm(f => ({ ...f, [k]: v })); }

    async function handleAvatar(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { setMsg('Please select an image file.'); return; }
        setAvatarUploading(true); setMsg('');
        const fd = new FormData();
        fd.append('avatar', file);
        try {
            const res = await axios.post('/api/profile/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            setF('avatar', res.data.avatar);
            setMsg('✓ Avatar uploaded!');
        } catch { setMsg('Upload failed. Max 2MB, images only.'); }
        finally { setAvatarUploading(false); }
    }

    async function handleResume(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.type !== 'application/pdf') { setMsg('Please select a PDF file.'); return; }
        setResumeUploading(true); setMsg('');
        const fd = new FormData();
        fd.append('resume', file);
        try {
            const res = await axios.post('/api/profile/resume', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            setF('resume', res.data.resume);
            setMsg('✓ Resume uploaded!');
        } catch { setMsg('Upload failed. Max 5MB, PDF only.'); }
        finally { setResumeUploading(false); }
    }

    const avatarUrl = form.avatar ? (form.avatar.startsWith('http') ? form.avatar : '/' + form.avatar) : null;

    return (
        <AdminLayout title="Profile Settings">
            <Head title="Admin – Profile" />

            {saved && (
                <div style={{ marginBottom: '16px', padding: '12px 18px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '12px', color: '#10B981', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    Profile saved successfully!
                </div>
            )}
            {msg && (
                <div style={{ marginBottom: '16px', padding: '12px 18px', background: msg.startsWith('✓') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msg.startsWith('✓') ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: '12px', color: msg.startsWith('✓') ? '#10B981' : '#EF4444', fontSize: '13px' }}>
                    {msg}
                </div>
            )}

            <TabBar active={tab} setActive={setTab} t={t} />

            {tab === 'Personal' && (
                <div className="adm-card" style={{ padding: '28px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: t.text, marginBottom: '20px' }}>Personal Information</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <Field label="Full Name"><input className="adm-input" value={form.name || ''} onChange={e => setF('name', e.target.value)} placeholder="Sital Mahato" /></Field>
                        <Field label="Professional Title"><input className="adm-input" value={form.title || ''} onChange={e => setF('title', e.target.value)} placeholder="Full Stack Developer" /></Field>
                        <Field label="Email Address"><input className="adm-input" type="email" value={form.email || ''} onChange={e => setF('email', e.target.value)} placeholder="you@example.com" /></Field>
                        <Field label="Phone Number"><input className="adm-input" value={form.phone || ''} onChange={e => setF('phone', e.target.value)} placeholder="+977 9700000000" /></Field>
                        <Field label="Location"><input className="adm-input" value={form.location || ''} onChange={e => setF('location', e.target.value)} placeholder="Biratnagar, Nepal" /></Field>
                        <Field label="Availability Status"><input className="adm-input" value={form.availability || ''} onChange={e => setF('availability', e.target.value)} placeholder="Available for Work" /></Field>
                    </div>
                </div>
            )}

            {tab === 'About & Typewriter' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="adm-card" style={{ padding: '28px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: t.text, marginBottom: '20px' }}>Bio / About Me</div>
                        <textarea className="adm-input" rows={6} style={{ resize: 'vertical' }} value={form.bio || ''} onChange={e => setF('bio', e.target.value)} placeholder="Write a compelling bio about yourself, your expertise, and what you offer..." />
                    </div>
                    <div className="adm-card" style={{ padding: '28px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: t.text, marginBottom: '6px' }}>Typewriter Phrases</div>
                        <div style={{ fontSize: '12px', color: t.textMuted, marginBottom: '16px' }}>Each line becomes one animated phrase on the hero section of your portfolio.</div>
                        <textarea className="adm-input" rows={8} style={{ resize: 'vertical', fontFamily: "'Fira Code', monospace", fontSize: '13px' }}
                            value={typeof form.typewriter_words === 'string' ? form.typewriter_words : (form.typewriter_words || []).join('\n')}
                            onChange={e => setF('typewriter_words', e.target.value)}
                            placeholder={"Full Stack Developer\nUI/UX Designer\nLaravel Expert\nReact Developer"} />
                        <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {(typeof form.typewriter_words === 'string' ? form.typewriter_words : (form.typewriter_words || []).join('\n')).split('\n').filter(Boolean).map((w, i) => (
                                <span key={i} className="adm-badge adm-badge-blue">{w}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {tab === 'Media' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {/* Avatar */}
                    <div className="adm-card" style={{ padding: '28px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: t.text, marginBottom: '20px' }}>Profile Photo</div>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div style={{ width: '90px', height: '90px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: `3px solid ${t.accent}40`, boxShadow: `0 0 20px rgba(99,102,241,0.2)` }}>
                                {avatarUrl
                                    ? <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    : <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg,${t.accent},${t.accentEnd})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '28px', fontWeight: '800' }}>SM</div>
                                }
                            </div>
                            <div>
                                <button onClick={() => avatarRef.current?.click()}
                                    className="adm-btn-primary" style={{ marginBottom: '8px', display: 'block', width: '100%' }}>
                                    {avatarUploading ? '⏳ Uploading…' : '📷 Upload Photo'}
                                </button>
                                <div style={{ fontSize: '11px', color: t.textMuted }}>JPEG, PNG, WebP — Max 2MB</div>
                            </div>
                        </div>
                        <input ref={avatarRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatar} />
                        <Field label="Or enter URL / path">
                            <input className="adm-input" value={form.avatar || ''} onChange={e => setF('avatar', e.target.value)} placeholder="images/avatar.jpg" />
                        </Field>
                    </div>

                    {/* Resume */}
                    <div className="adm-card" style={{ padding: '28px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: t.text, marginBottom: '20px' }}>Resume / CV</div>
                        <div style={{ padding: '20px', background: t.navHover, borderRadius: '12px', border: `1px solid ${t.border}`, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>📄</div>
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: t.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {form.resume ? form.resume.split('/').pop() : 'No resume uploaded'}
                                </div>
                                {form.resume && <div style={{ fontSize: '11px', color: '#10B981', marginTop: '2px' }}>✓ Resume is live on portfolio</div>}
                            </div>
                        </div>
                        <button onClick={() => resumeRef.current?.click()} className="adm-btn-primary" style={{ width: '100%', marginBottom: '12px' }}>
                            {resumeUploading ? '⏳ Uploading…' : '📤 Upload PDF'}
                        </button>
                        <input ref={resumeRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleResume} />
                        <Field label="Or enter path manually">
                            <input className="adm-input" value={form.resume || ''} onChange={e => setF('resume', e.target.value)} placeholder="images/resume.pdf" />
                        </Field>
                    </div>
                </div>
            )}

            {tab === 'Social Links' && (
                <div className="adm-card" style={{ padding: '28px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: t.text, marginBottom: '20px' }}>Social Profiles</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {[
                            { key: 'github', label: 'GitHub URL', icon: '🐙', ph: 'https://github.com/username' },
                            { key: 'linkedin', label: 'LinkedIn URL', icon: '💼', ph: 'https://linkedin.com/in/username' },
                            { key: 'email', label: 'Email Address', icon: '📧', ph: 'you@example.com' },
                            { key: 'phone', label: 'WhatsApp / Phone', icon: '📱', ph: '+977 9700000000' },
                        ].map(({ key, label, icon, ph }) => (
                            <div key={key}>
                                <label className="adm-label">{icon} {label}</label>
                                <input className="adm-input" value={form[key] || ''} onChange={e => setF(key, e.target.value)} placeholder={ph} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ marginTop: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button className="adm-btn-primary" onClick={save} style={{ padding: '12px 32px', fontSize: '14px' }}>
                    💾 Save Changes
                </button>
                <span style={{ fontSize: '12px', color: t.textMuted }}>Changes will reflect immediately on your live portfolio.</span>
            </div>
        </AdminLayout>
    );
}
