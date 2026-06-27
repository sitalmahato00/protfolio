import AdminLayout, { useTheme } from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

// ─── Sparkline SVG ────────────────────────────────────────────────────────────
function Sparkline({ data = [], color = '#6366F1' }) {
    if (data.length < 2) return null;
    const h = 40, w = 120;
    const max = Math.max(...data, 1), min = Math.min(...data, 0);
    const range = max - min || 1;
    const pts = data.map((v, i) =>
        `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`
    ).join(' ');
    const area = `0,${h} ${pts} ${w},${h}`;
    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
            <defs>
                <linearGradient id={`sp-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon points={area} fill={`url(#sp-${color.replace('#', '')})`} />
            <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ icon, label, value, change, color, spark, t }) {
    const up = change >= 0;
    return (
        <div className="adm-card adm-card-hover" style={{ padding: '18px 18px 14px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', border: `1px solid ${color}25`, flexShrink: 0 }}>
                    {icon}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontWeight: '700',
                    color: up ? (t.success || '#10B981') : (t.danger || '#EF4444'),
                    background: up ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    padding: '2px 7px', borderRadius: '5px' }}>
                    {up ? '↑' : '↓'} {Math.abs(change)}%
                </div>
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: t.text, lineHeight: 1, marginBottom: '2px' }}>{value}</div>
            <div style={{ fontSize: '11px', color: t.textMuted, fontWeight: '500', marginBottom: '10px' }}>{label}</div>
            <Sparkline data={spark} color={color} />
            <div style={{ fontSize: '10px', color: t.textMuted, marginTop: '6px' }}>
                <span style={{ color: up ? (t.success || '#10B981') : (t.danger || '#EF4444'), fontWeight: '600' }}>
                    {up ? '↑' : '↓'} {Math.abs(change)}%
                </span> from last month
            </div>
        </div>
    );
}

// ─── Line Chart (SVG) ─────────────────────────────────────────────────────────
function LineChart({ data, color, t }) {
    const w = 500, h = 150;
    const vals = data.map(d => d.v);
    const max = Math.max(...vals, 1), min = 0;
    const range = max - min;
    const pts = data.map((d, i) =>
        `${(i / (data.length - 1)) * w},${h - ((d.v - min) / range) * (h - 20) - 10}`
    ).join(' ');
    const area = `0,${h} ${pts} ${w},${h}`;
    const yLabels = [0, Math.round(max * 0.25), Math.round(max * 0.5), Math.round(max * 0.75), max];
    return (
        <div style={{ position: 'relative' }}>
            <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: '150px', overflow: 'visible' }}>
                <defs>
                    <linearGradient id="lc-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                {/* Grid lines */}
                {[0.25, 0.5, 0.75, 1].map(p => (
                    <line key={p} x1="0" y1={h - p * (h - 20) - 10} x2={w} y2={h - p * (h - 20) - 10}
                        stroke={t.border} strokeWidth="1" strokeDasharray="4,4" />
                ))}
                <polygon points={area} fill="url(#lc-grad)" />
                <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round" />
                {/* Dots */}
                {data.map((d, i) => {
                    const cx = (i / (data.length - 1)) * w;
                    const cy = h - ((d.v - min) / range) * (h - 20) - 10;
                    return (
                        <circle key={i} cx={cx} cy={cy} r="4" fill={color}
                            stroke={t.card} strokeWidth="2" />
                    );
                })}
            </svg>
            {/* X labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                {data.map((d, i) => (
                    <span key={i} style={{ fontSize: '10px', color: t.textMuted }}>{d.l}</span>
                ))}
            </div>
        </div>
    );
}

// ─── Donut Chart (SVG) ────────────────────────────────────────────────────────
function DonutChart({ slices, total, centerLabel, t }) {
    if (total <= 0) return <div style={{ textAlign: 'center', padding: '30px 0', color: t.textMuted, fontSize: '12px' }}>No data</div>;
    const r = 60, cx = 80, cy = 80, sw = 22;
    let angle = -90;
    const arcs = slices.map(s => {
        const pct = s.v / total;
        const a = pct * 360;
        const start = angle;
        angle += a;
        return { ...s, start, sweep: a, pct };
    });
    function polarToXY(cx, cy, r, angleDeg) {
        const rad = (angleDeg * Math.PI) / 180;
        return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    }
    function arcPath(cx, cy, r, startAngle, sweepAngle) {
        const start = polarToXY(cx, cy, r, startAngle);
        const end = polarToXY(cx, cy, r, startAngle + sweepAngle);
        const large = sweepAngle > 180 ? 1 : 0;
        return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
    }
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
                <svg width="160" height="160" viewBox="0 0 160 160">
                    {arcs.map((a, i) => (
                        <path key={i} d={arcPath(cx, cy, r, a.start, a.sweep)}
                            fill="none" stroke={a.color} strokeWidth={sw}
                            strokeLinecap="butt" />
                    ))}
                    <circle cx={cx} cy={cy} r={r - sw / 2 - 2} fill={t.card} />
                    <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="800" fill={t.text}>{total.toLocaleString()}</text>
                    <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fill={t.textMuted}>{centerLabel}</text>
                </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                {slices.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                            <span style={{ fontSize: '12px', color: t.textMuted }}>{s.label}</span>
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: t.text }}>{s.pct ? `${Math.round(s.pct * 100)}%` : ''}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Activity Item ─────────────────────────────────────────────────────────────
function ActivityItem({ icon, bg, title, time, dot, t }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 0', borderBottom: `1px solid ${t.border}` }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>{icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '12px', color: t.text, fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
                <div style={{ fontSize: '10px', color: t.textMuted, marginTop: '2px' }}>{time}</div>
            </div>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: dot, flexShrink: 0, boxShadow: `0 0 5px ${dot}` }} />
        </div>
    );
}

// ─── Main Admin Dashboard ───────────────────────────────────────────────────────
export default function AdminDashboard() {
    const { t } = useTheme();
    const [projects, setProjects] = useState([]);
    const [messages, setMessages] = useState([]);
    const [skills, setSkills] = useState([]);
    const [services, setServices] = useState([]);
    const [stats, setStats] = useState({});

    useEffect(() => {
        Promise.all([
            axios.get('/api/projects'),
            axios.get('/api/contact'),
            axios.get('/api/skills'),
            axios.get('/api/services'),
            axios.get('/api/stats'),
        ]).then(([p, m, sk, sv, st]) => {
            setProjects(p.data); setMessages(m.data);
            setSkills(sk.data); setServices(sv.data); setStats(st.data);
        }).catch(() => {});
    }, []);

    const unread = messages.filter(m => !m.is_read).length;
    const seed = n => Array.from({ length: 8 }, (_, i) => Math.max(1, Math.round(n * (0.4 + i * 0.1) + Math.random() * n * 0.3)));

    const kpis = [
        { icon: '📁', label: 'Total Projects',    value: projects.length,  change: 12,            color: '#6366F1', spark: seed(Math.max(projects.length || 4, 1)) },
        { icon: '💬', label: 'Messages Received', value: messages.length,  change: unread > 0 ? 8 : -2, color: '#06B6D4', spark: seed(Math.max(messages.length || 2, 1)) },
        { icon: '🛠️', label: 'Services Offered',  value: services.length,  change: 5,             color: '#F59E0B', spark: seed(Math.max(services.length || 3, 1)) },
        { icon: '💡', label: 'Skills Listed',      value: skills.length,    change: 10,            color: '#10B981', spark: seed(Math.max(skills.length || 6, 1)) },
    ];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    const base = Math.max(projects.length, 4);
    const lineData = months.map((l, i) => ({ l, v: Math.round(base * (0.3 + i * 0.1 + Math.random() * 0.15)) }));

    const statBars = [
        { label: 'Years Experience',    val: `${stats.years_exp || 3}+`,                                       pct: 70,  color: '#6366F1' },
        { label: 'Client Satisfaction', val: stats.client_satisfaction || '100%',                              pct: 100, color: '#10B981' },
        { label: 'Projects Delivered',  val: `${stats.projects_delivered || projects.length}+`,               pct: Math.min(100, ((stats.projects_delivered || projects.length) / 50) * 100) || 60, color: '#06B6D4' },
        { label: 'Tech Stack',          val: `${stats.tech_stack || skills.length}+`,                         pct: Math.min(100, ((stats.tech_stack || skills.length) / 20) * 100) || 55, color: '#F59E0B' },
    ];

    const topProjects = projects.slice(0, 3);
    const msgTotal = Math.max(messages.length, 1);
    const trafficSlices = [
        { label: 'Direct',        v: Math.round(msgTotal * .40), color: '#6366F1' },
        { label: 'Search Engine', v: Math.round(msgTotal * .30), color: '#06B6D4' },
        { label: 'Social Media',  v: Math.round(msgTotal * .15), color: '#10B981' },
        { label: 'Referral',      v: Math.round(msgTotal * .10), color: '#F59E0B' },
        { label: 'Others',        v: Math.round(msgTotal * .05), color: '#EF4444' },
    ];
    const devBase = Math.max(projects.length * 10, 10);
    const deviceSlices = [
        { label: 'Desktop', v: Math.round(devBase * .60), color: '#6366F1' },
        { label: 'Mobile',  v: Math.round(devBase * .30), color: '#8B5CF6' },
        { label: 'Tablet',  v: Math.round(devBase * .10), color: '#06B6D4' },
    ];
    const imgUrl = s => s ? (s.startsWith('http') ? s : '/' + s) : null;

    return (
        <AdminLayout title="Overview">
            <Head title="Admin Dashboard" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '14px', marginBottom: '20px' }}>
                {kpis.map(k => <KpiCard key={k.label} {...k} t={t} />)}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 280px', gap: '14px', marginBottom: '20px' }}>
                <div className="adm-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: t.text }}>Portfolio Views</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                <span style={{ fontSize: '20px', fontWeight: '800', color: t.text }}>{stats.projects_delivered || projects.length * 10 || '—'}</span>
                                <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '700' }}>↑ 18.2%</span>
                            </div>
                        </div>
                        <span className="adm-badge adm-badge-blue">This Month</span>
                    </div>
                    <LineChart data={lineData} color={t.accent} t={t} />
                </div>

                <div className="adm-card" style={{ padding: '20px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: t.text, marginBottom: '16px' }}>Platform Stats</div>
                    {statBars.map(s => (
                        <div key={s.label} style={{ marginBottom: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <span style={{ fontSize: '12px', color: t.textMuted }}>{s.label}</span>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: t.text }}>{s.val}</span>
                            </div>
                            <div style={{ height: '5px', borderRadius: '3px', background: `${s.color}20` }}>
                                <div style={{ height: '100%', borderRadius: '3px', background: s.color, width: `${s.pct}%`, transition: 'width 1s ease' }} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="adm-card" style={{ padding: '16px 18px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: t.text, marginBottom: '12px' }}>Recent Activity</div>
                    {messages.slice(0, 3).map(m => (
                        <ActivityItem key={m.id} icon="💬" bg="rgba(99,102,241,.15)" title={`Message from ${m.name}`} time={new Date(m.created_at).toLocaleDateString()} dot="#6366F1" t={t} />
                    ))}
                    {projects.slice(0, 2).map(p => (
                        <ActivityItem key={p.id} icon="🚀" bg="rgba(16,185,129,.15)" title={`Project: ${p.title}`} time="Active" dot="#10B981" t={t} />
                    ))}
                    {messages.length === 0 && projects.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '20px 0', color: t.textMuted, fontSize: '12px' }}>No activity yet</div>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div className="adm-card" style={{ padding: '20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: t.text, marginBottom: '14px' }}>Traffic Sources</div>
                    <DonutChart slices={trafficSlices} total={trafficSlices.reduce((a, s) => a + s.v, 0)} centerLabel="Views" t={t} />
                </div>
                <div className="adm-card" style={{ padding: '20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: t.text, marginBottom: '14px' }}>Device Usage</div>
                    <DonutChart slices={deviceSlices} total={deviceSlices.reduce((a, s) => a + s.v, 0)} centerLabel="Visits" t={t} />
                </div>
                <div className="adm-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: t.text }}>Most Viewed Projects</div>
                        <Link href={route('admin.projects')} style={{ fontSize: '11px', color: t.accent, textDecoration: 'none', fontWeight: '600' }}>View All</Link>
                    </div>
                    {topProjects.length === 0 && <div style={{ textAlign: 'center', padding: '20px 0', color: t.textMuted, fontSize: '12px' }}>No projects yet</div>}
                    {topProjects.map((p, i) => (
                        <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: i < topProjects.length - 1 ? `1px solid ${t.border}` : 'none' }}>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: t.textMuted, minWidth: '14px' }}>{i + 1}</span>
                            <div style={{ width: '40px', height: '30px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, background: `${t.accent}15` }}>
                                {imgUrl(p.image) ? <img src={imgUrl(p.image)} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>📁</div>}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '12px', fontWeight: '600', color: t.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                                <div style={{ fontSize: '10px', color: t.textMuted }}>{(p.tags || []).slice(0, 2).join(', ')}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
