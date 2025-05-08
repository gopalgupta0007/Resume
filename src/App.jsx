import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const App = () => {
  const resumeRef = useRef(null);

  // Function to generate and download PDF
  const downloadPDF = () => {
    const input = resumeRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('gopal_gupta_resume.pdf');
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">

      <div>
        {/* Page 1 */}
        <div ref={resumeRef} className="w-full max-w-4xl mx-auto p-6 font-sans text-gray-800 bg-white shadow-lg print:shadow-none mb-8">
          {/* Header Section */}
          <header className="mb-5 pb-3 border-b-2 border-gray-700 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#1f2937' }}>GOPAL GUPTA</h1>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" style={{ color: '#4b5563' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+91 9082257079</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" style={{ color: '#4b5563' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>guptagopal18082003@gmail.com</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" style={{ color: '#4b5563' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <a href="https://github.com/gopalgugraduatepta0007" style={{ color: '#2563eb' }} className="hover:underline" target="_blank" rel="noopener noreferrer">github.com/gopalgugraduatepta0007</a>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" style={{ color: '#4b5563' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>G.T.B Nagar, Sion Koliwada, Mumbai - 400037</span>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-4">
            {/* Education Section */}
            <section className="mb-3">
              <h2 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2" style={{ color: '#1f2937' }}>Education</h2>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Currently Pursuing Masters M.Sc.(I.T.) from Mumbai University</li>
                <li>B.Sc.(I.T.) Graduate from Mumbai University</li>
                <li>HSC - 74%</li>
                <li>SSC - 60%</li>
              </ul>
            </section>

            {/* Technical Skills Section */}
            <section className="mb-3">
              <h2 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2" style={{ color: '#1f2937' }}>Technical Skills</h2>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Frontend: HTML5, CSS3, JavaScript (ES6+), React.js</li>
                <li>Backend: Node.js, Express.js</li>
                <li>Database: MongoDB</li>
                <li>Java Technologies: Core Java, OOPS.</li>
                <li>Tools & Platforms: Git, GitHub, VS Code, Postman</li>
                <li>Deployment: Ubuntu Server, Netlify, Vercel</li>
              </ul>
            </section>

            {/* Professional Experience Section */}
            <section className="mb-3">
              <h2 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2" style={{ color: '#1f2937' }}>Professional Experience</h2>

              {/* Experience 2 */}
              <div className="mb-3">
                <h3 className="text-base font-medium" style={{ color: '#2563eb' }}>MERN Stack Developer Intern | Digital Rhombus</h3>
                <p className="italic mb-1 text-sm" style={{ color: '#6b7280' }}>2 months (17 Feb 2024 - 17 Apr 2024)</p>
                <ul className="list-disc pl-5 space-y-0.5 text-sm">
                  <li>Developed a <b>financial reporting website</b> with data visualization features</li>
                  <li>Built <b>Your Handyman</b> web application - a clone of Urban Clap for booking home services</li>
                  <li>Collaborated with the development team to implement responsive UI designs</li>
                  <li>Utilized <b>MYSQL for database management</b> and Express.js for RESTful API creation</li>
                </ul>
              </div>

              {/* Experience 1 */}
              <div className="mb-3">
                <h3 className="text-base font-medium" style={{ color: '#2563eb' }}>Full Stack MERN Developer Intern | Tescom</h3>
                <p className="italic mb-1 text-sm" style={{ color: '#6b7280' }}>3 months (Jul 2023 - Sept 2023)</p>
                <ul className="list-disc pl-5 space-y-0.5 text-sm">
                  <li>Developed two web applications: <b>Bharat CXO</b> and <b>TESCOM company website</b></li>
                  <li>Deployed and managed websites on Ubuntu server</li>
                  <li>Implemented automation solutions including <b>certificate generation</b>, <b>WhatsApp messaging</b>, and <b>email automation using Pabbly</b></li>
                  <li><b>Managed all business emails</b> through Zoho Mail</li>
                  <li>Maintained vendor portal data</li>
                </ul>
              </div>

              {/* Experience 3 */}
              <div className="mb-3">
                <h3 className="text-base font-medium" style={{ color: '#2563eb' }}>MERN Training Program & Internship | DevTown</h3>
                <p className="italic mb-1 text-sm" style={{ color: '#6b7280' }}>4 months (Jan 2022 - Apr 2022)</p>
                <ul className="list-disc pl-5 space-y-0.5 text-sm">
                  <li>Completed <b>3 months</b> of intensive MERN stack training</li>
                  <li>Worked collaboratively with a team of interns to develop a <b>movie booking web application</b></li>
                  <li>Implemented user authentication, movie listings, seat selection, and booking functionality</li>
                  <li>Applied agile development methodology for project management</li>
                </ul>
              </div>
            </section>

            {/* Projects Section - First 3 projects */}
            <section>
              <h2 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2" style={{ color: '#1f2937' }}>Projects</h2>

              {/* Project 1 */}
              <div className="mb-2">
                <h3 className="text-base font-medium" style={{ color: '#2563eb' }}>
                  RandomType
                  <a href="https://gopalgupta0007.netlify.app/" className="ml-2 text-sm hover:underline" style={{ color: '#3b82f6' }} target="_blank" rel="noopener noreferrer">(Live Demo)</a>
                </h3>
                <p className="mb-1 text-sm">A typing speed test application built with the MERN stack that helps users improve their typing speed and accuracy.</p>
                <p className="italic text-sm" style={{ color: '#6b7280' }}>Technologies: MongoDB, Express, React, Node.js</p>
              </div>

              {/* Project 3 */}
              <div className="mb-2">
                <h3 className="text-base font-medium" style={{ color: '#2563eb' }}>Movie Booking Website</h3>
                <p className="mb-1 text-sm">Collaborative project developed during internship that allows users to browse movies, select seats, and book tickets.</p>
                <p className="italic text-sm" style={{ color: '#6b7280' }}>Technologies: MongoDB, Express, React, Node.js</p>
              </div>

              {/* Project 2 */}
              <div className="mb-2">
                <h3 className="text-base font-medium" style={{ color: '#2563eb' }}>
                  Personal Portfolio
                  <a href="https://gopalgupta0007.netlify.app/" className="ml-2 text-sm hover:underline" style={{ color: '#3b82f6' }} target="_blank" rel="noopener noreferrer">(Live Demo)</a>
                </h3>
                <p className="mb-1 text-sm">A professional portfolio website showcasing my skills, experience, and projects as a full-stack web developer.</p>
                <p className="italic text-sm" style={{ color: '#6b7280' }}>Technologies: HTML, CSS, JavaScript</p>
              </div>
            </section>
          </div>
        </div>

        {/* Page 2 - Additional Projects */}
        <div className="w-full max-w-4xl mx-auto p-6 font-sans text-gray-800 bg-white shadow-lg print:shadow-none">
          {/* Header for page continuity */}
          <header className="mb-5 pb-3 border-b-2 border-gray-700 flex justify-center">
            <h1 className="text-xl font-bold" style={{ color: '#1f2937' }}>GOPAL GUPTA - RESUME (CONTINUED)</h1>
          </header>

          <div className="grid grid-cols-1 gap-4">
            {/* Projects Section - Additional 4 projects */}
            <section>
              <h2 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-3" style={{ color: '#1f2937' }}>Projects (Continued)</h2>

              {/* Project 4 - Your Handyman */}
              <div className="mb-4">
                <h3 className="text-base font-medium" style={{ color: '#2563eb' }}>Your Handyman</h3>
                <p className="mb-2 text-sm">YourHandyman is a home services platform inspired by UrbanClap, featuring Google login, OTP verification via Firebase, and user location tracking with GCP. It supports role-based access for customers, service professionals, and admins for a seamless service experience.</p>
                <ul className="list-disc pl-5 space-y-0.5 text-sm mb-2">
                  <li>Implemented <b>Google Authentication</b> and <b>Firebase OTP verification</b> for secure user access</li>
                  <li>Developed <b>role-based access control</b> with separate dashboards for customers, service providers, and admins</li>
                  <li>Integrated <b>Google Cloud Platform</b> for location services and tracking</li>
                  <li>Created <b>real-time service booking</b> and <b>status tracking</b> functionality</li>
                </ul>
                <p className="italic text-sm" style={{ color: '#6b7280' }}>Technologies: MongoDB, Express, React, Node.js, Firebase, GCP</p>
              </div>

              {/* Project 5 - Financial Reporting */}
              <div className="mb-4">
                <h3 className="text-base font-medium" style={{ color: '#2563eb' }}>Financial Reporting Website</h3>
                <p className="mb-2 text-sm">In the financial reporting website, I implemented a responsive UI to visualize user-uploaded data and enabled users to download customized reports based on their needs, including financial statements, balance sheets, income statements, and cash flow reports.</p>
                <ul className="list-disc pl-5 space-y-0.5 text-sm mb-2">
                  <li>Developed <b>interactive data visualization dashboards</b> using Chart.js and D3.js</li>
                  <li>Created <b>PDF report generation</b> functionality for financial statements</li>
                  <li>Implemented <b>secure data upload</b> and processing features</li>
                  <li>Built <b>customizable report templates</b> with various financial metrics</li>
                </ul>
                <p className="italic text-sm" style={{ color: '#6b7280' }}>Technologies: MongoDB, Express, React, Node.js, Chart.js, D3.js</p>
              </div>

              {/* Project 6 - BharatCXO */}
              <div className="mb-4">
                <h3 className="text-base font-medium" style={{ color: '#2563eb' }}>BharatCXO</h3>
                <p className="mb-2 text-sm">A comprehensive platform connecting C-suite executives across India, facilitating networking, knowledge sharing, and business development opportunities.</p>
                <ul className="list-disc pl-5 space-y-0.5 text-sm mb-2">
                  <li>Built a <b>membership-based platform</b> with tiered access levels</li>
                  <li>Implemented <b>secure payment gateway integration</b> for membership subscriptions</li>
                  <li>Developed <b>event management</b> and <b>networking features</b></li>
                  <li>Created an <b>interactive knowledge base</b> with resources for executives</li>
                </ul>
                <p className="italic text-sm" style={{ color: '#6b7280' }}>Technologies: MongoDB, Express, React, Node.js, Zoho Mail API</p>
              </div>

              {/* Project 7 - Tescom Business Solution */}
              <div className="mb-4">
                <h3 className="text-base font-medium" style={{ color: '#2563eb' }}>Tescom Business Solution</h3>
                <p className="mb-2 text-sm">A comprehensive corporate website and business solution platform showcasing Tescom's services and solutions with a fully integrated customer management system.</p>
                <ul className="list-disc pl-5 space-y-0.5 text-sm mb-2">
                  <li>Developed <b>responsive company website</b> with service offerings and client portfolio</li>
                  <li>Created <b>automated certificate generation system</b> for training programs</li>
                  <li>Implemented <b>integrated WhatsApp messaging</b> for client communications</li>
                  <li>Built <b>vendor portal</b> with data management capabilities</li>
                </ul>
                <p className="italic text-sm" style={{ color: '#6b7280' }}>Technologies: MongoDB, Express, React, Node.js, Pabbly Connect</p>
              </div>
            </section>

            {/* Additional Skills */}
            <section className="mt-3">
              <h2 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2" style={{ color: '#1f2937' }}>Additional Skills & Certifications</h2>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Proficient in <b>responsive web design</b> and <b>mobile-first development</b></li>
                <li>Experience with <b>third-party API integration</b> (Firebase, Google Cloud, Payment gateways)</li>
                <li>Familiar with <b>containerization</b> using Docker</li>
                <li>Completed certification in <b>MERN Stack Development</b> from DevTown</li>
                <li>Strong understanding of <b>RESTful API design</b> and implementation</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto mb-4">
        <button
          onClick={downloadPDF}
          className="bg-blue-600 text-white px-4 py-2 m-5 rounded hover:bg-blue-700 transition ml-[42%]"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default App;

