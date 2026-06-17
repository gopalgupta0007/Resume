import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/*
  MainResume — Angular / MEAN Stack Developer
  ATS Strategy:
  • 100% single-column, no sidebar, no CSS grid for content
  • Standard Arial body font — best ATS font
  • Skills listed as plain text rows, not chips/tags
  • All sections in ATS-expected order
  • Angular, MEAN, TypeScript, RxJS, NgRx keywords dense
  • Quantified bullets on every role
  • LinkedIn + GitHub in contact line
  PDF Fix: captures each page at 794px (A4 screen px), maps to full A4
*/

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  * { box-sizing: border-box; }

  .mr-root {
    max-width: 870px;
    margin: 0 auto;
    padding: 24px 18px 48px;
    background: #E8EAED;
    font-family: Arial, Helvetica, sans-serif;
  }

  /* ── CONTROLS ── */
  .mr-controls {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  .mr-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 10px 26px;
    font-family: 'Inter', Arial, sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    border: 2px solid #0b4f6c;
    cursor: pointer;
    transition: all .15s;
    border-radius: 2px;
  }
  .mr-btn-primary { background: #0b4f6c; color: #fff; }
  .mr-btn-primary:hover { background: #083d56; }
  .mr-btn-primary:disabled { opacity: .6; cursor: default; }
  .mr-btn-secondary { background: #fff; color: #0b4f6c; }
  .mr-btn-secondary:hover { background: #eaf3f8; }

  /* ── PAGE CARD ── */
  .mr-page {
    background: #ffffff;
    margin-bottom: 16px;
    box-shadow:
      0 1px 3px rgba(11,79,108,.08),
      0 6px 20px rgba(11,79,108,.10),
      0 28px 56px rgba(11,79,108,.07);
    overflow: hidden;
    font-size: 10pt;
    color: #222222;
    line-height: 1.45;
    width: 794px;
    margin-left: auto;
    margin-right: auto;
  }

  /* ── HEADER BAND ── */
  .mr-header {
    background: #0b4f6c;
    padding: 15px 35px 15px;
  }
  .mr-name {
    font-family: 'Inter', Arial, sans-serif;
    font-size: 28pt;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.5px;
    line-height: 1;
    margin-bottom: 6px;
  }
  .mr-tagline {
    font-family: 'Inter', Arial, sans-serif;
    font-size: 8.5pt;
    font-weight: 600;
    color: rgba(255,255,255,0.68);
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 14px;
  }
  .mr-hd-divider {
    height: 1px;
    background: rgba(255,255,255,0.18);
    margin-bottom: 12px;
  }
  .mr-contacts {
    font-size: 8.5pt;
    color: rgba(255,255,255,0.78);
    line-height: 1.8;
  }
  .mr-contacts a { color: #7ecef4; text-decoration: none; font-weight: 500; }
  .mr-contacts .sep { color: rgba(255,255,255,0.28); margin: 0 7px; }

  /* ── BODY ── */
  .mr-body { padding: 5px 43px 5px; }

  /* ── SECTION HEADER ── */
  .mr-sec { margin-top: 15px; }
  .mr-sec:first-child { margin-top: 0; }

  .mr-sec-hd {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 5px;
    padding: 4px 0 4px 10px;
    background: #eef4f8;
    border-left: 3px solid #0b4f6c;
    margin-left: -10px;
  }
  .mr-sec-title {
    font-family: 'Inter', Arial, sans-serif;
    font-size: 7.5pt;
    font-weight: 700;
    color: #0b4f6c;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  .mr-sec-rule {
    flex: 1;
    height: 1px;
    background: #b8d4e4;
  }

  /* ── SUMMARY ── */
  .mr-summary {
    font-size: 10pt;
    color: #2b2b2b;
    line-height: 1.65;
    padding: 10px 13px;
    background: #f8fbfd;
    border: 1px solid #d0dfe8;
    border-left: 3px solid #0b4f6c;
  }

  /* ── SKILLS ── */
  .mr-skills-block { font-size: 9.5pt; }
  .mr-skill-row {
    display: flex;
    padding: 3.5px 0;
    border-bottom: 1px solid #f0f2f5;
    align-items: baseline;
  }
  .mr-skill-row:last-child { border-bottom: none; }
  .mr-skill-label {
    font-weight: 700;
    color: #111111;
    min-width: 148px;
    flex-shrink: 0;
    font-size: 9pt;
    padding-right: 12px;
  }
  .mr-skill-val { color: #444444; font-size: 9pt; line-height: 1.45; }

  /* ── EXPERIENCE ── */
  .mr-exp {
    margin-bottom: 8px;
    padding-left: 13px;
    border-left: 3px solid #d0e4ef;
  }
  .mr-exp.current { border-left-color: #0b4f6c; }

  .mr-exp-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 2px;
    flex-wrap: nowrap;
  }
  .mr-exp-co {
    font-family: 'Inter', Arial, sans-serif;
    font-size: 11pt;
    font-weight: 700;
    color: #0b0b0b;
    line-height: 1.2;
  }
  .mr-exp-role {
    font-size: 9.5pt;
    font-weight: 600;
    color: #0b4f6c;
    margin-top: 2px;
  }
  .mr-exp-date {
    font-family: 'Inter', Arial, sans-serif;
    font-size: 8.5pt;
    font-weight: 700;
    white-space: nowrap;
    flex-shrink: 0;
    padding: 2px 10px;
    border-radius: 2px;
    background: #f0f5f8;
    border: 1px solid #c8d8e4;
    color: #444444;
  }
  .mr-exp-date.now {
    background: #edf7f2;
    border-color: #9fd3b8;
    color: #145c38;
  }
  .mr-award {
    display: inline-block;
    font-size: 8.5pt;
    font-weight: 700;
    color: #7a5400;
    background: #fef8e7;
    border-left: 3px solid #c8a030;
    padding: 2px 9px;
    margin: 4px 0 6px;
  }

  .mr-ul { margin: 5px 0 0 16px; padding: 0; }
  .mr-ul li {
    font-size: 9.5pt;
    color: #444444;
    line-height: 1.55;
    margin-bottom: 2.5px;
    list-style-type: disc;
  }
  .mr-ul li strong { color: #0b0b0b; font-weight: 700; }

  /* ── EDUCATION ── */
  .mr-edu-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f0f2f5;
  }
  .mr-edu-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .mr-edu-deg {
    font-family: 'Inter', Arial, sans-serif;
    font-size: 10pt;
    font-weight: 700;
    color: #0b0b0b;
    line-height: 1.3;
  }
  .mr-edu-inst { font-size: 9pt; color: #555555; margin-top: 2px; }
  .mr-edu-gpa {
    font-size: 8pt;
    font-weight: 700;
    color: #0b4f6c;
    background: #eef4f8;
    border: 1px solid #b8d4e4;
    padding: 1px 7px;
    margin-left: 7px;
    border-radius: 2px;
    display: inline-block;
    vertical-align: middle;
  }
  .mr-edu-right {
    font-size: 9pt;
    color: #555555;
    text-align: right;
    white-space: nowrap;
    flex-shrink: 0;
    font-weight: 600;
  }

  /* ── PROJECTS ── */
  .mr-proj {
    margin-bottom: 11px;
    padding-left: 13px;
    border-left: 3px solid #d0e4ef;
  }
  .mr-proj-title {
    font-family: 'Inter', Arial, sans-serif;
    font-size: 10pt;
    font-weight: 700;
    color: #0b0b0b;
    margin-bottom: 1px;
  }
  .mr-proj-title a {
    font-size: 8pt;
    font-weight: 600;
    color: #0b4f6c;
    text-decoration: none;
    margin-left: 8px;
    border-bottom: 1px solid #b8d4e4;
    padding-bottom: 1px;
  }
  .mr-proj-stack {
    font-size: 8.5pt;
    color: #0b4f6c;
    font-style: italic;
    margin-bottom: 3px;
  }

  /* ── CERTIFICATIONS ── */
  .mr-cert-list { margin: 4px 0 0 16px; padding: 0; }
  .mr-cert-list li {
    font-size: 9.5pt;
    color: #444444;
    line-height: 1.55;
    margin-bottom: 2px;
    list-style-type: disc;
  }
  .mr-cert-list li strong { color: #0b0b0b; font-weight: 700; }

  /* ── PAGE 2 HEADER ── */
  .mr-page2-hd {
    background: #0b4f6c;
    padding: 12px 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .mr-page2-name {
    font-family: 'Inter', Arial, sans-serif;
    font-size: 13pt;
    font-weight: 800;
    color: #ffffff;
  }
  .mr-page2-sub {
    font-size: 7.5pt;
    font-weight: 600;
    color: rgba(255,255,255,0.60);
    letter-spacing: 1.2px;
    text-transform: uppercase;
  }

  /* ── PAGE NUMBER ── */
  .mr-pg-num {
    text-align: center;
    font-size: 7.5pt;
    color: #bbbbbb;
    padding: 7px 0 7px;
    letter-spacing: 0.8px;
    font-family: 'Inter', Arial, sans-serif;
  }

  @media print {
    .mr-controls { display: none !important; }
    .mr-root { background: transparent; padding: 0; }
    .mr-page { box-shadow: none; break-after: page; }
  }
`;

function injectStyles() {
  if (!document.getElementById('mr-styles')) {
    const s = document.createElement('style');
    s.id = 'mr-styles';
    s.textContent = CSS;
    document.head.appendChild(s);
  }
}

/* ── PDF export — captures at exact 794px width to match A4 ── */
async function exportPDF(refs, filename) {
  const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
  const A4_W = pdf.internal.pageSize.getWidth();   // 210mm
  const A4_H = pdf.internal.pageSize.getHeight();  // 297mm

  for (let i = 0; i < refs.length; i++) {
    const el = refs[i].current;
    if (!el) continue;

    /* Force exact 794px render width (= A4 @ 96dpi) */
    const savedStyle = el.getAttribute('style') || '';
    el.style.cssText += '; width:794px !important; max-width:794px !important; box-shadow:none !important;';

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: false,
      backgroundColor: '#ffffff',
      width: 794,
      windowWidth: 794,
    });

    el.setAttribute('style', savedStyle);

    /* Scale canvas to fill A4 exactly */
    const imgH = (canvas.height * A4_W) / canvas.width;

    if (i > 0) pdf.addPage();
    pdf.addImage(
      canvas.toDataURL('image/jpeg', 0.97),
      'JPEG',
      0, 0,
      A4_W,
      Math.min(imgH, A4_H)
    );
  }
  pdf.save(filename);
}

/* ══════════════════════════════════════════════════
   MainResume Component
══════════════════════════════════════════════════ */
export default function MainResume() {
  const page1 = useRef(null);
  const page2 = useRef(null);
  const [exporting, setExporting] = useState(false);

  React.useEffect(() => { injectStyles(); }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportPDF([page1, page2], 'gopal_gupta_angular_mean.pdf');
    } catch (e) {
      console.error(e);
      alert('Error generating PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const SecHd = ({ title }) => (
    <div className="mr-sec-hd">
      <div className="mr-sec-title">{title}</div>
      <div className="mr-sec-rule" />
    </div>
  );

  return (
    <div className="mr-root">

      {/* CONTROLS */}
      <div className="mr-controls">
        <button className="mr-btn mr-btn-primary" onClick={handleExport} disabled={exporting}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          {exporting ? 'Generating PDF…' : 'Download Resume PDF'}
        </button>
        <button className="mr-btn mr-btn-secondary" onClick={() => window.print()}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
          </svg>
          Print
        </button>
      </div>

      {/* ══════════════ PAGE 1 ══════════════ */}
      <div className="mr-page" ref={page1}>

        {/* HEADER */}
        <div className="mr-header">
          <div className="mr-name">Gopal Gupta</div>
          <div className="mr-tagline">
            MEAN Stack Developer &nbsp;·&nbsp; Full Stack Software Developer
          </div>
          <div className="mr-hd-divider" />
          <div className="mr-contacts">
            <span>Mumbai, Maharashtra, India</span>
            <span className="sep">|</span>
            <span>+91 9082257079</span>
            <span className="sep">|</span>
            <span>guptagopal18082003@gmail.com</span>
            <br />
            <span>LinkedIn:&nbsp;<a href="https://linkedin.com/in/gopalgupta0007" target="_blank" rel="noreferrer">linkedin.com/in/gopalgupta0007</a></span>
            <span className="sep">|</span>
            <span>GitHub:&nbsp;<a href="https://github.com/gopalgupta0007" target="_blank" rel="noreferrer">github.com/gopalgupta0007</a></span>
            <span className="sep">|</span>
            <span>Portfolio:&nbsp;<a href="https://randomtypee.netlify.app/" target="_blank" rel="noreferrer">randomtypee.netlify.app</a></span>
          </div>
        </div>

        <div className="mr-body">

          {/* PROFESSIONAL SUMMARY */}
          <div className="mr-sec">
            <SecHd title="Professional Summary" />
            {/* <p className="mr-summary">
              Results-driven <strong>Angular Developer and MEAN Stack Developer</strong> with 2+ years of professional
              experience building enterprise-grade web applications, ERP portals, and HRMS systems. Proficient in
              <strong> Angular (v12+), TypeScript, RxJS, NgRx, HTML5, CSS3, Node.js, Express.js, MongoDB, and SQL Server</strong>.
              Hands-on expertise in <strong>RESTful API integration, Angular routing, lazy loading, reactive forms, and CI/CD automation</strong>.
              Experienced in <strong>Agile/Scrum</strong> with a proven track record of delivering across 10+ sprints.
              Recognized as <strong>Employee of the Month (May 2026)</strong> at Carufus Technology for contributions to an
              enterprise Employee Management Portal serving 500+ daily users. M.Sc. IT graduate from Mumbai University (CGPA 9.0).
            </p> */}
            <p>Results-driven <strong>MERN Stack Developer with 2+ years of experience</strong> building scalable web applications, ERP portals, and HRMS systems. Strong in <strong>React.js, JavaScript, TypeScript, Node.js, Express.js, MongoDB, HTML5, CSS3, Redux, and RESTful APIs</strong>, with working knowledge of <strong>Angular</strong>. Experienced in developing <strong>responsive UIs, API integration, authentication, and Agile/Scrum delivery</strong>. Recognized as Employee of the Month for contributing to an enterprise portal serving <strong>500+ daily users</strong>. M.Sc. IT graduate from Mumbai University.</p>
          </div>

          {/* TECHNICAL SKILLS */}
          <div className="mr-sec">
            <SecHd title="Technical Skills" />
            <div className="mr-skills-block">
              {[
                // ['Angular',          'Angular 12/14/16+, Angular CLI, Angular Material, Router, Lazy Loading, Guards, Interceptors, Directives, Pipes'],
                // ['Frontend',         'TypeScript, JavaScript (ES6+), HTML5, CSS3, SCSS, Bootstrap 5, Responsive Design, RxJS, NgRx'],
                ['React',    'React.js, React 18+, React Router, Hooks, Context API, Redux, Lazy Loading, Custom Hooks'],
                ['Frontend', 'TypeScript, JavaScript (ES6+), HTML5, CSS3, SCSS, Bootstrap 5, Responsive Design'],
                ['Backend',   'Node.js, Express.js, RESTful API Design & Integration, .NET APIs, Mongoose, JWT Authentication'],
                ['Database',         'MongoDB, MySQL, SQL Server (SSMS), Stored Procedures, Query Optimization, Mongoose ODM'],
                // ['Testing & QA',     'Jasmine, Karma, TestBed, Unit Testing, Component/Service Testing, Test Case Creation, Regression Testing'],
                // ['DevOps & Tools',   'Git, GitHub Actions, CI/CD Pipelines, Azure DevOps (basics), Postman, VS Code, npm'],
                ['Deployment',       'Netlify, Vercel, Ubuntu Server, Firebase Hosting, UAT & PROD Environment Management'],
                ['AI & Automation',  'Agentic AI, NL-to-SQL, Pabbly Connect, Zoho Mail API, WhatsApp Business API'],
                ['Methodologies',    'Agile, Scrum, Sprint Planning, Code Reviews, React.js (additional)'],
              ].map(([l, v]) => (
                <div className="mr-skill-row" key={l}>
                  <span className="mr-skill-label">{l}:</span>
                  <span className="mr-skill-val">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PROFESSIONAL EXPERIENCE */}
          <div className="mr-sec">
            <SecHd title="Professional Experience" />

            {/* ── Carufus Technology ── */}
            <div className="mr-exp current">
              <div className="mr-exp-header">
                <div>
                  <div className="mr-exp-co">Carufus Technology — Mumbai, India</div>
                  <div className="mr-exp-role">Software Developer · Angular / MEAN Stack / .NET</div>
                </div>
                <div className="mr-exp-date now">May 2024 – Present</div>
              </div>
              <div className="mr-award">★ Employee of the Month — May 2026</div>
              <ul className="mr-ul">
                <li>Developed and maintained <strong>Angular frontend modules</strong> for <strong>Wow! Momo's ERP/HRMS portal</strong>, supporting <strong>500+ daily users</strong> across HR, payroll, and operations</li>
                <li>Built <strong>reusable Angular components, directives, and pipes</strong>; implemented <strong>lazy loading</strong> across 6+ feature modules, reducing initial load time by <strong>~35%</strong></li>
                <li>Consumed <strong>.NET RESTful APIs</strong> via Angular HttpClient with JWT interceptors; integrated reactive and template-driven forms for complex HR workflows</li>
                <li>Designed and deployed an <strong>automated batch-file CI/CD pipeline</strong> on Git commits, reducing deployment effort by <strong>60%</strong> and eliminating manual errors</li>
                <li>Authored <strong>20+ SQL scripts and stored procedures</strong> in SSMS; managed UAT and PROD deployments with <strong>zero production rollback incidents</strong> over 6+ months</li>
                <li>Resolved <strong>40+ bugs</strong> through QA test case creation and execution; consistently delivered user stories across <strong>10+ consecutive Scrum sprints</strong></li>
              </ul>
            </div>

            {/* ── Digital Rhombus ── */}
            <div className="mr-exp">
              <div className="mr-exp-header">
                <div>
                  <div className="mr-exp-co">Digital Rhombus — Mumbai, India</div>
                  <div className="mr-exp-role">MEAN Stack Developer Intern</div>
                </div>
                <div className="mr-exp-date">Feb 2024 – Apr 2024</div>
              </div>
              <ul className="mr-ul">
                <li>Built a <strong>financial reporting SPA</strong> using Angular with Chart.js and D3.js visualizations and customizable PDF report generation</li>
                <li>Developed <strong>Your Handyman</strong> — a full-stack MEAN home service booking platform with <strong>Google OAuth and Firebase OTP verification</strong></li>
                <li>Implemented <strong>Angular route guards</strong> for customer, service-provider, and admin roles; built RESTful APIs across 5+ service categories in Node.js/Express.js</li>
              </ul>
            </div>

            {/* ── Tescom ── */}
            <div className="mr-exp">
              <div className="mr-exp-header">
                <div>
                  <div className="mr-exp-co">Tescom — Mumbai, India</div>
                  <div className="mr-exp-role">Full Stack MEAN Developer Intern</div>
                </div>
                <div className="mr-exp-date">Jul 2023 – Sep 2023</div>
              </div>
              <ul className="mr-ul">
                <li>Developed and deployed <strong>Bharat CXO</strong> and <strong>TESCOM corporate website</strong> on Ubuntu Server, serving live production traffic from day one</li>
                <li>Automated certificate generation, WhatsApp messaging, and bulk email via <strong>Pabbly Connect</strong>, eliminating <strong>100% of manual certificate workflows</strong></li>
              </ul>
            </div>

            {/* ── DevTown ── */}
            <div className="mr-exp">
              <div className="mr-exp-header">
                <div>
                  <div className="mr-exp-co">DevTown — Remote</div>
                  <div className="mr-exp-role">MERN Stack Training Program &amp; Internship</div>
                </div>
                <div className="mr-exp-date">Jan 2022 – Apr 2022</div>
              </div>
              <ul className="mr-ul">
                <li>Completed 3-month intensive MEAN/MERN Stack training; collaborated in a 4-member Agile team to build a <strong>movie booking application</strong> with Angular routing, user authentication, seat selection, and booking confirmation</li>
              </ul>
            </div>

          </div>{/* end experience */}

        </div>{/* end body */}
        <div className="mr-pg-num">— Page 1 of 2 —</div>
      </div>

      {/* ══════════════ PAGE 2 ══════════════ */}
      <div className="mr-page" ref={page2}>

        {/* PAGE 2 HEADER */}
        <div className="mr-page2-hd">
          <div className="mr-page2-name">Gopal Gupta</div>
          <div className="mr-page2-sub">Angular Developer · MEAN Stack Developer · Page 2 of 2</div>
        </div>

        <div className="mr-body">

          {/* EDUCATION */}
          <div className="mr-sec">
            <SecHd title="Education" />

            <div className="mr-edu-row">
              <div>
                <div className="mr-edu-deg">Master of Science (M.Sc.) — Information Technology</div>
                <div className="mr-edu-inst">Mumbai University <span className="mr-edu-gpa">CGPA: 9.0 / 10.0</span></div>
              </div>
              <div className="mr-edu-right">Jun 2022 – Apr 2026</div>
            </div>

            <div className="mr-edu-row">
              <div>
                <div className="mr-edu-deg">Bachelor of Science (B.Sc.) — Information Technology</div>
                <div className="mr-edu-inst">Mumbai University <span className="mr-edu-gpa">CGPA: 9.02 / 10.0</span></div>
              </div>
              <div className="mr-edu-right">Jun 2021 – Apr 2024</div>
            </div>

            <div className="mr-edu-row">
              <div>
                <div className="mr-edu-deg">Higher Secondary Certificate (HSC) — Science</div>
                <div className="mr-edu-inst">Maharashtra State Board</div>
              </div>
              <div className="mr-edu-right">Mar 2021 · 74%</div>
            </div>

            <div className="mr-edu-row">
              <div>
                <div className="mr-edu-deg">Secondary School Certificate (SSC)</div>
                <div className="mr-edu-inst">Maharashtra State Board</div>
              </div>
              <div className="mr-edu-right">Mar 2019 · 60%</div>
            </div>
          </div>

          {/* PROJECTS */}
          <div className="mr-sec">
            <SecHd title="Projects" />

            <div className="mr-proj">
              <div className="mr-proj-title">
                Smart BI Assistant — Agentic AI + React + SQL Server
                <span style={{fontSize:'8.5pt',fontWeight:400,color:'#888',marginLeft:'7px'}}>(Flagship)</span>
              </div>
              <div className="mr-proj-stack">React · Node.js · Express.js · Agentic AI · SQL Server · NLP · Natural Language to SQL</div>
              <ul className="mr-ul">
                <li>Agentic AI-powered BI dashboard that accepts natural-language queries, auto-generates SQL, executes against SSMS, and returns real-time insights; reduced report generation time from hours to seconds</li>
              </ul>
            </div>

            <div className="mr-proj">
              <div className="mr-proj-title">
                Your Handyman — Home Services Booking Platform
                <a href="https://your-handyman.vercel.app/" target="_blank" rel="noreferrer">your-handyman.vercel.app ↗</a>
              </div>
              <div className="mr-proj-stack">React · Node.js · Express.js · MongoDB · Firebase Auth · Google OAuth · GCP · Vercel</div>
              <ul className="mr-ul">
                <li>Full MEAN Stack home services platform (Urban Clap clone) with React lazy loading, reactive forms, Google OAuth, Firebase OTP, and role-based route guards for 3 user types</li>
              </ul>
            </div>

            <div className="mr-proj">
              <div className="mr-proj-title">Financial Reporting Web Application</div>
              <div className="mr-proj-stack">React · Node.js · Express.js · MySQL · Chart.js · D3.js · PDF Generation</div>
              <ul className="mr-ul">
                <li>React SPA with interactive Chart.js/D3.js financial visualizations, customizable PDF report generation, and dynamic data binding via Angular services and RxJS Observables</li>
              </ul>
            </div>

            <div className="mr-proj">
              <div className="mr-proj-title">
                BharatCXO — Executive Networking Platform
                <a href="https://bharatcxomernproject.netlify.app/" target="_blank" rel="noreferrer">bharatcxomernproject.netlify.app ↗</a>
              </div>
              <div className="mr-proj-stack">MEAN Stack · Zoho Mail API · Netlify</div>
              <ul className="mr-ul">
                <li>C-suite networking platform with membership-based access, event management, and automated Zoho Mail API transactional email workflows</li>
              </ul>
            </div>

            <div className="mr-proj">
              <div className="mr-proj-title">
                Tescom Business Solution
                <a href="https://tescom.vercel.app/" target="_blank" rel="noreferrer">tescom.vercel.app ↗</a>
              </div>
              <div className="mr-proj-stack">MEAN Stack · Pabbly Connect · WhatsApp API · Zoho Mail · Ubuntu Server</div>
              <ul className="mr-ul">
                <li>Corporate website with automated certificate generation, WhatsApp messaging, and Zoho Mail business email management deployed on Ubuntu Server</li>
              </ul>
            </div>

                        <div className="mr-proj">
              <div className="mr-proj-title">
                RandomType — Typing Speed Application
                <a href="https://randomtypee.netlify.app/" target="_blank" rel="noreferrer">randomtypee.netlify.app ↗</a>
              </div>
              <div className="mr-proj-stack">React.js · Node.js · Express.js · MongoDB · Netlify</div>
              <ul className="mr-ul">
                <li>Real-time WPM and accuracy metrics with leaderboard, user authentication, and MongoDB persistence; deployed on Netlify</li>
              </ul>
            </div>
          </div>

          {/* CERTIFICATIONS */}
          <div className="mr-sec">
            <SecHd title="Certifications &amp; Additional Skills" />
            <ul className="mr-cert-list">
              <li><strong>MERN / MEAN Stack Certification</strong> — DevTown (2022) · Angular, Node.js, Express.js, MongoDB</li>
              <li><strong>Angular</strong> — Component architecture, routing, lazy loading, reactive forms, guards, interceptors, directives, pipes</li>
              <li><strong>TypeScript</strong> — Strong typing, interfaces, generics, decorators, advanced patterns for Angular</li>
              <li><strong>RxJS &amp; Observables</strong> — Reactive programming, operators: map, switchMap, mergeMap, combineLatest, debounceTime</li>
              <li><strong>RESTful API &amp; Integration</strong> — HttpClient, Axios, API versioning, Postman, JWT authentication</li>
              <li><strong>CI/CD &amp; DevOps</strong> — GitHub Actions, batch-file pipelines, Azure DevOps basics, automated build and release</li>
              <li><strong>Angular Testing</strong> — Jasmine, Karma, TestBed, component and service testing, mocking dependencies</li>
              <li><strong>Version Control</strong> — Git branching (feature/bugfix/hotfix), pull requests, code reviews, conflict resolution</li>
              <li><strong>Firebase &amp; GCP</strong> — Firebase Auth, OTP, Hosting, Google Cloud Platform integration</li>
              <li><strong>Agile / Scrum</strong> — Sprint planning, backlog grooming, daily stand-ups, retrospectives, Jira basics</li>
            </ul>
          </div>

        </div>{/* end body */}
        <div className="mr-pg-num">— Page 2 of 2 —</div>
      </div>

    </div>
  );
}
