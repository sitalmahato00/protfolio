import { Link, usePage } from '@inertiajs/react';
import { useState, createContext, useContext } from 'react';

// ─── Design tokens ────────────────────────────────────────────────────────────
const tokens = {
    dark: {
        bg: '#0D1117', card: '#161B27', cardSolid: '#161B27',
        border: 'rgba(255,255,255,0.09)', borderHover: 'rgba(99,102,241,0.55)',
        text: '#E2E8F0', textMuted: '#94A3B8', textDim: '#64748B',
        accent: '#6366F1', accentEnd: '#8B5CF6', accentRgb: '99,102,241',
        sidebar: '#0A0F1A', sidebarBorder: 'rgba(255,255,255,0.07)',
        sidebarText: '#CBD5E1', sidebarGroupLabel: '#475569',
        topbar: 'rgba(13,17,23,0.97)',
        input: '#1C2333', inputBorder: 'rgba(255,255,255,0.12)',
        navHover: 'rgba(99,102,241,0.1)',
        cardShadow: '0 1px 4px rgba(0,0,0,0.45)',
        rowHover: 'rgba(99,102,241,0.06)',
        success: '#10B981', warning: '#F59E0B', danger: '#EF4444', info: '#06B6D4',
    },
    light: {
        bg: '#EEF2F7', card: '#FFFFFF', cardSolid: '#FFFFFF',
        border: '#C8D3E0', borderHover: 'rgba(79,70,229,0.45)',
        text: '#0F172A', textMuted: '#4B5563', textDim: '#9CA3AF',
        accent: '#4F46E5', accentEnd: '#7C3AED', accentRgb: '79,70,229',
        sidebar: '#0F172A', sidebarBorder: 'rgba(255,255,255,0.07)',
        sidebarText: '#CBD5E1', sidebarGroupLabel: '#475569',
        topbar: 'rgba(238,242,247,0.98)',
        input: '#FFFFFF', inputBorder: '#B8C4D0',
        navHover: 'rgba(79,70,229,0.07)',
        cardShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.07)',
        rowHover: 'rgba(79,70,229,0.04)',
        success: '#059669', warning: '#D97706', danger: '#DC2626', info: '#0891B2',
    },
};

// ─── Theme Context ─────────────────────────────────────────────────────────────
export const ThemeContext = createContext({ dark: true, toggle: () => {}, t: tokens.dark });
export const useTheme = () => useContext(ThemeContext);

// ─── Nav items ─────────────────────────────────────────────────────────────────
const NAV = [
    { group: 'Dashboard', items: [
        { label: 'Overview',  routeName: 'admin.dashboard',   href: '/admin/dashboard',
          icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg> },
    ]},
    { group: 'Content', items: [
        { label: 'Projects',  routeName: 'admin.projects',    href: '/admin/projects',
          icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> },
        { label: 'Skills',    routeName: 'admin.skills',      href: '/admin/skills',
          icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> },
        { label: 'Services',  routeName: 'admin.services',    href: '/admin/services',
          icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg> },
        { label: 'Journey',   routeName: 'admin.experiences', href: '/admin/experiences',
          icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
    ]},
    { group: 'Communication', items: [
        { label: 'Messages',  routeName: 'admin.messages',    href: '/admin/messages',
          icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
    ]},
    { group: 'Settings', items: [
        { label: 'Profile',   routeName: 'admin.profile',     href: '/admin/profile',
          icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    ]},
];

// ─── Global Styles ─────────────────────────────────────────────────────────────
function GlobalStyles({ t, dark }) {
    return (
        <style id="adm-styles">{`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
            html,body{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;-webkit-font-smoothing:antialiased;}
            body{background:${t.bg}!important;color:${t.text}!important;}
            ::-webkit-scrollbar{width:5px;height:5px;}
            ::-webkit-scrollbar-track{background:transparent;}
            ::-webkit-scrollbar-thumb{background:${dark?'#2D3748':'#B8C4D0'};border-radius:4px;}

            .adm-card{
                background:${t.card}!important;
                border:1.5px solid ${t.border}!important;
                border-radius:14px;
                box-shadow:${t.cardShadow};
                transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease;
            }
            .adm-card:hover{
                border-color:${t.borderHover}!important;
                box-shadow:0 8px 28px rgba(${t.accentRgb},.1);
            }

            .adm-btn-primary{
                background:linear-gradient(135deg,${t.accent} 0%,${t.accentEnd} 100%)!important;
                color:#fff!important;border:none;border-radius:9px;
                padding:9px 20px;font-size:13px;font-weight:600;
                cursor:pointer;transition:all .18s;
                box-shadow:0 3px 10px rgba(${t.accentRgb},.28);
                font-family:inherit;display:inline-flex;align-items:center;justify-content:center;
            }
            .adm-btn-primary:hover{transform:translateY(-1px);box-shadow:0 5px 16px rgba(${t.accentRgb},.42);}

            .adm-btn-ghost{
                background:transparent!important;color:${t.textMuted}!important;
                border:1.5px solid ${t.border}!important;border-radius:9px;
                padding:9px 20px;font-size:13px;font-weight:600;
                cursor:pointer;transition:all .18s;font-family:inherit;
                display:inline-flex;align-items:center;justify-content:center;
            }
            .adm-btn-ghost:hover{background:${t.navHover}!important;color:${t.text}!important;border-color:${t.borderHover}!important;}

            .adm-input{
                width:100%;background:${t.input}!important;color:${t.text}!important;
                border:1.5px solid ${t.inputBorder}!important;border-radius:9px;
                padding:9px 13px;font-size:13px;outline:none;
                font-family:inherit;transition:border-color .18s,box-shadow .18s;box-sizing:border-box;
            }
            .adm-input:focus{border-color:${t.accent}!important;box-shadow:0 0 0 3px rgba(${t.accentRgb},.14)!important;}
            .adm-input::placeholder{color:${t.textDim}!important;}
            textarea.adm-input{resize:vertical;line-height:1.6;}
            select.adm-input{cursor:pointer;}
            select.adm-input option{background:${t.card};color:${t.text};}

            .adm-label{display:block;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:${t.textMuted};margin-bottom:5px;}

            .adm-badge{display:inline-flex;align-items:center;gap:4px;border-radius:5px;padding:2px 8px;font-size:11px;font-weight:700;white-space:nowrap;}
            .adm-badge-green {background:rgba(16,185,129,.14);color:${dark?'#34D399':'#059669'};}
            .adm-badge-blue  {background:rgba(${t.accentRgb},.14);color:${t.accent};}
            .adm-badge-orange{background:rgba(245,158,11,.14);color:${dark?'#FCD34D':'#D97706'};}
            .adm-badge-red   {background:rgba(239,68,68,.14);color:${dark?'#FCA5A5':'#DC2626'};}
            .adm-badge-cyan  {background:rgba(6,182,212,.14);color:${dark?'#67E8F9':'#0891B2'};}

            .adm-sidebar-link{text-decoration:none!important;display:block;}
            .adm-nav-item{transition:all .14s ease;}
            .adm-sidebar-link:hover .adm-nav-item:not(.adm-nav-active){background:rgba(99,102,241,.1)!important;color:#CBD5E1!important;}
            .adm-nav-active{background:linear-gradient(135deg,${t.accent} 0%,${t.accentEnd} 100%)!important;color:#fff!important;box-shadow:0 3px 10px rgba(${t.accentRgb},.3)!important;}

            .adm-section-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${t.sidebarGroupLabel};padding:10px 10px 4px;}
            .adm-divider{height:1px;background:${dark?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.07)'};margin:6px 4px;}

            .adm-table-header{background:${dark?'rgba(255,255,255,0.03)':'rgba(0,0,0,0.03)'}!important;}
            .adm-table-row:hover{background:${t.rowHover}!important;}

            @keyframes adm-fade-in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
            .adm-page{animation:adm-fade-in .22s ease;}
        `}</style>
    );
}
