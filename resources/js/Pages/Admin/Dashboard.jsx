import AdminLayout, { useTheme } from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { useCachedData } from '@/hooks/useCachedData';

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

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ accent, label, value, icon, progress, t }) {
    return (
        <div style={{
            position: 'relative',
            background: t.card,
            borderRadius: '12px',
            padding: '20px',
            overflow: 'hidden',
            border: `1px solid ${t.border}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
            cursor: 'default',
        }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.1), 0 0 0 1px ${accent}22, 0 0 24px ${accent}15`;
                e.currentTarget.style.borderColor = `${accent}30`;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
                e.currentTarget.style.borderColor = t.border;
            }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: `linear-gradient(180deg, ${accent}, ${accent}cc)`, borderRadius: '0 2px 2px 0' }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>{label}</div>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: t.text, lineHeight: 1.1, letterSpacing: '-0.02em' }}>{value}</div>
                </div>
                <div style={{ opacity: 0.2, color: accent, flexShrink: 0, marginLeft: '12px', marginTop: '2px', lineHeight: 0 }}>{icon}</div>
            </div>
            {progress !== undefined && (
                <div style={{ marginTop: '14px' }}>
                    <div style={{ height: '4px', background: t.border, borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${accent}, ${accent}cc)`, borderRadius: '2px', transition: 'width 0.8s ease' }} />
                    </div>
                </div>
            )}
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
    const { data: projects = [] } = useCachedData('projects', () => axios.get('/api/projects').then(r => r.data));
    const { data: messages = [] } = useCachedData('messages', () => axios.get('/api/contact').then(r => r.data));
    const { data: skills = [] } = useCachedData('skills', () => axios.get('/api/skills').then(r => r.data));
    const { data: services = [] } = useCachedData('services', () => axios.get('/api/services').then(r => r.data));
    const { data: experiences = [] } = useCachedData('experiences', () => axios.get('/api/experiences').then(r => r.data));
    const { data: stats = {} } = useCachedData('stats', () => axios.get('/api/stats').then(r => r.data));

    const unread = messages.filter(m => !m.is_read).length;

    const progressPct = Math.min(100, skills.length * 10);
    const statsRow = [
        {
            accent: '#3B82F6', label: 'Total Projects', value: projects.length,
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
        },
        {
            accent: '#10B981', label: 'Services Offered', value: services.length,
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
        },
        {
            accent: '#06B6D4', label: 'Skills Listed', value: skills.length, progress: progressPct,
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
        },
        {
            accent: '#F59E0B', label: 'Pending Requests', value: unread,
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
        },
    ];

    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const msgByMonth = {};
    messages.forEach(m => {
        const d = new Date(m.created_at);
        const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
        msgByMonth[key] = (msgByMonth[key] || 0) + 1;
    });
    const sortedMonths = Object.keys(msgByMonth).sort();
    const lineData = sortedMonths.map(key => {
        const [, m] = key.split('-');
        return { l: monthNames[parseInt(m)-1], v: msgByMonth[key] };
    });

    const maxExp = 10;
    const maxStack = 30;
    const statBars = [
        { label: 'Years Experience',    val: `${stats.years_exp || 0}+`,           pct: Math.min(100, ((stats.years_exp || 0) / maxExp) * 100),  color: '#6366F1' },
        { label: 'Client Satisfaction', val: stats.client_satisfaction || '—',     pct: 100, color: '#10B981' },
        { label: 'Projects Delivered',  val: `${stats.projects_delivered || 0}+`,  pct: Math.min(100, ((stats.projects_delivered || 0) / 50) * 100), color: '#06B6D4' },
        { label: 'Tech Stack',          val: `${stats.tech_stack || 0}+`,          pct: Math.min(100, ((stats.tech_stack || 0) / maxStack) * 100),  color: '#F59E0B' },
    ];

    const topProjects = projects.slice(0, 3);

    const catColors = ['#6366F1','#10B981','#06B6D4','#F59E0B','#EF4444','#8B5CF6','#EC4899'];
    const catCounts = {};
    skills.forEach(s => { const c = s.category || 'Other'; catCounts[c] = (catCounts[c] || 0) + 1; });
    const trafficSlices = Object.entries(catCounts).map(([label, v], i) => ({ label, v, color: catColors[i % catColors.length] }));
    const trafficTotal = trafficSlices.reduce((a, s) => a + s.v, 0);

    const workCount = experiences.filter(e => e.type === 'work').length;
    const eduCount = experiences.filter(e => e.type === 'education').length;
    const deviceSlices = [
        { label: 'Work',      v: workCount || 1, color: '#6366F1' },
        { label: 'Education', v: eduCount || 1, color: '#8B5CF6' },
    ];
    const deviceTotal = deviceSlices.reduce((a, s) => a + s.v, 0);
    const imgUrl = s => s ? (s.startsWith('http') ? s : '/' + s) : null;

    return (
        <AdminLayout title="Overview">
            <Head title="Admin Dashboard" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                {statsRow.map(s => <StatCard key={s.label} {...s} t={t} />)}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 280px', gap: '14px', marginBottom: '20px' }}>
                <div className="adm-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: t.text }}>Messages Received</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                <span style={{ fontSize: '20px', fontWeight: '800', color: t.text }}>{messages.length}</span>
                                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '500' }}>total</span>
                            </div>
                        </div>
                        <span className="adm-badge adm-badge-blue">{sortedMonths.length || 0} months</span>
                    </div>
                    {lineData.length > 0 ? <LineChart data={lineData} color={t.accent} t={t} /> : <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.textMuted, fontSize: '12px' }}>No messages yet</div>}
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
                    <div style={{ fontSize: '13px', fontWeight: '700', color: t.text, marginBottom: '14px' }}>Skills by Category</div>
                    {trafficTotal > 0 ? <DonutChart slices={trafficSlices} total={trafficTotal} centerLabel="Skills" t={t} /> : <div style={{ textAlign: 'center', padding: '30px 0', color: t.textMuted, fontSize: '12px' }}>No skills yet</div>}
                </div>
                <div className="adm-card" style={{ padding: '20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: t.text, marginBottom: '14px' }}>Journey Entries</div>
                    <DonutChart slices={deviceSlices} total={deviceTotal} centerLabel="Entries" t={t} />
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
