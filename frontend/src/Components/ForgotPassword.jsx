import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // For password visibility toggle
import "./ForgotPassword.css"; // CSS for styling
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // Step 1 - Email, Step 2 - OTP, Step 3 - New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // For toggling password visibility

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user email if passed from the Register page
    const userEmail = location.state?.email;
    console.log("Email for OTP verification:", userEmail);
  }, [location]);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Simulate email validation and OTP sending
    if (email) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/users/reset-password-email-verification`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email
            }),
          })
            .then(response => response.json())
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
                  setStep(2);
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
            .catch(error => console.error('Error:', error));

       // Move to OTP step
    } else {
      setError("Please enter a valid email.");
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus on next input
      if (value !== "" && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    fetch(`${import.meta.env.VITE_BACKEND_URL}/users/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        otp: otpString,
        password: "$$%@$$@&*"
      }),
    })
      .then(response => response.json())
      .then(data => {
        if(data.success){
          toast.success("OTP verified successfully", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
            setStep(3);
          
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
      .catch(error => console.error('Error:', error));
    
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      const otpString = otp.join("");
    fetch(`${import.meta.env.VITE_BACKEND_URL}/users/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        otp: otpString,
        password: password
      }),
    })
      .then(response => response.json())
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
            Cookies.set('token', data.token, { expires: 365, secure: true, sameSite: 'Strict' });
            window.location.assign(`${import.meta.env.VITE_FRONTEND_URL}`);
          
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
      .catch(error => console.error('Error:', error));
      
    } else {
      setError("Passwords do not match.");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>{step === 1 ? "Forgot Password" : step === 2 ? "Enter OTP" : "Set New Password"}</h2>

        {/* Step 1 - Email input */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="email-form">
            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <button type="submit" className="btn">
              Submit
            </button>
            {error && <p className="error-text">{error}</p>}
          </form>
        )}

        {/* Step 2 - OTP input */}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="otp-form">
            <p className="otp-description">
              Please enter the 6-digit OTP sent to your email ({email}).
            </p>
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  className="otp-input"
                  autoFocus={index === 0}
                />
              ))}
            </div>
            <button type="submit" className="btn">
              Verify OTP
            </button>
            {error && <p className="error-text">{error}</p>}
          </form>
        )}

        {/* Step 3 - Password reset */}
        {step === 3 && (
          <form onSubmit={handlePasswordReset} className="password-reset-form">
            <div className="input-group">
              <input
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
              <span onClick={togglePasswordVisibility} className="password-toggle-icon">
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="input-group">
              <input
                type={passwordVisible ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
              />
            </div>
            <button type="submit" className="btn">
              Reset Password
            </button>
            {error && <p className="error-text">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
