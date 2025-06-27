import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Register.css";  // Ensure this file includes the error class styles
import {  toast } from 'react-toastify';

function Register() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      errors.fullName = "Full Name is required.";
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }

    // Password validation
    if (!formData.password.trim()) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    } else if (!/\d/.test(formData.password) || !/[a-zA-Z]/.test(formData.password)) {
      errors.password = "Password must contain both letters and numbers.";
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/users/signup`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: formData.fullName,
              email: formData.email,
              password: formData.password
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
                  navigate("/otp-verification", {
                    state: { email: formData.email },
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
            .catch(error => console.error('Error:', error)); 
      
    }
  };

  return (
    <div className="register-container">
      <h2 className="form-title">Register</h2>

      {/* Full Name Field */}
      <div className="input-group">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleInputChange}
          required
        />
        {errors.fullName && <p className="error">{errors.fullName}</p>}
      </div>

      {/* Email Field */}
      <div className="input-group">
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        {errors.email && <p className="error">{errors.email}</p>}
      </div>

      {/* Password Field */}
      <div className="input-group password-wrapper">
        <input
          type={passwordVisible ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <button
          type="button"
          className="toggle-password"
          onClick={togglePasswordVisibility}
        >
          {passwordVisible ? <FaEyeSlash /> : <FaEye />}
        </button>
        {errors.password && <p className="error">{errors.password}</p>}
      </div>

      {/* Submit Button */}
      <button type="submit" className="btn" onClick={handleSubmit}>
        Register
      </button>

      {/* Link to Login */}
      <p className="helper-text">
        Already have an account? <Link to="/login" className="link">Login here</Link>
      </p>
    </div>
  );
}

export default Register;
