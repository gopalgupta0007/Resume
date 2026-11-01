import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/*
  JavaResume — Java Full Stack Developer
  Pixel-matched to the reference resume (measured from its PDF):
  • US Letter 612×792pt, 54pt side margins, 504pt content width
  • Name 26pt bold #1F4E79 · subtitle 13pt italic #555 · contact 9.5pt
  • Section headings 12pt bold #1F4E79 with 1pt rule · body 10pt / 1.15
  • Bullets: marker at 9pt, text at 18pt, 2pt between bullets
  • Job / project titles 11pt bold, 9.5pt italic grey meta line
  • Skills table 468pt wide, 90pt label column filled #D6E4F0, #CCC borders
  Real text, single column → ATS-safe via "Save as PDF" (print).
*/

export const RESUME_CSS = `
  * { box-sizing: border-box; }

  .jr-root {
    max-width: 870px;
    margin: 0 auto;
    padding: 24px 18px 48px;
    background: #eef0f2;
    font-family: 'Liberation Sans', Arial, Helvetica, sans-serif;
  }

  .jr-controls { display: flex; justify-content: center; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; }
  .jr-btn {
    padding: 10px 26px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase;
    border: 2px solid #1f4e79; cursor: pointer; border-radius: 2px;
  }
  .jr-btn-primary { background: #1f4e79; color: #fff; }
  .jr-btn-primary:hover { background: #163a5a; }
  .jr-btn-secondary { background: #fff; color: #1f4e79; }
  .jr-btn-secondary:hover { background: #eef3f8; }
  .jr-btn:disabled { opacity: .6; cursor: default; }
  .jr-tip { text-align: center; font-size: 8.5pt; color: #5b6773; max-width: 560px; margin: 0 auto 20px; line-height: 1.5; }

  /* ── PAGE: US Letter, fixed so the resume is exactly 2 pages ── */
  .jr-page {
    background: #fff;
    width: 612pt;
    height: 792pt;
    margin: 0 auto 16px;
    padding: 52pt 54pt 54pt;
    box-shadow: 0 1px 3px rgba(0,0,0,.08), 0 6px 20px rgba(0,0,0,.10);
    font-family: 'Liberation Sans', Arial, Helvetica, sans-serif;
    font-size: 10pt;
    line-height: 1.15;
    color: #1a1a1a;
    overflow: hidden;
  }
  .jr-page > :first-child { margin-top: 0 !important; }

  /* ── HEADER ── */
  .jr-name {
    margin: 0 0 1pt; text-align: center; text-transform: uppercase;
    font-size: 26pt; font-weight: 700; line-height: 1.15; color: #1f4e79;
  }
  .jr-title { margin: 0 0 2pt; text-align: center; font-size: 13pt; font-style: italic; line-height: 1.15; color: #555; }
  .jr-contact { text-align: center; font-size: 9.5pt; line-height: 1.15; }
  .jr-contact a { color: #1f4e79; text-decoration: underline; }
  .jr-contact .sep, .jr-meta .sep, .jr-edu .sep { margin: 0 6pt; }

  /* ── SECTIONS ── */
  .jr-sec { margin-top: 10pt; }
  .jr-sec-title {
    font-size: 12pt; font-weight: 700; line-height: 1.15; color: #1f4e79;
    text-transform: uppercase;
    border-bottom: 1pt solid #1f4e79;
    padding-bottom: 3pt; margin-bottom: 4.5pt;
  }
  .jr-p { margin: 0; }

  .jr-ul { margin: 0; padding: 0; list-style: none; }
  .jr-ul li { position: relative; padding-left: 18pt; margin: 0 0 2pt; }
  .jr-ul li::before { content: '\\2022'; position: absolute; left: 9pt; top: 0; color: #000; }

  .jr-edu { margin: 0; }

  /* ── JOBS / PROJECTS ── */
  .jr-sec-title + .jr-job, .jr-sec-title + .jr-proj { margin-top: 2.3pt; }
  .jr-job, .jr-proj { margin-bottom: 5pt; }
  .jr-job:last-child, .jr-proj:last-child { margin-bottom: 0; }
  .jr-job-title { font-size: 11pt; font-weight: 700; line-height: 1.15; }
  .jr-job-title .role { font-size: 10pt; font-weight: 400; }
  .jr-job-title .dash { margin: 0 6pt; font-weight: 400; }
  .jr-meta { margin: 1pt 0 3pt; font-size: 9.5pt; font-style: italic; color: #555; }
  .jr-proj-title { font-size: 11pt; font-weight: 700; line-height: 1.15; }
  .jr-proj-title a { margin-left: 8pt; font-size: 9pt; font-weight: 400; color: #1f4e79; text-decoration: underline; }
  .jr-proj-stack { margin: 1pt 0 3pt; font-size: 9.5pt; font-style: italic; color: #555; }

  /* ── SKILLS TABLE ── */
  .jr-skills { width: 468pt; margin-top: 17.5pt; border-collapse: collapse; table-layout: fixed; }
  .jr-skills td {
    border: 0.75pt solid #ccc; padding: 3.7pt 6pt;
    font-size: 9.5pt; line-height: 1.15; vertical-align: top;
  }
  .jr-skills td.lbl { width: 90pt; background: #d6e4f0; font-weight: 700; }

  @page { size: letter; margin: 0; }
  @media print {
    .jr-controls, .jr-tip { display: none !important; }
    .jr-root { background: transparent; padding: 0; max-width: none; margin: 0; }
    .jr-page { box-shadow: none; margin: 0; break-after: page; }
    .jr-page:last-child { break-after: auto; }
    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
`;

function injectStyles() {
  if (!document.getElementById('jr-styles')) {
    const s = document.createElement('style');
    s.id = 'jr-styles';
    s.textContent = RESUME_CSS;
    document.head.appendChild(s);
  }
}

/* Rasterized export — image only, NOT ATS-readable. For applications use Print → Save as PDF. */
async function exportPDF(refs, filename) {
  const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'letter' });
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();

  for (let i = 0; i < refs.length; i++) {
    const el = refs[i].current;
    if (!el) continue;

    const saved = el.getAttribute('style') || '';
    el.style.cssText += '; box-shadow:none !important; margin:0 !important;';

    const canvas = await html2canvas(el, {
      scale: 2, useCORS: true, logging: false, allowTaint: false, backgroundColor: '#ffffff',
    });

    el.setAttribute('style', saved);

    if (i > 0) pdf.addPage();
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.97), 'JPEG', 0, 0, W, H);
  }
  pdf.save(filename);
}

const Sec = ({ title, children }) => (
  <div className="jr-sec">
    <div className="jr-sec-title">{title}</div>
    {children}
  </div>
);

const Sep = () => <span className="sep">|</span>;

const Job = ({ company, role, dates, place, bullets, cont }) => (
  <div className="jr-job">
    {!cont && (
      <>
        <div className="jr-job-title">
          {company}<span className="dash">—</span><span className="role">{role}</span>
        </div>
        <div className="jr-meta">{dates}<Sep />{place}</div>
      </>
    )}
    <ul className="jr-ul">{bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
  </div>
);

export default function JavaResume() {
  const page1 = useRef(null);
  const page2 = useRef(null);
  const [exporting, setExporting] = useState(false);

  React.useEffect(() => { injectStyles(); }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportPDF([page1, page2], 'gopal_gupta_java_developer.pdf');
    } catch (e) {
      console.error(e);
      alert('Error generating PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const competencies = [
    'Java, Spring Boot and RESTful Services — working knowledge applied alongside a strong Node.js/Express backend background.',
    'Secure API design including AES-256-GCM encryption, JWT access/refresh-token authentication, CORS configuration and multi-device session management.',
    'Full-stack development with Angular, React, TypeScript, RxJS and NgRx for frontend integration with Node.js/Express and .NET backends.',
    'Backend modernisation — migrated .NET APIs to Node.js while preserving contracts for existing consumers.',
    'Asynchronous processing — designed a publisher-consumer batch pipeline handling 5k requests per 15 minutes.',
    'Database expertise across SQL Server, MySQL and MongoDB, including stored procedures and query optimisation.',
    'Practical experience with Agentic AI and natural-language-to-SQL integration.',
    'Proficient in DevOps tools including Git, GitHub Actions, CI/CD automation, Ubuntu Server, Netlify, Vercel and Firebase.',
    'Agile/Scrum practitioner — sprint planning, code reviews, QA test cases, Git branching and pull requests.',
    'Operating Systems: Windows and Linux.',
  ];

  const skills = [
    ['Frontend', 'Angular, React.js, TypeScript, JavaScript, RxJS, NgRx, HTML5, CSS3, Bootstrap'],
    ['Backend', 'Java, Spring Boot, Node.js, Express.js, .NET APIs, REST APIs, Mongoose'],
    ['Security', 'AES-256-GCM, JWT, Access/Refresh Tokens, CORS, Session Management, OAuth'],
    ['AI / Automation', 'Agentic AI, NL-to-SQL, Pabbly Connect, Zoho Mail API, WhatsApp Business API'],
    ['DevOps & Tools', 'Git, GitHub, CI/CD, Postman, Jasmine, Karma, Netlify, Vercel, Ubuntu, Firebase'],
    ['Databases', 'SQL Server (SSMS), MySQL, MongoDB'],
    ['IDEs', 'IntelliJ IDEA, Visual Studio Code, Visual Studio'],
    ['Operating Systems', 'Windows, Linux'],
  ];

  return (
    <div className="jr-root">
      <div className="jr-controls">
        <button className="jr-btn jr-btn-primary" onClick={() => window.print()}>
          Save as PDF (ATS-Safe)
        </button>
        <button className="jr-btn jr-btn-secondary" onClick={handleExport} disabled={exporting}>
          {exporting ? 'Generating…' : 'Download Image PDF'}
        </button>
      </div>
      <div className="jr-tip">
        <strong>For job applications:</strong> use "Save as PDF" — it keeps real, selectable text that
        applicant tracking systems can read. "Image PDF" is a picture of the page.
      </div>

      {/* ══════════════ PAGE 1 ══════════════ */}
      <div className="jr-page" ref={page1}>
        <h1 className="jr-name">Gopal Gupta</h1>
        <div className="jr-title">Java Full Stack Developer</div>
        <div className="jr-contact">
          Mobile: (+91) 9082257079<Sep />Email: guptagopal18082003@gmail.com<Sep />LinkedIn:{' '}
          <a href="https://linkedin.com/in/gopalgupta0007" target="_blank" rel="noreferrer">Gopal Gupta</a>
          <Sep />GitHub:{' '}
          <a href="https://github.com/gopalgupta0007" target="_blank" rel="noreferrer">Gopal Gupta</a>
        </div>

        <Sec title="Professional Synopsis">
          <p className="jr-p">
            Full stack developer with 2+ years of experience building secure, scalable enterprise applications, with
            expertise in Java, Spring Boot, Node.js and Angular. Proven track record of designing secure REST APIs —
            AES-256-GCM encryption, JWT access/refresh-token authentication, CORS and multi-device session management —
            and high-throughput asynchronous pipelines. Skilled in full-stack development with Angular and React,
            combined with strong database design capabilities across SQL Server, MySQL and MongoDB to deliver robust
            solutions across diverse domains.
          </p>
        </Sec>

        <Sec title="Core Competencies">
          <ul className="jr-ul">{competencies.map((c, i) => <li key={i}>{c}</li>)}</ul>
        </Sec>

        <Sec title="Academic Credentials">
          <p className="jr-edu"><b>M.Sc. (Information Technology)</b> from Mumbai University<Sep /><b>CGPA: 9.0</b><Sep />2024 – 2026</p>
          <p className="jr-edu"><b>B.Sc. (Information Technology)</b> from Mumbai University<Sep /><b>CGPA: 9.02</b><Sep />2021 – 2024</p>
        </Sec>

        <Sec title="Professional Track Record">
          <Job
            company="Carufus Technology" role="Full Stack Developer"
            dates="May 2025 – Present" place="Mumbai, India"
            bullets={[
              'Developed and maintained Angular frontend modules and backend APIs for an ERP/HRMS portal supporting 500+ daily users across HR, payroll and operations.',
              'Implemented AES-256-GCM encryption for sensitive data in transit between client and server.',
              'Secured public APIs with access/refresh-token authentication, CORS configuration and multi-device session management.',
              'Migrated .NET APIs to Node.js, preserving contracts for existing consumers.',
              'Designed a publisher-consumer batch pipeline handling 5k requests per 15 minutes.',
              'Built an automated batch-file CI/CD pipeline triggered on Git commits, reducing deployment effort by 60%.',
              'Authored 20+ SQL scripts and stored procedures in SSMS; managed UAT and PROD deployments with zero production rollback incidents over 6+ months.',
              'Resolved 40+ bugs through QA test case creation and execution; delivered user stories across 10+ consecutive Scrum sprints. Recognized as Employee of the Month (May 2026).',
            ]}
          />
        </Sec>
      </div>

      {/* ══════════════ PAGE 2 ══════════════ */}
      <div className="jr-page" ref={page2}>
        <div className="jr-jobs">
          <Job
            company="Digital Rhombus" role="MEAN Stack Developer"
            dates="February 2025 – April 2025" place="Mumbai, India"
            bullets={[
              'Built a financial reporting SPA using Angular with Chart.js and D3.js visualizations and customizable PDF report generation.',
              'Developed Your Handyman, a full-stack home service booking platform with Google OAuth and Firebase OTP verification.',
              'Implemented Angular route guards for customer, service-provider and admin roles; built RESTful APIs across 5+ service categories in Node.js/Express.js.',
            ]}
          />
          <Job
            company="Tescom Business Solutions" role="Full Stack MEAN Developer Intern"
            dates="June 2024 – October 2024" place="Mumbai, India"
            bullets={[
              'Developed and deployed BharatCXO and the TESCOM corporate website on Ubuntu Server, serving live production traffic.',
              'Automated certificate generation, WhatsApp messaging and bulk email via Pabbly Connect, eliminating manual certificate workflows.',
            ]}
          />
          <Job
            company="DevTown" role="MERN Stack Training Program & Internship"
            dates="January 2022 – April 2022" place="Remote"
            bullets={[
              'Completed an intensive MEAN/MERN stack program; built a movie booking application in a 4-member Agile team with routing, authentication, seat selection and booking confirmation.',
            ]}
          />
        </div>

        <Sec title="Project Highlights">
          <div className="jr-proj">
            <div className="jr-proj-title">Project 1: Smart BI Assistant (Agentic AI Dashboard)</div>
            <div className="jr-proj-stack">React, Node.js, Express.js, Agentic AI, SQL Server, Natural Language to SQL</div>
            <ul className="jr-ul">
              <li>Built a BI dashboard that accepts natural-language queries, auto-generates SQL, executes it against SQL Server and returns real-time insights.</li>
              <li>Reduced report generation time from hours to seconds.</li>
            </ul>
          </div>
          <div className="jr-proj">
            <div className="jr-proj-title">
              Project 2: Your Handyman (Home Services Booking Platform)
              <a href="https://your-handyman.vercel.app/" target="_blank" rel="noreferrer">your-handyman.vercel.app</a>
            </div>
            <div className="jr-proj-stack">React, Node.js, Express.js, MongoDB, Firebase Auth, Google OAuth, Vercel</div>
            <ul className="jr-ul">
              <li>Developed an Urban Clap-style platform with Google OAuth, Firebase OTP verification and role-based route guards for 3 user types.</li>
            </ul>
          </div>
          <div className="jr-proj">
            <div className="jr-proj-title">
              Project 3: BharatCXO (Executive Networking Platform)
              <a href="https://bharatcxomernproject.netlify.app/" target="_blank" rel="noreferrer">bharatcxomernproject.netlify.app</a>
            </div>
            <div className="jr-proj-stack">MEAN Stack, Zoho Mail API, Netlify</div>
            <ul className="jr-ul">
              <li>C-suite networking platform with membership-based access, event management and automated transactional email workflows.</li>
            </ul>
          </div>
        </Sec>

        <Sec title="Technical Skills">
          <table className="jr-skills">
            <tbody>
              {skills.map(([l, v]) => (
                <tr key={l}><td className="lbl">{l}</td><td>{v}</td></tr>
              ))}
            </tbody>
          </table>
        </Sec>
      </div>
    </div>
  );
} 