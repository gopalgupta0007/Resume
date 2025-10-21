// import React, { useRef } from 'react';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

// const App = () => {
//   const page1Ref = useRef(null);
//   const page2Ref = useRef(null);

//   // Function to generate and download PDF with both pages
//   const downloadPDF = async () => {
//     if (!page1Ref.current || !page2Ref.current) return;

//     // Create a new PDF document with A4 dimensions
//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const pageHeight = pdf.internal.pageSize.getHeight();

//     try {
//       // Capture first page
//       const canvas1 = await html2canvas(page1Ref.current, {
//         scale: 2, // Higher scale for better quality
//         useCORS: true,
//         logging: false
//       });

//       const imgData1 = canvas1.toDataURL('image/png');
//       const imgWidth1 = pageWidth;
//       const imgHeight1 = (canvas1.height * imgWidth1) / canvas1.width;

//       // Add first page to PDF
//       pdf.addImage(imgData1, 'PNG', 0, 0, imgWidth1, Math.min(imgHeight1, pageHeight));

//       // Add a new page for the second resume page
//       pdf.addPage();

//       // Capture second page
//       const canvas2 = await html2canvas(page2Ref.current, {
//         scale: 2,
//         useCORS: true,
//         logging: false
//       });

//       const imgData2 = canvas2.toDataURL('image/png');
//       const imgWidth2 = pageWidth;
//       const imgHeight2 = (canvas2.height * imgWidth2) / canvas2.width;

//       // Add second page to PDF
//       pdf.addImage(imgData2, 'PNG', 0, 0, imgWidth2, Math.min(imgHeight2, pageHeight));

//       // Save the PDF
//       pdf.save('gopal_gupta_resume.pdf');
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//       alert("There was an error generating the PDF. Please try again.");
//     }
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen py-8">
//       {/* Resume Container */}
//       <div className="w-full max-w-4xl mx-auto">
//         {/* Page 1 */}
//         <div ref={page1Ref} className="mb-8 bg-white shadow-lg p-8 font-sans text-gray-800">
//           {/* Header with modern styling */}
//           <header className="mb-6">
//             <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">GOPAL GUPTA</h1>
//             <p className="text-center text-gray-500 text-lg mb-4">MERN Stack Developer | Software Developer</p>

//             <div className="flex flex-wrap justify-center gap-6 text-sm">
//               <div className="flex items-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                 </svg>
//                 <span>+91 9082257079</span>
//               </div>
//               <div className="flex items-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                 </svg>
//                 <span>guptagopal18082003@gmail.com</span>
//               </div>
//               <div className="flex items-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
//                 </svg>
//                 <a href="https://github.com/gopalgugraduatepta0007" className="text-blue-600 hover:underline">github.com/gopalgugraduatepta0007</a>
//               </div>
//               <div className="flex items-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                 </svg>
//                 <span>G.T.B Nagar, Sion Koliwada, Mumbai - 400037</span>
//               </div>
//             </div>

//             <div className="mt-4 h-1 w-full bg-gradient-to-r from-blue-600 to-blue-300"></div>
//           </header>

//           <div className="grid grid-cols-1 gap-6">
//             {/* Education Section */}
//             <section>
//               <h2 className="text-xl font-bold text-blue-700 mb-3 flex items-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path d="M12 14l9-5-9-5-9 5 9 5z" />
//                   <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
//                 </svg>
//                 EDUCATION
//               </h2>
//               <div className="ml-2 pl-4 border-l-2 border-gray-200">
//                 <ul className="space-y-2">
//                   <li className="text-sm">
//                     <span className="font-medium">Currently Pursuing Masters M.Sc.(I.T.)</span> from Mumbai University
//                   </li>
//                   <li className="text-sm">
//                     <span className="font-medium">B.Sc.(I.T.) Graduate</span> from Mumbai University
//                   </li>
//                   <li className="text-sm">
//                     <span className="font-medium">HSC</span> - 74%
//                   </li>
//                   <li className="text-sm">
//                     <span className="font-medium">SSC</span> - 60%
//                   </li>
//                 </ul>
//               </div>
//             </section>

//             {/* Technical Skills Section */}
//             <section>
//               <h2 className="text-xl font-bold text-blue-700 mb-3 flex items-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
//                 </svg>
//                 TECHNICAL SKILLS
//               </h2>
//               <div className="ml-2 pl-4 border-l-2 border-gray-200">
//                 <div className="grid grid-cols-2 gap-2">
//                   <div>
//                     <h3 className="font-medium text-sm">Frontend:</h3>
//                     <p className="text-sm">HTML5, CSS3, JavaScript (ES6+), React.js, Angular.js</p>
//                   </div>
//                   <div>
//                     <h3 className="font-medium text-sm">Backend:</h3>
//                     <p className="text-sm">Node.js, Express.js, .NET APIs</p>
//                   </div>
//                   <div>
//                     <h3 className="font-medium text-sm">Database:</h3>
//                     <p className="text-sm">MongoDB, MYSQL</p>
//                   </div>
//                   <div>
//                     <h3 className="font-medium text-sm">Java Technologies:</h3>
//                     <p className="text-sm">Core Java, OOPS</p>
//                   </div>
//                   <div>
//                     <h3 className="font-medium text-sm">Tools & Platforms:</h3>
//                     <p className="text-sm">Git, GitHub, VS Code, Postman</p>
//                   </div>
//                   <div>
//                     <h3 className="font-medium text-sm">Deployment:</h3>
//                     <p className="text-sm">Ubuntu Server, Netlify, Vercel</p>
//                   </div>
//                 </div>
//               </div>
//             </section>

//             {/* Professional Experience Section */}
//             <section>
//               <h2 className="text-xl font-bold text-blue-700 mb-3 flex items-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                 </svg>
//                 PROFESSIONAL EXPERIENCE
//               </h2>
//               <div className="ml-2 pl-4 border-l-2 border-gray-200">
//                 {/* Current Experience - Carufus Technology */}
//                 <div className="mb-4">
//                   <div className="flex justify-between items-start">
//                     <h3 className="text-base font-semibold text-blue-600">Software Developer | Carufus Technology</h3>
//                     <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">May 2024 - Present</span>
//                   </div>
//                   <ul className="list-disc pl-5 space-y-1 text-sm mt-1">
//                     <li>Participate in daily <b>Scrum meetings</b> and <b>sprint planning sessions</b> to discuss project progress, challenges, and task prioritization</li>
//                     <li>Implement <b>feature enhancements</b> and <b>new feature integration</b> across different application modules using modern development practices</li>
//                     <li>Manage and optimize <b>.NET based integrated APIs</b> for seamless communication between frontend and backend systems</li>
//                     <li>Handle <b>UAT and PROD deployments</b> through <b>GitHub branches</b> following CI/CD best practices and version control strategies</li>
//                     <li>Conduct comprehensive <b>testing and quality assurance</b>, creating and executing test cases to validate application changes and newly developed features</li>
//                     <li>Perform <b>bug resolution</b> and <b>issue troubleshooting</b> to ensure optimal application performance and user experience</li>
//                     <li>Collaborate with cross-functional teams using <b>Agile methodology</b> to deliver high-quality software solutions</li>
//                   </ul>
//                 </div>

//                 {/* Experience 1 */}
//                 <div className="mb-4">
//                   <div className="flex justify-between items-start">
//                     <h3 className="text-base font-semibold text-blue-600">MERN Stack Developer Intern | Digital Rhombus</h3>
//                     <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Feb - Apr 2024</span>
//                   </div>
//                   <ul className="list-disc pl-5 space-y-1 text-sm mt-1">
//                     <li>Developed a <b>financial reporting website</b> with data visualization features</li>
//                     <li>Built <b>Your Handyman</b> web application - a clone of Urban Clap for booking home services</li>
//                     <li>Collaborated with the development team to implement responsive UI designs</li>
//                     <li>Utilized <b>MYSQL for database management</b> and Express.js for RESTful API creation</li>
//                   </ul>
//                 </div>

//                 {/* Experience 2 */}
//                 <div className="mb-4">
//                   <div className="flex justify-between items-start">
//                     <h3 className="text-base font-semibold text-blue-600">Full Stack MERN Developer Intern | Tescom</h3>
//                     <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Jul - Sep 2023</span>
//                   </div>
//                   <ul className="list-disc pl-5 space-y-1 text-sm mt-1">
//                     <li>Developed two web applications: <b>Bharat CXO</b> and <b>TESCOM company website</b></li>
//                     <li>Deployed and managed websites on Ubuntu server</li>
//                     <li>Implemented automation solutions including <b>certificate generation</b>, <b>WhatsApp messaging</b>, and <b>email automation using Pabbly</b></li>
//                     <li><b>Managed all business emails</b> through Zoho Mail</li>
//                   </ul>
//                 </div>
//               </div>
//             </section>
//           </div>
//           <footer className="mt-6 text-center text-xs text-gray-500">
//             Page 1 of 2
//           </footer>
//         </div>

//         {/* Page 2 */}
//         <div ref={page2Ref} className="bg-white shadow-lg p-8 font-sans text-gray-800">
//           {/* Header for page 2 */}
//           <header className="mb-6">
//             <h1 className="text-3xl font-bold text-center text-gray-800 mb-1">GOPAL GUPTA</h1>
//             <p className="text-center text-gray-500 mb-2">MERN Stack Developer | Software Developer - Continued</p>
//             <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-blue-300"></div>
//           </header>

//           <div className="grid grid-cols-1 gap-6">
//             {/* Professional Experience Continued */}
//             <section>
//               <h2 className="text-xl font-bold text-blue-700 mb-3 flex items-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                 </svg>
//                 PROFESSIONAL EXPERIENCE (CONTINUED)
//               </h2>
//               <div className="ml-2 pl-4 border-l-2 border-gray-200">
//                 {/* Experience 3 */}
//                 <div className="mb-4">
//                   <div className="flex justify-between items-start">
//                     <h3 className="text-base font-semibold text-blue-600">MERN Training Program & Internship | DevTown</h3>
//                     <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Jan - Apr 2022</span>
//                   </div>
//                   <ul className="list-disc pl-5 space-y-1 text-sm mt-1">
//                     <li>Completed <b>3 months</b> of intensive MERN stack training</li>
//                     <li>Worked collaboratively with a team of interns to develop a <b>movie booking web application</b></li>
//                     <li>Implemented user authentication, movie listings, seat selection, and booking functionality</li>
//                     <li>Applied agile development methodology for project management</li>
//                   </ul>
//                 </div>
//               </div>
//             </section>

//             {/* Projects Section */}
//             <section>
//               <h2 className="text-xl font-bold text-blue-700 mb-3 flex items-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                 </svg>
//                 PROJECTS
//               </h2>
//               <div className="ml-2 pl-4 border-l-2 border-gray-200">
//                 {/* Project 1 */}
//                 <div className="mb-3">
//                   <div className="flex justify-between items-start">
//                     <h3 className="text-base font-semibold text-blue-600">RandomType</h3>
//                     <a href="https://randomtypee.netlify.app/" className="text-xs text-blue-600 hover:underline">Live Demo</a>
//                   </div>
//                   <p className="text-sm mb-1">A typing speed test application built with the MERN stack that helps users improve their typing speed and accuracy.</p>
//                   <div className="flex flex-wrap gap-1 mt-1">
//                     <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">MongoDB</span>
//                     <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">Express</span>
//                     <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">React</span>
//                     <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">Node.js</span>
//                   </div>
//                 </div>

//                 {/* Your Handyman */}
//                 <div className="mb-3">
//                   <div className="flex justify-between items-start">
//                     <h3 className="text-base font-semibold text-blue-600">Your Handyman</h3>
//                     <a href="https://your-handyman.vercel.app/" className="text-xs text-blue-600 hover:underline">Live Demo</a>
//                   </div>
//                   <p className="text-sm mb-1">Home services platform with Google authentication, Firebase OTP verification, and role-based access control.</p>
//                   <div className="flex flex-wrap gap-1 mt-1">
//                     <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">MERN Stack</span>
//                     <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">Firebase</span>
//                     <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">GCP</span>
//                   </div>
//                 </div>

//                 {/* Financial Reporting */}
//                 <div className="mb-3">
//                   <div className="flex justify-between items-start">
//                     <h3 className="text-base font-semibold text-blue-600">Financial Reporting Website</h3>
//                   </div>
//                   <p className="text-sm mb-1">Interactive data visualization platform with customizable PDF report generation for financial statements.</p>
//                   <div className="flex flex-wrap gap-1 mt-1">
//                     <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">MERN Stack</span>
//                     <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">Chart.js</span>
//                     <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">D3.js</span>
//                   </div>
//                 </div>

//                 {/* BharatCXO */}
//                 <div className="mb-3">
//                   <div className="flex justify-between items-start">
//                     <h3 className="text-base font-semibold text-blue-600">BharatCXO</h3>
//                     <a href="https://bharatcxomernproject.netlify.app/" className="text-xs text-blue-600 hover:underline">Live Demo</a>
//                   </div>
//                   <p className="text-sm mb-1">Platform connecting C-suite executives with membership-based access and event management features.</p>
//                   <div className="flex flex-wrap gap-1 mt-1">
//                     <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">MERN Stack</span>
//                     <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">Zoho Mail API</span>
//                   </div>
//                 </div>

//                 {/* Tescom Business Solution */}
//                 <div className="mb-3">
//                   <div className="flex justify-between items-start">
//                     <h3 className="text-base font-semibold text-blue-600">Tescom Business Solution</h3>
//                     <a href="https://tescom.vercel.app/" className="text-xs text-blue-600 hover:underline">Live Demo</a>
//                   </div>
//                   <p className="text-sm mb-1">Corporate website with automated certificate generation, WhatsApp messaging integration, and vendor portal.</p>
//                   <div className="flex flex-wrap gap-1 mt-1">
//                     <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">MERN Stack</span>
//                     <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">Pabbly Connect</span>
//                   </div>
//                 </div>

//                 {/* Movie Booking */}
//                 <div className="mb-3">
//                   <div className="flex justify-between items-start">
//                     <h3 className="text-base font-semibold text-blue-600">Movie Booking Website</h3>
//                   </div>
//                   <p className="text-sm mb-1">Collaborative project with user authentication, movie listings, and seat selection functionality.</p>
//                   <div className="flex flex-wrap gap-1 mt-1">
//                     <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">MongoDB</span>
//                     <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">Express</span>
//                     <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">React</span>
//                     <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">Node.js</span>
//                   </div>
//                 </div>
//               </div>
//             </section>

//             {/* Additional Skills */}
//             <section>
//               <h2 className="text-xl font-bold text-blue-700 mb-3 flex items-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                 </svg>
//                 ADDITIONAL SKILLS & CERTIFICATIONS
//               </h2>
//               <div className="ml-2 pl-4 border-l-2 border-gray-200">
//                 <div className="grid grid-cols-2 gap-x-4 gap-y-2">
//                   <div className="flex items-center">
//                     <svg className="h-4 w-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//                     </svg>
//                     <span className="text-sm">RESTful API design</span>
//                   </div>
//                   <div className="flex items-center">
//                     <svg className="h-4 w-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//                     </svg>
//                     <span className="text-sm">Quality assurance & testing</span>
//                   </div>
//                   <div className="flex items-center">
//                     <svg className="h-4 w-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//                     </svg>
//                     <span className="text-sm">MERN Stack Certification</span>
//                   </div>
//                 </div>
//               </div>
//             </section>
//           </div>
//           <footer className="mt-6 text-center text-xs text-gray-500">
//             Page 2 of 2
//           </footer>
//         </div>
//       </div>

//       {/* Download Button */}
//       <div className="max-w-4xl mx-auto mt-8 mb-16 flex justify-center">
//         <button
//           onClick={downloadPDF}
//           className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md shadow-md transition-colors flex items-center"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//           </svg>
//           Download Resume as PDF
//         </button>
//       </div>
//     </div>
//   );
// };

// export default App;








































import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const App = () => {
  const page1Ref = useRef(null);
  const page2Ref = useRef(null);

  // Function to generate and download PDF with both pages
  const downloadPDF = async () => {
    if (!page1Ref.current || !page2Ref.current) return;

    // Create a new PDF document with A4 dimensions
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    try {
      // Capture first page with better settings
      const canvas1 = await html2canvas(page1Ref.current, {
        scale: 3, // Higher scale for better quality and alignment
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

      // Add first page to PDF
      pdf.addImage(imgData1, 'PNG', 0, 0, imgWidth1, Math.min(imgHeight1, pageHeight));

      // Add a new page for the second resume page
      pdf.addPage();

      // Capture second page with better settings
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

      // Add second page to PDF
      pdf.addImage(imgData2, 'PNG', 0, 0, imgWidth2, Math.min(imgHeight2, pageHeight));

      // Save the PDF
      pdf.save('gopal_gupta_resume.pdf');
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("There was an error generating the PDF. Please try again.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      {/* Resume Container */}
      <div className="w-full max-w-4xl mx-auto">
        {/* Page 1 */}
        <div ref={page1Ref} className="mb-8 bg-white shadow-lg p-8 font-sans text-gray-800">
          {/* Header with modern styling */}
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
                <a href="https://github.com/gopalgugraduatepta0007" className="text-blue-600 hover:underline">github.com/gopalgugraduatepta0007</a>
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
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
                EDUCATION
              </h2>
              <div className="ml-2 pl-4 border-l-2 border-gray-200">
                <ul className="space-y-2">
                  <li className="text-sm">
                    <span className="font-medium">Currently Pursuing Masters M.Sc.(I.T.)</span> from Mumbai University
                  </li>
                  <li className="text-sm">
                    <span className="font-medium">B.Sc.(I.T.) Graduate</span> from Mumbai University
                  </li>
                  <li className="text-sm">
                    <span className="font-medium">HSC</span> - 74%
                  </li>
                  <li className="text-sm">
                    <span className="font-medium">SSC</span> - 60%
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
                    <p className="text-sm">MongoDB, MYSQL</p>
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
                {/* Current Experience - Carufus Technology */}
                <div className="mb-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-semibold text-blue-600">Software Developer | Carufus Technology</h3>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">May 2024 - Present</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-sm mt-1">
                    <li>Participate in daily <b>Scrum meetings</b> and <b>sprint planning sessions</b> to discuss project progress, challenges, and task prioritization</li>
                    <li>Implement <b>feature enhancements</b> and <b>new feature integration</b> across different application modules using modern development practices</li>
                    <li>Manage and optimize <b>.NET based integrated APIs</b> for seamless communication between frontend and backend systems</li>
                    <li>Handle <b>UAT and PROD deployments</b> through <b>GitHub branches</b> following CI/CD best practices and version control strategies</li>
                    <li>Conduct comprehensive <b>testing and quality assurance</b>, creating and executing test cases to validate application changes and newly developed features</li>
                    <li>Perform <b>bug resolution</b> and <b>issue troubleshooting</b> to ensure optimal application performance and user experience</li>
                    <li>Collaborate with cross-functional teams using <b>Agile methodology</b> to deliver high-quality software solutions</li>
                  </ul>
                </div>

                {/* Experience 1 */}
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

                {/* Experience 2 */}
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
          {/* Header for page 2 */}
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-1">GOPAL GUPTA</h1>
            <p className="text-center text-gray-500 mb-2">MERN Stack Developer | Software Developer - Continued</p>
            <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-blue-300"></div>
          </header>

          <div className="grid grid-cols-1 gap-6">
            {/* Professional Experience Continued */}
            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                PROFESSIONAL EXPERIENCE (CONTINUED)
              </h2>
              <div className="ml-2 pl-4 border-l-2 border-gray-200">
                {/* Experience 3 */}
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

            {/* Projects Section */}
            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                PROJECTS
              </h2>
              <div className="ml-2 pl-4 border-l-2 border-gray-200">
                {/* Project 1 */}
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

                {/* Your Handyman */}
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

                {/* Financial Reporting */}
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

                {/* BharatCXO */}
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

                {/* Tescom Business Solution */}
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

                {/* Movie Booking */}
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

            {/* Additional Skills */}
            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                ADDITIONAL SKILLS & CERTIFICATIONS
              </h2>
              <div className="ml-2 pl-4 border-l-2 border-gray-200">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-sm">CI/CD deployment</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-sm">Responsive web design</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-sm">Agile/Scrum methodology</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-sm">Third-party API integration</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-sm">Version control (Git/GitHub)</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-sm">RESTful API design</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-sm">Quality assurance & testing</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-sm">MERN Stack Certification</span>
                  </div>
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

export default App;