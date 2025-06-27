import React from 'react';
import './Terms.css';

const TermsAndConditions = () => {
  return (
    <div className="terms-container">
        <div className='terms-set'>
      <header className="terms-header">
        <h1>Terms and Conditions</h1>
      </header>
      <div className="terms-content">
        <section className="terms-section">
          <h2>1. Introduction</h2>
          <p>
            Welcome to MyTurnIndia ("Platform"), owned and operated by Akashu Career Pvt Ltd ("Company," "we," "our," or "us").
            By accessing or using our Platform, you agree to comply with and be bound by the following Terms and Conditions ("Terms").
            If you do not agree to these Terms, please do not use the Platform.
          </p>
        </section>
        
        <section className="terms-section">
          <h2>2. Services Provided</h2>
          <ul>
            <li>Skilling and training programs for job readiness.</li>
            <li>Resume building and optimization.</li>
            <li>Webinars conducted by industry experts.</li>
            <li>Career roadmaps and guidance.</li>
            <li>Networking opportunities and professional connections.</li>
          </ul>
        </section>
        
        <section className="terms-section">
          <h2>3. User Eligibility</h2>
          <p>
            To use our Platform, you must:
            <ul>
              <li>Be at least 18 years old or have parental/guardian consent.</li>
              <li>Provide accurate and truthful information during registration.</li>
              <li>Agree to use the Platform for lawful purposes only.</li>
            </ul>
          </p>
        </section>

        <section className="terms-section">
          <h2>4. Account Registration and Security</h2>
          <p>
            Users are required to create an account to access certain features of the Platform. You are responsible for maintaining
            the confidentiality of your account credentials. Notify us immediately if you suspect unauthorized use of your account.
          </p>
        </section>

        <section className="terms-section">
          <h2>5. Payment and Refund Policy</h2>
          <p>
            Certain services on the Platform may require payment. Fees will be clearly communicated before purchase. Payments are
            non-refundable unless explicitly stated or required by law.
          </p>
        </section>

        <section className="terms-section">
          <h2>6. User Conduct</h2>
          <p>
            By using our Platform, you agree not to:
            <ul>
              <li>Post or share false, misleading, or inappropriate content.</li>
              <li>Engage in activities that harm the Platform or its users.</li>
              <li>Violate any applicable laws or regulations.</li>
            </ul>
          </p>
        </section>

        <section className="terms-section">
          <h2>7. Intellectual Property</h2>
          <p>
            All content, including text, graphics, logos, and software, is the property of Akashu Career Pvt Ltd or its licensors.
            You may not copy, modify, distribute, or exploit our content without prior written consent.
          </p>
        </section>

        <section className="terms-section">
          <h2>8. Limitation of Liability</h2>
          <p>
            We are not liable for:
            <ul>
              <li>Any direct, indirect, or consequential damages arising from the use of our Platform.</li>
              <li>Any issues arising from third-party services or content.</li>
            </ul>
          </p>
        </section>

        <section className="terms-section">
          <h2>9. Termination</h2>
          <p>
            We reserve the right to terminate or suspend your access to the Platform for violations of these Terms or other misconduct.
          </p>
        </section>

        <section className="terms-section">
          <h2>10. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of the Platform after updates constitutes acceptance of the
            revised Terms.
          </p>
        </section>

        <section className="terms-section">
          <h2>11. Governing Law</h2>
          <p>
            These Terms are governed by the laws of India. Any disputes will be resolved in the courts of [City, State].
          </p>
        </section>

        <section className="terms-section">
          <h2>12. Contact Us</h2>
          <p>
            For any questions or concerns, contact us at <a href="mailto:support@myturnindia.com">support@myturnindia.com</a>.
          </p>
        </section>
      </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
