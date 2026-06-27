import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Card = ({ color, icon, label, value }) => (
    <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderTop: `4px solid ${color}`, display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '52px', height: '52px', background: color + '18', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '24px' }}>{icon}</span>
        </div>
        <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{label}</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>{value}</div>
        </div>
    </div>
);

const QuickLink = ({ href, icon, title, desc, color }) => (
    <a href={href} style={{ display: 'block', background: '#fff', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderLeft: `4px solid ${color}`, textDecoration: 'none', transition: 'all 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; }}>
        <div style={{ fontSize: '24px', marginBottom: '10px' }}>{icon}</div>
        <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>{title}</div>
        <div style={{ fontSize: '13px', color: '#64748b' }}>{desc}</div>
    </a>
);

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => { axios.get('/api/stats').then(r => setStats(r.data)); }, []);

    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <Card color="#2563eb" icon="🚀" label="Projects Delivered" value={`${stats?.projects_delivered ?? '…'}+`} />
                <Card color="#7c3aed" icon="⚡" label="Tech Stack" value={`${stats?.tech_stack ?? '…'}+`} />
                <Card color="#10b981" icon="📅" label="Years Experience" value={`${stats?.years_exp ?? '…'}+`} />
                <Card color="#f97316" icon="⭐" label="Client Satisfaction" value={stats?.client_satisfaction ?? '…'} />
            </div>

            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>Quick Actions</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                <QuickLink href={route('admin.projects')} icon="📁" color="#2563eb" title="Manage Projects" desc="Add, edit, or remove portfolio projects" />
                <QuickLink href={route('admin.skills')} icon="💡" color="#7c3aed" title="Manage Skills" desc="Update your skill categories and items" />
                <QuickLink href={route('admin.services')} icon="🛠️" color="#10b981" title="Manage Services" desc="Update your service offerings" />
                <QuickLink href={route('admin.experiences')} icon="🎓" color="#f97316" title="My Journey" desc="Update work and education history" />
                <QuickLink href={route('admin.messages')} icon="💬" color="#ec4899" title="Messages" desc="View contact form submissions" />
                <QuickLink href={route('admin.profile')} icon="👤" color="#0ea5e9" title="Profile Settings" desc="Update your personal information & media" />
            </div>
        </AdminLayout>
    );
}
