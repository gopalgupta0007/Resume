import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/* ─────────────────────────────────────────────────────────────
   RESUME 2 — Premium Navy/Gold  (injected once into <head>)
───────────────────────────────────────────────────────────── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

  :root {
    --navy:         #08121f;
    --navy-2:       #0d1e34;
    --navy-3:       #112440;
    --navy-4:       #1a3155;
    --gold:         #c5a356;
    --gold-bright:  #e0bc78;
    --gold-light:   #eed99a;
    --gold-pale:    #fdf6e3;
    --gold-border:  rgba(197,163,86,.28);
    --white:        #ffffff;
    --off-white:    #f9f7f3;
    --bg-outer:     #edeae4;
    --border:       #e4dfd5;
    --border-soft:  #ede9e2;
    --text:         #080f1a;
    --text-mid:     #2e3d52;
    --text-muted:   #5c6d80;
    --text-light:   #8c9aaa;
    --green:        #156a3e;
    --green-bg:     #ebf7f2;
    --green-border: #9fd3b8;
  }
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif; background:var(--bg-outer); -webkit-font-smoothing:antialiased; color:var(--text); }

  .rw-shell { max-width:940px; margin:0 auto; padding:32px 18px 64px; }
  .rw-page  { background:var(--white); margin-bottom:28px; overflow:hidden; box-shadow:0 1px 2px rgba(8,18,31,.05),0 6px 16px rgba(8,18,31,.08),0 24px 56px rgba(8,18,31,.12); }

  /* HEADER */
  .rw-header { background:linear-gradient(150deg,var(--navy) 0%,var(--navy-3) 55%,var(--navy-4) 100%); padding:36px 44px 26px; position:relative; overflow:hidden; }
  .rw-header .arc { position:absolute; border-radius:50%; pointer-events:none; border:1px solid rgba(197,163,86,.10); }
  .rw-header .arc-1 { width:340px; height:340px; top:-120px; right:-100px; }
  .rw-header .arc-2 { width:220px; height:220px; top:-60px;  right:-40px;  border-color:rgba(197,163,86,.07); }
  .rw-header .arc-3 { width:120px; height:120px; top:-10px;  right:30px;   border-color:rgba(197,163,86,.05); }
  .rw-header-row { display:flex; justify-content:space-between; align-items:flex-start; gap:20px; margin-bottom:20px; }
  .rw-name  { font-family:'Cormorant Garamond',Georgia,serif; font-size:44px; font-weight:700; color:var(--white); letter-spacing:.4px; line-height:1; }
  .rw-title { font-size:10.5px; font-weight:500; letter-spacing:3px; text-transform:uppercase; color:var(--gold-bright); margin-top:8px; }
  .rw-exp-pill { background:var(--gold); color:var(--navy); padding:11px 20px; text-align:center; flex-shrink:0; display:flex; flex-direction:column; align-items:center; }
  .rw-exp-pill .years     { font-family:'Cormorant Garamond',serif; font-size:30px; font-weight:700; line-height:1; }
  .rw-exp-pill .yrs-label { font-size:8.5px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; margin-top:2px; }
  .rw-gold-rule { height:1px; background:linear-gradient(90deg,transparent 0%,rgba(197,163,86,.45) 40%,rgba(197,163,86,.45) 60%,transparent 100%); margin-bottom:16px; }
  .rw-contacts { display:flex; flex-wrap:wrap; gap:6px 18px; }
  .rw-contact  { display:flex; align-items:center; gap:6px; font-size:10.5px; color:rgba(255,255,255,.65); }
  .rw-contact svg { color:var(--gold); flex-shrink:0; }
  .rw-contact a   { color:var(--gold-light); text-decoration:none; }

  /* PROFILE STRIP */
  .rw-profile-strip   { background:var(--off-white); border-bottom:1px solid var(--border); padding:14px 44px; display:flex; align-items:center; gap:16px; }
  .rw-profile-accent  { width:3px; height:36px; flex-shrink:0; background:linear-gradient(180deg,var(--gold) 0%,var(--gold-bright) 100%); }
  .rw-profile-text    { font-size:11.5px; line-height:1.6; color:var(--text-muted); font-style:italic; letter-spacing:.1px; }
  .rw-profile-text b  { color:var(--text-mid); font-style:normal; font-weight:600; }

  /* BODY GRID */
  .rw-body { display:grid; grid-template-columns:218px 1fr; min-height:680px; }

  /* SIDEBAR */
  .rw-sidebar    { background:var(--navy-2); padding:24px 20px; }
  .rw-sb-section { margin-bottom:22px; }
  .rw-sb-title   { font-size:8px; font-weight:600; letter-spacing:3px; text-transform:uppercase; color:var(--gold); padding-bottom:7px; border-bottom:1px solid var(--gold-border); margin-bottom:12px; }
  .rw-edu      { margin-bottom:10px; }
  .rw-edu .deg { color:var(--white); font-weight:600; font-size:11.5px; }
  .rw-edu .sch { color:rgba(255,255,255,.45); font-size:10px; margin-top:1px; }
  .rw-edu .yr  { color:var(--gold); font-size:9.5px; margin-top:2px; font-weight:500; }
  .rw-sg       { margin-bottom:11px; }
  .rw-sg-label { color:rgba(255,255,255,.42); font-size:9.5px; font-weight:500; margin-bottom:4px; }
  .rw-tags     { display:flex; flex-wrap:wrap; gap:3px; }
  .rw-tag      { background:rgba(197,163,86,.09); color:rgba(255,255,255,.72); font-size:9px; padding:2.5px 7px; border:1px solid rgba(197,163,86,.16); letter-spacing:.15px; }
  .rw-cert     { display:flex; align-items:flex-start; gap:7px; color:rgba(255,255,255,.62); font-size:10.5px; margin-bottom:6px; line-height:1.35; }
  .rw-cert-dot { width:4px; height:4px; background:var(--gold); border-radius:50%; flex-shrink:0; margin-top:4px; }

  /* MAIN */
  .rw-main     { padding:22px 28px 22px 22px; }
  .rw-section  { margin-bottom:18px; }
  .rw-sec-hd   { display:flex; align-items:center; gap:10px; margin-bottom:12px; }
  .rw-sec-title{ font-size:8.5px; font-weight:600; letter-spacing:3px; text-transform:uppercase; color:var(--text-light); white-space:nowrap; }
  .rw-sec-line { flex:1; height:1px; background:var(--border); }
  .rw-exp      { margin-bottom:14px; padding-left:16px; position:relative; }
  .rw-exp::before { content:''; position:absolute; left:0; top:7px; width:6px; height:6px; border-radius:50%; background:var(--gold); box-shadow:0 0 0 3px rgba(197,163,86,.15); }
  .rw-exp::after  { content:''; position:absolute; left:2.5px; top:15px; bottom:-8px; width:1px; background:var(--border-soft); }
  .rw-exp:last-child::after { display:none; }
  .rw-exp-hd { display:flex; justify-content:space-between; align-items:flex-start; gap:8px; flex-wrap:wrap; margin-bottom:2px; }
  .rw-role   { font-weight:600; font-size:12.5px; color:var(--text); }
  .rw-co     { font-size:10.5px; color:var(--text-muted); margin-top:1px; }
  .rw-badge  { font-size:9.5px; font-weight:500; color:var(--text-mid); background:var(--off-white); padding:3px 8px; border:1px solid var(--border); white-space:nowrap; flex-shrink:0; line-height:1.4; }
  .rw-badge.current { color:var(--green); background:var(--green-bg); border-color:var(--green-border); }
  .rw-award  { display:inline-flex; align-items:center; gap:6px; background:linear-gradient(90deg,#fef4d8,#fffbf0); border:1px solid #d9b54a; border-left:3px solid var(--gold); color:#7a5400; font-size:10px; font-weight:600; padding:3.5px 10px; margin-bottom:5px; letter-spacing:.1px; }
  .rw-ul     { list-style:none; margin-top:3px; }
  .rw-ul li  { font-size:11px; color:var(--text-muted); padding:1.5px 0 1.5px 12px; position:relative; line-height:1.5; }
  .rw-ul li::before { content:'–'; position:absolute; left:0; color:var(--gold); font-weight:700; }
  .rw-ul b   { color:var(--text-mid); font-weight:600; }
  .rw-inpage-divider { height:1px; background:var(--border); margin:2px 0 14px; }
  .rw-stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:var(--border); border:1px solid var(--border); margin-top:4px; }
  .rw-stat   { background:var(--white); padding:10px 12px; text-align:center; }
  .rw-stat .sv { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:700; color:var(--navy); line-height:1; }
  .rw-stat .sl { font-size:8.5px; font-weight:500; letter-spacing:1px; text-transform:uppercase; color:var(--text-muted); margin-top:3px; }
  .rw-stat .sv span { font-size:14px; color:var(--gold); }

  /* PAGE 2 */
  .rw-mini-hd  { background:linear-gradient(150deg,var(--navy),var(--navy-3)); padding:13px 44px; display:flex; justify-content:space-between; align-items:center; }
  .rw-mini-name{ font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:700; color:var(--white); }
  .rw-mini-sub { font-size:9px; font-weight:500; letter-spacing:2.5px; text-transform:uppercase; color:var(--gold); }
  .rw-p2-body  { padding:24px 44px 32px; }
  .rw-proj-grid{ display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .rw-proj     { border:1px solid var(--border); padding:13px 14px; background:var(--white); position:relative; }
  .rw-proj.featured { grid-column:1/-1; border-color:var(--gold); border-left:3px solid var(--gold); background:linear-gradient(135deg,#fdf9ee 0%,var(--white) 60%); }
  .rw-feat-tag { position:absolute; top:10px; right:12px; font-size:8px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--gold); }
  .rw-proj-title { display:flex; justify-content:space-between; align-items:flex-start; gap:6px; font-weight:600; font-size:12px; color:var(--text); margin-bottom:5px; }
  .rw-proj-title a { font-size:9px; font-weight:500; color:var(--gold); text-decoration:none; white-space:nowrap; flex-shrink:0; border-bottom:1px solid rgba(197,163,86,.35); padding-bottom:1px; }
  .rw-proj-desc { font-size:11px; color:var(--text-muted); line-height:1.5; margin-bottom:7px; }
  .rw-proj-desc em { font-style:italic; color:var(--text-mid); }
  .rw-techs { display:flex; flex-wrap:wrap; gap:3px; }
  .rw-tech  { font-size:9px; font-weight:500; background:var(--off-white); color:var(--text-muted); padding:2px 7px; border:1px solid var(--border-soft); }
  .rw-cert-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-top:2px; }
  .rw-cert-card { border:1px solid var(--border); padding:9px 11px; display:flex; align-items:flex-start; gap:7px; }
  .rw-cert-card .icon-dot { width:5px; height:5px; border-radius:50%; background:var(--gold); flex-shrink:0; margin-top:4px; }
  .rw-cert-card span { font-size:10.5px; color:var(--text-muted); line-height:1.35; }
  .rw-pg-num { text-align:center; font-size:9px; letter-spacing:1.5px; color:var(--border); padding:10px 0 7px; }
  .rw-dl-wrap { display:flex; justify-content:center; margin-top:24px; }
  .rw-dl-btn  { display:inline-flex; align-items:center; gap:9px; background:var(--navy); color:var(--gold); border:1.5px solid var(--gold); padding:12px 34px; font-family:'DM Sans',sans-serif; font-size:11.5px; font-weight:600; letter-spacing:2px; text-transform:uppercase; cursor:pointer; transition:background .2s,color .2s; }
  .rw-dl-btn:hover { background:var(--gold); color:var(--navy); }

  /* TAB BAR */
  .tab-container { display:flex; justify-content:center; max-width:940px; margin:0 auto; padding:0 18px; }
  .tab-btn { padding:12px 32px; font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif; font-size:13px; font-weight:600; letter-spacing:.5px; border:none; cursor:pointer; transition:all .2s ease; background:#e2e0db; color:#5c6d80; }
  .tab-btn:first-child { border-top-left-radius:8px; }
  .tab-btn:last-child  { border-top-right-radius:8px; }
  .tab-btn.active { background:#ffffff; color:#08121f; box-shadow:0 -2px 8px rgba(8,18,31,.08); }
  .tab-btn:hover:not(.active) { background:#d8d5cf; color:#2e3d52; }
`;

/* ─────────────────────────────────────────────────────────────
   RESUME 3 — ATS-100 Design System
   Visual concept: Editorial broadsheet — strong ink-black type,
   thin cobalt rule accents, generous white space, zero decoration
   that can't be parsed. Fonts: Georgia display + Arial body.
   Signature element: thin double-rule section headers that feel
   like a quality newspaper byline, no decorative graphics.
───────────────────────────────────────────────────────────── */
const atsCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Inter:wght@300;400;500;600;700&display=swap');

  .ats-wrap {
    max-width: 860px;
    margin: 0 auto;
    padding: 32px 20px 60px;
    background: #ECEAE5;
  }

  /* PAGE CARD */
  .ats-page {
    background: #ffffff;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,.06), 0 12px 32px rgba(0,0,0,.10), 0 40px 80px rgba(0,0,0,.07);
    padding: 52px 56px 44px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 10.5pt;
    color: #111111;
    line-height: 1.5;
  }

  /* ── NAME BLOCK ── */
  .ats-name-block { margin-bottom: 14px; }

  .ats-name {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 34pt;
    font-weight: 800;
    color: #0a0a0a;
    letter-spacing: -0.5px;
    line-height: 1;
    margin-bottom: 6px;
  }

  .ats-headline {
    font-size: 10pt;
    font-weight: 600;
    color: #1a3a6b;
    letter-spacing: 1.8px;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  /* thin cobalt rule under name */
  .ats-name-rule {
    display: flex;
    align-items: center;
    gap: 0;
    margin-bottom: 12px;
  }
  .ats-name-rule .rule-thick { height: 3px; width: 48px; background: #1a3a6b; }
  .ats-name-rule .rule-thin  { flex: 1; height: 1px; background: #c8d4e8; margin-left: 6px; }

  /* CONTACT ROW */
  .ats-contacts {
    font-size: 9.5pt;
    color: #333333;
    line-height: 1.8;
  }
  .ats-contacts a { color: #1a3a6b; text-decoration: none; font-weight: 500; }

  /* ── SECTION ── */
  .ats-sec { margin-top: 18px; }

  .ats-sec-hd {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }

  .ats-sec-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 12pt;
    font-weight: 700;
    color: #0a0a0a;
    letter-spacing: .2px;
    white-space: nowrap;
    text-transform: uppercase;
    font-size: 9.5pt;
    letter-spacing: 2px;
  }

  .ats-sec-rule-left  { width: 3px; height: 14px; background: #1a3a6b; flex-shrink: 0; }
  .ats-sec-rule-right { flex: 1; height: 1px; background: #d8dfe8; }

  /* ── SUMMARY ── */
  .ats-summary {
    font-size: 10.5pt;
    color: #222222;
    line-height: 1.65;
    padding-left: 13px;
    border-left: 2px solid #dde4ef;
  }

  /* ── SKILLS GRID ── */
  .ats-skills-block { font-size: 10pt; color: #222222; line-height: 1.7; }
  .ats-skills-block .skill-row { display: flex; gap: 0; margin-bottom: 3px; }
  .ats-skills-block .skill-label { font-weight: 700; color: #0a0a0a; min-width: 136px; flex-shrink: 0; font-size: 9.5pt; }
  .ats-skills-block .skill-val   { color: #333333; font-size: 9.5pt; }

  /* ── EXPERIENCE ── */
  .ats-exp { margin-bottom: 16px; padding-left: 14px; border-left: 2px solid #e8ecf2; }
  .ats-exp.current-job { border-left-color: #1a3a6b; }

  .ats-exp-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 3px; }
  .ats-exp-co   { font-size: 11.5pt; font-weight: 700; color: #0a0a0a; }
  .ats-exp-role { font-size: 10pt; font-weight: 600; color: #1a3a6b; margin-top: 1px; }
  .ats-exp-date { font-size: 9.5pt; font-weight: 600; color: #444444; white-space: nowrap; flex-shrink: 0; text-align: right; padding-top: 2px; background: #f4f6fa; border: 1px solid #dde4ef; padding: 3px 9px; }
  .ats-exp-date.current-badge { color: #145c38; background: #edf7f2; border-color: #9fd3b8; }

  .ats-award-line { font-size: 9pt; font-weight: 700; color: #7a5400; background: #fef9e7; border-left: 3px solid #c8a96e; padding: 3px 10px; margin: 5px 0 6px; display: inline-block; }

  .ats-ul { margin: 5px 0 0 16px; padding: 0; }
  .ats-ul li { font-size: 10pt; color: #333333; line-height: 1.6; margin-bottom: 2px; list-style-type: disc; }
  .ats-ul li strong { color: #0a0a0a; font-weight: 700; }

  /* ── EDUCATION ── */
  .ats-edu-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #f0f2f5; }
  .ats-edu-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .ats-edu-deg  { font-size: 11pt; font-weight: 700; color: #0a0a0a; }
  .ats-edu-inst { font-size: 9.5pt; color: #444444; margin-top: 2px; }
  .ats-edu-gpa  { font-size: 9pt; font-weight: 700; color: #1a3a6b; background: #eef2fb; border: 1px solid #c0cfe8; padding: 1px 7px; margin-top: 3px; display: inline-block; }
  .ats-edu-right { font-size: 9.5pt; color: #444444; text-align: right; white-space: nowrap; flex-shrink: 0; }

  /* ── PROJECTS ── */
  .ats-proj { margin-bottom: 13px; padding-left: 14px; border-left: 2px solid #e8ecf2; }
  .ats-proj-title { font-size: 11pt; font-weight: 700; color: #0a0a0a; margin-bottom: 2px; }
  .ats-proj-title a { font-size: 9pt; font-weight: 500; color: #1a3a6b; text-decoration: none; margin-left: 8px; border-bottom: 1px solid #c0cfe8; padding-bottom: 1px; }
  .ats-proj-stack { font-size: 9pt; color: #1a3a6b; font-style: italic; margin-bottom: 4px; }

  /* ── CERTIFICATIONS ── */
  .ats-cert-list { margin: 4px 0 0 16px; padding: 0; }
  .ats-cert-list li { font-size: 10pt; color: #333333; line-height: 1.6; margin-bottom: 2px; list-style-type: disc; }
  .ats-cert-list li strong { color: #0a0a0a; }

  /* PAGE HEADER (page 2 repeat) */
  .ats-page2-hd { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1.5px solid #1a3a6b; }
  .ats-page2-name { font-family: 'Playfair Display', Georgia, serif; font-size: 16pt; font-weight: 700; color: #0a0a0a; }
  .ats-page2-sub  { font-size: 9pt; font-weight: 600; color: #1a3a6b; letter-spacing: 1.5px; text-transform: uppercase; }

  /* PAGE NUMBER */
  .ats-pg-num { text-align: center; font-size: 8.5pt; color: #bbbbbb; margin-top: 16px; letter-spacing: 1px; }

  /* DOWNLOAD */
  .ats-dl-wrap { display: flex; justify-content: center; margin-top: 28px; }
  .ats-dl-btn  { display: inline-flex; align-items: center; gap: 9px; background: #0a0a0a; color: #c8a96e; border: 1.5px solid #c8a96e; padding: 12px 36px; font-family: Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: background .2s, color .2s; }
  .ats-dl-btn:hover { background: #1a3a6b; border-color: #1a3a6b; color: #ffffff; }
`;

/* ── tiny SVG icon helper ── */
const Ico = ({ d, d2, s = 12 }) => (
  <svg width={s} height={s} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    {d2 && <path strokeLinecap="round" strokeLinejoin="round" d={d2} />}
  </svg>
);

/* ════════════════════════════════════════════════════════════
   RESUME 1 — Classic blue (unchanged)
════════════════════════════════════════════════════════════ */
const Resume1 = () => {
  const page1Ref = useRef(null);
  const page2Ref = useRef(null);

  const downloadPDF = async () => {
    if (!page1Ref.current || !page2Ref.current) return;
    const pdf = new jsPDF('p','mm','a4');
    const pw = pdf.internal.pageSize.getWidth();
    const ph = pdf.internal.pageSize.getHeight();
    const cap = async el => {
      const c = await html2canvas(el, { scale:3, useCORS:true, logging:false, letterRendering:true, allowTaint:false, backgroundColor:'#ffffff', windowWidth:el.scrollWidth, windowHeight:el.scrollHeight });
      return c;
    };
    try {
      const c1 = await cap(page1Ref.current);
      pdf.addImage(c1.toDataURL('image/png',1),'PNG',0,0,pw,Math.min((c1.height*pw)/c1.width,ph));
      pdf.addPage();
      const c2 = await cap(page2Ref.current);
      pdf.addImage(c2.toDataURL('image/png',1),'PNG',0,0,pw,Math.min((c2.height*pw)/c2.width,ph));
      pdf.save('gopal_gupta_classic.pdf');
    } catch(e) { console.error(e); alert('Error generating PDF.'); }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="w-full max-w-4xl mx-auto">
        {/* PAGE 1 */}
        <div ref={page1Ref} className="mb-8 bg-white shadow-lg p-8 font-sans text-gray-800">
          <header className="mb-6">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">GOPAL GUPTA</h1>
            <p className="text-center text-gray-500 text-lg mb-4">MERN Stack Developer | Software Developer</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center"><svg className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg><span>+91 9082257079</span></div>
              <div className="flex items-center"><svg className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg><span>guptagopal18082003@gmail.com</span></div>
              <div className="flex items-center"><svg className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg><a href="https://github.com/gopalgupta0007" className="text-blue-600 hover:underline">github.com/gopalgupta0007</a></div>
              <div className="flex items-center"><svg className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg><span>G.T.B Nagar, Sion Koliwada, Mumbai - 400037</span></div>
            </div>
            <div className="mt-4 h-1 w-full bg-gradient-to-r from-blue-600 to-blue-300"></div>
          </header>
          <div className="grid grid-cols-1 gap-5">
            <section><h2 className="text-xl font-bold text-blue-700 mb-3">EDUCATION</h2><div className="ml-2 pl-4 border-l-2 border-gray-200"><ul className="space-y-2"><li className="text-sm flex justify-between"><span><span className="font-medium">M.Sc. (I.T.)</span> from Mumbai University</span><span className="text-gray-600">Completed Apr 2026</span></li><li className="text-sm flex justify-between"><span><span className="font-medium">B.Sc. (I.T.)</span> from Mumbai University</span><span className="text-gray-600">Apr 2024</span></li><li className="text-sm flex justify-between"><span><span className="font-medium">HSC</span> - 74%</span><span className="text-gray-600">Mar 2021</span></li><li className="text-sm flex justify-between"><span><span className="font-medium">SSC</span> - 60%</span><span className="text-gray-600">Mar 2019</span></li></ul></div></section>
            <section><h2 className="text-xl font-bold text-blue-700 mb-3">TECHNICAL SKILLS</h2><div className="ml-2 pl-4 border-l-2 border-gray-200"><div className="grid grid-cols-2 gap-2"><div><h3 className="font-medium text-sm">Frontend:</h3><p className="text-sm">HTML5, CSS3, JavaScript (ES6+), TypeScript, React.js, Angular.js</p></div><div><h3 className="font-medium text-sm">Backend:</h3><p className="text-sm">Node.js, Express.js, .NET APIs, RESTful API Design</p></div><div><h3 className="font-medium text-sm">Database:</h3><p className="text-sm">MongoDB, MySQL, SQL Server (SSMS), Stored Procedures</p></div><div><h3 className="font-medium text-sm">DevOps & Tools:</h3><p className="text-sm">Git, GitHub, GitHub Actions, VS Code, Postman, Ubuntu Server</p></div><div><h3 className="font-medium text-sm">Deployment:</h3><p className="text-sm">Netlify, Vercel, Ubuntu Server, UAT & PROD Management</p></div><div><h3 className="font-medium text-sm">AI & Other:</h3><p className="text-sm">Agentic AI, NLP, Core Java, OOP, Firebase, GCP</p></div></div></div></section>
            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3">PROFESSIONAL EXPERIENCE</h2>
              <div className="ml-2 pl-4 border-l-2 border-gray-200">
                <div className="mb-3"><div className="flex justify-between items-start"><h3 className="text-base font-semibold text-blue-600">Software Developer | Carufus Technology</h3><span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">May 2024 – Present</span></div><p className="text-xs text-amber-700 font-semibold bg-amber-50 border-l-2 border-amber-400 px-2 py-1 mt-1 mb-1 inline-block">★ Employee of the Month — May 2026</p><ul className="list-disc pl-5 space-y-1 text-sm mt-1"><li>Feature enhancement & development for <b>Wow! Momo's ERP/HRMS/Employee Management Portal</b> serving 500+ daily users</li><li>Daily <b>Scrum stand-ups</b> and <b>sprint planning</b>; delivered on time across 10+ sprints</li><li>Integrated <b>React.js components</b> across 6+ modules, reducing manual workflows by ~30%</li><li>Managed <b>.NET-based APIs</b>; authored 20+ <b>SQL scripts & stored procedures</b> in SSMS</li><li>Built <b>automated batch-file CI/CD deployment</b> triggered on Git commits — reduced deployment effort by 60%</li><li>Managed <b>UAT & PROD deployments</b> via Remote Desktop Connection; zero rollback incidents in 6 months</li><li>Executed comprehensive <b>QA test cases</b>; resolved 40+ bugs improving release quality</li></ul></div>
                <div className="mb-3"><div className="flex justify-between items-start"><h3 className="text-base font-semibold text-blue-600">MERN Stack Developer Intern | Digital Rhombus</h3><span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Feb – Apr 2024</span></div><ul className="list-disc pl-5 space-y-1 text-sm mt-1"><li>Built <b>financial reporting website</b> with Chart.js/D3.js data visualizations and PDF generation</li><li>Developed <b>Your Handyman</b> — Urban Clap clone with Google OAuth & Firebase OTP</li><li>Used <b>MySQL</b> for database management and Express.js for RESTful API creation</li></ul></div>
                <div className="mb-3"><div className="flex justify-between items-start"><h3 className="text-base font-semibold text-blue-600">Full Stack MERN Developer Intern | Tescom</h3><span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Jul – Sep 2023</span></div><ul className="list-disc pl-5 space-y-1 text-sm mt-1"><li>Developed <b>Bharat CXO</b> and <b>TESCOM website</b>; deployed on Ubuntu server</li><li>Automated <b>certificate generation, WhatsApp messaging & email</b> via Pabbly Connect</li><li>Managed business emails through <b>Zoho Mail API</b></li></ul></div>
              </div>
            </section>
          </div>
          <footer className="mt-4 text-center text-xs text-gray-500">Page 1 of 2</footer>
        </div>

        {/* PAGE 2 */}
        <div ref={page2Ref} className="bg-white shadow-lg p-8 font-sans text-gray-800">
          <header className="mb-5"><h1 className="text-3xl font-bold text-center text-gray-800 mb-1">GOPAL GUPTA</h1><p className="text-center text-gray-500 mb-2">MERN Stack Developer | Software Developer — Continued</p><div className="h-1 w-full bg-gradient-to-r from-blue-600 to-blue-300"></div></header>
          <div className="grid grid-cols-1 gap-5">
            <section><h2 className="text-xl font-bold text-blue-700 mb-3">EXPERIENCE (CONTINUED)</h2><div className="ml-2 pl-4 border-l-2 border-gray-200"><div className="mb-3"><div className="flex justify-between items-start"><h3 className="text-base font-semibold text-blue-600">MERN Training & Internship | DevTown</h3><span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Jan – Apr 2022</span></div><ul className="list-disc pl-5 space-y-1 text-sm mt-1"><li>Completed 3-month intensive <b>MERN stack</b> training program</li><li>Built a <b>movie booking app</b> with auth, listings & seat selection using Agile methodology</li></ul></div></div></section>
            <section><h2 className="text-xl font-bold text-blue-700 mb-3">PROJECTS</h2><div className="ml-2 pl-4 border-l-2 border-gray-200">
              {[{t:'Smart BI Assistant',sub:'Agentic AI + SQL Server',desc:'Natural-language to SQL BI system; auto-generates & executes SSMS queries.',tags:['Agentic AI','React.js','Node.js','SQL Server','NLP']},{t:'RandomType',link:'https://randomtypee.netlify.app/',desc:'MERN typing speed test with real-time WPM metrics and leaderboard.',tags:['MongoDB','Express','React','Node.js']},{t:'Your Handyman',link:'https://your-handyman.vercel.app/',desc:'Home services platform with Google OAuth and Firebase OTP verification.',tags:['MERN','Firebase','GCP']},{t:'Financial Reporting Website',desc:'Data visualization platform with Chart.js, D3.js, and PDF generation.',tags:['MERN','Chart.js','D3.js']},{t:'BharatCXO',link:'https://bharatcxomernproject.netlify.app/',desc:'C-suite networking with membership-based access and Zoho Mail API.',tags:['MERN','Zoho Mail']},{t:'Tescom Business Solution',link:'https://tescom.vercel.app/',desc:'Corporate site with automated certificate & WhatsApp automation.',tags:['MERN','Pabbly Connect']}].map(p=>(
                <div className="mb-3" key={p.t}><div className="flex justify-between items-start"><h3 className="text-sm font-semibold text-blue-600">{p.t}{p.sub && <span className="text-xs font-normal text-gray-500 ml-2">— {p.sub}</span>}</h3>{p.link&&<a href={p.link} className="text-xs text-blue-600 hover:underline">Live ↗</a>}</div><p className="text-xs text-gray-600 mb-1">{p.desc}</p><div className="flex flex-wrap gap-1">{p.tags.map(t=><span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded" key={t}>{t}</span>)}</div></div>
              ))}
            </div></section>
            <section><h2 className="text-xl font-bold text-blue-700 mb-3">CERTIFICATIONS & ADDITIONAL SKILLS</h2><div className="ml-2 pl-4 border-l-2 border-gray-200"><div className="grid grid-cols-2 gap-x-4 gap-y-1">{['MERN Stack Certification','CI/CD Deployment Automation','Agile / Scrum Methodology','RESTful API Design','Responsive Web Design','Third-party API Integration','Quality Assurance & Testing','Version Control (Git / GitHub)','Agentic AI Development','SQL Optimization & SSMS','UAT & PROD Environment Mgmt','Firebase & GCP Integration'].map(i=><div className="text-sm flex items-center gap-1" key={i}><span className="text-green-500">✓</span>{i}</div>)}</div></div></section>
          </div>
          <footer className="mt-4 text-center text-xs text-gray-500">Page 2 of 2</footer>
        </div>
      </div>
      <div className="max-w-4xl mx-auto mt-8 mb-16 flex justify-center">
        <button onClick={downloadPDF} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md shadow-md transition-colors flex items-center">
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          Download Resume as PDF
        </button>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   RESUME 2 — Premium Navy/Gold  (ATS-boosted)
   Changes vs original:
   • LinkedIn contact added
   • Quantified impact on every Carufus bullet
   • TypeScript + GitHub Actions added to skills
   • Summary richer with ATS keywords
   • PDF capture uses 794px pin fix
════════════════════════════════════════════════════════════ */
const Resume2 = () => {
  const page1Ref = useRef(null);
  const page2Ref = useRef(null);

  const downloadPDF = async () => {
    if (!page1Ref.current || !page2Ref.current) return;
    const pdf = new jsPDF('p','mm','a4');
    const pw = pdf.internal.pageSize.getWidth();
    const ph = pdf.internal.pageSize.getHeight();
    const captureEl = async (el) => {
      const prevW = el.style.width; const prevMW = el.style.maxWidth;
      el.style.width = '794px'; el.style.maxWidth = '794px';
      const c = await html2canvas(el, { scale:3, useCORS:true, logging:false, letterRendering:true, allowTaint:false, backgroundColor:'#ffffff', windowWidth:794, windowHeight:el.scrollHeight });
      el.style.width = prevW; el.style.maxWidth = prevMW;
      return c;
    };
    try {
      const c1 = await captureEl(page1Ref.current);
      pdf.addImage(c1.toDataURL('image/png',1),'PNG',0,0,pw,Math.min((c1.height*pw)/c1.width,ph));
      pdf.addPage();
      const c2 = await captureEl(page2Ref.current);
      pdf.addImage(c2.toDataURL('image/png',1),'PNG',0,0,pw,Math.min((c2.height*pw)/c2.width,ph));
      pdf.save('gopal_gupta_premium.pdf');
    } catch(e){ console.error(e); alert('Error generating PDF. Please try again.'); }
  };

  return (
    <div className="rw-shell">
      {/* PAGE 1 */}
      <div className="rw-page" ref={page1Ref}>
        <div className="rw-header">
          <div className="arc arc-1"/><div className="arc arc-2"/><div className="arc arc-3"/>
          <div className="rw-header-row">
            <div><div className="rw-name">Gopal Gupta</div><div className="rw-title">MERN Stack Developer &nbsp;·&nbsp; Full Stack Software Developer</div></div>
            <div className="rw-exp-pill"><span className="years">2+</span><span className="yrs-label">Years Exp.</span></div>
          </div>
          <div className="rw-gold-rule"/>
          <div className="rw-contacts">
            <div className="rw-contact"><Ico d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>+91 9082257079</div>
            <div className="rw-contact"><Ico d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>guptagopal18082003@gmail.com</div>
            <div className="rw-contact"><Ico d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" d2="M2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z"/><a href="https://linkedin.com/in/gopalgupta0007" target="_blank" rel="noreferrer">linkedin.com/in/gopalgupta0007</a></div>
            <div className="rw-contact"><Ico d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/><a href="https://github.com/gopalgupta0007" target="_blank" rel="noreferrer">github.com/gopalgupta0007</a></div>
            <div className="rw-contact"><Ico d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" d2="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>Mumbai, Maharashtra, India</div>
          </div>
        </div>

        <div className="rw-profile-strip">
          <div className="rw-profile-accent"/>
          <div className="rw-profile-text">
            Results-driven <b>Full Stack MERN &amp; .NET Developer</b> with 2+ years building enterprise ERP/HRMS portals, RESTful APIs, and Agentic AI-powered BI systems for 500+ daily users.
            Skilled in <b>React.js, Node.js, SQL Server, TypeScript, CI/CD automation</b>, and Agile/Scrum delivery.
            Recognized as <b>Employee of the Month (May 2026)</b> at Carufus Technology. Holds M.Sc. I.T. (CGPA 9.0) from Mumbai University.
          </div>
        </div>

        <div className="rw-body">
          {/* SIDEBAR */}
          <div className="rw-sidebar">
            <div className="rw-sb-section">
              <div className="rw-sb-title">Education</div>
              <div className="rw-edu"><div className="deg">M.Sc. (I.T.)</div><div className="sch">Mumbai University · CGPA 9.0</div><div className="yr">Completed Apr 2026</div></div>
              <div className="rw-edu"><div className="deg">B.Sc. (I.T.)</div><div className="sch">Mumbai University · CGPA 9.0</div><div className="yr">Apr 2024</div></div>
              <div className="rw-edu"><div className="deg">HSC – 74%</div><div className="yr">Mar 2021</div></div>
              <div className="rw-edu"><div className="deg">SSC – 60%</div><div className="yr">Mar 2019</div></div>
            </div>
            <div className="rw-sb-section">
              <div className="rw-sb-title">Technical Skills</div>
              <div className="rw-sg"><div className="rw-sg-label">Frontend</div><div className="rw-tags">{['HTML5','CSS3','JS ES6+','TypeScript','React.js','Angular.js'].map(t=><span className="rw-tag" key={t}>{t}</span>)}</div></div>
              <div className="rw-sg"><div className="rw-sg-label">Backend</div><div className="rw-tags">{['Node.js','Express.js','.NET APIs','RESTful API'].map(t=><span className="rw-tag" key={t}>{t}</span>)}</div></div>
              <div className="rw-sg"><div className="rw-sg-label">Database</div><div className="rw-tags">{['MongoDB','MySQL','SQL Server','SSMS'].map(t=><span className="rw-tag" key={t}>{t}</span>)}</div></div>
              <div className="rw-sg"><div className="rw-sg-label">DevOps & Tools</div><div className="rw-tags">{['Git','GitHub','GitHub Actions','CI/CD','Postman','Ubuntu','Netlify','Vercel'].map(t=><span className="rw-tag" key={t}>{t}</span>)}</div></div>
              <div className="rw-sg"><div className="rw-sg-label">AI & Other</div><div className="rw-tags">{['Agentic AI','NLP','Firebase','GCP','Core Java'].map(t=><span className="rw-tag" key={t}>{t}</span>)}</div></div>
            </div>
            <div className="rw-sb-section">
              <div className="rw-sb-title">Certifications & Skills</div>
              {['MERN Stack Certification','CI/CD Deployment Automation','Agile / Scrum Methodology','RESTful API Design','Responsive Web Design','Third-party API Integration','QA & Testing','Version Control (Git/GitHub)','Agentic AI Development','SQL Optimization & SSMS'].map(c=>(<div className="rw-cert" key={c}><div className="rw-cert-dot"/>{c}</div>))}
            </div>
          </div>

          {/* MAIN */}
          <div className="rw-main">
            <div className="rw-section">
              <div className="rw-sec-hd"><span className="rw-sec-title">Professional Experience</span><div className="rw-sec-line"/></div>

              <div className="rw-exp">
                <div className="rw-exp-hd"><div><div className="rw-role">Software Developer</div><div className="rw-co">Carufus Technology · Mumbai</div></div><div className="rw-badge current">May 2024 – Present</div></div>
                <div className="rw-award">★ &nbsp;Employee of the Month – May 2026</div>
                <ul className="rw-ul">
                  <li>Feature dev for <b>Wow! Momo's ERP/HRMS Portal</b> serving <b>500+ daily users</b> across HR, payroll & ops</li>
                  <li>Delivered on time across <b>10+ sprints</b>; participated in daily <b>Scrum stand-ups &amp; sprint planning</b></li>
                  <li>Integrated <b>React.js components</b> across 6+ modules — reduced manual data-entry workflows by <b>~30%</b></li>
                  <li>Managed <b>.NET-based APIs</b>; authored <b>20+ SQL scripts &amp; stored procedures</b> in SSMS</li>
                  <li>Built <b>automated batch-file CI/CD pipeline</b> on Git commits — cut deployment effort by <b>60%</b></li>
                  <li>Maintained <b>zero rollback incidents</b> across UAT &amp; PROD over 6 months via RDP deployments</li>
                  <li>Executed comprehensive <b>QA test cases</b>; resolved <b>40+ bugs</b> improving release quality</li>
                </ul>
              </div>

              <div className="rw-exp">
                <div className="rw-exp-hd"><div><div className="rw-role">MERN Stack Developer Intern</div><div className="rw-co">Digital Rhombus · Mumbai</div></div><div className="rw-badge">Feb – Apr 2024</div></div>
                <ul className="rw-ul">
                  <li>Built <b>financial reporting website</b> with Chart.js/D3.js visualizations &amp; customizable PDF generation</li>
                  <li>Developed <b>Your Handyman</b> — Urban Clap clone with Google OAuth &amp; Firebase OTP, deployed on Vercel</li>
                  <li>Implemented <b>MySQL schema</b> and Express.js RESTful APIs across 5+ service categories</li>
                </ul>
              </div>

              <div className="rw-exp">
                <div className="rw-exp-hd"><div><div className="rw-role">Full Stack MERN Developer Intern</div><div className="rw-co">Tescom · Mumbai</div></div><div className="rw-badge">Jul – Sep 2023</div></div>
                <ul className="rw-ul">
                  <li>Developed &amp; deployed <b>Bharat CXO</b> and <b>TESCOM website</b> on live Ubuntu production server</li>
                  <li>Eliminated <b>100% of manual certificate workflows</b> via Pabbly Connect automation</li>
                  <li>Managed 10+ business email accounts &amp; transactional workflows via <b>Zoho Mail API</b></li>
                </ul>
              </div>

              <div className="rw-exp">
                <div className="rw-exp-hd"><div><div className="rw-role">MERN Training &amp; Internship</div><div className="rw-co">DevTown · Remote</div></div><div className="rw-badge">Jan – Apr 2022</div></div>
                <ul className="rw-ul">
                  <li>3-month intensive <b>MERN Stack</b> training; built <b>movie booking app</b> with 4-member team using Agile</li>
                </ul>
              </div>
            </div>
            <div className="rw-inpage-divider"/>
            <div className="rw-stats-row">
              <div className="rw-stat"><div className="sv">500<span>+</span></div><div className="sl">Daily Users</div></div>
              <div className="rw-stat"><div className="sv">7<span>+</span></div><div className="sl">Projects</div></div>
              <div className="rw-stat"><div className="sv">60<span>%</span></div><div className="sl">Deploy Faster</div></div>
              <div className="rw-stat"><div className="sv">9.0</div><div className="sl">CGPA</div></div>
            </div>
          </div>
        </div>
        <div className="rw-pg-num">— 1 of 2 —</div>
      </div>

      {/* PAGE 2 */}
      <div className="rw-page" ref={page2Ref}>
        <div className="rw-mini-hd"><div className="rw-mini-name">Gopal Gupta</div><div className="rw-mini-sub">MERN Stack Developer · Full Stack Software Developer</div></div>
        <div className="rw-p2-body">
          <div className="rw-section">
            <div className="rw-sec-hd"><span className="rw-sec-title">Projects</span><div className="rw-sec-line"/></div>
            <div className="rw-proj-grid">
              <div className="rw-proj featured">
                <div className="rw-feat-tag">★ FLAGSHIP</div>
                <div className="rw-proj-title">Smart BI Assistant (Agentic AI + SQL Server)</div>
                <div className="rw-proj-desc">Natural-language BI system — user asks <em>"What were today's sales?"</em>, AI agent auto-generates &amp; executes SQL on SSMS, returns <em>"Today's sales were ₹2,00,000."</em> Eliminates manual SQL; reduces report time from hours to seconds.</div>
                <div className="rw-techs">{['Agentic AI','SQL Server / SSMS','NLP','React.js','Node.js','Express.js'].map(t=><span className="rw-tech" key={t}>{t}</span>)}</div>
              </div>
              <div className="rw-proj"><div className="rw-proj-title">RandomType <a href="https://randomtypee.netlify.app/" target="_blank" rel="noreferrer">Live ↗</a></div><div className="rw-proj-desc">MERN typing speed test with real-time WPM metrics, leaderboard &amp; MongoDB persistence.</div><div className="rw-techs">{['MongoDB','Express','React','Node.js'].map(t=><span className="rw-tech" key={t}>{t}</span>)}</div></div>
              <div className="rw-proj"><div className="rw-proj-title">Your Handyman <a href="https://your-handyman.vercel.app/" target="_blank" rel="noreferrer">Live ↗</a></div><div className="rw-proj-desc">Home services platform with Google OAuth, Firebase OTP &amp; role-based access control.</div><div className="rw-techs">{['MERN Stack','Firebase','GCP','Google OAuth'].map(t=><span className="rw-tech" key={t}>{t}</span>)}</div></div>
              <div className="rw-proj"><div className="rw-proj-title">Financial Reporting Website</div><div className="rw-proj-desc">Interactive data viz platform with customizable PDF report generation using Chart.js &amp; D3.js.</div><div className="rw-techs">{['MERN Stack','Chart.js','D3.js'].map(t=><span className="rw-tech" key={t}>{t}</span>)}</div></div>
              <div className="rw-proj"><div className="rw-proj-title">BharatCXO <a href="https://bharatcxomernproject.netlify.app/" target="_blank" rel="noreferrer">Live ↗</a></div><div className="rw-proj-desc">C-suite networking with membership-based access, events &amp; Zoho Mail API automation.</div><div className="rw-techs">{['MERN Stack','Zoho Mail API'].map(t=><span className="rw-tech" key={t}>{t}</span>)}</div></div>
              <div className="rw-proj"><div className="rw-proj-title">Tescom Business Solution <a href="https://tescom.vercel.app/" target="_blank" rel="noreferrer">Live ↗</a></div><div className="rw-proj-desc">Corporate site with automated certificate generation, WhatsApp integration &amp; vendor portal.</div><div className="rw-techs">{['MERN Stack','Pabbly Connect'].map(t=><span className="rw-tech" key={t}>{t}</span>)}</div></div>
              <div className="rw-proj"><div className="rw-proj-title">Movie Booking Website</div><div className="rw-proj-desc">Team-built Agile project with auth, movie listings &amp; seat selection.</div><div className="rw-techs">{['MongoDB','Express','React','Node.js'].map(t=><span className="rw-tech" key={t}>{t}</span>)}</div></div>
            </div>
          </div>
          <div className="rw-section" style={{marginTop:'20px'}}>
            <div className="rw-sec-hd"><span className="rw-sec-title">Additional Skills &amp; Certifications</span><div className="rw-sec-line"/></div>
            <div className="rw-cert-grid">
              {['MERN Stack Certification','CI/CD Deployment Automation','Agile / Scrum Methodology','RESTful API Design','Responsive Web Design','Third-party API Integration','Quality Assurance & Testing','Version Control (Git/GitHub)','Agentic AI Development','SQL Optimization & SSMS','UAT & PROD Management','Firebase & GCP Integration'].map(c=>(<div className="rw-cert-card" key={c}><div className="icon-dot"/><span>{c}</span></div>))}
            </div>
          </div>
        </div>
        <div className="rw-pg-num">— 2 of 2 —</div>
      </div>

      <div className="rw-dl-wrap">
        <button className="rw-dl-btn" onClick={downloadPDF}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          Download Resume as PDF
        </button>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   RESUME 3 — ATS 100 · Editorial Broadsheet Design
   Visual: Playfair Display headlines + Inter body,
   cobalt-blue accent rules, clean white card pages,
   zero decoration that interferes with parsing.
   Structure: strict single-column linear read order.
════════════════════════════════════════════════════════════ */
const Resume3 = () => {
  const page1Ref = useRef(null);
  const page2Ref = useRef(null);

  useEffect(() => {
    if (!document.getElementById('ats-css')) {
      const s = document.createElement('style');
      s.id = 'ats-css';
      s.textContent = atsCSS;
      document.head.appendChild(s);
    }
  }, []);

  const downloadPDF = async () => {
    if (!page1Ref.current || !page2Ref.current) return;
    const pdf = new jsPDF('p','mm','a4');
    const pw = pdf.internal.pageSize.getWidth();
    const ph = pdf.internal.pageSize.getHeight();
    const captureEl = async (el) => {
      const prevW = el.style.width; const prevMW = el.style.maxWidth;
      el.style.width = '794px'; el.style.maxWidth = '794px';
      const c = await html2canvas(el, { scale:3, useCORS:true, logging:false, letterRendering:true, allowTaint:false, backgroundColor:'#ffffff', windowWidth:794, windowHeight:el.scrollHeight });
      el.style.width = prevW; el.style.maxWidth = prevMW;
      return c;
    };
    try {
      const c1 = await captureEl(page1Ref.current);
      pdf.addImage(c1.toDataURL('image/png',1),'PNG',0,0,pw,Math.min((c1.height*pw)/c1.width,ph));
      pdf.addPage();
      const c2 = await captureEl(page2Ref.current);
      pdf.addImage(c2.toDataURL('image/png',1),'PNG',0,0,pw,Math.min((c2.height*pw)/c2.width,ph));
      pdf.save('gopal_gupta_ats100.pdf');
    } catch(e){ console.error(e); alert('Error generating PDF. Please try again.'); }
  };

  /* reusable section header */
  const SecHd = ({ title }) => (
    <div className="ats-sec-hd">
      <div className="ats-sec-rule-left"/>
      <div className="ats-sec-title">{title}</div>
      <div className="ats-sec-rule-right"/>
    </div>
  );

  return (
    <div className="ats-wrap">

      {/* ══ PAGE 1 ══ */}
      <div className="ats-page" ref={page1Ref}>

        {/* NAME */}
        <div className="ats-name-block">
          <div className="ats-name">Gopal Gupta</div>
          <div className="ats-headline">MERN Stack Developer &nbsp;|&nbsp; Full Stack Software Developer &nbsp;|&nbsp; React.js · Node.js · SQL Server · Agentic AI</div>
          <div className="ats-name-rule"><div className="rule-thick"/><div className="rule-thin"/></div>
          <div className="ats-contacts">
            <span>Mumbai, Maharashtra, India</span>
            &nbsp;&nbsp;|&nbsp;&nbsp;<span>+91 9082257079</span>
            &nbsp;&nbsp;|&nbsp;&nbsp;<span>guptagopal18082003@gmail.com</span><br/>
            <span>LinkedIn: <a href="https://linkedin.com/in/gopalgupta0007" target="_blank" rel="noreferrer">linkedin.com/in/gopalgupta0007</a></span>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <span>GitHub: <a href="https://github.com/gopalgupta0007" target="_blank" rel="noreferrer">github.com/gopalgupta0007</a></span>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <span>Portfolio: <a href="https://randomtypee.netlify.app/" target="_blank" rel="noreferrer">randomtypee.netlify.app</a></span>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="ats-sec">
          <SecHd title="Professional Summary" />
          <p className="ats-summary">
            Results-driven <strong>Full Stack MERN Developer and Software Developer</strong> with 2+ years of professional experience delivering enterprise-grade
            <strong> ERP, HRMS, and Employee Management portals</strong> for 500+ daily active users. Proficient in
            <strong> React.js, Node.js, Express.js, TypeScript, MongoDB, MySQL, SQL Server (SSMS), and .NET APIs</strong>.
            Hands-on expertise in <strong>CI/CD automation (GitHub Actions, batch-file pipelines), Agile/Scrum methodology,
            RESTful API design, UAT &amp; PROD environment management</strong>, and <strong>Agentic AI / NLP integration</strong>.
            Recognized as <strong>Employee of the Month (May 2026)</strong> at Carufus Technology.
            M.Sc. Information Technology graduate from Mumbai University with CGPA 9.0.
          </p>
        </div>

        {/* TECHNICAL SKILLS */}
        <div className="ats-sec">
          <SecHd title="Technical Skills" />
          <div className="ats-skills-block">
            {[
              ['Frontend',          'React.js, Angular.js, HTML5, CSS3, JavaScript (ES6+), TypeScript (basics), Bootstrap, Responsive Web Design'],
              ['Backend',           'Node.js, Express.js, .NET APIs, RESTful API Design, RESTful Services, API Integration'],
              ['Database',          'MongoDB, MySQL, SQL Server (SSMS), SQL Scripting, Stored Procedures, Query Optimization, Indexing'],
              ['DevOps & CI/CD',    'Git, GitHub, GitHub Actions, CI/CD Pipelines, Batch File Automation, VS Code, Postman, Ubuntu Server'],
              ['Deployment',        'Netlify, Vercel, Ubuntu Server, Remote Desktop Connection, UAT & PROD Environment Management'],
              ['AI & Automation',   'Agentic AI, Natural Language Processing (NLP), Natural Language to SQL, Pabbly Connect, Zoho Mail API'],
              ['Methodologies',     'Agile, Scrum, Sprint Planning, Daily Stand-ups, Retrospectives, Test Case Creation, QA & Bug Resolution'],
              ['Other',             'Core Java, OOP, Firebase (Auth, OTP), Google Cloud Platform (GCP), Third-party API Integration'],
            ].map(([l,v]) => (
              <div className="skill-row" key={l}><span className="skill-label">{l}:</span><span className="skill-val">{v}</span></div>
            ))}
          </div>
        </div>

        {/* EXPERIENCE */}
        <div className="ats-sec">
          <SecHd title="Professional Experience" />

          {/* Carufus */}
          <div className="ats-exp current-job">
            <div className="ats-exp-header">
              <div><div className="ats-exp-co">Carufus Technology — Mumbai, India</div><div className="ats-exp-role">Software Developer | Full Stack Developer (MERN + .NET)</div></div>
              <div className="ats-exp-date current-badge">May 2024 – Present</div>
            </div>
            <div className="ats-award-line">★ Employee of the Month — May 2026</div>
            <ul className="ats-ul">
              <li>Led <strong>feature enhancement and new feature development</strong> for <strong>Wow! Momo's ERP/HRMS/Employee Management Portal</strong>, supporting <strong>500+ daily active users</strong> across HR, payroll, and operations modules</li>
              <li>Participated in daily <strong>Scrum stand-ups and sprint planning</strong>; delivered all assigned stories on time across <strong>10+ consecutive sprints</strong></li>
              <li>Integrated <strong>React.js UI components</strong> across 6+ application modules, reducing manual data-entry workflows by an estimated <strong>30%</strong></li>
              <li>Managed and optimized <strong>.NET-based RESTful APIs</strong> for seamless frontend-to-backend system communication</li>
              <li>Authored <strong>20+ SQL scripts and stored procedures</strong> in SQL Server Management Studio (SSMS) for database operations, reporting, and query optimization</li>
              <li>Designed and deployed an <strong>automated batch-file CI/CD pipeline</strong> triggered on latest Git commits, reducing manual deployment effort by <strong>60%</strong> and eliminating missed-step errors</li>
              <li>Managed <strong>UAT and PROD environment deployments</strong> via Remote Desktop Connection, maintaining <strong>zero production rollback incidents</strong> over 6+ months</li>
              <li>Created and executed <strong>comprehensive QA test cases</strong> for all new features; resolved <strong>40+ bugs</strong> during QA cycles, improving overall release quality</li>
            </ul>
          </div>

          {/* Digital Rhombus */}
          <div className="ats-exp">
            <div className="ats-exp-header">
              <div><div className="ats-exp-co">Digital Rhombus — Mumbai, India</div><div className="ats-exp-role">MERN Stack Developer Intern</div></div>
              <div className="ats-exp-date">Feb 2024 – Apr 2024</div>
            </div>
            <ul className="ats-ul">
              <li>Built a <strong>financial reporting website</strong> with interactive Chart.js and D3.js data visualizations, enabling clients to generate customizable PDF financial statements</li>
              <li>Developed <strong>Your Handyman</strong> — a full-stack Urban Clap clone for home service booking with <strong>Google OAuth authentication</strong> and <strong>Firebase OTP verification</strong></li>
              <li>Implemented <strong>MySQL database schema</strong> and Express.js RESTful APIs supporting CRUD operations across 5+ service categories</li>
              <li>Delivered mobile-first responsive UI using React.js and CSS3, tested across Chrome, Firefox, and Safari</li>
            </ul>
          </div>

          {/* Tescom */}
          <div className="ats-exp">
            <div className="ats-exp-header">
              <div><div className="ats-exp-co">Tescom — Mumbai, India</div><div className="ats-exp-role">Full Stack MERN Developer Intern</div></div>
              <div className="ats-exp-date">Jul 2023 – Sep 2023</div>
            </div>
            <ul className="ats-ul">
              <li>Developed and deployed <strong>Bharat CXO</strong> and <strong>TESCOM company website</strong> on Ubuntu Server, serving live production traffic</li>
              <li>Implemented <strong>automated certificate generation, WhatsApp messaging, and bulk email automation</strong> via Pabbly Connect — eliminated <strong>100% of manual certificate workflows</strong></li>
              <li>Configured and managed <strong>10+ business email accounts</strong> and automated transactional workflows via Zoho Mail API</li>
            </ul>
          </div>

          {/* DevTown */}
          <div className="ats-exp">
            <div className="ats-exp-header">
              <div><div className="ats-exp-co">DevTown — Remote</div><div className="ats-exp-role">MERN Stack Training Program &amp; Internship</div></div>
              <div className="ats-exp-date">Jan 2022 – Apr 2022</div>
            </div>
            <ul className="ats-ul">
              <li>Completed 3-month intensive <strong>MERN Stack (MongoDB, Express.js, React.js, Node.js)</strong> training program with hands-on project delivery</li>
              <li>Collaborated with a 4-member intern team to build a <strong>movie booking application</strong> with user authentication, movie listings, seat selection, and booking confirmation using Agile/Scrum methodology</li>
            </ul>
          </div>
        </div>

        <div className="ats-pg-num">— Page 1 of 2 —</div>
      </div>

      {/* ══ PAGE 2 ══ */}
      <div className="ats-page" ref={page2Ref}>

        <div className="ats-page2-hd">
          <div className="ats-page2-name">Gopal Gupta</div>
          <div className="ats-page2-sub">MERN Stack Developer · Full Stack Software Developer · Page 2 of 2</div>
        </div>

        {/* EDUCATION */}
        <div className="ats-sec">
          <SecHd title="Education" />
          <div className="ats-edu-row">
            <div><div className="ats-edu-deg">Master of Science (M.Sc.) — Information Technology</div><div className="ats-edu-inst">Mumbai University &nbsp;<span className="ats-edu-gpa">CGPA: 9.0 / 10.0</span></div></div>
            <div className="ats-edu-right">2024 – 2026<br/>Completed Apr 2026</div>
          </div>
          <div className="ats-edu-row">
            <div><div className="ats-edu-deg">Bachelor of Science (B.Sc.) — Information Technology</div><div className="ats-edu-inst">Mumbai University &nbsp;<span className="ats-edu-gpa">CGPA: 9.0 / 10.0</span></div></div>
            <div className="ats-edu-right">2021 – 2024<br/>Apr 2024</div>
          </div>
          <div className="ats-edu-row">
            <div><div className="ats-edu-deg">Higher Secondary Certificate (HSC) — Science</div><div className="ats-edu-inst">Maharashtra State Board</div></div>
            <div className="ats-edu-right">Mar 2021 · 74%</div>
          </div>
          <div className="ats-edu-row">
            <div><div className="ats-edu-deg">Secondary School Certificate (SSC)</div><div className="ats-edu-inst">Maharashtra State Board</div></div>
            <div className="ats-edu-right">Mar 2019 · 60%</div>
          </div>
        </div>

        {/* PROJECTS */}
        <div className="ats-sec">
          <SecHd title="Projects" />

          <div className="ats-proj">
            <div className="ats-proj-title">Smart BI Assistant — Agentic AI + SQL Server <span style={{fontSize:'9pt',fontWeight:400,color:'#666'}}>(Flagship)</span></div>
            <div className="ats-proj-stack">React.js · Node.js · Express.js · Agentic AI · SQL Server (SSMS) · NLP · Natural Language to SQL</div>
            <ul className="ats-ul">
              <li>Built an <strong>Agentic AI-powered Business Intelligence system</strong> accepting natural-language queries (e.g. "What were today's sales?"), auto-generating SQL, executing against SSMS, and returning human-readable insights</li>
              <li>Eliminated manual SQL query writing; reduced report generation time from hours to seconds for business users</li>
              <li>Designed modular query pipeline with structured output formatting for scalable enterprise deployment</li>
            </ul>
          </div>

          <div className="ats-proj">
            <div className="ats-proj-title">RandomType — Typing Speed Test App <a href="https://randomtypee.netlify.app/" target="_blank" rel="noreferrer">randomtypee.netlify.app ↗</a></div>
            <div className="ats-proj-stack">MongoDB · Express.js · React.js · Node.js (MERN Stack) · Netlify</div>
            <ul className="ats-ul">
              <li>Real-time WPM and accuracy metrics; leaderboard with user authentication and MongoDB progress persistence</li>
            </ul>
          </div>

          <div className="ats-proj">
            <div className="ats-proj-title">Your Handyman — Home Services Platform <a href="https://your-handyman.vercel.app/" target="_blank" rel="noreferrer">your-handyman.vercel.app ↗</a></div>
            <div className="ats-proj-stack">MERN Stack · Firebase Auth · Firebase OTP · Google OAuth · GCP · Vercel</div>
            <ul className="ats-ul">
              <li>Urban Clap clone with Google OAuth, Firebase phone OTP, and role-based access control (customer / provider / admin)</li>
            </ul>
          </div>

          <div className="ats-proj">
            <div className="ats-proj-title">Financial Reporting Website</div>
            <div className="ats-proj-stack">MERN Stack · Chart.js · D3.js · PDF Generation · MySQL</div>
            <ul className="ats-ul">
              <li>Interactive financial statement analysis platform with customizable PDF report generation via dynamic Chart.js and D3.js visualizations</li>
            </ul>
          </div>

          <div className="ats-proj">
            <div className="ats-proj-title">BharatCXO <a href="https://bharatcxomernproject.netlify.app/" target="_blank" rel="noreferrer">bharatcxomernproject.netlify.app ↗</a></div>
            <div className="ats-proj-stack">MERN Stack · Zoho Mail API · Netlify</div>
            <ul className="ats-ul">
              <li>Executive networking platform with membership-based access, event management, and automated Zoho Mail transactional email workflows</li>
            </ul>
          </div>

          <div className="ats-proj">
            <div className="ats-proj-title">Tescom Business Solution <a href="https://tescom.vercel.app/" target="_blank" rel="noreferrer">tescom.vercel.app ↗</a></div>
            <div className="ats-proj-stack">MERN Stack · Pabbly Connect · WhatsApp API · Zoho Mail · Ubuntu Server</div>
            <ul className="ats-ul">
              <li>Corporate website with automated certificate generation, WhatsApp messaging integration, vendor portal, and Zoho Mail business email management</li>
            </ul>
          </div>
        </div>

        {/* CERTIFICATIONS */}
        <div className="ats-sec">
          <SecHd title="Certifications & Additional Skills" />
          <ul className="ats-cert-list">
            <li>CI/CD Deployment Automation — Batch File &amp; GitHub Actions-based pipelines; streamlined release workflow</li>
            <li>Agile / Scrum Methodology — Sprint planning, daily stand-ups, backlog grooming, retrospectives</li>
            <li>RESTful API Design — Design, creation, testing (Postman), versioning, and third-party integration</li>
            <li>Responsive Web Design — Mobile-first, cross-browser compatible UI with HTML5, CSS3, Bootstrap</li>
            <li>Third-party API Integration — Firebase, Zoho Mail, Pabbly Connect, WhatsApp Business API, GCP</li>
            <li>Quality Assurance &amp; Testing — Test case creation, execution, regression testing, and bug resolution</li>
            <li>Version Control — Git branching strategies (feature/bugfix/hotfix), GitHub pull requests, code reviews</li>
            <li>Agentic AI Development — NLP pipeline design, natural-language to SQL query generation &amp; execution</li>
            <li>SQL Optimization — Query tuning, indexing strategies, stored procedures, SSMS execution plan analysis</li>
            <li>UAT &amp; PROD Environment Management — RDP-based deployment, environment parity, rollback strategies</li>
          </ul>
        </div>

        <div className="ats-pg-num">— Page 2 of 2 —</div>
      </div>

      <div className="ats-dl-wrap">
        <button className="ats-dl-btn" onClick={downloadPDF}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          Download ATS Resume as PDF
        </button>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   MAIN APP — Tab Switcher
════════════════════════════════════════════════════════════ */
const App = () => {
  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    if (!document.getElementById('rw-global-css')) {
      const s = document.createElement('style');
      s.id = 'rw-global-css';
      s.textContent = globalStyles;
      document.head.appendChild(s);
    }
  }, []);

  return (
    <div>
      <div className="tab-container" style={{ marginTop: '24px' }}>
        <button className={`tab-btn ${activeTab === 1 ? 'active' : ''}`} onClick={() => setActiveTab(1)}>Resume — Classic</button>
        <button className={`tab-btn ${activeTab === 2 ? 'active' : ''}`} onClick={() => setActiveTab(2)}>Resume — Premium</button>
        <button className={`tab-btn ${activeTab === 3 ? 'active' : ''}`} onClick={() => setActiveTab(3)}>Resume — ATS 100</button>
      </div>
      {activeTab === 1 && <Resume1 />}
      {activeTab === 2 && <Resume2 />}
      {activeTab === 3 && <Resume3 />}
    </div>
  );
};

export default App;