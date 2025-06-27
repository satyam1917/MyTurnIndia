import React, { useEffect, useState } from "react";
import { FaRocket, FaUser } from "react-icons/fa";
import axios from "axios";
import "./AboutUs.css";
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const [aboutData, setAboutData] = useState(null);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };
  // Fetch data from backend
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/resource/`);
        setAboutData(response.data.resources[0]); // Assuming the first resource contains the data
      } catch (error) {
        console.error("Error fetching About Us data:", error);
      }
    };

    fetchAboutData();
  }, []);

  if (!aboutData) {
    return <p>Loading...</p>; // Optionally, add a loader
  }

  return (
    <section className="about-us">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="highlight">My Turn India</span>
          </h1>
          <p className="hero-subtitle">
            Empower your learning journey with cutting-edge courses and
            practical knowledge. Let's build your future together.
          </p>
          <div className="cta-buttons">
          <button
        className="cta-button primary"
        onClick={() => handleNavigation('/')}
      >
        <FaRocket className="button-icon" /> Get Started
      </button>
      <button
        className="cta-button secondary"
        onClick={() => handleNavigation('/contact-us')}
      >
        <FaUser className="button-icon" /> Contact Us
      </button>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="https://via.placeholder.com/500"
            alt="Learning Illustration"
            className="fade-in"
          />
        </div>
      </div>

      {/* About Section */}
      <div className="container">
        <div className="about-intro fade-in">
          <h2 className="section-title">Who We Are</h2>
          <p className="about-text">{aboutData.whoWeAre}</p>
        </div>

        {/* Founders Section */}
        <div className="founders-section">
          <h2 className="section-title">Meet Our Team</h2>
          <div className="founders-grid">
            {aboutData.teams.map((teamMember) => (
              <div key={teamMember._id} className="founder-card">
                <img
                  src={import.meta.env.VITE_BACKEND_URL + "/images/" + teamMember.imageUrl}
                  alt={teamMember.name}
                  className="founder-photo"
                />
                <div className="founder-info">
                  <h3 className="founder-name">{teamMember.name}</h3>
                  <p className="founder-role">{teamMember.position}</p>
                  <p className="founder-bio">{teamMember.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
