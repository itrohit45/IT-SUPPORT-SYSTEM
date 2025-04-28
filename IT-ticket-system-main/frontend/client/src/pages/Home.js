import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import '../assets/styles/Home.css';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded && decoded.role) setIsLoggedIn(true);
      } catch (err) {
        setIsLoggedIn(false);
      }
    }
  }, []);

  const faqs = [
    {
      question: "How do I submit a ticket?",
      answer: "Log in and click 'New Ticket' from your dashboard. Fill in the issue details and submit."
    },
    {
      question: "Can I track the status of my ticket?",
      answer: "Yes, through your dashboard or email notifications in real-time."
    },
    {
      question: "Is the platform mobile friendly?",
      answer: "Yes! It’s fully responsive and works across all devices."
    },
    {
      question: "What if I forget my password?",
      answer: "Click 'Forgot Password' on the login page and follow the reset instructions."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-card">
          <h1>
            IT Support <span className="highlight">Ticketing System</span>
          </h1>
          <p>
            Effortlessly report, manage, and resolve technical issues through a user-friendly, secure platform.
          </p>
          <div className="hero-cta">
            <Link to="/features" className="btn btn-outline-light btn-lg me-3">Learn More</Link>
            {!isLoggedIn && (
              <Link to="/register" className="btn btn-light btn-lg">Get Started</Link>
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
<section className="how-it-works fade-section fade-delay-1">
  <h2 className="section-title">How It Works</h2>
  <div className="steps-container">
    {[
      {
        title: 'Report an Issue',
        desc: 'Users quickly submit tickets via an easy-to-use form capturing essential details.'
      },
      {
        title: 'Ticket Assignment',
        desc: 'The system routes the issue to the right team member based on category and urgency.'
      },
      {
        title: 'Resolution Tracking',
        desc: 'Users and admins can track ticket progress, communicate, and mark issues resolved.'
      }
    ].map((step, index) => (
      <div className="step" key={index}>
        <div className="step-content">
          <h3>{step.title}</h3>
          <p>{step.desc}</p>
        </div>
      </div>
    ))}
  </div>
</section>

{/* TEAM SECTION */}
<section className="team-section fade-section fade-delay-2">
  <h2 className="team-title">Meet Our Team</h2>
  <div className="team-grid">
    <div className="team-card">
      <img src="https://static.vecteezy.com/system/resources/previews/045/092/763/non_2x/successful-professional-business-man-with-crossed-arms-flat-illustration-on-white-background-free-vector.jpg" alt="Rahul Chaudhary" />
      <h3>Rahul Chaudhary</h3>
      <div className="role">Head of Department</div>
      <p>Experienced IT professional with over 5 years of experience in technical support operations.</p>
    </div>
    <div className="team-card">
      <img src="https://i.pinimg.com/474x/4c/81/73/4c81736c87e5ed7e5274467a2d51ea19.jpg" alt="Jane Doe" />
      <h3>Cristina Doe</h3>
      <div className="role">Senior Engineer</div>
      <p>Specialist in troubleshooting and software lifecycle support with 7+ years in the industry.</p>
    </div>
  </div>
</section>

{/* METRICS */}
<section className="metrics-section fade-section fade-delay-3">
  <h2>Global Impact</h2>
  <div className="metrics-container">
    <div className="metric-box"><h3>10,000+</h3><p>Tickets Resolved</p></div>
    <div className="metric-box"><h3>50+</h3><p>Countries Served</p></div>
    <div className="metric-box"><h3>99.9%</h3><p>Uptime</p></div>
    <div className="metric-box"><h3>95%</h3><p>Satisfaction Rate</p></div>
  </div>
</section>

{/* SECURITY */}
<section className="security-section">
  <h2 className="section-title">Security & Privacy</h2>
  <div className="security-cards">
    <div className="security-card">
      <h4>End-to-End Encryption</h4>
      <p>All data is encrypted both in transit and at rest using industry standards.</p>
    </div>
    <div className="security-card">
      <h4>GDPR Compliance</h4>
      <p>We are fully compliant with GDPR and other global data protection regulations.</p>
    </div>
    <div className="security-card">
      <h4>Access Control</h4>
      <p>Role-based access and authentication keep your data secure from unauthorized users.</p>
    </div>
  </div>
</section>


{/* FAQ */}
<section className="faq-section fade-section fade-delay-1">
  <h2 className="section-title">Frequently Asked Questions</h2>
  {faqs.map((faq, index) => (
    <div className="faq-item" key={index}>
      <div className="faq-question" onClick={() => toggleFAQ(index)}>
        <h4>{faq.question}</h4>
        <span className="faq-icon">
          {activeFAQ === index ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </div>
      {activeFAQ === index && <p className="faq-answer">{faq.answer}</p>}
    </div>
  ))}
</section>

{/* TESTIMONIALS */}
<section className="testimonials-section fade-section fade-delay-2">
  <h2 className="section-title">What Our Users Say</h2>
  <div className="testimonial">“This system transformed our support efficiency — it's intuitive, fast, and incredibly secure!” <br /><strong>– IT Admin, TechCorp</strong></div>
  <div className="testimonial">“I can track every step of an issue's resolution. Best IT tool we’ve adopted!” <br /><strong>– Department Lead, EduSmart</strong></div>
  <div className="testimonial">“Their support team is always ready, professional, and effective. We've reduced our average response time by 40%.” <br /><strong>– CIO, MedLink Systems</strong></div>
</section>

{/* CTA */}
{!isLoggedIn && (
  <section className="cta-section fade-section fade-delay-3">
    <h2>Ready to Get Started?</h2>
    <p>Join thousands who trust our ticketing system. Easy setup, powerful features, top-tier support.</p>
    <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
  </section>
)}

    </div>
  );
};

export default Home;
