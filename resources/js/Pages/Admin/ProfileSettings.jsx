import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const inputStyle = { width: '100%', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '9px 12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#fff', color: '#0f172a' };
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' };

export default function AdminProfileSettings() {
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({});
    const [saved, setSaved] = useState(false);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [resumeUploading, setResumeUploading] = useState(false);
    const [uploadMsg, setUploadMsg] = useState('');
    const avatarRef = useRef();
    const resumeRef = useRef();

    useEffect(() => {
        axios.get('/api/profile').then(r => {
            setProfile(r.data);
            const d = { ...r.data };
            if (Array.isArray(d.typewriter_words)) d.typewriter_words = d.typewriter_words.join('\n');
            setForm(d);
        });
    }, []);

    function save() {
        axios.put('/api/profile', form).then(() => { setSaved(true); setTimeout(() => setSaved(false), 3000); });
    }

    async function handleAvatar(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { setUploadMsg('Please select an image file.'); return; }
        setAvatarUploading(true);
        setUploadMsg('');
        const fd = new FormData();
        fd.append('avatar', file);
        try {
            const res = await axios.post('/api/profile/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            setForm(f => ({ ...f, avatar: res.data.avatar }));
            setUploadMsg('Avatar uploaded successfully!');
        } catch {
            setUploadMsg('Avatar upload failed. Max 2MB, images only.');
        } finally {
            setAvatarUploading(false);
        }
    }

    async function handleResume(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.type !== 'application/pdf') { setUploadMsg('Please select a PDF file.'); return; }
        setResumeUploading(true);
        setUploadMsg('');
        const fd = new FormData();
        fd.append('resume', file);
        try {
            const res = await axios.post('/api/profile/resume', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            setForm(f => ({ ...f, resume: res.data.resume }));
            setUploadMsg('Resume uploaded successfully!');
        } catch {
            setUploadMsg('Resume upload failed. Max 5MB, PDF only.');
        } finally {
            setResumeUploading(false);
        }
    }

    const avatarUrl = form.avatar ? (form.avatar.startsWith('http') ? form.avatar : '/' + form.avatar) : null;

    if (!profile) return (
        <AdminLayout title="Profile Settings">
            <Head title="Admin - Profile" />
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>Loading profile…</div>
        </AdminLayout>
    );

    return (
        <AdminLayout title="Profile Settings">
            <Head title="Admin - Profile" />

            {saved && <div style={{ marginBottom: '16px', padding: '12px 16px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '10px', color: '#15803d', fontSize: '14px', fontWeight: '600' }}>✓ Profile updated successfully!</div>}
            {uploadMsg && <div style={{ marginBottom: '16px', padding: '12px 16px', background: uploadMsg.includes('success') ? '#dcfce7' : '#fee2e2', border: `1px solid ${uploadMsg.includes('success') ? '#bbf7d0' : '#fecaca'}`, borderRadius: '10px', color: uploadMsg.includes('success') ? '#15803d' : '#dc2626', fontSize: '14px' }}>{uploadMsg}</div>}

            {/* Media Upload */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '20px' }}>Profile Media</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {/* Avatar */}
                    <div>
                        <label style={labelStyle}>Profile Photo</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                            {avatarUrl
                                ? <img src={avatarUrl} alt="Avatar" style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #e2e8f0' }} />
                                : <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px', fontWeight: '800' }}>SM</div>
                            }
                            <div>
                                <button onClick={() => avatarRef.current?.click()} style={{ background: '#f8faff', border: '1px solid #e2e8f0', color: '#2563eb', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'block', marginBottom: '6px' }}>
                                    {avatarUploading ? 'Uploading…' : 'Upload Photo'}
                                </button>
                                <div style={{ color: '#94a3b8', fontSize: '11px' }}>JPEG, PNG, WebP — max 2MB</div>
                            </div>
                        </div>
                        <input ref={avatarRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatar} />
                        <input style={inputStyle} value={form.avatar || ''} onChange={e => setForm({ ...form, avatar: e.target.value })} placeholder="Or enter path manually" />
                    </div>
                    {/* Resume */}
                    <div>
                        <label style={labelStyle}>Resume / CV</label>
                        <div style={{ background: '#f8faff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ fontSize: '28px' }}>📄</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>
                                    {form.resume ? form.resume.split('/').pop() : 'No resume uploaded'}
                                </div>
                                <button onClick={() => resumeRef.current?.click()} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                                    {resumeUploading ? 'Uploading…' : 'Upload PDF'}
                                </button>
                            </div>
                        </div>
                        <input ref={resumeRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleResume} />
                        <input style={inputStyle} value={form.resume || ''} onChange={e => setForm({ ...form, resume: e.target.value })} placeholder="Or enter path manually" />
                    </div>
                </div>
            </div>

            {/* Basic Info */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '20px' }}>Basic Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {[['Name', 'name', 'text', 'Sital Mahato'], ['Title', 'title', 'text', 'Full Stack Developer'], ['Email', 'email', 'email', 'you@example.com'], ['Phone', 'phone', 'text', '+977 0000000000'], ['Location', 'location', 'text', 'City, Country'], ['Availability', 'availability', 'text', 'Available for Work'], ['GitHub URL', 'github', 'url', 'https://github.com/...'], ['LinkedIn URL', 'linkedin', 'url', 'https://linkedin.com/in/...']].map(([lbl, key, type, ph]) => (
                        <div key={key}>
                            <label style={labelStyle}>{lbl}</label>
                            <input style={inputStyle} type={type} value={form[key] || ''} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={ph} />
                        </div>
                    ))}
                    <div style={{ gridColumn: '1/-1' }}>
                        <label style={labelStyle}>Bio</label>
                        <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={4} value={form.bio || ''} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Write a short bio about yourself…" />
                    </div>
                    <div style={{ gridColumn: '1/-1' }}>
                        <label style={labelStyle}>Typewriter Words (one per line)</label>
                        <textarea style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace' }} rows={6} value={typeof form.typewriter_words === 'string' ? form.typewriter_words : (form.typewriter_words || []).join('\n')} onChange={e => setForm({ ...form, typewriter_words: e.target.value })} placeholder={`Full Stack Developer\nUI/UX Designer\nLaravel Expert`} />
                        <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '4px' }}>Each line becomes one typewriter phrase on the portfolio</div>
                    </div>
                </div>
            </div>

            <button onClick={save} style={{ background: 'linear-gradient(135deg,#1e3a8a,#2563eb)', color: '#fff', border: 'none', borderRadius: '10px', padding: '13px 32px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 16px rgba(37,99,235,0.3)' }}>
                Save All Changes
            </button>
        </AdminLayout>
    );
}
