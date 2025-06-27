import React, { useState, useEffect } from 'react';
import './Footer.css';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import axios from 'axios';

const Footer = ({ theme }) => {
  const [footerData, setFooterData] = useState(null);

  // Fetch data from the backend
  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/resource/`);
        setFooterData(response.data.resources[0]); // Assuming the data is in the first resource
      } catch (error) {
        console.error("Error fetching footer data:", error);
      }
    };

    fetchFooterData();
  }, []);

  if (!footerData) {
    return null; // Optionally, you can show a loader here
  }

  return (
    <footer className={`footer ${theme}`}>
      <div className="footer-content">
        {/* About Us Section */}
        <div className="footer-section about-us">
          <h3>About Us</h3>
          <p>{footerData.whoWeAre}</p>
        </div>

        {/* Our Courses Section */}
        <div className="footer-section courses">
          <h3>Our Courses</h3>
          <ul>
            <li><a href="/tech-courses">Tech Courses</a></li>
            <li><a href="/finance-courses">Finance Courses</a></li>
            <li><a href="/category/placement%20guarantee">Placement Guarantee Courses</a></li>

          </ul>
        </div>

        {/* Contact Us Section */}
        <div className="footer-section contact-us">
          <h3>Contact Us</h3>
          <p>
            Email: <a href={`mailto:${footerData.email}`}>{footerData.email}</a>
          </p>
          <p>
            Phone: <a href={`tel:${footerData.mobile}`}>+91{footerData.mobile}</a>
          </p>
        </div>

        {/* Social Media Section */}
        <div className="footer-section social-media">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href={footerData.instagram} target="_blank" rel="noopener noreferrer">
              <FaInstagram className="icon" />
            </a>
            <a href={footerData.facebook} target="_blank" rel="noopener noreferrer">
              <FaFacebook className="icon" />
            </a>
            <a href={footerData.twitter} target="_blank" rel="noopener noreferrer">
              <FaTwitter className="icon" />
            </a>
            <a href={footerData.linkedin} target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="icon" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="footer-bottom">
       
        <div className="footer-links">
          <a href="/terms">Terms of Service</a>
          <span>|</span>
          <a href="/privacy">Privacy Policy</a>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
