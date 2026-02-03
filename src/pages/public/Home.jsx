import React, { useEffect, useState } from "react";
import "../../styles/public/Home.css";
import logo from "../../assets/images/logo.png";
import hero from "../../assets/images/hero.png";

const Home = () => {
  const [activePage, setActivePage] = useState("home");

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ✅ when opening departments via dropdown, scroll to the selected faculty
  useEffect(() => {
    if (activePage.startsWith("dept-")) {
      const id = activePage.replace("dept-", "");
      setActivePage("departments");
      setTimeout(() => scrollToSection(id), 150);
    }
    // eslint-disable-next-line
  }, [activePage]);

  return (
    <div className="home-wrapper">
      {/* ===== TOP HEADER ===== */}
      <div className="top-header">
        <div className="container header-flex">
          <div className="header-left">
            <img src={logo} alt="College Logo" className="college-logo" />
            <div>
              <p className="mini-title">Guru Nanak Vidyak Society's</p>
              <h3 className="college-title">GURU NANAK COLLEGE</h3>
              <p className="sub-title">of Arts, Science & Commerce</p>
              <p className="tagline">Autonomous | NAAC A+ | CGPA 3.35</p>
            </div>
          </div>

          <div className="header-right">
            <p>NAAC Accredited ‘A’ Grade</p>
            <p>CGPA: 3.35 out of 4</p>
          </div>
        </div>
      </div>

      {/* ===== NAVBAR ===== */}
      <nav className="main-navbar">
        <div className="container">
          <ul className="nav-list">
            <li>
              <button
                className={`nav-btn ${activePage === "home" ? "active" : ""}`}
                onClick={() => setActivePage("home")}
              >
                Home
              </button>
            </li>

            <li>
              <button
                className={`nav-btn ${activePage === "about" ? "active" : ""}`}
                onClick={() => setActivePage("about")}
              >
                About Us
              </button>
            </li>

            {/* ✅ Departments Dropdown */}
            <li className="dropdown">
              <button
                className={`nav-btn dropdown-toggle ${
                  activePage === "departments" ? "active" : ""
                }`}
                onClick={() => setActivePage("departments")}
              >
                Departments <span className="arrow">▼</span>
              </button>

              <div className="dropdown-menu">
                <button onClick={() => setActivePage("dept-science")}>
                  Faculty Of Science
                </button>
                <button onClick={() => setActivePage("dept-arts")}>
                  Faculty Of Arts
                </button>
                <button onClick={() => setActivePage("dept-commerce")}>
                  Faculty Of Commerce
                </button>
              </div>
            </li>

            {/* ✅ PLACED STUDENTS PAGE */}
            <li>
              <button
                className={`nav-btn ${activePage === "placed" ? "active" : ""}`}
                onClick={() => setActivePage("placed")}
              >
                Placed Students
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* ✅ ================= HOME VIEW ================= */}
      {activePage === "home" && (
        <>
          <div
            className="hero-section"
            style={{ backgroundImage: `url(${hero})` }}
          >
            <div className="hero-overlay">
              <div className="container hero-content">
                <h1>
                  Welcome to <span>College Placement Cell</span>
                </h1>
                <h2>Guru Nanak College</h2>

                <p>
                  A centralized placement portal for students and administrators
                  to manage job drives, applications, and notices efficiently.
                </p>

                <div className="hero-buttons">
                  <a href="/login/student" className="btn-light">
                    Student Login
                  </a>
                  <a href="/admin/login" className="btn-outline">
                    Admin Login
                  </a>
                </div>
              </div>
            </div>
          </div>

          <footer className="home-footer">
            © {new Date().getFullYear()} Guru Nanak College Of Arts, Science &
            Commerce | Placement Cell
          </footer>
        </>
      )}

      {/* ✅ ================= ABOUT VIEW ================= */}
      {activePage === "about" && (
        <>
          <section className="about-fullpage">
            <div className="container about-wrap">
              {/* TOP TITLE */}
              <div className="about-top">
                <h1>About Placement Cell</h1>
                <p>
                  The <b>Training & Placement Cell</b> of{" "}
                  <b>Guru Nanak College</b> acts as a bridge between students and
                  the corporate world. It supports students in getting placement
                  opportunities by organizing campus recruitment drives, skill
                  development programs, and career guidance activities.
                </p>
              </div>

              {/* INFO CARDS */}
              <div className="about-grid-3">
                <div className="about-info-card">
                  <h3>🎯 Mission</h3>
                  <p>
                    To enhance employability by providing students with
                    placement opportunities, internship support, training, and
                    career guidance.
                  </p>
                </div>

                <div className="about-info-card">
                  <h3>👁 Vision</h3>
                  <p>
                    To develop industry-ready graduates with strong technical
                    skills, communication ability, and professional confidence.
                  </p>
                </div>

                <div className="about-info-card">
                  <h3>✅ Benefits</h3>
                  <p>
                    Students can explore job drives, apply online, receive
                    notices, and track their applications easily through the
                    placement portal.
                  </p>
                </div>
              </div>

              {/* OBJECTIVES + ACTIVITIES */}
              <div className="about-grid-2">
                <div className="about-panel">
                  <h2>📌 Objectives</h2>
                  <ul>
                    <li>
                      Provide maximum placement opportunities to eligible
                      students.
                    </li>
                    <li>Organize campus drives and connect with recruiters.</li>
                    <li>
                      Conduct aptitude, technical and soft-skill training
                      sessions.
                    </li>
                    <li>
                      Guide students for resume building and interview
                      preparation.
                    </li>
                    <li>
                      Encourage internships, projects and industry exposure.
                    </li>
                  </ul>
                </div>

                <div className="about-panel">
                  <h2>🏢 Key Activities</h2>
                  <ul>
                    <li>Campus recruitment drives and interviews.</li>
                    <li>Career guidance seminars and expert sessions.</li>
                    <li>Mock interviews and group discussions.</li>
                    <li>
                      Workshops on communication & personality development.
                    </li>
                    <li>Placement notices & job updates for students.</li>
                  </ul>
                </div>
              </div>

              {/* HOW PORTAL WORKS */}
              <div className="about-portal-box">
                <h2>💻 How Our Placement Portal Works</h2>
                <p>
                  This Placement Portal is a centralized web platform that helps
                  students manage placement activities digitally and stay updated
                  with drives and notices.
                </p>

                <div className="portal-flow">
                  <div className="flow-card">
                    <h4>👨‍🎓 Student Flow</h4>
                    <p>
                      Register/Login → View job drives → Apply online → Track
                      applied jobs → Receive notifications and updates.
                    </p>
                  </div>
                </div>
              </div>

              {/* FINAL MESSAGE */}
              <div className="about-footer-note">
                <h2>🌟 Our Commitment</h2>
                <p>
                  The Placement Cell is committed to improving student career
                  opportunities by providing guidance, training, and connecting
                  them to top recruiting companies.
                </p>
              </div>
            </div>
          </section>

          <footer className="home-footer">
            © {new Date().getFullYear()} Guru Nanak College Of Arts, Science &
            Commerce | Placement Cell
          </footer>
        </>
      )}

      {/* ✅ ================= DEPARTMENTS VIEW ================= */}
      {activePage === "departments" && (
        <>
          <section className="dept-fullpage">
            <div className="container dept-wrap">
              {/* TOP HEADING */}
              <div className="dept-top">
                <h1>Departments</h1>
                <p>
                  Guru Nanak College offers a wide range of academic programs
                  across Science, Arts, and Commerce faculties. These departments
                  help students build knowledge, develop skills, and prepare for
                  placement opportunities through training and career support.
                </p>
              </div>

              {/* FACULTY QUICK OVERVIEW */}
              <div className="dept-overview-grid">
                <div className="dept-overview-card">
                  <h3>🔬 Faculty of Science</h3>
                  <p>
                    Focuses on technical learning, analytical thinking, practical
                    labs, and research-based knowledge.
                  </p>
                  <button
                    className="dept-view-btn"
                    onClick={() => scrollToSection("science")}
                  >
                    View Details
                  </button>
                </div>

                <div className="dept-overview-card">
                  <h3>🎨 Faculty of Arts</h3>
                  <p>
                    Enhances communication, humanities understanding, creativity,
                    and professional personality development.
                  </p>
                  <button
                    className="dept-view-btn"
                    onClick={() => scrollToSection("arts")}
                  >
                    View Details
                  </button>
                </div>

                <div className="dept-overview-card">
                  <h3>📊 Faculty of Commerce</h3>
                  <p>
                    Builds strong foundation in business studies, accounting,
                    finance, and management for corporate careers.
                  </p>
                  <button
                    className="dept-view-btn"
                    onClick={() => scrollToSection("commerce")}
                  >
                    View Details
                  </button>
                </div>
              </div>

              {/* ✅ SCIENCE DETAILS */}
              <div className="faculty-section" id="science">
                <h2>🔬 Faculty of Science</h2>
                <p className="faculty-desc">
                  The Faculty of Science provides strong academic and practical
                  learning. Students are trained in problem solving, programming,
                  lab skills, and research methods which help them in placements
                  and higher studies.
                </p>

                <div className="faculty-grid">
                  <div className="faculty-card">
                    <h4>📚 Programs Offered</h4>
                    <ul>
                      <li>B.Sc Computer Science</li>
                      <li>B.Sc Information Technology</li>
                      <li>B.Sc Biotechnology</li>
                      <li>B.Sc Physics / Chemistry / Mathematics</li>
                    </ul>
                  </div>

                  <div className="faculty-card">
                    <h4>🛠 Skills Focus</h4>
                    <ul>
                      <li>Programming & Web Development</li>
                      <li>Database & Logical Thinking</li>
                      <li>Research & Laboratory Practice</li>
                      <li>Problem Solving & Technical Skills</li>
                    </ul>
                  </div>

                  <div className="faculty-card">
                    <h4>💼 Career Opportunities</h4>
                    <ul>
                      <li>Software Developer</li>
                      <li>Data Analyst</li>
                      <li>IT Support Engineer</li>
                      <li>Research / Higher Studies</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* ✅ ARTS DETAILS */}
              <div className="faculty-section" id="arts">
                <h2>🎨 Faculty of Arts</h2>
                <p className="faculty-desc">
                  The Faculty of Arts focuses on personality development, strong
                  communication skills, humanities knowledge and professional
                  growth. It supports careers in teaching, HR, media and creative
                  industries.
                </p>

                <div className="faculty-grid">
                  <div className="faculty-card">
                    <h4>📚 Programs Offered</h4>
                    <ul>
                      <li>B.A English</li>
                      <li>B.A Psychology</li>
                      <li>B.A Sociology</li>
                      <li>B.A Political Science / History</li>
                    </ul>
                  </div>

                  <div className="faculty-card">
                    <h4>🛠 Skills Focus</h4>
                    <ul>
                      <li>Communication & Soft Skills</li>
                      <li>Critical Thinking & Presentation</li>
                      <li>Creativity & Professional Writing</li>
                      <li>Personality Development</li>
                    </ul>
                  </div>

                  <div className="faculty-card">
                    <h4>💼 Career Opportunities</h4>
                    <ul>
                      <li>Content Writer</li>
                      <li>HR Executive</li>
                      <li>Teacher / Lecturer</li>
                      <li>Media & Public Relations</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* ✅ COMMERCE DETAILS */}
              <div className="faculty-section" id="commerce">
                <h2>📊 Faculty of Commerce</h2>
                <p className="faculty-desc">
                  The Faculty of Commerce prepares students for business and
                  corporate careers. Students gain strong knowledge in accounts,
                  taxation, finance, management and business analytics.
                </p>

                <div className="faculty-grid">
                  <div className="faculty-card">
                    <h4>📚 Programs Offered</h4>
                    <ul>
                      <li>B.Com</li>
                      <li>B.Com (Accounting & Finance)</li>
                      <li>BMS (Management Studies)</li>
                      <li>BBA (Business Administration)</li>
                    </ul>
                  </div>

                  <div className="faculty-card">
                    <h4>🛠 Skills Focus</h4>
                    <ul>
                      <li>Accounting & Financial Analysis</li>
                      <li>Taxation & Business Laws</li>
                      <li>Corporate Management Skills</li>
                      <li>Business Communication</li>
                    </ul>
                  </div>

                  <div className="faculty-card">
                    <h4>💼 Career Opportunities</h4>
                    <ul>
                      <li>Accountant</li>
                      <li>Business Analyst</li>
                      <li>Banking & Finance Executive</li>
                      <li>Sales & Marketing Roles</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* ✅ FINAL MESSAGE */}
              <div className="dept-footer-note">
                <h2>✅ Department Support for Placements</h2>
                <p>
                  Each faculty department supports students by providing
                  training, workshops, internships and placement preparation
                  programs, helping them become industry-ready and confident for
                  recruitment.
                </p>
              </div>
            </div>
          </section>

          <footer className="home-footer">
            © {new Date().getFullYear()} Guru Nanak College Of Arts, Science and
            Commerce | Placement Cell
          </footer>
        </>
      )}

      {/* ✅ ================= PLACED STUDENTS VIEW ================= */}
      {activePage === "placed" && (
        <>
          <section className="placed-fullpage">
            <div className="container placed-wrap">
              <div className="placed-top">
                <h1>Students Who Got Placed</h1>
                <p>
                  Below is a demo list of students who got placed through the
                  Placement Cell. This includes the year of placement,
                  department, and company.
                </p>
              </div>

              <div className="placed-table-box">
                <table className="placed-table">
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Student Name</th>
                      <th>Department</th>
                      <th>Company</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2026</td>
                      <td>Kaif Shaikh</td>
                      <td>B.Sc IT</td>
                      <td>TCS</td>
                    </tr>
                    <tr>
                      <td>2026</td>
                      <td>Ayesha Khan</td>
                      <td>B.Sc Computer Science</td>
                      <td>Infosys</td>
                    </tr>
                    <tr>
                      <td>2025</td>
                      <td>Rahul Patil</td>
                      <td>B.Com</td>
                      <td>Wipro</td>
                    </tr>
                    <tr>
                      <td>2025</td>
                      <td>Sneha Joshi</td>
                      <td>BMS</td>
                      <td>HDFC Bank</td>
                    </tr>
                    <tr>
                      <td>2024</td>
                      <td>Arjun Sharma</td>
                      <td>B.A English</td>
                      <td>Capgemini</td>
                    </tr>
                    <tr>
                      <td>2024</td>
                      <td>Neha Verma</td>
                      <td>B.Sc Biotechnology</td>
                      <td>Cipla</td>
                    </tr>
                    <tr>
                      <td>2023</td>
                      <td>Sameer Kulkarni</td>
                      <td>B.Sc Physics</td>
                      <td>Larsen & Toubro</td>
                    </tr>
                    <tr>
                      <td>2023</td>
                      <td>Priya Singh</td>
                      <td>B.Com (A&F)</td>
                      <td>Deloitte</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <footer className="home-footer">
            © {new Date().getFullYear()} Guru Nanak College Of Arts, Science &
            Commerce | Placement Cell
          </footer>
        </>
      )}
    </div>
  );
};

export default Home;
