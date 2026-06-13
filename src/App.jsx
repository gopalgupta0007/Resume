import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/* ─────────────────────────────────────────────────────────────
   GLOBAL STYLES (for Resume 2 – injected once into <head>)
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

  body {
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--bg-outer);
    -webkit-font-smoothing: antialiased;
    color: var(--text);
  }

  /* ── OUTER SHELL ── */
  .rw-shell {
    max-width: 940px;
    margin: 0 auto;
    padding: 32px 18px 64px;
  }

  /* ── RESUME PAGE CARD ── */
  .rw-page {
    background: var(--white);
    margin-bottom: 28px;
    overflow: hidden;
    box-shadow:
      0 1px 2px rgba(8,18,31,.05),
      0 6px 16px rgba(8,18,31,.08),
      0 24px 56px rgba(8,18,31,.12);
  }

  /* ══ HEADER ══ */
  .rw-header {
    background: linear-gradient(150deg, var(--navy) 0%, var(--navy-3) 55%, var(--navy-4) 100%);
    padding: 36px 44px 26px;
    position: relative;
    overflow: hidden;
  }
  .rw-header .arc { position:absolute; border-radius:50%; pointer-events:none; border: 1px solid rgba(197,163,86,.10); }
  .rw-header .arc-1 { width:340px; height:340px; top:-120px; right:-100px; }
  .rw-header .arc-2 { width:220px; height:220px; top:-60px;  right:-40px;  border-color:rgba(197,163,86,.07); }
  .rw-header .arc-3 { width:120px; height:120px; top:-10px;  right:30px;   border-color:rgba(197,163,86,.05); }

  .rw-header-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 20px;
  }

  .rw-name {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 44px; font-weight: 700;
    color: var(--white);
    letter-spacing: .4px; line-height: 1;
  }
  .rw-title {
    font-size: 10.5px; font-weight: 500;
    letter-spacing: 3px; text-transform: uppercase;
    color: var(--gold-bright);
    margin-top: 8px;
  }

  .rw-exp-pill {
    background: var(--gold);
    color: var(--navy);
    padding: 11px 20px;
    text-align: center;
    flex-shrink: 0;
    display: flex; flex-direction: column; align-items: center;
  }
  .rw-exp-pill .years {
    font-family: 'Cormorant Garamond', serif;
    font-size: 30px; font-weight: 700; line-height: 1;
  }
  .rw-exp-pill .yrs-label {
    font-size: 8.5px; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase;
    margin-top: 2px;
  }

  .rw-gold-rule {
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(197,163,86,.45) 40%, rgba(197,163,86,.45) 60%, transparent 100%);
    margin-bottom: 16px;
  }

  .rw-contacts {
    display: flex; flex-wrap: wrap; gap: 6px 22px;
  }
  .rw-contact {
    display: flex; align-items: center; gap: 6px;
    font-size: 11px; color: rgba(255,255,255,.65);
  }
  .rw-contact svg { color: var(--gold); flex-shrink: 0; }
  .rw-contact a   { color: var(--gold-light); text-decoration: none; }

  /* ══ PROFILE STRIP ══ */
  .rw-profile-strip {
    background: var(--off-white);
    border-bottom: 1px solid var(--border);
    padding: 14px 44px;
    display: flex; align-items: center; gap: 16px;
  }
  .rw-profile-accent {
    width: 3px; height: 36px; flex-shrink: 0;
    background: linear-gradient(180deg, var(--gold) 0%, var(--gold-bright) 100%);
  }
  .rw-profile-text {
    font-size: 11.5px; line-height: 1.6; color: var(--text-muted);
    font-style: italic; letter-spacing: .1px;
  }
  .rw-profile-text b { color: var(--text-mid); font-style: normal; font-weight: 600; }

  /* ══ 3-COLUMN BODY ══ */
  .rw-body {
    display: grid;
    grid-template-columns: 218px 1fr;
    min-height: 680px;
  }

  /* ── SIDEBAR ── */
  .rw-sidebar {
    background: var(--navy-2);
    padding: 24px 20px;
  }
  .rw-sb-section { margin-bottom: 22px; }
  .rw-sb-title {
    font-size: 8px; font-weight: 600;
    letter-spacing: 3px; text-transform: uppercase;
    color: var(--gold);
    padding-bottom: 7px;
    border-bottom: 1px solid var(--gold-border);
    margin-bottom: 12px;
  }

  .rw-edu         { margin-bottom: 10px; }
  .rw-edu .deg    { color: var(--white); font-weight: 600; font-size: 11.5px; }
  .rw-edu .sch    { color: rgba(255,255,255,.45); font-size: 10px; margin-top: 1px; }
  .rw-edu .yr     { color: var(--gold); font-size: 9.5px; margin-top: 2px; font-weight: 500; }

  .rw-sg           { margin-bottom: 11px; }
  .rw-sg-label     { color: rgba(255,255,255,.42); font-size: 9.5px; font-weight: 500; margin-bottom: 4px; }
  .rw-tags         { display: flex; flex-wrap: wrap; gap: 3px; }
  .rw-tag {
    background: rgba(197,163,86,.09);
    color: rgba(255,255,255,.72);
    font-size: 9px; padding: 2.5px 7px;
    border: 1px solid rgba(197,163,86,.16);
    letter-spacing: .15px;
  }

  .rw-cert {
    display: flex; align-items: flex-start; gap: 7px;
    color: rgba(255,255,255,.62); font-size: 10.5px;
    margin-bottom: 6px; line-height: 1.35;
  }
  .rw-cert-dot {
    width: 4px; height: 4px; background: var(--gold);
    border-radius: 50%; flex-shrink: 0; margin-top: 4px;
  }

  /* ── MAIN CONTENT ── */
  .rw-main { padding: 22px 28px 22px 22px; }

  .rw-section { margin-bottom: 18px; }
  .rw-sec-hd  { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .rw-sec-title {
    font-size: 8.5px; font-weight: 600;
    letter-spacing: 3px; text-transform: uppercase;
    color: var(--text-light); white-space: nowrap;
  }
  .rw-sec-line { flex: 1; height: 1px; background: var(--border); }

  .rw-exp-list { position: relative; }

  .rw-exp {
    display: grid;
    grid-template-columns: 1fr;
    margin-bottom: 14px;
    padding-left: 16px;
    position: relative;
  }
  .rw-exp::before {
    content: '';
    position: absolute; left: 0; top: 7px;
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--gold);
    box-shadow: 0 0 0 3px rgba(197,163,86,.15);
  }
  .rw-exp::after {
    content: '';
    position: absolute; left: 2.5px; top: 15px; bottom: -8px;
    width: 1px; background: var(--border-soft);
  }
  .rw-exp:last-child::after { display: none; }

  .rw-exp-hd {
    display: flex; justify-content: space-between;
    align-items: flex-start; gap: 8px; flex-wrap: wrap;
    margin-bottom: 2px;
  }
  .rw-role { font-weight: 600; font-size: 12.5px; color: var(--text); }
  .rw-co   { font-size: 10.5px; color: var(--text-muted); margin-top: 1px; }
  .rw-badge {
    font-size: 9.5px; font-weight: 500;
    color: var(--text-mid);
    background: var(--off-white);
    padding: 3px 8px; border: 1px solid var(--border);
    white-space: nowrap; flex-shrink: 0; line-height: 1.4;
  }
  .rw-badge.current {
    color: var(--green); background: var(--green-bg);
    border-color: var(--green-border);
  }

  .rw-award {
    display: inline-flex; align-items: center; gap: 6px;
    background: linear-gradient(90deg, #fef4d8, #fffbf0);
    border: 1px solid #d9b54a;
    border-left: 3px solid var(--gold);
    color: #7a5400; font-size: 10px; font-weight: 600;
    padding: 3.5px 10px; margin-bottom: 5px;
    letter-spacing: .1px;
  }

  .rw-ul { list-style: none; margin-top: 3px; }
  .rw-ul li {
    font-size: 11px; color: var(--text-muted);
    padding: 1.5px 0 1.5px 12px; position: relative;
    line-height: 1.5;
  }
  .rw-ul li::before {
    content: '–'; position: absolute; left: 0;
    color: var(--gold); font-weight: 700;
  }
  .rw-ul b { color: var(--text-mid); font-weight: 600; }

  .rw-inpage-divider {
    height: 1px;
    background: var(--border);
    margin: 2px 0 14px;
  }

  .rw-stats-row {
    display: grid;
    grid-template-columns: repeat(4,1fr);
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    margin-top: 4px;
  }
  .rw-stat {
    background: var(--white);
    padding: 10px 12px;
    text-align: center;
  }
  .rw-stat .sv {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 700;
    color: var(--navy); line-height: 1;
  }
  .rw-stat .sl {
    font-size: 8.5px; font-weight: 500;
    letter-spacing: 1px; text-transform: uppercase;
    color: var(--text-muted); margin-top: 3px;
  }
  .rw-stat .sv span { font-size: 14px; color: var(--gold); }

  /* ══ PAGE 2 ══ */
  .rw-mini-hd {
    background: linear-gradient(150deg, var(--navy), var(--navy-3));
    padding: 13px 44px;
    display: flex; justify-content: space-between; align-items: center;
  }
  .rw-mini-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 700; color: var(--white);
  }
  .rw-mini-sub {
    font-size: 9px; font-weight: 500; letter-spacing: 2.5px;
    text-transform: uppercase; color: var(--gold);
  }

  .rw-p2-body { padding: 24px 44px 32px; }

  .rw-proj-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .rw-proj {
    border: 1px solid var(--border);
    padding: 13px 14px;
    background: var(--white);
    position: relative;
    transition: box-shadow .18s;
  }
  .rw-proj:hover { box-shadow: 0 4px 18px rgba(8,18,31,.09); }
  .rw-proj.featured {
    grid-column: 1 / -1;
    border-color: var(--gold);
    border-left: 3px solid var(--gold);
    background: linear-gradient(135deg, #fdf9ee 0%, var(--white) 60%);
  }
  .rw-feat-tag {
    position: absolute; top: 10px; right: 12px;
    font-size: 8px; font-weight: 700; letter-spacing: 2px;
    text-transform: uppercase; color: var(--gold);
  }
  .rw-proj-title {
    display: flex; justify-content: space-between;
    align-items: flex-start; gap: 6px;
    font-weight: 600; font-size: 12px; color: var(--text);
    margin-bottom: 5px;
  }
  .rw-proj-title a {
    font-size: 9px; font-weight: 500; color: var(--gold);
    text-decoration: none; white-space: nowrap; flex-shrink: 0;
    border-bottom: 1px solid rgba(197,163,86,.35);
    padding-bottom: 1px;
  }
  .rw-proj-desc {
    font-size: 11px; color: var(--text-muted);
    line-height: 1.5; margin-bottom: 7px;
  }
  .rw-proj-desc em { font-style: italic; color: var(--text-mid); }
  .rw-techs { display: flex; flex-wrap: wrap; gap: 3px; }
  .rw-tech {
    font-size: 9px; font-weight: 500;
    background: var(--off-white); color: var(--text-muted);
    padding: 2px 7px; border: 1px solid var(--border-soft);
  }

  .rw-cert-grid {
    display: grid; grid-template-columns: 1fr 1fr 1fr;
    gap: 8px; margin-top: 2px;
  }
  .rw-cert-card {
    border: 1px solid var(--border);
    padding: 9px 11px;
    display: flex; align-items: flex-start; gap: 7px;
  }
  .rw-cert-card .icon-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--gold); flex-shrink: 0; margin-top: 4px;
  }
  .rw-cert-card span {
    font-size: 10.5px; color: var(--text-muted); line-height: 1.35;
  }

  .rw-pg-num {
    text-align: center; font-size: 9px; letter-spacing: 1.5px;
    color: var(--border); padding: 10px 0 7px;
  }

  /* ── DOWNLOAD ── */
  .rw-dl-wrap { display: flex; justify-content: center; margin-top: 24px; }
  .rw-dl-btn {
    display: inline-flex; align-items: center; gap: 9px;
    background: var(--navy);
    color: var(--gold);
    border: 1.5px solid var(--gold);
    padding: 12px 34px;
    font-family: 'DM Sans', sans-serif;
    font-size: 11.5px; font-weight: 600;
    letter-spacing: 2px; text-transform: uppercase;
    cursor: pointer;
    transition: background .2s, color .2s;
  }
  .rw-dl-btn:hover { background: var(--gold); color: var(--navy); }
  .rw-dl-btn:active { transform: scale(.98); }

  /* ── TAB STYLES ── */
  .tab-container {
    display: flex;
    justify-content: center;
    gap: 0;
    margin-bottom: 0;
    max-width: 940px;
    margin-left: auto;
    margin-right: auto;
    padding: 0 18px;
  }
  .tab-btn {
    padding: 12px 32px;
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    background: #e2e0db;
    color: #5c6d80;
  }
  .tab-btn:first-child {
    border-top-left-radius: 8px;
  }
  .tab-btn:last-child {
    border-top-right-radius: 8px;
  }
  .tab-btn.active {
    background: #ffffff;
    color: #08121f;
    box-shadow: 0 -2px 8px rgba(8,18,31,.08);
  }
  .tab-btn:hover:not(.active) {
    background: #d8d5cf;
    color: #2e3d52;
  }
`;

/* ─────────────────────────────────────────────────────────────
   GLOBAL STYLES (for Resume 3 – injected once into <head>)
───────────────────────────────────────────────────────────── */
const grCSS = `
  @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --ink:       #0d1117;
    --rule:      #c8a96e;
    --rule-soft: #ddd0b8;
    --muted:     #52606d;
    --label:     #374151;
    --bg:        #f5f2ed;
    --paper:     #ffffff;
    --blue:      #1a4480;
    --green-txt: #145c38;
    --green-bg:  #edf7f2;
    --green-bd:  #9fd3b8;
    --tag-bg:    #f0ecf5;
    --tag-txt:   #3b3060;
    --tag-bd:    #c8bfe0;
  }

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    -webkit-font-smoothing: antialiased;
    color: var(--ink);
  }

  .gr-outer {
    max-width: 820px;
    margin: 0 auto;
    padding: 32px 20px 60px;
  }

  .gr-page {
    background: var(--paper);
    margin-bottom: 0;
    box-shadow:
      0 1px 3px rgba(13,17,23,.06),
      0 8px 24px rgba(13,17,23,.09),
      0 32px 64px rgba(13,17,23,.10);
  }

  .gr-hd {
    padding: 36px 48px 0;
    border-bottom: 2.5px solid var(--rule);
    padding-bottom: 20px;
  }

  .gr-hd-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 20px;
    flex-wrap: wrap;
  }

  .gr-name {
    font-family: 'EB Garamond', Georgia, serif;
    font-size: 38px; font-weight: 700;
    color: var(--ink); letter-spacing: .2px; line-height: 1;
  }

  .gr-role {
    font-size: 11px; font-weight: 600;
    letter-spacing: 2.5px; text-transform: uppercase;
    color: var(--muted); margin-top: 6px;
  }

  .gr-contacts {
    display: flex; flex-wrap: wrap; gap: 5px 18px;
    margin-top: 14px;
  }

  .gr-contact {
    display: flex; align-items: center; gap: 5px;
    font-size: 11.5px; color: var(--muted);
  }

  .gr-contact svg { color: var(--rule); flex-shrink:0; }
  .gr-contact a   { color: var(--blue); text-decoration: none; }

  .gr-body { padding: 0 48px 36px; }

  .gr-sec { padding-top: 22px; }

  .gr-sec-hd {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 12px;
  }

  .gr-sec-title {
    font-family: 'EB Garamond', serif;
    font-size: 15px; font-weight: 700;
    color: var(--ink); letter-spacing: .3px;
    white-space: nowrap; text-transform: uppercase;
  }

  .gr-sec-rule { flex:1; height: 1px; background: var(--rule-soft); }

  .gr-synopsis {
    font-size: 12px; line-height: 1.7; color: var(--muted);
  }

  .gr-comp-list { list-style: none; columns: 2; column-gap: 28px; }

  .gr-comp-item {
    font-size: 11.5px; color: var(--label);
    padding: 3px 0 3px 14px; position: relative;
    line-height: 1.5; break-inside: avoid;
  }

  .gr-comp-item::before {
    content: '';
    position: absolute; left: 0; top: 8px;
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--rule);
  }

  .gr-comp-item b { color: var(--ink); font-weight: 600; }

  .gr-edu-row {
    display: flex; justify-content: space-between;
    align-items: baseline; flex-wrap: wrap; gap: 4px;
  }

  .gr-edu-deg { font-size: 13px; font-weight: 600; color: var(--ink); }
  .gr-edu-meta { font-size: 11.5px; color: var(--muted); }

  .gr-edu-gpa {
    font-size: 11px; font-weight: 700;
    color: var(--blue);
    background: #eef3fb; border: 1px solid #bdd0ef;
    padding: 2px 8px; margin-left: 8px;
  }

  .gr-exp { margin-bottom: 18px; }

  .gr-exp-hd {
    display: flex; justify-content: space-between;
    align-items: flex-start; gap: 8px; flex-wrap: wrap;
    margin-bottom: 4px;
  }

  .gr-exp-co { font-family: 'EB Garamond', serif; font-size: 15px; font-weight: 700; color: var(--ink); }
  .gr-exp-role { font-size: 12px; font-weight: 600; color: var(--blue); margin-top: 1px; }

  .gr-exp-date {
    font-size: 10.5px; font-weight: 500;
    color: var(--green-txt);
    background: var(--green-bg);
    border: 1px solid var(--green-bd);
    padding: 3px 9px; white-space: nowrap; flex-shrink: 0;
  }

  .gr-exp-date.past {
    color: var(--muted); background: #f4f2ee; border-color: var(--rule-soft);
  }

  .gr-award {
    display: inline-flex; align-items: center; gap: 6px;
    background: linear-gradient(90deg,#fef4d8,#fffbf0);
    border: 1px solid #d9b54a; border-left: 3px solid var(--rule);
    color: #7a5400; font-size: 10px; font-weight: 600;
    padding: 3px 10px; margin-bottom: 5px;
  }

  .gr-ul { list-style: none; margin-top: 4px; }

  .gr-ul li {
    font-size: 11.5px; color: var(--muted);
    padding: 2px 0 2px 14px; position: relative; line-height: 1.55;
  }

  .gr-ul li::before { content: '–'; position: absolute; left: 0; color: var(--rule); font-weight: 700; }
  .gr-ul b { color: var(--label); font-weight: 600; }

  .gr-proj { margin-bottom: 16px; padding-left: 14px; border-left: 2px solid var(--rule-soft); }
  .gr-proj-hd { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; flex-wrap: wrap; margin-bottom: 4px; }
  .gr-proj-title { font-size: 13px; font-weight: 700; color: var(--ink); }
  .gr-proj-stack { font-size: 10.5px; color: var(--blue); font-style: italic; }
  .gr-proj-desc { font-size: 11.5px; color: var(--muted); line-height: 1.55; margin-bottom: 6px; }
  .gr-proj-desc em { font-style: italic; color: var(--label); }

  .gr-tech-table { width: 100%; border-collapse: collapse; margin-top: 2px; }
  .gr-tech-table tr { border-bottom: 1px solid var(--rule-soft); }
  .gr-tech-table tr:last-child { border-bottom: none; }
  .gr-tech-table td { padding: 5px 0; vertical-align: top; font-size: 11.5px; line-height: 1.5; }
  .gr-tech-table td:first-child {
    width: 130px; font-weight: 600; color: var(--label); padding-right: 16px;
    white-space: nowrap;
  }
  .gr-tech-table td:last-child { color: var(--muted); }

  .gr-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }

  .gr-tag {
    font-size: 9.5px; font-weight: 500;
    background: var(--tag-bg); color: var(--tag-txt);
    padding: 2px 8px; border: 1px solid var(--tag-bd);
  }

  .gr-stats {
    display: grid; grid-template-columns: repeat(4,1fr);
    gap: 1px; background: var(--rule-soft);
    border: 1px solid var(--rule-soft);
    margin-top: 20px;
  }

  .gr-stat { background: var(--paper); padding: 10px; text-align: center; }
  .gr-stat .sv {
    font-family: 'EB Garamond', serif; font-size: 22px;
    font-weight: 700; color: var(--ink); line-height: 1;
  }
  .gr-stat .sv span { font-size: 14px; color: var(--rule); }
  .gr-stat .sl { font-size: 8.5px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); margin-top: 3px; }

  .gr-page-break {
    height: 1.5px;
    background: linear-gradient(90deg, transparent, var(--rule) 20%, var(--rule) 80%, transparent);
    margin: 32px 0 0;
  }

  .gr-mini-hd {
    padding: 16px 48px;
    border-bottom: 1.5px solid var(--rule-soft);
    display: flex; justify-content: space-between; align-items: center;
    background: #faf8f4;
  }

  .gr-mini-name { font-family: 'EB Garamond', serif; font-size: 18px; font-weight: 700; color: var(--ink); }
  .gr-mini-sub  { font-size: 9.5px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); }

  .gr-pg-num { text-align: center; font-size: 9px; letter-spacing: 1.5px; color: var(--rule-soft); padding: 12px 0 8px; }

  .gr-dl-wrap { display: flex; justify-content: center; margin-top: 28px; }

  .gr-dl-btn {
    display: inline-flex; align-items: center; gap: 9px;
    background: var(--ink); color: var(--rule);
    border: 1.5px solid var(--rule);
    padding: 12px 34px;
    font-family: 'DM Sans', sans-serif;
    font-size: 11.5px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
    cursor: pointer; transition: background .2s, color .2s;
  }

  .gr-dl-btn:hover { background: var(--rule); color: var(--ink); }
`;

/* small inline SVG icon */
const Ico = ({ d, d2, s = 12 }) => (
  <svg width={s} height={s} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    {d2 && <path strokeLinecap="round" strokeLinejoin="round" d={d2} />}
  </svg>
);

/* ════════════════════════════════════════════════════════════
   RESUME 1 — Classic Tailwind-based
════════════════════════════════════════════════════════════ */
const Resume1 = () => {
  const page1Ref = useRef(null);
  const page2Ref = useRef(null);

  const downloadPDF = async () => {
    if (!page1Ref.current || !page2Ref.current) return;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    try {
      const canvas1 = await html2canvas(page1Ref.current, {
        scale: 3,
        useCORS: true,
        logging: false,
        letterRendering: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        windowWidth: page1Ref.current.scrollWidth,
        windowHeight: page1Ref.current.scrollHeight
      });

      const imgData1 = canvas1.toDataURL('image/png', 1.0);
      const imgWidth1 = pageWidth;
      const imgHeight1 = (canvas1.height * imgWidth1) / canvas1.width;

      pdf.addImage(imgData1, 'PNG', 0, 0, imgWidth1, Math.min(imgHeight1, pageHeight));

      pdf.addPage();

      const canvas2 = await html2canvas(page2Ref.current, {
        scale: 3,
        useCORS: true,
        logging: false,
        letterRendering: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        windowWidth: page2Ref.current.scrollWidth,
        windowHeight: page2Ref.current.scrollHeight
      });

      const imgData2 = canvas2.toDataURL('image/png', 1.0);
      const imgWidth2 = pageWidth;
      const imgHeight2 = (canvas2.height * imgWidth2) / canvas2.width;

      pdf.addImage(imgData2, 'PNG', 0, 0, imgWidth2, Math.min(imgHeight2, pageHeight));

      pdf.save('gopal_gupta_resume.pdf');
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("There was an error generating the PDF. Please try again.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="w-full max-w-4xl mx-auto">
        {/* Page 1 */}
        <div ref={page1Ref} className="mb-8 bg-white shadow-lg p-8 font-sans text-gray-800">
          <header className="mb-6">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">GOPAL GUPTA</h1>
            <p className="text-center text-gray-500 text-lg mb-4">MERN Stack Developer | Software Developer</p>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+91 9082257079</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>guptagopal18082003@gmail.com</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <a href="https://github.com/gopalgupta0007" className="text-blue-600 hover:underline">github.com/gopalgupta0007</a>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>G.T.B Nagar, Sion Koliwada, Mumbai - 400037</span>
              </div>
            </div>

            <div className="mt-4 h-1 w-full bg-gradient-to-r from-blue-600 to-blue-300"></div>
          </header>

          <div className="grid grid-cols-1 gap-6">
            {/* Education Section */}
            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
                EDUCATION
              </h2>
              <div className="ml-2 pl-4 border-l-2 border-gray-200">
                <ul className="space-y-2">
                  <li className="text-sm flex justify-between">
                    <span><span className="font-medium">M.Sc. (I.T.)</span> from Mumbai University</span>
                    <span className="text-gray-600">Completed Apr 2026</span>
                  </li>
                  <li className="text-sm flex justify-between">
                    <span><span className="font-medium">B.Sc. (I.T.)</span> from Mumbai University</span>
                    <span className="text-gray-600">Apr 2024</span>
                  </li>
                  <li className="text-sm flex justify-between">
                    <span><span className="font-medium">HSC</span> - 74%</span>
                    <span className="text-gray-600">Mar 2021</span>
                  </li>
                  <li className="text-sm flex justify-between">
                    <span><span className="font-medium">SSC</span> - 60%</span>
                    <span className="text-gray-600">Mar 2019</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Technical Skills Section */}
            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                TECHNICAL SKILLS
              </h2>
              <div className="ml-2 pl-4 border-l-2 border-gray-200">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <h3 className="font-medium text-sm">Frontend:</h3>
                    <p className="text-sm">HTML5, CSS3, JavaScript (ES6+), React.js, Angular.js</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Backend:</h3>
                    <p className="text-sm">Node.js, Express.js, .NET APIs</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Database:</h3>
                    <p className="text-sm">MongoDB, MYSQL, SQL Server (SSMS)</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Java Technologies:</h3>
                    <p className="text-sm">Core Java, OOPS</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Tools & Platforms:</h3>
                    <p className="text-sm">Git, GitHub, VS Code, Postman</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Deployment:</h3>
                    <p className="text-sm">Ubuntu Server, Netlify, Vercel</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Professional Experience Section */}
            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                PROFESSIONAL EXPERIENCE
              </h2>
              <div className="ml-2 pl-4 border-l-2 border-gray-200">
                <div className="mb-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-semibold text-blue-600">Software Developer | Carufus Technology</h3>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">May 2024 - Present</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-sm mt-1">
                    <li>Working on <b>feature enhancement and feature development</b> tasks based on requirements for <b>Wow! Momo's internal ERP/HRMS/Employee Management Portal</b></li>
                    <li>Participate in daily <b>Scrum meetings</b> and <b>sprint planning sessions</b> to discuss project progress, challenges, and task prioritization</li>
                    <li>Implement <b>new feature integration</b> across different application modules using modern development practices</li>
                    <li>Manage and optimize <b>.NET based integrated APIs</b> for seamless communication between frontend and backend systems</li>
                    <li>Write <b>SQL scripts and stored procedures</b> using <b>SSMS (SQL Server Management Studio)</b> for database operations and optimization</li>
                    <li>Developed <b>automated deployment solution using batch files</b> that triggers deployments based on latest commits to streamline the CI/CD process</li>
                    <li>Use <b>Remote Desktop Connection</b> to deploy and manage changes on <b>UAT and PROD environments</b> following version control strategies</li>
                    <li>Conduct comprehensive <b>testing and quality assurance</b>, creating and executing test cases to validate application changes and newly developed features</li>
                    <li>Perform <b>bug resolution</b> and <b>issue troubleshooting</b> to ensure optimal application performance</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-semibold text-blue-600">MERN Stack Developer Intern | Digital Rhombus</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Feb - Apr 2024</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-sm mt-1">
                    <li>Developed a <b>financial reporting website</b> with data visualization features</li>
                    <li>Built <b>Your Handyman</b> web application - a clone of Urban Clap for booking home services</li>
                    <li>Collaborated with the development team to implement responsive UI designs</li>
                    <li>Utilized <b>MYSQL for database management</b> and Express.js for RESTful API creation</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-semibold text-blue-600">Full Stack MERN Developer Intern | Tescom</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Jul - Sep 2023</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-sm mt-1">
                    <li>Developed two web applications: <b>Bharat CXO</b> and <b>TESCOM company website</b></li>
                    <li>Deployed and managed websites on Ubuntu server</li>
                    <li>Implemented automation solutions including <b>certificate generation</b>, <b>WhatsApp messaging</b>, and <b>email automation using Pabbly</b></li>
                    <li><b>Managed all business emails</b> through Zoho Mail</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
          <footer className="mt-6 text-center text-xs text-gray-500">
            Page 1 of 2
          </footer>
        </div>

        {/* Page 2 */}
        <div ref={page2Ref} className="bg-white shadow-lg p-8 font-sans text-gray-800">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-1">GOPAL GUPTA</h1>
            <p className="text-center text-gray-500 mb-2">MERN Stack Developer | Software Developer - Continued</p>
            <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-blue-300"></div>
          </header>

          <div className="grid grid-cols-1 gap-6">
            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                PROFESSIONAL EXPERIENCE (CONTINUED)
              </h2>
              <div className="ml-2 pl-4 border-l-2 border-gray-200">
                <div className="mb-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-semibold text-blue-600">MERN Training Program & Internship | DevTown</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Jan - Apr 2022</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-sm mt-1">
                    <li>Completed <b>3 months</b> of intensive MERN stack training</li>
                    <li>Worked collaboratively with a team of interns to develop a <b>movie booking web application</b></li>
                    <li>Implemented user authentication, movie listings, seat selection, and booking functionality</li>
                    <li>Applied agile development methodology for project management</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                PROJECTS
              </h2>
              <div className="ml-2 pl-4 border-l-2 border-gray-200">
                <div className="mb-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-semibold text-blue-600">RandomType</h3>
                    <a href="https://randomtypee.netlify.app/" className="text-xs text-blue-600 hover:underline">Live Demo</a>
                  </div>
                  <p className="text-sm mb-1">A typing speed test application built with the MERN stack that helps users improve their typing speed and accuracy.</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">MongoDB</span>
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">Express</span>
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">React</span>
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">Node.js</span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-semibold text-blue-600">Your Handyman</h3>
                    <a href="https://your-handyman.vercel.app/" className="text-xs text-blue-600 hover:underline">Live Demo</a>
                  </div>
                  <p className="text-sm mb-1">Home services platform with Google authentication, Firebase OTP verification, and role-based access control.</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">MERN Stack</span>
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">Firebase</span>
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">GCP</span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-semibold text-blue-600">Financial Reporting Website</h3>
                  </div>
                  <p className="text-sm mb-1">Interactive data visualization platform with customizable PDF report generation for financial statements.</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">MERN Stack</span>
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">Chart.js</span>
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">D3.js</span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-semibold text-blue-600">BharatCXO</h3>
                    <a href="https://bharatcxomernproject.netlify.app/" className="text-xs text-blue-600 hover:underline">Live Demo</a>
                  </div>
                  <p className="text-sm mb-1">Platform connecting C-suite executives with membership-based access and event management features.</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">MERN Stack</span>
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">Zoho Mail API</span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-semibold text-blue-600">Tescom Business Solution</h3>
                    <a href="https://tescom.vercel.app/" className="text-xs text-blue-600 hover:underline">Live Demo</a>
                  </div>
                  <p className="text-sm mb-1">Corporate website with automated certificate generation, WhatsApp messaging integration, and vendor portal.</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">MERN Stack</span>
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">Pabbly Connect</span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-semibold text-blue-600">Movie Booking Website</h3>
                  </div>
                  <p className="text-sm mb-1">Collaborative project with user authentication, movie listings, and seat selection functionality.</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">MongoDB</span>
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">Express</span>
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">React</span>
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">Node.js</span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                ADDITIONAL SKILLS & CERTIFICATIONS
              </h2>
              <div className="ml-2 pl-4 border-l-2 border-gray-200">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {[
                    'CI/CD deployment',
                    'Responsive web design',
                    'Agile/Scrum methodology',
                    'Third-party API integration',
                    'Version control (Git/GitHub)',
                    'RESTful API design',
                    'Quality assurance & testing',
                    'MERN Stack Certification',
                  ].map((item) => (
                    <div className="flex items-center" key={item}>
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
          <footer className="mt-6 text-center text-xs text-gray-500">
            Page 2 of 2
          </footer>
        </div>
      </div>

      {/* Download Button */}
      <div className="max-w-4xl mx-auto mt-8 mb-16 flex justify-center">
        <button
          onClick={downloadPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md shadow-md transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Resume as PDF
        </button>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   RESUME 2 — Premium Navy/Gold theme
════════════════════════════════════════════════════════════ */
const Resume2 = () => {
  const page1Ref = useRef(null);
  const page2Ref = useRef(null);

  const downloadPDF = async () => {
    if (!page1Ref.current || !page2Ref.current) return;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pw  = pdf.internal.pageSize.getWidth();
    const ph  = pdf.internal.pageSize.getHeight();
    const opt = (el) => ({
      scale: 3, useCORS: true, logging: false,
      letterRendering: true, allowTaint: false,
      backgroundColor: '#ffffff',
      windowWidth: el.scrollWidth,
      windowHeight: el.scrollHeight,
    });
    try {
      const c1 = await html2canvas(page1Ref.current, opt(page1Ref.current));
      pdf.addImage(c1.toDataURL('image/png',1),'PNG',0,0,pw,Math.min((c1.height*pw)/c1.width,ph));
      pdf.addPage();
      const c2 = await html2canvas(page2Ref.current, opt(page2Ref.current));
      pdf.addImage(c2.toDataURL('image/png',1),'PNG',0,0,pw,Math.min((c2.height*pw)/c2.width,ph));
      pdf.save('gopal_gupta_resume.pdf');
    } catch(e) {
      console.error(e);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div className="rw-shell">

      {/* PAGE 1 */}
      <div className="rw-page" ref={page1Ref}>

        {/* HEADER */}
        <div className="rw-header">
          <div className="arc arc-1"/><div className="arc arc-2"/><div className="arc arc-3"/>
          <div className="rw-header-row">
            <div>
              <div className="rw-name">Gopal Gupta</div>
              <div className="rw-title">MERN Stack Developer &nbsp;·&nbsp; Software Developer</div>
            </div>
            <div className="rw-exp-pill">
              <span className="years">2+</span>
              <span className="yrs-label">Years Exp.</span>
            </div>
          </div>
          <div className="rw-gold-rule"/>
          <div className="rw-contacts">
            <div className="rw-contact">
              <Ico d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              +91 9082257079
            </div>
            <div className="rw-contact">
              <Ico d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              guptagopal18082003@gmail.com
            </div>
            <div className="rw-contact">
              <Ico d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
              <a href="https://github.com/gopalgupta0007" target="_blank" rel="noreferrer">github.com/gopalgupta0007</a>
            </div>
            <div className="rw-contact">
              <Ico d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" d2="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              G.T.B Nagar, Sion Koliwada, Mumbai – 400037
            </div>
          </div>
        </div>

        {/* PROFILE SUMMARY STRIP */}
        <div className="rw-profile-strip">
          <div className="rw-profile-accent"/>
          <div className="rw-profile-text">
            Results-driven <b>MERN Stack &amp; .NET Developer</b> with 2+ years of hands-on experience building
            enterprise-grade ERP/HRMS portals, RESTful APIs, and Agentic AI-powered BI systems.
            Recognized as <b>Employee of the Month (May 2026)</b>. Passionate about clean code,
            CI/CD automation, and delivering scalable full-stack solutions.
          </div>
        </div>

        {/* TWO-COLUMN BODY */}
        <div className="rw-body">

          {/* SIDEBAR */}
          <div className="rw-sidebar">

            <div className="rw-sb-section">
              <div className="rw-sb-title">Education</div>
              <div className="rw-edu"><div className="deg">M.Sc. (I.T.)</div><div className="sch">Mumbai University</div><div className="yr">Completed Apr 2026</div></div>
              <div className="rw-edu"><div className="deg">B.Sc. (I.T.)</div><div className="sch">Mumbai University</div><div className="yr">Apr 2024</div></div>
              <div className="rw-edu"><div className="deg">HSC – 74%</div><div className="yr">Mar 2021</div></div>
              <div className="rw-edu"><div className="deg">SSC – 60%</div><div className="yr">Mar 2019</div></div>
            </div>

            <div className="rw-sb-section">
              <div className="rw-sb-title">Technical Skills</div>
              <div className="rw-sg"><div className="rw-sg-label">Frontend</div>
                <div className="rw-tags">{['HTML5','CSS3','JS ES6+','React.js','Angular.js'].map(t=><span className="rw-tag" key={t}>{t}</span>)}</div></div>
              <div className="rw-sg"><div className="rw-sg-label">Backend</div>
                <div className="rw-tags">{['Node.js','Express.js','.NET APIs'].map(t=><span className="rw-tag" key={t}>{t}</span>)}</div></div>
              <div className="rw-sg"><div className="rw-sg-label">Database</div>
                <div className="rw-tags">{['MongoDB','MySQL','SQL Server','SSMS'].map(t=><span className="rw-tag" key={t}>{t}</span>)}</div></div>
              <div className="rw-sg"><div className="rw-sg-label">Tools & Deploy</div>
                <div className="rw-tags">{['Git','GitHub','VS Code','Postman','Ubuntu','Netlify','Vercel'].map(t=><span className="rw-tag" key={t}>{t}</span>)}</div></div>
              <div className="rw-sg"><div className="rw-sg-label">Other</div>
                <div className="rw-tags">{['Core Java','OOPS','Agentic AI'].map(t=><span className="rw-tag" key={t}>{t}</span>)}</div></div>
            </div>

            <div className="rw-sb-section">
              <div className="rw-sb-title">Certifications & Skills</div>
              {['MERN Stack Certification','CI/CD Deployment','Agile / Scrum Methodology',
                'RESTful API Design','Responsive Web Design','Third-party API Integration',
                'Quality Assurance & Testing','Version Control (Git/GitHub)'].map(c=>(
                <div className="rw-cert" key={c}><div className="rw-cert-dot"/>{c}</div>
              ))}
            </div>

          </div>{/* end sidebar */}

          {/* MAIN */}
          <div className="rw-main">

            <div className="rw-section">
              <div className="rw-sec-hd">
                <span className="rw-sec-title">Professional Experience</span>
                <div className="rw-sec-line"/>
              </div>

              {/* Carufus */}
              <div className="rw-exp">
                <div className="rw-exp-hd">
                  <div><div className="rw-role">Software Developer</div><div className="rw-co">Carufus Technology</div></div>
                  <div className="rw-badge current">May 2024 – Present</div>
                </div>
                <div className="rw-award">★ &nbsp;Employee of the Month – May 2026</div>
                <ul className="rw-ul">
                  <li>Feature enhancement &amp; development for <b>Wow! Momo's ERP/HRMS/Employee Management Portal</b></li>
                  <li>Daily <b>Scrum meetings</b> and <b>sprint planning</b> for task prioritization and progress tracking</li>
                  <li>New feature integration across modules; managed <b>.NET-based APIs</b> for system communication</li>
                  <li>Authored <b>SQL scripts &amp; stored procedures</b> in SSMS for database operations &amp; optimization</li>
                  <li>Built <b>automated batch-file deployment</b> triggered on latest commits — streamlined CI/CD pipeline</li>
                  <li>Managed <b>UAT &amp; PROD deployments</b> via Remote Desktop Connection</li>
                  <li>Comprehensive <b>test case execution</b> and bug resolution for optimal performance</li>
                </ul>
              </div>

              {/* Digital Rhombus */}
              <div className="rw-exp">
                <div className="rw-exp-hd">
                  <div><div className="rw-role">MERN Stack Developer Intern</div><div className="rw-co">Digital Rhombus</div></div>
                  <div className="rw-badge">Feb – Apr 2024</div>
                </div>
                <ul className="rw-ul">
                  <li>Built <b>financial reporting website</b> with interactive data visualization features</li>
                  <li>Developed <b>Your Handyman</b> — an Urban Clap clone for home-service booking</li>
                  <li>Used <b>MySQL</b> for database management and Express.js for RESTful API creation</li>
                </ul>
              </div>

              {/* Tescom */}
              <div className="rw-exp">
                <div className="rw-exp-hd">
                  <div><div className="rw-role">Full Stack MERN Developer Intern</div><div className="rw-co">Tescom</div></div>
                  <div className="rw-badge">Jul – Sep 2023</div>
                </div>
                <ul className="rw-ul">
                  <li>Developed <b>Bharat CXO</b> and <b>TESCOM company website</b>; deployed on Ubuntu server</li>
                  <li>Implemented <b>certificate generation, WhatsApp messaging &amp; email automation</b> via Pabbly</li>
                  <li>Managed all business emails through <b>Zoho Mail</b></li>
                </ul>
              </div>

              {/* DevTown */}
              <div className="rw-exp">
                <div className="rw-exp-hd">
                  <div><div className="rw-role">MERN Training &amp; Internship</div><div className="rw-co">DevTown</div></div>
                  <div className="rw-badge">Jan – Apr 2022</div>
                </div>
                <ul className="rw-ul">
                  <li>Completed 3-month intensive MERN stack training program</li>
                  <li>Built a <b>movie booking app</b> with auth, listings &amp; seat selection using Agile methodology</li>
                </ul>
              </div>

            </div>{/* end experience section */}

            {/* QUICK-STATS FILLER ROW */}
            <div className="rw-inpage-divider"/>
            <div className="rw-stats-row">
              <div className="rw-stat"><div className="sv">4<span>+</span></div><div className="sl">Internships</div></div>
              <div className="rw-stat"><div className="sv">7<span>+</span></div><div className="sl">Projects</div></div>
              <div className="rw-stat"><div className="sv">6<span>+</span></div><div className="sl">Tech Stacks</div></div>
              <div className="rw-stat"><div className="sv">2<span>yr</span></div><div className="sl">Industry Exp.</div></div>
            </div>

          </div>{/* end main */}
        </div>{/* end body */}

        <div className="rw-pg-num">— 1 of 2 —</div>
      </div>{/* end page 1 */}


      {/* PAGE 2 */}
      <div className="rw-page" ref={page2Ref}>

        <div className="rw-mini-hd">
          <div className="rw-mini-name">Gopal Gupta</div>
          <div className="rw-mini-sub">MERN Stack Developer · Software Developer</div>
        </div>

        <div className="rw-p2-body">

          {/* PROJECTS */}
          <div className="rw-section">
            <div className="rw-sec-hd">
              <span className="rw-sec-title">Projects</span>
              <div className="rw-sec-line"/>
            </div>
            <div className="rw-proj-grid">

              {/* FEATURED */}
              <div className="rw-proj featured">
                <div className="rw-feat-tag">★ FEATURED</div>
                <div className="rw-proj-title">Smart BI Assistant (Agentic AI)</div>
                <div className="rw-proj-desc">
                  Agentic AI-powered Business Intelligence system — users ask natural-language questions like <em>"What were today's sales?"</em>.
                  The AI agent auto-generates &amp; executes SQL queries on SSMS, retrieves real-time data, and surfaces human-readable
                  insights: <em>"Today's sales were ₹2,00,000."</em> Eliminates manual SQL effort and accelerates decision-making through a conversational interface.
                </div>
                <div className="rw-techs">{['Agentic AI','SQL Server / SSMS','NLP','React.js','Node.js','Express.js'].map(t=><span className="rw-tech" key={t}>{t}</span>)}</div>
              </div>

              <div className="rw-proj">
                <div className="rw-proj-title">RandomType <a href="https://randomtypee.netlify.app/" target="_blank" rel="noreferrer">Live ↗</a></div>
                <div className="rw-proj-desc">MERN typing speed test app with real-time metrics to track and improve accuracy.</div>
                <div className="rw-techs">{['MongoDB','Express','React','Node.js'].map(t=><span className="rw-tech" key={t}>{t}</span>)}</div>
              </div>

              <div className="rw-proj">
                <div className="rw-proj-title">Your Handyman <a href="https://your-handyman.vercel.app/" target="_blank" rel="noreferrer">Live ↗</a></div>
                <div className="rw-proj-desc">Home services platform with Google auth, Firebase OTP &amp; role-based access (Urban Clap clone).</div>
                <div className="rw-techs">{['MERN Stack','Firebase','GCP'].map(t=><span className="rw-tech" key={t}>{t}</span>)}</div>
              </div>

              <div className="rw-proj">
                <div className="rw-proj-title">Financial Reporting Website</div>
                <div className="rw-proj-desc">Interactive data visualization platform with customizable PDF report generation for financial statements.</div>
                <div className="rw-techs">{['MERN Stack','Chart.js','D3.js'].map(t=><span className="rw-tech" key={t}>{t}</span>)}</div>
              </div>

              <div className="rw-proj">
                <div className="rw-proj-title">BharatCXO <a href="https://bharatcxomernproject.netlify.app/" target="_blank" rel="noreferrer">Live ↗</a></div>
                <div className="rw-proj-desc">Connects C-suite executives with membership-based access and event management features.</div>
                <div className="rw-techs">{['MERN Stack','Zoho Mail API'].map(t=><span className="rw-tech" key={t}>{t}</span>)}</div>
              </div>

              <div className="rw-proj">
                <div className="rw-proj-title">Tescom Business Solution <a href="https://tescom.vercel.app/" target="_blank" rel="noreferrer">Live ↗</a></div>
                <div className="rw-proj-desc">Corporate site with automated certificate generation, WhatsApp integration, and vendor portal.</div>
                <div className="rw-techs">{['MERN Stack','Pabbly Connect'].map(t=><span className="rw-tech" key={t}>{t}</span>)}</div>
              </div>

              <div className="rw-proj">
                <div className="rw-proj-title">Movie Booking Website</div>
                <div className="rw-proj-desc">Team-built booking app with user auth, movie listings &amp; seat selection using Agile methodology.</div>
                <div className="rw-techs">{['MongoDB','Express','React','Node.js'].map(t=><span className="rw-tech" key={t}>{t}</span>)}</div>
              </div>

            </div>
          </div>

          {/* CERTIFICATIONS & ADDITIONAL SKILLS */}
          <div className="rw-section" style={{marginTop:'20px'}}>
            <div className="rw-sec-hd">
              <span className="rw-sec-title">Additional Skills &amp; Certifications</span>
              <div className="rw-sec-line"/>
            </div>
            <div className="rw-cert-grid">
              {[
                'MERN Stack Certification',
                'CI/CD Deployment',
                'Agile / Scrum Methodology',
                'RESTful API Design',
                'Responsive Web Design',
                'Third-party API Integration',
                'Quality Assurance & Testing',
                'Version Control (Git/GitHub)',
                'Agentic AI Development',
              ].map(c=>(
                <div className="rw-cert-card" key={c}>
                  <div className="icon-dot"/>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="rw-pg-num">— 2 of 2 —</div>
      </div>{/* end page 2 */}


      {/* DOWNLOAD BUTTON */}
      <div className="rw-dl-wrap">
        <button className="rw-dl-btn" onClick={downloadPDF}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Download Resume as PDF
        </button>
      </div>

    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   RESUME 3 — Professional Serif (EB Garamond) theme
════════════════════════════════════════════════════════════ */
const Resume3 = () => {
  const page1Ref = useRef(null);
  const page2Ref = useRef(null);

  useEffect(() => {
    if (!document.getElementById('gr-css')) {
      const s = document.createElement('style');
      s.id = 'gr-css';
      s.textContent = grCSS;
      document.head.appendChild(s);
    }
  }, []);

  const downloadPDF = async () => {
    if (!page1Ref.current || !page2Ref.current) return;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pw  = pdf.internal.pageSize.getWidth();
    const ph  = pdf.internal.pageSize.getHeight();
    const opt = el => ({ scale:3, useCORS:true, logging:false, letterRendering:true, allowTaint:false, backgroundColor:'#ffffff', windowWidth:el.scrollWidth, windowHeight:el.scrollHeight });
    try {
      const c1 = await html2canvas(page1Ref.current, opt(page1Ref.current));
      pdf.addImage(c1.toDataURL('image/png',1),'PNG',0,0,pw,Math.min((c1.height*pw)/c1.width,ph));
      pdf.addPage();
      const c2 = await html2canvas(page2Ref.current, opt(page2Ref.current));
      pdf.addImage(c2.toDataURL('image/png',1),'PNG',0,0,pw,Math.min((c2.height*pw)/c2.width,ph));
      pdf.save('gopal_gupta_resume.pdf');
    } catch(e) { console.error(e); alert('Error generating PDF. Please try again.'); }
  };

  return (
    <div className="gr-outer">

      {/* PAGE 1 */}
      <div className="gr-page" ref={page1Ref}>

        {/* HEADER */}
        <div className="gr-hd">
          <div className="gr-hd-row">
            <div>
              <div className="gr-name">Gopal Gupta</div>
              <div className="gr-role">MERN Stack Developer &nbsp;·&nbsp; Software Developer</div>
            </div>
          </div>
          <div className="gr-contacts">
            <div className="gr-contact">
              <Ico d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              (+91) 9082257079
            </div>
            <div className="gr-contact">
              <Ico d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              guptagopal18082003@gmail.com
            </div>
            <div className="gr-contact">
              <Ico d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
              <a href="https://github.com/gopalgupta0007" target="_blank" rel="noreferrer">GitHub: gopalgupta0007</a>
            </div>
            <div className="gr-contact">
              <Ico d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" d2="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              G.T.B Nagar, Sion Koliwada, Mumbai – 400037
            </div>
          </div>
        </div>

        <div className="gr-body">

          {/* PROFESSIONAL SYNOPSIS */}
          <div className="gr-sec">
            <div className="gr-sec-hd"><span className="gr-sec-title">Professional Synopsis</span><div className="gr-sec-rule"/></div>
            <p className="gr-synopsis">
              Results-driven <strong>MERN Stack and Software Developer</strong> with 2+ years of hands-on experience delivering
              enterprise-grade ERP/HRMS portals, RESTful APIs, and CI/CD automation pipelines. Proven ability to build
              and deploy full-stack web applications using <strong>React.js, Node.js, Express.js, and SQL Server</strong>, with
              practical exposure to <strong>Agentic AI and natural-language SQL interfaces</strong>. Recognized as
              <strong> Employee of the Month (May 2026)</strong> at Carufus Technology for outstanding contributions to
              Wow! Momo's internal management platform. Skilled in Agile/Scrum workflows, automated deployment,
              and cross-functional collaboration.
            </p>
          </div>

          {/* CORE COMPETENCIES */}
          <div className="gr-sec">
            <div className="gr-sec-hd"><span className="gr-sec-title">Core Competencies</span><div className="gr-sec-rule"/></div>
            <ul className="gr-comp-list">
              {[
                ['React.js, Angular.js, HTML5, CSS3, JavaScript (ES6+)','Strong frontend proficiency across modern frameworks.'],
                ['Node.js, Express.js, .NET APIs','Full backend stack for building RESTful services.'],
                ['MongoDB, MySQL, SQL Server (SSMS)','Database design, query optimization, stored procedures.'],
                ['CI/CD Automation','Batch-file based automated deployment triggered on latest commits.'],
                ['Agentic AI & NLP Integration','Natural-language to SQL query system for real-time BI insights.'],
                ['Agile / Scrum Methodology','Daily standups, sprint planning, task prioritization.'],
                ['Git, GitHub, Version Control','Feature branching, PR reviews, versioned releases.'],
                ['UAT & PROD Deployment','Remote Desktop Connection-based environment management.'],
                ['Quality Assurance & Testing','Test case creation, execution, bug resolution workflows.'],
                ['Ubuntu Server, Netlify, Vercel','Multi-platform deployment and hosting experience.'],
              ].map(([b, rest]) => (
                <li className="gr-comp-item" key={b}><b>{b}</b> — {rest}</li>
              ))}
            </ul>
          </div>

          {/* ACADEMIC CREDENTIALS */}
          <div className="gr-sec">
            <div className="gr-sec-hd"><span className="gr-sec-title">Academic Credentials</span><div className="gr-sec-rule"/></div>
            {[
              { deg: 'M.Sc. (Information Technology)', inst: 'Mumbai University', yr: '2024 – 2026', extra: 'Completed Apr 2026' },
              { deg: 'B.Sc. (Information Technology)', inst: 'Mumbai University', yr: '2021 – 2024', extra: 'Apr 2024' },
              { deg: 'HSC (Higher Secondary Certificate)', inst: '', yr: 'Mar 2021', extra: '74%' },
              { deg: 'SSC (Secondary School Certificate)', inst: '', yr: 'Mar 2019', extra: '60%' },
            ].map(e => (
              <div className="gr-edu-row" key={e.deg} style={{marginBottom:'6px'}}>
                <span className="gr-edu-deg">
                  {e.deg}{e.inst && <span style={{fontWeight:400,color:'var(--muted)'}}> — {e.inst}</span>}
                </span>
                <span className="gr-edu-meta">{e.extra} &nbsp;|&nbsp; {e.yr}</span>
              </div>
            ))}
          </div>

          {/* PROFESSIONAL TRACK RECORD */}
          <div className="gr-sec">
            <div className="gr-sec-hd"><span className="gr-sec-title">Professional Track Record</span><div className="gr-sec-rule"/></div>

            {/* Carufus */}
            <div className="gr-exp">
              <div className="gr-exp-hd">
                <div>
                  <div className="gr-exp-co">Carufus Technology</div>
                  <div className="gr-exp-role">Software Developer &nbsp;·&nbsp; Mumbai, India</div>
                </div>
                <div className="gr-exp-date">May 2024 – Present</div>
              </div>
              <div className="gr-award">★ &nbsp; Employee of the Month — May 2026</div>
              <ul className="gr-ul">
                <li>Feature enhancement &amp; development for <b>Wow! Momo's internal ERP/HRMS/Employee Management Portal</b></li>
                <li>Daily <b>Scrum meetings</b> and <b>sprint planning</b> for task prioritization and delivery tracking</li>
                <li>Integrated new features across modules; managed <b>.NET-based APIs</b> for seamless system communication</li>
                <li>Authored <b>SQL scripts and stored procedures</b> in SSMS for database operations and optimization</li>
                <li>Developed <b>automated batch-file deployment</b> triggered on latest commits — streamlined CI/CD pipeline</li>
                <li>Managed <b>UAT and PROD environment deployments</b> via Remote Desktop Connection</li>
                <li>Comprehensive <b>test case execution</b> and bug resolution for optimal application performance</li>
              </ul>
            </div>

            {/* Digital Rhombus */}
            <div className="gr-exp">
              <div className="gr-exp-hd">
                <div>
                  <div className="gr-exp-co">Digital Rhombus</div>
                  <div className="gr-exp-role">MERN Stack Developer Intern &nbsp;·&nbsp; Mumbai, India</div>
                </div>
                <div className="gr-exp-date past">Feb 2024 – Apr 2024</div>
              </div>
              <ul className="gr-ul">
                <li>Built a <b>financial reporting website</b> with interactive data visualization features</li>
                <li>Developed <b>Your Handyman</b> — an Urban Clap clone for home-service booking with Google auth &amp; OTP</li>
                <li>Implemented responsive UI designs; used <b>MySQL</b> and Express.js for RESTful API creation</li>
              </ul>
            </div>

            {/* Tescom */}
            <div className="gr-exp">
              <div className="gr-exp-hd">
                <div>
                  <div className="gr-exp-co">Tescom</div>
                  <div className="gr-exp-role">Full Stack MERN Developer Intern &nbsp;·&nbsp; Mumbai, India</div>
                </div>
                <div className="gr-exp-date past">Jul 2023 – Sep 2023</div>
              </div>
              <ul className="gr-ul">
                <li>Developed <b>Bharat CXO</b> and <b>TESCOM company website</b>; deployed on Ubuntu server</li>
                <li>Implemented <b>certificate generation, WhatsApp messaging &amp; email automation</b> via Pabbly Connect</li>
                <li>Managed all business emails through <b>Zoho Mail</b></li>
              </ul>
            </div>

            {/* DevTown */}
            <div className="gr-exp" style={{marginBottom:0}}>
              <div className="gr-exp-hd">
                <div>
                  <div className="gr-exp-co">DevTown</div>
                  <div className="gr-exp-role">MERN Training Program &amp; Internship</div>
                </div>
                <div className="gr-exp-date past">Jan 2022 – Apr 2022</div>
              </div>
              <ul className="gr-ul">
                <li>Completed 3-month intensive MERN stack training program</li>
                <li>Built a <b>movie booking application</b> with auth, listings &amp; seat selection using Agile methodology</li>
              </ul>
            </div>
          </div>

          {/* STATS */}
          <div className="gr-stats">
            <div className="gr-stat"><div className="sv">2<span>+</span></div><div className="sl">Years Exp.</div></div>
            <div className="gr-stat"><div className="sv">4<span>+</span></div><div className="sl">Internships</div></div>
            <div className="gr-stat"><div className="sv">7<span>+</span></div><div className="sl">Projects</div></div>
            <div className="gr-stat"><div className="sv">6<span>+</span></div><div className="sl">Tech Stacks</div></div>
          </div>
        </div>

        <div className="gr-pg-num">Page 1 of 2</div>
      </div>

      {/* PAGE BREAK visual gap */}
      <div style={{height:'20px'}}/>

      {/* PAGE 2 */}
      <div className="gr-page" ref={page2Ref}>

        <div className="gr-mini-hd">
          <div className="gr-mini-name">Gopal Gupta</div>
          <div className="gr-mini-sub">MERN Stack Developer · Software Developer</div>
        </div>

        <div className="gr-body">

          {/* PROJECT HIGHLIGHTS */}
          <div className="gr-sec">
            <div className="gr-sec-hd"><span className="gr-sec-title">Project Highlights</span><div className="gr-sec-rule"/></div>

            {/* Smart BI */}
            <div className="gr-proj">
              <div className="gr-proj-hd">
                <div className="gr-proj-title">Smart BI Assistant (Agentic AI + SQL Server)</div>
              </div>
              <div className="gr-proj-stack">React.js, Node.js, Express.js, Agentic AI, SQL Server / SSMS, NLP</div>
              <ul className="gr-ul" style={{margin:'6px 0'}}>
                <li>Built an <b>Agentic AI-powered Business Intelligence system</b> that accepts natural-language queries like <em>"What were today's sales?"</em></li>
                <li>AI agent auto-generates and executes SQL queries against SSMS databases and returns human-readable insights</li>
                <li>Eliminates manual SQL effort; delivers real-time decision support through a conversational interface</li>
                <li>Designed for scalable enterprise use with modular query pipeline and structured output formatting</li>
              </ul>
            </div>

            {/* RandomType */}
            <div className="gr-proj">
              <div className="gr-proj-hd">
                <div className="gr-proj-title">RandomType &nbsp;<a href="https://randomtypee.netlify.app/" target="_blank" rel="noreferrer" style={{fontSize:'10px',color:'var(--blue)',fontWeight:500}}>randomtypee.netlify.app ↗</a></div>
              </div>
              <div className="gr-proj-stack">MongoDB, Express.js, React.js, Node.js</div>
              <ul className="gr-ul" style={{margin:'6px 0'}}>
                <li>MERN-stack typing speed test application with real-time WPM metrics and accuracy tracking</li>
                <li>Leaderboard system with user authentication and progress persistence via MongoDB</li>
              </ul>
            </div>

            {/* Your Handyman */}
            <div className="gr-proj">
              <div className="gr-proj-hd">
                <div className="gr-proj-title">Your Handyman &nbsp;<a href="https://your-handyman.vercel.app/" target="_blank" rel="noreferrer" style={{fontSize:'10px',color:'var(--blue)',fontWeight:500}}>your-handyman.vercel.app ↗</a></div>
              </div>
              <div className="gr-proj-stack">MERN Stack, Firebase, GCP, Google OAuth</div>
              <ul className="gr-ul" style={{margin:'6px 0'}}>
                <li>Home services booking platform (Urban Clap clone) with <b>Google OAuth</b> and <b>Firebase OTP verification</b></li>
                <li>Role-based access control for customers, service providers, and admins</li>
              </ul>
            </div>

            {/* Financial Reporting */}
            <div className="gr-proj">
              <div className="gr-proj-hd">
                <div className="gr-proj-title">Financial Reporting Website</div>
              </div>
              <div className="gr-proj-stack">MERN Stack, Chart.js, D3.js</div>
              <ul className="gr-ul" style={{margin:'6px 0'}}>
                <li>Interactive data visualization platform for financial statement analysis</li>
                <li>Customizable <b>PDF report generation</b> with dynamic charts using Chart.js and D3.js</li>
              </ul>
            </div>

            {/* BharatCXO */}
            <div className="gr-proj">
              <div className="gr-proj-hd">
                <div className="gr-proj-title">BharatCXO &nbsp;<a href="https://bharatcxomernproject.netlify.app/" target="_blank" rel="noreferrer" style={{fontSize:'10px',color:'var(--blue)',fontWeight:500}}>bharatcxomernproject.netlify.app ↗</a></div>
              </div>
              <div className="gr-proj-stack">MERN Stack, Zoho Mail API</div>
              <ul className="gr-ul" style={{margin:'6px 0'}}>
                <li>Platform connecting C-suite executives with <b>membership-based access</b> and event management</li>
                <li>Integrated Zoho Mail API for automated transactional email workflows</li>
              </ul>
            </div>

            {/* Tescom */}
            <div className="gr-proj">
              <div className="gr-proj-hd">
                <div className="gr-proj-title">Tescom Business Solution &nbsp;<a href="https://tescom.vercel.app/" target="_blank" rel="noreferrer" style={{fontSize:'10px',color:'var(--blue)',fontWeight:500}}>tescom.vercel.app ↗</a></div>
              </div>
              <div className="gr-proj-stack">MERN Stack, Pabbly Connect</div>
              <ul className="gr-ul" style={{margin:'6px 0'}}>
                <li>Corporate website with <b>automated certificate generation</b> and <b>WhatsApp messaging integration</b></li>
                <li>Vendor portal and business email management via Zoho Mail</li>
              </ul>
            </div>
          </div>

          {/* TECHNICAL SKILLS */}
          <div className="gr-sec">
            <div className="gr-sec-hd"><span className="gr-sec-title">Technical Skills</span><div className="gr-sec-rule"/></div>
            <table className="gr-tech-table">
              <tbody>
                {[
                  ['Frontend',         'React.js, Angular.js, HTML5, CSS3, JavaScript (ES6+), Bootstrap'],
                  ['Backend',          'Node.js, Express.js, .NET APIs, RESTful Services'],
                  ['Database',         'MongoDB, MySQL, SQL Server (SSMS), H2'],
                  ['AI / Automation',  'Agentic AI, NLP (Natural Language to SQL), Pabbly Connect'],
                  ['DevOps & Tools',   'Git, GitHub, VS Code, Postman, Ubuntu Server'],
                  ['Deployment',       'Netlify, Vercel, Ubuntu Server, Remote Desktop (UAT/PROD)'],
                  ['Other',            'Core Java, OOPS, Firebase, GCP, Zoho Mail API'],
                  ['IDEs',             'Visual Studio Code, Postman'],
                  ['Operating Systems','Windows, Ubuntu Linux'],
                ].map(([l,v]) => (
                  <tr key={l}><td>{l}</td><td>{v}</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ADDITIONAL SKILLS & CERTIFICATIONS */}
          <div className="gr-sec">
            <div className="gr-sec-hd"><span className="gr-sec-title">Additional Skills &amp; Certifications</span><div className="gr-sec-rule"/></div>
            <div className="gr-tags">
              {['MERN Stack Certification','CI/CD Deployment Automation','Agile / Scrum Methodology',
                'RESTful API Design','Responsive Web Design','Third-party API Integration',
                'Quality Assurance & Testing','Version Control (Git/GitHub)',
                'Agentic AI Development','SQL Optimization','UAT & PROD Management'].map(c=>(
                <span className="gr-tag" key={c}>{c}</span>
              ))}
            </div>
          </div>

        </div>

        <div className="gr-pg-num">Page 2 of 2</div>
      </div>

      {/* DOWNLOAD */}
      <div className="gr-dl-wrap">
        <button className="gr-dl-btn" onClick={downloadPDF}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Download Resume as PDF
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
    if (!document.getElementById('gr-css')) {
      const s = document.createElement('style');
      s.id = 'gr-css';
      s.textContent = grCSS;
      document.head.appendChild(s);
    }
  }, []);

  return (
    <div>
      {/* Tab Bar */}
      <div className="tab-container" style={{ marginTop: '24px' }}>
        <button
          className={`tab-btn ${activeTab === 1 ? 'active' : ''}`}
          onClick={() => setActiveTab(1)}
        >
          Resume — Classic
        </button>
        <button
          className={`tab-btn ${activeTab === 2 ? 'active' : ''}`}
          onClick={() => setActiveTab(2)}
        >
          Resume — Premium
        </button>
        <button
          className={`tab-btn ${activeTab === 3 ? 'active' : ''}`}
          onClick={() => setActiveTab(3)}
        >
          Resume — Professional
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 1 && <Resume1 />}
      {activeTab === 2 && <Resume2 />}
      {activeTab === 3 && <Resume3 />}
    </div>
  );
};

export default App;
