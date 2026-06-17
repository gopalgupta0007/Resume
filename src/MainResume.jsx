import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/* ═══════════════════════════════════════════════════════════════
   MainResume — Angular / MEAN Stack Developer
   ATS Strategy:
   • 100% single-column, no sidebar, no CSS grid for content
   • Standard Arial body font — best ATS font
   • Skills listed as plain text rows, not chips/tags
   • All sections in ATS-expected order
   • Angular, MEAN, TypeScript, RxJS, NgRx keywords dense
   • Quantified bullets on every role
   • LinkedIn + GitHub in contact line
   • Gap filled with M.Sc. timeline
   Design: Deep teal (#0b4f6c) header band, clean white body,
   Inter display + Arial body, subtle left-border accent system
═══════════════════════════════════════════════════════════════ */

/* ── STYLES ── injected into <head> once ─────────────────────*/
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .mr-root {
    max-width: 870px;
    margin: 0 auto;
    padding: 28px 18px 56px;
    background: #EAECEF;
    font-family: Arial, Helvetica, sans-serif;
  }

  /* ── CONTROLS ── */
  .mr-controls {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-bottom: 22px;
  }
  .mr-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 30px;
    font-family: 'Inter', Arial, sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    border: 2px solid #0b4f6c;
    cursor: pointer;
    transition: all .2s;
    border-radius: 2px;
  }
  .mr-btn-primary { background: #0b4f6c; color: #ffffff; }
  .mr-btn-primary:hover { background: #083d56; }
  .mr-btn-secondary { background: #ffffff; color: #0b4f6c; }
  .mr-btn-secondary:hover { background: #e8f4fa; }

  /* ── PAGE CARD ── */
  .mr-page {
    background: #ffffff;
    margin-bottom: 20px;
    box-shadow:
      0 1px 3px rgba(11,79,108,.08),
      0 8px 24px rgba(11,79,108,.10),
      0 32px 64px rgba(11,79,108,.07);
    overflow: hidden;
    font-size: 10.5pt;
    color: #2b2b2b;
    line-height: 1.5;
  }

  /* ── HEADER BAND ── */
  .mr-header {
    background: linear-gradient(135deg, #0b4f6c 0%, #0d6b94 100%);
    padding: 34px 52px 28px;
  }

  .mr-name {
    font-family: 'Inter', Arial, sans-serif;
    font-size: 32pt;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -1px;
    line-height: 1;
    margin-bottom: 7px;
  }

  .mr-tagline {
    font-family: 'Inter', Arial, sans-serif;
    font-size: 9pt;
    font-weight: 600;
    color: rgba(255,255,255,0.72);
    letter-spacing: 2.5px;
    text-transform: uppercase;
    margin-bottom: 18px;
  }

  .mr-hd-divider {
    height: 1px;
    background: rgba(255,255,255,0.20);
    margin-bottom: 14px;
  }

  .mr-contacts {
    font-size: 9pt;
    color: rgba(255,255,255,0.80);
    line-height: 1.9;
  }
  .mr-contacts a { color: #7ecef4; text-decoration: none; font-weight: 500; }
  .mr-contacts .sep { color: rgba(255,255,255,0.30); margin: 0 8px; }

  /* ── BODY ── */
  .mr-body { padding: 26px 52px 38px; }

  /* ── SECTION HEADER ── */
  .mr-sec { margin-top: 20px; }
  .mr-sec:first-child { margin-top: 0; }

  .mr-sec-hd {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    padding: 5px 0 5px 10px;
    background: #eef4f8;
    border-left: 4px solid #0b4f6c;
    margin-left: -10px;
  }

  .mr-sec-title {
    font-family: 'Inter', Arial, sans-serif;
    font-size: 8pt;
    font-weight: 700;
    color: #0b4f6c;
    letter-spacing: 2.5px;
    text-transform: uppercase;
  }

  .mr-sec-rule {
    flex: 1;
    height: 1px;
    background: #b8d4e4;
  }

  /* ── SUMMARY ── */
  .mr-summary {
    font-size: 10.5pt;
    color: #2b2b2b;
    line-height: 1.7;
    padding: 11px 14px;
    background: #f8fbfd;
    border: 1px solid #d0dfe8;
    border-left: 3px solid #0b4f6c;
  }

  /* ── SKILLS ── */
  .mr-skills-block { font-size: 10pt; }
  .mr-skill-row {
    display: flex;
    gap: 0;
    padding: 4px 0;
    border-bottom: 1px solid #f2f4f6;
    align-items: baseline;
  }
  .mr-skill-row:last-child { border-bottom: none; }
  .mr-skill-label {
    font-weight: 700;
    color: #0b0b0b;
    min-width: 150px;
    flex-shrink: 0;
    font-size: 9.5pt;
    padding-right: 14px;
  }
  .mr-skill-val {
    color: #444444;
    font-size: 9.5pt;
    line-height: 1.5;
  }

  /* ── EXPERIENCE ── */
  .mr-exp {
    margin-bottom: 18px;
    padding-left: 14px;
    border-left: 3px solid #d8e8f0;
  }
  .mr-exp.current { border-left-color: #0b4f6c; }

  .mr-exp-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 3px;
    flex-wrap: nowrap;
  }

  .mr-exp-co {
    font-family: 'Inter', Arial, sans-serif;
    font-size: 11.5pt;
    font-weight: 700;
    color: #0b0b0b;
    line-height: 1.2;
  }

  .mr-exp-role {
    font-size: 10pt;
    font-weight: 600;
    color: #0b4f6c;
    margin-top: 2px;
  }

  .mr-exp-date {
    font-family: 'Inter', Arial, sans-serif;
    font-size: 9pt;
    font-weight: 700;
    white-space: nowrap;
    flex-shrink: 0;
    padding: 3px 11px;
    border-radius: 2px;
    letter-spacing: 0.3px;
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
    font-size: 9pt;
    font-weight: 700;
    color: #7a5400;
    background: #fef8e7;
    border-left: 3px solid #c8a030;
    padding: 3px 10px;
    margin: 5px 0 7px;
    letter-spacing: 0.2px;
  }

  .mr-ul { margin: 6px 0 0 18px; padding: 0; }
  .mr-ul li {
    font-size: 10pt;
    color: #444444;
    line-height: 1.6;
    margin-bottom: 3px;
    list-style-type: disc;
  }
  .mr-ul li strong { color: #0b0b0b; font-weight: 700; }

  /* ── EDUCATION ── */
  .mr-edu-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f2f5;
  }
  .mr-edu-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .mr-edu-deg {
    font-family: 'Inter', Arial, sans-serif;
    font-size: 10.5pt;
    font-weight: 700;
    color: #0b0b0b;
    line-height: 1.3;
  }
  .mr-edu-inst { font-size: 9.5pt; color: #555555; margin-top: 3px; }
  .mr-edu-gpa {
    font-size: 8.5pt;
    font-weight: 700;
    color: #0b4f6c;
    background: #eef4f8;
    border: 1px solid #b8d4e4;
    padding: 1px 8px;
    margin-left: 8px;
    border-radius: 2px;
    display: inline-block;
    vertical-align: middle;
  }
  .mr-edu-right {
    font-size: 9.5pt;
    color: #555555;
    text-align: right;
    white-space: nowrap;
    flex-shrink: 0;
    font-weight: 600;
  }

  /* ── PROJECTS ── */
  .mr-proj {
    margin-bottom: 14px;
    padding-left: 14px;
    border-left: 3px solid #d8e8f0;
  }
  .mr-proj-title {
    font-family: 'Inter', Arial, sans-serif;
    font-size: 10.5pt;
    font-weight: 700;
    color: #0b0b0b;
    margin-bottom: 2px;
  }
  .mr-proj-title a {
    font-size: 8.5pt;
    font-weight: 600;
    color: #0b4f6c;
    text-decoration: none;
    margin-left: 10px;
    border-bottom: 1px solid #b8d4e4;
    padding-bottom: 1px;
  }
  .mr-proj-stack {
    font-size: 9pt;
    color: #0b4f6c;
    font-style: italic;
    margin-bottom: 4px;
  }

  /* ── CERTIFICATIONS ── */
  .mr-cert-list { margin: 5px 0 0 18px; padding: 0; }
  .mr-cert-list li {
    font-size: 10pt;
    color: #444444;
    line-height: 1.65;
    margin-bottom: 2px;
    list-style-type: disc;
  }
  .mr-cert-list li strong { color: #0b0b0b; font-weight: 700; }

  /* ── PAGE 2 HEADER ── */
  .mr-page2-hd {
    background: linear-gradient(135deg, #0b4f6c 0%, #0d6b94 100%);
    padding: 14px 52px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .mr-page2-name {
    font-family: 'Inter', Arial, sans-serif;
    font-size: 14pt;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.3px;
  }
  .mr-page2-sub {
    font-size: 8pt;
    font-weight: 600;
    color: rgba(255,255,255,0.62);
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  /* ── PAGE NUMBER ── */
  .mr-pg-num {
    text-align: center;
    font-size: 8pt;
    color: #bbbbbb;
    margin-top: 18px;
    letter-spacing: 1px;
    font-family: 'Inter', Arial, sans-serif;
  }
`;

/* ── inject styles once ─────────────────────────────────────*/
function injectStyles() {
  if (!document.getElementById('mr-styles')) {
    const s = document.createElement('style');
    s.id = 'mr-styles';
    s.textContent = CSS;
    document.head.appendChild(s);
  }
}

/* ── PDF export helper ──────────────────────────────────────*/
async function exportPDF(refs, filename) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pw  = pdf.internal.pageSize.getWidth();
  const ph  = pdf.internal.pageSize.getHeight();

  const capture = async (el) => {
    const prevW  = el.style.width;
    const prevMW = el.style.maxWidth;
    el.style.width    = '794px';
    el.style.maxWidth = '794px';
    const c = await html2canvas(el, {
      scale: 3, useCORS: true, logging: false,
      letterRendering: true, allowTaint: false,
      backgroundColor: '#ffffff',
      windowWidth: 794,
      windowHeight: el.scrollHeight,
    });
    el.style.width    = prevW;
    el.style.maxWidth = prevMW;
    return c;
  };

  for (let i = 0; i < refs.length; i++) {
    if (i > 0) pdf.addPage();
    const c  = await capture(refs[i].current);
    const h  = (c.height * pw) / c.width;
    pdf.addImage(c.toDataURL('image/png', 1), 'PNG', 0, 0, pw, Math.min(h, ph));
  }
  pdf.save(filename);
}

/* ══════════════════════════════════════════════════════════
   MainResume Component
══════════════════════════════════════════════════════════ */
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

  /* ── reusable section header ── */
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
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          {exporting ? 'Generating PDF…' : 'Download Resume PDF'}
        </button>
        <button className="mr-btn mr-btn-secondary" onClick={() => window.print()}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
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
            Angular Developer &nbsp;|&nbsp; MEAN Stack Developer &nbsp;|&nbsp; Full Stack Software Developer
          </div>
          <div className="mr-hd-divider" />
          <div className="mr-contacts">
            <span>Mumbai, Maharashtra, India</span>
            <span className="sep">|</span>
            <span>+91 9082257079</span>
            <span className="sep">|</span>
            <span>guptagopal18082003@gmail.com</span>
            <br />
            <span>LinkedIn:&nbsp;
              <a href="https://linkedin.com/in/gopalgupta0007" target="_blank" rel="noreferrer">
                linkedin.com/in/gopalgupta0007
              </a>
            </span>
            <span className="sep">|</span>
            <span>GitHub:&nbsp;
              <a href="https://github.com/gopalgupta0007" target="_blank" rel="noreferrer">
                github.com/gopalgupta0007
              </a>
            </span>
            <span className="sep">|</span>
            <span>Portfolio:&nbsp;
              <a href="https://randomtypee.netlify.app/" target="_blank" rel="noreferrer">
                randomtypee.netlify.app
              </a>
            </span>
          </div>
        </div>

        <div className="mr-body">

          {/* PROFESSIONAL SUMMARY */}
          <div className="mr-sec">
            <SecHd title="Professional Summary" />
            <p className="mr-summary">
              Results-driven <strong>Angular Developer and MEAN Stack Developer</strong> with 2+ years of professional
              experience building enterprise-grade web applications, ERP portals, and HRMS systems. Proficient in
              <strong> Angular (v12+), TypeScript, RxJS, NgRx, HTML5, CSS3, Node.js, Express.js, MongoDB,
              and SQL Server</strong>. Hands-on expertise in <strong>RESTful API integration, component-driven
              architecture, Angular routing, lazy loading, reactive forms, and CI/CD automation</strong>. Experienced
              in <strong>Agile/Scrum methodology</strong> with a proven track record of delivering features on time
              across 10+ sprints. Recognized as <strong>Employee of the Month (May 2026)</strong> at Carufus Technology
              for outstanding contributions to an enterprise Employee Management Portal serving 500+ daily users.
              M.Sc. Information Technology graduate from Mumbai University with CGPA 9.0. Seeking an
              <strong> Angular Developer / MEAN Stack Developer / Full Stack Developer</strong> role to build
              scalable, high-performance web applications.
            </p>
          </div>

          {/* TECHNICAL SKILLS */}
          <div className="mr-sec">
            <SecHd title="Technical Skills" />
            <div className="mr-skills-block">
              {[
                ['Angular (Primary)',   'Angular 12/14/16+, Angular CLI, Angular Material, Angular Router, Lazy Loading, Guards, Interceptors, Directives, Pipes'],
                ['Frontend',           'TypeScript, JavaScript (ES6+), HTML5, CSS3, SCSS, Bootstrap 5, Responsive Web Design, RxJS, NgRx (State Management)'],
                ['Backend / MEAN',     'Node.js, Express.js, RESTful API Design, API Integration, .NET APIs, Mongoose, Middleware, JWT Authentication'],
                ['Database',           'MongoDB, MySQL, SQL Server (SSMS), SQL Scripting, Stored Procedures, Query Optimization, Mongoose ODM'],
                ['Angular Testing',    'Jasmine, Karma, Unit Testing, Component Testing, Service Testing, TestBed, Angular Testing Utilities'],
                ['DevOps & Tools',     'Git, GitHub, GitHub Actions, CI/CD Pipelines, Azure DevOps (basics), VS Code, Postman, npm, Angular CLI'],
                ['Deployment',         'Netlify, Vercel, Ubuntu Server, Firebase Hosting, Remote Desktop, UAT & PROD Environment Management'],
                ['React.js',           'React.js (additional), Component Architecture, Hooks, State Management, JSX, React Router'],
                ['AI & Automation',    'Agentic AI, Natural Language to SQL, Pabbly Connect, Zoho Mail API, WhatsApp Business API'],
                ['Methodologies',      'Agile, Scrum, Sprint Planning, Daily Stand-ups, Code Reviews, Test Case Creation, QA & Bug Resolution'],
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
                  <div className="mr-exp-role">Software Developer | Full Stack Developer (Angular + MEAN + .NET)</div>
                </div>
                <div className="mr-exp-date now">May 2024 – Present</div>
              </div>
              <div className="mr-award">★ Employee of the Month — May 2026</div>
              <ul className="mr-ul">
                <li>Developed and maintained <strong>Angular-based frontend modules</strong> for <strong>Wow! Momo's ERP/HRMS/Employee Management Portal</strong>, supporting <strong>500+ daily active users</strong> across HR, payroll, and operations</li>
                <li>Built <strong>reusable Angular components, directives, and pipes</strong>; implemented <strong>Angular Routing with lazy loading</strong> across 6+ feature modules, reducing initial load time by <strong>~35%</strong></li>
                <li>Integrated <strong>reactive forms and template-driven forms</strong> with custom validators for complex HR workflows including leave management, attendance, and payroll processing</li>
                <li>Consumed and optimized <strong>.NET RESTful APIs</strong> using Angular <strong>HttpClient</strong> with interceptors for JWT token management and error handling</li>
                <li>Participated in daily <strong>Scrum stand-ups and sprint planning</strong>; consistently delivered assigned user stories on time across <strong>10+ consecutive sprints</strong></li>
                <li>Authored <strong>20+ SQL scripts and stored procedures</strong> in SQL Server Management Studio (SSMS) for database operations and reporting</li>
                <li>Designed and deployed an <strong>automated batch-file CI/CD pipeline</strong> triggered on Git commits, reducing deployment effort by <strong>60%</strong> and eliminating manual deployment errors</li>
                <li>Managed <strong>UAT and PROD environment deployments</strong> via Remote Desktop Connection; maintained <strong>zero production rollback incidents</strong> over 6+ months</li>
                <li>Wrote and executed <strong>comprehensive QA test cases</strong>; resolved <strong>40+ bugs</strong> improving overall release quality and application stability</li>
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
                <li>Built a <strong>financial reporting web application</strong> using <strong>Angular frontend</strong> with Chart.js and D3.js data visualizations and customizable PDF report generation</li>
                <li>Developed <strong>Your Handyman</strong> — a full-stack MEAN clone of Urban Clap for home service booking, integrating <strong>Google OAuth</strong> and <strong>Firebase OTP verification</strong></li>
                <li>Designed <strong>Angular routing modules</strong> with role-based route guards for customer, service-provider, and admin roles; used <strong>Node.js/Express.js RESTful APIs</strong> across 5+ service categories</li>
                <li>Delivered responsive, mobile-first Angular templates tested across Chrome, Firefox, and Safari</li>
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
                <li>Developed and deployed <strong>Bharat CXO</strong> and <strong>TESCOM corporate website</strong> on Ubuntu Server; served live production traffic from day one</li>
                <li>Implemented <strong>automated certificate generation, WhatsApp messaging, and bulk email automation</strong> via Pabbly Connect — eliminated <strong>100% of manual certificate workflows</strong></li>
                <li>Configured and managed <strong>10+ business email accounts</strong> and transactional workflows via Zoho Mail API</li>
              </ul>
            </div>

            {/* ── DevTown ── */}
            <div className="mr-exp">
              <div className="mr-exp-header">
                <div>
                  <div className="mr-exp-co">DevTown — Remote</div>
                  <div className="mr-exp-role">MEAN / MERN Stack Training Program & Internship</div>
                </div>
                <div className="mr-exp-date">Jan 2022 – Apr 2022</div>
              </div>
              <ul className="mr-ul">
                <li>Completed 3-month intensive <strong>MEAN / MERN Stack</strong> training covering Angular, Node.js, Express.js, and MongoDB</li>
                <li>Collaborated in a 4-member Agile team to build a <strong>movie booking application</strong> with <strong>Angular routing, user authentication, seat selection, and booking confirmation</strong></li>
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
                <div className="mr-edu-inst">
                  Mumbai University
                  <span className="mr-edu-gpa">CGPA: 9.0 / 10.0</span>
                </div>
              </div>
              <div className="mr-edu-right">Jun 2022 – Apr 2026<br />Completed Apr 2026</div>
            </div>

            <div className="mr-edu-row">
              <div>
                <div className="mr-edu-deg">Bachelor of Science (B.Sc.) — Information Technology</div>
                <div className="mr-edu-inst">
                  Mumbai University
                  <span className="mr-edu-gpa">CGPA: 9.0 / 10.0</span>
                </div>
              </div>
              <div className="mr-edu-right">2021 – 2024<br />Apr 2024</div>
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
                Smart BI Assistant — Agentic AI + Angular + SQL Server
                <span style={{fontSize:'9pt',fontWeight:400,color:'#777',marginLeft:'8px'}}>(Flagship)</span>
              </div>
              <div className="mr-proj-stack">Angular, Node.js, Express.js, Agentic AI, SQL Server (SSMS), NLP, Natural Language to SQL</div>
              <ul className="mr-ul">
                <li>Built an <strong>Agentic AI-powered Business Intelligence dashboard</strong> with an <strong>Angular frontend</strong> that accepts natural-language queries, auto-generates SQL, executes against SSMS, and returns real-time human-readable insights</li>
                <li>Reduced report generation time from hours to seconds; designed scalable modular Angular service architecture</li>
              </ul>
            </div>

            <div className="mr-proj">
              <div className="mr-proj-title">
                Your Handyman — Home Services Booking Platform
                <a href="https://your-handyman.vercel.app/" target="_blank" rel="noreferrer">your-handyman.vercel.app ↗</a>
              </div>
              <div className="mr-proj-stack">Angular · Node.js · Express.js · MongoDB (MEAN Stack) · Firebase Auth · Google OAuth · GCP · Vercel</div>
              <ul className="mr-ul">
                <li><strong>Full MEAN Stack</strong> home services booking platform (Urban Clap clone) with <strong>Angular routing, lazy loading, reactive forms, Google OAuth, and Firebase OTP verification</strong></li>
                <li>Implemented role-based <strong>Angular route guards</strong> for customer, service provider, and admin roles; built 5+ RESTful API endpoints in Express.js</li>
              </ul>
            </div>

            <div className="mr-proj">
              <div className="mr-proj-title">Financial Reporting Web Application</div>
              <div className="mr-proj-stack">Angular · Node.js · Express.js · MySQL · Chart.js · D3.js · PDF Generation</div>
              <ul className="mr-ul">
                <li>Angular SPA with interactive Chart.js and D3.js financial statement visualizations; customizable PDF report generation; dynamic data binding with Angular services and RxJS Observables</li>
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
                <li>Corporate website with automated certificate generation, WhatsApp messaging, vendor portal, and Zoho Mail business email management on Ubuntu Server</li>
              </ul>
            </div>
          </div>

          {/* CERTIFICATIONS */}
          <div className="mr-sec">
            <SecHd title="Certifications & Additional Skills" />
            <ul className="mr-cert-list">
              <li><strong>MERN / MEAN Stack Certification</strong> — DevTown (2022) · Angular, Node.js, Express.js, MongoDB</li>
              <li>Angular Development — Component architecture, routing, lazy loading, reactive forms, guards, interceptors, directives</li>
              <li>TypeScript — Strong typing, interfaces, generics, decorators, advanced TypeScript patterns for Angular</li>
              <li>RxJS & Observables — Reactive programming, operators (map, switchMap, mergeMap, combineLatest, debounceTime)</li>
              <li>RESTful API Design & Integration — HttpClient, Axios, API versioning, Postman testing, JWT authentication</li>
              <li>CI/CD Deployment Automation — GitHub Actions, batch-file pipelines, automated build and release workflows</li>
              <li>Agile / Scrum — Sprint planning, backlog grooming, daily stand-ups, retrospectives, Jira basics</li>
              <li>Angular Unit Testing — Jasmine, Karma, TestBed, component and service testing, mocking dependencies</li>
              <li>Version Control — Git branching (feature/bugfix/hotfix), GitHub pull requests, code reviews, conflict resolution</li>
              <li>SQL Optimization — Query tuning, indexing, stored procedures, SSMS execution plan analysis</li>
              <li>Quality Assurance & Testing — Test case creation, execution, regression testing, UAT coordination</li>
              <li>Firebase & GCP — Firebase Auth, Firebase OTP, Firebase Hosting, Google Cloud Platform integration</li>
            </ul>
          </div>

        </div>{/* end body */}
        <div className="mr-pg-num">— Page 2 of 2 —</div>
      </div>

    </div>
  );
}