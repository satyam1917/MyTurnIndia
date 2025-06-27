import React from 'react';
import './Policy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-container">
        <div className="privacy-set">
      <div className="privacy-header">
        <h1>Privacy Policy</h1>
      </div>
      <div className="privacy-content">
        <div className="privacy-section">
          <h2>1. Introduction</h2>
          <p>
            This Privacy Policy explains how MyTurnIndia ("Platform"), owned by Akashu Career Pvt Ltd ("Company," "we," "our," or "us"), collects, uses, and protects your information.
          </p>
        </div>
        <div className="privacy-section">
          <h2>2. Information We Collect</h2>
          <ul>
            <li>Personal Information: Name, email, phone number, and other registration details.</li>
            <li>Usage Data: IP address, browser type, and interaction with the Platform.</li>
            <li>Payment Information: Billing details for paid services.</li>
          </ul>
        </div>
        <div className="privacy-section">
          <h2>3. How We Use Your Information</h2>
          <ul>
            <li>Provide and improve our services.</li>
            <li>Personalize your experience on the Platform.</li>
            <li>Communicate updates, offers, and promotional materials.</li>
            <li>Ensure security and prevent fraud.</li>
          </ul>
        </div>
        <div className="privacy-section">
          <h2>4. Sharing Your Information</h2>
          <p>
            We do not sell or rent your personal information. However, we may share your data with:
            <ul>
              <li>Trusted third-party service providers for operational purposes.</li>
              <li>Legal authorities if required by law.</li>
            </ul>
          </p>
        </div>
        <div className="privacy-section">
          <h2>5. Data Security</h2>
          <p>
            We implement industry-standard measures to protect your data. However, no system is completely secure, and we cannot guarantee absolute security.
          </p>
        </div>
        <div className="privacy-section">
          <h2>6. Cookies and Tracking</h2>
          <p>
            We use cookies to enhance your experience. You can manage your cookie preferences through your browser settings.
          </p>
        </div>
        <div className="privacy-section">
          <h2>7. Third-Party Links</h2>
          <p>
            Our Platform may contain links to third-party websites. We are not responsible for their privacy practices.
          </p>
        </div>
        <div className="privacy-section">
          <h2>8. Your Rights</h2>
          <ul>
            <li>Access, update, or delete your personal information.</li>
            <li>Opt-out of marketing communications.</li>
            <li>Request data portability.</li>
          </ul>
        </div>
        <div className="privacy-section">
          <h2>9. Changes to Privacy Policy</h2>
          <p>
            We may update this Privacy Policy periodically. Changes will be notified on the Platform.
          </p>
        </div>
        <div className="privacy-section">
          <h2>10. Contact Us</h2>
          <p>
            For any questions or concerns, contact us at <a href="mailto:privacy@myturnindia.com">privacy@myturnindia.com</a>.
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
