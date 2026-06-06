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
      </div>

      {/* Tab Content */}
      {activeTab === 1 && <Resume1 />}
      {activeTab === 2 && <Resume2 />}
    </div>
  );
};

export default App;




























// // import React, { useRef } from 'react';
// // import html2canvas from 'html2canvas';
// // import jsPDF from 'jspdf';

// // /* ─────────────────────────────────────────────────────────────
// //    GLOBAL STYLES  (injected once into <head>)
// // ───────────────────────────────────────────────────────────── */
// // const globalStyles = `
// //   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

// //   :root {
// //     --navy:        #0a1628;
// //     --navy-2:      #0f2040;
// //     --navy-3:      #162a50;
// //     --gold:        #c8a96e;
// //     --gold-light:  #e8d5a8;
// //     --gold-pale:   #fdf6e8;
// //     --white:       #ffffff;
// //     --off-white:   #f8f7f4;
// //     --border:      #e2ddd5;
// //     --text:        #0a1628;
// //     --text-muted:  #5a6a7e;
// //     --text-light:  #8a96a8;
// //     --green:       #1a6e45;
// //     --green-bg:    #ecf7f2;
// //     --green-border:#a8d8be;
// //   }

// //   * { margin: 0; padding: 0; box-sizing: border-box; }

// //   body {
// //     font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
// //     background: #f0ede8;
// //     -webkit-font-smoothing: antialiased;
// //     -moz-osx-font-smoothing: grayscale;
// //   }

// //   /* ── PAGE SHELL ── */
// //   .rw-shell {
// //     max-width: 900px;
// //     margin: 0 auto;
// //     padding: 32px 20px 60px;
// //   }

// //   /* ── RESUME PAGE ── */
// //   .rw-page {
// //     background: var(--white);
// //     margin-bottom: 28px;
// //     overflow: hidden;
// //     box-shadow:
// //       0 1px 1px rgba(10,22,40,.04),
// //       0 4px 8px rgba(10,22,40,.06),
// //       0 16px 40px rgba(10,22,40,.10);
// //   }

// //   /* ══════════════════════════════
// //      HEADER
// //   ══════════════════════════════ */
// //   .rw-header {
// //     background: linear-gradient(145deg, var(--navy) 0%, var(--navy-3) 100%);
// //     padding: 40px 44px 30px;
// //     position: relative;
// //     overflow: hidden;
// //   }
// //   /* subtle geometric accent rings */
// //   .rw-header::before {
// //     content: '';
// //     position: absolute;
// //     top: -80px; right: -80px;
// //     width: 300px; height: 300px;
// //     border-radius: 50%;
// //     border: 1px solid rgba(200,169,110,.12);
// //     pointer-events: none;
// //   }
// //   .rw-header::after {
// //     content: '';
// //     position: absolute;
// //     top: -50px; right: -50px;
// //     width: 200px; height: 200px;
// //     border-radius: 50%;
// //     border: 1px solid rgba(200,169,110,.08);
// //     pointer-events: none;
// //   }

// //   .rw-header-row {
// //     display: flex;
// //     justify-content: space-between;
// //     align-items: flex-start;
// //     gap: 20px;
// //     margin-bottom: 22px;
// //   }
// //   .rw-name {
// //     font-family: 'Playfair Display', Georgia, serif;
// //     font-size: 38px;
// //     font-weight: 700;
// //     color: var(--white);
// //     letter-spacing: .5px;
// //     line-height: 1.05;
// //   }
// //   .rw-title {
// //     font-size: 11px;
// //     font-weight: 500;
// //     letter-spacing: 2.8px;
// //     text-transform: uppercase;
// //     color: var(--gold);
// //     margin-top: 7px;
// //   }
// //   .rw-exp-pill {
// //     background: var(--gold);
// //     color: var(--navy);
// //     padding: 10px 18px;
// //     text-align: center;
// //     flex-shrink: 0;
// //     line-height: 1.2;
// //   }
// //   .rw-exp-pill .years {
// //     font-family: 'Playfair Display', serif;
// //     font-size: 26px;
// //     font-weight: 700;
// //     display: block;
// //     line-height: 1;
// //   }
// //   .rw-exp-pill .label {
// //     font-size: 9.5px;
// //     font-weight: 600;
// //     letter-spacing: 1px;
// //     text-transform: uppercase;
// //     display: block;
// //     margin-top: 2px;
// //   }

// //   /* gold divider */
// //   .rw-divider {
// //     height: 1px;
// //     background: linear-gradient(90deg, transparent, rgba(200,169,110,.5), transparent);
// //     margin-bottom: 18px;
// //   }

// //   .rw-contacts {
// //     display: flex;
// //     flex-wrap: wrap;
// //     gap: 6px 20px;
// //   }
// //   .rw-contact {
// //     display: flex;
// //     align-items: center;
// //     gap: 6px;
// //     font-size: 11.5px;
// //     color: rgba(255,255,255,.7);
// //     letter-spacing: .1px;
// //   }
// //   .rw-contact svg { color: var(--gold); flex-shrink: 0; }
// //   .rw-contact a  { color: var(--gold-light); text-decoration: none; }

// //   /* ══════════════════════════════
// //      BODY  (sidebar + main)
// //   ══════════════════════════════ */
// //   .rw-body {
// //     display: grid;
// //     grid-template-columns: 232px 1fr;
// //   }

// //   /* ── SIDEBAR ── */
// //   .rw-sidebar {
// //     background: var(--navy-2);
// //     padding: 28px 22px;
// //     border-right: 1px solid rgba(255,255,255,.04);
// //   }
// //   .rw-sb-section { margin-bottom: 26px; }
// //   .rw-sb-title {
// //     font-size: 8.5px;
// //     font-weight: 600;
// //     letter-spacing: 2.8px;
// //     text-transform: uppercase;
// //     color: var(--gold);
// //     padding-bottom: 8px;
// //     border-bottom: 1px solid rgba(200,169,110,.2);
// //     margin-bottom: 14px;
// //   }

// //   /* education */
// //   .rw-edu { margin-bottom: 11px; }
// //   .rw-edu .degree { color: var(--white); font-weight: 600; font-size: 12px; }
// //   .rw-edu .school { color: rgba(255,255,255,.5); font-size: 10.5px; margin-top: 1px; }
// //   .rw-edu .year   { color: var(--gold); font-size: 10px; margin-top: 2px; font-weight: 500; }

// //   /* skill groups */
// //   .rw-sg { margin-bottom: 13px; }
// //   .rw-sg-label {
// //     color: rgba(255,255,255,.5);
// //     font-size: 10px; font-weight: 500;
// //     margin-bottom: 5px;
// //     letter-spacing: .3px;
// //   }
// //   .rw-tags { display: flex; flex-wrap: wrap; gap: 4px; }
// //   .rw-tag {
// //     background: rgba(200,169,110,.10);
// //     color: rgba(255,255,255,.78);
// //     font-size: 9.5px;
// //     padding: 3px 8px;
// //     border: 1px solid rgba(200,169,110,.18);
// //     letter-spacing: .2px;
// //   }

// //   /* cert list */
// //   .rw-cert {
// //     display: flex; align-items: flex-start; gap: 7px;
// //     color: rgba(255,255,255,.68); font-size: 11px;
// //     margin-bottom: 7px; line-height: 1.35;
// //   }
// //   .rw-cert-dot {
// //     width: 4px; height: 4px;
// //     background: var(--gold);
// //     border-radius: 50%;
// //     flex-shrink: 0; margin-top: 4px;
// //   }

// //   /* ── MAIN ── */
// //   .rw-main { padding: 26px 28px 24px 24px; }

// //   .rw-section { margin-bottom: 22px; }
// //   .rw-sec-hd {
// //     display: flex; align-items: center; gap: 10px;
// //     margin-bottom: 14px;
// //   }
// //   .rw-sec-title {
// //     font-size: 9px; font-weight: 600;
// //     letter-spacing: 3px; text-transform: uppercase;
// //     color: var(--text-muted);
// //     white-space: nowrap;
// //   }
// //   .rw-sec-line { flex: 1; height: 1px; background: var(--border); }

// //   /* ── EXPERIENCE ITEMS ── */
// //   .rw-exp { margin-bottom: 16px; padding-left: 14px; position: relative; }
// //   .rw-exp::before {
// //     content: '';
// //     position: absolute; left: 0; top: 6px;
// //     width: 5px; height: 5px; border-radius: 50%;
// //     background: var(--gold);
// //   }
// //   .rw-exp::after {
// //     content: '';
// //     position: absolute; left: 2px; top: 13px; bottom: -6px;
// //     width: 1px; background: var(--border);
// //   }
// //   .rw-exp:last-child::after { display: none; }

// //   .rw-exp-hd {
// //     display: flex; justify-content: space-between;
// //     align-items: flex-start; gap: 8px; flex-wrap: wrap;
// //     margin-bottom: 3px;
// //   }
// //   .rw-role  { font-weight: 600; font-size: 12.5px; color: var(--text); }
// //   .rw-co    { font-size: 11px; color: var(--text-muted); margin-top: 1px; }
// //   .rw-badge {
// //     font-size: 10px; font-weight: 500;
// //     color: var(--navy); background: var(--off-white);
// //     padding: 3px 9px; border: 1px solid var(--border);
// //     white-space: nowrap; flex-shrink: 0;
// //   }
// //   .rw-badge.current {
// //     color: var(--green);
// //     background: var(--green-bg);
// //     border-color: var(--green-border);
// //   }

// //   /* award */
// //   .rw-award {
// //     display: inline-flex; align-items: center; gap: 6px;
// //     background: linear-gradient(90deg, #fdf3dc, #fffbf0);
// //     border: 1px solid #e2c060;
// //     border-left: 3px solid var(--gold);
// //     color: #7a5800;
// //     font-size: 10.5px; font-weight: 600;
// //     padding: 4px 10px;
// //     margin-bottom: 6px;
// //     letter-spacing: .1px;
// //   }

// //   /* bullets */
// //   .rw-ul { list-style: none; margin-top: 4px; }
// //   .rw-ul li {
// //     font-size: 11.5px; color: var(--text-muted);
// //     padding: 2px 0 2px 12px; position: relative; line-height: 1.5;
// //   }
// //   .rw-ul li::before {
// //     content: '–';
// //     position: absolute; left: 0;
// //     color: var(--gold); font-weight: 700;
// //   }
// //   .rw-ul b { color: var(--text); font-weight: 600; }

// //   /* ══════════════════════════════
// //      PAGE 2 — MINI HEADER
// //   ══════════════════════════════ */
// //   .rw-mini-hd {
// //     background: linear-gradient(145deg, var(--navy), var(--navy-3));
// //     padding: 14px 44px;
// //     display: flex; justify-content: space-between; align-items: center;
// //   }
// //   .rw-mini-name {
// //     font-family: 'Playfair Display', serif;
// //     font-size: 18px; font-weight: 700; color: var(--white);
// //   }
// //   .rw-mini-sub {
// //     font-size: 9.5px; font-weight: 500; letter-spacing: 2px;
// //     text-transform: uppercase; color: var(--gold);
// //   }

// //   /* ── PAGE 2 BODY ── */
// //   .rw-p2-body { padding: 26px 44px 32px; }

// //   /* ── PROJECT GRID ── */
// //   .rw-proj-grid {
// //     display: grid;
// //     grid-template-columns: 1fr 1fr;
// //     gap: 10px;
// //   }
// //   .rw-proj {
// //     border: 1px solid var(--border);
// //     padding: 13px 15px;
// //     background: var(--white);
// //     transition: box-shadow .18s;
// //   }
// //   .rw-proj:hover { box-shadow: 0 4px 16px rgba(10,22,40,.08); }
// //   .rw-proj.featured {
// //     grid-column: 1 / -1;
// //     border-color: var(--gold);
// //     border-left: 3px solid var(--gold);
// //     background: linear-gradient(135deg, #fffdf5 0%, var(--white) 100%);
// //     position: relative;
// //   }
// //   .rw-feat-tag {
// //     position: absolute; top: 11px; right: 13px;
// //     font-size: 8.5px; font-weight: 700; letter-spacing: 1.5px;
// //     text-transform: uppercase; color: var(--gold);
// //   }
// //   .rw-proj-title {
// //     display: flex; justify-content: space-between; align-items: flex-start; gap: 6px;
// //     font-weight: 600; font-size: 12.5px; color: var(--text);
// //     margin-bottom: 5px;
// //   }
// //   .rw-proj-title a {
// //     font-size: 9.5px; font-weight: 500; color: var(--gold);
// //     text-decoration: none; white-space: nowrap; flex-shrink: 0;
// //     border-bottom: 1px solid var(--gold-light);
// //   }
// //   .rw-proj-desc {
// //     font-size: 11.5px; color: var(--text-muted);
// //     line-height: 1.45; margin-bottom: 7px;
// //   }
// //   .rw-proj-desc em { font-style: italic; color: var(--text); }
// //   .rw-techs { display: flex; flex-wrap: wrap; gap: 4px; }
// //   .rw-tech {
// //     font-size: 9.5px; font-weight: 500;
// //     background: var(--off-white); color: var(--text-muted);
// //     padding: 2px 7px; border: 1px solid var(--border);
// //     letter-spacing: .2px;
// //   }

// //   /* ══════════════════════════════
// //      DOWNLOAD BUTTON
// //   ══════════════════════════════ */
// //   .rw-dl-wrap { display: flex; justify-content: center; margin-top: 24px; }
// //   .rw-dl-btn {
// //     display: inline-flex; align-items: center; gap: 9px;
// //     background: var(--navy);
// //     color: var(--gold);
// //     border: 1.5px solid var(--gold);
// //     padding: 12px 32px;
// //     font-family: 'DM Sans', sans-serif;
// //     font-size: 12px; font-weight: 600;
// //     letter-spacing: 1.5px; text-transform: uppercase;
// //     cursor: pointer;
// //     transition: all .2s ease;
// //   }
// //   .rw-dl-btn:hover {
// //     background: var(--gold);
// //     color: var(--navy);
// //   }
// //   .rw-dl-btn:active { transform: scale(.98); }

// //   .rw-pg-num {
// //     text-align: center; font-size: 9.5px;
// //     color: var(--border); letter-spacing: 1px;
// //     padding: 10px 0 8px;
// //   }
// // `;

// // /* ─────────────────────────────────────────────────────────────
// //    SVG ICON HELPERS
// // ───────────────────────────────────────────────────────────── */
// // const Icon = ({ d, d2, size = 12 }) => (
// //   <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
// //     <path strokeLinecap="round" strokeLinejoin="round" d={d} />
// //     {d2 && <path strokeLinecap="round" strokeLinejoin="round" d={d2} />}
// //   </svg>
// // );

// // /* ─────────────────────────────────────────────────────────────
// //    MAIN COMPONENT
// // ───────────────────────────────────────────────────────────── */
// // const App = () => {
// //   const page1Ref = useRef(null);
// //   const page2Ref = useRef(null);

// //   /* inject global styles once */
// //   React.useEffect(() => {
// //     if (!document.getElementById('rw-global')) {
// //       const s = document.createElement('style');
// //       s.id = 'rw-global';
// //       s.textContent = globalStyles;
// //       document.head.appendChild(s);
// //     }
// //   }, []);

// //   /* ── PDF DOWNLOAD ── */
// //   const downloadPDF = async () => {
// //     if (!page1Ref.current || !page2Ref.current) return;
// //     const pdf = new jsPDF('p', 'mm', 'a4');
// //     const pw  = pdf.internal.pageSize.getWidth();
// //     const ph  = pdf.internal.pageSize.getHeight();
// //     try {
// //       const opts = (el) => ({
// //         scale: 3, useCORS: true, logging: false,
// //         letterRendering: true, allowTaint: false,
// //         backgroundColor: '#ffffff',
// //         windowWidth: el.scrollWidth,
// //         windowHeight: el.scrollHeight,
// //       });
// //       const c1 = await html2canvas(page1Ref.current, opts(page1Ref.current));
// //       pdf.addImage(c1.toDataURL('image/png', 1), 'PNG', 0, 0, pw, Math.min((c1.height * pw) / c1.width, ph));
// //       pdf.addPage();
// //       const c2 = await html2canvas(page2Ref.current, opts(page2Ref.current));
// //       pdf.addImage(c2.toDataURL('image/png', 1), 'PNG', 0, 0, pw, Math.min((c2.height * pw) / c2.width, ph));
// //       pdf.save('gopal_gupta_resume.pdf');
// //     } catch (e) {
// //       console.error(e);
// //       alert('Error generating PDF. Please try again.');
// //     }
// //   };

// //   /* ════════════════════════════════════════════════════════
// //      RENDER
// //   ════════════════════════════════════════════════════════ */
// //   return (
// //     <div className="rw-shell">

// //       {/* ══════════════  PAGE 1  ══════════════ */}
// //       <div className="rw-page" ref={page1Ref}>

// //         {/* HEADER */}
// //         <div className="rw-header">
// //           <div className="rw-header-row">
// //             <div>
// //               <div className="rw-name">Gopal Gupta</div>
// //               <div className="rw-title">MERN Stack Developer &nbsp;·&nbsp; Software Developer</div>
// //             </div>
// //             <div className="rw-exp-pill">
// //               <span className="years">2+</span>
// //               <span className="label">Years Exp.</span>
// //             </div>
// //           </div>
// //           <div className="rw-divider" />
// //           <div className="rw-contacts">
// //             <div className="rw-contact">
// //               <Icon d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
// //               +91 9082257079
// //             </div>
// //             <div className="rw-contact">
// //               <Icon d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
// //               guptagopal18082003@gmail.com
// //             </div>
// //             <div className="rw-contact">
// //               <Icon d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
// //               <a href="https://github.com/gopalgupta0007" target="_blank" rel="noreferrer">github.com/gopalgupta0007</a>
// //             </div>
// //             <div className="rw-contact">
// //               <Icon d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" d2="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
// //               G.T.B Nagar, Sion Koliwada, Mumbai – 400037
// //             </div>
// //           </div>
// //         </div>

// //         {/* BODY */}
// //         <div className="rw-body">

// //           {/* ── SIDEBAR ── */}
// //           <div className="rw-sidebar">

// //             <div className="rw-sb-section">
// //               <div className="rw-sb-title">Education</div>
// //               <div className="rw-edu">
// //                 <div className="degree">M.Sc. (I.T.)</div>
// //                 <div className="school">Mumbai University</div>
// //                 <div className="year">Completed Apr 2026</div>
// //               </div>
// //               <div className="rw-edu">
// //                 <div className="degree">B.Sc. (I.T.)</div>
// //                 <div className="school">Mumbai University</div>
// //                 <div className="year">Apr 2024</div>
// //               </div>
// //               <div className="rw-edu">
// //                 <div className="degree">HSC – 74%</div>
// //                 <div className="year">Mar 2021</div>
// //               </div>
// //               <div className="rw-edu">
// //                 <div className="degree">SSC – 60%</div>
// //                 <div className="year">Mar 2019</div>
// //               </div>
// //             </div>

// //             <div className="rw-sb-section">
// //               <div className="rw-sb-title">Technical Skills</div>
// //               <div className="rw-sg">
// //                 <div className="rw-sg-label">Frontend</div>
// //                 <div className="rw-tags">
// //                   {['HTML5','CSS3','JS ES6+','React.js','Angular.js'].map(t=>(
// //                     <span className="rw-tag" key={t}>{t}</span>
// //                   ))}
// //                 </div>
// //               </div>
// //               <div className="rw-sg">
// //                 <div className="rw-sg-label">Backend</div>
// //                 <div className="rw-tags">
// //                   {['Node.js','Express.js','.NET APIs'].map(t=>(
// //                     <span className="rw-tag" key={t}>{t}</span>
// //                   ))}
// //                 </div>
// //               </div>
// //               <div className="rw-sg">
// //                 <div className="rw-sg-label">Database</div>
// //                 <div className="rw-tags">
// //                   {['MongoDB','MySQL','SQL Server','SSMS'].map(t=>(
// //                     <span className="rw-tag" key={t}>{t}</span>
// //                   ))}
// //                 </div>
// //               </div>
// //               <div className="rw-sg">
// //                 <div className="rw-sg-label">Tools & Deploy</div>
// //                 <div className="rw-tags">
// //                   {['Git','GitHub','VS Code','Postman','Ubuntu','Netlify','Vercel'].map(t=>(
// //                     <span className="rw-tag" key={t}>{t}</span>
// //                   ))}
// //                 </div>
// //               </div>
// //               <div className="rw-sg">
// //                 <div className="rw-sg-label">Other</div>
// //                 <div className="rw-tags">
// //                   {['Core Java','OOPS','Agentic AI'].map(t=>(
// //                     <span className="rw-tag" key={t}>{t}</span>
// //                   ))}
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="rw-sb-section">
// //               <div className="rw-sb-title">Certifications & Skills</div>
// //               {[
// //                 'MERN Stack Certification',
// //                 'CI/CD Deployment',
// //                 'Agile / Scrum Methodology',
// //                 'RESTful API Design',
// //                 'Responsive Web Design',
// //                 'Third-party API Integration',
// //                 'Quality Assurance & Testing',
// //                 'Version Control (Git/GitHub)',
// //               ].map(c => (
// //                 <div className="rw-cert" key={c}>
// //                   <div className="rw-cert-dot" />
// //                   {c}
// //                 </div>
// //               ))}
// //             </div>

// //           </div>{/* end sidebar */}

// //           {/* ── MAIN ── */}
// //           <div className="rw-main">
// //             <div className="rw-section">
// //               <div className="rw-sec-hd">
// //                 <span className="rw-sec-title">Professional Experience</span>
// //                 <div className="rw-sec-line" />
// //               </div>

// //               {/* Carufus Technology */}
// //               <div className="rw-exp">
// //                 <div className="rw-exp-hd">
// //                   <div>
// //                     <div className="rw-role">Software Developer</div>
// //                     <div className="rw-co">Carufus Technology</div>
// //                   </div>
// //                   <div className="rw-badge current">May 2024 – Present</div>
// //                 </div>
// //                 <div className="rw-award">
// //                   ★&nbsp; Employee of the Month – May 2026
// //                 </div>
// //                 <ul className="rw-ul">
// //                   <li>Feature enhancement &amp; development for <b>Wow! Momo's internal ERP/HRMS/Employee Management Portal</b></li>
// //                   <li>Participated in daily <b>Scrum meetings</b> and <b>sprint planning sessions</b> for task prioritization</li>
// //                   <li>Integrated new features across modules; managed <b>.NET-based APIs</b> for frontend–backend communication</li>
// //                   <li>Authored <b>SQL scripts and stored procedures</b> in SSMS for database operations &amp; optimization</li>
// //                   <li>Built <b>automated batch-file deployment</b> triggered on latest commits, streamlining the CI/CD pipeline</li>
// //                   <li>Managed <b>UAT and PROD deployments</b> via Remote Desktop Connection</li>
// //                   <li>Executed comprehensive <b>test cases</b> and performed bug resolution for optimal performance</li>
// //                 </ul>
// //               </div>

// //               {/* Digital Rhombus */}
// //               <div className="rw-exp">
// //                 <div className="rw-exp-hd">
// //                   <div>
// //                     <div className="rw-role">MERN Stack Developer Intern</div>
// //                     <div className="rw-co">Digital Rhombus</div>
// //                   </div>
// //                   <div className="rw-badge">Feb – Apr 2024</div>
// //                 </div>
// //                 <ul className="rw-ul">
// //                   <li>Developed a <b>financial reporting website</b> with data visualization features</li>
// //                   <li>Built <b>Your Handyman</b> – an Urban Clap clone for home-service booking</li>
// //                   <li>Implemented responsive UI designs; used <b>MySQL</b> and Express.js for RESTful APIs</li>
// //                 </ul>
// //               </div>

// //               {/* Tescom */}
// //               <div className="rw-exp">
// //                 <div className="rw-exp-hd">
// //                   <div>
// //                     <div className="rw-role">Full Stack MERN Developer Intern</div>
// //                     <div className="rw-co">Tescom</div>
// //                   </div>
// //                   <div className="rw-badge">Jul – Sep 2023</div>
// //                 </div>
// //                 <ul className="rw-ul">
// //                   <li>Developed <b>Bharat CXO</b> and <b>TESCOM company website</b>; deployed on Ubuntu server</li>
// //                   <li>Implemented <b>certificate generation, WhatsApp messaging &amp; email automation</b> via Pabbly</li>
// //                   <li>Managed all business emails through <b>Zoho Mail</b></li>
// //                 </ul>
// //               </div>

// //               {/* DevTown */}
// //               <div className="rw-exp">
// //                 <div className="rw-exp-hd">
// //                   <div>
// //                     <div className="rw-role">MERN Training Program &amp; Internship</div>
// //                     <div className="rw-co">DevTown</div>
// //                   </div>
// //                   <div className="rw-badge">Jan – Apr 2022</div>
// //                 </div>
// //                 <ul className="rw-ul">
// //                   <li>Completed 3-month intensive MERN stack training program</li>
// //                   <li>Collaborated with intern team to build a <b>movie booking web application</b> with auth, listings &amp; seat selection</li>
// //                 </ul>
// //               </div>

// //             </div>
// //           </div>{/* end main */}
// //         </div>{/* end body */}

// //         <div className="rw-pg-num">— 1 of 2 —</div>
// //       </div>{/* end page 1 */}


// //       {/* ══════════════  PAGE 2  ══════════════ */}
// //       <div className="rw-page" ref={page2Ref}>

// //         <div className="rw-mini-hd">
// //           <div className="rw-mini-name">Gopal Gupta</div>
// //           <div className="rw-mini-sub">MERN Stack Developer · Software Developer</div>
// //         </div>

// //         <div className="rw-p2-body">
// //           <div className="rw-section">
// //             <div className="rw-sec-hd">
// //               <span className="rw-sec-title">Projects</span>
// //               <div className="rw-sec-line" />
// //             </div>

// //             <div className="rw-proj-grid">

// //               {/* ★ FEATURED */}
// //               <div className="rw-proj featured">
// //                 <div className="rw-feat-tag">★ Featured</div>
// //                 <div className="rw-proj-title">Smart BI Assistant (Agentic AI)</div>
// //                 <div className="rw-proj-desc">
// //                   Agentic AI-powered Business Intelligence system where users ask natural-language questions like <em>"What were today's sales?"</em>. The AI agent auto-generates &amp; executes SQL queries on SSMS databases, retrieves real-time data, and surfaces human-readable insights — <em>"Today's sales were ₹2,00,000."</em> Eliminates manual SQL effort and accelerates decision-making through a conversational interface.
// //                 </div>
// //                 <div className="rw-techs">
// //                   {['Agentic AI','SQL Server / SSMS','NLP','React.js','Node.js','Express.js'].map(t=>(
// //                     <span className="rw-tech" key={t}>{t}</span>
// //                   ))}
// //                 </div>
// //               </div>

// //               {/* RandomType */}
// //               <div className="rw-proj">
// //                 <div className="rw-proj-title">
// //                   RandomType
// //                   <a href="https://randomtypee.netlify.app/" target="_blank" rel="noreferrer">Live ↗</a>
// //                 </div>
// //                 <div className="rw-proj-desc">Typing speed test app (MERN) with real-time metrics to help users track and improve their typing speed and accuracy.</div>
// //                 <div className="rw-techs">
// //                   {['MongoDB','Express','React','Node.js'].map(t=><span className="rw-tech" key={t}>{t}</span>)}
// //                 </div>
// //               </div>

// //               {/* Your Handyman */}
// //               <div className="rw-proj">
// //                 <div className="rw-proj-title">
// //                   Your Handyman
// //                   <a href="https://your-handyman.vercel.app/" target="_blank" rel="noreferrer">Live ↗</a>
// //                 </div>
// //                 <div className="rw-proj-desc">Home services platform with Google auth, Firebase OTP, and role-based access control (Urban Clap clone).</div>
// //                 <div className="rw-techs">
// //                   {['MERN Stack','Firebase','GCP'].map(t=><span className="rw-tech" key={t}>{t}</span>)}
// //                 </div>
// //               </div>

// //               {/* Financial Reporting */}
// //               <div className="rw-proj">
// //                 <div className="rw-proj-title">Financial Reporting Website</div>
// //                 <div className="rw-proj-desc">Interactive data visualization platform with customizable PDF report generation for financial statements.</div>
// //                 <div className="rw-techs">
// //                   {['MERN Stack','Chart.js','D3.js'].map(t=><span className="rw-tech" key={t}>{t}</span>)}
// //                 </div>
// //               </div>

// //               {/* BharatCXO */}
// //               <div className="rw-proj">
// //                 <div className="rw-proj-title">
// //                   BharatCXO
// //                   <a href="https://bharatcxomernproject.netlify.app/" target="_blank" rel="noreferrer">Live ↗</a>
// //                 </div>
// //                 <div className="rw-proj-desc">Platform connecting C-suite executives with membership-based access and event management features.</div>
// //                 <div className="rw-techs">
// //                   {['MERN Stack','Zoho Mail API'].map(t=><span className="rw-tech" key={t}>{t}</span>)}
// //                 </div>
// //               </div>

// //               {/* Tescom */}
// //               <div className="rw-proj">
// //                 <div className="rw-proj-title">
// //                   Tescom Business Solution
// //                   <a href="https://tescom.vercel.app/" target="_blank" rel="noreferrer">Live ↗</a>
// //                 </div>
// //                 <div className="rw-proj-desc">Corporate site with automated certificate generation, WhatsApp messaging integration, and vendor portal.</div>
// //                 <div className="rw-techs">
// //                   {['MERN Stack','Pabbly Connect'].map(t=><span className="rw-tech" key={t}>{t}</span>)}
// //                 </div>
// //               </div>

// //               {/* Movie Booking */}
// //               <div className="rw-proj">
// //                 <div className="rw-proj-title">Movie Booking Website</div>
// //                 <div className="rw-proj-desc">Collaborative app with user auth, movie listings, and seat selection — built using Agile methodology.</div>
// //                 <div className="rw-techs">
// //                   {['MongoDB','Express','React','Node.js'].map(t=><span className="rw-tech" key={t}>{t}</span>)}
// //                 </div>
// //               </div>

// //             </div>
// //           </div>
// //         </div>

// //         <div className="rw-pg-num">— 2 of 2 —</div>
// //       </div>{/* end page 2 */}


// //       {/* DOWNLOAD */}
// //       <div className="rw-dl-wrap">
// //         <button className="rw-dl-btn" onClick={downloadPDF}>
// //           <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
// //             <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
// //           </svg>
// //           Download Resume as PDF
// //         </button>
// //       </div>

// //     </div>
// //   );
// // };

// // export default App;




















// import React, { useRef, useEffect } from 'react';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

// /* ─────────────────────────────────────────────────────────────
//    GLOBAL STYLES
// ───────────────────────────────────────────────────────────── */
// const globalStyles = `
//   @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

//   :root {
//     --navy:         #08121f;
//     --navy-2:       #0d1e34;
//     --navy-3:       #112440;
//     --navy-4:       #1a3155;
//     --gold:         #c5a356;
//     --gold-bright:  #e0bc78;
//     --gold-light:   #eed99a;
//     --gold-pale:    #fdf6e3;
//     --gold-border:  rgba(197,163,86,.28);
//     --white:        #ffffff;
//     --off-white:    #f9f7f3;
//     --bg-outer:     #edeae4;
//     --border:       #e4dfd5;
//     --border-soft:  #ede9e2;
//     --text:         #080f1a;
//     --text-mid:     #2e3d52;
//     --text-muted:   #5c6d80;
//     --text-light:   #8c9aaa;
//     --green:        #156a3e;
//     --green-bg:     #ebf7f2;
//     --green-border: #9fd3b8;
//   }

//   *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

//   body {
//     font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
//     background: var(--bg-outer);
//     -webkit-font-smoothing: antialiased;
//     color: var(--text);
//   }

//   /* ── OUTER SHELL ── */
//   .rw-shell {
//     max-width: 940px;
//     margin: 0 auto;
//     padding: 32px 18px 64px;
//   }

//   /* ── RESUME PAGE CARD ── */
//   .rw-page {
//     background: var(--white);
//     margin-bottom: 28px;
//     overflow: hidden;
//     box-shadow:
//       0 1px 2px rgba(8,18,31,.05),
//       0 6px 16px rgba(8,18,31,.08),
//       0 24px 56px rgba(8,18,31,.12);
//   }

//   /* ══ HEADER ══ */
//   .rw-header {
//     background: linear-gradient(150deg, var(--navy) 0%, var(--navy-3) 55%, var(--navy-4) 100%);
//     padding: 36px 44px 26px;
//     position: relative;
//     overflow: hidden;
//   }
//   /* decorative concentric arcs – top right */
//   .rw-header .arc { position:absolute; border-radius:50%; pointer-events:none; border: 1px solid rgba(197,163,86,.10); }
//   .rw-header .arc-1 { width:340px; height:340px; top:-120px; right:-100px; }
//   .rw-header .arc-2 { width:220px; height:220px; top:-60px;  right:-40px;  border-color:rgba(197,163,86,.07); }
//   .rw-header .arc-3 { width:120px; height:120px; top:-10px;  right:30px;   border-color:rgba(197,163,86,.05); }

//   .rw-header-row {
//     display: flex;
//     justify-content: space-between;
//     align-items: flex-start;
//     gap: 20px;
//     margin-bottom: 20px;
//   }

//   /* name block */
//   .rw-name {
//     font-family: 'Cormorant Garamond', Georgia, serif;
//     font-size: 44px; font-weight: 700;
//     color: var(--white);
//     letter-spacing: .4px; line-height: 1;
//   }
//   .rw-title {
//     font-size: 10.5px; font-weight: 500;
//     letter-spacing: 3px; text-transform: uppercase;
//     color: var(--gold-bright);
//     margin-top: 8px;
//   }

//   /* 2+ years badge */
//   .rw-exp-pill {
//     background: var(--gold);
//     color: var(--navy);
//     padding: 11px 20px;
//     text-align: center;
//     flex-shrink: 0;
//     display: flex; flex-direction: column; align-items: center;
//   }
//   .rw-exp-pill .years {
//     font-family: 'Cormorant Garamond', serif;
//     font-size: 30px; font-weight: 700; line-height: 1;
//   }
//   .rw-exp-pill .yrs-label {
//     font-size: 8.5px; font-weight: 700;
//     letter-spacing: 1.5px; text-transform: uppercase;
//     margin-top: 2px;
//   }

//   /* gold rule */
//   .rw-gold-rule {
//     height: 1px;
//     background: linear-gradient(90deg, transparent 0%, rgba(197,163,86,.45) 40%, rgba(197,163,86,.45) 60%, transparent 100%);
//     margin-bottom: 16px;
//   }

//   .rw-contacts {
//     display: flex; flex-wrap: wrap; gap: 6px 22px;
//   }
//   .rw-contact {
//     display: flex; align-items: center; gap: 6px;
//     font-size: 11px; color: rgba(255,255,255,.65);
//   }
//   .rw-contact svg { color: var(--gold); flex-shrink: 0; }
//   .rw-contact a   { color: var(--gold-light); text-decoration: none; }

//   /* ══ PROFILE STRIP ══ */
//   .rw-profile-strip {
//     background: var(--off-white);
//     border-bottom: 1px solid var(--border);
//     padding: 14px 44px;
//     display: flex; align-items: center; gap: 16px;
//   }
//   .rw-profile-accent {
//     width: 3px; height: 36px; flex-shrink: 0;
//     background: linear-gradient(180deg, var(--gold) 0%, var(--gold-bright) 100%);
//   }
//   .rw-profile-text {
//     font-size: 11.5px; line-height: 1.6; color: var(--text-muted);
//     font-style: italic; letter-spacing: .1px;
//   }
//   .rw-profile-text b { color: var(--text-mid); font-style: normal; font-weight: 600; }

//   /* ══ 3-COLUMN BODY ══ */
//   .rw-body {
//     display: grid;
//     grid-template-columns: 218px 1fr;
//     min-height: 680px;
//   }

//   /* ── SIDEBAR ── */
//   .rw-sidebar {
//     background: var(--navy-2);
//     padding: 24px 20px;
//   }
//   .rw-sb-section { margin-bottom: 22px; }
//   .rw-sb-title {
//     font-size: 8px; font-weight: 600;
//     letter-spacing: 3px; text-transform: uppercase;
//     color: var(--gold);
//     padding-bottom: 7px;
//     border-bottom: 1px solid var(--gold-border);
//     margin-bottom: 12px;
//   }

//   /* education */
//   .rw-edu         { margin-bottom: 10px; }
//   .rw-edu .deg    { color: var(--white); font-weight: 600; font-size: 11.5px; }
//   .rw-edu .sch    { color: rgba(255,255,255,.45); font-size: 10px; margin-top: 1px; }
//   .rw-edu .yr     { color: var(--gold); font-size: 9.5px; margin-top: 2px; font-weight: 500; }

//   /* skill groups */
//   .rw-sg           { margin-bottom: 11px; }
//   .rw-sg-label     { color: rgba(255,255,255,.42); font-size: 9.5px; font-weight: 500; margin-bottom: 4px; }
//   .rw-tags         { display: flex; flex-wrap: wrap; gap: 3px; }
//   .rw-tag {
//     background: rgba(197,163,86,.09);
//     color: rgba(255,255,255,.72);
//     font-size: 9px; padding: 2.5px 7px;
//     border: 1px solid rgba(197,163,86,.16);
//     letter-spacing: .15px;
//   }

//   /* cert list */
//   .rw-cert {
//     display: flex; align-items: flex-start; gap: 7px;
//     color: rgba(255,255,255,.62); font-size: 10.5px;
//     margin-bottom: 6px; line-height: 1.35;
//   }
//   .rw-cert-dot {
//     width: 4px; height: 4px; background: var(--gold);
//     border-radius: 50%; flex-shrink: 0; margin-top: 4px;
//   }

//   /* ── MAIN CONTENT ── */
//   .rw-main { padding: 22px 28px 22px 22px; }

//   /* section header */
//   .rw-section { margin-bottom: 18px; }
//   .rw-sec-hd  { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
//   .rw-sec-title {
//     font-size: 8.5px; font-weight: 600;
//     letter-spacing: 3px; text-transform: uppercase;
//     color: var(--text-light); white-space: nowrap;
//   }
//   .rw-sec-line { flex: 1; height: 1px; background: var(--border); }

//   /* ── EXPERIENCE ── */
//   .rw-exp-list { position: relative; }

//   .rw-exp {
//     display: grid;
//     grid-template-columns: 1fr;
//     margin-bottom: 14px;
//     padding-left: 16px;
//     position: relative;
//   }
//   /* timeline dot */
//   .rw-exp::before {
//     content: '';
//     position: absolute; left: 0; top: 7px;
//     width: 6px; height: 6px; border-radius: 50%;
//     background: var(--gold);
//     box-shadow: 0 0 0 3px rgba(197,163,86,.15);
//   }
//   /* timeline vertical line */
//   .rw-exp::after {
//     content: '';
//     position: absolute; left: 2.5px; top: 15px; bottom: -8px;
//     width: 1px; background: var(--border-soft);
//   }
//   .rw-exp:last-child::after { display: none; }

//   .rw-exp-hd {
//     display: flex; justify-content: space-between;
//     align-items: flex-start; gap: 8px; flex-wrap: wrap;
//     margin-bottom: 2px;
//   }
//   .rw-role { font-weight: 600; font-size: 12.5px; color: var(--text); }
//   .rw-co   { font-size: 10.5px; color: var(--text-muted); margin-top: 1px; }
//   .rw-badge {
//     font-size: 9.5px; font-weight: 500;
//     color: var(--text-mid);
//     background: var(--off-white);
//     padding: 3px 8px; border: 1px solid var(--border);
//     white-space: nowrap; flex-shrink: 0; line-height: 1.4;
//   }
//   .rw-badge.current {
//     color: var(--green); background: var(--green-bg);
//     border-color: var(--green-border);
//   }

//   /* award ribbon */
//   .rw-award {
//     display: inline-flex; align-items: center; gap: 6px;
//     background: linear-gradient(90deg, #fef4d8, #fffbf0);
//     border: 1px solid #d9b54a;
//     border-left: 3px solid var(--gold);
//     color: #7a5400; font-size: 10px; font-weight: 600;
//     padding: 3.5px 10px; margin-bottom: 5px;
//     letter-spacing: .1px;
//   }

//   /* bullet list */
//   .rw-ul { list-style: none; margin-top: 3px; }
//   .rw-ul li {
//     font-size: 11px; color: var(--text-muted);
//     padding: 1.5px 0 1.5px 12px; position: relative;
//     line-height: 1.5;
//   }
//   .rw-ul li::before {
//     content: '–'; position: absolute; left: 0;
//     color: var(--gold); font-weight: 700;
//   }
//   .rw-ul b { color: var(--text-mid); font-weight: 600; }

//   /* ── DIVIDER BETWEEN EXP & EXTRA SECTION ── */
//   .rw-inpage-divider {
//     height: 1px;
//     background: var(--border);
//     margin: 2px 0 14px;
//   }

//   /* ── STATS ROW (page 1 bottom filler) ── */
//   .rw-stats-row {
//     display: grid;
//     grid-template-columns: repeat(4,1fr);
//     gap: 1px;
//     background: var(--border);
//     border: 1px solid var(--border);
//     margin-top: 4px;
//   }
//   .rw-stat {
//     background: var(--white);
//     padding: 10px 12px;
//     text-align: center;
//   }
//   .rw-stat .sv {
//     font-family: 'Cormorant Garamond', serif;
//     font-size: 22px; font-weight: 700;
//     color: var(--navy); line-height: 1;
//   }
//   .rw-stat .sl {
//     font-size: 8.5px; font-weight: 500;
//     letter-spacing: 1px; text-transform: uppercase;
//     color: var(--text-muted); margin-top: 3px;
//   }
//   .rw-stat .sv span { font-size: 14px; color: var(--gold); }

//   /* ══ PAGE 2 ══ */
//   .rw-mini-hd {
//     background: linear-gradient(150deg, var(--navy), var(--navy-3));
//     padding: 13px 44px;
//     display: flex; justify-content: space-between; align-items: center;
//   }
//   .rw-mini-name {
//     font-family: 'Cormorant Garamond', serif;
//     font-size: 20px; font-weight: 700; color: var(--white);
//   }
//   .rw-mini-sub {
//     font-size: 9px; font-weight: 500; letter-spacing: 2.5px;
//     text-transform: uppercase; color: var(--gold);
//   }

//   .rw-p2-body { padding: 24px 44px 32px; }

//   /* project grid */
//   .rw-proj-grid {
//     display: grid;
//     grid-template-columns: 1fr 1fr;
//     gap: 10px;
//   }

//   .rw-proj {
//     border: 1px solid var(--border);
//     padding: 13px 14px;
//     background: var(--white);
//     position: relative;
//     transition: box-shadow .18s;
//   }
//   .rw-proj:hover { box-shadow: 0 4px 18px rgba(8,18,31,.09); }
//   .rw-proj.featured {
//     grid-column: 1 / -1;
//     border-color: var(--gold);
//     border-left: 3px solid var(--gold);
//     background: linear-gradient(135deg, #fdf9ee 0%, var(--white) 60%);
//   }
//   .rw-feat-tag {
//     position: absolute; top: 10px; right: 12px;
//     font-size: 8px; font-weight: 700; letter-spacing: 2px;
//     text-transform: uppercase; color: var(--gold);
//   }
//   .rw-proj-title {
//     display: flex; justify-content: space-between;
//     align-items: flex-start; gap: 6px;
//     font-weight: 600; font-size: 12px; color: var(--text);
//     margin-bottom: 5px;
//   }
//   .rw-proj-title a {
//     font-size: 9px; font-weight: 500; color: var(--gold);
//     text-decoration: none; white-space: nowrap; flex-shrink: 0;
//     border-bottom: 1px solid rgba(197,163,86,.35);
//     padding-bottom: 1px;
//   }
//   .rw-proj-desc {
//     font-size: 11px; color: var(--text-muted);
//     line-height: 1.5; margin-bottom: 7px;
//   }
//   .rw-proj-desc em { font-style: italic; color: var(--text-mid); }
//   .rw-techs { display: flex; flex-wrap: wrap; gap: 3px; }
//   .rw-tech {
//     font-size: 9px; font-weight: 500;
//     background: var(--off-white); color: var(--text-muted);
//     padding: 2px 7px; border: 1px solid var(--border-soft);
//   }

//   /* certifications grid on page 2 */
//   .rw-cert-grid {
//     display: grid; grid-template-columns: 1fr 1fr 1fr;
//     gap: 8px; margin-top: 2px;
//   }
//   .rw-cert-card {
//     border: 1px solid var(--border);
//     padding: 9px 11px;
//     display: flex; align-items: flex-start; gap: 7px;
//   }
//   .rw-cert-card .icon-dot {
//     width: 5px; height: 5px; border-radius: 50%;
//     background: var(--gold); flex-shrink: 0; margin-top: 4px;
//   }
//   .rw-cert-card span {
//     font-size: 10.5px; color: var(--text-muted); line-height: 1.35;
//   }

//   /* page number */
//   .rw-pg-num {
//     text-align: center; font-size: 9px; letter-spacing: 1.5px;
//     color: var(--border); padding: 10px 0 7px;
//   }

//   /* ── DOWNLOAD ── */
//   .rw-dl-wrap { display: flex; justify-content: center; margin-top: 24px; }
//   .rw-dl-btn {
//     display: inline-flex; align-items: center; gap: 9px;
//     background: var(--navy);
//     color: var(--gold);
//     border: 1.5px solid var(--gold);
//     padding: 12px 34px;
//     font-family: 'DM Sans', sans-serif;
//     font-size: 11.5px; font-weight: 600;
//     letter-spacing: 2px; text-transform: uppercase;
//     cursor: pointer;
//     transition: background .2s, color .2s;
//   }
//   .rw-dl-btn:hover { background: var(--gold); color: var(--navy); }
//   .rw-dl-btn:active { transform: scale(.98); }
// `;

// /* small inline SVG */
// const Ico = ({ d, d2, s = 12 }) => (
//   <svg width={s} height={s} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" d={d} />
//     {d2 && <path strokeLinecap="round" strokeLinejoin="round" d={d2} />}
//   </svg>
// );

// export default function App() {
//   const page1Ref = useRef(null);
//   const page2Ref = useRef(null);

//   useEffect(() => {
//     if (!document.getElementById('rw-global-css')) {
//       const s = document.createElement('style');
//       s.id = 'rw-global-css';
//       s.textContent = globalStyles;
//       document.head.appendChild(s);
//     }
//   }, []);

//   const downloadPDF = async () => {
//     if (!page1Ref.current || !page2Ref.current) return;
//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const pw  = pdf.internal.pageSize.getWidth();
//     const ph  = pdf.internal.pageSize.getHeight();
//     const opt = (el) => ({
//       scale: 3, useCORS: true, logging: false,
//       letterRendering: true, allowTaint: false,
//       backgroundColor: '#ffffff',
//       windowWidth: el.scrollWidth,
//       windowHeight: el.scrollHeight,
//     });
//     try {
//       const c1 = await html2canvas(page1Ref.current, opt(page1Ref.current));
//       pdf.addImage(c1.toDataURL('image/png',1),'PNG',0,0,pw,Math.min((c1.height*pw)/c1.width,ph));
//       pdf.addPage();
//       const c2 = await html2canvas(page2Ref.current, opt(page2Ref.current));
//       pdf.addImage(c2.toDataURL('image/png',1),'PNG',0,0,pw,Math.min((c2.height*pw)/c2.width,ph));
//       pdf.save('gopal_gupta_resume.pdf');
//     } catch(e) {
//       console.error(e);
//       alert('Error generating PDF. Please try again.');
//     }
//   };

//   return (
//     <div className="rw-shell">

//       {/* ══════════════════════  PAGE 1  ══════════════════════ */}
//       <div className="rw-page" ref={page1Ref}>

//         {/* HEADER */}
//         <div className="rw-header">
//           <div className="arc arc-1"/><div className="arc arc-2"/><div className="arc arc-3"/>
//           <div className="rw-header-row">
//             <div>
//               <div className="rw-name">Gopal Gupta</div>
//               <div className="rw-title">MERN Stack Developer &nbsp;·&nbsp; Software Developer</div>
//             </div>
//             <div className="rw-exp-pill">
//               <span className="years">2+</span>
//               <span className="yrs-label">Years Exp.</span>
//             </div>
//           </div>
//           <div className="rw-gold-rule"/>
//           <div className="rw-contacts">
//             <div className="rw-contact">
//               <Ico d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
//               +91 9082257079
//             </div>
//             <div className="rw-contact">
//               <Ico d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
//               guptagopal18082003@gmail.com
//             </div>
//             <div className="rw-contact">
//               <Ico d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
//               <a href="https://github.com/gopalgupta0007" target="_blank" rel="noreferrer">github.com/gopalgupta0007</a>
//             </div>
//             <div className="rw-contact">
//               <Ico d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" d2="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
//               G.T.B Nagar, Sion Koliwada, Mumbai – 400037
//             </div>
//           </div>
//         </div>

//         {/* PROFILE SUMMARY STRIP */}
//         <div className="rw-profile-strip">
//           <div className="rw-profile-accent"/>
//           <div className="rw-profile-text">
//             Results-driven <b>MERN Stack & .NET Developer</b> with 2+ years of hands-on experience building
//             enterprise-grade ERP/HRMS portals, RESTful APIs, and Agentic AI-powered BI systems.
//             Recognized as <b>Employee of the Month (May 2026)</b>. Passionate about clean code,
//             CI/CD automation, and delivering scalable full-stack solutions.
//           </div>
//         </div>

//         {/* TWO-COLUMN BODY */}
//         <div className="rw-body">

//           {/* ─────── SIDEBAR ─────── */}
//           <div className="rw-sidebar">

//             <div className="rw-sb-section">
//               <div className="rw-sb-title">Education</div>
//               <div className="rw-edu"><div className="deg">M.Sc. (I.T.)</div><div className="sch">Mumbai University</div><div className="yr">Completed Apr 2026</div></div>
//               <div className="rw-edu"><div className="deg">B.Sc. (I.T.)</div><div className="sch">Mumbai University</div><div className="yr">Apr 2024</div></div>
//               <div className="rw-edu"><div className="deg">HSC – 74%</div><div className="yr">Mar 2021</div></div>
//               <div className="rw-edu"><div className="deg">SSC – 60%</div><div className="yr">Mar 2019</div></div>
//             </div>

//             <div className="rw-sb-section">
//               <div className="rw-sb-title">Technical Skills</div>
//               <div className="rw-sg"><div className="rw-sg-label">Frontend</div>
//                 <div className="rw-tags">{['HTML5','CSS3','JS ES6+','React.js','Angular.js'].map(t=><span className="rw-tag" key={t}>{t}</span>)}</div></div>
//               <div className="rw-sg"><div className="rw-sg-label">Backend</div>
//                 <div className="rw-tags">{['Node.js','Express.js','.NET APIs'].map(t=><span className="rw-tag" key={t}>{t}</span>)}</div></div>
//               <div className="rw-sg"><div className="rw-sg-label">Database</div>
//                 <div className="rw-tags">{['MongoDB','MySQL','SQL Server','SSMS'].map(t=><span className="rw-tag" key={t}>{t}</span>)}</div></div>
//               <div className="rw-sg"><div className="rw-sg-label">Tools & Deploy</div>
//                 <div className="rw-tags">{['Git','GitHub','VS Code','Postman','Ubuntu','Netlify','Vercel'].map(t=><span className="rw-tag" key={t}>{t}</span>)}</div></div>
//               <div className="rw-sg"><div className="rw-sg-label">Other</div>
//                 <div className="rw-tags">{['Core Java','OOPS','Agentic AI'].map(t=><span className="rw-tag" key={t}>{t}</span>)}</div></div>
//             </div>

//             <div className="rw-sb-section">
//               <div className="rw-sb-title">Certifications & Skills</div>
//               {['MERN Stack Certification','CI/CD Deployment','Agile / Scrum Methodology',
//                 'RESTful API Design','Responsive Web Design','Third-party API Integration',
//                 'Quality Assurance & Testing','Version Control (Git/GitHub)'].map(c=>(
//                 <div className="rw-cert" key={c}><div className="rw-cert-dot"/>{c}</div>
//               ))}
//             </div>

//           </div>{/* end sidebar */}

//           {/* ─────── MAIN ─────── */}
//           <div className="rw-main">

//             <div className="rw-section">
//               <div className="rw-sec-hd">
//                 <span className="rw-sec-title">Professional Experience</span>
//                 <div className="rw-sec-line"/>
//               </div>

//               {/* Carufus */}
//               <div className="rw-exp">
//                 <div className="rw-exp-hd">
//                   <div><div className="rw-role">Software Developer</div><div className="rw-co">Carufus Technology</div></div>
//                   <div className="rw-badge current">May 2024 – Present</div>
//                 </div>
//                 <div className="rw-award">★ &nbsp;Employee of the Month – May 2026</div>
//                 <ul className="rw-ul">
//                   <li>Feature enhancement &amp; development for <b>Wow! Momo's ERP/HRMS/Employee Management Portal</b></li>
//                   <li>Daily <b>Scrum meetings</b> and <b>sprint planning</b> for task prioritization and progress tracking</li>
//                   <li>New feature integration across modules; managed <b>.NET-based APIs</b> for system communication</li>
//                   <li>Authored <b>SQL scripts &amp; stored procedures</b> in SSMS for database operations &amp; optimization</li>
//                   <li>Built <b>automated batch-file deployment</b> triggered on latest commits — streamlined CI/CD pipeline</li>
//                   <li>Managed <b>UAT &amp; PROD deployments</b> via Remote Desktop Connection</li>
//                   <li>Comprehensive <b>test case execution</b> and bug resolution for optimal performance</li>
//                 </ul>
//               </div>

//               {/* Digital Rhombus */}
//               <div className="rw-exp">
//                 <div className="rw-exp-hd">
//                   <div><div className="rw-role">MERN Stack Developer Intern</div><div className="rw-co">Digital Rhombus</div></div>
//                   <div className="rw-badge">Feb – Apr 2024</div>
//                 </div>
//                 <ul className="rw-ul">
//                   <li>Built <b>financial reporting website</b> with interactive data visualization features</li>
//                   <li>Developed <b>Your Handyman</b> — an Urban Clap clone for home-service booking</li>
//                   <li>Used <b>MySQL</b> for database management and Express.js for RESTful API creation</li>
//                 </ul>
//               </div>

//               {/* Tescom */}
//               <div className="rw-exp">
//                 <div className="rw-exp-hd">
//                   <div><div className="rw-role">Full Stack MERN Developer Intern</div><div className="rw-co">Tescom</div></div>
//                   <div className="rw-badge">Jul – Sep 2023</div>
//                 </div>
//                 <ul className="rw-ul">
//                   <li>Developed <b>Bharat CXO</b> and <b>TESCOM company website</b>; deployed on Ubuntu server</li>
//                   <li>Implemented <b>certificate generation, WhatsApp messaging &amp; email automation</b> via Pabbly</li>
//                   <li>Managed all business emails through <b>Zoho Mail</b></li>
//                 </ul>
//               </div>

//               {/* DevTown */}
//               <div className="rw-exp">
//                 <div className="rw-exp-hd">
//                   <div><div className="rw-role">MERN Training &amp; Internship</div><div className="rw-co">DevTown</div></div>
//                   <div className="rw-badge">Jan – Apr 2022</div>
//                 </div>
//                 <ul className="rw-ul">
//                   <li>Completed 3-month intensive MERN stack training program</li>
//                   <li>Built a <b>movie booking app</b> with auth, listings &amp; seat selection using Agile methodology</li>
//                 </ul>
//               </div>

//             </div>{/* end experience section */}

//             {/* ── QUICK-STATS FILLER ROW ── */}
//             <div className="rw-inpage-divider"/>
//             <div className="rw-stats-row">
//               <div className="rw-stat"><div className="sv">4<span>+</span></div><div className="sl">Internships</div></div>
//               <div className="rw-stat"><div className="sv">7<span>+</span></div><div className="sl">Projects</div></div>
//               <div className="rw-stat"><div className="sv">6<span>+</span></div><div className="sl">Tech Stacks</div></div>
//               <div className="rw-stat"><div className="sv">2<span>yr</span></div><div className="sl">Industry Exp.</div></div>
//             </div>

//           </div>{/* end main */}
//         </div>{/* end body */}

//         <div className="rw-pg-num">— 1 of 2 —</div>
//       </div>{/* end page 1 */}


//       {/* ══════════════════════  PAGE 2  ══════════════════════ */}
//       <div className="rw-page" ref={page2Ref}>

//         <div className="rw-mini-hd">
//           <div className="rw-mini-name">Gopal Gupta</div>
//           <div className="rw-mini-sub">MERN Stack Developer · Software Developer</div>
//         </div>

//         <div className="rw-p2-body">

//           {/* PROJECTS */}
//           <div className="rw-section">
//             <div className="rw-sec-hd">
//               <span className="rw-sec-title">Projects</span>
//               <div className="rw-sec-line"/>
//             </div>
//             <div className="rw-proj-grid">

//               {/* ★ FEATURED */}
//               <div className="rw-proj featured">
//                 <div className="rw-feat-tag">★ FEATURED</div>
//                 <div className="rw-proj-title">Smart BI Assistant (Agentic AI)</div>
//                 <div className="rw-proj-desc">
//                   Agentic AI-powered Business Intelligence system — users ask natural-language questions like <em>"What were today's sales?"</em>.
//                   The AI agent auto-generates &amp; executes SQL queries on SSMS, retrieves real-time data, and surfaces human-readable
//                   insights: <em>"Today's sales were ₹2,00,000."</em> Eliminates manual SQL effort and accelerates decision-making through a conversational interface.
//                 </div>
//                 <div className="rw-techs">{['Agentic AI','SQL Server / SSMS','NLP','React.js','Node.js','Express.js'].map(t=><span className="rw-tech" key={t}>{t}</span>)}</div>
//               </div>

//               <div className="rw-proj">
//                 <div className="rw-proj-title">RandomType <a href="https://randomtypee.netlify.app/" target="_blank" rel="noreferrer">Live ↗</a></div>
//                 <div className="rw-proj-desc">MERN typing speed test app with real-time metrics to track and improve accuracy.</div>
//                 <div className="rw-techs">{['MongoDB','Express','React','Node.js'].map(t=><span className="rw-tech" key={t}>{t}</span>)}</div>
//               </div>

//               <div className="rw-proj">
//                 <div className="rw-proj-title">Your Handyman <a href="https://your-handyman.vercel.app/" target="_blank" rel="noreferrer">Live ↗</a></div>
//                 <div className="rw-proj-desc">Home services platform with Google auth, Firebase OTP &amp; role-based access (Urban Clap clone).</div>
//                 <div className="rw-techs">{['MERN Stack','Firebase','GCP'].map(t=><span className="rw-tech" key={t}>{t}</span>)}</div>
//               </div>

//               <div className="rw-proj">
//                 <div className="rw-proj-title">Financial Reporting Website</div>
//                 <div className="rw-proj-desc">Interactive data visualization platform with customizable PDF report generation for financial statements.</div>
//                 <div className="rw-techs">{['MERN Stack','Chart.js','D3.js'].map(t=><span className="rw-tech" key={t}>{t}</span>)}</div>
//               </div>

//               <div className="rw-proj">
//                 <div className="rw-proj-title">BharatCXO <a href="https://bharatcxomernproject.netlify.app/" target="_blank" rel="noreferrer">Live ↗</a></div>
//                 <div className="rw-proj-desc">Connects C-suite executives with membership-based access and event management features.</div>
//                 <div className="rw-techs">{['MERN Stack','Zoho Mail API'].map(t=><span className="rw-tech" key={t}>{t}</span>)}</div>
//               </div>

//               <div className="rw-proj">
//                 <div className="rw-proj-title">Tescom Business Solution <a href="https://tescom.vercel.app/" target="_blank" rel="noreferrer">Live ↗</a></div>
//                 <div className="rw-proj-desc">Corporate site with automated certificate generation, WhatsApp integration, and vendor portal.</div>
//                 <div className="rw-techs">{['MERN Stack','Pabbly Connect'].map(t=><span className="rw-tech" key={t}>{t}</span>)}</div>
//               </div>

//               <div className="rw-proj">
//                 <div className="rw-proj-title">Movie Booking Website</div>
//                 <div className="rw-proj-desc">Team-built booking app with user auth, movie listings &amp; seat selection using Agile methodology.</div>
//                 <div className="rw-techs">{['MongoDB','Express','React','Node.js'].map(t=><span className="rw-tech" key={t}>{t}</span>)}</div>
//               </div>

//             </div>
//           </div>

//           {/* CERTIFICATIONS & ADDITIONAL SKILLS — fills page 2 bottom */}
//           <div className="rw-section" style={{marginTop:'20px'}}>
//             <div className="rw-sec-hd">
//               <span className="rw-sec-title">Additional Skills &amp; Certifications</span>
//               <div className="rw-sec-line"/>
//             </div>
//             <div className="rw-cert-grid">
//               {[
//                 'MERN Stack Certification',
//                 'CI/CD Deployment',
//                 'Agile / Scrum Methodology',
//                 'RESTful API Design',
//                 'Responsive Web Design',
//                 'Third-party API Integration',
//                 'Quality Assurance & Testing',
//                 'Version Control (Git/GitHub)',
//                 'Agentic AI Development',
//               ].map(c=>(
//                 <div className="rw-cert-card" key={c}>
//                   <div className="icon-dot"/>
//                   <span>{c}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//         </div>

//         <div className="rw-pg-num">— 2 of 2 —</div>
//       </div>{/* end page 2 */}


//       {/* DOWNLOAD BUTTON */}
//       <div className="rw-dl-wrap">
//         <button className="rw-dl-btn" onClick={downloadPDF}>
//           <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
//           </svg>
//           Download Resume as PDF
//         </button>
//       </div>

//     </div>
//   );
// }
















































