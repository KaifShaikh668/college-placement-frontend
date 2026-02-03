import React from "react";
import "../../styles/public/About.css";

const About = () => {
  return (
    <div className="about-page">
      {/* ✅ TOP HERO SECTION */}
      <div className="about-hero">
        <div className="about-hero-overlay">
          <div className="container about-hero-content">
            <h1>College Placement Cell</h1>
            <p>
              The Placement Cell of <b>Guru Nanak College</b> works to connect
              students with the best career opportunities by organizing campus
              drives, managing recruitment processes, and guiding students for
              professional growth.
            </p>
          </div>
        </div>
      </div>

      {/* ✅ MAIN CONTENT */}
      <div className="container about-main">
        {/* ✅ SECTION 1 */}
        <div className="about-section">
          <h2>About Placement Cell</h2>
          <p>
            The Training & Placement Cell is a dedicated department of the
            college that supports students in their journey from academics to
            industry. It helps students to explore job opportunities, internships,
            and career guidance through structured placement activities.
          </p>
        </div>

        {/* ✅ SECTION 2 */}
        <div className="about-grid">
          <div className="about-card">
            <h3>🎯 Objectives</h3>
            <ul>
              <li>Provide placement opportunities to eligible students.</li>
              <li>Organize campus recruitment drives and internship programs.</li>
              <li>Develop communication, aptitude, and technical skills.</li>
              <li>Offer career guidance, mentorship, and interview preparation.</li>
            </ul>
          </div>

          <div className="about-card">
            <h3>🏢 Key Activities</h3>
            <ul>
              <li>Company campus drives and recruitment process.</li>
              <li>Workshops on resume building and interview skills.</li>
              <li>Aptitude training and mock interviews.</li>
              <li>Industry interaction sessions and seminars.</li>
            </ul>
          </div>

          <div className="about-card">
            <h3>✅ Benefits</h3>
            <ul>
              <li>Quick access to job drives and notices.</li>
              <li>Students can apply online with one click.</li>
              <li>Admin can manage drives and student records easily.</li>
              <li>Improves transparency and reduces manual work.</li>
            </ul>
          </div>
        </div>

        {/* ✅ HOW THIS PORTAL WORKS */}
        <div className="about-section about-portal">
          <h2>How This Placement Portal Works</h2>

          <div className="portal-steps">
            <div className="step-box">
              <h4>👨‍🎓 Student Side</h4>
              <p>
                Students can register, login, view job drives, apply for
                opportunities, and track applied job status. Students also
                receive important notices and placement updates through the
                notification panel.
              </p>
            </div>

            <div className="step-box">
              <h4>🧑‍💼 Admin Side</h4>
              <p>
                Admin can create and manage job drives, publish notices,
                manage students data, view applications, and monitor overall
                placement statistics through the admin dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* ✅ FINAL MESSAGE */}
        <div className="about-footer-box">
          <h2>Our Vision</h2>
          <p>
            To empower students with industry-ready skills and provide excellent
            career opportunities through systematic training, placement support,
            and professional mentorship.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
