import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";  // useLocation and useNavigate
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./OtpVerification.css";
import {  toast } from 'react-toastify';
import Cookies from 'js-cookie';

const OtpVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const location = useLocation();  // to get the passed state
  const navigate = useNavigate();  //  for navigation

  useEffect(() => {
  
    const userEmail = location.state?.email;
    console.log("Email for OTP verification:", userEmail);
  }, [location]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      
      if (value !== "" && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    fetch(`${import.meta.env.VITE_BACKEND_URL}/users/verify-email`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: location.state?.email,
                  otp: otp.join(''),
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
          

    // navigate("/");
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        <h2>Enter OTP</h2>
        <p className="otp-description">
          Please enter the 6-digit OTP sent to your email ({location.state?.email}).
        </p>
        <form onSubmit={handleSubmit} className="otp-form">
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                className="otp-input"
                autoFocus={index === 0}
              />
            ))}
          </div>
          <button type="submit" className="otp-submit">
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;
