import AdminLayout from '@/Layouts/AdminLayout';
import { useTheme } from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
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
