import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page-container">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>Find Your Future</h1>
          <p className="subtitle">
            Your journey to the perfect college and career starts here. We provide the tools and guidance you need to succeed.
          </p>
          <button className="cta-button" onClick={() => navigate('/signup')}>
            Get Started Now
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <h2>How We Help</h2>
        <div className="features-grid">
          <div className="feature-card" onClick={() => navigate('/login')}>
            <div className="feature-icon">🎓</div>
            <h3>For Students</h3>
            <p>Discover colleges, take aptitude tests, and find the right career path based on your skills and preferences.</p>
          </div>

          <div className="feature-card" onClick={() => navigate('/admin/login')}>
            <div className="feature-icon">🏫</div>
            <h3>For Admins</h3>
            <p>Manage college listings, update course details, and oversee student registrations with powerful tools.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3>Personalized Guidance</h3>
            <p>Our platform uses your unique profile to recommend the best-fit colleges and career opportunities for you.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;