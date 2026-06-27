import AdminLayout, { useTheme } from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { useCachedData } from '@/hooks/useCachedData';
import { useState } from 'react';

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ accent, label, value, icon, progress, link, linkLabel, t, dark }) {
    const cardBg = dark ? '#1E293B' : '#FFFFFF';
    const border  = dark ? 'rgba(255,255,255,0.07)' : '#E8ECF2';
    const shadow  = dark ? '0 2px 12px rgba(0,0,0,0.4)' : 'none';
    const hoverShadow = dark ? '0 8px 28px rgba(99,102,241,0.12)' : '0 4px 16px rgba(0,0,0,0.1)';
    const hoverBorder = dark ? 'rgba(99,102,241,0.5)' : 'rgba(99,102,241,0.35)';
    const leftBorder = `4px solid ${accent}`;

    return (
        <div
            style={{
                background: cardBg,
                border: `1px solid ${border}`,
                borderLeft: leftBorder,
                borderRadius: '10px',
                padding: '18px 18px 14px',
                boxShadow: shadow,
                transition: 'all .2s ease',
                cursor: 'default',
                display: 'flex',
                flexDirection: 'column',
            }}
            onMouseEnter={e => { 
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = hoverShadow;
                e.currentTarget.style.borderColor = hoverBorder;
                e.currentTarget.style.borderLeft = leftBorder;
            }}
            onMouseLeave={e => { 
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = shadow;
                e.currentTarget.style.borderColor = border;
                e.currentTarget.style.borderLeft = leftBorder;
            }}>

            {/* Top: icon + value */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '9px', background: `${accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent, flexShrink: 0 }}>
                    {icon}
                </div>
                <div style={{ fontSize: '30px', fontWeight: '800', color: dark ? '#F1F5F9' : '#1A1A2E', lineHeight: 1, letterSpacing: '-0.02em' }}>
                    {value}
                </div>
            </div>

            {/* Label */}
            <div style={{ fontSize: '12px', fontWeight: '500', color: dark ? '#94A3B8' : '#64748B', marginBottom: '10px' }}>
                {label}
            </div>

            {/* Progress bar */}
            <div style={{ height: '3px', background: dark ? 'rgba(255,255,255,0.08)' : '#EEF0F5', borderRadius: '2px', overflow: 'hidden', marginBottom: '10px' }}>
                <div style={{ height: '100%', width: `${progress ?? 60}%`, background: accent, borderRadius: '2px', transition: 'width .8s ease' }} />
            </div>

            {/* View all link */}
            {link && (
                <Link href={link} style={{ fontSize: '11px', color: accent, textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    {linkLabel || 'View all'} <span style={{ fontSize: '12px', lineHeight: 1 }}>→</span>
                </Link>
            )}
        </div>
    );
}

// ─── Section Card ──────────────────────────────────────────────────────────────
function Card({ children, title, badge, action, t, dark, style = {} }) {
    const cardBg = dark ? '#1E293B' : '#FFFFFF';
    const border  = dark ? 'rgba(255,255,255,0.07)' : '#E8ECF2';
    const shadow  = dark ? '0 2px 12px rgba(0,0,0,0.4)' : 'none';
    const hoverShadow = dark ? '0 8px 28px rgba(99,102,241,0.12)' : '0 4px 16px rgba(0,0,0,0.1)';
    const hoverBorder = dark ? 'rgba(99,102,241,0.5)' : 'rgba(99,102,241,0.35)';
    return (
        <div 
            style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '10px', padding: '18px', boxShadow: shadow, transition: 'all 0.2s ease', ...style }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = hoverShadow;
                e.currentTarget.style.borderColor = hoverBorder;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = shadow;
                e.currentTarget.style.borderColor = border;
            }}
        >
            {(title || action) && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: dark ? '#F1F5F9' : '#1A1A2E' }}>{title}</span>
                        {badge && (
                            <span style={{ fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '20px', background: dark ? 'rgba(255,255,255,0.07)' : '#F1F3F8', color: dark ? '#94A3B8' : '#64748B' }}>
                                {badge}
                            </span>
                        )}
                    </div>
                    {action}
                </div>
            )}
            {children}
        </div>
    );
}

// ─── Line Chart ────────────────────────────────────────────────────────────────
function LineChart({ data, color, t }) {
    const [hover, setHover] = useState(null);

    if (!data || data.length === 0) {
        return (
            <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.textMuted, fontSize: '12px' }}>
                No data yet
            </div>
        );
    }
    const chartData = data.length === 1 ? [{ l: '', v: 0 }, data[0]] : data;
    const w = 460, h = 120;
    const vals = chartData.map(d => d.v);
    const max = Math.max(...vals, 1);
    
    const points = chartData.map((d, i) => ({
        x: (i / (chartData.length - 1)) * w,
        y: h - (d.v / max) * (h - 12) - 6,
        v: d.v,
        l: d.l
    }));

    let linePath = `M ${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        const p0 = points[i - 1];
        const p1 = points[i];
        const cp0x = p0.x + (p1.x - p0.x) / 3;
        const cp1x = p1.x - (p1.x - p0.x) / 3;
        linePath += ` C ${cp0x},${p0.y} ${cp1x},${p1.y} ${p1.x},${p1.y}`;
    }
    const areaPath = `M 0,${h} L ${points[0].x},${points[0].y} ${linePath.substring(linePath.indexOf('C'))} L ${w},${h} Z`;

    return (
        <div style={{ position: 'relative' }}>
            <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: '120px', overflow: 'visible' }}>
                <defs>
                    <linearGradient id="lc-g" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                {[0.25, 0.5, 0.75].map(p => (
                    <line key={p} x1="0" y1={h - p * (h - 12) - 6} x2={w} y2={h - p * (h - 12) - 6}
                        stroke={t.border} strokeWidth="1" strokeDasharray="4 4" />
                ))}
                <path d={areaPath} fill="url(#lc-g)" />
                <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                {points.map((p, i) => (
                    <g key={i} 
                       onMouseEnter={() => setHover(i)} 
                       onMouseLeave={() => setHover(null)} 
                       style={{ cursor: 'pointer' }}>
                        <circle cx={p.x} cy={p.y} r={hover === i ? "5" : "3.5"} fill={color} stroke={t.card} strokeWidth="2" style={{ transition: 'all 0.15s ease' }} />
                        <circle cx={p.x} cy={p.y} r="15" fill="transparent" />
                    </g>
                ))}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                {chartData.map((d, i) => (
                    <span key={i} style={{ fontSize: '10px', color: t.textMuted }}>{d.l}</span>
                ))}
            </div>
            {hover !== null && (
                <div style={{
                    position: 'absolute',
                    left: `${(points[hover].x / w) * 100}%`,
                    top: `${points[hover].y - 35}px`,
                    transform: 'translateX(-50%)',
                    background: t.card,
                    border: `1px solid ${t.border}`,
                    color: t.text,
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '700',
                    pointerEvents: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    whiteSpace: 'nowrap',
                    zIndex: 10
                }}>
                    {points[hover].v} {points[hover].v === 1 ? 'message' : 'messages'}
                </div>
            )}
        </div>
    );
}

// ─── Donut Chart ───────────────────────────────────────────────────────────────
function DonutChart({ slices, total, centerLabel, t }) {
    const [hover, setHover] = useState(null);

    if (!total || total <= 0) return (
        <div style={{ textAlign: 'center', padding: '20px 0', color: t.textMuted, fontSize: '12px' }}>No data</div>
    );
    const r = 56, cx = 72, cy = 72, sw = 18;
    let angle = -90;
    const arcs = slices.map(s => {
        const pct = s.v / total;
        const a = pct * 360;
        const start = angle;
        angle += a;
        return { ...s, start, sweep: a, pct };
    });
    function pxy(cx, cy, r, deg) {
        const rad = deg * Math.PI / 180;
        return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    }
    function arc(cx, cy, r, s, sw) {
        const a = pxy(cx, cy, r, s);
        const b = pxy(cx, cy, r, s + sw);
        return `M ${a.x} ${a.y} A ${r} ${r} 0 ${sw > 180 ? 1 : 0} 1 ${b.x} ${b.y}`;
    }
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ flexShrink: 0 }}>
                <svg width="144" height="144" viewBox="0 0 144 144">
                    {arcs.map((a, i) => (
                        <path key={i} d={arc(cx, cy, r, a.start, a.sweep)}
                            fill="none" stroke={a.color} strokeWidth={hover === i ? sw + 4 : sw} strokeLinecap="butt"
                            style={{ transition: 'stroke-width 0.2s ease, filter 0.2s ease', cursor: 'pointer', filter: hover === i ? 'brightness(1.1)' : 'none' }}
                            onMouseEnter={() => setHover(i)}
                            onMouseLeave={() => setHover(null)}
                        />
                    ))}
                    <circle cx={cx} cy={cy} r={r - sw / 2 - 1} fill={t.card} />
                    <text x={cx} y={cy - 5} textAnchor="middle" fontSize="16" fontWeight="800" fill={t.text} style={{ transition: 'all 0.2s ease' }}>
                        {hover !== null ? arcs[hover].v : total}
                    </text>
                    <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill={t.textMuted} style={{ transition: 'all 0.2s ease' }}>
                        {hover !== null ? arcs[hover].label : centerLabel}
                    </text>
                </svg>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {arcs.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                            <span style={{ fontSize: '12px', color: t.textMuted }}>{s.label}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '11px', color: t.textMuted }}>{s.v}</span>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: t.text }}>
                                ({Math.round(s.pct * 100)}%)
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Stat Bar ──────────────────────────────────────────────────────────────────
function StatBar({ label, val, pct, color, t, dark }) {
    return (
        <div style={{ marginBottom: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <span style={{ fontSize: '12px', color: dark ? '#CBD5E1' : '#64748B', fontWeight: '500' }}>{label}</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: dark ? '#F1F5F9' : '#1A1A2E' }}>{val}</span>
            </div>
            <div style={{ height: '5px', background: dark ? 'rgba(255,255,255,0.07)' : '#EEF0F5', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '3px', transition: 'width .8s ease' }} />
            </div>
        </div>
    );
}

// ─── Activity Item ─────────────────────────────────────────────────────────────
function ActivityItem({ iconBg, iconColor, icon, title, sub, dot, t, dark }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#F0F2F6'}` }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor, flexShrink: 0 }}>
                {icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: dark ? '#E2E8F0' : '#1A1A2E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
                <div style={{ fontSize: '10px', color: dark ? '#64748B' : '#94A3B8', marginTop: '1px' }}>{sub}</div>
            </div>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: dot, flexShrink: 0 }} />
        </div>
    );
}

// ─── Recent Project Row ────────────────────────────────────────────────────────
function ProjectRow({ p, rank, imgUrl, dark, t }) {
    const url = imgUrl(p.image);
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#F0F2F6'}` }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: dark ? '#64748B' : '#9CA3AF', minWidth: '14px', textAlign: 'center' }}>{rank}</span>
            <div style={{ width: '44px', height: '32px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, background: dark ? 'rgba(99,102,241,0.1)' : '#F1F3F8' }}>
                {url
                    ? <img src={url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>📁</div>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: dark ? '#F1F5F9' : '#1A1A2E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                <div style={{ fontSize: '10px', color: dark ? '#64748B' : '#94A3B8', marginTop: '1px' }}>{(p.tags || []).slice(0, 2).join(', ')}</div>
            </div>
            <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: '10px', background: dark ? 'rgba(16,185,129,0.14)' : 'rgba(5,150,105,0.09)', color: dark ? '#6EE7B7' : '#065f46', whiteSpace: 'nowrap' }}>
                Published
            </span>
        </div>
    );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
    const { t, dark } = useTheme();

    const { data: projects   = [] } = useCachedData('projects',   () => axios.get('/api/projects').then(r => r.data));
    const { data: messages   = [] } = useCachedData('messages',   () => axios.get('/api/contact').then(r => r.data));
    const { data: skills     = [] } = useCachedData('skills',     () => axios.get('/api/skills').then(r => r.data));
    const { data: services   = [] } = useCachedData('services',   () => axios.get('/api/services').then(r => r.data));
    const { data: experiences= [] } = useCachedData('experiences',() => axios.get('/api/experiences').then(r => r.data));
    const { data: stats      = {} } = useCachedData('stats',      () => axios.get('/api/stats').then(r => r.data));

    const unread = messages.filter(m => !m.is_read).length;
    const imgUrl = s => s ? (s.startsWith('http') ? s : '/' + s) : null;

    // KPI config
    const kpis = [
        {
            accent: '#7C3AED', label: 'Total Projects', value: projects.length,
            progress: Math.min(100, projects.length * 8),
            link: '/admin/projects', linkLabel: 'View all projects',
            icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
        },
        {
            accent: '#06B6D4', label: 'Skills Listed', value: skills.length,
            progress: Math.min(100, skills.length * 5),
            link: '/admin/skills', linkLabel: 'Explore skills',
            icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
        },
        {
            accent: '#10B981', label: 'Services Offered', value: services.length,
            progress: Math.min(100, services.length * 12),
            link: '/admin/services', linkLabel: 'View all services',
            icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
        },
        {
            accent: '#F59E0B', label: 'Pending Messages', value: unread,
            progress: messages.length > 0 ? Math.round((unread / messages.length) * 100) : 0,
            link: '/admin/messages', linkLabel: 'View messages',
            icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
        },
    ];

    // Line chart data
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const msgByMonth = {};
    messages.forEach(m => {
        const d = new Date(m.created_at);
        const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
        msgByMonth[key] = (msgByMonth[key] || 0) + 1;
    });
    const lineData = Object.keys(msgByMonth).sort().map(key => {
        const [, mo] = key.split('-');
        return { l: monthNames[parseInt(mo)-1], v: msgByMonth[key] };
    });

    // Platform stat bars
    const statBars = [
        { label: 'Years Experience',   val: `${stats.years_exp || 0}+`,          pct: Math.min(100, ((stats.years_exp || 0) / 10) * 100),  color: '#7C3AED' },
        { label: 'Client Satisfaction',val: stats.client_satisfaction || '—',    pct: 100, color: '#10B981' },
        { label: 'Projects Delivered', val: `${stats.projects_delivered || 0}+`, pct: Math.min(100, ((stats.projects_delivered || 0) / 50) * 100), color: '#06B6D4' },
        { label: 'Tech Stack',         val: `${stats.tech_stack || 0}+`,         pct: Math.min(100, ((stats.tech_stack || 0) / 30) * 100), color: '#F59E0B' },
    ];

    // Donut slices
    const catColors = ['#7C3AED','#10B981','#06B6D4','#F59E0B','#EF4444','#3B82F6','#EC4899'];
    const catCounts = {};
    skills.forEach(s => { const c = s.category || 'Other'; catCounts[c] = (catCounts[c] || 0) + 1; });
    const skillSlices = Object.entries(catCounts).map(([label, v], i) => ({ label, v, color: catColors[i % catColors.length] }));
    const skillTotal  = skillSlices.reduce((a, s) => a + s.v, 0);

    const workCount = experiences.filter(e => e.type === 'work').length;
    const eduCount  = experiences.filter(e => e.type === 'education').length;
    const journeySlices = [
        { label: 'Work',      v: workCount || 0, color: '#7C3AED' },
        { label: 'Education', v: eduCount  || 0, color: '#EC4899' },
    ];
    const journeyTotal = journeySlices.reduce((a, s) => a + s.v, 0);

    const topProjects = projects.slice(0, 3);

    return (
        <>
            <Head title="Admin Dashboard" />

            {/* ── KPI Row ── */}
            <div className="adm-grid-4" style={{ marginBottom: '18px' }}>
                {kpis.map(k => <KpiCard key={k.label} {...k} t={t} dark={dark} />)}
            </div>

            <div className="adm-grid-3" style={{ marginBottom: '14px' }}>

                {/* Messages chart */}
                <Card
                    title="Messages Received"
                    badge={`${messages.length} total`}
                    t={t} dark={dark}>
                    <LineChart data={lineData} color="#6366F1" t={t} />
                </Card>

                {/* Platform stats */}
                <Card title="Platform Stats" t={t} dark={dark}>
                    {statBars.map(s => <StatBar key={s.label} {...s} t={t} dark={dark} />)}
                </Card>

                {/* Recent activity */}
                <Card title="Recent Activity" t={t} dark={dark}>
                    {messages.slice(0, 3).map(m => (
                        <ActivityItem key={m.id}
                            iconBg="rgba(99,102,241,0.12)" iconColor="#6366F1"
                            icon={<svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
                            title={`Message from ${m.name}`}
                            sub={new Date(m.created_at).toLocaleDateString()}
                            dot="#6366F1" t={t} dark={dark} />
                    ))}
                    {projects.slice(0, 3).map(p => (
                        <ActivityItem key={p.id}
                            iconBg="rgba(16,185,129,0.12)" iconColor="#10B981"
                            icon={<svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>}
                            title={`Project: ${p.title}`}
                            sub="Active"
                            dot="#10B981" t={t} dark={dark} />
                    ))}
                    {messages.length === 0 && projects.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '24px 0', color: t.textMuted, fontSize: '12px' }}>No activity yet</div>
                    )}
                </Card>
            </div>

            <div className="adm-grid-3-equal">

                {/* Skills donut */}
                <Card title="Skills by Category" t={t} dark={dark}>
                    {skillTotal > 0
                        ? <DonutChart slices={skillSlices} total={skillTotal} centerLabel="Skills" t={t} />
                        : <div style={{ textAlign: 'center', padding: '24px 0', color: t.textMuted, fontSize: '12px' }}>No skills yet</div>}
                </Card>

                {/* Journey donut */}
                <Card title="Journey Entries" t={t} dark={dark}>
                    <DonutChart slices={journeySlices} total={journeyTotal || 2} centerLabel="Entries" t={t} />
                </Card>

                {/* Recent Projects */}
                <Card
                    title="Recent Projects"
                    action={<Link href="/admin/projects" style={{ fontSize: '11px', color: '#6366F1', textDecoration: 'none', fontWeight: '600' }}>View All →</Link>}
                    t={t} dark={dark}>
                    {topProjects.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '24px 0', color: t.textMuted, fontSize: '12px' }}>No projects yet</div>
                    )}
                    {topProjects.map((p, i) => (
                        <ProjectRow key={p.id} p={p} rank={i + 1} imgUrl={imgUrl} dark={dark} t={t} />
                    ))}
                </Card>
            </div>
        </>
    );
}

AdminDashboard.layout = page => <AdminLayout title="Overview">{page}</AdminLayout>;
