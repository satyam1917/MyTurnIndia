import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import "./ContactUs.css";
import { ToastContainer, toast } from 'react-toastify';

const ContactUs = ({ theme }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [contactInfo, setContactInfo] = useState(null); // State for contact info
  const navigate = useNavigate();

  // Fetch data from backend
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/resource/`);
        const data = await response.json();
        if (data.status && data.resources.length > 0) {
          setContactInfo(data.resources[0]); // Assuming you want the first resource
        }
      } catch (error) {
        console.error("Failed to fetch contact info:", error);
      }
    };

    fetchContactInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_BACKEND_URL}/users/send-email`,
       { method: "POST", headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({formData}) })
        .then(res => res.json())
        .then(data => {
          if(data.success){
            toast.success(data.message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            setFormData({
              name: "",
              email: "",
              message: "",
            });
          }
          else{
            toast.error(data.message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          }
        })
    // Handle form submission logic here
  };

  const handleGetStarted = () => {
    navigate("/"); // Redirect to the homepage
  };

  return (
    <section className={`contact-us ${theme}`}>
      {/* Contact Information */}
      {contactInfo && (
        <div className="contact-info">
          <h2 className="section-title">Contact Information</h2>
          <p>{contactInfo.whoWeAre}</p>
          <ul>
            <li>
              <strong>Email:</strong> {contactInfo.email}
            </li>
            <li>
              <strong>Phone:</strong> {contactInfo.mobile}
            </li>

          </ul>
          <div className="social-icons">
            <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href={contactInfo.twitter} target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
            <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
          </div>
        </div>
      )}

      {/* Additional Content */}
      <div className="additional-content">
        <h3 className="additional-title">Why myturnindia?</h3>
        <p>
          EduLearn provides top-quality educational resources and courses to empower learners in various fields, including technology, business, and more. Join our platform and take the next step in your educational journey today.
        </p>
        <button className="btn-primary" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>

      {/* Form Section */}
      <div className="form-section">
        <h2 className="section-title">Get In Touch</h2>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="input-group">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="btn-primary">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactUs;
