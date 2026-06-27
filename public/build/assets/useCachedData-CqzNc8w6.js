import{r as a,j as e,u as k,L as m}from"./app-VP8xY1Wm.js";const j={dark:{bg:"#0F172A",card:"#1E293B",cardSolid:"#1E293B",border:"rgba(255,255,255,0.07)",borderHover:"rgba(99,102,241,0.5)",text:"#F1F5F9",textMuted:"#CBD5E1",textDim:"#94A3B8",accent:"#6366F1",accentEnd:"#8B5CF6",accentRgb:"99,102,241",sidebar:"#0F172A",sidebarBorder:"rgba(255,255,255,0.07)",sidebarText:"#CBD5E1",sidebarGroupLabel:"#64748B",topbar:"rgba(15,23,42,0.97)",input:"#1E293B",inputBorder:"rgba(255,255,255,0.1)",navHover:"rgba(99,102,241,0.1)",cardShadow:"0 2px 8px rgba(0,0,0,0.4)",rowHover:"rgba(99,102,241,0.06)",success:"#10B981",warning:"#F59E0B",danger:"#EF4444",info:"#06B6D4"},light:{bg:"#F5F7FA",card:"#FFFFFF",cardSolid:"#FFFFFF",border:"#E8ECF0",borderHover:"rgba(99,102,241,0.35)",text:"#1A1A2E",textMuted:"#64748B",textDim:"#9CA3AF",accent:"#6366F1",accentEnd:"#8B5CF6",accentRgb:"99,102,241",sidebar:"#1E293B",sidebarBorder:"rgba(255,255,255,0.07)",sidebarText:"#CBD5E1",sidebarGroupLabel:"#94A3B8",topbar:"#FFFFFF",input:"#F8F9FC",inputBorder:"#E2E6ED",navHover:"rgba(99,102,241,0.06)",cardShadow:"0 1px 4px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.04)",rowHover:"rgba(99,102,241,0.04)",success:"#059669",warning:"#D97706",danger:"#DC2626",info:"#0891B2"}},B=a.createContext({dark:!0,toggle:()=>{},t:j.dark}),$=()=>a.useContext(B),S=[{group:"Dashboard",items:[{label:"Overview",routeName:"admin.dashboard",href:"/admin/dashboard",icon:e.jsxs("svg",{width:"15",height:"15",fill:"none",stroke:"currentColor",strokeWidth:"1.8",viewBox:"0 0 24 24",children:[e.jsx("rect",{x:"3",y:"3",width:"7",height:"7",rx:"1.5"}),e.jsx("rect",{x:"14",y:"3",width:"7",height:"7",rx:"1.5"}),e.jsx("rect",{x:"3",y:"14",width:"7",height:"7",rx:"1.5"}),e.jsx("rect",{x:"14",y:"14",width:"7",height:"7",rx:"1.5"})]})}]},{group:"Content",items:[{label:"Projects",routeName:"admin.projects",href:"/admin/projects",icon:e.jsx("svg",{width:"15",height:"15",fill:"none",stroke:"currentColor",strokeWidth:"1.8",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"})})},{label:"Skills",routeName:"admin.skills",href:"/admin/skills",icon:e.jsxs("svg",{width:"15",height:"15",fill:"none",stroke:"currentColor",strokeWidth:"1.8",viewBox:"0 0 24 24",children:[e.jsx("polyline",{points:"16 18 22 12 16 6"}),e.jsx("polyline",{points:"8 6 2 12 8 18"})]})},{label:"Services",routeName:"admin.services",href:"/admin/services",icon:e.jsxs("svg",{width:"15",height:"15",fill:"none",stroke:"currentColor",strokeWidth:"1.8",viewBox:"0 0 24 24",children:[e.jsx("rect",{x:"2",y:"7",width:"20",height:"14",rx:"2"}),e.jsx("path",{d:"M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"})]})},{label:"Journey",routeName:"admin.experiences",href:"/admin/experiences",icon:e.jsxs("svg",{width:"15",height:"15",fill:"none",stroke:"currentColor",strokeWidth:"1.8",viewBox:"0 0 24 24",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("polyline",{points:"12 6 12 12 16 14"})]})}]},{group:"Communication",items:[{label:"Messages",routeName:"admin.messages",href:"/admin/messages",icon:e.jsx("svg",{width:"15",height:"15",fill:"none",stroke:"currentColor",strokeWidth:"1.8",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"})})}]},{group:"Settings",items:[{label:"Profile",routeName:"admin.profile",href:"/admin/profile",icon:e.jsxs("svg",{width:"15",height:"15",fill:"none",stroke:"currentColor",strokeWidth:"1.8",viewBox:"0 0 24 24",children:[e.jsx("path",{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"12",cy:"7",r:"4"})]})}]}];function E(){const[r,i]=a.useState(()=>window.innerWidth<768),[n,p]=a.useState(()=>window.innerWidth<1024);return a.useEffect(()=>{const t=()=>{i(window.innerWidth<768),p(window.innerWidth<1024)};return window.addEventListener("resize",t),()=>window.removeEventListener("resize",t)},[]),{isMobile:r,isTablet:n}}function W({t:r,dark:i}){return a.useEffect(()=>{let n=document.getElementById("adm-styles");n||(n=document.createElement("style"),n.id="adm-styles",document.head.appendChild(n)),n.textContent=`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
            html,body{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;-webkit-font-smoothing:antialiased;}
            body{background:${r.bg}!important;color:${r.text}!important;}
            ::-webkit-scrollbar{width:5px;height:5px;}
            ::-webkit-scrollbar-track{background:transparent;}
            ::-webkit-scrollbar-thumb{background:${i?"#334155":"#D1D5DB"};border-radius:4px;}

            /* ── Cards ── */
            .adm-card{
                background:${r.card}!important;
                color:${r.text}!important;
                border:1px solid ${r.border}!important;
                border-radius:12px;
                box-shadow:${r.cardShadow};
                transition:border-color .15s ease, box-shadow .15s ease;
            }
            .adm-card:hover{
                border-color:${r.borderHover}!important;
                box-shadow:${i?"0 8px 28px rgba(99,102,241,.12)":"0 4px 16px rgba(0,0,0,0.1), 0 0 1px rgba(0,0,0,0.04)"}!important;
            }

            /* ── Buttons ── */
            .adm-btn-primary{
                background:linear-gradient(135deg,${r.accent} 0%,${r.accentEnd} 100%)!important;
                color:#fff!important;border:none;border-radius:8px;padding:8px 18px;
                font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;
                box-shadow:0 2px 8px rgba(${r.accentRgb},.25);
                font-family:inherit;display:inline-flex;align-items:center;justify-content:center;gap:6px;
            }
            .adm-btn-primary:hover{opacity:.92;box-shadow:0 4px 14px rgba(${r.accentRgb},.35);}
            .adm-btn-ghost{
                background:${i?"transparent":"#FFFFFF"}!important;
                color:${i?"#CBD5E1":"#374151"}!important;
                border:1px solid ${r.border}!important;
                border-radius:8px;padding:8px 18px;font-size:13px;font-weight:600;
                cursor:pointer;transition:all .15s;font-family:inherit;
                display:inline-flex;align-items:center;justify-content:center;gap:6px;
            }
            .adm-btn-ghost:hover{background:${i?"rgba(255,255,255,.05)":"#F8F9FC"}!important;border-color:${r.borderHover}!important;}

            /* ── Inputs ── */
            .adm-input{
                width:100%;
                background:${i?r.input:"#FFFFFF"}!important;
                color:${r.text}!important;
                border:1px solid ${r.inputBorder}!important;
                border-radius:8px;padding:8px 12px;font-size:13px;
                outline:none;font-family:inherit;
                transition:border-color .15s,box-shadow .15s;box-sizing:border-box;
                line-height:1.6;
            }
            .adm-input:focus{border-color:${r.accent}!important;box-shadow:0 0 0 3px rgba(${r.accentRgb},.12)!important;}
            .adm-input::placeholder{color:${r.textDim}!important;}
            textarea.adm-input{resize:vertical;line-height:1.6;}
            select.adm-input{cursor:pointer;}
            select.adm-input option{background:${r.card};color:${r.text};}

            /* ── Labels ── */
            .adm-label{
                display:block;font-size:11px;font-weight:700;
                text-transform:uppercase;letter-spacing:.06em;
                color:${i?"#94A3B8":"#6B7280"};margin-bottom:6px;
            }

            /* ── Badges ── */
            .adm-badge{display:inline-flex;align-items:center;gap:4px;border-radius:5px;padding:2px 8px;font-size:11px;font-weight:700;white-space:nowrap;}
            .adm-badge-green{background:${i?"rgba(16,185,129,.18)":"rgba(5,150,105,.09)"};color:${i?"#6EE7B7":"#065f46"};}
            .adm-badge-blue{background:rgba(${r.accentRgb},.12);color:${i?"#A5B4FC":"#4338CA"};}
            .adm-badge-orange{background:${i?"rgba(245,158,11,.18)":"rgba(217,119,6,.09)"};color:${i?"#FCD34D":"#92400e"};}
            .adm-badge-red{background:${i?"rgba(239,68,68,.18)":"rgba(220,38,38,.08)"};color:${i?"#FCA5A5":"#991b1b"};}
            .adm-badge-cyan{background:${i?"rgba(6,182,212,.18)":"rgba(8,145,178,.09)"};color:${i?"#67E8F9":"#0c4a6e"};}

            /* ── Sidebar (always dark) ── */
            .adm-sidebar-link{text-decoration:none!important;display:block;}
            .adm-nav-item{transition:all .14s ease;}
            .adm-sidebar-link:hover .adm-nav-item:not(.adm-nav-active){background:rgba(99,102,241,.12)!important;color:#E2E8F0!important;}
            .adm-nav-active{background:linear-gradient(135deg,${r.accent} 0%,${r.accentEnd} 100%)!important;color:#fff!important;box-shadow:0 2px 8px rgba(${r.accentRgb},.28)!important;}
            .adm-section-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${i?r.sidebarGroupLabel:"#64748B"};padding:10px 10px 4px;}
            .adm-divider{height:1px;background:${i?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.06)"};margin:6px 4px;}

            /* ── Table ── */
            .adm-table-header{background:${i?"rgba(255,255,255,0.04)":"#F8F9FB"}!important;}
            .adm-table-row:hover{background:${i?"rgba(99,102,241,.07)":"rgba(99,102,241,.04)"}!important;}

            /* ── Animation ── */
            @keyframes adm-fade-in{from{opacity:0;transform:translateY(5px);}to{opacity:1;transform:translateY(0);}}
            .adm-page{animation:adm-fade-in .2s ease;}

            /* ── Responsive grids ── */
            .adm-grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;}
            .adm-grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
            .adm-grid-3{display:grid;grid-template-columns:1fr 1fr 260px;gap:14px;}
            .adm-grid-3-equal{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}

            @media(max-width:1100px){
                .adm-grid-4{grid-template-columns:repeat(2,1fr);}
                .adm-grid-3{grid-template-columns:1fr 1fr;}
                .adm-grid-3-equal{grid-template-columns:repeat(2,1fr);}
            }
            @media(max-width:640px){
                .adm-grid-2{grid-template-columns:1fr;}
                .adm-grid-4{grid-template-columns:1fr 1fr;}
                .adm-grid-3{grid-template-columns:1fr;}
                .adm-grid-3-equal{grid-template-columns:1fr;}
                .adm-btn-primary,.adm-btn-ghost{padding:7px 14px;font-size:12px;}
            }
            @media(max-width:420px){
                .adm-grid-4{grid-template-columns:1fr;}
            }

            /* ── Sidebar overlay ── */
            .adm-sidebar-overlay{
                display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:190;
                backdrop-filter:blur(2px);
            }
            .adm-sidebar-overlay.open{display:block;}

            /* ── Mobile sidebar drawer ── */
            @media(max-width:767px){
                .adm-sidebar-desktop{display:none!important;}
                .adm-sidebar-mobile{
                    position:fixed;left:0;top:0;bottom:0;z-index:200;
                    transform:translateX(-100%);transition:transform .25s ease;
                    width:220px!important;
                }
                .adm-sidebar-mobile.open{transform:translateX(0);}
            }
            @media(min-width:768px){
                .adm-sidebar-mobile{display:none!important;}
                .adm-hamburger{display:none!important;}
            }

            /* ── Topbar responsive ── */
            .adm-topbar-search{flex:1;max-width:320px;margin:0 auto;position:relative;}
            @media(max-width:640px){
                .adm-topbar-search{display:none;}
                .adm-topbar-title-sub{display:none;}
                .adm-topbar-user-name{display:none;}
            }

            /* ── Main content padding ── */
            @media(max-width:640px){
                .adm-main-content{padding:14px 12px!important;}
            }
        `},[r,i]),null}function C({collapsed:r,setCollapsed:i,onClose:n,unreadCount:p,t}){const{url:x}=k();return e.jsxs("div",{style:{width:"100%",height:"100%",background:t.sidebar,display:"flex",flexDirection:"column",borderRight:`1px solid ${t.sidebarBorder}`,overflow:"hidden"},children:[e.jsxs("div",{style:{padding:"16px 12px",borderBottom:`1px solid ${t.sidebarBorder}`,flexShrink:0},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"9px"},children:[e.jsx("div",{style:{width:"34px",height:"34px",flexShrink:0,background:`linear-gradient(135deg,${t.accent},${t.accentEnd})`,borderRadius:"9px",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:"800",fontSize:"13px"},children:"SM"}),!r&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:{flex:1,overflow:"hidden"},children:[e.jsx("div",{style:{color:"#F1F5F9",fontWeight:"700",fontSize:"13px",whiteSpace:"nowrap"},children:"Portfolio CMS"}),e.jsx("div",{style:{color:t.sidebarGroupLabel,fontSize:"10px",marginTop:"1px",whiteSpace:"nowrap"},children:"Admin Dashboard"})]}),i&&e.jsx("button",{onClick:()=>i(!0),style:{background:"none",border:"none",color:t.sidebarGroupLabel,cursor:"pointer",padding:"3px",lineHeight:0,flexShrink:0},children:e.jsx("svg",{width:"13",height:"13",fill:"none",stroke:"currentColor",strokeWidth:"2",viewBox:"0 0 24 24",children:e.jsx("path",{d:"m15 18-6-6 6-6"})})}),n&&e.jsx("button",{onClick:n,style:{background:"none",border:"none",color:t.sidebarGroupLabel,cursor:"pointer",padding:"3px",lineHeight:0,flexShrink:0},children:e.jsx("svg",{width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M18 6 6 18M6 6l12 12"})})})]})]}),r&&i&&e.jsx("button",{onClick:()=>i(!1),style:{marginTop:"10px",background:"none",border:"none",color:t.sidebarGroupLabel,cursor:"pointer",width:"100%",display:"flex",justifyContent:"center",lineHeight:0},children:e.jsx("svg",{width:"13",height:"13",fill:"none",stroke:"currentColor",strokeWidth:"2",viewBox:"0 0 24 24",children:e.jsx("path",{d:"m9 18 6-6-6-6"})})})]}),e.jsx("nav",{style:{flex:1,padding:"8px 6px",overflowY:"auto",overflowX:"hidden"},children:S.map(o=>e.jsxs("div",{style:{marginBottom:"4px"},children:[!r&&e.jsx("div",{style:{padding:"8px 10px 3px",fontSize:"10px",fontWeight:"700",letterSpacing:".1em",color:t.sidebarGroupLabel},children:o.group}),o.items.map(d=>{const s=x.startsWith(d.href);return e.jsx(m,{href:route(d.routeName),className:"adm-sidebar-link",title:r?d.label:void 0,onClick:n,children:e.jsxs("div",{className:s?"":"adm-nav-item",style:{display:"flex",alignItems:"center",gap:"8px",justifyContent:r?"center":"flex-start",padding:r?"9px 0":"8px 10px",borderRadius:"9px",marginBottom:"1px",color:s?"#fff":t.sidebarText,fontWeight:s?"600":"400",fontSize:"13px",background:s?`linear-gradient(135deg,${t.accent},${t.accentEnd})`:"transparent",boxShadow:s?`0 3px 10px rgba(${t.accentRgb},.28)`:"none",transition:"all .14s ease",position:"relative"},children:[e.jsx("span",{style:{flexShrink:0,opacity:s?1:.6,lineHeight:0},children:d.icon}),!r&&e.jsx("span",{style:{flex:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:d.label}),!r&&d.routeName==="admin.messages"&&p>0&&e.jsx("span",{style:{background:"#EF4444",color:"#fff",borderRadius:"10px",padding:"1px 6px",fontSize:"10px",fontWeight:"700",lineHeight:1.4},children:p})]})},d.routeName)})]},o.group))}),e.jsxs("div",{style:{padding:"8px 6px",borderTop:`1px solid ${t.sidebarBorder}`,flexShrink:0},children:[e.jsx(m,{href:route("home"),style:{textDecoration:"none",display:"block"},onClick:n,children:e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:r?"center":"flex-start",gap:"7px",padding:"7px 10px",borderRadius:"8px",color:t.textDim,fontSize:"12px",fontWeight:"500",marginBottom:"4px",cursor:"pointer",transition:"all .14s"},onMouseEnter:o=>{o.currentTarget.style.background="rgba(255,255,255,0.05)",o.currentTarget.style.color="#CBD5E1"},onMouseLeave:o=>{o.currentTarget.style.background="transparent",o.currentTarget.style.color=t.textDim},children:[e.jsxs("svg",{width:"13",height:"13",fill:"none",stroke:"currentColor",strokeWidth:"2",viewBox:"0 0 24 24",children:[e.jsx("path",{d:"m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"}),e.jsx("polyline",{points:"9 22 9 12 15 12 15 22"})]}),!r&&"View Portfolio"]})}),e.jsx(m,{href:route("logout"),method:"post",as:"button",style:{width:"100%",background:"none",border:"none",padding:0,display:"block",cursor:"pointer"},children:e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:r?"center":"flex-start",gap:"7px",padding:"7px 10px",borderRadius:"8px",color:"#EF4444",fontSize:"12px",fontWeight:"600",cursor:"pointer",background:"rgba(239,68,68,0.07)",border:"1px solid rgba(239,68,68,0.1)",transition:"all .14s"},onMouseEnter:o=>o.currentTarget.style.background="rgba(239,68,68,0.14)",onMouseLeave:o=>o.currentTarget.style.background="rgba(239,68,68,0.07)",children:[e.jsxs("svg",{width:"13",height:"13",fill:"none",stroke:"currentColor",strokeWidth:"2",viewBox:"0 0 24 24",children:[e.jsx("path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"}),e.jsx("polyline",{points:"16 17 21 12 16 7"}),e.jsx("line",{x1:"21",y1:"12",x2:"9",y2:"12"})]}),!r&&"Sign Out"]})})]})]})}const z=S.flatMap(r=>r.items);function M({title:r,sidebarWidth:i,profile:n,unreadCount:p,t,dark:x,onHamburger:o}){const{auth:d}=k().props,{dark:s,toggle:b}=$(),[g,u]=a.useState(""),[w,l]=a.useState(!1),f=a.useRef(null);a.useEffect(()=>{function c(y){f.current&&!f.current.contains(y.target)&&l(!1)}return document.addEventListener("mousedown",c),()=>document.removeEventListener("mousedown",c)},[]);const v=g.trim()?z.filter(c=>c.label.toLowerCase().includes(g.toLowerCase())):[],F=n?.avatar?n.avatar.startsWith("http")?n.avatar:"/"+n.avatar:null;return e.jsxs("div",{style:{position:"fixed",top:0,left:i,right:0,zIndex:150,height:"60px",background:x?t.topbar:"#FFFFFF",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",borderBottom:`1px solid ${t.border}`,display:"flex",alignItems:"center",padding:"0 16px",gap:"10px",transition:"left .22s ease"},children:[e.jsx("button",{className:"adm-hamburger",onClick:o,style:{background:"none",border:"none",color:t.textMuted,cursor:"pointer",padding:"6px",lineHeight:0,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"8px",flexShrink:0},children:e.jsxs("svg",{width:"18",height:"18",fill:"none",stroke:"currentColor",strokeWidth:"2",viewBox:"0 0 24 24",children:[e.jsx("line",{x1:"3",y1:"6",x2:"21",y2:"6"}),e.jsx("line",{x1:"3",y1:"12",x2:"21",y2:"12"}),e.jsx("line",{x1:"3",y1:"18",x2:"21",y2:"18"})]})}),e.jsxs("div",{style:{flexShrink:0},children:[e.jsx("div",{style:{fontSize:"15px",fontWeight:"700",color:t.text,lineHeight:1.2},children:r}),e.jsxs("div",{className:"adm-topbar-title-sub",style:{fontSize:"11px",color:t.textMuted,marginTop:"1px"},children:["Home ",e.jsx("span",{style:{opacity:.4,margin:"0 3px"},children:"›"}),e.jsx("span",{style:{color:t.accent},children:r})]})]}),e.jsxs("div",{ref:f,className:"adm-topbar-search",children:[e.jsx("span",{style:{position:"absolute",left:"11px",top:"50%",transform:"translateY(-50%)",color:t.textDim,lineHeight:0},children:e.jsxs("svg",{width:"13",height:"13",fill:"none",stroke:"currentColor",strokeWidth:"2",viewBox:"0 0 24 24",children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("path",{d:"m21 21-4.35-4.35"})]})}),e.jsx("input",{placeholder:"Search pages…",value:g,onChange:c=>{u(c.target.value),l(!0)},onFocus:()=>l(!0),style:{width:"100%",background:t.input,border:`1.5px solid ${t.inputBorder}`,borderRadius:"50px",padding:"7px 40px 7px 30px",fontSize:"12px",color:t.text,outline:"none",fontFamily:"inherit"}}),w&&g.trim()&&e.jsxs("div",{style:{position:"absolute",top:"100%",left:0,right:0,marginTop:"6px",background:t.cardSolid,border:`1px solid ${t.border}`,borderRadius:"12px",boxShadow:"0 12px 40px rgba(0,0,0,0.3)",padding:"6px",zIndex:300},children:[v.length===0&&e.jsx("div",{style:{padding:"12px 14px",fontSize:"12px",color:t.textMuted,textAlign:"center"},children:"No pages found"}),v.map(c=>e.jsxs(m,{href:route(c.routeName),onClick:()=>{u(""),l(!1)},style:{display:"flex",alignItems:"center",gap:"10px",padding:"9px 12px",borderRadius:"8px",color:t.text,textDecoration:"none",fontSize:"13px",fontWeight:"500",transition:"background 0.12s"},onMouseEnter:y=>y.currentTarget.style.background=t.navHover,onMouseLeave:y=>y.currentTarget.style.background="transparent",children:[e.jsx("span",{style:{opacity:.5,lineHeight:0,flexShrink:0},children:c.icon}),c.label]},c.routeName))]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px",marginLeft:"auto"},children:[e.jsx("button",{onClick:b,title:s?"Switch to Light":"Switch to Dark",style:{width:"32px",height:"32px",borderRadius:"9px",background:t.input,border:`1.5px solid ${t.inputBorder}`,color:t.textMuted,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:0},children:s?e.jsxs("svg",{width:"13",height:"13",fill:"none",stroke:"currentColor",strokeWidth:"2",viewBox:"0 0 24 24",children:[e.jsx("circle",{cx:"12",cy:"12",r:"5"}),e.jsx("line",{x1:"12",y1:"1",x2:"12",y2:"3"}),e.jsx("line",{x1:"12",y1:"21",x2:"12",y2:"23"}),e.jsx("line",{x1:"4.22",y1:"4.22",x2:"5.64",y2:"5.64"}),e.jsx("line",{x1:"18.36",y1:"18.36",x2:"19.78",y2:"19.78"}),e.jsx("line",{x1:"1",y1:"12",x2:"3",y2:"12"}),e.jsx("line",{x1:"21",y1:"12",x2:"23",y2:"12"}),e.jsx("line",{x1:"4.22",y1:"19.78",x2:"5.64",y2:"18.36"}),e.jsx("line",{x1:"18.36",y1:"5.64",x2:"19.78",y2:"4.22"})]}):e.jsx("svg",{width:"13",height:"13",fill:"none",stroke:"currentColor",strokeWidth:"2",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"})})}),e.jsxs("div",{style:{position:"relative"},children:[e.jsx(m,{href:route("admin.messages"),style:{width:"32px",height:"32px",borderRadius:"9px",background:t.input,border:`1.5px solid ${t.inputBorder}`,color:t.textMuted,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:0,textDecoration:"none"},children:e.jsxs("svg",{width:"13",height:"13",fill:"none",stroke:"currentColor",strokeWidth:"2",viewBox:"0 0 24 24",children:[e.jsx("path",{d:"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"}),e.jsx("path",{d:"M13.73 21a2 2 0 0 1-3.46 0"})]})}),p>0&&e.jsx("span",{style:{position:"absolute",top:"-4px",right:"-4px",background:"#EF4444",color:"#fff",borderRadius:"10px",padding:"0 5px",fontSize:"9px",fontWeight:"700",lineHeight:"16px",border:`2px solid ${t.topbar}`},children:p})]}),e.jsxs(m,{href:route("admin.profile"),style:{textDecoration:"none",display:"flex",alignItems:"center",gap:"6px",padding:"4px 10px 4px 4px",borderRadius:"50px",background:t.input,border:`1.5px solid ${t.inputBorder}`,cursor:"pointer"},children:[e.jsx("div",{style:{width:"28px",height:"28px",borderRadius:"50%",overflow:"hidden",flexShrink:0,border:`2px solid rgba(${t.accentRgb},.4)`},children:F?e.jsx("img",{src:F,alt:"avatar",style:{width:"100%",height:"100%",objectFit:"cover"}}):e.jsx("div",{style:{width:"100%",height:"100%",background:`linear-gradient(135deg,${t.accent},${t.accentEnd})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:"11px",fontWeight:"700"},children:d?.user?.name?.[0]?.toUpperCase()||"A"})}),e.jsx("span",{className:"adm-topbar-user-name",style:{fontSize:"12px",fontWeight:"600",color:t.text,whiteSpace:"nowrap"},children:d?.user?.name})]})]})]})}function R({children:r,title:i="Dashboard"}){const[n,p]=a.useState(!1),[t,x]=a.useState(!1),{isMobile:o}=E(),d=o?"0px":n?"60px":"210px",{auth:s,profile:b,unreadCount:g}=k().props,[u,w]=a.useState(()=>localStorage.getItem("admin-theme")==="dark"),l=u?j.dark:j.light;a.useEffect(()=>{o||x(!1)},[o]),a.useEffect(()=>(document.body.style.overflow=t?"hidden":"",()=>{document.body.style.overflow=""}),[t]);function f(){w(v=>!v)}return e.jsxs(B.Provider,{value:{dark:u,toggle:f,t:l},children:[e.jsx(W,{t:l,dark:u}),e.jsxs("div",{style:{display:"flex",minHeight:"100vh",background:l.bg},children:[e.jsx("aside",{className:"adm-sidebar-desktop",style:{width:n?"60px":"210px",minHeight:"100vh",position:"fixed",left:0,top:0,bottom:0,zIndex:200,transition:"width .22s ease"},children:e.jsx(C,{collapsed:n,setCollapsed:p,onClose:null,unreadCount:g||0,t:l})}),e.jsx("div",{className:`adm-sidebar-overlay${t?" open":""}`,onClick:()=>x(!1)}),e.jsx("aside",{className:`adm-sidebar-mobile${t?" open":""}`,children:e.jsx(C,{collapsed:!1,setCollapsed:null,onClose:()=>x(!1),unreadCount:g||0,t:l})}),e.jsxs("div",{style:{marginLeft:d,flex:1,display:"flex",flexDirection:"column",transition:"margin-left .22s ease",minWidth:0},children:[e.jsx(M,{title:i,sidebarWidth:d,profile:b,unreadCount:g||0,t:l,dark:u,onHamburger:()=>x(!0)}),e.jsx("main",{className:"adm-main-content",style:{marginTop:"60px",flex:1,padding:"22px 26px",background:l.bg},children:e.jsx("div",{className:"adm-page",children:r})})]})]})]})}const h=new Map;function H(r,i){const n=a.useRef(i);n.current=i;const[p,t]=a.useState(()=>{if(h.has(r))return h.get(r)}),[x,o]=a.useState(!h.has(r));a.useEffect(()=>{if(h.has(r)){t(h.get(r)),o(!1);return}let s=!0;return o(!0),n.current().then(b=>{s&&(h.set(r,b),t(b),o(!1))}),()=>{s=!1}},[r]);const d=a.useCallback(()=>(h.delete(r),o(!0),n.current().then(s=>(h.set(r,s),t(s),o(!1),s))),[r]);return{data:p,loading:x,refresh:d}}export{R as A,H as a,$ as u};
